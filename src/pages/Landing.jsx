import { Link } from 'react-router-dom';
// import illustration from '../assets/homeDraw.svg'
import Navbar from '../components/Navbar';
import {BiCopyright, BiChat} from 'react-icons/bi'

import '../styles/Utilities.css'
import '../styles/Landing.scss'

const Landig = () => {
  return (
    <>
      <main id='landing'>
        <Navbar type={'landing'} />
        <div id='hero' className="container text-center">
          <h1>SO, LET'S TALKABOUT...</h1>
          <h5 className='pt-4'>...a place, where you and your friends can group in to teams and chat privately </h5>
          <h5>Delete all team data stored on server at any time, secure your teams by setting password</h5>
          <h5 className='pt-3'>Create your own team, then send a URL to your friend, </h5>
          <h5>or join to already existing team by pasting a URL</h5>
          <div id='btn-group' className='d-flex flex-column flex-md-row'>
            <Link to='/register' id='sign-up' className='btn btn-light'> <BiChat /> Create an account</Link>
            <Link to='/login' id='sing-in' className='btn btn-dark'>Open TalkAbout in your browser</Link>
          </div>
        </div>
      </main>
      <footer>
        <a href='https://github.com/sam-kmn'>SAMUEL KAMINSKI</a>
        <p> <BiCopyright /> Copyright 2022</p>
        <p>All rights reserved. Powered by <a href="https://firebase.google.com/">Firebase</a> </p>
        {/* <p><Link to="privacy">Privacy Policy</Link> | <a href='https://github.com/sam-kmn'>Contact</a></p> */}
      </footer>
    </>
  )
};

export default Landig;
