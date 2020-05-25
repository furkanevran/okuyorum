import Link from 'next/link'
import { useEffect } from 'react';
import { useRouter } from 'next/router'

export default function Login({auth}, query) {
    const {isLoggedIn, RenderWithAuth, Logout, Login} = auth

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


    return (<>
    <div>
        <Link href='/protected' as={`/protected`}>
            <a>PROTECTED</a>
        </Link>
    </div>
    
    <div><a onClick={() => Login('test123@test.com', '123456')}>set cookie</a></div>
    
    <div><a onClick={() => Logout(false)}>log out</a></div>

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

