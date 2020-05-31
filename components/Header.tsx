import Link from "next/link";
import { AuthHelper } from "../utils/AuthHelper";
import { useEffect } from "react";
import useSWR from 'swr'
import { useRouter } from 'next/router';
import Fullscreen from "./Fullscreen";

export default function Header({auth}) {
    const router = useRouter()
    const {isLoggedIn, setIsLoggedIn, RenderWithAuth, Logout} = auth
    //const query = router.pathname === '/login' || router.pathname === '/register'  ? '' : '?return='+router.asPath
    const loginUrl = '/login'
    const registerUrl = '/register'

    return (
        <div className="header">
            <div className="brand">
                <Link href="/">
                    <h3>Oku<span>yorum</span></h3>
                </Link>
            </div>
            <Fullscreen></Fullscreen>
            <div className="menu">
                {router.pathname === '/' ? (<Link href='/search' as='/search'><a>Search</a></Link>) : null}
            <RenderWithAuth>
                <Link href="/profile" as="/profile"><a>Profile</a></Link>
                <a onClick={() => Logout()}>Logout</a>
            </RenderWithAuth>
            <RenderWithAuth invert>
                 <Link href={registerUrl} as={registerUrl}><a>Register</a></Link>
                <Link href={loginUrl} as={loginUrl}><a>Login</a></Link>
            </RenderWithAuth>
            </div>
    <style jsx>{`

.header {
    margin: 20px 0;
}
.brand {
    width: calc(100% - 240px);
    display: inline-block;
}

.brand h3 {
    cursor: pointer;
}

.menu {
    width: auto;
    display: inline-block;
    text-align: center;
    text-align: right;
    width: 240px;
}

.menu a {
    border: 1px solid #eee;
    padding: 5px 10px;
    border-radius: 10px;
    margin-right: 5px;
}

@media screen and (max-width: 530px) {
    .menu {
        display: block;
        margin: 0 auto;
        width: 100%;
        text-align: center
    }
    .brand {
        width: 100%;
        text-align: center;
    }

    .brand h3 {
        margin-top: 0;
        padding-top: 0;
        margin-bottom: 10px;
        font-size: 36px;
    }
    .header {
        margin-top: 0;
    }
}
    `}</style>
        </div>
        
    )
}