# Mi Plataforma Salud

Aplicacion web responsiva para:
- registrar datos del usuario (peso, estatura, reporte medico, ingresos, trabajo y horas laborales),
- estimar condicion de salud y medidas recomendadas,
- generar informe en PDF descargable,
- mostrar estadisticas (cantidad de usuarios y enfermedad mas frecuente),
- enriquecer recomendaciones con IA conectada a internet (si hay API key configurada).

## Estructura

- `frontend/html` interfaz
- `frontend/css` estilos
- `frontend/javascript` logica cliente
- `backend` API y reglas de analisis
- `database` esquema y base SQLite

## Requisitos

- Node.js 18+

## Instalacion

1. Copiar variables:
   - `copy .env.example .env`
2. Instalar dependencias:
   - `npm install`
3. Iniciar servidor:
   - `npm start`
4. Abrir:
   - [http://localhost:3000](http://localhost:3000)

## IA con internet

Configura `OPENAI_API_KEY` en `.env`.  
Si no hay API key, la app sigue funcionando con recomendaciones locales basadas en reglas.

## ZIP

Para generar ZIP descargable del proyecto:

- `npm run zip`

Se creara `mi-plataforma-salud.zip` en la raiz.
# Plataforma-de-Salud-Evaluacion-integral-con-recomendaciones-IA-y-reporte-PDF
