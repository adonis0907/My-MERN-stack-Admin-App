import {
  USER_LOADED,
  GET_USERS,
  USER_LOADING,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT_SUCCESS,
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  TFA_FAIL,
  TFA_SUCCESS,
  TFA_SETUP_SUCCESS
} from "../actions/types";

const initialState = {
  token: localStorage.getItem("token"),
  isAuthenticated: null,
  isLoading: false,
  user: null,
  users: null,
  TFA: null,
  isTFAing: false,

};

export default function(state = initialState, action) {
  switch (action.type) {
    case USER_LOADING:
      return {
        ...state,
        isLoading: true
      };
      case GET_USERS: 
      return {
        ...state,
        users: action.payload,
        isLoading: false
      }
    case USER_LOADED:
      return {
        ...state,
        isAuthenticated: true,
        isLoading: false,
        user: action.payload
      };
    case LOGIN_SUCCESS:
    case REGISTER_SUCCESS:
      localStorage.setItem("token", action.payload.token);
      return {
        ...state,
        ...action.payload,
        
        isLoading: false
      };
      case TFA_SUCCESS:
        return {
          ...state,
          isAuthenticated: true,
          isTFAing: false
        }
        case TFA_SETUP_SUCCESS:
          return {
            ...state,
            TFA: action.payload,
            isTFAing: true
          }
    case AUTH_ERROR:
    case LOGIN_FAIL:
    case LOGOUT_SUCCESS:
    case REGISTER_FAIL:
    case TFA_FAIL:
      localStorage.removeItem("token");
      return {
        ...state,
        token: null,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        isTFAing: false
      };
    default:
      return state;
  }
}
