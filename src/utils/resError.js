export const resError = (res, status = 500, message) => {
  const data = {
    error: true,
    message,
  };
  res.status(status).json(data);
};
