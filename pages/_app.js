import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import "@/styles/globals.css";
import Head from "next/head";
import { usePathname } from "next/navigation";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import LoadingBar from 'react-top-loading-bar'

export default function App({ Component, pageProps }) {

  const router = useRouter();

  const pathname = usePathname();

  const [cart, setCart] = useState({});
  const [total, setTotal] = useState(0);
  const [user, setUser] = useState();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (pathname.includes('/admin')) {
      import('../styles/style.scss');
    }
  }, [pathname])


  useEffect(() => {

    router.events.on('routeChangeStart', () => {
      setProgress(40);
    });

    router.events.on('routeChangeComplete', () => {
      setProgress(100);
    });

    try {
      if (localStorage.getItem('cart')) {
        setCart(JSON.parse(localStorage.getItem('cart')));
        saveCart(JSON.parse(localStorage.getItem('cart')));
      }

    } catch (error) {
      localStorage.clear();
    }

    const getUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/getuser?token=${token}`);
        const data = await res.json();
        if (data.error) {
          localStorage.removeItem('token');
          setUser(null);
        }
        else {
          setUser(data);
        }

      }
    }

    getUser();

  }, [router.query])

  const saveCart = (myCart) => {
    localStorage.setItem('cart', JSON.stringify(myCart));
    let subTotal = 0;
    let keys = Object.keys(myCart);

    for (let i = 0; i < keys.length; i++) {
      subTotal += myCart[keys[i]].price * myCart[keys[i]].qty
    }

    setTotal(subTotal);
  }

  const addToCart = (productId, qty, price, name, size, variant) => {
    let newCart = cart;

    if (productId in newCart) {
      newCart[productId].qty = cart[productId].qty + qty;
    }
    else {
      newCart[productId] = { qty: 1, price, name, size, variant };
    }

    setCart(newCart);
    saveCart(newCart);
  }

  const removeFromCart = (productId, qty, price, name, size, variant) => {
    let newCart = cart;

    if (productId in newCart) {
      newCart[productId].qty = cart[productId].qty - qty;
    }
    if (newCart[productId].qty <= 0) {
      delete newCart[productId];
    }

    setCart(newCart);
    saveCart(newCart);
  }

  const clearCart = () => {
    setCart({});
    saveCart({});
  }

  const buyNow = (productId, qty, price, name, size, variant) => {
    let newCart = { [productId]: { qty, price, name, size, variant } };
    setCart(newCart);
    saveCart(newCart);
    router.push('/checkout');
  }

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    router.push('/');
  }

  return (
    <>
      <Head>
        <title>Fashion Flair- Trending Fashions</title>
      </Head>
      <LoadingBar
        color='rgb(250 204 21)'
        progress={progress}
        onLoaderFinished={() => setProgress(0)}
        height={3}
        waitingTime={500}
      />
      {(!pathname.includes('/forgot') && pathname !== '/resetpassword' && !pathname.includes('/admin')) && <Navbar cart={cart} addToCart={addToCart} removeFromCart={removeFromCart} clearCart={clearCart} total={total} key={total} user={user} logout={logout} />}
      <Component cart={cart} addToCart={addToCart} removeFromCart={removeFromCart} clearCart={clearCart} total={total} buyNow={buyNow} user={user} {...pageProps} />
      {(!pathname.includes('/forgot') && pathname !== '/resetpassword' && !pathname.includes('/admin')) && <Footer />}
    </>
  )
}
