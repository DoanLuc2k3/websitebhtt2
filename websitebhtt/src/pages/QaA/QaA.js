// src/pages/QaA/QaA.js
import React from 'react';
import { Collapse, Typography } from 'antd';
import { qnaData } from '../../data/qaaService.js';
import './QaA.css'; // Import file CSS

// Lấy component Panel từ Collapse
const { Panel } = Collapse;
const { Title } = Typography;

const QaA = () => {
  return (
    <div className="qna-page-container">
      <Title level={2} className="qna-page-title">
        Câu Hỏi Thường Gặp (FAQ)
      </Title>

      <Collapse 
        defaultActiveKey={['1']} 
        accordion={false} 
        className="qna-collapse"
      >
        {qnaData.map((item) => (
          <Panel header={item.question} key={item.id} className="qna-panel">
            {/* Chúng ta dùng thẻ <p> để giữ nguyên định dạng 
              và xuống dòng nếu câu trả lời quá dài.
            */}
            <p className="qna-answer">{item.answer}</p>
          </Panel>
        ))}
      </Collapse>
    </div>
  );
};

export default QaA;