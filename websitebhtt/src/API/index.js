
//dữ liệu cho sản phẩm trong kho 
const sampleProducts = [
  {
    id: 1,
    title: "Áo GuCi",
    price: 10000,
    discountedPrice: 1000000,
    quantity: 2,
    total: 100000,
    thumbnail: "http://khosiquanaogiare.com/wp-content/uploads/2020/05/croptop-gucci-3.jpg",
    rating: 4.5,
    stock: 120,
    brand: "LM",
    category: "Clothing",
  },
  {
    id: 2,
    title: "Túi Xách",
    price: 100000,
    discountedPrice: 1000000,
    quantity: 1,
    total: 10000000,
    thumbnail: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWb6XbCxJaBA0wbnqk745vswBBzFtlpV2zNg&s",
    rating: 4.2,
    stock: 60,
    brand: "LM",
    category: "Clothing",
  },
  {
    id: 3,
    title: "Giày Sneakers",
    price: 20000,
    discountedPrice: 200000,
    quantity: 1,
    total: 200000000,
    thumbnail: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR4XAywk2d8qwBxbcgrrMThMhPji_dKmUe9MfU7lfNXkk-WeDzvA1MOGJH94HdbCs_pmHiXDw&s",
    rating: 4.8,
    stock: 40,
    brand: "LM",
    category: "Footwear",
  },
  {
id: 4,
    title: "Áo Khoác",
    price: 4000,
    discountedPrice: 200000,
    quantity: 1,
    total: 200000000,
    thumbnail: "https://evara.vn/uploads/plugin/product_items/385/1.jpg",
    rating: 4.8,
    stock: 40,
    brand: "LM",
    category: "Footwear",
  },
];

const sampleUsers = [
  {
    id: 1,
    firstName: "Doãn",
    lastName: "Min",
    email: "doanmin@example.com",
    phone: "+123456789",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT7L63LSnvMMN6ur5jUpr38Srprrjte4HD0fDsDas4jflqQHO-T3QPmK3EvaJeGJhIN0mXa&s",
    address: { address: "186 Nguyễn Hữu Thọ", city: "Đà Nẵng" },
  },
  {
    id: 2,
    firstName: "Doãn",
    lastName: "Lực",
    email: "doanluc@example.com",
    phone: "+987654321",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQD5yEsOiigN-DG_MUtXFVzGpvIr0edKTGCcxIT1jDoXXyoL1huBDFJhzzSCrdpct_SqCvdAQ&s",
    address: { address: "186 Nguyễn Hữu Thọ", city: "Đà Nẵng" },
  },
];

const sampleComments = [
  { id: 1, body: "Sản phẩm tuyệt vời" },
  { id: 2, body: "Giao hàng nhanh chóng" },
  { id: 3, body: "Sẽ mua lại lần nữa" },
];

export function getInventory() {
  return Promise.resolve({ products: sampleProducts, total: sampleProducts.length });
}

export function getOrders() {
  return Promise.resolve({ products: sampleProducts, total: sampleProducts.length, discountedTotal: 1200 });
}

export function getCustomers() {
  return Promise.resolve({ users: sampleUsers, total: sampleUsers.length });
}

export function getComments() {
  return Promise.resolve({ comments: sampleComments });
}

export function getRevenue() {
  // sample carts for chart
  const carts = [
    { userId: 1, discountedTotal: 300 },
    { userId: 2, discountedTotal: 450 },
    { userId: 3, discountedTotal: 150 },
  ];
  return Promise.resolve({ carts });
}

// Default export (optional)
const api = {
  getInventory,
  getOrders,
  getCustomers,
  getComments,
  getRevenue,
};

export default api;
