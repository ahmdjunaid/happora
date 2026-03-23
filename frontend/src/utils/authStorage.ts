const TOKEN_KEY = 'happora_auth_token'
const USER_KEY = 'happora_auth_user'

export const authStorage = {
  getToken() {
    return localStorage.getItem(TOKEN_KEY) ?? ''
  },

  setToken(token: string) {
    localStorage.setItem(TOKEN_KEY, token)
  },

  clearToken() {
    localStorage.removeItem(TOKEN_KEY)
  },

  getUser() {
    const value = localStorage.getItem(USER_KEY)
    return value ? JSON.parse(value) : null
  },

  setUser(user: unknown) {
    localStorage.setItem(USER_KEY, JSON.stringify(user))
  },

  clearUser() {
    localStorage.removeItem(USER_KEY)
  },
}
