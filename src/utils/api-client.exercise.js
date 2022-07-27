import * as auth from 'auth-provider'
const apiURL = process.env.REACT_APP_API_URL

function client(
  endpoint,
  {token, data, headers: customHeaders, ...customConfig} = {},
) {
  const config = {
    method: data ? 'POST' : 'GET',
    body: data ? JSON.stringify(data) : undefined,
    headers: {
      'Content-Type': data ? 'application/json' : undefined,
      Authorization: token ? `Bearer ${token}` : undefined,
      ...customHeaders,
    },
    ...customConfig,
  }

  return window.fetch(`${apiURL}/${endpoint}`, config).then(async response => {
    const data = await response.json()
    if (response.ok) {
      return data
    } else if (response.status === 401) {
      await auth.logout()
      window.location.assign(window.location)
      return Promise.reject(data)
    } else {
      return Promise.reject(data)
    }
  })
}

export {client}
