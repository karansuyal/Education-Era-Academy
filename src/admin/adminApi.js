import { API_BASE_URL } from '../api/client'

// ============================================================
// Admin API client.
//
// Same backend as the public site (src/api/client.js), but every call
// here is authenticated. Tokens live in localStorage so a page refresh
// doesn't log the admin out. On a 401, we try exactly one silent
// refresh-and-retry before giving up and forcing a re-login.
// ============================================================

const ACCESS_KEY = 'eea_admin_access_token'
const REFRESH_KEY = 'eea_admin_refresh_token'

export function getTokens() {
  return {
    accessToken: localStorage.getItem(ACCESS_KEY),
    refreshToken: localStorage.getItem(REFRESH_KEY),
  }
}

export function setTokens({ accessToken, refreshToken }) {
  if (accessToken) localStorage.setItem(ACCESS_KEY, accessToken)
  if (refreshToken) localStorage.setItem(REFRESH_KEY, refreshToken)
}

export function clearTokens() {
  localStorage.removeItem(ACCESS_KEY)
  localStorage.removeItem(REFRESH_KEY)
}

async function rawRequest(path, { method = 'GET', body, accessToken } = {}) {
  const headers = {}
  if (body !== undefined) headers['Content-Type'] = 'application/json'
  if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })
  return res
}

async function parseResponse(res) {
  if (!res.ok) {
    let detail = res.statusText
    try {
      const errJson = await res.json()
      detail = errJson.detail || JSON.stringify(errJson)
    } catch {
      // keep statusText
    }
    const err = new Error(detail)
    err.status = res.status
    throw err
  }
  if (res.status === 204) return null
  return res.json()
}

async function tryRefresh() {
  const { refreshToken } = getTokens()
  if (!refreshToken) return null

  try {
    const res = await rawRequest('/auth/refresh', { method: 'POST', body: { refresh_token: refreshToken } })
    if (!res.ok) {
      clearTokens()
      return null
    }
    const data = await res.json()
    setTokens({ accessToken: data.access_token, refreshToken: data.refresh_token })
    return data.access_token
  } catch {
    clearTokens()
    return null
  }
}

/**
 * Authenticated request. Retries once after a silent token refresh if the
 * first attempt comes back 401. Throws with `.status` set on failure so
 * callers can special-case auth errors (e.g. redirect to /admin/login).
 */
export async function adminRequest(path, { method = 'GET', body } = {}) {
  let { accessToken } = getTokens()

  let res = await rawRequest(path, { method, body, accessToken })

  if (res.status === 401) {
    const refreshed = await tryRefresh()
    if (!refreshed) {
      const err = new Error('Session expired — please log in again.')
      err.status = 401
      throw err
    }
    res = await rawRequest(path, { method, body, accessToken: refreshed })
  }

  return parseResponse(res)
}

export const adminGet = (path) => adminRequest(path)
export const adminPost = (path, body) => adminRequest(path, { method: 'POST', body })
export const adminPut = (path, body) => adminRequest(path, { method: 'PUT', body })
export const adminPatch = (path, body) => adminRequest(path, { method: 'PATCH', body })
export const adminDelete = (path) => adminRequest(path, { method: 'DELETE' })

export async function login(username, password) {
  const res = await rawRequest('/auth/login', { method: 'POST', body: { username, password } })
  const data = await parseResponse(res)
  setTokens({ accessToken: data.access_token, refreshToken: data.refresh_token })
  return data
}

export async function logout() {
  const { refreshToken } = getTokens()
  clearTokens()
  if (refreshToken) {
    // Best-effort — revoke server-side too, but don't block the UI on it.
    rawRequest('/auth/logout', { method: 'POST', body: { refresh_token: refreshToken } }).catch(() => {})
  }
}

export async function fetchCurrentAdmin() {
  return adminGet('/auth/me')
}
