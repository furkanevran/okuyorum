import { db } from '../db'
import Book from '../db/models/book';
import Link from 'next/link';
import { withAuth } from '../auth/withAuth';
import PaginatedBooks from '../db/models/paginatedBooks';
import ReactPaginate from 'react-paginate';
import { useState } from 'react';
import { useRouter } from 'next/router';

type BookProps = {
  auth: any
  paginatedBooks: PaginatedBooks
}

const Home = ({auth, paginatedBooks}: BookProps) => {
  const router = useRouter()
  const [page, setPage] = useState(!!router.query.page ? +router.query.page : 1)
  const {RenderWithAuth, Logout, user} = auth

  const changePage = (page) => {
    page = page.selected+1
    router.push('/?page='+page, '/?page='+page, {
      query: {page: page}
    })
    setPage(page)
  }


  return (
  <>
  <Link href='/protected' as='protected'><a>protected</a></Link>
  <RenderWithAuth invert>
    <Link href='/login' as='login'><a>Login</a></Link>
  </RenderWithAuth>
  <RenderWithAuth>
    <a onClick={() => Logout(false)}>Logout</a>
    <h1>Hello '{user.username}'</h1>
  </RenderWithAuth>
  
      {paginatedBooks.books.map((book) => (
        <div key={book.name}>
          <span>{book.id}</span>
          <span> --- </span>
          <span>{book.name}</span>
          <br></br>
        </div>
      ))}
      <ReactPaginate
      pageCount={paginatedBooks.pageCount}
      onPageChange={changePage}
      activeClassName={'active'}
      initialPage={page-1}
      ></ReactPaginate>
      <style>{`
        li {
          display: inline-block;
          margin: 0 10px;
        }
        .active {
          background-color: red;
        }
        `}</style>
  </>
  )
}

export const getServerSideProps = async (ctx) => {
  const books = await db.books.getPage({itemCount: 20, page: !ctx.query.page ? 1 : ctx.query.page})

  return {
    props: {
      paginatedBooks: books
    }
  }
}

export default Home
