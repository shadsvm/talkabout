import { useState } from "react";
import { getDatabase, ref, set, child, push, update, get } from "firebase/database";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import '../styles/Add.scss'

const Add = () => {

  // Create
  const [createTeamName, setCreateTeamName] = useState('')
  const [createTeamPW, setTeamPW] = useState('')
  // Join
  const [joinTeamID, setJoinTeamID] = useState('')
  const [joinTeamPW, setJoinTeamPW] = useState('')

  const db = getDatabase();
  const {currentUser} = useAuth()
  const navigate = useNavigate()

  const [alert, setAlert] = useState('')
  const Alert = () => (
    <div className="mt-5 row justify-content-center text-center fs-3">
      <div className="col-10 col-md-7 col-lg-6 col-xl-5 alert alert-danger">
        {alert}
      </div>
    </div>
  )
  const runAlert = (text) => {
    setAlert(text ?? "This team doesn't exists")
    setTimeout(()=> setAlert(''), 3000)
  }


  const createTeam = async (event) => {
    event.preventDefault()
    if (!createTeamName) return
    
    const newTeamID = push(child(ref(db), 'teams')).key;
    await set(ref(db, 'teams/' + newTeamID), {name: createTeamName, admin: currentUser.displayName, password: createTeamPW ?? '' })
    await update(ref(db, 'users/' + currentUser.displayName + '/teams'), {[newTeamID]: true})
    
    navigate("/t/" + newTeamID, { replace: true })
  }


  const joinTeam = async (event) => {
    event.preventDefault()
    if (!joinTeamID) return
    
    const team = await get(ref(db, 'teams/' + joinTeamID))

    if (!team.exists()) return runAlert()

    if (team.val().password !== joinTeamPW) return runAlert('Wrong password!')

    const updates = {}
    const promptID = push(child(ref(db), 'teams/' + joinTeamID + '/messages')).key;

    updates['users/' + currentUser.displayName + '/teams/' + joinTeamID] = true
    updates['teams/' + joinTeamID + '/messages/' + promptID] = {text: `${currentUser.displayName} joined the team.`, type: 'prompt', date: new Date()}

    await update(ref(db), updates)

    navigate("/t/" + joinTeamID, { replace: true })
    
  }

    

  return (
    <div id="add-container" className="container">

    <div className="add-box pt-5 mt-5 row justify-content-center text-center fs-3">
        <div className="col-10 col-md-8 col-lg-7 col-xl-5">

          <header className="fs-2 pb-2">Create new team</header>
          <form className="input-group" onSubmit={e => createTeam(e)}>
            <input className="form-control" maxLength={15} type="text" placeholder="Team name" value={createTeamName} onChange={e => setCreateTeamName(e.target.value)} />
            <button className="btn btn-outline-secondary" type="submit" id="button-addon2">Create</button>
          </form>
          <input type="text" className="form-control mt-2" placeholder="Password (Optional)" value={createTeamPW} onChange={e => setTeamPW(e.target.value)} />
          
      </div>
    </div>

    <div className="add-box pt-5 mt-5 row justify-content-center text-center fs-3">
        <div className="col-10 col-md-8 col-lg-7 col-xl-5">
        
          <header className="fs-2 pb-2">Join to existing team</header>
          <form className="input-group" onSubmit={e => joinTeam(e)}>
            <input className="form-control" type="text" placeholder="Team ID" value={joinTeamID} onChange={e => setJoinTeamID(e.target.value)} />
            <button className="btn btn-outline-secondary" type="submit" id="button-addon2">Join</button>
          </form>
          <input type="text" className="form-control mt-2" placeholder="Password (Optional)" value={joinTeamPW} onChange={e => setJoinTeamPW(e.target.value)} />
          <p className="note">You can find Team ID, at the end of url. <br /> It's right after t/, usualy start with hyphen</p>

        </div>
    </div>

      {alert ? <Alert /> : <></>}


    </div>
  )
};

export default Add;
