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
        const {book_id} = req.body;

        await db.users.removeBookFromFavorites({
            user_id: me.id,
            book_id: book_id
        })

        res.status(200).end()
        return
    } catch (error) {
        console.log(error)
    }
    res.status(500).end();
    
}