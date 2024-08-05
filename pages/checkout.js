import Link from 'next/link'
import { useRouter } from 'next/router'
import Script from 'next/script'
import Razorpay from 'razorpay'
import React, { useEffect, useState } from 'react'
import { AiOutlineMinusCircle, AiOutlinePlusCircle } from 'react-icons/ai'
import { BsBagCheckFill } from 'react-icons/bs'
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Checkout({ cart, addToCart, removeFromCart, clearCart, total, user, pincodes }) {

  const router = useRouter();

  const [deliveryDetails, setDeliveryDetails] = useState({
    name: "",
    email: "",
    address: "",
    phone: "",
    pincode: "",
    state: "",
    city: ""
  });
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  useEffect(() => {
    const isFormValid = () => {
      const { name, email, address, phone, pincode, state, city } = deliveryDetails;
      return name && email && address && phone && pincode && state && city;
    };
    setIsButtonDisabled(!isFormValid());

  }, [deliveryDetails]);

  useEffect(() => {

    if (!localStorage.getItem('token')) {
      router.push('/');
    }

    if (user) {
      if (user?.pincode.length === 6) {
        if (Object.keys(pincodes).includes(user?.pincode)) {
          setDeliveryDetails({ ...deliveryDetails, name: user?.name, email: user?.email, phone: user?.phone, pincode: user?.pincode, address: user?.address, city: pincodes[user?.pincode][0], state: pincodes[user?.pincode][1] });
        } else {
          setDeliveryDetails({ ...deliveryDetails, name: user?.name, email: user?.email, phone: user?.phone, pincode: user?.pincode, address: user?.address });
        }
      }
      else{
        setDeliveryDetails({ ...deliveryDetails, name: user?.name, email: user?.email, phone: user?.phone, pincode: user?.pincode, address: user?.address });
      }
    }

  }, [user]);

  useEffect(() => {
    if (Object.keys(cart).length === 0) {
      setIsButtonDisabled(true);
    }
  }, [Object.keys(cart).length])


  const handleChange = (e) => {
    const { name, value } = e.target;
    setDeliveryDetails((prevDetails) => {
      const updatedDetails = { ...prevDetails, [name]: value };

      if (name === 'pincode' && value.length === 6) {
        if (Object.keys(pincodes).includes(value)) {
          updatedDetails.city = pincodes[value][0];
          updatedDetails.state = pincodes[value][1];
        } else {
          updatedDetails.city = '';
          updatedDetails.state = '';
        }
      } else if (name === 'pincode') {
        updatedDetails.city = '';
        updatedDetails.state = '';
      }

      return updatedDetails;
    });

  }

  const initiatePayment = async (e) => {

    //data validation 
    if (deliveryDetails.address.length < 20) {
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
    if (!phoneRegex.test(deliveryDetails.phone)) {
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

    try {
      let receipt = Math.floor(Math.random() * Date.now());

      const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/transaction`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ cart, total, receipt })
      });

      const data = await response.json();
      if (data.error) {
        clearCart();
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

      let options = {
        "key_id": process.env.NEXT_PUBLIC_RAZOR_PAY_KEY, // Enter the Key ID generated from the Dashboard
        "amount": total * 100, // Amount is in currency subunits (paise)
        "currency": "INR",
        "name": "Fashion Flair",
        "description": "Complete transaction for your orders",
        "order_id": data.id, // Pass the order ID obtained from the backend
        "handler": async function (response) {

          const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = response;

          // Verify the payment signature
          const verifyResponse = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/verifypayment`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              razorpay_payment_id,
              razorpay_order_id,
              razorpay_signature
            })
          });

          const verificationResult = await verifyResponse.json();
          if (verificationResult.status === 'failure') {
            toast.error("Payment failed. Please try again" , {
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

          const paymentDetailsResponse = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/getpaymentdetails`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ payment_id: razorpay_payment_id })
          });

          const paymentDetails = await paymentDetailsResponse.json();

          let order = {
            userId: user._id,
            products: cart,
            address: deliveryDetails.address,
            phone: deliveryDetails.phone,
            pincode: deliveryDetails.pincode,
            state: deliveryDetails.state,
            city: deliveryDetails.city,
            amount: total,
            orderId: data.id,
            status: "Paid",
            paymentDetails: paymentDetails
          };

          const a = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/createorder`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },

            body: JSON.stringify(order)
          });

          const b = await a.json();

          let updatedProducts = [];
          for (let slug in cart) {
            const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/getrawproduct/${slug}`);
            const data = await res.json();
            const product = data.product;
            let updatedProduct = product
            updatedProduct.availableQty = product.availableQty - cart[slug].qty;
            updatedProducts.push(updatedProduct);
          }

          const c = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/updateproducts`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },

            body: JSON.stringify(updatedProducts)
          });
          const d = await c.json();

          clearCart();
          router.push(`/order/${b._id}`);
        },
        "prefill": {
          "name": deliveryDetails.name,
          "email": deliveryDetails.email,
          "contact": deliveryDetails.phone,
          "address": deliveryDetails.address,
          "pincode": deliveryDetails.pincode,
          "state": deliveryDetails.state,
          "city": deliveryDetails.city,
        },
        "theme": {
          "color": "#eab308"
        },
        "redirect": false,
      };

      let rzp1 = new window.Razorpay(options);
      rzp1.open();

    } catch (error) {
      console.error("Error initiating payment:");
    }
  }

  const checkAddToCart = async (id, qty, price, name, size, variant) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/getproduct/${id}`);
    const data = await res.json();
    const product = data.product;

    let checkQty = cart[id].qty >= product.availableQty;
    if (!checkQty) {
      addToCart(id, qty, price, name, size, variant);
    }

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
      <Script src='https://checkout.razorpay.com/v1/checkout.js' />
      <h1 className='text-center text-3xl font-bold mb-4'>Checkout</h1>
      <h2 className='font-semibold text-xl'>1. Delivery Details</h2>
      <div className="mx-auto flex mt-4">
        <div className="px-2 w-1/2">
          <div className="mb-4">
            <label htmlFor="name" className="leading-7 text-sm text-gray-600">Name</label>
            <input type="text" id="name" name="name" className="w-full bg-white rounded border border-gray-300 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-50 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" onChange={handleChange} value={deliveryDetails.name} disabled />
          </div>
        </div>

        <div className="px-2 w-1/2">
          <div className="mb-4">
            <label htmlFor="email" className="leading-7 text-sm text-gray-600">Email</label>
            <input type="email" id="email" name="email" className="w-full bg-white rounded border border-gray-300 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-50 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" onChange={handleChange} value={deliveryDetails.email} disabled />
          </div>
        </div>
      </div>
      <div className="px-2 w-full">
        <div className="mb-4">
          <label htmlFor="address" className="leading-7 text-sm text-gray-600">Address</label>
          <textarea name="address" id="address" cols="30" rows="4" className="w-full bg-white rounded border border-gray-300 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-50 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out resize-none" onChange={handleChange} value={deliveryDetails.address}></textarea>
        </div>
      </div>

      <div className="mx-auto flex">
        <div className="px-2 w-1/2">
          <div className="mb-4">
            <label htmlFor="phone" className="leading-7 text-sm text-gray-600">Phone</label>
            <input type="phone" id="phone" name="phone" className="w-full bg-white rounded border border-gray-300 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-50 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" onChange={handleChange} value={deliveryDetails.phone} />
          </div>
        </div>

        <div className="px-2 w-1/2">
          <div className="mb-4">
            <label htmlFor="pincode" className="leading-7 text-sm text-gray-600">Pincode</label>
            <input type="text" id="pincode" name="pincode" className="w-full bg-white rounded border border-gray-300 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-50 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" onChange={handleChange} value={deliveryDetails.pincode} />
          </div>
        </div>
      </div>
      <div className="mx-auto flex">
        <div className="px-2 w-1/2">
          <div className="mb-4">
            <label htmlFor="state" className="leading-7 text-sm text-gray-600">State</label>
            <input type="text" id="state" name="state" className="w-full bg-white rounded border border-gray-300 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-50 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" onChange={handleChange} value={deliveryDetails.state} disabled />
          </div>
        </div>

        <div className="px-2 w-1/2">
          <div className="mb-4">
            <label htmlFor="city" className="leading-7 text-sm text-gray-600">City</label>
            <input type="text" id="city" name="city" className="w-full bg-white rounded border border-gray-300 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-50 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" onChange={handleChange} value={deliveryDetails.city} disabled />
          </div>
        </div>
      </div>

      <h2 className='font-semibold text-xl'>2. Review Cart Items</h2>

      <div className="sidebar bg-yellow-50 p-6 m-2">
        <ol className='list-decimal font-semibold px-4 md:w-[65vw] lg:w-[50vw]'>
          {Object.keys(cart).length === 0 && <div className='mb-3'>No items in your cart</div>}
          {Object.keys(cart).map((id) => {
            return (
              <li className='my-4' key={id}>
                <div className='item flex justify-between'>
                  <div className='font-semibold max-w-80'>{cart[id].name}({cart[id].variant}/{cart[id].size})</div>
                  <div className='w-1/3 flex items-center justify-center font-semibold mb-4'>
                    <AiOutlineMinusCircle className='mx-2 cursor-pointer' style={{ fontSize: '20px' }} onClick={() => { removeFromCart(id, 1, cart[id].price, cart[id].name, cart[id].size, cart[id].variant) }} />
                    {cart[id].qty}
                    <AiOutlinePlusCircle className='mx-2 cursor-pointer' style={{ fontSize: '20px' }} onClick={() => { checkAddToCart(id, 1, cart[id].price, cart[id].name, cart[id].size, cart[id].variant) }} />
                  </div>
                </div>
              </li>
            )
          })}
        </ol>
        <div className='font-bold px-4'>Total : ₹{total}</div>
      </div>

      <button className="flex mx-3 text-white bg-yellow-500 disabled:bg-yellow-300 border-0 py-2 px-4 focus:outline-none hover:bg-yellow-600 rounded text-sm" onClick={initiatePayment} disabled={isButtonDisabled}>Pay ₹{total}</button>

    </div>
  )
}

export async function getServerSideProps(context) {

  const pincodeRes = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/pincode`);
  const pincodes = await pincodeRes.json();

  return { props: { pincodes } }
}

export default Checkout
