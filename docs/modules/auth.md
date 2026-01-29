
# Autenticación con JWT

El sistema de autenticación utiliza **JSON Web Tokens (JWT)** para gestionar sesiones de usuario de forma segura. A continuación se describe el flujo completo:

## 1. Inicio de sesión y generación del JWT

- El usuario envía sus credenciales (cédula/email y contraseña) al endpoint de autenticación (por ejemplo, `/api/v1/auth/login`).
- El backend valida las credenciales. Si son correctas, genera un JWT que contiene información relevante del usuario (por ejemplo, `identityCard` y `role`).
- El JWT se firma usando una clave secreta (`JWT_SECRET`) y se establece un **tiempo de expiración** (por ejemplo, 1 hora).
- El token se envía al cliente como una **cookie HTTP Only** llamada `access_token`.

## 2. Middleware para extraer el usuario

- En cada petición, un middleware de Express lee la cookie `access_token`.
- Si existe, intenta verificar y decodificar el JWT usando la clave secreta.
- Si el token es válido, la información del usuario (`identityCard`, `role`, etc.) se adjunta a `req.user` para que esté disponible en los controladores y rutas.
- Si el token no existe o es inválido/expirado, `req.user` queda como `null` y la petición puede ser rechazada o tratada como anónima.

## 3. Tiempo límite de la sesión

- El JWT tiene un tiempo de expiración definido al momento de su creación (por ejemplo, 1 hora).
- Cuando el token expira, el middleware lo detecta como inválido y el usuario debe volver a autenticarse.
- Esto protege contra sesiones indefinidas y mejora la seguridad.

## 4. Flujo con el Frontend

- El frontend realiza peticiones al backend usando `fetch`, **incluyendo las cookies** (`credentials: 'include'`).
- Para obtener la sesión iniciada, el frontend hace una petición a `/api/v1/auth/me`. El backend responde con la información del usuario si el token es válido.
- Si el token está expirado o es inválido, el backend responde con un error y el frontend puede redirigir al usuario al login.