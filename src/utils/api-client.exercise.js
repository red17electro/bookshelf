function client(endpoint, customConfig = {}) {
  const config = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    ...customConfig,
  }

  return window
    .fetch(`${process.env.REACT_APP_API_URL}/${endpoint}`, config)
    .then(
      response => {
        if (response.ok) {
          return response.json()
        }
        throw new Error(response.statusText)
      },
      error => {
        throw new Error(error)
      },
    )
}

export {client}
