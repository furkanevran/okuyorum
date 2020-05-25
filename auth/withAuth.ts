import { verify } from 'jsonwebtoken'
import { parse } from 'cookie'

export function withAuth(getServerSidePropsFunc?: Function){
    return async (context: any) => {
        const user = await getUser(context);

        if(getServerSidePropsFunc) {
            return {props: {user, data: await getServerSidePropsFunc(context, user)}};
        }
        
        return {props: {user, data: {props: {user}}}};
    }
}

async function  getUser(ctx: any) {
    if(ctx.req.headers.cookie) {
        const {auth} = parse(ctx.req.headers.cookie)

        if(auth) {
            try {
                return verify(auth, process.env.APP_SECRET);
            } catch (error) {
                return null
            }
        }
    }

    return null
}