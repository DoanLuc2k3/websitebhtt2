import React, { createContext, useState, useContext } from "react";

// 1. Tạo Context
const CartContext = createContext();

// 2. Tạo Provider Component
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Hàm thêm sản phẩm vào giỏ
  const addToCart = (product) => {
    setCartItems((prevItems) => {
      // Kiểm tra xem sản phẩm đã có trong giỏ chưa
      const existingItem = prevItems.find(
        (item) => item.product.id === product.id
      );

      if (existingItem) {
        // Nếu đã có, tăng số lượng lên 1
        return prevItems.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // Nếu chưa có, thêm vào giỏ với số lượng là 1
        return [...prevItems, { product: product, quantity: 1 }];
      }
    });
  };

  // Hàm xóa sản phẩm khỏi giỏ
  const removeFromCart = (productId) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.product.id !== productId)
    );
  };

  // Hàm cập nhật số lượng
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) {
      // Nếu số lượng < 1, xóa luôn sản phẩm
      removeFromCart(productId);
    } else {
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.product.id === productId
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
    }
  };

  // Hàm xóa tất cả sản phẩm khỏi giỏ hàng
  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart, // <-- Xuất hàm này ra
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// 3. Tạo custom hook để dễ dàng sử dụng context
export const useCart = () => {
  return useContext(CartContext);
};

