# Log and Push — Changelog, commit y push

Actualiza `CHANGELOG.md`, crea un commit convencional y hace push al branch actual.

## Pasos

### 1. Recopilar contexto

Ejecuta en paralelo:

```bash
git status
git diff --staged
git diff
git log --oneline -5
git branch --show-current
```

### 2. Actualizar `CHANGELOG.md`

Si el archivo no existe, créalo con el encabezado `# Changelog`.

Añade una nueva entrada **al principio** (después del heading `# Changelog`) con este formato:

```markdown
## YYYY-MM-DD — Descripción corta (branch: `nombre-branch`)

**Problema / Motivación:** Breve descripción del problema o motivo del cambio.

**Fix / Cambios:**
Explicación concisa de qué se hizo y por qué.

**Archivos modificados:**
- `ruta/al/archivo` — qué cambió en este archivo

---
```

Reglas:
- Usa la fecha de hoy
- Estilo bilingüe: headings en español, contenido mixto
- Lista todos los archivos modificados/añadidos con una nota breve
- Descripción concisa pero completa

### 3. Commit

- Verifica si `CHANGELOG.md` está en `.gitignore` antes de stagearlo:
  - Si NO está ignorado: stagea cambios + `CHANGELOG.md`
  - Si SÍ está ignorado: stagea solo los cambios (el changelog queda actualizado localmente)
- NO stagees `.env`, credenciales ni secrets
- Usa Conventional Commits: `feat:`, `fix:`, `style:`, `refactor:`, `chore:`, etc.
- Mensaje corto (1-2 líneas)
- NO uses `--no-verify`
- NO añadas `Co-Authored-By`

### 4. Push

Invocar `/log-and-push` es confirmación implícita de hacer push al branch actual. Procede directamente:

```bash
git push origin HEAD
```

Si el branch no tiene upstream:

```bash
git push -u origin HEAD
```

### 5. Confirmar al usuario

Muestra:
- La entrada del changelog añadida
- El hash y mensaje del commit
- El resultado del push (éxito/error)

## Importante

- NUNCA hacer force push
- Si hay merge conflicts, detente y pregunta al usuario
- Si los pre-commit hooks fallan, corrige el problema y crea un NUEVO commit (no amends)
