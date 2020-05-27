import { NextApiRequest, NextApiResponse } from 'next'
import { verify } from 'jsonwebtoken'
import { parse } from 'cookie'
import User from '../../../db/models/user';

const error = (res: NextApiResponse) => {
    let code = 401;
    res.status(code).end();
}

export function GetUser(req: NextApiRequest):User {
    if(req.headers.cookie) {
        const {auth} = parse(req.headers.cookie)

        if(auth) {
            try {
                return <User>(verify(auth, process.env.APP_SECRET));
            } catch (error) {
                return null
            }
        }
    }

    return null
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const me = GetUser(req)

    if(!me) {
        error(res)
        return
    }

    res.status(200).json(me)
}