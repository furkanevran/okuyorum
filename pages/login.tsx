import Link from 'next/link'
import { useEffect, createRef, useState } from 'react';
import { useRouter } from 'next/router'

export default function Login({auth}, query) {
    const {isLoggedIn, RenderWithAuth, Login} = auth
    const [emailRef, passRef] = [createRef<HTMLInputElement>(), createRef<HTMLInputElement>()]
    const [error, setError] = useState(null)
    let timer

    const router = useRouter()

    const defaultEmail = !!router.query.email ? router.query.email : 'test123@test.com'

    useEffect(() => {
        if(isLoggedIn) {
            if (router.query.return) {
                router.push(router.query.return+'')
            } else {
               router.push('/')
            }
        }

        return () => {
            clearTimeout(timer)
        }
    }, [isLoggedIn])

    const login = async (e) => {
        const ret = await Login(emailRef.current.value, passRef.current.value) as Response
        if(ret.status !== 200) {
            setError((await ret.json()).message)

            timer = setTimeout(() => {
                setError(null)
                clearTimeout(timer)
            }, 3000)
        }
    }


    return (<>
    <div>
        <h2>Login!</h2>
        <input ref={emailRef} type='text' placeholder='E-Mail' defaultValue={defaultEmail}/>
        <input ref={passRef} type='password' placeholder='Password' defaultValue={'123456'}/>
        <input type='button' value='Login' onClick={login}/>
        <style jsx>{`
            input {
                box-sizing: border-box;
                display: block;
                width: 100%;
                padding: 5px 10px;
                border-radius: 10px;
                margin-top: 10px;
                font-size: 18px;
                background-color: transparent;
                outline: none;
                border: 1px solid #eee;
                color: #fff;
            }

            button {
                width: 100%;
                margin-right: 0;
            }
        `}</style>
    </div>

    <RenderWithAuth>
        <div>
            <p>You are logged in!</p>
            <p>Redirecting...</p>
        </div>
    </RenderWithAuth>

    {error ? 
        <div>
            <span>{error}</span>
        </div>
     : null}
    
    </>)
}

