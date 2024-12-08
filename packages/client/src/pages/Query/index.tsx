import { PageContainer } from '@ant-design/pro-components';
import { Checkbox, Radio, Select, Space } from 'antd';

import ChatInput from '@/components/Chat/ChatInput/ChatInput';
import MessageBox from '@/components/Chat/MessageBox/MessageBox';
import useChat from '@/models/chat';
import useChatDbStore from '@/store/chat';

const DatabasePage: React.FC = () => {
  const { sendChat, loading } = useChat();
  const chatStore = useChatDbStore();
  const messages = useChatDbStore((state) => state.messages);
  const prompt = useChatDbStore((state) => state.prompt);
  const viewOptions = [
    { label: 'AVA', value: 'ava' },
    // { label: 'VEGA', value: 'vega' },
    { label: 'Neo4j', value: 'neo4j' },
  ];

  return (
    <PageContainer
      header={{
        title: '多方言查询生成',
      }}
      className="py-10"
    >
      <Space direction={'horizontal'} className="mb-2">
        {/* chat type select */}
        <Space className="mr-10">
          <span>数据库方言 </span>
          <Select
            className="min-w-30"
            value={chatStore.chatType}
            onChange={(value) => {
              chatStore.setChatType(value);
            }}
          >
            <Select.Option value="MySQL">MySQL</Select.Option>
            <Select.Option value="PostgreSQL">PostgreSQL</Select.Option>
            <Select.Option value="Cypher">Cypher</Select.Option>
            <Select.Option value="nGQL">nGQL</Select.Option>
            {/* <Select.Option value="command">Command</Select.Option> */}
          </Select>
        </Space>

        {/* enable auto visualization */}
        {/* <Checkbox
          checked={chatStore.autoVisualize}
          onChange={(e) => {
            chatStore.setAutoVisualize(e.target.checked);
          }}
        >
          自动可视化
        </Checkbox>

        <Radio.Group
          optionType="button"
          options={viewOptions}
          onChange={(e) => {
            chatStore.setAutoVizType(e.target.value);
          }}
          value={chatStore.autoVizType}
        /> */}

      </Space>

      {/* <PresetPrompt
        prompts={prompts}
        onChange={(prompt) => {
          if (prompt) {
            chatStore.setPrompt(prompt);
          }
        }}
      /> */}

      <MessageBox messages={messages} className="m-2" />
      <ChatInput
        onClear={() => {
          chatStore.clearMessages();
        }}
        onSend={(msg) => {
          chatStore.setPrompt(msg);
          sendChat({
            message: msg,
            chatType: chatStore.chatType,
          });
        }}
        loading={loading || chatStore.visualizing}
        hasMessages={messages.length > 0}
        defaultMessage={prompt}
      />
    </PageContainer>
  );
};

export default DatabasePage;
