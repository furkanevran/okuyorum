import { db } from '../db'
import Book from '../db/models/book';
import Link from 'next/link';
import { withAuth } from '../auth/withAuth';

type BookProps = {
  _isLoggedIn: boolean
  books: Book[]
}

const Home = ({auth, books}) => {
  const {RenderWithAuth, Logout} = auth

  return (
  <>
  <Link href='/protected' as='protected'><a>protected</a></Link>
  <RenderWithAuth invert>
    <Link href='/login' as='login'><a>Login</a></Link>
  </RenderWithAuth>
  <RenderWithAuth>
    <a onClick={() => Logout(false)}>Logout</a>
  </RenderWithAuth>
      {books.map((book) => (
        <div key={book.name}>
          <span>{book.id}</span>
          <span> --- </span>
          <span>{book.name}</span>
          <br></br>
        </div>
      ))}
  </>
  )
}

export const getServerSideProps = async (ctx) => {
  const books = await db.books.getPage({itemCount: 20, page: 1})

  return {
    props: {
      books
    }
  }
}

export default Home
