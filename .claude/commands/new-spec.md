# New Spec — Crear spec de feature

Crea un nuevo archivo de spec en `specs/` usando el template estandar del proyecto.

## Instrucciones

1. Determina el siguiente numero disponible en `specs/` (ej: si existe `004-mcp-tools.md`, el siguiente es `005`)
2. Pide al usuario el nombre del feature si no lo proporcionó
3. Crea el archivo `specs/NNN-nombre-del-feature.md` con el template abajo
4. Presenta el archivo creado al usuario para que lo complete

## Template

```markdown
# SPEC-NNN: [Nombre del Feature]

## Objetivo
<!-- Que se va a construir y por que (2-3 lineas) -->

## Alcance
- **Capas afectadas:** schema / services / mcp tools / app routes
- **Archivos a modificar:**
  - `lib/services/nombre.ts` — descripcion del cambio
  - `lib/mcp/tools/nombre.ts` — descripcion del cambio
  - `supabase/migrations/NNN_nombre.sql` — descripcion del cambio

## Criterios de aceptacion
- WHEN [condicion] THEN [resultado esperado]
- WHEN [condicion] THEN [resultado esperado]

## Edge cases
- Caso 1: <!-- ej: monto en USD cuando la cuenta es MXN -->
- Caso 2: <!-- ej: transaccion en fecha futura -->

## Reglas criticas aplicables
<!-- Marcar cuales reglas inquebrantables de CLAUDE.md aplican a este spec -->
- [ ] Dinero: `numeric(14,2)`, helpers de `money.ts`, `currency` explicita
- [ ] Fechas: `timestamptz`, TZ del usuario, helpers de `dates.ts`
- [ ] Services: reciben `client` como parametro, filtran por `user_id`
- [ ] Tools MCP: wrappers delgados, output `{ ok, data?, error_code?, message_es? }`

## NO incluye
<!-- Que explicitamente queda fuera de este spec -->
-

## Tests requeridos
- Unit: `tests/unit/nombre.test.ts` — casos a cubrir
- Integration: `tests/integration/nombre.test.ts` — flujos end-to-end con DB local

## Decisiones de diseño
<!-- Alternativas consideradas y por que se descartaron -->
| Alternativa | Razon descartada |
|-------------|-----------------|
|             |                 |
```
