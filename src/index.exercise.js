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

  return (
    <>
      <Logo></Logo>
      <CustomDialog isOpen={openModal === 'login'} setOpenModal={setOpenModal}>
        <LoginForm onSubmit={handleSubmitLoginForm} buttonText="Login" />
      </CustomDialog>
      <CustomDialog
        isOpen={openModal === 'register'}
        setOpenModal={setOpenModal}
        caption="Register"
      ></CustomDialog>
      <button role="button" onClick={handleLogin}>
        Login
      </button>
      <button role="button" onClick={handleRegister}>
        Register
      </button>
    </>
  )
}

const CustomDialog = ({isOpen, setOpenModal, children}) => {
  const close = () => {
    setOpenModal('none')
  }
  return (
    <Dialog isOpen={isOpen} onDismiss={close}>
      <button className="close-button" onClick={close}>
        <VisuallyHidden>Close</VisuallyHidden>
        <span aria-hidden>×</span>
      </button>
      {children}
    </Dialog>
  )
}

const LoginForm = ({onSubmit, buttonText}) => {
  const [username, setUsername] = React.useState('')
  const [password, setPassword] = React.useState('')
  return (
    <div>
      <p>Login form</p>
      <label htmlFor="username">Username</label>
      <input
        value={username}
        onChange={e => setUsername(e.target.value)}
        type="text"
      />
      <label htmlFor="username">Password</label>
      <input
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
    </div>
  )
}

const root = createRoot(document.getElementById('root'))
root.render(<App />)
export {root}
