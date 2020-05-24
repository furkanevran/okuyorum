import { db } from '../../../db'
import { NextApiRequest, NextApiResponse } from 'next'
import { hash } from  'bcrypt'

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if(req.method !== "POST") {
        res.status(405).end();
    }

    try {
       const {username, email , pw } = req.query;
       if((!email || email.length < 6) || (!pw || pw.length < 6) || (!username || username.length < 6)) {
        res.status(400).end(); 
       }

       const password_hash = await hash(pw, 12);
       const post = db.users.create({username: <string>username, email: <string>email, password_hash})
       res.status(200).json(post);
    } catch (e) {
       console.error(e);
       let message = "A error occured.";
       let code = 500;
       if(e.code === '23505') {
           code = 400;
           message = "E-Mail or username already exists."
       }
       res.status(code).json({message});
    }
 };
  