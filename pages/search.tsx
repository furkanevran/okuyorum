import { useState } from "react"
import Link from "next/link"
import { useDebouncedSearch } from '../utils/useDebouncedSearch';

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


export default function({auth}) {
    const { inputText, setInputText, searchResults } = useSearchBooks();


    return (
        <>
            <input type='text' placeholder={'Dorian Gray\'s Portrait'}
            value={inputText} onChange={e => setInputText(e.target.value)}
            autoFocus={true}></input>

             {searchResults.loading && <div>Loading...</div>}
             {searchResults.result && (searchResults.result.map((x) => (
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