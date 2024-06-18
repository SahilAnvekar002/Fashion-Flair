import Link from 'next/link'
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Forgot() {

  const router = useRouter();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(null);
  const [enteredOtp, setEnteredOtp] = useState("");

  useEffect(() => {
    if (localStorage.getItem('token')) {
      router.push('/');
    }
  }, [])

  const sendEmail = async (e) => {
    e.preventDefault();
    const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/forgotpassword`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },

      body: JSON.stringify({
        email: email
      })
    });

    const data = await res.json();
    if (data.success) {
      setOtp(data.otp);
      toast.success(data.success, {
        position: "bottom-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
      return;
    }

    if (data.error) {
      toast.error(data.error, {
        position: "bottom-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
      return;
    }
  }

  const verifyOtp = async (e) => {
    e.preventDefault();
    // Add logic to verify the OTP here
    if (enteredOtp === otp) {
      toast.success('OTP verified successfully!', {
        position: "bottom-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
      router.push(`/resetpassword?email=${email}`);
      setEmail("");
    } else {
      toast.error('Invalid OTP!', {
        position: "bottom-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
      setOtp(null);
      setEnteredOtp("");
      setEmail("");
    }
  };

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8 items-center h-[100vh]">
      <ToastContainer
        position="bottom-center"
        autoClose={1000}
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
        <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Forgot Password</h2>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-sm">
        {otp === null ? <form className="space-y-6" onSubmit={sendEmail}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">Email address</label>
            <div className="mt-2">
              <input id="email" name="email" type="email" autoComplete="email" required className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-300 sm:text-sm sm:leading-6 outline-none px-3" onChange={(e) => { setEmail(e.target.value) }} value={email} />
            </div>
          </div>
          <div>
            <button type="submit" className="flex w-full justify-center rounded-md bg-yellow-400 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-yellow-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-600">Continue</button>
          </div>
        </form> :
          <form className="space-y-6" onSubmit={verifyOtp}>
            <div>
              <label htmlFor="otp" className="block text-sm font-medium leading-6 text-gray-900">Enter OTP</label>
              <div className="mt-2">
                <input id="otp" name="otp" type="text" autoComplete="one-time-code" required className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-300 sm:text-sm sm:leading-6 outline-none px-3" onChange={(e) => { setEnteredOtp(e.target.value) }} value={enteredOtp} />
              </div>
            </div>
            <div>
              <button type="submit" className="flex w-full justify-center rounded-md bg-yellow-400 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-yellow-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-600">Verify OTP</button>
            </div>
          </form>
        }

        <p className="mt-6 text-center text-sm text-gray-500">
          Already a member?
          <Link href="/login" className="font-semibold leading-6 text-yellow-400">Login here</Link>
        </p>
      </div>
    </div>
  )
}

export default Forgot
