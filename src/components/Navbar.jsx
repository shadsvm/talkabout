import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

import { MdSpaceDashboard } from 'react-icons/md'
import { FaSignOutAlt } from 'react-icons/fa'
import { GiPerpendicularRings } from 'react-icons/gi'
// import {RiAddFill} from 'react-icons/ri'
import {AiOutlineTeam} from 'react-icons/ai'
import {IoMdAddCircleOutline} from 'react-icons/io'
import Avatar from 'react-avatar';

import '../styles/Navbar.scss'

const Navbar = ({type}) => {
  const {currentUser, signout} = useAuth()

  
  const loggedUserElements = (
    <div className="d-flex-center gap-4">
      <Link to="/t" className="text-decoration-none d-flex align-items-center gap-2" >Teams <MdSpaceDashboard/> </Link>
      <button className="btn text-light d-flex align-items-center gap-2" onClick={signout}> 
        <div className="d-none d-sm-block">Sign Out</div> 
        <FaSignOutAlt/> 
      </button>
    </div>
  )

  const LandingNavbar = () => (
    <nav id="navbar-landing" className='container'>
      <Link id='navbar-landing-logo' to="/" className="fs-4"> 
        <GiPerpendicularRings />
        <div>TalkAbout</div>
      </Link>
      <div>
        {currentUser ? loggedUserElements : <></> }
      </div>
    </nav>
  )

  const DashboardNavbar = () => (
    <nav id='navbar-dash'>
      <Link to={'/'} id='navbar-dash-logo'> TalkAbout </Link>

      <div id='navbar-dash-right-wrapper'>

        <Link to={'/t/add'} className='navbar-dash-item'>
          {/* <RiAddFill /> */}
          <IoMdAddCircleOutline />
        </Link>

        <Link to={'/t/teams'} className='navbar-dash-item d-md-none'>
          <AiOutlineTeam />
        </Link>

        <Link to={'/t/profile'} className='navbar-dash-item'>
          <Avatar name={currentUser.displayName} round={true} size="30" textSizeRatio={1.5} />
        </Link>
      </div>

    </nav>
  )

  return (
    <div id='navbar' className='p-0'>
      { type === 'dashboard' ?  <DashboardNavbar /> : <LandingNavbar /> } 
    </div>
  )
};

export default Navbar;
