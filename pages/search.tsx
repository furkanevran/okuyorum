import { useState, useEffect, createRef } from 'react';
import Link from "next/link"
import { useDebouncedSearch } from '../utils/useDebouncedSearch';
import { useRouter } from "next/router";
import Head from 'next/head';
import { GetServerSideProps } from 'next';
import { db } from '../db';
import { books } from '../db/sql/index';

const asyncSearch = async (book) => {
    try {
        const ret = await fetch('/api/searchBooks?name='+book, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
    
        return (await ret.json())
    } catch (e) {
        console.log(e)
        return []
    }
}

const useSearchBooks = () => useDebouncedSearch(text => asyncSearch(text))


export default function({auth, books}) {
    const router = useRouter()
    const { inputText, setInputText, searchResults } = useSearchBooks();
    const [result, setResult] = useState(books)
    const [didChange, setDidChange] = useState(false)

    const focusRef = createRef<HTMLInputElement>()
    const urlSearch = (text) => {
        text = text.replace('%' ,'')
        router.push('/search?name='+encodeURI(text), undefined, { shallow: true })
        setInputText(text)
    }
    useEffect(() => {
        if(didChange === true || (searchResults.result && searchResults.result.length > 0)) {
            setResult(searchResults.result)
            setDidChange(true)
        }
    }, [searchResults.result])

    useEffect(() => {
        if(router.query.name) {
            if (router.query.name.includes('%')) {
                router.push('/search', undefined, { shallow: true })
            } else {
                focusRef.current.value = router.query.name+''
            }
            
        }
        
        if(result && result.length === 0) {
            focusRef.current.focus()
        }
    })

    return (
        <>
        <Head>
            <title>{!!router.query.name ? `${unescape(router.query.name+'')} - Search` : 'Search'}</title>
        </Head>
            <input type='text' placeholder={'Dorian Gray\'s Portrait'}
            value={inputText} onChange={e => urlSearch(e.target.value)}
            ref={focusRef}></input>

             {searchResults.loading && <div>Loading...</div>}
             {result && (result.map((x) => (
                <Link href='/book/[id]' as={`/book/${x.id}`} key={x.name}>
                  <a className="book">
                  
                    <img src={"/epubdata/"+x.id+"/"+x.cover_filename}></img>
                    <span>{x.name}</span>
                  </a>
                </Link>
            )))}

            <style jsx>{`
            input {
                box-sizing: border-box;
                display: block;
                width: 100%;
                padding: 5px 10px;
                border-radius: 10px;
                margin-top: 10px;
                font-size: 18px;
                background-color: transparent;
                outline: none;
                border: 1px solid #eee;
                color: #fff;
                margin-bottom: 25px;
            }
             `}</style>
        </>
        
    )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    if(ctx.query.name && unescape(ctx.query.name+'').includes('%')) return { props: { books: []} }

    return {
        props: (!!ctx.query.name ? {
            books: await db.books.findByName(unescape(ctx.query.name+''))
        } : {
            books: []
        })
    }
}