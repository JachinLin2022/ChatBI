import MarkdownView from '@/components/MarkdownView/MarkdownView';
import { UserOutlined } from '@ant-design/icons';
import { Avatar, Col, Row } from 'antd';
import React from 'react';

interface UserMessageProps {
  message: Chat.IMessage;
}

const UserMessage: React.FC<UserMessageProps> = ({ message }) => {
  return (
    <Row className="h-auto">
      <Col span={4}>&nbsp;</Col>
      <Col span={18}>
        <div className="bg-blue-100 px-2 py-4 mx-2 flex items-center justify-start b-rounded">
          {/* <MarkdownView content={message.content} /> */}
          <div className="text-black">{message.content}</div>
        </div>
      </Col>
      <Col span={2}>
        <Avatar size="large" icon={<UserOutlined />} />
        {/* <Avatar size="large" src="https://img95.699pic.com/element/40203/4444.png_300.png!/fw/431/clip/0x300a0a0" /> */}
      </Col>
    </Row>
  );
};

export default UserMessage;
