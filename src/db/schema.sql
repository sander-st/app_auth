create database if not exists crud_auth;

CREATE TABLE register (
    id CHAR(36) NOT NULL PRIMARY KEY, -- UUID para identificar de forma única a cada usuario
    fullName VARCHAR(255) NOT NULL, -- Nombre completo del usuario
    email VARCHAR(255) NOT NULL UNIQUE, -- Correo electrónico único
    passwd VARCHAR(255) NOT NULL, -- Contraseña (debe almacenarse de forma segura, preferiblemente hasheada)
    jwtrefresh TEXT, -- Token de refresco en formato JSON
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Fecha y hora de creación
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP -- Fecha y hora de la última actualización
    verificationCode INT, -- Código de verificación
    timeExpirationCode DATETIME -- Fecha de expiración del código de verificación
    verifiedUser BOOLEAN DEFAULT FALSE -- Indicador de usuario verificado
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE password_resets (
    id CHAR(36) NOT NULL PRIMARY KEY, -- UUID para identificar de forma única cada solicitud de reseteo
    userId CHAR(36) NOT NULL, -- Relacionar con el id del usuario en la tabla register
    resetToken VARCHAR(255) NOT NULL, -- Token de reseteo de contraseña
    resetTokenExpiration DATETIME NOT NULL, -- Fecha de expiración del token
    FOREIGN KEY (userId) REFERENCES register(id) ON DELETE CASCADE -- Elimina el registro si el usuario se borra
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
