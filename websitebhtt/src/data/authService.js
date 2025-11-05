/**
 * Dịch vụ này xử lý logic đăng nhập/đăng ký
 * Kết hợp cả 3 nguồn: Admin cứng, localStorage (đã đăng ký), và API (dummyjson)
 */

const LOGIN_API_URL = 'https://dummyjson.com/auth/login';
const USERS_STORAGE_KEY = 'my_app_users'; // Khóa để lưu user trong localStorage

// --- HÀM HỖ TRỢ LOCALSTORAGE ---

/** Lấy danh sách user từ localStorage */
const getUsersFromStorage = () => {
  const usersJson = localStorage.getItem(USERS_STORAGE_KEY);
  return usersJson ? JSON.parse(usersJson) : [];
};

/** Lưu danh sách user vào localStorage */
const saveUsersToStorage = (users) => {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
};

// --- HÀM XUẤT (EXPORT) ---

/**
 * Đăng ký user mới và LƯU VÀO LOCALSTORAGE
 */
export const registerUser = (username, password) => {
  return new Promise((resolve, reject) => {
    // Giả lập thời gian chờ
    setTimeout(() => {
      const users = getUsersFromStorage();
      
      // Kiểm tra xem username đã tồn tại chưa
      const existingUser = users.find(u => u.username === username);
      if (existingUser) {
        reject(new Error('Tên đăng nhập này đã tồn tại.'));
        return;
      }

      // Thêm user mới
      const newUser = {
        id: Date.now(),
        username: username,
        password: password, // Lưu ý: Thực tế không bao giờ lưu pass thế này
        role: 'user',
      };
      
      users.push(newUser);
      saveUsersToStorage(users); // Lưu lại danh sách mới
      resolve(newUser);
    }, 500);
  });
};

/**
 * Đăng nhập "lai" (hybrid)
 * Sẽ kiểm tra 3 nguồn theo thứ tự: Admin -> LocalStorage -> API
 */
export const loginUser = (username, password) => {
  return new Promise(async (resolve, reject) => {
    // Giả lập thời gian chờ
    setTimeout(async () => {
      // BƯỚC 1: Kiểm tra tài khoản admin cứng
      if (username === 'admin' && password === 'admin123') {
        resolve({
          id: 0,
          username: 'admin',
          firstName: 'Admin',
          role: 'admin',
        });
        return;
      }

      // BƯỚC 2: Kiểm tra tài khoản từ localStorage (đã đăng ký)
      const localUsers = getUsersFromStorage();
      const localUser = localUsers.find(
        (u) => u.username === username && u.password === password
      );

      if (localUser) {
        resolve({
          id: localUser.id,
          username: localUser.username,
          firstName: localUser.username, // Tạm dùng username làm tên
          role: 'user',
        });
        return;
      }

      // BƯỚC 3: Nếu không có, thử đăng nhập bằng API dummyjson
      try {
        const response = await fetch(LOGIN_API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password }),
        });

        const apiData = await response.json();

        if (!response.ok) {
          // Nếu API báo lỗi (vd: "Invalid credentials")
          reject(new Error(apiData.message || 'Tên đăng nhập hoặc mật khẩu không đúng.'));
        } else {
          // API đăng nhập thành công
          resolve({ ...apiData, role: 'user' }); // Gán tạm role 'user'
        }
      } catch (error) {
        // Lỗi mạng hoặc API sập
        reject(new Error('Lỗi kết nối. Vui lòng thử lại.'));
      }
    }, 500);
  });
};