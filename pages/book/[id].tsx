import { useRouter } from "next/router"
import { GetServerSideProps } from "next";
import { db } from '../../db'
import { useEffect, useState } from "react";
import User from "../../db/models/user";
import Book from '../../db/models/book';
import { withAuth } from "../../auth/withAuth";
import fetch from 'isomorphic-unfetch';

export interface AuthProps {
    auth: {
        user: User,
        RenderWithAuth: any
    },
    book: Book,
    isFavorited: Boolean
}

export default function({auth, book, isFavorited:_isFavorited}: AuthProps) {
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
        <>
        <RenderWithAuth>
            {isFavorited === false ? (
                <div onClick={AddToFavorites}>add to favorites</div>
            )
            : isFavorited === true ? (
                <div onClick={RemoveFromFavorites}>remove from favorites</div>
            ): null}
        </RenderWithAuth>
        <div>{JSON.stringify(book)}</div>
        <hr/>
        <div><p>{JSON.stringify(auth, null, 4)}</p></div>
        <hr/>
        <div>{JSON.stringify(id)}</div>
        </>
    )
}

export const getServerSideProps: GetServerSideProps = withAuth(async (ctx, user: User) => {
    if(ctx.params.id) {
        return {
            props: {
                book: await db.books.findById(+ctx.params.id),
                isFavorited: !!user ? !!await db.users.checkIfUserFavoritedBook({user_id: user.id, book_id: ctx.params.id}) : false
            }
        }
    }

    return {
        props: {
            book: null,
            isFavorited: null
        }
    }
})