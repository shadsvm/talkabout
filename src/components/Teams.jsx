
import React, { useEffect, useState } from 'react';
import { useNavigate, Link, useParams } from "react-router-dom"

import { useAuth } from '../contexts/AuthContext';
import { getDatabase, ref, get, child } from "firebase/database";

import Avatar from 'react-avatar';
import {CgDetailsMore} from 'react-icons/cg'
import '../styles/Teams.scss'


const Teams = () => {

  const navigate = useNavigate()
  const {ID} = useParams()
  const db = getDatabase()
  const {currentUser, loading} = useAuth()
  const [teams, setTeams] = useState([])
  

  // If path doesn't have params, redirect to first team 
  // useEffect(()=> {
  //   if (!loading && !ID && teams.length) navigate("/t/"+teams[0].id, { replace: true })
  // }, [teams, navigate, ID, loading ])

  useEffect(()=> {
    if(window.location.pathname === '/t' && teams.length && !loading)
      navigate("/t/"+teams[0].id, { replace: true })
  }, [teams, loading, navigate])

  // If user is logged, fetch teams (if user isn't member of any team, redirect to /add )
  useEffect(()=> {
    const fetchTeams = async () => {
      const dbRef = ref(db)
      const IDs_Snapshot = await get(child(dbRef, 'users/' + currentUser.displayName + '/teams'))
      if (IDs_Snapshot.exists()){
        const IDs = Object.keys(IDs_Snapshot.val())
        const tempTeams = []
        for (const teamID of IDs){
          const Team_Snapshot = await get(child(dbRef, 'teams/' + teamID ))
          if (Team_Snapshot.exists()) tempTeams.push({
            id: teamID, 
            name: Team_Snapshot.val().name, 
            lastMessage: Team_Snapshot.val().lastMessage})
        }
        setTeams(tempTeams)
      } else { navigate("/t/add", { replace: true }); console.log('user doesnt have any teams, navigate to add') }
    }
    if (!loading) fetchTeams()
  }, [db, currentUser, navigate, loading])


  return (
    <main id='teams-container' > 

      <div id='teams-list' >
        {teams && teams.map(team => (<div className={`team ${ID===team.id ? 'team-active' : ''}`}  key={team.id}>
          <Link to={`/t/${team.id}`} className='team-info' >
            <Avatar name={team.name} round={true} size="30" textSizeRatio={1.5} />
            <div className='d-flex flex-column'>
              <div className='team-name'>{team.name}</div>
              {team?.lastMessage?.user && team?.lastMessage?.text ? 
              (<div className='team-last-message text-muted'>{team.lastMessage.user}: {team?.lastMessage.text}</div>) : <></> }
            </div>
          </Link>

          <Link to={`/t/${team.id}/details`} className='team-details'>
            <CgDetailsMore />
          </Link>
        
        </div>))}
      </div>
    </main>
  )
};

export default Teams;

// {!currentUser?.displayName ? <Navigate to="/register" replace={true} /> : (
