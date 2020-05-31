import { NextApiRequest, NextApiResponse } from "next";
import { GetUser } from "./auth/me";
import { db } from "../../db";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const me = GetUser(req)

    if(!me) {
        res.status(401).end();
        return
    }

    try {
        const paragraph_id = +req.query.paragraph_id;

        const ret = await db.books.getParagraphComments({paragraph_id: +paragraph_id, user_id: +(me.id+'')})
        res.status(200).json(ret)
        return
    } catch (error) {
        console.log(error)
    }
    res.status(500).end();
    
}