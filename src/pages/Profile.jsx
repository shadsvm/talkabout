import { FaSignOutAlt } from 'react-icons/fa'
import { useAuth } from '../contexts/AuthContext'
import Avatar from 'react-avatar';

const Profile = () => {

  const {currentUser, signout} = useAuth()

  const SignOutBtn = () => (
    <button className="btn text-light d-flex align-items-center gap-2" onClick={signout}> 
      <div className="fs-3">Sign Out</div> 
      <FaSignOutAlt/> 
    </button>
  )

  return (
    <div className="container p-5">
      <div className="row align-items-center justify-content-center mt-3">

        <div className="col-12 mb-5 d-flex align-items-center justify-content-center gap-3">
          <Avatar name={currentUser.displayName} round={true} size="64" textSizeRatio={2} />
          <div className="fs-1">{currentUser.displayName}</div>
        </div>

        <div className="col-10 col-md-7 col-lg-5">
          <div>
            <label for="formFile" className="form-label">Upload your profile picture</label>
            <input className="form-control h4" type="file" id="formFile" />
          </div>

        </div>

        <SignOutBtn />

      </div>
    </div>
  )
}

export default Profile