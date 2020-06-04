import { pageAuthSync } from "../auth/pageAuthSync"
import { GetServerSideProps } from 'next';
import { withAuth } from "../auth/withAuth";
import { db } from "../db";
import Collapse from "../components/Collapse";
import Link from "next/link";
import async from './api/user/favoriteComment';
import decodeHtml from "../utils/unescapeHtml";
import ReactHtmlParser from 'react-html-parser';

const Profile = ({auth, favoriteBooks, comments}) => {
    const { user } = auth
    return (
        <>
        <h2>Hello {user.username}</h2>
        <h4>Favorite Books</h4>
        <Collapse>
        <div>
            {favoriteBooks.map(x => (
            <Link href='/book/[id]' as={`/book/${x.id}`} key={x.name}>
                <a className="book">
                
                <img src={"/epubdata/"+x.id+"/"+x.cover_filename}></img>
                <span>{x.name}</span>
                </a>
           </Link>
            ))}
        </div>
        </Collapse>
        <hr />
        <h4>Comments</h4>
        <Collapse>
        <div>
            {comments && comments.map(x => (
                <pre key={x.commentid} style={{marginTop: 20, borderLeft: '3px solid #fff', paddingLeft: 15}}>
                    <Link href='/book/[id]' as={`/book/${x.bookid}`}><a>{x.bookname}</a></Link>
                    <Link href='/book/[id]/chapter/[chapter]' as={`/book/${x.bookid}/chapter/${x.chapterid}`}><a style={{marginLeft: 15}}>{x.chaptername+'. Bölüm'}</a></Link>
                    <div>{ReactHtmlParser(decodeHtml(x.text))}</div>
                    <div style={{marginLeft: 20, borderLeft: '1px solid #fff', paddingLeft: 15}}>
                        {x.comment}
                    </div>
                </pre>
            ))}
        </div>
        </Collapse>
        <style jsx>{`
            pre {
                max-width: 100%;
                white-space: pre-wrap;
                word-break: break-all;
            }
            `}</style>
        </>
    )
}

export default pageAuthSync(Profile)

export const getServerSideProps: GetServerSideProps = withAuth(async (ctx, user) => {
    if(!user) {
        return {
            props: {}
        }
    }

    return {
        props: {
            favoriteBooks: await db.users.getAllFavoriteBooks(user.id),
            comments: await db.manyOrNone(`SELECT sc.id as commentid, text, comment, username, b.name as bookname, bc.name as chaptername, b.id as bookid, bc.id as chapterid, chst.id as pid FROM sentence_comments as sc
            INNER JOIN users u on sc.user_id = u.id
            INNER JOIN chapter_sentences as chst ON  chst.id = sc.sentence_id
            INNER JOIN book_chapters bc on chst.chapter_id = bc.id
            INNER JOIN books b on bc.book_id = b.id
            WHERE user_id = $1;`, [user.id])
        }
    }
})