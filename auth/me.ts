import fetch from 'isomorphic-unfetch';
import { Dispatch } from 'react';

export const me = async () => {
    const ret = await (await fetch('/api/auth/me', {
        headers: {
            'Content-Type': 'application/json',
        },
    })).json()

    return ret
}