import { useEffect, useState } from "react"

type RenderWithAuthProps = {
    isLoggedIn: boolean
    children: any,
    invert?: boolean
    update: Function
}

function RenderWithAuth ({isLoggedIn, children, invert = false, update}: RenderWithAuthProps) {
    const [auth, setAuth] = useState(isLoggedIn !== invert)

    const syncAuth = (event) => {
        
        if (event.key === 'logout') {
            update(false)
        }

        if (event.key === 'login') {
            update(true)
        }

        if(auth === true) {
            return (children)
        } else {
            return null
        }
      }
  
      useEffect(() => {
        window.addEventListener('storage', syncAuth)
        setAuth(isLoggedIn !== invert)
        return () => {
          window.removeEventListener('storage', syncAuth)
        }
      }, [isLoggedIn])

      return syncAuth(isLoggedIn !== invert)
}

export default RenderWithAuth