import Router from "next/router"

export const logout = async () => {
    await fetch('/api/auth/logout')
    window.localStorage.setItem('logout', Date.now()+'')
    Router.push('/login')
}