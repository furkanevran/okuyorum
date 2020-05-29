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
export interface AuthProps {
    auth: {
        user: User,
        RenderWithAuth: any
    },
    book: Book,
    chapters: Chapter[],
    isFavorited: Boolean
}

export default function({auth, book, isFavorited:_isFavorited, chapters}: AuthProps) {
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
        
        <h1 style={{marginBottom: 10}}>{book.name}</h1> 
        <RenderWithAuth>
            {isFavorited === false ? (
                <FaHeart style={{color: 'white', fontSize: 24, cursor: 'pointer'}} onClick={AddToFavorites}></FaHeart>
            )
            : isFavorited === true ? (
                <FaHeart style={{color: 'red', fontSize: 24, cursor: 'pointer'}} onClick={RemoveFromFavorites}>remove from favorites</FaHeart>
            ): null}
        </RenderWithAuth>
        
        <div key={book.id+'d'} dangerouslySetInnerHTML={{__html: decodeHtml(book.description)}}></div>
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
            `}</style>
        </div>
    )
}

export const getServerSideProps: GetServerSideProps = withAuth(async (ctx, user: User) => {
    if(ctx.params.id) {
        return {
            props: {
                book: await db.books.findById(+ctx.params.id),
                isFavorited: !!user ? !!await db.users.checkIfUserFavoritedBook({user_id: user.id, book_id: ctx.params.id}) : false,
                chapters: await db.books.getChapters(ctx.params.id as bigint)
            }
        }
    }

    return {
        props: {
            book: null,
            isFavorited: null,
            chapters: null
        }
    }
})