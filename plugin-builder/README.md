# TheoTown Plugin Builder — local beta

This is an isolated Vue/Vite prototype inside the Yakka Works website repository. It is not wired into MkDocs or the deployment workflow yet.

## Run locally

Requirements: Node.js 20+ and npm.

```sh
cd plugin-builder
npm install
npm run dev
```

Open the local URL printed by Vite (normally http://127.0.0.1:5173).

## Current beta scope

- Guided settings form with category tabs.
- Annotated JSONC starter template.
- Form edits update the source while preserving surrounding comments.
- Optional source view with live parsing.
- JSON export, with export disabled while the source has syntax errors.
- No server, account, remote save, or automatic deployment.

## Important schema note

The included residential template is deliberately illustrative. Its property names are not claimed to match TheoTown's actual plugin format. Replace it with a real, verified plugin configuration before treating exported files as game-ready.

## Annotation directives currently supported

Directives must be contiguous comment lines immediately above a top-level property:

- `@studio.label "Friendly label"`
- `@studio.description "Short help text"`
- `@studio.tab "General"`
- `@studio.type number|boolean|string`
- `@studio.min 0` / `@studio.max 100`
- `@studio.options ["Option A", "Option B"]`

The first beta intentionally keeps metadata parsing small and top-level only. Nested objects, arrays, richer validation, and robust diagnostics are future iterations.