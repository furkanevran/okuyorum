import Router from "next/router"
import { Dispatch } from "react"

export const logout = async (hook: Dispatch<any> = null,redirect = true) => {
    const ret = await fetch('/api/auth/logout')
    if(ret.status === 200) {
        window.localStorage.setItem('logout', Date.now()+'')
        if(hook) {
            hook(false)
        }
    }
    if(redirect === true) Router.push('/login')
    return ret
}