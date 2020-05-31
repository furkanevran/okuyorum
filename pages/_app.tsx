import '../css/main.css'
import 'nprogress/nprogress.css'
import NProgress from 'nprogress'; 
import Header from '../components/Header'
import { AuthHelper } from '../utils/AuthHelper';
import App from './app'
import Head from 'next/head'
import User from '../db/models/user'
import Router, { useRouter } from 'next/router'
import { useEffect, useState } from 'react';

function MyApp({ Component, pageProps, user }) {
    const [isLoggedIn, setIsLoggedIn, RenderWithAuth, Logout, Login,currentUser, setUser] = AuthHelper(user)
    const auth = {
        isLoggedIn,
        setIsLoggedIn,
        RenderWithAuth,
        Logout,
        Login,
        user: currentUser as User,
        setUser
    }

    const router = useRouter()
    const [scrollBefore, setScrollBefore] = useState(0)
    const [pageBefore, setPageBefore] = useState(null)

    useEffect(() => {
        NProgress.configure({ 
            trickleSpeed: 200,
            showSpinner: false,
            speed: 100
         });
    })

    useEffect(() => {

        const backup = (url) => {
            if(!url.includes('comment') && !(router.asPath.includes('comment'))) {
                NProgress.start();
            }
            
            setScrollBefore(window.pageYOffset)
            setPageBefore(router.asPath)
            router.events.off('routeChangeStart', backup)
        }

        const restore = (url) => {
            if(!url.includes('comment') && !(router.asPath.includes('comment'))) {
                NProgress.done();
            }
            
            if(pageBefore == url) {
                window.scroll({top: scrollBefore, left: 0})
            }
        }

        const routeChangeEnd = () => {
            NProgress.done();
        }

        router.events.on('routeChangeStart', backup)
        router.events.on('routeChangeComplete', restore)
        router.events.on('routeChangeError', routeChangeEnd);

        return () => {
            NProgress.done();
            router.events.off('routeChangeStart', backup)
            router.events.off('routeChangeComplete', restore)
            router.events.off('routeChangeError', routeChangeEnd);
        }
    },[router.asPath])

    return (
        <>
        <Head>
        <script dangerouslySetInnerHTML={{ __html: 'history.scrollRestoration = "manual";' }} />
        </Head>
            <Header auth={auth}></Header>
            <Component auth={auth} {...pageProps}></Component>
        </>
    )
}


MyApp.getInitialProps = async ({ctx}) => {
    const appProps = await App.getInitialProps(ctx);
    return { ...appProps }
}

export default MyApp