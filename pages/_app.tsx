import '../css/main.css'
import Header from '../components/Header'
import { AuthHelper } from '../utils/AuthHelper';
import App from './App'

function MyApp({ Component, pageProps, user }) {
    const [isLoggedIn, setIsLoggedIn, RenderWithAuth, Logout, Login,currentUser, setUser] = AuthHelper(!!user)
    const auth = {
        user,
        isLoggedIn,
        setIsLoggedIn,
        RenderWithAuth,
        Logout,
        Login,
        currentUser,
        setUser
    }
    return (
        <>
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