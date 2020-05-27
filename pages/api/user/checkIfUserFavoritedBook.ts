import { NextApiRequest, NextApiResponse } from "next";
import { GetUser } from "../auth/me";
import { db } from "../../../db";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const me = GetUser(req)

    if(!me) {
        res.status(401).end();
        return
    }

    
    try {
        const book_id = <bigint><unknown>req.query.book_id;

        const ret = await db.users.checkIfUserFavoritedBook({
            user_id: me.id,
            book_id: book_id
        })

        if(ret == null) {
            res.end()
            return
        }

        res.status(200).json(1)
        return
    } catch (error) {
        console.log(error)
    }
    res.status(500).end();
    
}