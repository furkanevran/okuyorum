import { pageAuthSync } from "../auth/pageAuthSync"
import { GetServerSideProps } from 'next';
import { withAuth } from "../auth/withAuth";
import { db } from "../db";
import Collapse from "../components/Collapse";
import Link from "next/link";

const Profile = ({auth, favoriteBooks}) => {
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
            favoriteBooks: await db.users.getAllFavoriteBooks(user.id)
        }
    }
})