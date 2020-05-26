import { useRouter } from 'next/router'
import { useEffect } from 'react'

export function pageAuthSync(Component: any){
    const Wrapper = (pageProps) => {

        const router = useRouter()

        useEffect(() => {
            if (pageProps.auth.isLoggedIn === false) {
                router.push({
                    pathname: '/login',
                    query: { return: window.location.pathname },
                })
            }
        }, [pageProps.auth.isLoggedIn])

        if(pageProps.auth.isLoggedIn === false) {
            return (null)
        }

        return <Component {...pageProps}/>
    }

    return Wrapper
}

