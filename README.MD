# Autenticación de Usuarios con Verificación por Correo

Esta aplicación es un sistema de autenticación de usuarios con características como registro, inicio de sesión, verificación de código, y gestión de sesiones. Utiliza correos electrónicos de verificación para confirmar la identidad del usuario.

## Características

- **Registro de usuarios**: Los usuarios pueden registrarse, y el sistema les envía un correo con un código de verificación.
- **Inicio de sesión**: Los usuarios pueden iniciar sesión después de registrarse y verificar su cuenta.
- **Cierre de sesión**: Los usuarios pueden cerrar sesión, y la cookie de sesión será eliminada.
- **Verificación de código**: Los usuarios deben verificar su cuenta usando un código enviado a su correo.
- **Validación del token**: El middleware asegura que las rutas protegidas sólo son accesibles por usuarios autenticados.
- **Envío de correos electrónicos**: El sistema utiliza plantillas dinámicas para enviar correos electrónicos con diferentes propósitos (verificación de cuenta, restablecimiento de contraseña, etc.).

## Tecnologías utilizadas

- **Node.js**: Entorno de ejecución de JavaScript `v22.9.0`.
- **Express.js**: Framework para la creación de APIs.
- **Brevo (anteriormente Sendinblue)**: API de terceros para el envío de correos electrónicos.
- **MySQL**: Base de datos para almacenar información de los usuarios.
- **JWT (JSON Web Tokens)**: Autenticación basada en tokens.
- **bcrypt**: Para el hashing seguro de contraseñas.

## Instalación

1. **Clonar el repositorio**

   ```bash
   git clone https://github.com/tu-usuario/nombre-repositorio.git
   cd nombre-repositorio
   ```

2. **Instalar dependencias**

```bash
npm install
```

3. **Configurar variables de entorno**

Crea un archivo `.env` en el directorio raíz y agrega las siguientes variables de entorno:

```bash
PORT=3000

# mysql connect
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=your_password
MYSQL_DATABASE=your_database

# jwt key
JWT_SECRET_KEY="yoursecret"

# api key brevo
API_KEY_BREVO=your_api_key_brevo
DOMINIO_MAIL=tu_dominio_de_correo
```

4. **Inicializar la base de datos**

Asegúrate de que tienes una base de datos MySQL configurada y ejecuta el script SQL para crear las tablas necesarias.

5. **Iniciar la aplicación**

```bash
npm start
```

## Uso de la API

### Registro de usuarios

- **Ruta**: `/signup`
- **Método**: `POST`
- **Cuerpo**:

```json
{
  "fullname": "John Doe",
  "email": "johndoe@example.com",
  "passwd": "password123"
}
```

### Verificación de código

- **Ruta**: `/validateuser`
- **Método**: `PATCH`
- **Cuerpo**:

```json
{
  "code": "123456"
}
```

### Inicio de sesión

- **Ruta**: `/login`
- **Método**: `POST`
- **Cuerpo**:

```json
{
  "email": "johndoe@example.com",
  "passwd": "password123"
}
```

### Cierre de sesión

- **Ruta**: `/logout`
- **Método**: `GET`

### Verificar usuario autenticado

- **Ruta**: `/authenticate`
- **Método**: `GET`
- **Requiere**: Token de autenticación (cookie `__session`)

## Middleware

`authVerifyToken`
Este middleware se asegura de que el usuario esté autenticado antes de permitirle acceder a rutas protegidas. Verifica la existencia y validez del token almacenado en las cookies (`__session`).

## Personalización de correos electrónicos

La aplicación utiliza plantillas de correo almacenadas en el archivo `emailTemplate.js`. Actualmente, está configurada para enviar correos de verificación de cuenta, y las plantillas se pueden personalizar según el tipo de correo que desees enviar.

El archivo `utils/FG.js` contiene una función `replaceTemplate` que reemplaza variables dinámicas dentro de las plantillas de correo, como el código de verificación.

## Contribución

Este proyecto está abierto a contribuciones, ¡y no necesitas ser un experto para ayudar a mejorarlo! Si estás aprendiendo a programar, esta es una gran oportunidad para poner en práctica tus conocimientos, aprender más sobre Node.js, Express, y cómo funciona la autenticación de usuarios.

1. **Haz un fork del proyecto**: Empieza haciendo un fork de este repositorio para tener tu propia copia.
2. **Crea una rama para tu nueva función o mejora**:
   ```bash
   git checkout -b feature/nueva-funcion
   ```
3. **Realiza tus cambios**: No dudes en probar nuevas ideas. No hay contribuciones pequeñas; mejorar la legibilidad, optimizar el código o arreglar errores siempre es valioso.
4. **Haz commits descriptivos**: Asegúrate de que los mensajes de tus commits expliquen claramente lo que has cambiado, siguiendo la estructura de commits de este proyecto.
5. **Envía un pull request**: Cuando hayas terminado, envía un pull request con tus cambios. Todos los pull requests son bienvenidos, no importa si es un pequeño ajuste o una nueva característica.

### Consejo para principiantes

Si estás aprendiendo como yo, colaborar en proyectos como este te ayudará a mejorar tus habilidades de programación. No tengas miedo de cometer errores, ya que siempre estamos aquí para aprender. Puedes empezar con pequeñas mejoras o incluso pedir ayuda si algo no está claro. ¡Cada línea de código cuenta!

¡Juntos podemos hacer que este proyecto sea mejor, línea a línea! 😄
