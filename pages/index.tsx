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
    window.scroll({top: 0, left: 0, behavior: 'smooth' })
  }


  return (
  <>
      {paginatedBooks.books.map((x) => (
          <Link href='/book/[id]' as={`/book/${x.id}`} key={x.name}>
            <a className="book">
            
              <img src={"/epubdata/"+x.id+"/"+x.cover_filename}></img>
              <span>{x.name}</span>
            </a>
          </Link>
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
          padding: 5px 5px;
          flex: 1;
          text-align: center;
        }
        .active {
          border: 1px solid #eee;
          border-radius: 10px;
        }

        ul {
          width: 100%;
          margin: 0;
          padding: 0;
          margin-top: 15px;
          display: flex;
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
