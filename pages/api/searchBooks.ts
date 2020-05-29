import { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../db'

const error = (res: NextApiResponse) => {
    let code = 500;
    res.status(code).end();
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const {name} = req.query

    try {
        const books = await db.books.findByName(name+'')
        res.status(200).send(books)
    } catch (e) {
        console.log(e)
        error(res)
    }
    error(res)
}