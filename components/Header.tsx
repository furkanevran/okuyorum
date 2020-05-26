import Link from "next/link";
import { AuthHelper } from "../utils/AuthHelper";
import { useEffect } from "react";
import useSWR from 'swr'

export default function Header({auth}) {
    const {isLoggedIn, setIsLoggedIn, RenderWithAuth, Logout} = auth
    return (
        <div className="header">
            <div className="brand">
                <Link href="/">
                    <h3>Oku<span>yorum</span></h3>
                </Link>
            </div>
            <div className="menu">
            <RenderWithAuth>
                <Link href="/profile" as="/profile"><a>Profile</a></Link>
                <a href='#' onClick={() => Logout()}>Logout</a>
            </RenderWithAuth>
            <RenderWithAuth invert>
                <Link href="/login" as="/login"><a>Login</a></Link>
            </RenderWithAuth>
            </div>
    <style jsx>{`

.header {
    margin: 20px 0;
}
.brand {
    width: calc(100% - 150px);
    display: inline-block;
}

.brand h3 {
    cursor: pointer;
}

.menu {
    width: 150px;
    display: inline-block;
}

.menu a {
    border: 1px solid #eee;
    padding: 5px 10px;
    border-radius: 10px;
    margin-right: 5px;
}

@media only screen and (max-width: 440px) {
    .menu {
        margin-top: 50px;
    }
}
    `}</style>
        </div>
        
    )
}