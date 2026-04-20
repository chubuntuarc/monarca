# Dev Workflow — Guia de desarrollo

Muestra el flujo de trabajo estandar para este proyecto.

## Instrucciones

Presenta la siguiente guia al usuario:

---

### Nuevo Feature (produccion)
1. Si toca 3+ archivos: `/new-spec` primero → redactar spec en `specs/` antes de tocar codigo
2. Identifica capa afectada: schema / services / mcp tools / app routes
3. **TDD obligatorio en `lib/services/`**: escribe el test primero (Red → Green → Refactor)
4. Para Services: trabaja en `lib/services/` (TS puro, sin Supabase client directo)
5. Para MCP Tools: crea/modifica en `lib/mcp/tools/` (wrapper delgado, sin logica de negocio)
6. Para Schema: crea nueva migration en `supabase/migrations/` con nombre descriptivo
7. Para nuevas rutas API: modifica `app/api/` y verifica que el endpoint `/api/mcp/route.ts` siga siendo el unico punto de entrada MCP
8. Regenera tipos si cambia el schema: `bun db:types`
9. `/log-and-push` cuando este listo (con cobertura >= 85% en `lib/services/`)

### Nuevo MCP Tool
1. Crea archivo en `lib/mcp/tools/nombre.ts`
2. El tool es un wrapper delgado: valida input → llama service → formatea output
3. Output siempre con estructura: `{ ok: boolean, data?, error_code?, message_es?, summary_markdown? }`
4. Incluye `display_hint` y `view_url` en responses donde aplique
5. Registra el tool en `lib/mcp/server.ts`
6. Escribe test de integracion en `tests/integration/`
7. `bun run build` para verificar que compila
8. Testa localmente, luego `/log-and-push`

### Nuevo Schema / Migration
1. Redactar spec o actualizar `specs/001-schema.md` si hay cambio estructural
2. `bun db:migration:new <nombre-descriptivo>`
3. Columnas monetarias: siempre `numeric(14,2)` + columna `currency VARCHAR(3) DEFAULT 'MXN'`
4. Fechas: siempre `TIMESTAMPTZ`, nunca `TIMESTAMP`
5. Toda tabla con datos de usuario: columna `user_id UUID` + `deleted_at TIMESTAMPTZ` (soft delete)
6. `bun db:reset` para aplicar localmente y verificar
7. `bun db:types` para regenerar tipos TypeScript

### Deploy
1. `/log-and-push` (asegura commit limpio y tests pasando)
2. Vercel auto-deploys desde main
3. Usa `/status` para verificar deploy exitoso

### Debugging comun
- **MCP tool falla:** Revisa queries Supabase, verifica columnas NOT NULL, confirma que el service recibe `user_id` correcto
- **Datos de otro usuario visibles:** Service no esta filtrando `.eq('user_id', userId)` — RLS no es suficiente con service role key
- **Calculos de mes incorrectos:** Verificar que se usa TZ del usuario (`America/Chihuahua`), no UTC
- **Error de montos:** Verificar que no hay aritmetica directa sobre strings — usar helpers de `lib/utils/money.ts`
- **Migration no aplica:** Revisar orden de archivos en `supabase/migrations/`, ejecutar `bun db:reset`
- **Types desactualizados:** Ejecutar `bun db:types` despues de cualquier cambio de schema

### Optimizacion de tokens
- Usar Sonnet por default, Opus solo para arquitectura o decisiones de diseño complejas
- `/compact` al 60% de contexto
- `/clear` entre tareas no relacionadas
- Delegar investigacion a subagentes (Explore)
- Para revision de logica financiera: usar subagente `finance-logic-reviewer`
