# Servidor Node.js/Express - Instrucciones de Ejecución

## Cambios Realizados

### 1. **Creación de `server.js`**
Se ha creado un nuevo servidor Node.js utilizando Express que reemplaza completamente la funcionalidad del archivo Python `app.py`. Las características incluyen:

- ✅ Endpoints REST para gestionar guías (GET, POST, PUT, DELETE)
- ✅ Subida de imágenes con multer
- ✅ Almacenamiento en archivo JSON (`guides.json`)
- ✅ Manejo de rutas estáticas y archivos de datos
- ✅ Puerto 3000 por defecto

### 2. **Actualización de `package.json`**
Se agregó la dependencia `multer` para manejar la subida de archivos:
- `express`: ^4.18.2 (ya existía)
- `multer`: ^1.4.5-lts.1 (nuevo)

### 3. **Corrección en `login.html`**
Se corrigió la ruta de importación del módulo:
- ❌ `import users from './controllers/users.js'`
- ✅ `import users from '../controllers/users.js'`

### 4. **Revisión de `admin.html`**
El archivo ya estaba correctamente configurado con:
- ✅ Llamadas fetch correctas a `/api/guides`
- ✅ Manejo de upload de imágenes
- ✅ Funciones de CRUD completas
- ✅ Modal para crear, ver y editar guías

## Estructura de Directorios

```
tracking-chugchilan/
├── server.js                      ← NUEVO: Servidor Express
├── package.json                   ← ACTUALIZADO: Agregado multer
├── node_modules/                  ← Dependencias instaladas
├── backend/
│   └── app.py                     ← Ya no necesario (reemplazado)
├── frontend/
│   ├── public/
│   │   ├── index.html
│   │   ├── admin.html             ← VERIFICADO: Correcto
│   │   └── login.html             ← CORREGIDO: Ruta de importación
│   ├── controllers/
│   │   └── users.js               ← Importado correctamente
│   └── data/
│       ├── guides/
│       │   └── guides.json        ← Almacena los guías
│       └── img/
│           └── Guias/             ← Almacena las imágenes
```

## Cómo Ejecutar

### Opción 1: npm start
```bash
npm start
```

### Opción 2: node server.js
```bash
node server.js
```

El servidor se iniciará en: **http://localhost:3000**

## Endpoints Disponibles

### GET /api/guides
Obtiene la lista de todos los guías

### POST /api/guides
Crea un nuevo guía
- Body: JSON con datos del guía

### PUT /api/guides/:guide_id
Actualiza un guía existente
- Params: ID del guía
- Body: JSON con datos actualizados

### DELETE /api/guides/:guide_id
Elimina un guía
- Params: ID del guía

### POST /api/upload-image
Sube una imagen
- Body: FormData con archivo
- Devuelve: Ruta relativa de la imagen

## Rutas Web

- **Home**: http://localhost:3000/
- **Panel Admin**: http://localhost:3000/admin
- **Login**: http://localhost:3000/login

## Funcionalidades Confirmadas

✅ Crear nuevo guía con imagen  
✅ Ver lista de guías en tabla  
✅ Ver detalles de un guía  
✅ Editar información de guía  
✅ Eliminar guía  
✅ Subida de imágenes (drag & drop)  
✅ Gestión de idiomas multilingües  
✅ Almacenamiento persistente en guides.json  
✅ Manejo de múltiples uploads sin sobrescribir  

## Notas Importantes

1. Las imágenes se guardan en: `frontend/data/img/Guias/`
2. Los datos de guías se guardan en: `frontend/data/guides/guides.json`
3. El archivo app.py ya no es necesario
4. La carpeta `backend/` puede mantenerse como referencia pero no se utiliza

## Prueba Rápida

1. Ejecuta: `npm start`
2. Abre: http://localhost:3000/login
3. Usuario: `admin` | Contraseña: `admin123`
4. Ve al panel: http://localhost:3000/admin
5. Crea un nuevo guía con imagen
6. Verifica que se guarde en guides.json
