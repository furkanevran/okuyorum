import Router from "next/router"
import { Dispatch } from "react"

export const logout = async (hook: Dispatch<any> = null,redirect = false) => {
    const ret = await fetch('/api/auth/logout')
    if(ret.status === 200 && redirect === true) Router.push('/login')
    if(ret.status === 200) {
        window.localStorage.setItem('logout', Date.now()+'')
        if(hook) {
            hook(false)
        }
    }
    return ret
}