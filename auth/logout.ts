import Router from "next/router"

export const logout = async (redirect = true) => {
    const ret = await fetch('/api/auth/logout')
    if(ret.status === 200) window.localStorage.setItem('logout', Date.now()+'')
    if(redirect === true) Router.push('/login')
    return ret
}