import { useState } from "react"
import RenderWithAuth from "../components/renderWithAuth"

export const AuthHelper = (_isLoggedIn: boolean) => {
    const [isLoggedIn,setLoggenIn ] = useState(_isLoggedIn)
    const RenderWithAuthP = ({children, invert = false}) => (<RenderWithAuth isLoggedIn={isLoggedIn} update={setLoggenIn} invert={invert}>{children}</RenderWithAuth>)
    return [isLoggedIn, setLoggenIn, RenderWithAuthP] as const
  }