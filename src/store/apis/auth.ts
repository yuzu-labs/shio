import client from '../../utils/http';

const authAPI = {
  login: (loginCipher: string) =>
    client
      .post('/auth', {
        loginCipher,
      })
      .then((response) => response.data),
};

export default authAPI;
