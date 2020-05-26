import { db } from '../db'
import Book from '../db/models/book';
import {withAuth} from '../auth/withAuth'
import { withAuthSync } from '../auth/withAuthSync';
import Link from 'next/link';
import { pageAuthSync } from '../auth/pageAuthSync';

type ProtectedProps = {
    a: boolean
    books: Book[]
    auth: any,
    query: string
  }

function protectedPage({a, books, query, auth}: ProtectedProps) {
    if(!books) return (<h1>what</h1>)
    return (
    <>
      <Link href='/' ><a>index</a></Link>
      <h1>Hello {auth.user.username}</h1>
        <h1>A: {a+''}</h1>
        
        <hr/>
        <h2>Books that include '{query}'</h2>
        {books.map((book => (
            <li key={book.name}>{book.name}</li>
        )))}
    </>
    )
}

export const getServerSideProps = withAuth(async (ctx, user) => {
    if(!user) return {props:{}}
    const query = 'EV'
    const search = await db.books.findByName(query);
    return {
        props: {
            a: true,
            books: search,
            query
        }
    }
})

export default pageAuthSync(protectedPage)