import Link from 'next/link'
import fetch from 'isomorphic-unfetch'

export default function Login() {
    const setCookie = () => {
        fetch('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify({'email':'test123@test.com','pw':'123456'}),
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(r => r.json).then(x => {
            console.log(x)
        })
    }

    const logOut = () => {
        fetch('/api/auth/logout').then(r => r.json).then(x => {
            console.log(x)
        })
    }

    return (<>
    <Link href='/protected' as={`/protected`}>
        <a>PROTECTED</a>
    </Link>

    <a onClick={() => setCookie()}>set cookie</a>
    <a onClick={() => logOut()}>log out</a>
    </>)
}