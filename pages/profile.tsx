import { pageAuthSync } from "../auth/pageAuthSync"
import { GetServerSideProps } from 'next';
import { withAuth } from "../auth/withAuth";
import { db } from "../db";

const Profile = ({auth, favoriteBooks}) => {
    const { user } = auth
    return (
        <>
        <h2>Hello {user.username}</h2>
        <h4>this is profile page</h4>
        <h4>Favorite books JSON</h4>
        
        <div>
            {favoriteBooks.map(x => (
                <div>{x.name}</div>
            ))}
        </div>
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