import bcrypt from "bcrypt";

const { hash, compare, genSalt } = bcrypt;

export const hashPassword = async (password) => {
  const salt = await genSalt(10);
  return hash(password, salt);
};

export const comparePassword = async (password, hash) => {
  return await compare(password, hash);
};
