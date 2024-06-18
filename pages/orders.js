import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'

function Orders({ user }) {
    const router = useRouter();

    const [orders, setOrders] = useState([]);

    useEffect(() => {
        if (!localStorage.getItem('token')) {
            router.push('/');
        } 
        const getOrders = async()=>{
            if(user){
                const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/getorders?userId=${user._id}`);
                const data = await res.json();
                setOrders(data);
            }
        }

        getOrders();
    }, [user])

    if(orders?.length <= 0){
        return (
          <div className='flex justify-center items-center h-[50vh]'>
            <h1 className='font-bold text-xl'>No orders placed!</h1>
          </div>
        )
      }

    return (
        <section className="text-gray-600 body-font">
            <div className="container px-5 py-16 mx-auto">
                <div className="flex flex-col text-center w-full mb-10">
                    <h1 className="text-3xl font-medium title-font mb-2 text-gray-900">My Orders</h1>
                </div>
                <div className="lg:w-2/3 w-full mx-auto overflow-auto">
                    <table className="table-auto w-full text-left whitespace-no-wrap">
                        <thead>
                            <tr>
                                <th className="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100 rounded-tl rounded-bl">Order Id</th>
                                <th className="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100">Payment Mode</th>
                                <th className="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100">Status</th>
                                <th className="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100">Amount(₹)</th>
                                <th className="w-10 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100 rounded-tr rounded-br pr-2">Order</th> 
                            </tr>
                        </thead>
                        <tbody>
                            {orders?.map((order) => {
                                return (
                                    <tr key={order?._id}>
                                        <td className="px-4 py-3">{order?.orderId}</td>
                                        <td className="px-4 py-3">{order?.paymentDetails?.method[0].toUpperCase()}{order?.paymentDetails?.method.slice(1)}</td>
                                        <td className="px-4 py-3">{order?.status}</td>
                                        <td className="px-4 py-3 text-lg text-gray-900">{order?.amount}</td>
                                        <td className="w-10 text-center"><Link className='text-blue-400 pr-2' href={`/order/${order?._id}`}>Details</Link> 
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    )
}

export default Orders
