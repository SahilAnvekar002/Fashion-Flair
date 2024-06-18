import Link from 'next/link'
import React from 'react'

function Shorts({ products }) {

  if(Object.keys(products)?.length <= 0){
    return (
      <div className='flex justify-center items-center h-[50vh]'>
        <h1 className='font-bold text-xl'>Products are currently out of stock!  </h1>
      </div>
    )
  }

  return (
    <div>
      <section className="text-gray-600 body-font">
        <div className="container px-4 py-20 mx-auto">
          <div className="flex flex-wrap -m-4 justify-center">
            {Object.keys(products)?.map((key) => {
              return (
                <Link className="w-[70vw] lg:w-[20vw] md:w-[35vw] sm:w-[40vw] p-4 shadow-md m-2" href={`/product/${products[key]?.slug}`} key={key}>
                  <div className="block relative rounded overflow-hidden">
                    <img alt="T-Shirt" className="h-[30vh] md:h-[36vh] m-auto" src={products[key]?.img} />
                  </div>
                  <div className="mt-4">
                    <h3 className="text-gray-500 text-xs tracking-widest title-font mb-1">{products[key]?.category}</h3>
                    <h2 className="text-gray-900 title-font text-lg font-medium">{products[key]?.title}</h2>
                    <p className="mt-1">₹{products[key]?.price}</p>
                    <div className="mt-2">
                      {products[key]?.size?.map(s=> <span key={s} className='border border-gray-300 mr-2 px-1'>{s}</span> )}
                    </div>
                    <div className="mt-3">
                      {products[key]?.color?.map(c=> <button key={c} className='border-2  mr-1 rounded-full w-6 h-6 focus:outline-none' style={{backgroundColor : c}}></button>)}
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}

export async function getServerSideProps() {

  const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/getshorts`);
  const products = await res.json();

  return { props: { products } }
}

export default Shorts;
