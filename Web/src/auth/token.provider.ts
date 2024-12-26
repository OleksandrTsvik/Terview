const ACCESS_TOKEN_KEY = 'access-token';
const REFRESH_TOKEN_KEY = 'refresh-token';

function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

function setAccessToken(accessToken: string) {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
}

function deleteAccessToken() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
}

function getRefreshToken() {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

function setRefreshToken(refreshToken: string) {
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
}

function deleteRefreshToken() {
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

export const TokenProvider = {
  getAccessToken,
  setAccessToken,
  deleteAccessToken,
  getRefreshToken,
  setRefreshToken,
  deleteRefreshToken,
};
