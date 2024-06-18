import { useRouter } from 'next/router';
import React from 'react'
import Custom404 from '../404';

function Order({ order }) {
  console.log(order)
  const router = useRouter();
  const { slug } = router.query;

  if(order.error){
    return <Custom404 />
  }

  return (
    <section className="text-gray-600 body-font overflow-hidden">
      <div className="container px-5 md:py-24 py-16 mx-auto">
        <div className="lg:w-4/5 mx-auto flex flex-wrap">
          <div className="lg:w-1/2 w-full lg:pr-10 lg:py-6 mb-6 lg:mb-0">
            <h2 className="text-sm title-font text-gray-500 tracking-widest">Fashion Flair</h2>
            <h1 className="text-gray-900 text-3xl title-font font-medium mb-4">Order ID : {order?.orderId}</h1>
            <p className="leading-relaxed mb-4">Your order has been placed successfully.</p>
            <div className="flex mb-4">
              <a className="flex-grow py-2 text-lg px-1">Description</a>
              <a className="flex-grow py-2 text-lg px-1 text-center ml-28">Quantity</a>
              <a className="flex-grow py-2 text-lg px-1 text-end">Price(₹)</a>
            </div>
            {Object.keys(order?.products).map((key) => {
              return (
                <div className="flex border-t border-gray-200 py-2" key={key}>
                  <span className="text-gray-500 max-w-48">{order?.products[key].name} ({order?.products[key].variant}/{order?.products[key].size})</span>
                  <span className="ml-auto text-gray-900">{order?.products[key].qty}</span>
                  <span className="ml-auto text-gray-900 mr-5">{order?.products[key].price}</span>
                </div>
              )
            })}
            <div className="flex flex-col">
              <span className="title-font font-medium text-2xl text-gray-900 mt-3">₹{order?.amount}</span>
              <div className='mt-3'>
                <button className="flex text-white bg-yellow-500 border-0 py-2 px-6 focus:outline-none hover:bg-yellow-600 rounded">Track Order</button>
              </div>
            </div>
          </div>
          <img alt="ecommerce" className="lg:w-1/2 w-full lg:h-auto h-64 object-cover object-center rounded" src="https://cdn.pixabay.com/photo/2021/01/29/14/41/wardrobe-5961193_1280.jpg" />
        </div>
      </div>
    </section>
  )
}

export async function getServerSideProps(context) {
  
  const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/getorder?id=${context.query.slug}`);
  const order = await res.json();
  console.log(order)
  return { props: { order } }

}

export default Order
