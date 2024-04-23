import "@/styles/globals.css";
import Head from "next/head";
import { Fragment, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { firebase } from "../Firebase/config";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function MyApp({ Component, pageProps }) {
  const [user, setUser] = useState(null);
  const [Productdata, setProductData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cartLength, setCartLength] = useState(0);
  const router = useRouter();
  const [cart, setCart] = useState({});
  const [subTotal, setSubTotal] = useState(0);
  const db = firebase.firestore();

  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser.email);
        fetchUserData(authUser.email); // Fetch user data based on UID
      } else {
        setUser(null);
        setUserData(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // Function to fetch user data from Firestore
  const fetchUserData = async (user) => {
    try {
      const userDoc = await firebase
        .firestore()
        .collection("Users")
        .doc(user)
        .get();
      if (userDoc.exists) {
        const userData = userDoc.data();
        if (userData && userData.photoURL) {
          setUserData(userData);
        } else {
          // If photoURL is missing or undefined, set it to a default value or null
          setUserData({ ...userData, photoURL: null }); // You can set a default value or handle it as per your requirement
        }
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };
console.log("userdata",userData)
  useEffect(() => {
    router.events.on("routeChangeStart", () => {
      // Do something on route change start
    });
    router.events.on("routeChangeComplete", () => {
      // Do something on route change complete
    });

    const storedCart = JSON.parse(localStorage.getItem("cart"));
    if (storedCart) {
      setCart(storedCart);
      updateSubTotal(storedCart);
    }

    const myuser = JSON.parse(localStorage.getItem("myuser"));
    if (myuser) {
      setUser({ value: myuser.id, email: myuser.email });
    }
  }, [router.query]);

  const updateSubTotal = (myCart) => {
    let subt = 0;
    Object.values(myCart).forEach((item) => {
      subt += item.price * item.qty;
    });
    setSubTotal(subt);
    localStorage.setItem("subtotal", subt);
  };

  const saveCartToLocalStorage = (cartData) => {
    localStorage.setItem("cart", JSON.stringify(cartData));
    setCartLength(Object.keys(cartData).length);
    updateSubTotal(cartData);
  };

  const addToCart = (
    itemCode,
    qty,
    price,
    name,
    frontImage
  ) => {
    if (!user) {
      router.push("/login");
      return;
    }
    const newCart = { ...cart };
    if (itemCode in cart) {
      newCart[itemCode].qty += qty;
    } else {
      newCart[itemCode] = { qty, price, name, frontImage };
    }

    setCart(newCart);
    saveCartToLocalStorage(newCart);

    // Show toast notification
    toast.success("Item added to cart!");
  };

  const bookNow = (
    itemCode,
    qty,
    price,
    name,
    frontImage
  ) => {
    const newCart = { [itemCode]: { qty, price, name, frontImage } };

    setCart(newCart);
    saveCartToLocalStorage(newCart);
    router.push("/checkout");
  };

  const clearCart = () => {
    setCart({});
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
    saveCartToLocalStorage(newCart);
  };

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(() => {
      const db = firebase.firestore();
      const ProductsRef = db.collection("Product");

      ProductsRef.get()
        .then((querySnapshot) => {
          const Productdata = [];
          querySnapshot.forEach((doc) => {
            Productdata.push({ ...doc.data(), id: doc.id });
          });

          setProductData(Productdata);
          setIsLoading(false); // Set isLoading to false when data is fetched
        })
        .catch((error) => {
          console.error("Error getting documents: ", error);
          setIsLoading(false); // Also set isLoading to false on error
        });
    });

    return () => unsubscribe();
  }, []);

  // Render spinner when loading
  if (isLoading) {
    return (
      <div class='flex space-x-2 justify-center items-center bg-white h-screen dark:invert'>
          <span class='sr-only'>Loading...</span>
           <div class='h-8 w-8 bg-black rounded-full animate-bounce [animation-delay:-0.3s]'></div>
         <div class='h-8 w-8 bg-black rounded-full animate-bounce [animation-delay:-0.15s]'></div>
         <div class='h-8 w-8 bg-black rounded-full animate-bounce'></div>
     </div>
    );
  }

  return (
    <Fragment>
      <Head>
        {/* Meta tags, title, favicon, and other head elements */}
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
        userData={userData}
        user={user}
        Productdata={Productdata}
      />
      <Component
        bookNow={bookNow}
        cart={cart}
        cartLength={cartLength}
        addToCart={addToCart}
        removeFromCart={removeFromCart}
        clearCart={clearCart}
        subTotal={subTotal}
        userData={userData}
        user={user}
        setSubTotal={setSubTotal}
        Productdata={Productdata}
        {...pageProps}
      />
      <Footer />
      {/* ToastContainer for displaying notifications */}
      <ToastContainer />
    </Fragment>
  );
}

export default MyApp;
