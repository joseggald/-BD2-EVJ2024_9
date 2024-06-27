
const initialState = {
      userId: null,
      role: null,
    };
    
    const userReducer = (state = initialState, action) => {
      switch (action.type) {
        case 'LOGIN_SUCCESS':
          return {
            ...state,
            userId: action.payload.userId,
            role: action.payload.role,
          };
        case 'LOGOUT':
          return {
            ...state,
            userId: null,
            role: null,
          };
        default:
          return state;
      }
    };
    
    export default userReducer;