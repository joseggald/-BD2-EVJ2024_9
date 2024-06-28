
export const loginSuccess = (userId, role) => {
  return {
    type: 'LOGIN_SUCCESS',
    payload: { userId, role },
  };
};

export const logout = () => {
  return {
    type: 'LOGOUT',
  };
};