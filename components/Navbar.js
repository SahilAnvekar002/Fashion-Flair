import Link from 'next/link'
import React, { useEffect, useRef, useState } from 'react'
import { AiOutlineMinusCircle, AiOutlinePlusCircle, AiOutlineShoppingCart } from "react-icons/ai";
import { IoIosCloseCircle } from "react-icons/io";
import { BsBagCheckFill } from "react-icons/bs";
import { MdAccountCircle } from "react-icons/md";
import { usePathname } from 'next/navigation';

function Navbar({ user, cart, addToCart, removeFromCart, clearCart, total, logout }) {
  const pathnames = ['/login', '/signup', '/checkout', '/orders', '/account'];
  const ref = useRef();
  const pathname = usePathname();

  const [dropDown, setDropDown] = useState(false);

  useEffect(() => {
    if (pathnames.includes(pathname) || pathname.includes('/order') || document.title === 'Fashion Flair - 404') {
      ref.current.classList.add('translate-x-full');
    }
  }, [pathname]);

  const toggleCart = () => {
    if (ref.current.classList.contains('translate-x-full')) {
      ref.current.classList.replace('translate-x-full', 'translate-x-0');
    } else {
      ref.current.classList.replace('translate-x-0', 'translate-x-full');
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
    <div className='flex justify-center md:justify-start flex-col md:flex-row items-center py-3 shadow-md sticky top-0 z-10 bg-white'>
      <div className="logo ml-5 md:mr-8 mr-auto md:mb-0 mb-2">
        <Link href='/'>
          <img src="/logo-no-background.png" alt="Fashion flair logo" height={20} width={200} />
        </Link>
      </div>
      <div className="nav">
        <ul className='flex items-center space-x-5 font-bold'>
          <Link href="/tshirts"><li className='text-black'> T-Shirts</li></Link>
          <Link href="/hoodies"><li className='text-black'>Hoodies</li></Link>
          <Link href="/jeans"><li className='text-black'>Jeans</li></Link>
          <Link href="/shorts"><li className='text-black'>Shorts</li></Link>
        </ul>
      </div>
      <div className="flex cart fixed right-0 mx-5 items-center top-5" >
        {user && <MdAccountCircle className='text-xl md:text-2xl cursor-pointer mr-3 text-black' onMouseEnter={() => setDropDown(true)} onMouseLeave={() => setDropDown(false)} />}
        {!user && <Link href='/login'><button className='bg-yellow-400 px-2 py-1 mr-3 text-white text-sm rounded-md'>Login</button></Link>}
        <AiOutlineShoppingCart className='text-xl md:text-2xl cursor-pointer text-black' onClick={toggleCart} />
      </div>

      {dropDown && <div className="absolute right-10 top-10 bg-white font-semibold border shadow-lg rounded-md px-5 w-32 cursor-pointer text-black" onMouseEnter={() => setDropDown(true)} onMouseLeave={() => setDropDown(false)}>
        <ul>
          <Link href='/account'><li className='py-1 hover:text-yellow-600 text-sm mt-2' onClick={() => setDropDown(false)}>Account</li></Link>
          <Link href='/orders'><li className='py-1 hover:text-yellow-600 text-sm' onClick={() => setDropDown(false)}>Orders</li></Link>
          <li className='py-1 hover:text-yellow-600 text-sm mb-2' onClick={() => { logout(), setDropDown(false) }}>Logout</li>
        </ul>
      </div>}

      <div ref={ref} className={`sidebar text-black overflow-y-scroll fixed top-0 right-0 bg-yellow-50 py-10 px-12 transform transition-transform ${Object.keys(cart).length === 0 ? 'translate-x-full' : (pathnames.includes(pathname) || pathname.includes('/order') || document.title === 'Fashion Flair - 404' )  ? 'translate-x-full' :'translate-x-0'} z-10 w-96 h-full`}>
        <h2 className="font-bold text-xl text-center mb-6">Shopping Cart</h2>
        <span className='absolute top-2 right-2 cursor-pointer text-black' onClick={toggleCart}>
          <IoIosCloseCircle size={20} />
        </span>
        <ol className='list-decimal font-semibold'>

          {Object.keys(cart).length === 0 && <div className='text-center'>No items in your cart</div>}
          {Object.keys(cart).map((id) => {
            return (
              <li className='my-4' key={id}>
                <div className='item flex'>
                  <div className='w-2/3 font-semibold'>{cart[id].name}({cart[id].variant}/{cart[id].size})</div>
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
        {Object.keys(cart).length !== 0 && <div className='font-bold'>Total : ₹{total}</div>}
        {Object.keys(cart).length !== 0 &&
          <div className='flex mt-6'>
            {user &&<Link href='/checkout'>
              <button className="flex mr-2 text-white bg-yellow-500 border-0 py-2 px-4 focus:outline-none hover:bg-yellow-600 rounded text-sm"><BsBagCheckFill className='m-1' /> Checkout</button>
            </Link>}

            <button className={`flex text-white bg-yellow-500 border-0 py-2 ${user && 'mx-2'} px-4 focus:outline-none hover:bg-yellow-600 rounded text-sm`} onClick={clearCart}><BsBagCheckFill className='m-1' /> Clear Cart</button>

          </div>}
      </div>

    </div>
  )
}

export default Navbar
