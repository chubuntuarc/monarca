# Token Check — Optimizacion de tokens

Checklist rapido de buenas practicas para reducir consumo de tokens.

## Instrucciones

Presenta el siguiente checklist al usuario y evalua el estado actual de la sesion:

---

### Checklist de optimizacion

**Modelo:**
- [ ] Usar Sonnet por default (no Opus para tareas simples)
- [ ] `/effort low` para tareas triviales
- [ ] Opus solo para arquitectura compleja o planning

**Contexto:**
- [ ] `/compact` si contexto > 60%
- [ ] `/clear` si cambiaste de tarea completamente
- [ ] No releer archivos ya leidos en esta sesion

**Prompts:**
- [ ] Ser especifico: archivo + funcion + linea
- [ ] No pedir "mejora todo el codebase"
- [ ] Usar skills en vez de prompts largos repetidos

**Subagentes:**
- [ ] Delegar investigacion a Explore agents
- [ ] Delegar code review a code-reviewer agent
- [ ] No usar agentes para tareas de 1 paso

**Archivos:**
- [ ] .claudeignore configurado (node_modules, dist, locks)
- [ ] CLAUDE.md bajo 150 lineas
- [ ] MCP servers no usados deshabilitados

**Sesion:**
- [ ] Agrupar tareas relacionadas en una sesion
- [ ] Usar Plan mode para features complejos
- [ ] `/cost` para revisar gasto actual
