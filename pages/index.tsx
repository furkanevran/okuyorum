import Head from 'next/head'
import { GetServerSideProps } from 'next'
import { db } from '../db'
import Book from '../db/models/book';

type BookProps = {
  books: Book[]
}

const Home = ({books}: BookProps) => {
  return (
  <>
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

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const books = await db.books.getPage({itemCount: 20, page: 1})

  return {
    props: {
      books
    }
  }
}

export default Home
