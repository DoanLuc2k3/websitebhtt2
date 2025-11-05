// src/context/OrderContext.js
import React, { createContext, useState, useContext, useEffect } from "react";
import { useAuth } from "./AuthContext"; // <-- 1. IMPORT HOOK useAuth

const ORDER_STORAGE_KEY = "orderStatusCounts";

// 1. Tạo Context (giữ nguyên)
const OrderContext = createContext();

// 2. Tạo Provider
export const OrderProvider = ({ children }) => {
  const [confirmingCount, setConfirmingCount] = useState(0);
  
  // 2. LẤY TRẠNG THÁI ĐĂNG NHẬP
  const { isLoggedIn } = useAuth();

  // 3. HÀM NỘI BỘ ĐỂ XÓA COUNT
  const clearConfirmingOrders = () => {
    setConfirmingCount(0);
    localStorage.removeItem(ORDER_STORAGE_KEY);
  };

  // 4. THAY ĐỔI LOGIC LOAD DỮ LIỆU
  // useEffect này sẽ chạy MỖI KHI trạng thái isLoggedIn thay đổi
  useEffect(() => {
    if (isLoggedIn) {
      // 4a. Nếu người dùng ĐĂNG NHẬP (hoặc vừa tải lại trang và vẫn đang đăng nhập)
      // -> Tải count từ localStorage (nếu có)
      try {
        const storedCounts = localStorage.getItem(ORDER_STORAGE_KEY);
        if (storedCounts) {
          const counts = JSON.parse(storedCounts);
          setConfirmingCount(counts.confirming || 0);
        } else {
          setConfirmingCount(0); // Đảm bảo là 0 nếu không có gì
        }
      } catch (error) {
        console.error("Failed to load order counts from localStorage", error);
        setConfirmingCount(0);
      }
    } else {
      // 4b. Nếu người dùng ĐĂNG XUẤT (isLoggedIn = false)
      // -> Xóa count
      clearConfirmingOrders();
    }
  }, [isLoggedIn]); // <-- Quan trọng: Chạy lại khi isLoggedIn thay đổi

  
  // 5. Hàm tăng count (giữ nguyên)
  const addConfirmingOrder = () => {
    // Chỉ tăng nếu đang đăng nhập
    if (!isLoggedIn) return; 

    const newCount = confirmingCount + 1;
    setConfirmingCount(newCount);
    
    try {
      localStorage.setItem(
        ORDER_STORAGE_KEY,
        JSON.stringify({ confirming: newCount })
      );
    } catch (error) {
      console.error("Failed to save order counts to localStorage", error);
    }
  };

  // 6. Cung cấp value (giữ nguyên)
  const value = {
    confirmingCount,
    addConfirmingOrder,
  };

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  );
};

// 7. Tạo hook (giữ nguyên)
export const useOrder = () => {
  return useContext(OrderContext);
};