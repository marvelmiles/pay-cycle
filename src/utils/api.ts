export const normalizeError = (error: any) => {
  if (error.response?.data) {
    return error.response.data;
  }

  return error;
};
