# GS.Code — Portfolio

Portfolio personal de **Giuliano Scaglioni**, desarrollador full-stack. Presenta los proyectos y casos de estudio de GS.Code, los servicios que ofrezco, mi stack y un formulario de contacto funcional.

🌐 **Sitio en producción:** [gscode.com.ar](https://gscode.com.ar)
💼 **LinkedIn:** [giuliano-scaglioni](https://www.linkedin.com/in/giuliano-scaglioni/)

> Esta versión es una reescritura completa (funcional y visual) del sitio anterior de GS.Code. Se mantienen el logo y la identidad de color: negro y verde flúor.

---

## Funcionalidades

- **Proyectos / casos de estudio** con galería de hasta 5 imágenes por proyecto.
- **Panel de administración** para cargar y actualizar proyectos e imágenes. Las imágenes se renombran automáticamente como `<nombre-del-proyecto>-img1`, `-img2`, etc.
- **Servicios** de GS.Code.
- **Sobre mí + stack** tecnológico.
- **Formulario de contacto** que envía los mensajes por correo mediante Gmail.

## Stack

| Capa | Tecnología |
|---|---|
| Frontend / Backend | Next.js + TypeScript |
| Base de datos | MySQL |
| Email | Gmail (SMTP con contraseña de aplicación) |
| Infraestructura | Docker sobre VPS Ubuntu (DonWeb) |
| DNS | Cloudflare (dominio registrado en NIC.ar) |

## Requisitos

- Node.js 20 o superior
- npm
- Docker y Docker Compose (para levantar MySQL o el proyecto completo)

## Instalación local

```bash
# 1. Clonar el repositorio
git clone https://github.com/NaD3M-71/GS.Code.git
cd GS.Code

# 2. Instalar dependencias
npm install

# 3. Crear el archivo de variables de entorno
cp .env.example .env.local
# y completar los valores (ver sección siguiente)

# 4. Levantar MySQL con Docker
docker compose up -d db

# 5. Iniciar el servidor de desarrollo
npm run dev
```

La app queda disponible en [http://localhost:3000](http://localhost:3000).

## Variables de entorno

| Variable | Descripción |
|---|---|
| `DB_HOST` | Host de MySQL (`localhost` en desarrollo, `db` dentro de Docker) |
| `DB_PORT` | Puerto de MySQL (por defecto `3306`) |
| `DB_USER` | Usuario de la base de datos |
| `DB_PASSWORD` | Contraseña de la base de datos |
| `DB_NAME` | Nombre de la base de datos |
| `GMAIL_USER` | Cuenta de Gmail que envía los mensajes del formulario |
| `GMAIL_APP_PASSWORD` | Contraseña de aplicación de Gmail |
| `CONTACT_TO` | Dirección que recibe los mensajes de contacto |
| `ADMIN_PASSWORD` | Credencial de acceso al panel de administración |



## Scripts

| Comando | Acción |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm run start` | Inicia el build de producción |
| `npm run lint` | Linter |

## Estructura del proyecto

```
GS.Code/
├── app/              # Rutas y páginas (App Router)
│   └── admin/        # Panel de administración
├── components/       # Componentes reutilizables
├── lib/              # Conexión a DB, envío de mails, utilidades
├── public/           # Logo e imágenes estáticas
├── docker-compose.yml
├── Dockerfile
└── .env.example
```

## Despliegue

El sitio corre en un VPS Ubuntu de DonWeb con Docker. Para actualizar producción:

```bash
# En el VPS
cd GS.Code
git pull
docker compose up -d --build
```

La base de datos MySQL corre en su propio contenedor con un volumen persistente, así que los datos y las imágenes cargadas no se pierden al reconstruir la app.

## Autor

**Giuliano Scaglioni** — [GS.Code](https://gscode.com.ar)

## Licencia

© Giuliano Scaglioni. Todos los derechos reservados.
