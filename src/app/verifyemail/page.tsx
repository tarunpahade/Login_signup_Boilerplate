'use client'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Link from 'next/link';


export default function VerifyEmail() {

    const [token, settoken] = useState('')
    const [verify, setverify] = useState(false)
    const [error, seterror] = useState(false)
    const [errorTxt, seterrorTxt] = useState('')


    const verifyToken = async () => {
        try {
            console.log(token, 'token');

            await axios.post('/api/users/verifyemail', { token: token })

            setverify(true)

        } catch (error: any) {
            console.log(error.response.data);
            seterror(true)
            seterrorTxt(error.response.data.error)
        }
    }


    useEffect(() => {

        const urlToken = window.location.search.split('=')[1];
        console.log('ur l ', urlToken);
        settoken(urlToken || '')

    }, [])
    useEffect(() => {

        if (token.length > 0) {
            console.log(token, 'token');

            verifyToken()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token])




    return (

        <div className="flex column-1 justify-center items-center h-screen" style={{ flexDirection: 'column' }}>
            <h1 className='text-4xl'>Verify Email</h1>
            <h2 className='p-2 '>{token.length === 0 ? "No Token" : `${token}`}</h2>
            {error ? '' :


                <h2 className='p-2 '>{verify ? <><p>User verified successfully </p><Link href={'/login'}>  Login</Link></> : "Loading..."}</h2>
            }
            <h2 className='p-2 '>{error ? "Error " + errorTxt : ""}</h2>
        </div>
    )

}