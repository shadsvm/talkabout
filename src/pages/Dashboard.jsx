import { Navigate, Outlet } from "react-router-dom"

import { useAuth } from "../contexts/AuthContext"

import Navbar from '../components/Navbar';
import Teams from '../components/Teams';


const Dashboard = () => {

  const {currentUser, loading} = useAuth()


  const PrivateRoute = ({children}) => (
    (loading ? (<h1>Loading</h1>) : (
      !currentUser?.displayName ? <Navigate to="/register" replace={true} /> : children
    ))
  )


  return (
    <PrivateRoute>
      <div className="container-fluid">
        <div className="row">

          <div className="col-12 col-sm-3 p-0 ">
            <Navbar type="dashboard" />
            <div className='d-none d-sm-block'><Teams /></div>
          </div>

          <div className="col p-0">
            <Outlet />
          </div>

        </div>
      </div>
    </PrivateRoute>
  )
}

export default Dashboard



  // useEffect(()=> {
  //   const setStatus = state => {
  //     if (currentUser?.displayName) update(ref(db, 'users/' + currentUser.displayName), { active: state }) }

  //   setStatus(true)
  //   return () => setStatus(false)
  // }, [currentUser, db])
