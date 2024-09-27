import { randomUUID } from "node:crypto";
import { pool } from "../db/mysql.connect.js";
import { hashPassword, comparePassword } from "../utils/bcrypt.js";
import { generateToken } from "../utils/jwt.js";
import { sendEmail } from "../api/brevo/brevo.connection.js";

export const userRegister = async (dataUser) => {
  const { fullname, email, passwd } = dataUser;

  let connection;
  try {
    // encriptamos la contraseña
    const passwdHash = await hashPassword(passwd);

    connection = await pool.getConnection();

    const __id = randomUUID();
    const verificationCode = Math.floor(Math.random() * 900000) + 100000;

    await connection.query(
      "INSERT INTO register (id, fullname, email , passwd, verificationCode, timeExpirationCode) VALUES (?, ?, ?, ?, ?, DATE_ADD(NOW(), INTERVAL 15 MINUTE))",
      [__id, fullname, email, passwdHash, verificationCode]
    );

    const [rows] = await connection.query(
      "SELECT id, fullname, email, passwd, verificationCode, verifiedUser FROM register WHERE id = ?",
      [__id]
    );

    // generamos el token
    const dataToken = {
      userId: rows[0].id,
      fullname: rows[0].fullname,
      email: rows[0].email,
      verifiedUser: Boolean(rows[0].verifiedUser),
    };
    const token = generateToken(dataToken);

    // enviamos el correo de verificación
    await sendEmail({
      email: rows[0].email,
      subject: "Verifque su correo electronico",
      name: rows[0].fullname,
      verificationCode: rows[0].verificationCode,
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
  const { email, passwd } = dataUser;

  let connection;
  try {
    connection = await pool.getConnection();

    const [result] = await connection.query(
      "SELECT id, email, passwd, fullname, verifiedUser FROM register WHERE email = ?",
      [email]
    );

    // validamos si el usuario existe
    if (!result.length) throw new Error("User not found");

    // validamos la contraseña
    const isMatch = await comparePassword(passwd, result[0].passwd);
    if (!isMatch) throw new Error("Invalid password");

    const data = {
      userId: result[0].id,
      email: result[0].email,
      fullname: result[0].fullname,
      verifiedUser: Boolean(result[0].verifiedUser),
    };
    // generamos el token
    const token = generateToken(data);

    return {
      userProfile: data,
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
    const [result] = await connection.query(
      "SELECT id, verificationCode, timeExpirationCode FROM register WHERE id = ?",
      [userId]
    );

    const { timeExpirationCode, verificationCode } = result[0];
    // validar si el tiempo de expiracion de codigo es menor o igual a la fecha actual
    const currentValidateDate =
      Date.now() > new Date(timeExpirationCode).getTime();
    if (currentValidateDate) throw new Error("Code expired");

    // validar si el codigo es igual al enviado
    if (code !== verificationCode) throw new Error("Invalid code");

    // actualizar el estado de verificado
    await connection.query(
      "UPDATE register SET verifiedUser = TRUE WHERE id = ?",
      [userId]
    );

    dataUser.verifiedUser = true;

    return {
      userProfile: dataUser,
      success: true,
      message: "Code validated successfully",
    };
  } catch (error) {
    throw new Error(`Verification code validation failed: ${error.message}`);
  } finally {
    if (connection) connection.release();
  }
};
