import { FaSignOutAlt } from 'react-icons/fa'
import { useAuth } from '../contexts/AuthContext'

const Profile = () => {
  const {currentUser, signout} = useAuth()

  return (
    <div className="container d-flex flex-column justify-content-center align-items-center pt-5">
      <div className="fs-1">{currentUser.displayName}</div>
      <button className="btn text-light d-flex align-items-center gap-2" onClick={signout}> 
        <div className="fs-3">Sign Out</div> 
        <FaSignOutAlt/> 
      </button>
    </div>
  )
}

export default Profile