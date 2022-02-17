import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';

import { useAuth } from '../contexts/AuthContext';
import { updateProfile } from "firebase/auth";
import { ref, child, get, getDatabase } from "firebase/database";


import {FcGoogle} from 'react-icons/fc'
import RegisterBox from '../components/RegisterBox';
import '../styles/Register.scss'
import '../styles/Authorization.scss'


const Register = () => {

  const navigate = useNavigate()
  const db = getDatabase()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const { currentUser, signup } = useAuth()

  const [alert, setAlert] = useState(false)
  const alertElement = <div className="alert alert-danger text-center my-4">Failed to register account</div>
  const runAlert = () => {
    setAlert(true)
    setTimeout(()=> setAlert(false), 3000)
  }

  // console.log(useAuth())

  const validateName = async () => {

    let regex = /[~`!@#$%^&*+=[\]\\';,._/{}()|\\":<>?\s]/g
    if (!username || regex.test(username) ) return false

    const dbRef = ref(db);
    const snapshot = await get(child(dbRef, 'users'))

    if (!snapshot.exists()) return true

    const users = Object.keys(snapshot.val())
    if (users.includes(username)) return false

    return true
  }

  const createAccount = async event => {
    event.preventDefault()
    try {
      await signup(email, password)
    } catch {
      runAlert()
    }
  }

  const UpdateName = async (event) => {
    event.preventDefault()
    const isValid = await validateName()
    if (isValid) {
      try {
        updateProfile(currentUser, {displayName: username})
      }
      catch { 
        runAlert() 
      }
    } else runAlert()
    
    setTimeout(()=> navigate("/t/add", { replace: true }), 1000)
  }

  return (
    <main id='register' className="authorization-container container-fluid">
      {currentUser ? 
        (currentUser.displayName ? 
          <Navigate to="/t" replace={true} /> :

          // 2ND STEP
          <RegisterBox>
            <header className="mb-4 fs-2 text-center">What's Your name?</header>

            { alert ? alertElement : <></>}

            <form className="d-flex flex-column gap-3" onSubmit={UpdateName}>
              <input type="text" className='form-control' placeholder='Username' value={username} onChange={(event) => setUsername(event.target.value)} />
              <input type="submit" className='btn btn-primary' value="Apply" />
            </form>

          </RegisterBox>

        ) :
      
        // 1ST STEP
        <RegisterBox>
          <Link to='/' id='header'>TalkAbout</Link>

          { alert ? alertElement : <></>}

          <form className="d-flex flex-column gap-2" onSubmit={createAccount}>
            <input type="text" placeholder="E-Mail" className='form-control' value={email} onChange={(event) => setEmail(event.target.value)} required/>
            <input type="password" placeholder="Password" className='form-control' value={password} onChange={(event) => setPassword(event.target.value)} required />
            <p id='prompt'>By clicking "Sign up", or continuing with the other options below, you agree to TalkAbout’s Terms of Service and have read the Privacy Policy</p>
            <button type="submit" className='btn btn-primary btn-submit'>Sign up</button>
          </form>
          
          {/* <div className='my-2'>or</div> */}
          
          <div className='spacer'>
            <div className='spacer-line'></div>
            <div className="spacer-text">or</div>
            <div className='spacer-line'></div>
          </div>

          <button className='btn btn-light btn-submit'> <FcGoogle /> Sign up with Google </button>
          
          <Link to='/login' className='btn btn-submit text-light mt-2' >Already have an account?</Link>

          
        </RegisterBox>
      }
    </main>
  )
};

export default Register;

// <Navigate to="/dash" replace={true} />