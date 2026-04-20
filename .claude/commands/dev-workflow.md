# Dev Workflow — Guia de desarrollo

Muestra el flujo de trabajo estandar para este proyecto.

## Instrucciones

Presenta la siguiente guia al usuario:

---

### Nuevo Feature (produccion)
1. Si toca 3+ archivos: `/new-spec` primero
2. Identifica servicios afectados (landing/crm/api/mcp)
3. Implementa siguiendo el spec
4. Para CRM: trabaja en `crm/src/components/` (JSX)
5. Para API: crea/modifica en `api/` (JS serverless)
6. Para MCP: modifica `mcp/src/tools/` (TS), rebuild con `cd mcp && npm run build`
7. Para Schema: crea nuevo `supabase-*.sql` en root
8. Actualiza `vercel.json` si hay nuevas rutas
9. `/log-and-push` cuando este listo

### Nuevo MCP Tool
1. Crea archivo en `mcp/src/tools/nombre.ts`
2. Exporta `registerNombreTools(server, supabase)`
3. Registra en `mcp/src/index.ts`
4. Incluye `display_hint` y `view_url` en responses
5. `cd mcp && npm run build`
6. Actualiza `includeFiles` en `vercel.json` si es necesario
7. Testa localmente, luego `/log-and-push`

### Deploy
1. `/log-and-push` (asegura commit limpio)
2. Vercel auto-deploys desde main
3. Usa skill `deploy-to-vercel` o `/status` para verificar

### Debugging comun
- **CRM no muestra datos:** Verifica `org_id` en queries
- **API 404:** Revisa rewrites en `vercel.json`
- **MCP tool falla:** Revisa queries Supabase, verifica columnas NOT NULL
- **Nueva pagina 404:** Agregar como input en `vite.config.js` (MPA)

### Optimizacion de tokens
- Usar Sonnet por default, Opus solo para arquitectura
- `/compact` al 60% de contexto
- `/clear` entre tareas no relacionadas
- Delegar investigacion a subagentes (Explore)
