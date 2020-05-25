import fetch from 'isomorphic-unfetch';

export const login = async (email, password) => {
    const ret = await fetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({'email':email,'pw':password}),
        headers: {
            'Content-Type': 'application/json',
        },
    })

    if(ret.status === 200) window.localStorage.setItem('login', Date.now()+'')

    return ret
}