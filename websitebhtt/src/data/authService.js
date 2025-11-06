/**
 * Dịch vụ này xử lý logic đăng nhập/đăng ký
 * Kết hợp cả 3 nguồn: Admin cứng, localStorage (đã đăng ký), và API (dummyjson)
 */

const LOGIN_API_URL = 'https://dummyjson.com/auth/login';
const USERS_STORAGE_KEY = 'my_app_users'; // Khóa để lưu user trong localStorage

// --- HÀM HỖ TRỢ LOCALSTORAGE ---

/** Lấy danh sách user từ localStorage */
const getUsersFromStorage = () => {
  try {
    const usersJson = localStorage.getItem(USERS_STORAGE_KEY);
    // debug: log when reading stored users
    // console.debug can be removed later
    // eslint-disable-next-line no-console
    console.debug('[authService] read users from localStorage', USERS_STORAGE_KEY, usersJson);
    return usersJson ? JSON.parse(usersJson) : [];
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('[authService] Failed parsing users from storage', e);
    return [];
  }
};

/** Lưu danh sách user vào localStorage */
const saveUsersToStorage = (users) => {
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    // debug
    // eslint-disable-next-line no-console
    console.debug('[authService] saved users to localStorage', USERS_STORAGE_KEY, users);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('[authService] Failed saving users to storage', e);
  }
};

// --- HÀM XUẤT (EXPORT) ---

/**
 * Đăng ký user mới và LƯU VÀO LOCALSTORAGE
 */
export const registerUser = (usernameOrPayload, password) => {
  // Support two signatures:
  // registerUser(username, password)
  // registerUser({ username, password, firstName, lastName, email, phone })
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const users = getUsersFromStorage();

      const payload =
        typeof usernameOrPayload === 'object' && usernameOrPayload !== null
          ? usernameOrPayload
          : { username: usernameOrPayload, password };

      const { username } = payload;

      // Kiểm tra xem username đã tồn tại chưa
      const existingUser = users.find((u) => u.username === username);
      if (existingUser) {
        reject(new Error('Tên đăng nhập này đã tồn tại.'));
        return;
      }

      // Thêm user mới (lưu thêm thông tin nếu có)
      const newUser = {
        id: Date.now(),
        username: payload.username,
        password: payload.password || '', // NOTE: plaintext for demo only
        role: 'user',
        firstName: payload.firstName || payload.username,
        lastName: payload.lastName || '',
        email: payload.email || `${payload.username}@local`,
        phone: payload.phone || '',
        disabled: false, // default: account active
      };

      users.push(newUser);
      saveUsersToStorage(users); // Lưu lại danh sách mới
      // Phát sự kiện tuỳ chỉnh để các trang khác (ví dụ Admin Customers) lắng nghe
      try {
        window.dispatchEvent(new Event('my_app_users_updated'));
      } catch (e) {
        // ignore for non-browser env
      }
      // debug
      // eslint-disable-next-line no-console
      console.debug('[authService] registered new user', newUser);
      resolve(newUser);
    }, 500);
  });
};

// Trả về danh sách user đã lưu (xuất khẩu hàm để các trang khác có thể dùng)
export const getStoredUsers = () => {
  return getUsersFromStorage();
};

/**
 * Cập nhật thông tin user đã lưu trong localStorage.
 * Nếu user không tồn tại trong localStorage, sẽ tạo một bản copy local mới (override) và lưu.
 */
export const updateStoredUser = (updated) => {
  const users = getUsersFromStorage();
  const idx = users.findIndex((u) => u.id === updated.id);
  if (idx !== -1) {
    users[idx] = { ...users[idx], ...updated };
    saveUsersToStorage(users);
    try { window.dispatchEvent(new Event('my_app_users_updated')); } catch (e) {}
    return users[idx];
  }

  // Nếu không tồn tại, thêm như 1 user local (override)
  const newUser = {
    id: updated.id || Date.now(),
    username: updated.username || updated.email || `user_${Date.now()}`,
    password: updated.password || '',
    role: updated.role || 'user',
    firstName: updated.firstName || '',
    lastName: updated.lastName || '',
    email: updated.email || '',
    phone: updated.phone || '',
    disabled: !!updated.disabled,
  };
  users.push(newUser);
  saveUsersToStorage(users);
  try { window.dispatchEvent(new Event('my_app_users_updated')); } catch (e) {}
  return newUser;
};

/**
 * Set a user's disabled state (persist to localStorage).
 * Dispatches 'my_app_users_updated' so UI can refresh.
 */
export const setUserDisabled = (userId, disabled) => {
  const users = getUsersFromStorage();
  const idx = users.findIndex((u) => u.id === userId);
  if (idx === -1) return null;
  users[idx] = { ...users[idx], disabled };
  saveUsersToStorage(users);
  try {
    window.dispatchEvent(new Event('my_app_users_updated'));
  } catch (e) {}
  return users[idx];
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
        // If account is disabled, refuse login
        if (localUser.disabled) {
          reject(new Error('Tài khoản đã bị vô hiệu hoá. Vui lòng liên hệ quản trị viên.'));
          return;
        }

        resolve({
          id: localUser.id,
          username: localUser.username,
          firstName: localUser.firstName || localUser.username,
          lastName: localUser.lastName || '',
          email: localUser.email || `${localUser.username}@local`,
          phone: localUser.phone || '',
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