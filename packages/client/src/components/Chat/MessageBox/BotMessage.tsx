import AvaAdvisor from '@/components/AvaAdvisor/AvaAdvisor';
import MarkdownView from '@/components/MarkdownView/MarkdownView';
import ReactVega from '@/components/Vega';
import { RobotOutlined } from '@ant-design/icons';
import { Avatar, Col, Row } from 'antd';
import React, { useEffect, useRef } from 'react';
import vis from 'vis-network/standalone/umd/vis-network.min';
import 'vis-network/styles/vis-network.min.css';

interface BotMessageProps {
  message: Chat.IMessage;
}

const BotMessage: React.FC<BotMessageProps> = ({ message }) => {
  const containerRef = useRef(null);

  function renderMessage() {
    console.log(message);
    if (message.autoVizType === 'ava') {
      return <AvaAdvisor data={message.data ?? []} />;
    } else if (message.autoVizType === 'vega') {
      const spec = JSON.parse(message.content ?? '');
      if (spec) {
        return (
          <div className="px-2 py-4 mx-2 overflow-hidden overflow-x-scroll b-rounded">
            <ReactVega spec={spec} data={message.data} />
          </div>
        );
      } else {
        return (
          <div className="px-2 py-4 mx-2">
            <MarkdownView content={message.content} />
          </div>
        );
      }
    } else if (message.autoVizType === 'neo4j') {
      useEffect(() => {
        if (containerRef.current) {
          // 更加复杂的Mock 数据
          const mockData = {
            nodes: [
              { id: 1, labels: ['Person'], properties: { name: '张三', age: 30, gender: '男', city: '北京' } },
              { id: 2, labels: ['Person'], properties: { name: '李四', age: 25, gender: '男', city: '上海' } },
              { id: 3, labels: ['Person'], properties: { name: '王五', age: 35, gender: '男', city: '广州' } },
              { id: 4, labels: ['Person'], properties: { name: '赵六', age: 28, gender: '女', city: '深圳' } },
              { id: 5, labels: ['Company'], properties: { name: '科技公司', industry: '技术', location: '北京' } },
              { id: 6, labels: ['Project'], properties: { name: '人工智能项目', status: '进行中', budget: '100万' } },
              { id: 7, labels: ['Department'], properties: { name: '研发部', leader: '张三', employeeCount: 50 } },
              { id: 8, labels: ['Department'], properties: { name: '市场部', leader: '李四', employeeCount: 30 } },
            ],
            relationships: [
              { startNode: 1, endNode: 5, type: '工作于', properties: { startDate: '2018-01-01', position: '项目经理' } },
              { startNode: 2, endNode: 5, type: '工作于', properties: { startDate: '2019-06-01', position: '开发工程师' } },
              { startNode: 3, endNode: 5, type: '工作于', properties: { startDate: '2020-03-15', position: '分析师' } },
              { startNode: 4, endNode: 5, type: '工作于', properties: { startDate: '2021-08-01', position: '市场专员' } },
              { startNode: 1, endNode: 6, type: '领导', properties: { role: '项目负责人' } },
              { startNode: 2, endNode: 6, type: '参与', properties: { role: '主要开发者' } },
              { startNode: 3, endNode: 6, type: '参与', properties: { role: '数据分析师' } },
              { startNode: 5, endNode: 7, type: '包含', properties: { departmentName: '研发部' } },
              { startNode: 5, endNode: 8, type: '包含', properties: { departmentName: '市场部' } },
              { startNode: 1, endNode: 7, type: '担任', properties: { position: '部门经理' } },
              { startNode: 2, endNode: 8, type: '担任', properties: { position: '部门经理' } },
            ],
          };

          const data = {
            nodes: mockData.nodes.map(node => ({
              id: node.id,
              label: node.properties.name || node.labels.join(', ') || String(node.id),
              title: node.properties ? JSON.stringify(node.properties, null, 2) : '',
            })),
            edges: mockData.relationships.map(edge => ({
              from: edge.startNode,
              to: edge.endNode,
              label: edge.type,
              title: edge.properties ? JSON.stringify(edge.properties, null, 2) : '',
            })),
          };
          const options = {};
          new vis.Network(containerRef.current, data, options);
        }
      }, []);

      return (
        <div className="px-2 py-4 mx-2" ref={containerRef} style={{ height: '500px' }}></div>
      );
    } else {
      return (
        <div className="px-2 py-4 mx-2">
          <MarkdownView content={message.content} />
        </div>
      );
    }
  }

  return (
    <Row className="h-auto">
      <Col span={1}>
        {/* <Avatar size="large" icon={<RobotOutlined />} /> */}
        <Avatar size="large" src="https://img.alicdn.com/imgextra/i2/O1CN01Qta2HJ20Hu4u7BbWM_!!6000000006825-2-tps-1024-1024.png" />
      </Col>
      <Col span={20}>
        <div className="bg-gray-200 mx-2">{renderMessage()}</div>
      </Col>
      <Col span={4}>&nbsp;</Col>
    </Row>
  );
};

export default BotMessage;
