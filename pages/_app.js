import '../css/main.css'
import Header from '../components/Header'
import { AuthHelper } from '../utils/AuthHelper';
import fetch from 'isomorphic-unfetch'

function App({ Component, pageProps, user }) {
    const [isLoggedIn, setIsLoggedIn, RenderWithAuth, Logout, Login] = AuthHelper(!!user)
    const auth = {
        user,
        isLoggedIn,
        setIsLoggedIn,
        RenderWithAuth,
        Logout,
        Login
    }
    return (
        <>
            <Header auth={auth}></Header>
            <Component  auth={auth} {...pageProps}></Component>
        </>
    )
}

const server = process.env.NODE_ENV === 'development' ? 'http://localhost:3000/' : null

App.getInitialProps = async ({ctx}) => {
    if(ctx.req) {
        const res = await fetch(server+'api/auth/me', {withCredentials: true, method: 'GET', headers: {
            cookie: ctx.req.headers.cookie
        }})

        if(res.status !== 200) {
            return {user: false}
        }

        const json = await res.json()
        return {user: json}
    }

    return {}
}

export default App