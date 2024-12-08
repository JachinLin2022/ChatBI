import { DeleteFilled, SendOutlined } from '@ant-design/icons';
import { Button, Input, message, Popconfirm } from 'antd';
import React, { useEffect } from 'react';

interface ChatInputProps {
  loading?: boolean;
  disabled?: boolean;
  hasMessages?: boolean;
  defaultMessage?: string;
  onSend: (message: string) => void;
  onClear: () => void;
}

const ChatInput: React.FC<ChatInputProps> = ({
  onSend,
  onClear,
  loading = false,
  hasMessages = false,
  defaultMessage = '',
}) => {
  const [message, setMessage] = React.useState('');

  const handleSend = () => {
    onSend(message);
    setMessage('');
  };

  useEffect(() => {
    setMessage(defaultMessage);
  }, [defaultMessage]);

  return (
    <div className="overflow-hidden w-full flex flex-row gap-2" style={{ marginLeft: '50px', marginTop: '50px'}}>
      {/* clear button */}
      <Popconfirm
        title="确认清除所有的对话消息吗？"
        onConfirm={onClear}
        okText="是"
        cancelText="否"
        disabled={!hasMessages}
      >
        <Button disabled={!hasMessages} icon={<DeleteFilled />}></Button>
      </Popconfirm>
      <Input
        // className="flex-1"
        placeholder="请输入文本......"
        value={message}
        disabled={loading}
        onChange={(e) => setMessage(e.target.value)}
        onPressEnter={handleSend}
        allowClear={true}
        style={{ width: '1295px'}} // 设置输入框宽度为200px
      />
      <Button
        type="primary"
        onClick={handleSend}
        loading={loading}
        disabled={!message}
        icon={<SendOutlined />}
      >
        Send
      </Button>
    </div>
  );
};

export default ChatInput;
