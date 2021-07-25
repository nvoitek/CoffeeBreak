  let jwt_token = '';

  export const axiosConfig = {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': 'Bearer ' + jwt_token
    }
  };

  export function setToken(newToken) {
    jwt_token = newToken;
  }