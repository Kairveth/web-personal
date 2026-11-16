# web-personal

Web personal y profesional de Pedro Romero Álvarez, desarrollador Salesforce especializado en integraciones y APIs REST.

HTML, CSS y unas pocas líneas de JavaScript. Sin frameworks, sin dependencias y sin paso de compilación. Las fuentes se sirven desde `assets/fonts` para no depender de servicios externos.

## Ver en local

Abre `public/index.html` en el navegador.

## Añadir un proyecto al portfolio

En `public/index.html` hay una plantilla comentada encima de la lista de proyectos. Cópiala dentro de `.projects` y rellena `data-cat` con las tecnologías separadas por coma. Los filtros se generan solos.

## Publicación

Cloudflare Pages publica la rama `main` sin comando de build. Directorio de salida: la raíz del repositorio.

## Seguridad

La web es estática: no tiene servidor propio, base de datos, formularios ni cookies, y no carga nada de terceros. `public/_headers` envía una política de seguridad de contenido estricta y el resto de cabeceras (HSTS, `nosniff`, `frame-ancestors`). Por esa política, el HTML no lleva `<script>` con código, `<style>` ni atributos `style`.

## Licencia

Sin licencia. El código es visible, pero textos, foto y diseño no se pueden reutilizar sin permiso.
