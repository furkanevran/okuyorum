import fetch from 'isomorphic-unfetch';
import { Dispatch } from 'react';
import { me } from './me';

export const login = async (hook: Dispatch<any> = null, email, password) => {
    const ret = await fetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({'email':email,'pw':password}),
        headers: {
            'Content-Type': 'application/json',
        },
    })

    if(ret.status === 200) {
        if(hook) {
            const u = await me()
            hook(u)
        }

        window.localStorage.setItem('login', Date.now()+'')
    }

    return ret
}