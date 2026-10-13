# AFINTY · Gestión hospitalaria

Demo de software de gestión hospitalaria (Hospital Nacional Arzobispo Loayza) hecha con React + Vite.

## Ejecutar en local
```bash
npm install
npm run dev
```
Abre la URL que muestra la terminal (normalmente http://localhost:5173).

## Compilar
```bash
npm run build
```

## Publicar en GitHub Pages
1. Sube el proyecto a un repositorio en la rama `main`.
2. En GitHub: **Settings → Pages → Source: GitHub Actions**.
3. Cada `git push` a `main` despliega automáticamente (workflow en `.github/workflows/deploy.yml`).

## Asistente IA
Sin configuración, el asistente responde con un análisis local de los datos de la demo
(asistencia, camas y medicamentos). Para conectarlo a un modelo de IA, crea un backend/proxy
propio (la API key nunca debe ir en el navegador) y define en `.env`:
```
VITE_AI_ENDPOINT=https://tu-servidor.com/api/chat
```

## Fotos de médicos
Coloca imágenes autorizadas en `public/assets/doctores/` y completa `FOTO_DOCTOR_POR_ID` en `src/App.jsx`.

## Nota
Los datos de turnos, asistencia y stock son ilustrativos y no reflejan información real del hospital.
