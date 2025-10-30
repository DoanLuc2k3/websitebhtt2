import React, { useState } from "react";
import { FloatButton, Card, Divider } from "antd";
import messengerImg from "../assets/images/messenger.png";
import { FacebookFilled } from "@ant-design/icons";
import { SiZalo, SiTelegram } from "react-icons/si";

const ChatBubble = () => {
  const [open, setOpen] = useState(false);

  return (
    <div>
      {open && (
        <Card className="chat-popup">
          <div className="chat-item">
            <FacebookFilled className="chat-icon fb" />
            <div>
              <div className="chat-title">Facebook Fanpage</div>
              <div className="chat-desc">Contact for support</div>
            </div>
          </div>
          <Divider />
          <div className="chat-item">
            <SiZalo className="chat-icon zalo" />
            <div>
              <div className="chat-title">Zalo Support</div>
              <div className="chat-desc">24/7 live chat assistance</div>
            </div>
          </div>
          <Divider />
          <div className="chat-item">
            <SiZalo className="chat-icon zalo" />
            <div>
              <div className="chat-title">Zalo Group</div>
              <div className="chat-desc">Get the latest updates</div>
            </div>
          </div>
          <Divider />
          <div className="chat-item">
            <SiTelegram className="chat-icon telegram" />
            <div>
              <div className="chat-title">Telegram Support</div>
              <div className="chat-desc">Support via Telegram channel</div>
            </div>
          </div>
        </Card>
      )}

      <FloatButton
        icon={<img src={messengerImg} alt="chat" className="chat-icon" />}
        description="Contact us"
        shape="circle"
        type="primary"
        className="chat-float-btn"
        onClick={() => setOpen(!open)}
      />
    </div>
  );
};

export default ChatBubble;
