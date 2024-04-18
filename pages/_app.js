
import "@/styles/globals.css";
import Head from "next/head";
import { Fragment, useEffect, useState,useRef } from "react";
import { useRouter } from "next/router";
import { firebase } from "../Firebase/config";
import { FaTimes } from "react-icons/fa";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
function MyApp({ Component, pageProps }) {
 
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cartLength, setCartLength] = useState(0);

  const [loader, setLoader] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setLoader(false);
    }, 1500);
  }, []);

  const [key, setKey] = useState();
  const [progress, setProgress] = useState(0);
  const router = useRouter();
  const [cart, setCart] = useState({});
  const [subTotal, setSubTotal] = useState(0);
  const db = firebase.firestore();

  useEffect(() => {
    router.events.on("routeChangeStart", () => {
      setProgress(40);
    });
    router.events.on("routeChangeComplete", () => {
      setProgress(100);
    });

    try {
      if (localStorage.getItem("cart")) {
        const storedCart = JSON.parse(localStorage.getItem("cart"));
        setCartLength(Object.keys(storedCart).length);
        setCart(storedCart);
        saveCart(storedCart);
      }
    } catch (error) {
      localStorage.clear();
    }
    const myuser = JSON.parse(localStorage.getItem("myuser"));
    if (myuser) {
      setUser({ value: myuser.token, email: myuser.email });
    }
    setKey(Math.random());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query]);

  const saveCartToFirestore = async (cartData) => {
    if (user) {
      try {
        await db
          .collection("Users")
          .doc(user.uid)
          .collection("cart")
          .doc("userCart")
          .set(cartData);
        // After saving to Firestore, update the local state subTotal
        updateSubTotal(cartData);
      } catch (error) {
        console.error("Error saving cart to Firestore:", error);
      }
    }
  };

  const fetchCartFromFirestore = async () => {
    if (user) {
      try {
        const cartDoc = await db
          .collection("Users")
          .doc(user.uid)
          .collection("cart")
          .doc("userCart")
          .get();
        if (cartDoc.exists) {
          const cartData = cartDoc.data();
          setCart(cartData);
          updateSubTotal(cartData);
        }
      } catch (error) {
        console.error("Error fetching cart from Firestore:", error);
      }
    }
  };

  const updateSubTotal = (myCart) => {
    let subt = 0;
    Object.values(myCart).forEach((item) => {
      subt += item.price * item.qty;
    });
    setSubTotal(subt);
  };


  const saveCartToLocalStorage = (cartData) => {
    localStorage.setItem("cart", JSON.stringify(cartData));
    setCartLength(Object.keys(cartData).length);
  };


  const addToCart = (
    itemCode,
    qty,
    price,
    name,
    frontImage,
    selectedDate = null
  ) => {
    if (!user) {
      
      router.push('/login');
      return; // Prevent further execution of addToCart function
    }
    if (Object.keys(cart).length === 0) {
      setKey(Math.random);
    }
    let newCart = cart;
    if (itemCode in cart) {
      newCart[itemCode].qty = cart[itemCode].qty + qty;
    } else {
      newCart[itemCode] = { qty: 1, price, name, frontImage };
    }
    if (selectedDate) {
      newCart[itemCode].selectedDate = selectedDate; // Include the selected date in the cart item
    }
    setCart(newCart);
    saveCartToFirestore(newCart);
    saveCartToLocalStorage(newCart);
   
  };

  const bookNow = (
    itemCode,
    qty,
    price,
    name,
    frontImage,
    selectedDate = null
  ) => {
    let newCart = {};
    newCart[itemCode] = { qty: 1, price, name, frontImage };

    if (selectedDate) {
      newCart[itemCode].selectedDate = selectedDate; // If selectedDate is provided, add it to the cart
    }

    setCart(newCart);
    saveCartToLocalStorage(newCart);
    saveCartToFirestore(newCart);
    router.push("/checkout");
  };

  const clearCart = () => {
    setCart({});
    saveCartToFirestore({});
    saveCartToLocalStorage({});
  };

  const removeFromCart = (itemCode, qty) => {
    const newCart = { ...cart };
    if (itemCode in newCart) {
      newCart[itemCode].qty -= qty;
      if (newCart[itemCode].qty <= 0) {
        delete newCart[itemCode];
      }
    }
    setCart(newCart);
    saveCartToFirestore(newCart);
    saveCartToLocalStorage(newCart);
  };

  useEffect(() => {
    fetchCartFromFirestore();
  }, [user]);


  

  return (
    <Fragment>
      <Head>
        {/*====== Required meta tags ======*/}
        <meta charSet="utf-8" />
        <meta httpEquiv="x-ua-compatible" content="ie=edge" />
        <meta name="description" content="" />
        <meta name='robots' content="index, follow"/>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        {/*====== Title ======*/}
        <title>Welcome to gt5modaz!</title>
        {/*====== Favicon Icon ======*/}
        <link rel="shortcut icon" href="favicon.ico" type="image/png" />
        {/*====== Google Fonts ======*/}
        <link
          href="https://fonts.googleapis.com/css2?family=Prompt:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        {/*====== Flaticon css ======*/}
        <link
          rel="stylesheet"
          href="assets/fonts/flaticon/flaticon_gowilds.css"
        />
        {/*====== FontAwesome css ======*/}
        <link
          rel="stylesheet"
          href="assets/fonts/fontawesome/css/all.min.css"
        />
        {/*====== Bootstrap css ======*/}
        <link
          rel="stylesheet"
          href="assets/vendor/bootstrap/css/bootstrap.min.css"
        />
        {/*====== magnific-popup css ======*/}
        <link
          rel="stylesheet"
          href="assets/vendor/magnific-popup/dist/magnific-popup.css"
        />
        {/*====== Slick-popup css ======*/}
        <link rel="stylesheet" href="assets/vendor/slick/slick.css" />
        {/*====== Jquery UI css ======*/}
        <link
          rel="stylesheet"
          href="assets/vendor/jquery-ui/jquery-ui.min.css"
        />
        {/*====== Nice Select css ======*/}
        <link
          rel="stylesheet"
          href="assets/vendor/nice-select/css/nice-select.css"
        />
        {/*====== Animate css ======*/}
        <link rel="stylesheet" href="assets/vendor/animate.css" />
        {/*====== Default css ======*/}
        <link rel="stylesheet" href="assets/css/default.css" />
        {/*====== Style css ======*/}
        <link rel="stylesheet" href="assets/css/style.css" />
      </Head>
    
      
     
  
  <Navbar
    bookNow={bookNow}
    cart={cart}
    cartLength={cartLength}
    addToCart={addToCart}
    removeFromCart={removeFromCart}
    clearCart={clearCart}
    subTotal={subTotal}
    setSubTotal={setSubTotal}
  />

        <Component
          bookNow={bookNow}
          cart={cart}
          cartLength={cartLength}
          addToCart={addToCart}
          removeFromCart={removeFromCart}
          clearCart={clearCart}
          subTotal={subTotal}
          setSubTotal={setSubTotal}
          {...pageProps}
        />
 
<Footer/>
    </Fragment>
  );
}

export default MyApp;