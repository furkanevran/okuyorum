import { useRouter } from "next/router"
import getConfig from 'next/config'
import { db } from "../../../../db"
import decodeHtml from "../../../../utils/unescapeHtml"
import User from '../../../../db/models/user';
import Paragraph from '../../../../db/models/paragraph';
import Link from "next/link";
const { serverRuntimeConfig } = getConfig()

export interface ChapterTypes {
    auth: {
        user: User
    },
    css: string[],
    data: Paragraph[],
    nextChapter: any
}

export default function({auth, css, data, nextChapter} : ChapterTypes) {
    
    const router = useRouter()
    const {id, chapter} = router.query
    
    return (
        <>
        {css ? css.map(file => (
            <link href={file} rel="stylesheet"></link>
        )): null}
        {data ? data.map(p => (
            <p key={p.id+''} dangerouslySetInnerHTML={{__html: decodeHtml(p.text)}}></p>
        )) : null}
        {nextChapter ? (<Link href='/book/[id]/chapter/[chapter]' as={`/book/${id}/chapter/${nextChapter['id']}`}>Load Next Chapter</Link>) : null}
        </>
    )
}

export async function getServerSideProps({params}) {
    try {
    const path = require('path');
    const fs = require('fs');
    const dataPath = path.join(serverRuntimeConfig.PROJECT_ROOT ,'public', 'epubdata', params.id, '/');
    const css = []
    const files = fs.readdirSync(dataPath);
    
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if(file.endsWith('.css')) {
            css.push('/epubdata/' + params.id+ '/'+ file)
        }
    }
    
    return {
        props: {
            css,
            data: await db.books.getParagraphs(params.chapter as bigint),
            nextChapter: (await db.oneOrNone(`SELECT id FROM book_chapters
            WHERE id > $1 AND book_id = (SELECT book_id FROM book_chapters WHERE id = $1)
            ORDER BY name::integer ASC
            LIMIT 1`, params.chapter))
        }
    }
} catch (error) {
        console.log(error)
        return {
            props: {
                css: null,
                data: null,
                nextChapter: null
            }
        }
}
}