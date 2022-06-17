import { baseUrl } from '../constants'

export const api = async (url, method = 'GET', data) =>
  (
    await fetch(baseUrl + '/' + url, {
      method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data),
      credentials: 'include'
    })
  ).json()
