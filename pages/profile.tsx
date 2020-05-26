import { pageAuthSync } from "../auth/pageAuthSync"

const Profile = ({auth}) => {
    const { user } = auth
    return (
        <>
        <h2>Hello {user.username}</h2>
        <h4>this is profile page</h4>
        </>
    )
}

export default pageAuthSync(Profile)