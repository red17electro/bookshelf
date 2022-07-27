/** @jsx jsx */
import {jsx} from '@emotion/core'

import * as React from 'react'
import * as auth from 'auth-provider'
import {client} from 'utils/api-client'
import {AuthenticatedApp} from './authenticated-app'
import {UnauthenticatedApp} from './unauthenticated-app'

const getUser = async () => {
  const token = await auth.getToken()
  let user = null
  if (token) {
    const data = await client('me', {
      token,
    })
    user = data.user
  }

  return user
}

function App() {
  const [user, setUser] = React.useState(null)

  React.useEffect(() => {
    getUser().then(user => {
      setUser(user)
    })
  }, [])

  const login = form => {
    auth.login(form).then(user => setUser(user))
  }

  const register = form => {
    auth.register(form).then(user => setUser(user))
  }

  const logout = () => {
    auth.logout().then(() => setUser(null))
  }

  return user ? (
    <AuthenticatedApp user={user} logout={logout} />
  ) : (
    <UnauthenticatedApp login={login} register={register} />
  )
}

export {App}

/*
eslint
  no-unused-vars: "off",
*/
