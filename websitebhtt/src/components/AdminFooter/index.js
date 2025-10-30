import React from "react";
import { Button } from "antd";
import "./AdminFooter.css";

function AdminFooter() {
  return (
    <div className="admin-footer">
      <div className="admin-left">
        <span>© {new Date().getFullYear()} L-M Shop</span>
        <span className="muted"> — Internal Admin Panel</span>
      </div>
      <div className="admin-right">
        <Button type="link" size="small" href="#/support">Support</Button>
        <Button type="link" size="small" href="#/profile">Profile</Button>
      </div>
    </div>
  );
}

export default AdminFooter;
