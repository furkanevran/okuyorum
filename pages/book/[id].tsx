import { useRouter } from "next/router"
import { GetServerSideProps } from "next";
import { db } from '../../db'
import { useEffect } from "react";

export default function({auth, book}) {
    const router = useRouter()
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
    return (
        <>
        <RenderWithAuth>
            <div>add to favorites</div>
        </RenderWithAuth>
        <div>{JSON.stringify(book)}</div>
        <hr/>
        <div><p>{JSON.stringify(auth, null, 4)}</p></div>
        <hr/>
        <div>{JSON.stringify(id)}</div>
        </>
    )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    if(ctx.params.id) {
        return {
            props: {
                book: await db.books.findById(+ctx.params.id)
            }
        }
    }

    return {
        props: {
            book: null
        }
    }
}