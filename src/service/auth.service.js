import { randomUUID } from "node:crypto";
import { pool } from "../db/mysql.connect.js";
import { hashPassword, comparePassword } from "../utils/bcrypt.js";
import { generateToken } from "../utils/jwt.js";
import { sendEmail } from "../api/brevo/brevo.connection.js";

export const userRegister = async (dataUser) => {
  let connection;
  try {
    // encriptamos la contraseña
    const passwdHash = await hashPassword(dataUser.passwd);

    connection = await pool.getConnection();

    const __id = randomUUID();
    const generateRandomCode = Math.floor(Math.random() * 900000) + 100000;

    await connection.query(
      "INSERT INTO register (id, fullname, email , passwd, verificationCode, timeExpirationCode) VALUES (?, ?, ?, ?, ?, DATE_ADD(NOW(), INTERVAL 15 MINUTE))",
      [__id, dataUser.fullname, dataUser.email, passwdHash, generateRandomCode]
    );

    const [rows] = await connection.query(
      "SELECT id, fullname, email, verificationCode, verifiedUser FROM register WHERE id = ?",
      [__id]
    );

    const { id, fullname, email, verificationCode, verifiedUser } = rows[0];
    // generamos el token
    const dataToken = {
      userId: id,
      fullname,
      email,
      verifiedUser: Boolean(verifiedUser),
    };
    const token = generateToken(dataToken);

    // enviamos el correo de verificación
    await sendEmail({
      email,
      subject: "Verifque su correo electronico",
      name: fullname,
      verificationCode,
    });

    return {
      userProfile: dataToken,
      token,
      success: true,
      message: "User created successfully",
    };
  } catch (error) {
    throw new Error(`User registration failed: ${error.message}`);
  } finally {
    if (connection) connection.release();
  }
};

export const userLogin = async (dataUser) => {
  let connection;
  try {
    connection = await pool.getConnection();

    const [result] = await connection.query(
      "SELECT id, email, passwd, fullname, verifiedUser FROM register WHERE email = ?",
      [dataUser.email]
    );

    // validamos si el usuario existe
    if (!result.length) throw new Error("User not found");

    const { id, fullname, email, verifiedUser, passwd } = result[0];

    const userProfile = {
      userId: id,
      email,
      fullname,
      verifiedUser: Boolean(verifiedUser),
    };

    // validamos la contraseña y generamos token en paralelo
    const [isMatch, token] = await Promise.all([
      comparePassword(dataUser.passwd, passwd),
      generateToken(userProfile),
    ]);

    if (!isMatch) throw new Error("Invalid password");

    return {
      userProfile,
      token,
      success: true,
      message: "User logged successfully",
    };
  } catch (error) {
    throw new Error(`User login failed: ${error.message}`);
  } finally {
    if (connection) connection.release();
  }
};

export const validateCode = async ({ dataUser, code }) => {
  const { userId } = dataUser;
  let connection;
  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();

    const [result] = await connection.query(
      "SELECT id, verificationCode, timeExpirationCode FROM register WHERE id = ?",
      [userId]
    );

    const user = result[0];
    if (!user) throw new Error("User not found");

    const { timeExpirationCode, verificationCode } = user;

    // validar si el tiempo de expiracion de codigo es menor o igual a la fecha actual
    if (Date.now() > new Date(timeExpirationCode).getTime()) {
      throw new Error("Code expired");
    }

    if (code !== verificationCode) throw new Error("Invalid code");

    await connection.query(
      "UPDATE register SET verifiedUser = TRUE WHERE id = ?",
      [userId]
    );

    dataUser.verifiedUser = true;

    await connection.commit();

    return {
      userProfile: dataUser,
      success: true,
      message: "Code validated successfully",
    };
  } catch (error) {
    if (connection) await connection.rollback();
    throw new Error(`Verification code validation failed: ${error.message}`);
  } finally {
    if (connection) connection.release();
  }
};
