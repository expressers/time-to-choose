# Time To Choose Prime Transfer

Landing page: transfers do aeroporto, motorista privado, aluguer de viaturas e alojamento de curta duração em Angola.

Stack: Bun, Vite, React, GSAP (ScrollTrigger), Lenis.

```bash
bun install
bun run dev      # http://127.0.0.1:5190
bun run build    # dist/
```

## Conteúdo

- Textos PT/EN: `src/content.js`
- Contactos: `CONTACT` em `src/content.js`. Com `whatsapp` preenchido (ex. `244923000000`), os pedidos de reserva abrem no WhatsApp; vazio, seguem por email.
- Fotografias: `public/img` (`nome.webp` 2400w e `nome-m.webp` 1100w). `scripts/fetch-images.sh` volta a descarregá-las.
- Marca: `public/brand`.

## Deploy

Render, site estático (`render.yaml`).
