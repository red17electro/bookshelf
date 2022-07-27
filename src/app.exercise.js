/** @jsx jsx */
import {jsx} from '@emotion/core'

import * as React from 'react'
import * as auth from 'auth-provider'
import {client} from 'utils/api-client'
import {AuthenticatedApp} from './authenticated-app'
import {UnauthenticatedApp} from './unauthenticated-app'
import {useAsync} from 'utils/hooks'
import {FullPageSpinner} from 'components/lib'
import * as colors from 'styles/colors'

const getUser = async () => {
  let user = null

  const token = await auth.getToken()
  if (token) {
    const data = await client('me', {token})
    user = data.user
  }

  return user
}

function App() {
  const {
    data: user,
    error,
    isIdle,
    isLoading,
    isSuccess,
    isError,
    run,
    setUser,
  } = useAsync()

  React.useEffect(() => {
    run(getUser())
  }, [run])

  const login = form => {
    auth.login(form).then(user => setUser(user))
  }

  const register = form => {
    auth.register(form).then(user => setUser(user))
  }

  const logout = () => {
    auth.logout().then(() => setUser(null))
  }

  return isLoading || isIdle ? (
    <FullPageSpinner></FullPageSpinner>
  ) : isSuccess ? (
    <AuthenticatedApp user={user} logout={logout} />
  ) : isError ? (
    <div
      css={{
        color: colors.danger,
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <p>Uh oh... There's a problem. Try refreshing the app.</p>
      <pre>{error.message}</pre>
    </div>
  ) : (
    <UnauthenticatedApp login={login} register={register} />
  )
}

export {App}

/*
eslint
  no-unused-vars: "off",
*/
