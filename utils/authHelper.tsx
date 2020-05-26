import { useState, useEffect } from "react"
import RenderWithAuth from "../components/renderWithAuth"
import { logout } from "../auth/logout"
import { login } from "../auth/login"
import { me } from "../auth/me"

export const AuthHelper = (user: any) => {
    let [currentUser,setUser] = useState(user)
    let [isLoggedIn,setLoggedIn] = useState(!!currentUser)
    let RenderWithAuthP = ({children, invert = false}) => (<RenderWithAuth isLoggedIn={isLoggedIn} update={setUser} invert={invert}>{children}</RenderWithAuth>)
    let Logout = (redirect: boolean = false) => logout(setLoggedIn, redirect)
    let Login = (email, password) => login(setUser, email, password)
    
    const syncAuth = async (event) => {
      if (event.key === 'login') {
          setUser(await me())
      }
    }

    useEffect(() => {
      setLoggedIn(!!currentUser)

      window.addEventListener('storage', syncAuth)
      return () => {
        window.removeEventListener('storage', syncAuth)
      }
    }, [currentUser])

    return [isLoggedIn, setLoggedIn, RenderWithAuthP, Logout, Login, currentUser, setUser] as const
  }