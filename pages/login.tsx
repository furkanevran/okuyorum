import Link from 'next/link'
import fetch from 'isomorphic-unfetch'
import { logout } from '../auth/logout';
import { GetServerSideProps } from 'next';
import { withAuth } from '../auth/withAuth';
import RenderWithAuth from '../components/renderWithAuth';
import { useState } from 'react';
import { login } from '../auth/login';

export default function Login({data}) {
    const [isLoggedIn, setIsLoggedIn ] = useState(data.props.isLoggedIn)
    
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

    {isLoggedIn === true ? (<RenderWithAuth></RenderWithAuth>) : null}
    </>)
}

export const getServerSideProps = withAuth(async (ctx, user) => {

    return {
        props: {
            isLoggedIn: !!user
        }
    }
})