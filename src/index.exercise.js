import * as React from 'react'
import {createRoot} from 'react-dom/client'
import {Logo} from 'components/logo'
import '@reach/dialog/styles.css'
import {Dialog} from '@reach/dialog'
import {VisuallyHidden} from '@reach/visually-hidden'

const App = () => {
  const [openModal, setOpenModal] = React.useState('none')
  const handleLogin = () => {
    setOpenModal('login')
  }

  const handleRegister = () => {
    setOpenModal('register')
  }

  const handleSubmitLoginForm = ({username, password}) => {
    console.log(username, password)
    alert('login form submitted with data: ' + username + ' ' + password)
  }

  const handleSubmitRegiserForm = ({username, password}) => {
    console.log(username, password)
    alert('register form submitted with data: ' + username + ' ' + password)
  }

  return (
    <>
      <Logo width={80} height={80}></Logo>
      <CustomDialog isOpen={openModal === 'login'} setOpenModal={setOpenModal}>
        <LoginForm onSubmit={handleSubmitLoginForm} buttonText="Login" />
      </CustomDialog>
      <CustomDialog
        isOpen={openModal === 'register'}
        setOpenModal={setOpenModal}
      >
        <LoginForm
          onSubmit={handleSubmitRegiserForm}
          buttonText="Registration"
        />
      </CustomDialog>
      <div>
        <button role="button" onClick={handleLogin}>
          Login
        </button>
      </div>
      <div>
        <button role="button" onClick={handleRegister}>
          Register
        </button>
      </div>
    </>
  )
}

const CustomDialog = ({isOpen, setOpenModal, children, caption}) => {
  const close = () => {
    setOpenModal('none')
  }
  return (
    <Dialog aria-label="login-form" isOpen={isOpen} onDismiss={close}>
      <button className="close-button" onClick={close}>
        <VisuallyHidden>Close</VisuallyHidden>
        <span aria-hidden>×</span>
      </button>
      {children ? children : <p>{caption}</p>}
    </Dialog>
  )
}

const LoginForm = ({onSubmit, buttonText}) => {
  const [username, setUsername] = React.useState('')
  const [password, setPassword] = React.useState('')
  return (
    <form>
      <p>Login form</p>
      <label htmlFor="username">Username</label>
      <input
        value={username}
        id="username"
        onChange={e => setUsername(e.target.value)}
        type="text"
      />
      <label htmlFor="username">Password</label>
      <input
        id="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        type="password"
      />
      <button
        role="button"
        type="submit"
        onClick={e => {
          e.preventDefault()
          onSubmit({username, password})
        }}
      >
        {buttonText}
      </button>
    </form>
  )
}

const root = createRoot(document.getElementById('root'))
root.render(<App />)
export {root}
