// src/context/AuthContext.js
import React, { createContext, useState, useContext } from "react";

// HÀM MỚI: Lấy trạng thái ban đầu khi tải trang
const getInitialAuthState = () => {
  const token = localStorage.getItem("userToken");
  const storedUser = localStorage.getItem("userData");
  
  if (token && storedUser) {
    try {
      // Parse (chuyển đổi) chuỗi JSON trong localStorage thành object
      const user = JSON.parse(storedUser);
      return { token, user, isLoggedIn: true };
    } catch (error) {
      // Nếu dữ liệu hỏng, xóa hết
      localStorage.removeItem("userToken");
      localStorage.removeItem("userData");
      return { token: null, user: null, isLoggedIn: false };
    }
  }

  // Không có token hoặc user
  return { token: null, user: null, isLoggedIn: false };
};


// 1. Tạo Context
const AuthContext = createContext();

// 2. Tạo Provider
export const AuthProvider = ({ children }) => {
  // Lấy trạng thái ban đầu từ hàm trên
  const initialState = getInitialAuthState();

  const [userToken, setUserToken] = useState(initialState.token);
  const [currentUser, setCurrentUser] = useState(initialState.user);
  const [isLoggedIn, setIsLoggedIn] = useState(initialState.isLoggedIn);

  // Hàm Login: (ĐÃ THAY ĐỔI)
  // Giờ đây nhận cả token và thông tin user
  const login = (token, user) => {
    try {
      // Lưu cả 2 vào localStorage
      localStorage.setItem("userToken", token);
      localStorage.setItem("userData", JSON.stringify(user)); // Chuyển user object thành chuỗi
      
      // Cập nhật state
      setUserToken(token);
      setCurrentUser(user);
      setIsLoggedIn(true);
    } catch (error) {
      console.error("Failed to save auth state:", error);
    }
  };

  // Hàm Logout: (ĐÃ THAY ĐỔI)
  // Xóa cả 2 khỏi localStorage
  const logout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("userData");
    
    // Cập nhật state
    setUserToken(null);
    setCurrentUser(null);
    setIsLoggedIn(false);
  };

  // === HÀM MỚI ĐỂ CẬP NHẬT USER ===
  // Hàm này sẽ hợp nhất dữ liệu mới (ví dụ: avatar) vào user hiện tại
  const updateUser = (newUserData) => {
    try {
      // 1. Hợp nhất user cũ (từ state) và dữ liệu mới
      const updatedUser = { ...currentUser, ...newUserData };
      
      // 2. Cập nhật localStorage ("userData")
      // Đây là bước quan trọng để Header.js thấy được
      localStorage.setItem("userData", JSON.stringify(updatedUser));
      
      // 3. Cập nhật state (để mọi component khác tự render lại)
      setCurrentUser(updatedUser);

    } catch (error) {
      console.error("Failed to update user state:", error);
    }
  };
  // ==================================


  // === THÊM updateUser VÀO VALUE ===
  const value = { 
    isLoggedIn, 
    login, 
    logout, 
    currentUser, 
    userToken, 
    updateUser // <-- Thêm hàm mới vào đây
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// 3. Tạo hook để dễ dàng sử dụng (không đổi)
export const useAuth = () => {
  return useContext(AuthContext);
};