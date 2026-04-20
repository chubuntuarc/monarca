# Finanzas MCP

## Contexto del proyecto

MCP privado de finanzas personales. **Single-user** (Jesús) en su primera versión. Reemplaza el Sheet de "Libertad Franciscana" como fuente de verdad para finanzas personales, con Claude como única interfaz de usuario.

No hay UI web. No hay onboarding. No hay multi-tenant. El producto es el MCP.

## Objetivo a largo plazo

Eventualmente multi-tenant como producto comercial ("tu contador personal en Claude"), pero esa migración se hace cuando el uso privado esté maduro. Todo el schema ya está pensado multi-tenant (columna `user_id` en todas las tablas) para evitar rework, pero la lógica de auth y onboarding NO se construye todavía.

## Stack

- **Runtime**: Next.js 15 App Router + TypeScript strict mode
- **DB**: Supabase (Postgres 15+ con RLS activo)
- **MCP**: `@modelcontextprotocol/sdk` + adapter Vercel (mismo patrón que Ephective y Black Tiger CRM)
- **Testing**: Vitest para unit + integration. Supabase local vía Docker para integration tests.
- **Linting**: Biome (preferido por velocidad)
- **Package manager**: pnpm
- **Deploy**: Vercel
- **Migrations**: Supabase CLI (`supabase/migrations/*.sql`)

## Estructura de carpetas

```
finanzas-mcp/
├── CLAUDE.md                    ← este archivo
├── specs/                       ← specs SDD (leer antes de implementar)
│   ├── 001-schema.md
│   ├── 002-services-layer.md
│   ├── 003-importer.md
│   ├── 004-mcp-tools.md
│   └── 005-testing-strategy.md
├── supabase/
│   ├── migrations/              ← SQL migrations versionadas
│   ├── seed.sql                 ← datos ficticios para dev
│   └── functions/               ← SQL functions (month_summary, etc.)
├── lib/
│   ├── services/                ← lógica de negocio (pura, testeable)
│   │   ├── accounts.ts
│   │   ├── transactions.ts
│   │   ├── categories.ts
│   │   ├── debts.ts
│   │   ├── budgets.ts
│   │   ├── reports.ts
│   │   ├── analysis.ts
│   │   └── currency.ts
│   ├── mcp/
│   │   ├── tools/               ← wrappers delgados sobre services
│   │   └── server.ts            ← setup del MCP server
│   ├── db/
│   │   ├── client.ts            ← Supabase client factory
│   │   └── types.ts             ← tipos generados desde Supabase
│   └── utils/
│       ├── money.ts             ← helpers de formato y aritmética monetaria
│       ├── dates.ts             ← helpers de fechas con TZ
│       └── errors.ts            ← error types estandarizados
├── app/
│   └── api/
│       ├── health/route.ts      ← healthcheck
│       └── mcp/route.ts         ← único endpoint real
├── scripts/
│   ├── import-from-sheets.ts    ← importador del Sheet actual
│   └── reset-dev-db.ts          ← reset + seed para desarrollo local
├── tests/
│   ├── unit/                    ← tests puros (sin DB)
│   ├── integration/             ← tests con Supabase local
│   └── fixtures/                ← data de prueba reutilizable
├── .env.local.example
├── biome.json
├── vitest.config.ts
├── tsconfig.json
└── package.json
```

## Reglas inquebrantables

Estas reglas no se negocian. Si una implementación las viola, se rehace.

### Dinero

1. **NUNCA float para dinero.** Siempre `numeric(14,2)` en Postgres. En TypeScript: strings cuando vienen de DB, conversión a número solo para operaciones aritméticas controladas en `lib/utils/money.ts`.
1. **Nunca aritmética directa sobre strings monetarios.** Usar helpers de `lib/utils/money.ts` (`addMoney`, `subtractMoney`, `multiplyMoney`). Internamente usan `decimal.js` o similar.
1. **Moneda siempre explícita.** Columna `currency` (ISO 4217, 3 chars) en toda tabla que tenga monto. Default `MXN` pero nunca asumido.
1. **Conversiones con rate histórico.** Nunca convertir con el rate de hoy datos de hace 3 meses. Tabla `exchange_rates` con fecha.

### Fechas y timezones

1. **Siempre `timestamptz` en Postgres.** Nunca `timestamp` sin TZ.
1. **TZ del usuario en `users.timezone`.** Default `America/Chihuahua`. Todos los cálculos "del mes" usan la TZ del usuario, no UTC.
1. **Nunca `new Date()` directo en lógica de negocio.** Usar helpers de `lib/utils/dates.ts` que respetan la TZ del contexto.

### Arquitectura

1. **Services no importan Supabase client directo.** Lo reciben como parámetro (`client: SupabaseClient`). Esto permite inyectar mocks en tests y cambiar de DB sin reescribir lógica.
1. **Services filtran por `user_id` explícitamente.** No dependemos solo de RLS. Si usamos service role key (necesario para MCP), cada query debe incluir `.eq('user_id', userId)` a nivel de service. RLS es segunda capa de defensa, no primera.
1. **Tools MCP son wrappers delgados.** No tienen lógica de negocio. Solo: validar input → llamar service → formatear output.
1. **Output estándar de tools MCP**: `{ ok: boolean, data?: T, error_code?: string, message_es?: string, summary_markdown?: string }`. Errores como datos, no como exceptions.

### Testing

1. **TDD estricto en services layer.** Red → Green → Refactor. No se merge código sin tests.
1. **Cobertura mínima 85% en `lib/services/`.** Medida con Vitest coverage.
1. **Integration tests con Supabase local.** No mocks de DB en integration. Docker obligatorio para desarrollo.
1. **Tests de RLS independientes.** Verificar que usuario A no puede leer datos de usuario B, aunque hoy solo haya un usuario.

### Seguridad

1. **MCP autenticado con token estático** en header `Authorization: Bearer <token>`. Token en env var, nunca en código.
1. **Supabase service role key SOLO en el server.** Nunca exponerla. Client-side no existe en este proyecto pero por si acaso.
1. **Logs no contienen montos ni datos personales.** Logs solo eventos y IDs.

## Workflow de desarrollo

### SDD (Spec-Driven Development)

Antes de implementar cualquier cosa nueva:

1. Si no hay spec, se redacta en `/specs/` y se revisa con Jesús ANTES de tocar código.
1. Specs numerados: `001-schema.md`, `002-services-layer.md`, etc.
1. Specs incluyen: objetivo, decisiones de diseño, alternativas descartadas (con razón), criterios de aceptación, edge cases.

### TDD

1. Escribir test que falle.
1. Implementar mínimo para que pase.
1. Refactor con tests pasando.
1. Commit atómico.

### Commits

- Mensajes en español o inglés, consistente dentro de un PR.
- Formato: `<tipo>(<scope>): <descripción>` — ej: `feat(services): add transaction logging`
- Commits pequeños. Si un commit toca > 5 archivos, probablemente son 2 commits.

### PRs

Template obligatorio:

- [ ] Tests agregados/actualizados
- [ ] Cobertura no bajó
- [ ] Spec actualizada si hubo cambios de diseño
- [ ] `CLAUDE.md` actualizado si hubo cambios estructurales
- [ ] Migration agregada si hubo cambios de schema

## Subagentes configurados

Usar estos subagentes para tareas específicas:

- **`finance-logic-reviewer`**: Revisa cualquier código que toque dinero, fechas, o cálculos financieros. Busca violaciones de reglas 1-7.
- **`code-reviewer`**: Revisa arquitectura general, patterns, duplicación. Reutilizado de Black Tiger.
- **`qa-tester`**: Genera tests adicionales después de implementación. Busca edge cases faltantes.
- **`shopify-api`**: NO aplica a este proyecto.

## Comandos frecuentes

```bash
# Desarrollo
pnpm dev                         # Next.js en modo dev
pnpm test                        # Vitest en watch mode
pnpm test:run                    # Vitest single run (para CI)
pnpm test:coverage               # Con cobertura

# Base de datos
pnpm db:start                    # Levanta Supabase local (Docker)
pnpm db:reset                    # Reset schema + seed
pnpm db:seed                     # Solo seed
pnpm db:types                    # Regenera types de TS desde schema
pnpm db:migration:new <nombre>   # Nueva migration
pnpm db:migration:up             # Aplica migrations pendientes

# Scripts
pnpm import:sheets               # Importa del Sheet actual
pnpm import:sheets -- --dry-run  # Sin escribir a DB

# Lint y format
pnpm lint                        # Biome check
pnpm format                      # Biome format

# Deploy
pnpm build                       # Build de producción
# Deploy automático vía git push a main (Vercel)
```

## Variables de entorno

Ver `.env.local.example`. Críticas:

- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY` (solo server)
- `MCP_AUTH_TOKEN` (token para autenticar requests al MCP)
- `DEFAULT_USER_ID` (en modo privado, UUID del único usuario)
- `DEFAULT_TIMEZONE` (America/Chihuahua)

## Decisiones ya tomadas (no reabrir)

Estas decisiones fueron pensadas y descartar alternativas. No cuestionarlas sin razón fuerte:

- ✅ Supabase (no PlanetScale, no Turso, no DIY Postgres)
- ✅ Next.js App Router (no Hono, no Express, no Fastify — consistencia con otros proyectos)
- ✅ MCP transport: HTTP streamable (mismo que BT y Ephective)
- ✅ Single endpoint `/api/mcp/route.ts`
- ✅ Vitest (no Jest, no Playwright para unit)
- ✅ Biome (no ESLint + Prettier)
- ✅ pnpm (no npm, no yarn)
- ✅ Modelo de transacciones: double-entry ligero con source/destination
- ✅ Categorías como árbol (parent_id)
- ✅ Snapshots mensuales materializados (no calcular en vivo cada vez)
- ✅ Soft deletes con `deleted_at`
- ✅ UUIDs como PK (no bigserial)

## Decisiones pendientes (para abordar cuando toque)

- ⏳ Sistema de recurrencias: ¿cron en Vercel, ¿pg_cron en Supabase, ¿trigger al consultar?
- ⏳ Exportación de reportes: ¿markdown suficiente, ¿necesitamos PDF?
- ⏳ Sistema de alertas: ¿push notifications, ¿email, ¿solo queries reactivas?
- ⏳ Multi-tenant: auth provider, onboarding conversacional, billing

## Contactos y referencias

- **Proyectos relacionados**: Black Tiger CRM (mismo patrón MCP), Ephective (mismo patrón Supabase+RLS), Libertad Franciscana MCP (fuente de datos a importar)
- **Documentación MCP**: https://modelcontextprotocol.io
- **Documentación Supabase**: https://supabase.com/docs

---

*Última actualización: ver git blame. Este archivo se actualiza cuando hay cambios estructurales.*
