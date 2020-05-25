import Link from "next/link";
import { AuthHelper } from "../utils/AuthHelper";
import { logout } from "../auth/logout";
import { useEffect } from "react";
import useSWR from 'swr'

export default function Header({auth}) {
    const {isLoggedIn, setIsLoggedIn, RenderWithAuth} = auth
    return (
        <div className="header">
            <div className="brand">
                <Link href="/">
                    <h3>Oku<span>yorum</span></h3>
                </Link>
            </div>
            <RenderWithAuth>authed</RenderWithAuth>
            <RenderWithAuth invert>not authed</RenderWithAuth>
        </div>
    )
}