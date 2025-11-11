// src/context/OrderHistoryContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext'; // Dùng AuthContext của bạn

const OrderHistoryContext = createContext();

export const useOrderHistory = () => useContext(OrderHistoryContext);

// Key chính trong localStorage để lưu TẤT CẢ đơn hàng
const ALL_ORDERS_KEY = 'allUserOrders'; 

// === HÀM MỚI ĐỂ LẤY KEY AN TOÀN ===
// Hàm này sẽ tìm key duy nhất (email, username, hoặc id) từ đối tượng user
const getUserKey = (user) => {
  if (!user) {
    return null; // Không có user, trả về null
  }

  // Logic này sẽ ưu tiên 'email', nếu không có sẽ tìm 'username', rồi đến 'id'.
  // Nó hoạt động cho cả tài khoản API (có email) và tài khoản local (có thể chỉ có username).
  const key = user.email || user.username || user.id;

  if (!key) {
    console.error(
      "LỖI NGHIÊM TRỌNG: OrderHistoryContext không tìm thấy key duy nhất (email, username, hoặc id) trên đối tượng currentUser.",
      user
    );
    return null;
  }
  
  return String(key); // Trả về key (chuyển thành chuỗi để đảm bảo)
};
// ==================================


export const OrderHistoryProvider = ({ children }) => {
  const { currentUser } = useAuth(); // Lấy người dùng hiện tại từ AuthContext
  
  // State này sẽ chứa MẢNG các đơn hàng của user đang đăng nhập
  const [orderHistory, setOrderHistory] = useState([]); 

  // 1. Tải lịch sử đơn hàng KHI NGƯỜI DÙNG THAY ĐỔI
  useEffect(() => {
    // Lấy key an toàn từ hàm helper
    const userKey = getUserKey(currentUser);

    if (userKey) { // <-- Chỉ chạy nếu có key
      try {
        // Lấy object { 'user@api.com': [...], 'local_user': [...] }
        const allOrders = JSON.parse(localStorage.getItem(ALL_ORDERS_KEY)) || {};
        
        // Lấy mảng đơn hàng bằng key đã tìm thấy
        const userOrders = allOrders[userKey] || []; 
        setOrderHistory(userOrders);

      } catch (error) {
        console.error("Lỗi khi tải lịch sử đơn hàng:", error);
        setOrderHistory([]);
      }
    } else {
      // Nếu không ai đăng nhập (hoặc user không có key), set lịch sử về rỗng
      setOrderHistory([]);
    }
  }, [currentUser]); // Chạy lại mỗi khi currentUser thay đổi

  // 2. Hàm để THÊM đơn hàng mới vào lịch sử
  const addOrderToHistory = (newOrderData) => {
    // Lấy key an toàn từ hàm helper
    const userKey = getUserKey(currentUser);

    if (!userKey) { // <-- Kiểm tra bằng key
      console.error('Không thể lưu đơn hàng: Người dùng không hợp lệ hoặc thiếu key (email/username/id).');
      return; // <-- Dừng lại nếu không có key
    }

    // Tạo một đối tượng đơn hàng hoàn chỉnh
    const newOrder = {
      ...newOrderData,
      id: `ORDER-${new Date().getTime()}`, // Tạo ID đơn hàng
      orderDate: new Date().toISOString(),
      status: 'Processing', // Set trạng thái mặc định
    };

    try {
      // Lấy toàn bộ object đơn hàng từ localStorage
      const allOrders = JSON.parse(localStorage.getItem(ALL_ORDERS_KEY)) || {};
      
      // Lấy danh sách đơn hàng CŨ của người dùng này (dùng key)
      const oldUserOrders = allOrders[userKey] || [];
      
      // Tạo danh sách MỚI (thêm đơn mới vào đầu)
      const newUserOrders = [newOrder, ...oldUserOrders];
  
      // Cập nhật lại object tổng (dùng key)
      const updatedAllOrders = {
        ...allOrders,
        [userKey]: newUserOrders, 
      };
  
      // Lưu lại vào localStorage
      localStorage.setItem(ALL_ORDERS_KEY, JSON.stringify(updatedAllOrders));
  
      // Cập nhật state nội bộ của Context (để trang OrderHistory tự cập nhật)
      setOrderHistory(newUserOrders);

    } catch (error) {
      console.error("Lỗi khi lưu đơn hàng mới:", error);
    }
  };

  // 3. Hàm để CẬP NHẬT trạng thái đơn hàng (ví dụ: hủy đơn)
  const updateOrderStatus = (orderId, newStatus) => {
    const userKey = getUserKey(currentUser);
    if (!userKey) {
      console.error('Không thể cập nhật đơn hàng: Người dùng không hợp lệ hoặc thiếu key.');
      return false;
    }

    try {
      const allOrders = JSON.parse(localStorage.getItem(ALL_ORDERS_KEY)) || {};
      const userOrders = allOrders[userKey] || [];

      const updatedUserOrders = userOrders.map((o) => {
        if (o.id === orderId) {
          return {
            ...o,
            status: newStatus,
            updatedAt: new Date().toISOString(),
          };
        }
        return o;
      });

      const updatedAllOrders = { ...allOrders, [userKey]: updatedUserOrders };
      localStorage.setItem(ALL_ORDERS_KEY, JSON.stringify(updatedAllOrders));
      setOrderHistory(updatedUserOrders);
      return true;
    } catch (error) {
      console.error('Lỗi khi cập nhật trạng thái đơn hàng:', error);
      return false;
    }
  };

  // 4. Tiện ích: hủy đơn hàng (chỉ wrapper để dễ dùng)
  const cancelOrder = (orderId) => updateOrderStatus(orderId, 'Cancelled');

  const value = {
    orderHistory,     // Danh sách đơn hàng của user hiện tại
    addOrderToHistory,   // Hàm để thêm đơn hàng mới
    updateOrderStatus,
    cancelOrder,
  };

  return (
    <OrderHistoryContext.Provider value={value}>{children}</OrderHistoryContext.Provider>
  );
};