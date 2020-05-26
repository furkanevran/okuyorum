import { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../db'

const error = (res: NextApiResponse) => {
    let code = 500;
    res.status(code).end();
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const {page} = req.query
    const itemCount = 20

    try {
        const books = await db.books.getPage({page: +page, itemCount})
        res.status(200).json(books)
    } catch (e) {
        console.log(e)
        error(res)
    }
    error(res)
}