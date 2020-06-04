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
        const likedBefore = await db.oneOrNone(
`SELECT * FROM user_sentence_comment_likes
WHERE user_id = $1 AND comment_id = $2`,
        [ me.id , comment_id ])


        if(likedBefore) {
            throw new Error("User liked this before.")
        }

        await db.none('INSERT INTO user_sentence_comment_likes(user_id, comment_id) VALUES($1, $2)',
                     [ me.id , comment_id ])


        res.status(200).end()
        return
    } catch (error) {
        console.log(error)
    }
    res.status(500).end();
    
}