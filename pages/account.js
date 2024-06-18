import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Account({ user }) {

  const router = useRouter();

  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    address: "",
    phone: "",
    pincode: ""
  });

  const [password, setPassword] = useState("");
  const [cpassword, setCpassword] = useState("");

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      router.push('/');
    }

    if (user) {
      setUserInfo({ ...userInfo, name: user?.name, email: user?.email, address: user?.address, phone: user?.phone, pincode: user?.pincode })
    }

  }, [user])

  const handleChange = (info) => {
    setUserInfo(info);
  }

  const updateUser = async () => {

    if (userInfo.name.trim().length <= 0) {
      toast.error("Name cannot be empty", {
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

    if (userInfo.address.length < 20) {
      toast.error("Address should be at least 20 characters long", {
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

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(userInfo.phone)) {
      toast.error("Invalid phone number. Please try again", {
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

    const pincodeRegex = /^\d{6}$/;
    if (!pincodeRegex.test(userInfo.pincode)) {
      toast.error("Invalid pincode. Please try again", {
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

    const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/updateuser?userId=${user?._id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },

      body: JSON.stringify({
        name : userInfo.name,
        address : userInfo.address,
        pincode : userInfo.pincode,
        phone : userInfo.phone,
      })
    });

    const data = await res.json();
    setUserInfo({...userInfo, name: data.name, address: data.address, phone: data.phone, pincode : data.pincode});
    toast.success("User updated successfully", {
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
  }

  const changePassword = async() => {

    if (password.trim().length <= 0 || cpassword.trim().length <= 0) {
      toast.error("Password cannot be empty", {
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

    const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/updatepassword?userId=${user?._id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },

      body: JSON.stringify({
        password : password,
        cpassword : cpassword
      })
    });

    const data = await res.json();
    if(data.error){
      setPassword("");
      setCpassword("");
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

    setPassword("");
    setCpassword("");
    toast.success("Password changed successfully", {
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
  }

  return (
    <div className='container m-auto lg:w-[80vw] my-12'>
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
      <h1 className='text-center text-3xl font-bold mb-4'>Set Up your Account</h1>
      <h2 className='font-semibold text-xl'>1. Personal Information</h2>
      <div className="mx-auto flex mt-4">
        <div className="px-2 w-1/2">
          <div className="mb-4">
            <label htmlFor="name" className="leading-7 text-sm text-gray-600">Name</label>
            <input type="text" id="name" name="name" className="w-full bg-white rounded border border-gray-300 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-50 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" onChange={(e) => { handleChange({ ...userInfo, name: e.target.value }) }} value={userInfo.name} />
          </div>
        </div>
        <div className="px-2 w-1/2">
          <div className="mb-4">
            <label htmlFor="email" className="leading-7 text-sm text-gray-600">Email (Cannot be changed)</label>
            <input type="email" id="email" name="email" className="w-full bg-white rounded border border-gray-300 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-50 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" onChange={(e) => { handleChange({ ...userInfo, email: e.target.value }) }} value={userInfo.email} disabled />
          </div>
        </div>
      </div>
      <div className="px-2 w-full">
        <div className="mb-4">
          <label htmlFor="address" className="leading-7 text-sm text-gray-600">Address</label>
          <textarea name="address" id="address" cols="30" rows="4" className="w-full bg-white rounded border border-gray-300 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-50 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out resize-none" onChange={(e) => { handleChange({ ...userInfo, address: e.target.value }) }} value={userInfo.address}></textarea>
        </div>
      </div>
      <div className="mx-auto flex">
        <div className="px-2 w-1/2">
          <div className="mb-4">
            <label htmlFor="phone" className="leading-7 text-sm text-gray-600">Phone</label>
            <input type="phone" id="phone" name="phone" className="w-full bg-white rounded border border-gray-300 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-50 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" onChange={(e) => { handleChange({ ...userInfo, phone: e.target.value }) }} value={userInfo.phone} />
          </div>
        </div>
        <div className="px-2 w-1/2">
          <div className="mb-4">
            <label htmlFor="pincode" className="leading-7 text-sm text-gray-600">Pincode</label>
            <input type="text" id="pincode" name="pincode" className="w-full bg-white rounded border border-gray-300 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-50 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" onChange={(e) => { handleChange({ ...userInfo, pincode: e.target.value }) }} value={userInfo.pincode} />
          </div>
        </div>
      </div>
      <button className="flex mx-2 text-white bg-yellow-500 disabled:bg-yellow-300 border-0 py-2 px-6 focus:outline-none hover:bg-yellow-600 rounded text-sm" onClick={updateUser}>Submit</button>

      <h2 className='font-semibold text-xl mt-5'>2. Change Password</h2>
      <div className="mx-auto flex mt-4">
        <div className="px-2 w-1/2">
          <div className="mb-4">
            <label htmlFor="password" className="leading-7 text-sm text-gray-600">Old Password</label>
            <input type="password" id="password" name="password" className="w-full bg-white rounded border border-gray-300 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-50 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" onChange={(e) => { setPassword(e.target.value) }} value={password} />
          </div>
        </div>
        <div className="px-2 w-1/2">
          <div className="mb-4">
            <label htmlFor="cpassword" className="leading-7 text-sm text-gray-600">New Password</label>
            <input type="password" id="cpassword" name="cpassword" className="w-full bg-white rounded border border-gray-300 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-50 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" onChange={(e) => { setCpassword(e.target.value) }} value={cpassword} />
          </div>
        </div>
      </div>
      <button className="flex mx-2 text-white bg-yellow-500 disabled:bg-yellow-300 border-0 py-2 px-6 focus:outline-none hover:bg-yellow-600 rounded text-sm" onClick={changePassword}>Submit</button>

    </div>
  )
}

export default Account
