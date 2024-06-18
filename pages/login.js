import Link from 'next/link'
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import { Bounce, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Login() {

  const router = useRouter();

  useEffect(() => {
    if(localStorage.getItem('token')){
      router.push('/');
    }
  }, [])
  
  const [userInfo, setUserInfo] = useState({
    email: "",
    password: ""
  });

  const handleChange = (info) => {
    setUserInfo(info);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userInfo)
    });
    const json = await response.json();
    setUserInfo({
      email: "",
      password: ""
    });

    if (json.error) {
      toast.error(json.error, {
        position: "bottom-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    }else{
      localStorage.setItem('token', json.token);
      router.push('/');
    }

  }

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8 mt-6">
      <ToastContainer
        position="top-left"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img className="mx-auto h-10 w-auto" src="favicon.ico" alt="Your Company" />
        <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Sign in to your account</h2>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">Email address</label>
            <div className="mt-2">
              <input id="email" name="email" type="email" autoComplete="email" required className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-300 sm:text-sm sm:leading-6 outline-none px-3" value={userInfo.email} onChange={(e) => { handleChange({ ...userInfo, email: e.target.value }) }} />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">Password</label>
            <div className="mt-2">
              <input id="password" name="password" type="password" autoComplete="current-password" required className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-300 sm:text-sm sm:leading-6 outline-none px-3" value={userInfo.password} onChange={(e) => { handleChange({ ...userInfo, password: e.target.value }) }} />
            </div>
          </div>
          <div className='flex items-center justify-between'>
            <div className="text-sm flex items-center justify-center">
              <input id="remember" aria-describedby="remember" type="checkbox" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800 mr-2"/>
              <label htmlFor="remember" className="text-gray-900">Remember me</label>
            </div>
            <div className="text-sm">
              <Link href="/forgot" className="font-semibold text-gray-900">Forgot password?</Link>
            </div>
          </div>

          <div>
            <button type="submit" className="flex w-full justify-center rounded-md bg-yellow-400 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-yellow-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-600">Sign in</button>
          </div>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Not a member?
          <Link href="/signup" className="font-semibold leading-6 text-yellow-400"> Sign up here</Link>
        </p>
      </div>
    </div>
  )
}

export default Login