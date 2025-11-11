import React, { useState } from 'react';
// Import component từ Ant Design
import { Input, Button, notification } from 'antd';
// Import icon từ Ant Design Icons
import { 
  MailOutlined, 
  PhoneOutlined, 
  EnvironmentOutlined, 
  SendOutlined, 
  LinkedinOutlined, 
  TwitterOutlined, 
  GithubOutlined, 
  FacebookOutlined,
  UserOutlined, // Thêm icon cho Tên
  MessageOutlined, // Thêm icon cho Chủ đề
} from '@ant-design/icons';

// 1. IMPORT FILE CSS CỦA BẠN
import '../style/Contact.css';

const { TextArea } = Input;

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [api, contextHolder] = notification.useNotification();

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Tên là bắt buộc';
    if (!formData.phone.trim()) newErrors.phone = 'Số điện thoại là bắt buộc';
    if (!formData.subject.trim()) newErrors.subject = 'Chủ đề là bắt buộc';
    if (!formData.message.trim()) newErrors.message = 'Tin nhắn là bắt buộc';
    if (!formData.email.trim()) {
      newErrors.email = 'Email là bắt buộc';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Định dạng email không hợp lệ';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      api.error({
        message: 'Lỗi xác thực',
        description: 'Vui lòng điền đầy đủ và chính xác các trường bắt buộc.',
        placement: 'topRight',
      });
      return;
    }
    setIsSubmitting(true);
    
    setTimeout(() => {
      console.log('Biểu mẫu đã gửi:', formData);
      api.success({
        message: 'Đã gửi tin nhắn!',
        description: "Cảm ơn bạn đã liên hệ. Chúng tôi sẽ phản hồi sớm.",
        placement: 'topRight',
      });
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      setIsSubmitting(false);
    }, 1500);
  };

  const contactInfo = [
    { icon: MailOutlined, label: 'Email', value: 'hello@company.com', href: 'mailto:hello@company.com' },
    { icon: PhoneOutlined, label: 'Điện thoại', value: '+1 (555) 123-4567', href: 'tel:+15551234567' },
    { icon: EnvironmentOutlined, label: 'Địa chỉ', value: '123 Business Street, Suite 100\nSan Francisco, CA 94105', href: null }
  ];

  const socialLinks = [
    { icon: LinkedinOutlined, href: '#', label: 'LinkedIn' },
    { icon: TwitterOutlined, href: '#', label: 'Twitter' },
    { icon: GithubOutlined, href: '#', label: 'Github' },
    { icon: FacebookOutlined, href: '#', label: 'Facebook' }
  ];

  return (
    <>
      {contextHolder}
      {/* 2. SỬ DỤNG CLASSNAME MỚI */}
      <div className="contact-page-wrapper">
        <div className="contact-container">
          {/* Tiêu đề */}
          <div className="contact-header">
            <h1>Liên Hệ</h1>
            <p>
              Bạn có câu hỏi hoặc muốn hợp tác? Chúng tôi rất mong nhận được phản hồi từ bạn.
            </p>
          </div>

          {/* Bố cục chia đôi màn hình */}
          <div className="contact-main-grid">
            
            {/* Bên trái - Biểu mẫu liên hệ */}
            <div className="contact-card contact-form-card">
              <h2>Gửi tin nhắn cho chúng tôi</h2>
              
              <form onSubmit={handleSubmit} className="contact-form space-y-6">
                {/* Trường Tên */}
                <div className="space-y-2">
                  <label htmlFor="name">Họ và Tên *</label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Nguyễn Văn A"
                    size="large"
                    status={errors.name ? 'error' : ''}
                    prefix={<UserOutlined />} // Thêm icon
                  />
                  {errors.name && (
                    <p className="text-sm text-red-500">{errors.name}</p>
                  )}
                </div>

                {/* Trường Email */}
                <div className="space-y-2">
                  <label htmlFor="email">Địa chỉ Email *</label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    size="large"
                    status={errors.email ? 'error' : ''}
                    prefix={<MailOutlined />} // Thêm icon
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500">{errors.email}</p>
                  )}
                </div>

                {/* Trường Số điện thoại */}
                <div className="space-y-2">
                  <label htmlFor="phone">Số Điện Thoại *</label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="0912 345 678"
                    size="large"
                    status={errors.phone ? 'error' : ''}
                    prefix={<PhoneOutlined />} // Thêm icon
                  />
                  {errors.phone && (
                    <p className="text-sm text-red-500">{errors.phone}</p>
                  )}
                </div>

                {/* Trường Chủ đề */}
                <div className="space-y-2">
                  <label htmlFor="subject">Chủ đề *</label>
                  <Input
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Chúng tôi có thể giúp gì cho bạn?"
                    size="large"
                    status={errors.subject ? 'error' : ''}
                    prefix={<MessageOutlined />} // Thêm icon
                  />
                  {errors.subject && (
                    <p className="text-sm text-red-500">{errors.subject}</p>
                  )}
                </div>

                {/* Trường Tin nhắn */}
                <div className="space-y-2">
                  <label htmlFor="message">Tin nhắn *</label>
                  <TextArea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Hãy cho chúng tôi biết thêm về yêu cầu của bạn..."
                    rows={5}
                    size="large"
                    status={errors.message ? 'error' : ''}
                  />
                  {errors.message && (
                    <p className="text-sm text-red-500">{errors.message}</p>
                  )}
                </div>

                {/* Nút Gửi */}
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={isSubmitting}
                  block
                  size="large"
                  icon={!isSubmitting ? <SendOutlined /> : null}
                  className="contact-submit-btn" // Sử dụng class CSS
                >
                  {isSubmitting ? 'Đang gửi...' : 'Gửi Tin Nhắn'}
                </Button>
              </form>
            </div>

            {/* Bên phải - Thông tin liên hệ */}
            <div className="contact-info-column">
              {/* Thẻ Chi tiết liên hệ */}
              <div className="contact-card contact-info-card">
                <h2>Thông tin liên hệ</h2>
                
                <div className="space-y-6">
                  {contactInfo.map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <div key={index} className="contact-info-item">
                        <div className="contact-info-item-icon-wrapper">
                          <Icon className="anticon" />
                        </div>
                        <div className="contact-info-item-content">
                          <h3>{item.label}</h3>
                          {item.href ? (
                            <a href={item.href}>{item.value}</a>
                          ) : (
                            <p>{item.value}</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Thẻ Liên kết mạng xã hội */}
              <div className="contact-card contact-social-card">
                <h2>Theo dõi chúng tôi</h2>
                <p>
                  Giữ kết nối và theo dõi chúng tôi trên mạng xã hội để nhận các bản cập nhật mới nhất.
                </p>
                
                <div className="contact-social-links">
                  {socialLinks.map((social, index) => {
                    const Icon = social.icon;
                    return (
                      <a
                        key={index}
                        href={social.href}
                        aria-label={social.label}
                      >
                        <Icon className="anticon" />
                      </a>
                    );
                  })}
                </div>
              </div>

              {/* Thẻ Thông tin bổ sung */}
              <div className="contact-card contact-hours-card">
                <h3>Giờ làm việc</h3>
                <div className="space-y-2">
                  <p>
                    <span>Thứ Hai - Thứ Sáu:</span>
                    <span>9:00 SÁNG - 6:00 TỐI</span>
                  </p>
                  <p>
                    <span>Thứ Bảy:</span>
                    <span>10:00 SÁNG - 4:00 CHIỀU</span>
                  </p>
                  <p>
                    <span>Chủ Nhật:</span>
                    <span>Đóng cửa</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact;