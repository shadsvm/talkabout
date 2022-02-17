import { useRef, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import RegisterBox from '../components/RegisterBox';
import { useAuth } from '../contexts/AuthContext';

import {FcGoogle} from 'react-icons/fc'
import '../styles/Login.scss'
import '../styles/Authorization.scss'

const Login = () => {

  const emailRef = useRef()
  const passwordRef = useRef()
  const { currentUser, signin } = useAuth()

  const [alert, setAlert] = useState(false)
  const alertElement = <div className="alert alert-danger text-center">Failed to log in</div>
  const runAlert = () => {
    setAlert(true)
    setTimeout(()=> setAlert(false), 3000)
  }
  // const history = useHistory()


  const submit = async event => {
    event.preventDefault()
    // console.log(emailRef.current.value, passwordRef.current.value)

    try {
      await signin(emailRef.current.value, passwordRef.current.value)
      // history.push("/")
    } catch {
      runAlert()
    }
  }
  return (
    <main id='login' className="authorization-container container-fluid">
      {currentUser ? <Navigate to="/t" replace={true} />:
        <RegisterBox> 
          <header id='header'>Welcome back!</header>
          <p id='subheader'>We're so excited to see you again!</p>
          { alert ? alertElement : <></>}
          <form className="d-flex flex-column gap-3" onSubmit={submit}>
            <input type="text" placeholder="E-Mail" className='form-control' ref={emailRef} required/>
            <input type="password" placeholder="Password" className='form-control' ref={passwordRef} required />
            <input type="submit" className='btn btn-primary btn-submit' value="Sign in to your account" />
          </form>


          <div className='spacer'>
            <div className='spacer-line'></div>
            <div className="spacer-text">or</div>
            <div className='spacer-line'></div>
          </div>

          <button className='btn btn-light btn-submit'> <FcGoogle /> Sign in with Google </button>
          
          <Link className='btn btn-submit text-light' to='/register'>Want to create an account?</Link>

        </RegisterBox>
      }
    </main>
  )
};

export default Login;
