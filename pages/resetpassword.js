import { useRouter } from 'next/router';
import React, { useState } from 'react'
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ResetPassword() {

    const router = useRouter();
    const { email } = router.query;

    const [password, setPassword] = useState("");
    const [cpassword, setCpassword] = useState("");

    const changePassword = async (e) => {
        e.preventDefault();
        if (password !== cpassword) {
            toast.error("Passwords does not match", {
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

        const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/resetpassword`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },

            body: JSON.stringify({
                email: email,
                password: password
            })
        });

        const data = await res.json();
        if (data.success) {
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
            setTimeout(() => {
                router.push('/login');
            }, 1000);
            return;
        }
        else {
            toast.error("Failed to reset password. Please try again", {
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
            router.push('/forgot');
            return;
        }
    }

    return (
        <div className='container flex flex-col justify-center h-[90vh]'>
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
            <form onSubmit={changePassword}>
                <div className="mx-12 md:mx-24 mt-4 lg:w-[50vw] lg:mx-auto">
                <h2 className='font-bold text-2xl mt-5 mb-5 mx-2'>Reset your Password</h2>
                    <div className="px-2">
                        <div className="mb-4">
                            <label htmlFor="password" className="leading-7 text-sm text-gray-600">New Password</label>
                            <input type="password" id="password" name="password" className="w-full bg-white rounded border border-gray-300 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-50 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" onChange={(e) => { setPassword(e.target.value) }} value={password} required />
                        </div>
                    </div>
                    <div className="px-2">
                        <div className="mb-4">
                            <label htmlFor="cpassword" className="leading-7 text-sm text-gray-600">Confirm New Password</label>
                            <input type="password" id="cpassword" name="cpassword" className="w-full bg-white rounded border border-gray-300 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-50 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" onChange={(e) => { setCpassword(e.target.value) }} value={cpassword} required />
                        </div>
                    </div>
                <button className="flex mx-2 text-white bg-yellow-500 disabled:bg-yellow-300 border-0 py-2 px-6 focus:outline-none hover:bg-yellow-600 rounded text-sm" type='submit'>Reset</button>
                </div>
            </form>
        </div>
    )
}

export default ResetPassword
