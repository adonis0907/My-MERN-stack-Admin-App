import axios from "axios";
import { returnErrors } from "./errorActions";
import { ALL_USERS_LOADED, AUTH_ERROR, CLEAR_SUCCESS_MSG, GITHUB_SIGNIN_FAIL, LOADING, LOGIN_FAIL, LOGIN_SUCCESS, LOGOUT_SUCCESS, REGISTER_FAIL, REGISTER_SUCCESS, TFA_ING, TFA_LOADED, TFA_LOAD_FAIL, TFA_SETUP_FAIL, TFA_SETUP_SUCCESS, TFA_VERIFED, TFA_VERIFY_FAIL, USER_DELETED, USER_LOADED, USER_LOADING } from "./types";

// CLEAR Success message
export const clearSuccessMsg = () => {
  return {
    type: CLEAR_SUCCESS_MSG,
  };
};

// Check token & load user
export const loadUser = () => (dispatch, getState) => {
  // User loading
  dispatch({ type: USER_LOADING });

  const loadUserPromise = axios.get("/api/auth/user", tokenConfig(getState));
  axios
    .get("/api/auth/user", tokenConfig(getState))
    .then((res) => {
      return dispatch({
        type: USER_LOADED,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch(returnErrors(err.response.data, err.response.status));
      dispatch({
        type: AUTH_ERROR,
      });
    });
  return loadUserPromise;
};

// get all registered users
export const loadAllUsers = () => (dispatch, getState) => {
  // User loading
  dispatch({ type: USER_LOADING });

  var authPromise = axios.get("/api/users", tokenConfig(getState));

  authPromise
    .then((res) =>
      dispatch({
        type: ALL_USERS_LOADED,
        payload: res.data,
      })
    )
    .catch((err) => {
      dispatch(returnErrors(err.response.data, err.response.status));
      dispatch({
        type: AUTH_ERROR,
      });
    });

  return authPromise;
};

// Register User
export const register = (user) => (dispatch) => {
  // Headers
  dispatch({ type: LOADING });
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  const { name, email, password, role, company } = user;
  // Request body
  const body = JSON.stringify({ name, email, password, role, company });

  const authPromise = axios
    .post("/api/users", body, config)
    .then((res) =>
      dispatch({
        type: REGISTER_SUCCESS,
        payload: res.data,
      })
    )
    .catch((err) => {
      dispatch(
        returnErrors(err.response.data, err.response.status, "REGISTER_FAIL")
      );
      dispatch({
        type: REGISTER_FAIL,
      });
    });

  //not sure if it is the right way to do redux.
  return authPromise;
};

// Login User

export const login = ({ email, password }) => (dispatch) => {
  dispatch({ type: LOADING });

  // Headers
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  // Request body
  const body = JSON.stringify({ email, password });

  const authPromise = axios
    .post("/api/auth", body, config)
    .then((res) =>
      dispatch({
        type: LOGIN_SUCCESS,
        payload: res.data,
      })
    )
    .catch((err) => {
      dispatch(
        returnErrors(err.response.data, err.response.status, "LOGIN_FAIL")
      );
      dispatch({
        type: LOGIN_FAIL,
      });
    });

  //not sure if it is the right way to do redux.
  return authPromise;
};

// Logout User
export const logout = () => {
  return {
    type: LOGOUT_SUCCESS,
  };
};

// Setup config/headers and token
export const tokenConfig = (getState) => {
  // Get token from localstorage
  const token = getState().auth.token;

  // Headers
  const config = {
    headers: {
      "Content-type": "application/json",
    },
  };

  // If token, add to headers
  if (token) {
    config.headers["x-auth-token"] = token;
  }

  return config;
};

export const deleteUser = (id) => (dispatch, getState) => {
  axios
    .delete(`/api/users/${id}`, tokenConfig(getState))
    .then((res) =>
      dispatch({
        type: USER_DELETED,
        payload: id,
      })
    )
    .catch((err) =>
      dispatch(returnErrors(err.response.data, err.response.status))
    );
};

// --------------------------- google 2fa auth . ---------------------------------------------//
// --------------------------- google 2fa auth . ---------------------------------------------//
// --------------------------- google 2fa auth . ---------------------------------------------//
// --------------------------- google 2fa auth . ---------------------------------------------//

export const getTFA = ({ email, domainName }) => (dispatch) => {
  // TFAing
  dispatch({ type: TFA_ING });
  // Headers
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  // Request body
  const body = JSON.stringify({ email, domainName });
  const authPromise = axios
    .post("/api/TFA/", body, config)
    .then((res) => {
      dispatch({
        type: TFA_LOADED,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch(
        returnErrors(err.response.data, err.response.status, "TFA_LOAD_FAIL")
      );
      dispatch({
        type: TFA_LOAD_FAIL,
      });
    });

  //not sure if it is the right way to do redux.
  return authPromise;
};

// google 2fa auth setup.
export const TFASetup = ({ email, domainName }) => (dispatch) => {
  // TFAing
  dispatch({ type: TFA_ING });
  // Headers

  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  // Request body
  const body = JSON.stringify({ email, domainName });
  const authPromise = axios
    .post("/api/TFA/setup", body, config)
    .then((res) => {
      dispatch({
        type: TFA_SETUP_SUCCESS,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch(
        returnErrors(err.response.data, err.response.status, "TFA_SETUP_FAIL")
      );
      dispatch({
        type: TFA_SETUP_FAIL,
      });
    });

  //not sure if it is the right way to do redux.
  return authPromise;
};

// google 2fa auth verify.
export const TFAVerify = (email, code) => (dispatch) => {
  // TFAing
  dispatch({ type: TFA_ING });
  // Headers
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  // Request body
  const body = JSON.stringify({ email, code });
  const authPromise = axios
    .post("/api/TFA/verify", body, config)
    .then((res) =>
      dispatch({
        type: TFA_VERIFED,
      })
    )
    .catch((err) => {
      dispatch(
        returnErrors(err.response.data, err.response.status, "TFA_VERIFY_FAIL")
      );
      dispatch({
        type: TFA_VERIFY_FAIL,
      });
    });

  //not sure if it is the right way to do redux.
  return authPromise;
};

// skip tfa.
export const skipTFA = (email, code) => (dispatch) => {
  // TFAing
  dispatch({ type: TFA_VERIFED });
};

// --------------------------- Github OAuth ---------------------------------------------//
// --------------------------- Github OAuth ---------------------------------------------//
// --------------------------- Github OAuth ---------------------------------------------//
// --------------------------- Github OAuth ---------------------------------------------//

export const githubSignIn = () => (dispatch) => {
  axios
    .get("https://github.com/login/oauth/authorize?client_id=011f16605e66210d330b")
    .then((res) => getGithubAuthToken() )
    .catch((err) => {
      dispatch(
        returnErrors(
          err.response.data,
          err.response.status,
          "GITHUB_SIGNIN_FAIL"
        )
      );
      dispatch({
        type: GITHUB_SIGNIN_FAIL,
      });
    });
};

export const getGithubAuthToken = () => (dispatch) => {
  axios
    .get("https://github.com/login/oauth/authorize?client_id=011f16605e66210d330b")
    .then((res) => )
    .catch((err) => {
      dispatch(
        returnErrors(
          err.response.data,
          err.response.status,
          "GITHUB_SIGNIN_FAIL"
        )
      );
      dispatch({
        type: GITHUB_SIGNIN_FAIL,
      });
    });
};