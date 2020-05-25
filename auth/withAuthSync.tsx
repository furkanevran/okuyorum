import { useRouter } from 'next/router'
import { useEffect } from 'react'

/**
 * 
 * @param redirect 
 * This parameter sets if you want to
 * redirect when user is not authenticated
 */
export function withAuthSync(Component: any, redirect=true){
    const Wrapper = ({user, data}:{user: any, data: any}) => {
        const router = useRouter()

        if(!user) {
            if (redirect === true) {
                useEffect(() => {
                    router.push('/login', '/login')
                }, [])
            }

            return (null)
        }

        const syncLogout = (event) => {
            if (event.key === 'logout') {
                if(redirect === true) {
                    router.push('/login')
                } else {
                    return (null)
                }
            }
          }
      
          useEffect(() => {
            window.addEventListener('storage', syncLogout)
      
            return () => {
              window.removeEventListener('storage', syncLogout)
            }
          }, [])

        return <Component {...data.props}/>
    }

    return Wrapper
}

