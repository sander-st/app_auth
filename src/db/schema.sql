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





-- alter table users add column verificationCode int and column timeExpirationCode datetime
ALTER TABLE register
ADD COLUMN verificationCode INT, -- Añadir la columna de código de verificación
ADD COLUMN timeExpirationCode DATETIME; -- Añadir la columna de expiración de código

ALTER TABLE register ADD COLUMN verifiedUser BOOLEAN DEFAULT FALSE;

-- Agregar el código de verificación y la fecha de expiración a los registros existentes
UPDATE register
SET timeExpirationCode = DATE_ADD(NOW(), INTERVAL 15 MINUTE)
WHERE timeExpirationCode IS NULL;

-- Insertar un nuevo registro de usuario (ejemplo)
INSERT INTO users (id, fullname, email, passwd, jwtrefresh , verificationCode, timeExpirationCode) 
VALUES (
    UUID(), 
    'John Doe', 
    'johndoe@example.com', 
    'hashed_password', 
    'token_data', 
    123456, 
    DATE_ADD(NOW(), INTERVAL 15 MINUTE) -- Sumamos 15 minutos a la hora actual
);

-- Renombrar la columna 'verificatioCode' a 'verificationCode' (ejemplo)
ALTER TABLE users
CHANGE COLUMN verificatioCode verificationCode INT;

-- Eliminar todos los datos de la tabla register sin modificar la tabla (ejemplo)
TRUNCATE TABLE register;
