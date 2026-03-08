# ProtegeT - Backend API 🛡️

Backend oficial del sistema **ProtegeT** (anteriormente SafeGuard), desarrollado para la hackathon "Byteback". Construido con NestJS y Prisma ORM.

## Características Principales

- **Registro WORM Criptográfico:** Generación de huellas dactilares (SHA-256) en memoria desde el `FileBuffer` multimedia.
- **Certificación Legal en PDF:** Generador interno con la liberaría `pdfkit` que estructura metadatos (IP, Timestamp, Hash y Titular) en formato legal apto para peritos en Bolivia.
- **Validación Pública QR:** API REST para consultar y contrastar la inmutabilidad de los datos en tiempo real mediante un código Hash.
- **Gestión de Identidad de las Evidencias:** Capacidad para que las víctimas renombren y organicen los títulos de sus evidencias sin afectar la matriz inmutable SHA-256 de los archivos orgánicos.

## Tecnologías Utilizadas
- **Core:** [NestJS](https://nestjs.com/) (Node.js framework)
- **Base de Datos:** PostgreSQL
- **ORM:** [Prisma](https://www.prisma.io/)
- **Documentos Periciales:** `pdfkit`, `qrcode`

## Instalación y Ejecución Local

Asegúrate de tener un contenedor Docker de PostgreSQL en ejecución o un servicio en la nube (ej. Supabase) y configurar tu archivo `.env`.

```bash
# 1. Instalar dependencias
$ npm install

# 2. Sincronizar el esquema Prisma con tu DB local
$ npx prisma db push
$ npx prisma generate

# 3. Arrancar servidor en desarrollo (Watch mode)
$ npm run start:dev
```

## Estructura Principal del API REST (`/api/evidence`)

- `POST /upload`: Recibe un `multipart/form-data` con el archivo a certificar. Devuelve el sello criptográfico.
- `GET /list`: Lista todas las evidencias selladas por el usuario actual (Mocked para la demo).
- `GET /verify/:hash`: Valida si una huella digital existe de forma íntegra en la bóveda inmutable.
- `PUT /rename/:hash`: Permite al usuario titular de la evidencia cambiar el título visual de la prueba archivada.
- `GET /pdf/:hash`: Genera y fuerza la descarga al vuelo de la Certificación Oficial en formato PDF de ProtegeT.

---
_Desarrollado para ByteBack Hackathon 2026._
