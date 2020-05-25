import { useRouter } from 'next/router'
import { useEffect } from 'react'

export function pageAuthSync(Component: any){
    const Wrapper = (pageProps) => {

        const router = useRouter()

        if(!pageProps.auth.isLoggedIn) {
            useEffect(() => {
                router.push({
                    pathname: '/login',
                    query: { return: window.location.pathname },
                })
            }, [])
            return (null)
        }

        const syncLogout = (event) => {
            if (event.key === 'logout') {
                router.push('/login')
                return (null)
            }
          }
      
          useEffect(() => {
            window.addEventListener('storage', syncLogout)
      
            return () => {
              window.removeEventListener('storage', syncLogout)
            }
          }, [])

        return <Component {...pageProps}/>
    }

    return Wrapper
}

