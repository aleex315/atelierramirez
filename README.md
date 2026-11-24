# Atelier Ramirez

Web de **Atelier Ramirez**, posticería valenciana en Alaquàs (Valencia): moños, rodetes, trenzas, peinados de fallera y formaciones. Es una web estática: HTML, CSS y JavaScript sin framework, se puede publicar tal cual (GitHub Pages, Netlify, Cloudflare Pages…).

## Estructura

```
index.html              Página única (Inicio, Tienda, Por qué elegirnos, Contacto) + textos legales
assets/
  css/input.css         Estilos fuente (Tailwind v4 + componentes propios). Se edita este.
  css/styles.css        CSS compilado. Se genera con `npm run build`, no editar a mano.
  js/datos.js           Teléfono, reseñas, horarios de citas, productos y precios. ← lo que se suele cambiar
  js/app.js             Lógica: pestañas, calendario de citas, reseñas, tienda y aviso legal
  img/                  Fotos en WebP y logotipos
```

## Cambiar contenido

Casi todo está en `assets/js/datos.js`:

- `TEL`: número de WhatsApp (sin `+` ni espacios).
- `RESENAS`: reseñas añadidas a mano. `GOOGLE_URL` / `GOOGLE_RESENA_URL`: enlaces a la ficha de Google.
- `CITAS_URL`: dirección del Google Apps Script que conecta el calendario con Google Calendar. Si está vacía, el calendario funciona en «modo solicitud» y envía la petición por WhatsApp.
- `CFG.horario` (minutos desde medianoche, por día de la semana 1 = lunes), `BLOQUEOS` (días cerrados), `DUR` (duraciones).
- `SHOP`: categorías, productos y precios de la tienda. `img` es el nombre de la foto en `assets/img` sin `.webp`.

Si añades una foto nueva, guárdala en WebP en `assets/img/` y añade su ancho y alto en `DIM` (al principio de `app.js`).

## Estilos

Solo hace falta compilar si cambias clases de Tailwind en el HTML/JS o tocas `input.css`:

```bash
npm install
npm run build   # o `npm run dev` para recompilar al guardar
```

Sube también `assets/css/styles.css` al repositorio: es el archivo que carga la web.

## Probar en local

```bash
python3 -m http.server 8000   # y abre http://localhost:8000
```
