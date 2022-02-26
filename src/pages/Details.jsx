  // Hey Sam, please end this details page before you do something else
  // this page should contain:
  // Name ✅
  // Password ✅
  // Members, kick, ban ✅
  // Delete messages ✅
  // Banned users ✅
  // Change team avatar

import { getDatabase, onValue, ref, update, push, remove } from "firebase/database"
import { useEffect, useRef, useState } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

// import {MdKeyboardArrowRight} from 'react-icons/md'
import {BsPeopleFill} from 'react-icons/bs'
import {BiCrown} from 'react-icons/bi'
import {HiLockClosed} from 'react-icons/hi'
import {IoKey} from 'react-icons/io5'
import {IoMdTrash} from 'react-icons/io'
import {FaUserSlash} from 'react-icons/fa'
import {RiPencilFill} from 'react-icons/ri'

import Avatar from 'react-avatar';
import '../styles/Details.scss'
import '../styles/Utilities.css'

const Details = () => {

  const db = getDatabase()
  const {ID} = useParams()
  const {currentUser} = useAuth()
  const [team, setTeam] = useState({})
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [password, setPassword] = useState('')

  const copyTeamID_ref = useRef()

  useEffect(()=> {
    const detach = onValue(ref(db, 'teams/' + ID), snapshot => { if (snapshot.exists()) setTeam(snapshot.val()) })
    return () => detach()
  }, [db, ID])

  // Kick tracker
  useEffect(() => {
    const detach = onValue(ref(db, 'teams/' + ID + '/members/'), (snapshot) => {
      if (!snapshot.exists()) return navigate('/t/add', {replace: true})
      if (!snapshot.val()[currentUser.displayName]) navigate('/t/add', {replace: true})
    })
    return () => detach()
  })

  const changeName = event => {
    event.preventDefault()
    if (!name) return
    update(ref(db, 'teams/' + ID), {name: name})
    push(ref(db, "/teams/" + ID + '/messages'), {text: `${currentUser.displayName} has changed group name to ${name}.`, type: 'prompt', date: new Date()})
    setName('')
  }

  const changePassword = event => {
    event.preventDefault()
    update(ref(db, 'teams/' + ID), {password: password})
    push(ref(db, "/teams/" + ID + '/messages'), {text: `${currentUser.displayName} has group password.`, type: 'prompt', date: new Date()})
    setPassword('')
  }
  
  const deleteMessages = async () => {
    await remove(ref(db, "/teams/" + ID + '/messages'))
    await push(ref(db, "/teams/" + ID + '/messages'), {text: `All messages has been deleted by ${currentUser.displayName}`, type: 'prompt', date: new Date()} )
  }

  const deleteGroup = async () => {
    for (let user in team.members) { await kickUser(user) }
    await remove(ref(db, 'teams/' + ID))
  }

  const kickUser = async (user) => {
    const updates = {}
    updates['users/' + user + '/teams/' + ID] = null
    updates['teams/' + ID + '/members/' + user] = null
    await update(ref(db), updates)
    await push(ref(db, "/teams/" + ID + '/messages'), {text: `${user} has been kicked.`, type: 'prompt', date: new Date()})
    
  }

  const banUser = async (user) => {
    await kickUser(user)
    await update(ref(db, 'teams/' + ID + '/banned' ), {[user]:true})
    await push(ref(db, "/teams/" + ID + '/messages'), {text: `${user} has been banned.`, type: 'prompt', date: new Date()})
  }

  const unbanUser = async (user) => {
    await remove(ref(db, "/teams/" + ID + '/banned/' + user))
    await push(ref(db, "/teams/" + ID + '/messages'), {text: `${user} has been unbanned.`, type: 'prompt', date: new Date()})
  }

  const copyTeamID = () => {
    copyTeamID_ref.current.className = "box-item copied"
    setTimeout(() => copyTeamID_ref.current.className = "box-item", 500)
    navigator.clipboard.writeText(ID)
  }

  const AdminTools = ({member}) => (
    <div className="admin-tools">
      <button className="btn btn-sm btn-outline-warning" onClick={() => kickUser(member)}>Kick</button>
      <button className="btn btn-sm btn-outline-danger" onClick={() => banUser(member)}>Ban</button>
    </div>
  )

  return (
    <main id="details" className="container">

      <div className="row justify-content-center align-items-center">
        <div className="col-12 col-sm-10 col-md-9 col-lg-7">

          <Link to={`/t/${ID}`} id="header">
              <Avatar name={team.name} round={true} size="60"   />
              <div id="team-name">{team.name}</div>
          </Link>


          {/* GENERAL */}
          <div className="box-wrapper">
            <header className="box-header">General</header>

            <div className="box dropdown">

              {/* Only for admin */}
              {team.admin === currentUser.displayName ? 
              <>
                {/*  Change Name  */}
                <div className="box-item" onClick={() => {navigator.clipboard.writeText(ID)}}>
                  <div className="box-item-left">
                    <RiPencilFill />
                    Name
                  </div>
                  <form className="input-group input-group-sm" onSubmit={e => changeName(e)}>
                    <input type="text" className="form-control" placeholder="Set a team name" value={name} onChange={e => setName(e.target.value)} />
                    <button className="btn btn-outline-secondary" type="submit">Save</button>
                  </form>
                  
                </div>

              </> : <></>}

              {/*  Team Members  */}
              <div className="box-item dropdown-toggle" data-bs-toggle="dropdown" id="dropdownMenuButton1"  >
                <div className="box-item-left ">
                  <BsPeopleFill />
                  Team members
                </div>
              </div>

              {/*  Group Members Dropdown Menu  */}
              <ul className="dropdown-menu dropdown-menu-dark p-0" aria-labelledby="dropdownMenuButton1">
                {team.members && Object.keys(team.members).map( member => (
                  <div key={member} className={`dropdown-item`}>
                    <div>{member} {member === team.admin ? <BiCrown className="text-warning" /> : <></>} </div>
                    
                    {currentUser.displayName === team.admin ? (
                      member !== currentUser.displayName ? <AdminTools member={member} /> : <></>
                    ) : <></> }

                  </div>
                ))}
              </ul>

              {/*  Team ID  */}
              <div id="team-id" className="box-item" ref={copyTeamID_ref} onClick={copyTeamID}>
                <div className="box-item-left">
                  <IoKey className="box-item-icon" />
                  Copy Team ID
                </div>
                <div className="d-none d-lg-block">{ID}</div>
                
              </div>

            </div>
          </div>
          

          {/* PRIVACY */}
          {team.admin === currentUser.displayName ? 
          <>
          <div className="box-wrapper">
            <div className="box-header">Privacy</div>

            <div className="box dropdown">

              {/*  Change Password  */}
              <div className="box-item" onClick={() => {navigator.clipboard.writeText(ID)}}>
                <div className="box-item-left">
                  <HiLockClosed />
                  Password
                </div>
                <form className="input-group input-group-sm" onSubmit={e => changePassword(e)}>
                  <input type="text" className="form-control" placeholder="Set password" value={password} onChange={e => setPassword(e.target.value)} />
                  <button className="btn btn-outline-secondary" type="submit">Save</button>
                </form>
              </div>               
              
              {/* Delete messages */}
              <div className="box-item">
                <div className="box-item-left">
                  <IoMdTrash />
                  Delete all messages
                </div>
                <button className="btn btn-sm btn-outline-danger" onClick={deleteMessages}>Delete</button>
              </div>

              {team.banned ? 
              <>

                {/*  Banned users  */}
                <div className="box-item dropdown-toggle" data-bs-toggle="dropdown" id="dropdownMenuButton2" onClick={() => {navigator.clipboard.writeText(ID)}}>
                  <div className="box-item-left">
                    <FaUserSlash />
                    Banned users
                  </div>
                </div>               
                
                {/*  Banned users Dropdown Menu  */}
                <ul className="dropdown-menu dropdown-menu-dark p-0" aria-labelledby="dropdownMenuButton2">
                  {Object.keys(team.banned).map( member => (
                    <div key={member} className={`dropdown-item`}>
                      <div>{member}</div>
                      <button className="btn btn-sm btn-outline-primary" onClick={() => unbanUser(member)}>Unban</button>
                    </div>
                  ))}
                </ul>           
              
              </> : <></>}

              {/* Delete Team */}
              <div className="box-item text-danger">
                <div className="box-item-left">
                  <IoMdTrash />
                  Delete team
                </div>
                <button className="btn btn-sm btn-outline-danger" onClick={deleteGroup}>Delete</button>
              </div>
            
            </div>
          </div>

          </> : <></>}

          

        </div>
      </div>

    </main>
  )
}

export default Details

