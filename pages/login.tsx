import Link from 'next/link'
import { logout } from '../auth/logout';
import { withAuth } from '../auth/withAuth';
import { useEffect } from 'react';
import { login } from '../auth/login';
import { useRouter } from 'next/router'
import { AuthHelper } from '../utils/AuthHelper';

export default function Login({data}, query) {
    const [isLoggedIn, setIsLoggedIn, RenderWithAuth] = AuthHelper(data.props.isLoggedIn)
    const router = useRouter()

    useEffect(() => {
        if(isLoggedIn) {
            if (router.query.return) {
                router.push(router.query.return+'')
            } else {
               router.push('/')
            }
        }
    })

    const setCookie = async () => {
        const ret = await login('test123@test.com', '123456')
        if(ret.status === 200) {
            setIsLoggedIn(true)
        }
    }

    const signOut = async () => {
        const ret = await logout()
        if(ret.status === 200) {
            setIsLoggedIn(false)
        }
    }

    return (<>
    <div>
        <Link href='/protected' as={`/protected`}>
            <a>PROTECTED</a>
        </Link>
    </div>
    
    <div><a onClick={() => setCookie()}>set cookie</a></div>
    
    <div><a onClick={() => signOut()}>log out</a></div>

    <RenderWithAuth>
        <div>
            <h1>You are logged in!</h1>
        </div>
    </RenderWithAuth>
    <RenderWithAuth invert>
        <div>
            <span>You not logged in.</span>
        </div>
    </RenderWithAuth>
    </>)
}

export const getServerSideProps = withAuth(async (ctx, user) => {

    return {
        props: {
            isLoggedIn: !!user
        }
    }
})