import fetch from 'isomorphic-unfetch';
import { Dispatch } from 'react';

export const login = async (hook: Dispatch<any> = null, email, password) => {
    const ret = await fetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({'email':email,'pw':password}),
        headers: {
            'Content-Type': 'application/json',
        },
    })

    if(ret.status === 200) {
        window.localStorage.setItem('login', Date.now()+'')
        if(hook) {
            hook(true)
        }
    }

    return ret
}