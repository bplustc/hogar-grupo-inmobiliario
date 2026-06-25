# Hogar Grupo Inmobiliario

Sitio web corporativo e inmobiliario para la promoción de venta y alquiler de casas, departamentos, terrenos y oficinas en Riobamba y Ecuador.

## Descripción

Este proyecto presenta una landing page moderna, responsive y optimizada para posicionamiento orgánico, con secciones informativas, galería de inmuebles, perfil de asesora comercial y formulario de contacto con integración a WhatsApp y correo.

## Características principales

- Diseño responsive para escritorio y móvil.
- Navegación por secciones con menú adaptable.
- Galería de inmuebles con filtros por tipo.
- Vista ampliada de imágenes con miniaturas.
- Botón de contacto por WhatsApp por propiedad.
- Formulario de asesoría personalizada con validación básica.
- Integración con Supabase para carga dinámica de propiedades.
- Metadatos SEO completos: title, description, canonical, Open Graph, Twitter Cards, robots y sitemap.
- Datos estructurados JSON-LD para mejorar la indexación.

## Tecnologías utilizadas

- HTML5
- CSS3
- JavaScript
- Bootstrap Icons
- Google Fonts
- Supabase

## Estructura del proyecto

```text
Hogar Grupo Inmobiliario/
├── index.html
├── styles.css
├── script.js
├── robots.txt
├── sitemap.xml
├── images/
└── Guia/
```

## Funcionalidades clave

### Galería de inmuebles

La sección de inmuebles permite:

- Filtrar por tipo: casas, departamentos, terrenos y oficinas.
- Ver imágenes ampliadas al hacer clic.
- Navegar entre varias imágenes por propiedad.
- Enviar interés por WhatsApp con información específica de la card.

### Contacto

El formulario de contacto permite enviar una solicitud de asesoría por:

- WhatsApp
- Correo electrónico

## SEO y posicionamiento

El sitio incluye una base SEO preparada para producción:

- Título y descripción optimizados.
- Canonical absoluto.
- Etiquetas Open Graph y Twitter Card.
- `robots.txt` con ruta al sitemap.
- `sitemap.xml` con URLs absolutas.
- JSON-LD con datos de agente inmobiliario y secciones del sitio.

## Configuración local

1. Clona el repositorio.
2. Abre la carpeta en VS Code o en tu editor preferido.
3. Ejecuta el archivo `index.html` en un navegador.

Si deseas probar la carga dinámica de propiedades, asegúrate de que la configuración de Supabase esté activa y que la tabla `propiedades` contenga registros.

## Despliegue

Este proyecto puede publicarse fácilmente en:

- Netlify
- Vercel
- GitHub Pages
- Cualquier hosting estático compatible con HTML/CSS/JS

## Recomendaciones antes de producción

- Verificar que el dominio final coincida con el configurado en `canonical`, `og:url` y `sitemap.xml`.
- Revisar que las imágenes tengan compresión adecuada para mejorar Core Web Vitals.
- Confirmar que los enlaces de WhatsApp y correo estén actualizados.

## Contacto

- Teléfono: 0980380673
- Correo: hogargrupoinmobiliarioec@gmail.com
- Dirección: Ayacucho y Pichincha, Riobamba - Ecuador

## Autoría

Proyecto desarrollado para Hogar Grupo Inmobiliario.
