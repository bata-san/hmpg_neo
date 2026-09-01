# hmpg_neo

Personal portfolio site for ばたー / butter, deployed as the `about-me` Cloudflare Worker.

## Development

```bash
npm install
npm run dev
```

## Build and deploy

```bash
npm run build
npx wrangler deploy
```

The Vite build output in `dist/` is published as the Worker static assets.
