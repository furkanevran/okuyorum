import { useRouter } from "next/router"
import getConfig from 'next/config'
import { db } from "../../../../db"
import decodeHtml from "../../../../utils/unescapeHtml"
import User from '../../../../db/models/user';
import Paragraph from '../../../../db/models/paragraph';
import Link from "next/link";
import { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa'
import ReactHtmlParser from 'react-html-parser';
const { serverRuntimeConfig } = getConfig()

export interface ChapterTypes {
    auth: {
        user: User
    },
    css: string[],
    data: Paragraph[],
    nextChapter: any
}

const CommentModal = ({auth, isOpen, p, close}) => {
    if(!auth.user || !isOpen) return (null)

    function shouldIClose(e) {
        if(!e.target.className || typeof e.target.className.includes === 'undefined') return
        if(e.target.className.includes('modal')) {
            close()
        }
    }

    return (
        <div className="modal" onClick={shouldIClose}>
        <div className="content">
            <div className="p" dangerouslySetInnerHTML={{__html: decodeHtml(p.text)}}></div>
            <div className="close" onClick={close}><FaTimes></FaTimes></div>
        </div>
        <style jsx>{`
            .modal {
                position: fixed;
                top: 0; left: 0;
                bottom: 0; right: 0;
                width: 100%;
                height: auto;
                z-index: 999999;
                background-color: rgba(0,0,0,0.4);
                
            }

            .content {
                position: relative;
                top: 50px;
                max-width: 650px;
                margin: 0 auto;
                overflow-y: auto;
                max-height: calc(100% - 100px);
                background-color: #111;
                padding: 10px 10px;
                padding-top: 30px;
            }

            .p {
                padding: 13px 13px;
            }

            .close {
                position: absolute;
                top: 5px; right: 5px;
            }
        `}</style>
        <style>{`
                    body, html {
                        overflow: hidden !important;
                    }

                    .p p {
                        outline: 3px solid #fff !important;
                        font-family: 'Open Sans', sans-serif;
                    }
        `}</style>
        </div>
    )
}

export default function({auth, css, data, nextChapter} : ChapterTypes) {
    const router = useRouter()

    const {id, chapter} = router.query
    const [activeP, setActiveP] = useState(null)
    const [isOpen, setIsOpen] = useState(null)
    
    function clicked(e, p) {
        if(e) {
            if(e.target instanceof HTMLParagraphElement
                || e.target instanceof HTMLSpanElement
                || e.target instanceof HTMLTableElement ) {
                setActiveP(p)
                setIsOpen(true)
                router.push('/book/[id]/chapter/[chapter]?comment=[comment]',
                            `/book/${id}/chapter/${chapter}?comment=${p.id}`, {shallow: true})
            }
     } else {
         if(p) {
            setActiveP(p)
            setIsOpen(true)
         }
     }
    }

    useEffect(() => {
        if(isOpen === false && router.query.comment) {
            router.back()
        }
    },[isOpen])

    useEffect(() => {
        if(!router.query.comment && isOpen !== null) {
            setIsOpen(false)
        }
    },[router.query.comment])
    
    return (
        <>
        {css ? css.map(file => (
            <link href={file} rel="stylesheet"></link>
        )): null}
        <CommentModal auth={auth} close={() => setIsOpen(false)} isOpen={isOpen} p={activeP}></CommentModal>
        {data ? data.map(p => {
            if(isOpen === null && router.query.comment) {
                if(p.id+'' === router.query.comment+'') {
                    clicked(null, p)
                }
            }
            return (
            <div key={p.id+''} onClick={(e) => clicked(e, p)} className='okuyorum' >
<div key={p.id+''+1}>{ReactHtmlParser(decodeHtml(p.text))}</div>
            </div>
            
        )}) : null}
        {nextChapter ? (<Link href='/book/[id]/chapter/[chapter]' as={`/book/${id}/chapter/${nextChapter['id']}`}><a>Load Next Chapter</a></Link>) : null}
        <style>{`
        p {
    display: inline !important;
    transition: all 0.182s ease-in;
    outline-offset: 10px;
    outline: 3px solid transparent;
}

p:hover {
    outline: 3px solid #fff;
}

img {
    max-width: 100%;
}

.okuyorum {
    position: relative;
}
        `}</style>
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