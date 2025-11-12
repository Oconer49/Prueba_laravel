# Sistema de Gestión · Laravel 12 + React

El sistema implementa la gestión integral de productos, clientes, inventario y pedidos usando **Laravel 12** en el backend y **React + Vite** en el frontend.

---

## Tecnologías principales
- PHP 8.2 · Laravel 12
- MySQL 8+
- Node.js 18+ · React 18 · Vite 7
- Tailwind CSS 4
- Axios para consumo de API REST

---

## Requisitos
- PHP >= 8.2 con extensiones `pdo`, `pdo_mysql`, `openssl`, `mbstring`, `tokenizer`, `xml`, `ctype`, `json`
- Composer
- Node.js >= 20.19 (incluye npm; compatible también con >= 22.12)
- Servidor MySQL

---

## Instalación y configuración

### 1. Clonar el repositorio
```bash
git clone https://github.com/Oconer49/Prueba_laravel.git
cd Prueba_laravel
```

### 2. Configurar variables de entorno
```bash
cp .env.example .env
```
Edita el archivo `.env` y define las credenciales de tu base de datos MySQL:
```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=laravel
DB_USERNAME=root
DB_PASSWORD=
```

### 3. Instalar dependencias
```bash
composer install
npm install
```

### 4. Generar clave de aplicación
```bash
php artisan key:generate
```

### 5. Ejecutar migraciones y seeders
```bash
php artisan migrate --seed
```
Se crearán las tablas y se insertarán registros de ejemplo en categorías, productos y clientes.

### 6. Ejecutar el proyecto en desarrollo
En una terminal:
```bash
php artisan serve
```
En otra terminal:
```bash
npm run dev
```

Abre tu navegador en `http://localhost:8000`. El frontend se monta automáticamente a través de Vite.

---

## Scripts útiles
| Comando | Descripción |
| ------- | ----------- |
| `composer run dev` | Arranca servidor Laravel, escucha la cola, muestra logs y levanta Vite de forma concurrente |
| `npm run dev` | Compila assets en modo desarrollo |
| `npm run build` | Genera assets de producción en `public/build` |
| `php artisan migrate:fresh --seed` | Reinicia por completo la base de datos con datos de prueba |

---

## Funcionalidades principales
- **Productos:** edición, eliminación, listado y asignación de categoría.
- **Clientes:** gestión completa con validación de correos únicos.
- **Inventario:** ajuste manual del stock por producto.
- **Pedidos:** selección de cliente, adición de múltiples productos, cálculo automático de total y descuento de inventario.
- **API REST:** endpoints consumidos desde el frontend disponibles bajo `/api/*`.

---

## Estructura del proyecto
```
Prueba_Laravel/
├── app/                # Código backend (modelos, controladores, requests)
├── database/           # Migraciones y seeders
├── public/             # Punto de entrada y assets compilados
├── resources/
│   ├── js/             # Componentes React y servicios
│   └── css/            # Estilos Tailwind
├── routes/             # Rutas API y web
├── vite.config.js      # Configuración de Vite y Tailwind
└── README.md
```

---

## Despliegue
1. Configura el entorno en el servidor (PHP, Composer, Node).
2. Define variables de entorno en `.env` (base de datos, APP_URL, etc.).
3. Ejecuta `composer install`, `npm install` y `npm run build`.
4. Corre `php artisan migrate --force --seed` si necesitas datos iniciales.
5. Configura el servidor web (Nginx/Apache) apuntando a `public/index.php`.

---
