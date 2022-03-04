import { FaSignOutAlt } from 'react-icons/fa'
import { useAuth } from '../contexts/AuthContext'
import {IoMdTrash} from 'react-icons/io'
import Avatar from 'react-avatar';
import "../styles/Profile.scss"
import { getDatabase, get, child, ref, update, remove, push } from 'firebase/database';
import { useState } from 'react';

const Profile = () => {

  const db = getDatabase()
  const {currentUser, signout} = useAuth()
  const [modalCheck, setModalCheck] = useState(true)
  const test = () => setModalCheck(!modalCheck)


  const deleteAccount = async () => {

    const teams_snapshot = await get(child(ref(db), 'users/' + currentUser.displayName + '/teams'))
    if (!teams_snapshot.exists()) return
    const IDs = Object.keys(teams_snapshot.val())
    for (let ID of IDs ){
      await update(ref(db, 'teams/' + ID + '/members/'), {[currentUser.displayName]: null})
      await push(ref(db, "/teams/" + ID + '/messages'), {text: `${currentUser.displayName} left this team.`, type: 'prompt', date: new Date()})
    }
    await remove(ref(db, 'users/' + currentUser.displayName))
    signout()
  }
  
  const DeleteAccountBtn = () => (
    <button className="fs-5 btn btn-outline-danger d-flex align-items-center gap-2" data-bs-toggle="modal" data-bs-target="#Modal"> 
      <div>Delete account</div> 
      <IoMdTrash/> 
    </button>
  )

  const SignOutBtn = () => (
    <button className="fs-5 btn text-light d-flex align-items-center gap-2" onClick={signout}> 
      <div>Sign Out</div> 
      <FaSignOutAlt/> 
    </button>
  )

  const Modal = ({callback}) => (
    <div className="modal fade" id="Modal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLabel">Are you sure?</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-body">
            This action is irreversible and permanent.

            Delete all teams I've created
            <input type="checkbox" checked={modalCheck} onChange={test}/>

            {/* <div className="form-check">
              <input className="form-check-input" type="checkbox" checked={modalCheck} onChange={() => setModalCheck(!modalCheck)} id="flexCheckDefault" />
              <label className="form-check-label">
                Delete all teams I've created
              </label>
            </div> */}

          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-outline-secondary" data-bs-dismiss="modal">Close</button>
            <button type="button" className="btn btn-danger" onClick={callback}>Delete</button>
          </div>
        </div>
      </div>
    </div>
    
  )

  return (
    <div className="container p-5">
      <div className="row align-items-center justify-content-center mt-3">

        <div className="col-12 gap-5 d-flex flex-column align-items-center justify-content-center">
          
          <div className='d-flex align-items-center justify-content-center gap-3'>
            <Avatar name={currentUser.displayName} round={true} size="64" textSizeRatio={2} />
            <div className="fs-1">{currentUser.displayName}</div>
          </div>

          <div className='d-flex gap-4'>
            <SignOutBtn />
            <DeleteAccountBtn />
          </div>

          <Modal callback={deleteAccount} />

          {/* <div>
            <label for="formFile" className="form-label">Upload your profile picture</label>
            <input className="form-control h4" type="file" id="formFile" />
          </div> */}
        

        </div>
      </div>
    </div>
  )
}

export default Profile