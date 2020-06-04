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

        const comment = await db.one(`SELECT user_id FROM sentence_comments
                                      WHERE id = $1`,
                                      [ comment_id ])

        if(comment['user_id'] !== me.id) {
            throw new Error("This comment is not associated with current user.")
        }

        await db.none(`DELETE FROM sentence_comments
                       WHERE id = $1`,
                       [ comment_id ])

        res.status(200).end()
        return
    } catch (error) {
        console.log(error)
    }
    res.status(500).end();
    
}