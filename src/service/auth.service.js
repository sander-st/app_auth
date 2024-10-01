import { randomUUID, randomBytes } from "node:crypto";
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
    const userProfile = {
      userId: id,
      fullname,
      email,
      verifiedUser: Boolean(verifiedUser),
    };
    const token = generateToken(userProfile);

    // enviamos el correo de verificación
    await sendEmail({
      email,
      subject: "Verifque su correo electronico",
      name: fullname,
      type: "verification", // el tipo de email que se va enviar
      variables: {
        code: verificationCode,
      },
    });

    return {
      userProfile,
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

export const userForgotPassword = async (email, URL_HOST) => {
  let connection;

  try {
    connection = await pool.getConnection();
    // await connection.beginTransaction();
    const [result] = await connection.query(
      "SELECT id, fullname, email FROM register WHERE email = ?",
      [email]
    );

    if (!result.length) throw new Error("User not found");

    const { id, fullname } = result[0];

    const resetToken = randomBytes(20).toString("hex");
    const tableID = randomUUID();

    await connection.query(
      "INSERT INTO password_resets (id, userId, resetToken, resetTokenExpiration) VALUES (?, ?, ?, DATE_ADD(NOW(), INTERVAL 15 MINUTE))",
      [tableID, id, resetToken]
    );

    await sendEmail({
      email,
      subject: "Reestablezca su contraseña",
      name: fullname,
      type: "forgotPassword", // el tipo de email que se va enviar
      variables: {
        name: fullname,
        url: `${URL_HOST}/resetpassword?token=${resetToken}`,
      },
    });

    return {
      success: true,
      message: "Revise su correo electronico para reestablecer su contraseña",
    };
  } catch (error) {
    throw new Error(`User forgot password failed: ${error.message}`); // fixerror
  } finally {
    if (connection) connection.release();
  }
};

export const userResetPassword = async (resetToken, passwd) => {
  let connection;
  try {
    connection = await pool.getConnection();

    await connection.beginTransaction();

    // validar el token de reestablecimiento de contraseña
    const [result] = await connection.query(
      "SELECT resetToken, userId FROM password_resets WHERE resetToken = ? AND resetTokenExpiration > NOW()",
      [resetToken]
    );

    if (!result.length) throw new Error("Invalid reset token or expired");

    const { userId } = result[0];
    const passwdHash = await hashPassword(passwd);

    await connection.query("UPDATE register SET passwd = ? WHERE id = ?", [
      passwdHash,
      userId,
    ]);

    await connection.query("DELETE FROM password_resets WHERE resetToken = ?", [
      resetToken,
    ]);

    const [userDate] = await connection.query(
      "SELECT fullname, email FROM register WHERE id = ?",
      [userId]
    );

    await connection.commit();

    const { fullname, email } = userDate[0];

    await sendEmail({
      email,
      subject: "Su contraseña ha sido reestablecida",
      name: fullname,
      type: "succesChangePassword",
      variables: {
        name: fullname,
      },
    });

    return {
      success: true,
      message: "Password reset successfully",
    };
  } catch (error) {
    if (connection) await connection.rollback();
    throw new Error(`Password reset failed: ${error.message}`);
  } finally {
    if (connection) connection.release();
  }
};
