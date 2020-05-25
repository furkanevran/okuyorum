import { db } from '../db'
import Book from '../db/models/book';
import { withAuth } from '../auth/withAuth';
import Link from 'next/link';
import { logout } from '../auth/logout';
import { AuthHelper } from '../utils/AuthHelper';

type BookProps = {
  _isLoggedIn: boolean
  books: Book[]
}

const Home = ({data}) => {
  const {_isLoggedIn, books} = data.props
  const [isLoggedIn, setIsLoggedIn, RenderWithAuth] = AuthHelper(_isLoggedIn)

  return (
  <>
  <RenderWithAuth invert>
    <Link href='/login' as='login'><a>Login</a></Link>
  </RenderWithAuth>
  <RenderWithAuth>
    <a onClick={() => logout(setIsLoggedIn, false)}>Logout</a>
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

export const getServerSideProps = withAuth(async (ctx, user) => {
  const books = await db.books.getPage({itemCount: 20, page: 1})

  return {
    props: {
      _isLoggedIn: !!user,
      books
    }
  }
})

export default Home
