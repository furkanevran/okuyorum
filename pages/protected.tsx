import { db } from '../db'
import Book from '../db/models/book';
import {withAuth} from '../auth/withAuth'
import { withAuthSync } from '../auth/withAuthSync';

type ProptectedProps = {
    a: boolean
    books: Book[]
    user: any,
    query: string
  }

function protectedPage({a, books, user, query}: ProptectedProps) {
    return (
    <>
        <h1>A: {a+''}</h1>
        <h1>Hello {user.username}</h1>
        <hr/>
        <h2>Books that include '{query}'</h2>
        {books.map((book => (
            <li key={book.name}>{book.name}</li>
        )))}
    </>
    )
}

export const getServerSideProps = withAuth(async (ctx, user) => {
    if (!user) return {props:{}}

    const query = 'EV'
    const search = await db.books.findByName(query);
    return {
        props: {
            a: true,
            books: search,
            user,
            query
        }
    }
});

export default withAuthSync(protectedPage)