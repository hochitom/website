# hochoertler.dev

Persönliche Website von Thomas Hochörtler, Solution Architect bei LEAN-CODERS GmbH.

- `src/index.html` – gesamtes Markup und alle Inhalte
- `src/css/` – Vanilla CSS in `@layer`-Struktur
- `scripts/build.mjs` – Build-Job (HTML- und CSS-Minifizierung, Content-Hash)
- `netlify.toml` – Hosting auf Netlify

```sh
npm install
npm run dev    # lokaler Server auf http://localhost:3000
npm run build  # optimierte Ausgabe in dist/
```
