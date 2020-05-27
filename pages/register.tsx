import Link from 'next/link'
import { useEffect, createRef, useState } from 'react';
import { useRouter } from 'next/router'

export default function Login({auth}, query) {
    const {isLoggedIn} = auth
    const [userRef, emailRef, passRef] = [createRef<HTMLInputElement>(), createRef<HTMLInputElement>(), createRef<HTMLInputElement>()]
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(null)
    let timer

    const router = useRouter()

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

    const register = async (e) => {
        const ret = await fetch('/api/auth/register', {
            method: 'POST',
            body: JSON.stringify({
            'email':emailRef.current.value,
            'pw':passRef.current.value,
            'username':userRef.current.value
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        })

        const json = await ret.json()

        if(ret.status === 200) {
            setSuccess('You are now registered!')
            timer = setTimeout(() => {
                clearTimeout(timer)
                let query = {
                    email: json.email as string,
                    return: '/'
                }

                if(router.query.return) {
                    query = {...query, return: router.query.return+''}
                }

                router.push({
                    pathname: '/login',
                    query,
                })
            }, 1000)
        } else {
            setError(json.message)

            timer = setTimeout(() => {
                setError(null)
                clearTimeout(timer)
            }, 3000)
        }
    }


    return (<>
    <div>
        <h2>Register!</h2>
        <input ref={userRef} type='text' placeholder='Username' defaultValue={'testtt'}/>
        <input ref={emailRef} type='text' placeholder='E-Mail' defaultValue={'test123t@test.com'}/>
        <input ref={passRef} type='password' placeholder='Password' defaultValue={'1234567'}/>
        <input type='button' value='Register' onClick={register}/>
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

    {success ? 
        <div>
            <p>{success}</p>
            <p>Redirecting...</p>
        </div>
   : null}

    {error ? 
        <div>
            <span>{error}</span>
        </div>
     : null}
    
    </>)
}

