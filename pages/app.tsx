import fetch from 'isomorphic-unfetch'

export default function App() {return (null)}

const server = process.env.NODE_ENV === 'development' ? 'http://localhost:3000/' : null
App.getInitialProps = async (ctx) => {
    if(ctx.req) {
        const res = await fetch(server+'api/auth/me', {method: 'GET', headers: {
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