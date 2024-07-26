import React, { createContext, useState, useEffect, useContext } from "react";
import { userContext } from "./UserContext";
import { toast } from "react-hot-toast";
import { SidebarContext } from "./SidebarContext";
import { LogContext } from "./LogContext";

export const CartContext = createContext();
const CartProvider = ({ children }) => {
  const { setIsOpen } = useContext(SidebarContext);
  const { setShowModal } = useContext(LogContext);
  const { userId, setUserId } = useContext(userContext);
  const [cart, setCart] = useState(null);
  const [couponId, setCouponId] = useState(() => {
    return localStorage.getItem("enteBuddyCouponId") || "";
  });
  const [discountPrice, setDiscountPrice] = useState(() => {
    return localStorage.getItem("enteBuddyCartPrice") || 0;
  });

  useEffect(() => {
    let cartData = localStorage.getItem("enteBuddyCart");

    if (cartData) {
      cartData = JSON.parse(cartData);
      setCart(cartData);
    }
  }, []);
  const [itemAmount, setItemAmount] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  // setting the total price in the cart
  useEffect(() => {
    if (cart) {
      const amount = cart.reduce((accumulator, currentItem) => {
        return accumulator + currentItem.price * currentItem.quantity;
      }, 0);
      setTotalPrice(amount);
    }
  }, [cart]);

  ///fetch cart data
  const fetchCart = async (userId) => {
    try {
      const response = await fetch(`/api/user/getCart/${userId}`, {
        credentials: "include",
      });

      if (response.ok) {
        const cartData = await response.json();
        const localCart = JSON.stringify(cartData);
        localStorage.setItem("enteBuddyCart", localCart);
        setCart(cartData);
        localStorage.setItem("enteBuddyCartPrice", 0);
        setDiscountPrice(0);
        localStorage.setItem("enteBuddyCouponId", "");
        setCouponId("");
        setCart(cartData);
      } else if (response.status == 401 || response.status == 403) {
        alert("Your session has been expired, Please login again.");
        localStorage.clear();
        window.location.href = "/";
      }
      return;
    } catch (err) {
      console.log("error in fetching cart : ", err);
    }
  };
  //  add to cart
  const addToCart = async (product) => {
    try {
      console.log(userId);
      const response = await fetch(`/api/user/addToCart/${userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
        credentials: "include",
      });
      if (response.ok) {
        toast.success("product added to cart");

        fetchCart(userId);
      } else if (response.status == 401 || response.status == 403) {
        alert("Your session has been expired, Please login again.");
        localStorage.clear();
        window.location.href = "/";
      }
    } catch (err) {
      console.log("error in adding to cart : ", err);
    }
  };

  const removeFromCart = async (id) => {
    try {
      const response = await fetch(`/api/user/removeFromCart/${userId}/${id}`, {
        method: "delete",
        credentials: "include",
      });
      if (response.ok) {
        fetchCart(userId);
      } else if (response.status == 401 || response.status == 403) {
        alert("Your session has been expired, Please login again.");
        localStorage.clear();
        window.location.href = "/";
      }
    } catch (err) {
      console.log(err);
    }
  };

  const clearCart = async () => {
    try {
      const response = await fetch(`/api/user/removeAllFromCart/${userId}`, {
        method: "delete",
        credentials: "include",
      });
      if (response.ok) {
        fetchCart(userId);
      } else if (response.status == 401 || response.status == 403) {
        alert("Your session has been expired, Please login again.");
        localStorage.clear();
        window.location.href = "/";
      }
    } catch (err) {
      console.log(err);
    }
  };
  //  increase cart amount
  // const increaseCart = (id) => {
  //   const item = cart.find((item) => {
  //     return item.id === id;
  //   });
  //   addToCart(item, id);
  // };

  //  decrease cart amount
  const decreaseCart = async (id) => {
    try {
      const cartItem = cart.find((item) => {
        return item._id === id;
      });

      if (cartItem.quantity < 2) {
        removeFromCart(id);
      } else {
        const response = await fetch(`/api/user/cartMinus/${userId}/${id}`, {
          method: "put",
          credentials: "include",
        });
        if (response.ok) {
          const cartItem = cart.find((item) => {
            return item.id === id;
          });

          fetchCart(userId);
        } else if (response.status == 401 || response.status == 403) {
          alert("Your session has been expired, Please login again.");
          localStorage.clear();
          window.location.href = "/";
        }
      }
    } catch (err) {
      console.log(err);
    }
  };
  // update cart quantity

  useEffect(() => {
    if (cart) {
      const amount = cart.reduce((accumulator, currentItem) => {
        return accumulator + currentItem.quantity;
      }, 0);
      setItemAmount(amount);
    }
  }, [cart]);

  const handleCart = () => {
    if (userId) {
      setIsOpen((prev) => !prev);
    } else {
      toast.error("Please log in to order");
      setShowModal(true);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        setCart,
        addToCart,
        removeFromCart,
        clearCart,
        decreaseCart,
        itemAmount,
        totalPrice,
        fetchCart,
        couponId,
        handleCart,
        discountPrice,
        setDiscountPrice,
        setCouponId,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
