import { NextApiRequest, NextApiResponse } from 'next'
import { verify } from 'jsonwebtoken'
import { parse } from 'cookie'

const error = (res: NextApiResponse) => {
    let code = 401;
    res.status(code).end();
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if(req.headers.cookie) {
        const {auth} = parse(req.headers.cookie)

        if(auth) {
            try {
                res.status(200).json(verify(auth, process.env.APP_SECRET));
            } catch (error) {
                error(res)
            }
        }
    }

    error(res)
}