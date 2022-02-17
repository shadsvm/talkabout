import React, { useContext, useEffect, useState } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from '../firebase';

const AuthContext = React.createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({children}) => {

  const [currentUser, setCurrentUser] = useState()
  const [loading, setLoading] = useState(true)
  const signup = (email, password) => createUserWithEmailAndPassword(auth, email, password)
  const signin = (email, password) => signInWithEmailAndPassword(auth, email, password)
  const signout = () => signOut(auth)

  useEffect(()=>{
    const unsubscribe = auth.onAuthStateChanged(user => {
      setCurrentUser(user); 
      setLoading(false)
    })
    return unsubscribe
  }, [])

  const value = {currentUser, signup, signin, signout, loading}

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// export default AuthContext;
