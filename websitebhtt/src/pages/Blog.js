import React, { useState, useMemo } from 'react';
import { Card, Input, Tag, Button, Pagination, Avatar, Space, Select, Badge, Tooltip, Empty } from 'antd';
import { SearchOutlined, HeartOutlined, HeartFilled, CommentOutlined, EyeOutlined, ClockCircleOutlined, FilterOutlined } from '@ant-design/icons';
import '../style/Blog.css';

const { Search } = Input;
const { Option } = Select;

// Dữ liệu giả (Mock data) cho Blog (Đa dạng nội dung)
const mockBlogPosts = [
  {
    id: 1,
    title: 'Săn Sale 11.11: Tổng Hợp Voucher Khủng & Quà Tặng Độc Quyền!',
    description: 'Đừng bỏ lỡ! Lưu ngay 10+ voucher giảm giá lên đến 50%, freeship và hàng ngàn quà tặng hấp dẫn sắp tung ra.',
    image: 'https://tinyurl.com/4dnsk5bw',
    category: 'Khuyến Mãi',
    tags: ['11.11', 'Voucher', 'Giảm Giá', 'Flash Sale'],
    author: 'Ban Quản Trị',
    avatar: 'https://i.pravatar.cc/150?img=1',
    date: '2025-11-05',
    views: 12800,
    likes: 950,
    comments: 120,
    readTime: '3 phút đọc'
  },
  {
    id: 2,
    title: 'Trên Tay Siêu Phẩm: Tai Nghe Chống Ồn XYZ Mới Nhất 2025',
    description: 'Mở hộp và đánh giá nhanh mẫu tai nghe đang làm mưa làm gió. Liệu chất âm có xứng đáng với giá tiền?',
    image: 'https://tinyurl.com/mrxx3jp9',
    category: 'Sản Phẩm',
    tags: ['Đánh giá', 'Hàng mới', 'Âm thanh', 'Tech'],
    author: 'Tech Reviewer',
    avatar: 'https://i.pravatar.cc/150?img=2',
    date: '2025-11-04',
    views: 4500,
    likes: 310,
    comments: 45,
    readTime: '7 phút đọc'
  },
  {
    id: 3,
    title: 'Chào Đón Cửa Hàng Mới Tại Hà Nội: Tuần Lễ Khai Trương Rộn Ràng',
    description: 'Ghé thăm không gian mua sắm mới của chúng tôi tại 123 Phố Huế. Rất nhiều quà tặng check-in và giảm giá đặc biệt!',
    image: 'https://tinyurl.com/2mdtv7c6',
    category: 'Sự Kiện',
    tags: ['Khai Trương', 'Cửa Hàng Mới', 'Hà Nội', 'Offline'],
    author: 'Team Marketing',
    avatar: 'https://i.pravatar.cc/150?img=3',
    date: '2025-11-02',
    views: 3200,
    likes: 180,
    comments: 30,
    readTime: 'Sự kiện 10-15/11'
  },
  {
    id: 4,
    title: 'Hành Trình Của Chúng Tôi: 5 Năm Mang Sản Phẩm Chất Lượng Đến Tay Bạn',
    description: 'Nhìn lại 5 năm thành lập và phát triển, từ một ý tưởng nhỏ đến thương hiệu được tin cậy. Cảm ơn bạn đã đồng hành!',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80',
    category: 'Về Chúng Tôi',
    tags: ['Thương Hiệu', 'Câu Chuyện', 'Kỷ Niệm'],
    author: 'Sáng Lập Viên',
    avatar: 'https://i.pravatar.cc/150?img=4',
    date: '2025-10-30',
    views: 1500,
    likes: 90,
    comments: 15,
    readTime: '4 phút đọc'
  },
  {
    id: 5,
    title: 'Cẩm Nang Chọn Quà 20/11: Gợi Ý Quà Tặng Ý Nghĩa Cho Thầy Cô',
    description: 'Ngày Nhà giáo Việt Nam đang đến gần. Cùng tham khảo 10+ gợi ý quà tặng thiết thực và ý nghĩa nhất.',
    image: 'https://tinyurl.com/3dk8nw3b',
    category: 'Tư Vấn',
    tags: ['Quà Tặng', '20/11', 'Cẩm Nang', 'Gợi Ý'],
    author: 'Content Team',
    avatar: 'https://i.pravatar.cc/150?img=5',
    date: '2025-10-28',
    views: 9100,
    likes: 720,
    comments: 85,
    readTime: '6 phút đọc'
  },
  {
    id: 6,
    title: 'Mẹo Dùng Nồi Chiên Không Dầu: 5 Công Thức Nhanh Gọn',
    description: 'Tận dụng tối đa chiếc nồi chiên không dầu của bạn với 5 công thức món ăn lành mạnh, dễ làm chỉ trong 15 phút.',
    image: 'https://tinyurl.com/3zus8kvx',
    category: 'Mẹo Hay',
    tags: ['Gia Dụng', 'Nấu Ăn', 'Công Thức', 'Tutorial'],
    author: 'Đầu Bếp Tại Gia',
    avatar: 'https://i.pravatar.cc/150?img=6',
    date: '2025-10-25',
    views: 11200,
    likes: 1100,
    comments: 205,
    readTime: '8 phút đọc'
  },
  {
    id: 7,
    title: 'Xu Hướng Thu Đông 2025: 3 Cách Phối Đồ Với Áo Khoác Blazer',
    description: 'Biến hóa phong cách từ công sở thanh lịch đến dạo phố cá tính chỉ với một chiếc áo khoác blazer. Khám phá ngay!',
    image: 'https://tinyurl.com/5zu4zk4h',
    category: 'Thời Trang',
    tags: ['Phối Đồ', 'OOTD', 'Thu Đông', 'Xu Hướng'],
    author: 'Fashionista Anna',
    avatar: 'https://i.pravatar.cc/150?img=7',
    date: '2025-10-22',
    views: 6300,
    likes: 410,
    comments: 70,
    readTime: '5 phút đọc'
  },
  {
    id: 8,
    title: 'Cập Nhật Chính Sách Bảo Hành: Mở Rộng Lên Đến 24 Tháng',
    description: 'Tin vui! Chúng tôi chính thức nâng thời gian bảo hành cho nhiều dòng sản phẩm để mang lại trải nghiệm an tâm nhất.',
    image: 'https://tinyurl.com/ythtn42k',
    category: 'Thông Báo',
    tags: ['Chính Sách', 'Bảo Hành', 'Hỗ Trợ', 'Quan Trọng'],
    author: 'Ban Quản Trị',
    avatar: 'https://i.pravatar.cc/150?img=1',
    date: '2025-10-20',
    views: 2100,
    likes: 50,
    comments: 10,
    readTime: '2 phút đọc'
  },
  {
    id: 9,
    title: 'Cuộc Thi Ảnh "Khoảnh Khắc Cùng Shop": Rinh Ngay Quà Khủng!',
    description: 'Chia sẻ hình ảnh của bạn với sản phẩm của shop và có cơ hội nhận được voucher mua hàng 1.000.000 VNĐ. Xem thể lệ ngay!',
    image: 'https://tinyurl.com/fu43x35f',
    category: 'Sự Kiện',
    tags: ['Cuộc Thi', 'Minigame', 'Giveaway', 'Feedback'],
    author: 'Team Marketing',
    avatar: 'https://i.pravatar.cc/150?img=3',
    date: '2025-10-18',
    views: 15000,
    likes: 1500,
    comments: 450,
    readTime: 'Thể lệ cuộc thi'
  }
];

const Blog = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [likedPosts, setLikedPosts] = useState([]);
  const pageSize = 6;

  // Lấy các danh mục duy nhất
  const categories = ['all', ...new Set(mockBlogPosts.map(post => post.category))];

  // Lọc và tìm kiếm bài viết
  const filteredPosts = useMemo(() => {
    return mockBlogPosts.filter(post => {
      const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            post.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  // Bài viết đã được phân trang
  const paginatedPosts = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredPosts.slice(startIndex, startIndex + pageSize);
  }, [filteredPosts, currentPage]);

  // Xử lý Thích/Bỏ thích
  const handleLike = (postId) => {
    setLikedPosts(prev => 
      prev.includes(postId) 
        ? prev.filter(id => id !== postId)
        : [...prev, postId]
    );
  };

  // Xử lý thay đổi trang
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="blog-container">
      {/* Nền Động (Animated Background) */}
      <div className="blog-background">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
      </div>

      {/* Phần Tiêu đề (Header Section) */}
      <div className="blog-header">
        <div className="header-content">
          <h1 className="blog-title">
            <span className="title-gradient">Blog</span> Kiến Thức
          </h1>
          <p className="blog-subtitle">
            Khám phá những thông tin, sự kiện, sản phẩm mới nhất được cập nhật của chúng tôi
          </p>
        </div>
      </div>

      {/* Phần Lọc (Filter Section) */}
      <div className="filter-section">
        <div className="filter-content">
          <div className="search-wrapper">
            <Search
              placeholder="Tìm kiếm bài viết..."
              allowClear
              size="large"
              prefix={<SearchOutlined className="search-icon" />}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="blog-search"
            />
          </div>
          
          <div className="category-filter">
            <FilterOutlined className="filter-icon" />
            <Select
              size="large"
              value={selectedCategory}
              onChange={(value) => {
                setSelectedCategory(value);
                setCurrentPage(1);
              }}
              className="category-select"
              suffixIcon={null}
            >
              {categories.map(cat => (
                <Option key={cat} value={cat}>
                  {cat === 'all' ? 'Tất cả' : cat}
                </Option>
              ))}
            </Select>
          </div>
        </div>
        
        <div className="results-count">
          <Badge 
            count={filteredPosts.length} 
            showZero 
            style={{ backgroundColor: '#10b981' }}
          />
          <span className="count-text">bài viết</span>
        </div>
      </div>

      {/* Lưới Blog (Blog Grid) */}
      <div className="blog-grid">
        {paginatedPosts.length > 0 ? (
          paginatedPosts.map((post) => {
            const isLiked = likedPosts.includes(post.id);
            const displayLikes = post.likes + (isLiked ? 1 : 0);
            
            return (
              <Card
                key={post.id}
                className="blog-card"
                cover={
                  <div className="card-image-wrapper">
                    <img
                      alt={post.title}
                      src={post.image}
                      className="card-image"
                    />
                    <div className="image-overlay">
                      <Tag className="category-tag" color="rgba(16, 185, 129, 0.9)">
                        {post.category}
                      </Tag>
                    </div>
                  </div>
                }
                hoverable
              >
                <div className="card-content">
                  <h3 className="card-title">{post.title}</h3>
                  <p className="card-description">{post.description}</p>
                  
                  <div className="card-tags">
                    {post.tags.map((tag, index) => (
                      <Tag key={index} className="post-tag">
                        {tag}
                      </Tag>
                    ))}
                  </div>

                  <div className="card-meta">
                    <div className="author-info">
                      <Avatar src={post.avatar} size={36} className="author-avatar" />
                      <div className="author-details">
                        <span className="author-name">{post.author}</span>
                        <span className="post-date">
                          <ClockCircleOutlined /> {post.date} • {post.readTime}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="card-actions">
                    <Space size="large">
                      <Tooltip title="Lượt xem">
                        <span className="action-item">
                          <EyeOutlined />
                          <span className="action-count">{post.views}</span>
                        </span>
                      </Tooltip>
                      
                      <Tooltip title={isLiked ? 'Bỏ thích' : 'Thích'}>
                        <Button
                          type="text"
                          className={`action-button ${isLiked ? 'liked' : ''}`}
                          icon={isLiked ? <HeartFilled /> : <HeartOutlined />}
                          onClick={() => handleLike(post.id)}
                        >
                          <span className="action-count">{displayLikes}</span>
                        </Button>
                      </Tooltip>
                      
                      <Tooltip title="Bình luận">
                        <Button
                          type="text"
                          className="action-button"
                          icon={<CommentOutlined />}
                        >
                          <span className="action-count">{post.comments}</span>
                        </Button>
                      </Tooltip>
                    </Space>

                    <Button type="primary" className="read-more-btn">
                      Đọc thêm
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })
        ) : (
          <div className="empty-state">
            <Empty
              description="Không tìm thấy bài viết nào"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          </div>
        )}
      </div>

      {/* Phân Trang (Pagination) */}
      {filteredPosts.length > pageSize && (
        <div className="pagination-wrapper">
          <Pagination
            current={currentPage}
            total={filteredPosts.length}
            pageSize={pageSize}
            onChange={handlePageChange}
            showSizeChanger={false}
            className="blog-pagination"
          />
        </div>
      )}
    </div>
  );
};

export default Blog;