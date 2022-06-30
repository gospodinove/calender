import { baseBackendUrl } from '../constants'

export const api = async (endPoint, method = 'GET', data) => {
  const url = new URL(baseBackendUrl + '/api/' + endPoint)

  if (method === 'GET' && data !== undefined) {
    Object.keys(data).forEach(key => url.searchParams.append(key, data[key]))
  }

  return (
    await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: method !== 'GET' ? JSON.stringify(data) : undefined,
      credentials: 'include'
    })
  ).json()
}
