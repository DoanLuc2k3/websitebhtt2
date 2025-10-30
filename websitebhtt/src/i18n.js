// src/i18n.js (Cập nhật hoàn chỉnh)
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from 'i18next-browser-languagedetector';

const initialLang = localStorage.getItem('appLanguage') || 'vi';

const resources = {
  vi: {
    translation: {
      // GLOBAL / APP HEADER
      "system_settings": "Cài đặt hệ thống", "notifications_mode": "Chế độ thông báo",
      "auto_update": "Cập nhật tự động", "display_language": "Ngôn ngữ hiển thị",
      "interface": "Giao diện", "switch_to_dark": "Chuyển sang chế độ tối",
      "switch_to_light": "Chuyển sang chế độ sáng", "save_changes": "Lưu thay đổi",
      "cancel": "Hủy", "on": "Bật", "off": "Tắt",
      "setting_saved_success": "Lưu cài đặt thành công!", "logout_success": "Đã đăng xuất thành công!",
      "searching_for": "Đang tìm kiếm: \"{{term}}\"", "search_placeholder": "Tìm kiếm sản phẩm, đơn hàng, khách hàng...",
      "personal_info": "Thông tin cá nhân", "logout": "Đăng xuất",
      "admin_profile": "Thông tin Quản trị viên", "system_admin": "Quản trị hệ thống",
      "update_info": "Cập nhật thông tin", "back": "Quay lại",
      "username": "Tên đăng nhập", "phone_number": "Số điện thoại",
      "role": "Chức vụ", "new_comment": "📩 Bình luận mới",
      "order_notification": "🔔 Thông báo đơn hàng", "order_placed": "đã được đặt hàng!",
      "vietnamese_language": "Tiếng Việt", "english_language": "English",
      "search_results": "kết quả", // 👈 THÊM KEY MỚI
      "dark_mode_status": "Chế độ {{status}} đã được kích hoạt!", // 👈 THÊM KEY MỚI
      
      // SIDE MENU
      "overview": "Tổng quan", "inventory": "Quản lý kho", "orders": "Đơn hàng",
      "staffs": "Nhân viên", "customers": "Khách hàng", "marketing": "Marketing & Khuyến mãi", "help": "Hỗ trợ",

      // DASHBOARD
      "total_overview": "Tổng quan", "total_revenue": "Tổng doanh thu", "growth_rate": "Tăng trưởng",
      "new_customers": "Khách hàng mới", "top_product": "Sản phẩm bán chạy", "revenue_analysis": "Phân tích Doanh thu",
      "monthly_revenue_trend": "Xu hướng Doanh thu theo tháng", "revenue": "Doanh thu",
      "product_performance": "Hiệu suất Sản phẩm", "top_selling_products": "Sản phẩm bán chạy nhất",
      "top_spending_customers": "Khách hàng chi tiêu cao", "total_spent": "Tổng chi tiêu",
      "recent_orders": "Đơn hàng gần đây", "product_name": "Tên sản phẩm", "quantity": "Số lượng",
      "unit_price": "Đơn giá", "action": "Hành động", "view_order_details": "Xem chi tiết đơn hàng",
      "details": "Chi tiết", "progress_tooltip": "Chiếm {{percent}}% so với Khách hàng Top 1",

      // INVENTORY PAGE
      "inventory_add_product": "Thêm sản phẩm", "inventory_update_success": "Cập nhật sản phẩm thành công!",
      "inventory_add_success": "Thêm sản phẩm mới thành công!", "inventory_delete_success": "Xóa sản phẩm thành công!",
      "inventory_confirm_delete": "Bạn có chắc muốn xóa sản phẩm này?", "inventory_modal_update": "Cập nhật sản phẩm",
      "inventory_modal_add": "Thêm sản phẩm mới", "inventory_col_image": "Ảnh",
      "inventory_col_name": "Tên sản phẩm", "inventory_col_price": "Giá", "inventory_col_rating": "Đánh giá",
      "inventory_col_stock": "Tồn kho", "inventory_col_brand": "Thương hiệu",
      "inventory_col_category": "Danh mục", "inventory_col_actions": "Hành động",
      "inventory_label_name": "Tên sản phẩm", "inventory_msg_name_required": "Vui lòng nhập tên sản phẩm!",
      "inventory_placeholder_name": "Nhập tên sản phẩm", "inventory_label_price": "Giá",
      "inventory_msg_price_required": "Nhập giá sản phẩm!", "inventory_placeholder_price": "VD: 299",
      "inventory_label_rating": "Đánh giá", "inventory_label_stock": "Tồn kho", "inventory_label_brand": "Thương hiệu",
      "inventory_placeholder_brand": "VD: Nike, Samsung...", "inventory_label_category": "Danh mục",
      "inventory_placeholder_category": "Chọn danh mục", "inventory_label_image_link": "Link ảnh sản phẩm",
      "inventory_placeholder_image_link": "Nhập URL hình ảnh",
      "add": "Thêm", "update": "Cập nhật", "delete": "Xóa",
      
      // CATEGORY MOCK DATA
      "clothing": "Quần áo", "footwear": "Giày dép", "electronics": "Điện tử",
      "furniture": "Nội thất", "accessories": "Phụ kiện",
      
      // ORDERS PAGE
      "orders_title": "Quản lý Đơn hàng", "orders_search_placeholder": "Tìm theo tên sản phẩm...",
      "orders_filter_all": "Tất cả", "orders_filter_delivered": "Đã giao",
      "orders_filter_processing": "Đang xử lý", "orders_filter_cancelled": "Đã hủy",
      "orders_btn_create": "Tạo đơn hàng", "orders_col_product": "Sản phẩm (Mã đơn)",
      "orders_col_customer": "Khách hàng", "orders_col_date": "Ngày đặt", "orders_col_qty": "Số lượng",
      "orders_col_total": "Tổng cộng", "orders_col_status": "Trạng thái", "orders_col_actions": "Hành động",
      "orders_tag_delivered": "Đã giao", "orders_tag_processing": "Đang xử lý", "orders_tag_cancelled": "Đã hủy",
      "orders_tip_view_detail": "Xem chi tiết nhanh", "orders_tip_edit_status": "Chỉnh sửa trạng thái",
      "orders_tip_save_changes": "Lưu thay đổi", "orders_msg_edit_warning": "Chỉ có thể chỉnh sửa trạng thái đơn hàng Đang xử lý.",
      "orders_msg_update_success": "Cập nhật trạng thái đơn hàng #{{key}} thành công!", "orders_modal_title": "Tạo đơn hàng mới (Thủ công)",
      "orders_modal_btn_confirm": "Xác nhận thêm", "orders_placeholder_product_name": "Nhập tên sản phẩm",
      "orders_placeholder_customer_name": "Nhập tên khách hàng", "orders_placeholder_qty": "Nhập số lượng",
      "orders_placeholder_select_status": "Chọn trạng thái", "orders_label_price": "Giá sản phẩm (VNĐ)",
      "orders_product_info": "Thông tin sản phẩm", "orders_payment_total": "Tổng thanh toán", "orders_msg_status_required": "Chọn trạng thái!",

      // STAFFS PAGE 
      "staffs_title": "Quản lý nhân viên", "staffs_search_placeholder": "Tìm theo tên, email hoặc phone...",
      "staffs_filter_all": "Tất cả vai trò", "staffs_filter_admin": "Admin", "staffs_filter_staff": "Nhân viên",
      "staffs_btn_add": "Thêm nhân viên", "staffs_col_staff": "Nhân viên", "staffs_col_phone": "Số điện thoại",
      "staffs_col_role": "Vai trò", "staffs_col_status": "Trạng thái", "staffs_col_actions": "Hành động",
      "staffs_status_active": "Hoạt động", "staffs_status_inactive": "Vô hiệu", "staffs_tip_edit": "Sửa",
      "staffs_tip_reset_pwd": "Reset mật khẩu", "staffs_tip_delete": "Xóa", "staffs_confirm_delete": "Bạn có chắc muốn xóa tài khoản này?",
      "staffs_msg_delete_title": "Xóa tài khoản", "staffs_msg_delete_success": "Đã xóa tài khoản thành công.",
      "staffs_msg_status_update": "Cập nhật trạng thái", "staffs_msg_status_success": "Tài khoản {{name}} đã {{status}}.",
      "staffs_msg_account_not_found": "Không tìm thấy tài khoản", "staffs_msg_reset_pwd": "Reset mật khẩu",
      "staffs_msg_reset_pwd_detail": "Mật khẩu mới cho user (fake): {{password}} — hãy nhắc họ đổi sau khi đăng nhập.",
      "staffs_msg_update": "Cập nhật", "staffs_msg_update_success": "Cập nhật thông tin nhân viên thành công.",
      "staffs_msg_add": "Thêm mới", "staffs_msg_add_success": "Tạo tài khoản nhân viên thành công.",
      "staffs_modal_edit": "Chỉnh sửa nhân viên", "staffs_modal_add": "Thêm nhân viên",
      "staffs_label_name": "Họ và tên", "staffs_msg_name_required": "Vui lòng nhập họ tên",
      "staffs_msg_email_invalid": "Email không hợp lệ", "staffs_placeholder_phone": "Ví dụ: 09xxxxxxxx",
      "staffs_msg_role_required": "Chọn vai trò",
      
      // CUSTOMERS PAGE
      "cus_title_customer_management": "Quản lý khách hàng", "cus_placeholder_search": "Tìm tên, SĐT, Email...",
      "cus_placeholder_filter_city": "Lọc TP", "cus_filter_all": "Tất cả", "cus_button_activity": "Hoạt động",
      "cus_button_export_report": "Xuất báo cáo", "cus_col_customer": "Khách hàng",
      "cus_status_online": "Đang hoạt động", "cus_status_offline": "Ngoại tuyến", "cus_col_contact_info": "Thông tin liên hệ",
      "cus_col_avg_order_value": "Giá trị TB Đơn hàng", "cus_text_avg_value": "Giá trị trung bình", "cus_col_total_orders": "Tổng Đơn hàng",
      "cus_col_join_date": "Ngày tham gia", "cus_col_actions": "Hành động", "cus_tip_edit_profile": "Chỉnh sửa hồ sơ",
      "cus_tip_view_activity": "Xem lịch sử hoạt động (Timeline)", "cus_tip_log_interaction": "Ghi nhận tương tác / Gửi Email nhanh",
      "cus_modal_edit_profile_title": "Chỉnh sửa Hồ sơ khách hàng", "cus_label_last_name": "Họ",
      "cus_msg_last_name_required": "Vui lòng nhập Họ!", "cus_label_first_name": "Tên",
      "cus_msg_first_name_required": "Vui lòng nhập Tên!", "cus_label_phone": "Số điện thoại",
      "cus_label_city": "Thành phố", "cus_button_save_changes": "Lưu thay đổi",
      "cus_modal_log_interaction_title": "Ghi nhận Tương tác với {{name}}", "cus_label_contact_method": "Phương thức liên hệ",
      "cus_msg_contact_method_required": "Vui lòng chọn phương thức!", "cus_placeholder_select_action": "Chọn hành động",
      "cus_method_phone": "Gọi Điện thoại", "cus_method_email": "Gửi Email Marketing", "cus_method_chat": "Tương tác Zalo/Chat",
      "cus_label_interaction_note": "Ghi chú tương tác (Tùy chọn)", "cus_placeholder_interaction_note": "Ví dụ: Đã gọi xác nhận đơn hàng, khách đồng ý mua thêm...",
      "cus_button_log_action": "Ghi nhận hành động", "cus_msg_update_success": "Cập nhật hồ sơ {{name}} thành công!",
      "cus_msg_contact_logged": "Đã ghi nhận tương tác qua {{method}} với {{name}}!", "cus_msg_no_data_export": "Không có dữ liệu để xuất!",
      "cus_msg_export_success": "Đã xuất thành công {{count}} khách hàng!", "cus_msg_open_activity_page": "Mở trang Tổng quan hoạt động chung",
      "cus_timeline_account_registered": "Khách hàng đăng ký tài khoản", "cus_timeline_order_success": "Đặt hàng thành công",
      "cus_timeline_value": "Giá trị", "cus_timeline_live_chat_request": "Yêu cầu hỗ trợ qua Live Chat (Chờ xử lý)",
      "today": "Hôm nay", "cus_report_filename": "bao_cao_khach_hang",

      // PROMOTION PAGE
      "promo_title": "Quản lý Marketing & Khuyến mãi", "promo_tab_campaigns": "Chiến dịch Khuyến mãi",
      "promo_tab_coupons": "Mã giảm giá (Coupons)", "promo_tab_loyalty": "Khách hàng Thân thiết",
      "promo_campaigns_title": "Danh sách Chiến dịch", "promo_btn_create_campaign": "Tạo Chiến dịch Mới",
      "promo_col_name": "Tên Chiến dịch", "promo_col_type": "Loại Ưu đãi", "promo_col_time": "Thời gian Áp dụng",
      "promo_col_status": "Trạng thái", "promo_col_performance": "Hiệu suất", "promo_col_actions": "Thao tác",
      "promo_status_running": "Đang chạy", "promo_status_paused": "Tạm dừng", "promo_modal_edit": "Chỉnh sửa Chiến dịch",
      "promo_modal_create": "Tạo Chiến dịch Mới", "promo_btn_edit": "Sửa", "promo_text_to": "đến",
      "promo_msg_campaign_saved": "Đã lưu chiến dịch thành công!", "promo_label_campaign_name": "Tên Chiến dịch",
      "promo_msg_name_required": "Vui lòng nhập tên!", "promo_placeholder_campaign_name": "Ví dụ: Giảm giá mùa hè 2025",
      "promo_label_time": "Thời gian áp dụng", "promo_msg_time_required": "Vui lòng chọn thời gian!",
      "promo_label_type": "Loại Ưu đãi", "promo_msg_type_required": "Vui lòng chọn loại!",
      "promo_placeholder_type": "Chọn loại ưu đãi", "promo_type_discount_percent": "Giảm giá theo %",
      "promo_type_discount_fixed": "Giảm giá cố định", "promo_type_free_shipping": "Miễn phí Vận chuyển",
      "promo_label_value": "Giá trị Ưu đãi", "promo_placeholder_value": "Ví dụ: 15 (nếu là 15%) hoặc 100000 (nếu là tiền mặt)",
      "promo_btn_save_changes": "Lưu Thay Đổi", "promo_btn_create_campaign_short": "Tạo Chiến dịch",
      "promo_coupons_title": "Danh sách Mã giảm giá", "promo_btn_create_batch": "Tạo Hàng Loạt",
      "promo_col_coupon_code": "Mã Coupon", "promo_col_coupon_value": "Giá trị Giảm",
      "promo_col_expiry_date": "Hạn sử dụng", "promo_col_usage_count": "Lượt sử dụng",
      "promo_msg_import_start": "Đang import file...", "promo_modal_create_batch": "Tạo Mã Giảm Giá Hàng Loạt",
      "promo_label_batch_count": "Số lượng mã muốn tạo", "promo_placeholder_value_coupon": "Ví dụ: 20% hoặc 50000",
      "promo_label_expiry": "Hạn sử dụng", "promo_btn_create_coupon": "Tạo Mã",
      "promo_msg_coupon_batch_success": "Đã tạo thành công {{count}} mã!", "promo_col_total_spent": "Tổng Chi tiêu",
      "promo_col_level": "Cấp độ", "promo_col_current_points": "Điểm Hiện có", "promo_btn_manage_points": "Quản lý Điểm",
      "promo_card_loyalty_config": "Cấu hình Cấp độ Khách hàng Thân thiết", "promo_loyalty_tier_silver": "Bạc",
      "promo_loyalty_tier_gold": "Vàng", "promo_loyalty_tier_diamond": "Kim Cương", "promo_label_spending_threshold": "Ngưỡng chi tiêu",
      "promo_loyalty_unlimited": "Trở lên", "promo_label_benefits": "Quyền lợi", "promo_card_member_list": "Danh sách Hội viên",
      "promo_loyalty_silver_benefit": "1x điểm tích lũy, 1 voucher giảm giá 5 %",
      "promo_loyalty_gold_benefit": "1.5x điểm tích lũy, 1 voucher sinh nhật",
      "promo_loyalty_diamond_benefit": "2x điểm tích lũy, Miễn phí vận chuyển,voucher giảm giá 25% ",


      // HELP PAGE
      "help_title": "Trung tâm Hỗ trợ & Chẩn đoán", "help_subtitle": "Kiểm tra tình trạng hệ thống, tìm kiếm tài liệu và gửi yêu cầu hỗ trợ nhanh.",
      "help_card_diagnosis": "Công cụ Chẩn đoán nhanh", "help_text_enter_id": "Nhập ID để kiểm tra trạng thái Order hoặc User:",
      "help_input_placeholder": "Nhập Order ID hoặc User ID", "help_btn_run": "Chạy", "help_msg_enter_id": "Vui lòng nhập ID Đơn hàng hoặc ID Người dùng!",
      "help_msg_diag_running": "Đang chạy chẩn đoán cho ID: {{id}}...", "help_msg_diag_complete": "✅ Chẩn đoán hoàn tất. Trạng thái ID {{id}}: OK.",
      "help_status_title": "Trạng thái dịch vụ", "help_service_api": "API Chính", "help_service_db": "Cơ sở dữ liệu",
      "help_service_server": "Máy chủ lưu trữ", "help_status_active": "Hoạt động", "help_status_maintenance": "Bảo trì",
      "help_log_title": "Nhật ký Cập nhật", "help_update_changes_1": "Thêm các tính năng nâng cao hơn và tối ưu hiệu suất.",
      "help_update_changes_2": "Cải thiện giao diện quản lý đơn hàng.", "help_update_changes_3": "Ra mắt giao diện Admin Dashboard đầu tiên.",
      "help_card_search": "Tìm kiếm Hướng dẫn", "help_search_placeholder": "Tìm kiếm FAQ, Tài liệu hỗ trợ...",
      "help_search_btn": "Tìm", "help_faq_header": "FAQ Phổ biến:", "help_faq_title_add": "Cách thêm sản phẩm mới",
      "help_faq_desc_add": "Đi tới mục 'Quản lý kho' → 'Thêm sản phẩm'.", "help_faq_title_order": "Xử lý đơn hàng bị lỗi",
      "help_faq_desc_order": "Trong 'Đơn hàng', kiểm tra trạng thái thanh toán và liên hệ đối tác vận chuyển.",
      "help_faq_title_report": "Xem báo cáo doanh thu", "help_faq_desc_report": "Chọn 'Báo cáo' để xem biểu đồ chi tiết theo tháng.",
      "help_card_feedback": "Gửi Phản hồi (Ticket)", "help_label_category": "Phân loại",
      "help_msg_select_category": "Chọn loại yêu cầu!", "help_placeholder_select_category": "Chọn loại yêu cầu",
      "help_select_bug": "Báo lỗi", "help_select_feature": "Đề xuất tính năng", "help_select_question": "Câu hỏi",
      "help_label_name": "Tên", "help_msg_enter_name": "Nhập tên!", "help_placeholder_your_name": "Tên của bạn",
      "help_label_content": "Nội dung", "help_msg_enter_feedback": "Nhập phản hồi!", 
      "help_feedback_placeholder": "Mô tả chi tiết vấn đề hoặc đề xuất...", "help_btn_submit": "Gửi Phản hồi",
      "help_msg_feedback_success": "🎉 Gửi phản hồi thành công! Cảm ơn bạn đã đóng góp.",
      "help_card_contact": "Liên hệ Kỹ thuật", "help_contact_email": "Email Hỗ trợ",
      "help_contact_hotline": "Hotline Khẩn cấp", "help_contact_time": "Thời gian hỗ trợ: Thứ 2 - Thứ 6 (8h - 17h)",

      // FOOTER
      "footer_brand_name": "L-M Shop",
      "footer_phone_number": "+123456789",
      "footer_address": "186 Nguyen Huu Tho",
      "footer_system_status": "Hệ thống hoạt động",


    }
  },
  en: {
    translation: {
      // GLOBAL / APP HEADER
      "system_settings": "System Settings", "notifications_mode": "Notifications Mode",
      "auto_update": "Automatic Update", "display_language": "Display Language",
      "interface": "Interface", "switch_to_dark": "Switch to Dark Mode",
      "switch_to_light": "Switch to Light Mode", "save_changes": "Save Changes",
      "cancel": "Cancel", "on": "On", "off": "Off",
      "setting_saved_success": "Settings saved successfully!", "logout_success": "Logged out successfully!",
      "searching_for": "Searching for: \"{{term}}\"", "search_placeholder": "Search products, orders, customers...",
      "personal_info": "Personal Information", "logout": "Log Out",
      "admin_profile": "Admin Profile", "system_admin": "System Administrator",
      "update_info": "Update Information", "back": "Back",
      "username": "Username", "phone_number": "Phone Number",
      "role": "Role", "new_comment": "📩 New Comments",
      "order_notification": "🔔 Order Notifications", "order_placed": "has been ordered!",
      "vietnamese_language": "Tiếng Việt", "english_language": "English",
      "search_results": "results", // 👈 THÊM KEY MỚI
      "dark_mode_status": "Dark mode {{status}} activated!", // 👈 THÊM KEY MỚI
      
      // SIDE MENU
      "overview": "Overview", "inventory": "Inventory Management", "orders": "Orders",
      "staffs": "Staffs", "customers": "Customers", "marketing": "Marketing & Promotion", "help": "Support",

      // DASHBOARD
      "total_overview": "Sales Dashboard Overview", "total_revenue": "Total Revenue", "growth_rate": "Growth Rate",
      "new_customers": "New Customers", "top_product": "Top Product", "revenue_analysis": "Revenue Analysis",
      "monthly_revenue_trend": "Monthly Revenue Trend", "revenue": "Revenue",
      "product_performance": "Product Performance", "top_selling_products": "Top Selling Products",
      "top_spending_customers": "Top Spending Customers", "total_spent": "Total Spent",
      "recent_orders": "Recent Orders", "product_name": "Product Name", "quantity": "Quantity",
      "unit_price": "Unit Price", "action": "Action", "view_order_details": "View order details",
      "details": "Details", "progress_tooltip": "Represents {{percent}}% of the Top Spender's total",
      
      // INVENTORY PAGE
      "inventory_add_product": "Add Product", "inventory_update_success": "Product updated successfully!",
      "inventory_add_success": "New product added successfully!", "inventory_delete_success": "Product deleted successfully!",
      "inventory_confirm_delete": "Are you sure you want to delete this product?", "inventory_modal_update": "Update Product",
      "inventory_modal_add": "Add New Product", "inventory_col_image": "Image",
      "inventory_col_name": "Product Name", "inventory_col_price": "Price", "inventory_col_rating": "Rating",
      "inventory_col_stock": "Stock", "inventory_col_brand": "Brand", "inventory_col_category": "Category",
      "inventory_col_actions": "Actions", "inventory_label_name": "Product Name",
      "inventory_msg_name_required": "Please enter the product name!", "inventory_placeholder_name": "Enter product name",
      "inventory_label_price": "Price", "inventory_msg_price_required": "Please enter the product price!",
      "inventory_placeholder_price": "E.g.: 299", "inventory_label_rating": "Rating",
      "inventory_label_stock": "Stock", "inventory_label_brand": "Brand",
      "inventory_placeholder_brand": "E.g.: Nike, Samsung...", "inventory_label_category": "Category",
      "inventory_placeholder_category": "Select category", "inventory_label_image_link": "Product Image Link",
      "inventory_placeholder_image_link": "Enter image URL",
      "add": "Add", "update": "Update", "delete": "Delete",

      // CATEGORY MOCK DATA
      "clothing": "Clothing", "footwear": "Footwear", "electronics": "Electronics",
      "furniture": "Furniture", "accessories": "Accessories",
      
      // ORDERS PAGE
      "orders_title": "Order Management", "orders_search_placeholder": "Search by product name...",
      "orders_filter_all": "All", "orders_filter_delivered": "Delivered",
      "orders_filter_processing": "Processing", "orders_filter_cancelled": "Cancelled",
      "orders_btn_create": "Create Order", "orders_col_product": "Product (Order #)",
      "orders_col_customer": "Customer", "orders_col_date": "Date Placed", "orders_col_qty": "Qty",
      "orders_col_total": "Total", "orders_col_status": "Status", "orders_col_actions": "Actions",
      "orders_tag_delivered": "Delivered", "orders_tag_processing": "Processing", "orders_tag_cancelled": "Cancelled",
      "orders_tip_view_detail": "Quick View", "orders_tip_edit_status": "Edit Status",
      "orders_tip_save_changes": "Save Changes", "orders_msg_edit_warning": "Only orders in 'Processing' status can be edited.",
      "orders_msg_update_success": "Order status for #{{key}} updated successfully!", "orders_modal_title": "Create New Order (Manual)",
      "orders_modal_btn_confirm": "Confirm Add", "orders_placeholder_product_name": "Enter product name",
      "orders_placeholder_customer_name": "Enter customer name", "orders_placeholder_qty": "Enter quantity",
      "orders_placeholder_select_status": "Select status", "orders_label_price": "Product Price (USD)",
      "orders_product_info": "Product Information", "orders_payment_total": "Total Payment", "orders_msg_status_required": "Select status!",

      // STAFFS PAGE 
      "staffs_title": "Staff Management", "staffs_search_placeholder": "Search by name, email or phone...",
      "staffs_filter_all": "All Roles", "staffs_filter_admin": "Admin", "staffs_filter_staff": "Staff",
      "staffs_btn_add": "Add New Staff", "staffs_col_staff": "Staff Member", "staffs_col_phone": "Phone Number",
      "staffs_col_role": "Role", "staffs_col_status": "Status", "staffs_col_actions": "Actions",
      "staffs_status_active": "Active", "staffs_status_inactive": "Inactive", "staffs_tip_edit": "Edit",
      "staffs_tip_reset_pwd": "Reset Password", "staffs_tip_delete": "Delete", "staffs_confirm_delete": "Are you sure you want to delete this account?",
      "staffs_msg_delete_title": "Delete Account", "staffs_msg_delete_success": "Account deleted successfully.",
      "staffs_msg_status_update": "Status Update", "staffs_msg_status_success": "Account {{name}} has been {{status}}.",
      "staffs_msg_account_not_found": "Account not found", "staffs_msg_reset_pwd": "Reset Password",
      "staffs_msg_reset_pwd_detail": "New password for user (fake): {{password}} — remind them to change it after login.",
      "staffs_msg_update": "Update", "staffs_msg_update_success": "Staff information updated successfully.",
      "staffs_msg_add": "New Staff", "staffs_msg_add_success": "New staff account created successfully.",
      "staffs_modal_edit": "Edit Staff Member", "staffs_modal_add": "Add New Staff",
      "staffs_label_name": "Full Name", "staffs_msg_name_required": "Please enter full name",
      "staffs_msg_email_invalid": "Invalid email address", "staffs_placeholder_phone": "E.g.: 555-123-4567",
      "staffs_msg_role_required": "Select role",

      // CUSTOMERS PAGE
      "cus_title_customer_management": "Customer Management", "cus_placeholder_search": "Search name, phone, email...",
      "cus_placeholder_filter_city": "Filter City", "cus_filter_all": "All", "cus_button_activity": "Activity",
      "cus_button_export_report": "Export Report", "cus_col_customer": "Customer",
      "cus_status_online": "Active", "cus_status_offline": "Offline", "cus_col_contact_info": "Contact Info",
      "cus_col_avg_order_value": "Avg Order Value", "cus_text_avg_value": "Average Value", "cus_col_total_orders": "Total Orders",
      "cus_col_join_date": "Join Date", "cus_col_actions": "Actions", "cus_tip_edit_profile": "Edit Profile",
      "cus_tip_view_activity": "View Activity (Timeline)", "cus_tip_log_interaction": "Log Interaction / Quick Email",
      "cus_modal_edit_profile_title": "Edit Customer Profile", "cus_label_last_name": "Last Name",
      "cus_msg_last_name_required": "Please enter last name!", "cus_label_first_name": "First Name",
      "cus_msg_first_name_required": "Please enter first name!", "cus_label_phone": "Phone Number",
      "cus_label_city": "City", "cus_button_save_changes": "Save Changes",
      "cus_modal_log_interaction_title": "Log Interaction with {{name}}", "cus_label_contact_method": "Contact Method",
      "cus_msg_contact_method_required": "Please select a method!", "cus_placeholder_select_action": "Select action",
      "cus_method_phone": "Phone Call", "cus_method_email": "Send Marketing Email", "cus_method_chat": "Zalo/Chat Interaction",
      "cus_label_interaction_note": "Interaction Note (Optional)", "cus_placeholder_interaction_note": "E.g.: Called to confirm order, customer agreed to buy more...",
      "cus_button_log_action": "Log Action", "cus_msg_update_success": "Profile for {{name}} updated successfully!",
      "cus_msg_contact_logged": "Interaction via {{method}} with {{name}} logged!", "cus_msg_no_data_export": "No data to export!",
      "cus_msg_export_success": "Successfully exported {{count}} customers!", "cus_msg_open_activity_page": "Open General Activity Overview",
      "cus_timeline_account_registered": "Customer registered account", "cus_timeline_order_success": "Order successful",
      "cus_timeline_value": "Value", "cus_timeline_live_chat_request": "Live Chat support request (Pending)",
      "today": "Today", "cus_report_filename": "customer_report",
      
      // PROMOTION PAGE
      "promo_title": "Marketing & Promotion Management", "promo_tab_campaigns": "Promo Campaigns",
      "promo_tab_coupons": "Coupons", "promo_tab_loyalty": "Customer Loyalty",
      "promo_campaigns_title": "Campaign List", "promo_btn_create_campaign": "Create New Campaign",
      "promo_col_name": "Campaign Name", "promo_col_type": "Discount Type", "promo_col_time": "Application Time",
      "promo_col_status": "Status", "promo_col_performance": "Performance", "promo_col_actions": "Actions",
      "promo_status_running": "Running", "promo_status_paused": "Paused", "promo_modal_edit": "Edit Campaign",
      "promo_modal_create": "Create New Campaign", "promo_btn_edit": "Edit", "promo_text_to": "to",
      "promo_msg_campaign_saved": "Campaign saved successfully!", "promo_label_campaign_name": "Campaign Name",
      "promo_msg_name_required": "Please enter campaign name!", "promo_placeholder_campaign_name": "E.g.: Summer Sale 2025",
      "promo_label_time": "Application Time", "promo_msg_time_required": "Please select time!",
      "promo_label_type": "Discount Type", "promo_msg_type_required": "Please select type!",
      "promo_placeholder_type": "Select discount type", "promo_type_discount_percent": "Percentage Discount",
      "promo_type_discount_fixed": "Fixed Amount Discount", "promo_type_free_shipping": "Free Shipping",
      "promo_label_value": "Discount Value", "promo_placeholder_value": "E.g.: 15 (for 15%) or 100000 (for fixed)",
      "promo_btn_save_changes": "Save Changes", "promo_btn_create_campaign_short": "Create Campaign",
      "promo_coupons_title": "Coupon List", "promo_btn_create_batch": "Create Batch",
      "promo_col_coupon_code": "Coupon Code", "promo_col_coupon_value": "Discount Value",
      "promo_col_expiry_date": "Expiry Date", "promo_col_usage_count": "Usage Count",
      "promo_msg_import_start": "Importing file...", "promo_modal_create_batch": "Create Batch Coupons",
      "promo_label_batch_count": "Number of coupons to create", "promo_placeholder_value_coupon": "E.g.: 20% or 50000",
      "promo_label_expiry": "Expiry Date", "promo_btn_create_coupon": "Create Coupons",
      "promo_msg_coupon_batch_success": "Successfully created {{count}} coupons!", "promo_col_total_spent": "Total Spent",
      "promo_col_level": "Level", "promo_col_current_points": "Current Points", "promo_btn_manage_points": "Manage Points",
      "promo_card_loyalty_config": "Loyalty Tier Configuration", "promo_loyalty_tier_silver": "Silver",
      "promo_loyalty_tier_gold": "Gold", "promo_loyalty_tier_diamond": "Diamond", "promo_label_spending_threshold": "Spending Threshold",
      "promo_loyalty_unlimited": "and above", "promo_label_benefits": "Benefits", "promo_card_member_list": "Member List",
      "promo_loyalty_silver_benefit": "1x points, 5% off voucher for all products",
      "promo_loyalty_gold_benefit": "1.5x points, 1 birthday voucher",
      "promo_loyalty_diamond_benefit": "2x points, Free Shipping, 25% discount voucher product",

      // HELP PAGE
      "help_title": "Support & Diagnostic Center", "help_subtitle": "Check system status, search documentation, and submit support requests quickly.",
      "help_card_diagnosis": "Quick Diagnosis Tool", "help_text_enter_id": "Enter ID to check Order or User status:",
      "help_input_placeholder": "Enter Order ID or User ID", "help_btn_run": "Run", "help_msg_enter_id": "Please enter Order ID or User ID!",
      "help_msg_diag_running": "Running diagnosis for ID: {{id}}...", "help_msg_diag_complete": "✅ Diagnosis complete. ID {{id}} status: OK.",
      "help_status_title": "Service Status", "help_service_api": "Main API", "help_service_db": "Database",
      "help_service_server": "Hosting Server", "help_status_active": "Active", "help_status_maintenance": "Maintenance",
      "help_log_title": "Update Log", "help_update_changes_1": "Added advanced features and optimized performance.",
      "help_update_changes_2": "Improved order management interface.", "help_update_changes_3": "Launched initial Admin Dashboard interface.",
      "help_card_search": "Search Documentation", "help_search_placeholder": "Search FAQs, Support Docs...",
      "help_search_btn": "Search", "help_faq_header": "Popular FAQs:", "help_faq_title_add": "How to add new products",
      "help_faq_desc_add": "Go to 'Inventory Management' → 'Add Product'.", "help_faq_title_order": "Handling failed orders",
      "help_faq_desc_order": "In 'Orders', check payment status and contact shipping partner.",
      "help_faq_title_report": "View revenue reports", "help_faq_desc_report": "Select 'Reports' to view detailed monthly charts.",
      "help_card_feedback": "Submit Feedback (Ticket)", "help_label_category": "Category",
      "help_msg_select_category": "Select request category!", "help_placeholder_select_category": "Select request category",
      "help_select_bug": "Bug Report", "help_select_feature": "Feature Request", "help_select_question": "Question",
      "help_label_name": "Name", "help_msg_enter_name": "Enter name!", "help_placeholder_your_name": "Your name",
      "help_label_content": "Content", "help_msg_enter_feedback": "Enter feedback!", 
      "help_feedback_placeholder": "Describe the issue or suggestion in detail...", "help_btn_submit": "Submit Feedback",
      "help_msg_feedback_success": "🎉 Feedback sent successfully! Thank you for your contribution.",
      "help_card_contact": "Technical Contact", "help_contact_email": "Support Email",
      "help_contact_hotline": "Emergency Hotline", "help_contact_time": "Support hours: Mon - Fri (8am - 5pm)",

      // FOOTER
      "footer_brand_name": "L-M Shop",
      "footer_phone_number": "+123456789",
      "footer_address": "186 Nguyen Huu Tho",
      "footer_system_status": "System Operational",


    }
  },
  jp: { 
    translation: {
        "display_language": "表示言語",
        "system_settings": "システム設定",
        "cancel": "キャンセル",
        "save_changes": "変更を保存",
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: initialLang, 
    fallbackLng: "vi",  
    debug: false, 
    interpolation: {
      escapeValue: false 
    },
    detection: {
        order: ['localStorage', 'navigator'],
        caches: ['localStorage'],
        lookupLocalStorage: 'appLanguage', 
    }
  });

export default i18n;