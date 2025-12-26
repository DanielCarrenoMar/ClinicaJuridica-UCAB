# Instrucciones para Probar el Flujo de Usuarios

Este documento explica cómo probar que el flujo completo **Routes → Controller → Service → Database** funciona correctamente para insertar datos en la Base de Datos.

## 📋 Prerequisitos

1. Asegúrate de que `DATABASE_URL` esté configurado en tu archivo `.env`
2. La base de datos debe estar accesible y las migraciones ejecutadas

## 🧪 Opción 1: Prueba Directa del Service (Recomendada para desarrollo rápido)

Esta prueba llama directamente al service, saltándose las capas de Routes y Controller. Es útil para verificar que la lógica de negocio y el acceso a la base de datos funcionan correctamente.

### Ejecutar:
```bash
cd backend
npm run test:user-flow
```

### Qué prueba:
- ✅ Obtener todos los usuarios
- ✅ Crear un nuevo usuario
- ✅ Obtener usuario por ID
- ✅ Actualizar usuario
- ✅ Eliminar usuario
- ✅ Verificar que los datos se insertan en la Base de Datos

## 🌐 Opción 2: Prueba HTTP Completa (Recomendada para verificar todo el stack)

Esta prueba hace peticiones HTTP reales al servidor, probando todo el flujo: **HTTP Request → Routes → Controller → Service → Database**.

### Pasos:

1. **Inicia el servidor** (en una terminal):
```bash
cd backend
npm run dev
```

2. **En otra terminal, ejecuta la prueba**:
```bash
cd backend
npm run test:user-http
```

### Qué prueba:
- ✅ Endpoint `GET /api/v1/users` - Obtener todos los usuarios
- ✅ Endpoint `POST /api/v1/users` - Crear un nuevo usuario
- ✅ Endpoint `GET /api/v1/users/:id` - Obtener usuario por ID
- ✅ Endpoint `PUT /api/v1/users/:id` - Actualizar usuario
- ✅ Endpoint `DELETE /api/v1/users/:id` - Eliminar usuario
- ✅ Verifica que los datos se insertan en la Base de Datos a través de todas las capas

## 📝 Prueba Manual con cURL (Alternativa)

Si prefieres probar manualmente, puedes usar estos comandos:

### 1. Crear un usuario:
```bash
curl -X POST http://localhost:3000/api/v1/users \
  -H "Content-Type: application/json" \
  -d '{
    "idUser": 12345678,
    "firstName": "Juan",
    "lastName": "Pérez",
    "email": "juan.perez@example.com",
    "gender": "M",
    "isActive": true
  }'
```

### 2. Obtener todos los usuarios:
```bash
curl http://localhost:3000/api/v1/users
```

### 3. Obtener un usuario por ID:
```bash
curl http://localhost:3000/api/v1/users/12345678
```

### 4. Actualizar un usuario:
```bash
curl -X PUT http://localhost:3000/api/v1/users/12345678 \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Juan Carlos",
    "lastName": "Pérez García"
  }'
```

### 5. Eliminar un usuario:
```bash
curl -X DELETE http://localhost:3000/api/v1/users/12345678
```

### 6. Seed de usuarios de prueba:
```bash
curl -X POST http://localhost:3000/api/v1/users/seed
```

## 🔍 Verificación en la Base de Datos

Para verificar que los datos se insertaron correctamente, puedes:

1. **Usar Prisma Studio**:
```bash
cd backend
npx prisma studio
```

2. **O consultar directamente en PostgreSQL**:
```sql
SELECT * FROM "User" ORDER BY "idUser";
```

## ✅ Resultado Esperado

Si todo funciona correctamente, deberías ver:
- ✅ Mensajes de éxito en cada operación
- ✅ Datos insertados en la Base de Datos
- ✅ Respuestas JSON con `success: true`
- ✅ Los datos persisten después de las operaciones

## 🐛 Solución de Problemas

### Error: "DATABASE_URL no está configurado"
- Verifica que tu archivo `.env` tenga la variable `DATABASE_URL`
- Ejemplo: `DATABASE_URL=postgresql://usuario:password@localhost:5432/nombre_db`

### Error: "Prisma Client no está configurado correctamente"
- Ejecuta: `npm run generate` para generar el cliente de Prisma
- Verifica que las migraciones estén aplicadas: `npm run migrate`

### Error de conexión en la prueba HTTP
- Asegúrate de que el servidor esté corriendo (`npm run dev`)
- Verifica que el puerto sea el correcto (por defecto 3000)

## 📚 Estructura del Flujo

```
HTTP Request
    ↓
Routes (user.routes.ts)
    ↓
Controller (user.controller.ts) - Valida request, maneja response
    ↓
Service (user.service.ts) - Lógica de negocio
    ↓
Database (database.ts) - Prisma Client
    ↓
PostgreSQL Database
```

Cada capa tiene su responsabilidad:
- **Routes**: Define los endpoints y los conecta con los controllers
- **Controller**: Maneja HTTP (request/response), validaciones básicas
- **Service**: Contiene la lógica de negocio y acceso a la base de datos
- **Database**: Configuración de Prisma Client

