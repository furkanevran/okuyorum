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
    genres: Genre[],
    favCount: number
}

export default function({auth, book, isFavorited:_isFavorited, chapters, genres, favCount: _favCount}: AuthProps) {
    const router = useRouter()
    const [isFavorited, setIsFavorited] = useState(_isFavorited)
    const [favCount, setFavCount] = useState(_favCount)

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
            if(_isFavorited) {
                setFavCount(_favCount)
            } else {
                setFavCount(+_favCount+1)
            }
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
            if(_isFavorited) {
                setFavCount(+_favCount-1)
            } else {
                setFavCount(_favCount)
            }
        }
    }

    return (
        <div>
        
        <img src={"/epubdata/"+book.id+"/"+book.cover_filename}></img>
        {genres && genres.length > 0 ? (
            
        <ul>
            {genres.map(genre => (
                <li><Link href={`/search?name=${genre.genre}`} as={`/search?name=${genre.genre}`}>
                <a>{genre.genre}</a>    
                </Link></li>
            ))}
        </ul>
            ) : null}
        
        <h1 style={{marginBottom: 10}}>{book.name}</h1> 
        <div className="heart">
        <RenderWithAuth>
            <>
            {isFavorited === false ? (
                <div onClick={AddToFavorites}>
                    <FaHeart style={{color: 'white', fontSize: 24}}></FaHeart>
                    <div>{favCount}</div>
                </div>
            )
            : isFavorited === true ? (
                <div onClick={RemoveFromFavorites}>
                    <FaHeart style={{color: 'red', fontSize: 24}}></FaHeart>
                    <div>{favCount}</div>
                </div>
            ): null}
            </>
        </RenderWithAuth>
        <RenderWithAuth invert>
            <Link href="/login">
            <div>
                <FaHeart style={{color: '#888', fontSize: 24, cursor: 'pointer'}}></FaHeart>
                <div>{favCount}</div>
            </div>
            </Link>
        </RenderWithAuth>
        
        </div>
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
    margin-top: 10px;
}

ul {
    margin: 0;
    padding: 0;
    display: flex;
    margin-top: 10px;
    flex-wrap: wrap;
}

li > a {
    height: 100%;
    width: 100%;
    display: block;
    padding: 10px 10px !important;
}
.heart > div {
    display: flex;
    width: 100px;
    height: 40px;
    line-height: 40px;
    cursor: pointer;
}

.heart div > div {
    margin-left: 10px;
}
            `}</style>
            <style>
                {`
                .desc p,.desc  span,.desc div,.desc  h1,.desc  h2,.desc  h3,.desc  h4,.desc  h5,.desc  h6,.desc  article {
                    color: #fff !important;
                    background-color: #000 !important;
                    max-width: 100%;
                }
                .heart svg {
                    margin-top: 9px;
                }
                `}
            </style>
        </div>
    )
}

export const getServerSideProps: GetServerSideProps = withAuth(async (ctx, user: User) => {
    let favC = 0
    if(ctx.params.id) {
        favC = (await db.oneOrNone(`SELECT SUM(1) FROM books
        INNER JOIN user_favorite_books ufb on books.id = ufb.book_id
        WHERE id = $1
        GROUP BY id;`, [+ctx.params.id]))

        return {
            props: {
                book: await db.books.findById(+ctx.params.id),
                isFavorited: !!user ? !!await db.users.checkIfUserFavoritedBook({user_id: user.id, book_id: ctx.params.id}) : false,
                chapters: await db.books.getChapters(ctx.params.id as bigint),
                genres: await db.books.findGenresById(+ctx.params.id),
                favCount: !favC ? 0 : favC['sum']
            }
        }
    }

    return {
        props: {
            book: null,
            isFavorited: null,
            chapters: null,
            genres: null,
            favCount: favC
        }
    }
})