import { useRouter } from "next/router"
import { GetServerSideProps } from "next";
import { db } from '../../../db'
import { useEffect, useState } from "react";
import User from "../../../db/models/user";
import Book from '../../../db/models/book';
import { withAuth } from "../../../auth/withAuth";
import fetch from 'isomorphic-unfetch';
import ReactHtmlParser from 'react-html-parser'
import Chapter from "../../../db/models/chapter";
import Link from "next/link";
import { FaHeart } from 'react-icons/fa'
import decodeHtml from '../../../utils/unescapeHtml';
import Genre from '../../../db/models/genre';
export interface AuthProps {
    auth: {
        user: User,
        RenderWithAuth: any
    },
    book: Book,
    chapters: Chapter[],
    isFavorited: Boolean,
    genres: Genre[]
}

export default function({auth, book, isFavorited:_isFavorited, chapters, genres}: AuthProps) {
    const router = useRouter()
    const [isFavorited, setIsFavorited] = useState(_isFavorited)


    if(!book) {
        useEffect(() => {
            router.back()
        })
        return (<>
        <h1>Sorry, no book found.</h1>
        <h2>Redirecting...</h2>
        </>)
    }
    const {id} = router.query

    const {RenderWithAuth} = auth

    const AddToFavorites = async () => {
        const ret = await fetch('/api/user/addBookToFavorites', {
            method: 'POST',
            body: JSON.stringify({'book_id':id}),
            headers: {
                'Content-Type': 'application/json',
            },
        })

        if(ret.status === 200) {
            setIsFavorited(true)
        }
    }

    const RemoveFromFavorites = async () => {
        const ret = await fetch('/api/user/removeBookFromFavorites', {
            method: 'POST',
            body: JSON.stringify({'book_id':id}),
            headers: {
                'Content-Type': 'application/json',
            },
        })

        if(ret.status === 200) {
            setIsFavorited(false)
        }
    }

    return (
        <div>
        
        <img src={"/epubdata/"+book.id+"/"+book.cover_filename}></img>
        <ul>
            {genres && genres.map(genre => (
                <li><Link href={`/search?name=${genre.genre}`} as={`/search?name=${genre.genre}`}>
                <a>{genre.genre}</a>    
                </Link></li>
            ))}
        </ul>
        <h1 style={{marginBottom: 10}}>{book.name}</h1> 
        <RenderWithAuth>
            {isFavorited === false ? (
                <FaHeart style={{color: 'white', fontSize: 24, cursor: 'pointer'}} onClick={AddToFavorites}></FaHeart>
            )
            : isFavorited === true ? (
                <FaHeart style={{color: 'red', fontSize: 24, cursor: 'pointer'}} onClick={RemoveFromFavorites}>remove from favorites</FaHeart>
            ): null}
        </RenderWithAuth>
        
        <div key={book.id+'d'} className="desc">{ReactHtmlParser(decodeHtml(book.description))}</div>
        <hr></hr>
        {chapters.map((x,i) => (
            <Link key={x.name} href={`/book/[id]/chapter/[chapter]`} as={`/book/${id}/chapter/${x.id}`} >
            <a>Bölüm {x.name}</a>
          </Link> 
        ))}
        <style jsx>{`
            a {
                box-sizing: border-box;
                width: 100%;
                display: block;
                padding: 5px 0;
            }
            img {
                width: 100%;
            }
            li {
    list-style: none;
    margin-right: 10px;
    border: 1px solid #eee;
    border-radius: 10px;
}

ul {
    margin: 0;
    padding: 0;
    display: flex;
    margin-top: 20px;
}

li > a {
    height: 100%;
    width: 100%;
    display: block;
    padding: 10px 10px !important;
}
            `}</style>
            <style>
                {`
                .desc p,.desc  span,.desc div,.desc  h1,.desc  h2,.desc  h3,.desc  h4,.desc  h5,.desc  h6,.desc  article {
                    color: #fff !important;
                    background-color: #000 !important;
                    max-width: 100%;
                }
                `}
            </style>
        </div>
    )
}

export const getServerSideProps: GetServerSideProps = withAuth(async (ctx, user: User) => {
    if(ctx.params.id) {
        return {
            props: {
                book: await db.books.findById(+ctx.params.id),
                isFavorited: !!user ? !!await db.users.checkIfUserFavoritedBook({user_id: user.id, book_id: ctx.params.id}) : false,
                chapters: await db.books.getChapters(ctx.params.id as bigint),
                genres: await db.books.findGenresById(+ctx.params.id)
            }
        }
    }

    return {
        props: {
            book: null,
            isFavorited: null,
            chapters: null,
            genres: null
        }
    }
})