import { useState } from "react"
import RenderWithAuth from "../components/renderWithAuth"
import { logout } from "../auth/logout"
import { login } from "../auth/login"

export const AuthHelper = (user: any) => {
    const [currentUser,setUser] = useState(user)
    const [isLoggedIn,setLoggedIn] = useState(!!currentUser)
    const RenderWithAuthP = ({children, invert = false}) => (<RenderWithAuth isLoggedIn={isLoggedIn} update={setLoggedIn} invert={invert}>{children}</RenderWithAuth>)
    const Logout = (redirect: boolean = false) => logout(setLoggedIn, redirect)
    const Login = (email, password) => login(setLoggedIn, email, password)
    return [isLoggedIn, setLoggedIn, RenderWithAuthP, Logout, Login, currentUser, setUser] as const
  }