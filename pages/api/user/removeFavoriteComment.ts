import { NextApiRequest, NextApiResponse } from "next";
import { GetUser } from "../auth/me";
import { db } from "../../../db";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if(req.method !== "POST") {
        res.status(405).end();
        return
    }

    const me = GetUser(req)

    if(!me) {
        res.status(401).end();
        return
    }

    
    try {
        const {comment_id} = req.body;
        
        await db.none(`DELETE FROM user_sentence_comment_likes
                       WHERE comment_id = $2 AND user_id = $1`,
        [ me.id, comment_id ])

        res.status(200).end()
        return
    } catch (error) {
        console.log(error)
    }
    res.status(500).end();
    
}