import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';

const Custom404 = () => {
    const router = useRouter();
    const { reason } = router.query;

    return (<>
        <Head>
            <title>Fashion Flair - 404</title>
        </Head>
        <div className='flex items-center justify-center bg-white text-black flex-col h-[100vh] text-center'>
            {(!router.pathname.includes('/product') && !router.pathname.includes('/order')) && <h1 className='text-2xl font-bold mb-2'>404 - Page Not Found</h1>}
            {router.pathname.includes('/product') && <h1 className='text-2xl font-bold mb-2'>404 - Product Not Found</h1>}
            {router.pathname.includes('/order') && <h1 className='text-2xl font-bold mb-2'>404 - Order Not Found</h1>}
            <p>Sorry, the page you are looking for does not exist.</p>
        </div>
        </>
    );
};

export default Custom404;
