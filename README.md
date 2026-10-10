# Cheat Sheet

Página personal de atajos de teclado, organizada por herramienta (Windows, VS Code, etc.). Cada atajo muestra su combinación, un título y una explicación.

## Características

- Sidebar generado automáticamente desde las secciones
- Buscador instantáneo (tecla `/` para enfocarlo, `Esc` para limpiar), ignora tildes
- Scrollspy que resalta la sección visible
- Diseño oscuro y responsive, con menú lateral en mobile

## Stack

[Vite](https://vite.dev) + [Tailwind CSS 4](https://tailwindcss.com), JavaScript puro.

## Uso

```bash
npm install
npm run dev      # servidor de desarrollo
npm run build    # build de producción en dist/
npm run preview  # previsualizar el build
```

## Agregar atajos

Todo el contenido está en [index.html](index.html). Copiá un bloque `<article class="shortcut">` dentro de la sección correspondiente. Para una sección nueva, usá la plantilla comentada al final del `<main>` (con el atributo `data-section`): el sidebar y la búsqueda la detectan solos.

## Estructura

```
index.html      # contenido (secciones y atajos)
src/main.js     # sidebar, buscador y scrollspy
src/style.css   # import de Tailwind
vite.config.js  # plugin de Tailwind
```
