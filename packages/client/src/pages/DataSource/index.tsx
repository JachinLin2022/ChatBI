import { PageContainer, ProSkeleton, ProForm, ProFormText, ProFormSelect, ProFormRadio, ProTable } from '@ant-design/pro-components';
import { Button, Form, Tag } from 'antd';
import { useEffect, useState } from 'react';
import axios from 'axios';

// 定义数据库配置对象的接口
interface DatabaseConfig {
  key: string;
  databaseType: string;
  databaseUri: string;
  username: string;
  password: string;
  databaseName: string;
}

const DataSourcePage: React.FC = () => {

  const [configs, setConfigs] = useState<DatabaseConfig[]>([]);
  
  useEffect(() => {
    // 从后端获取配置数据
    const fetchConfigs = async () => {
      try {
        const response = await axios.get('http://localhost:3000/database-config');
        setConfigs(response.data);
      } catch (error) {
        console.error('Failed to fetch database configs:', error);
      }
    };

    fetchConfigs();
  }, []);
  
  const onFinish = async (values: any) => {
    console.log('Received values of form: ', values);
    // 在这里处理表单提交逻辑
    try {
      // 更新本地状态
      const newConfig: DatabaseConfig = { ...values, key: Date.now().toString() };
      
      setConfigs(prevConfigs => {
        const updatedConfigs = [...prevConfigs, newConfig];
        const response = axios.post('http://localhost:3000/database-config', updatedConfigs);
        return updatedConfigs;
      });
    } catch (error) {
      console.error('Failed to save database config:', error);
    }
  };

  // 删除配置的函数
  const handleDelete = async (key: string) => {

    try {
      await axios.delete(`http://localhost:3000/database-config/${key}`);

      // 更新状态
      const updatedConfigs = configs.filter(config => config.key !== key);
      setConfigs(updatedConfigs);
    } catch (error) {
      console.error('Error deleting configuration:', error);
    }
  };

  return (
    <PageContainer
      header={{
        title: '数据库配置',
      }}
      className="py-10"
    >
      <ProForm
        onFinish={onFinish}
        initialValues={{
          databaseType: 'mysql',
        }}
        // style={{ backgroundColor: 'gray' }}
      >
        <ProForm.Group>
          <ProFormRadio.Group
            name="databaseType"
            label="数据库类型"
            options={[
              {
                label: (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <img src="https://www.svgrepo.com/show/354099/mysql.svg" alt="MySQL" style={{ width: '100px', height: '100px' }} />
                    MySQL
                  </div>
                ),
                value: 'mysql',
                style: {height: '100%' },
              },
              {
                label: (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZSOIj7rDvRcVKV8OcU_CAlJesGK_cxk9FSw&s" alt="PostgreSQL" style={{ width: '100px', height: '100px' }} />
                    PostgreSQL
                  </div>
                ),
                value: 'postgresql',
                style: {height: '100%' },
              },
              {
                label: (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmOZuTqPb6LhxyTyEUio8xxNxspa0gm-NncQ&s" alt="Neo4j" style={{ width: '100px', height: '100px' }} />
                    Neo4j
                  </div>
                ),
                value: 'neo4j',
                style: { height: '100%' },
              },
              {
                label: (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <img src="https://desktop.docker.com/extensions/weygu_nebulagraph-dd-ext/user-images_githubusercontent_com/1651790/213339618-107d0e59-1b8b-4c89-bbae-5529aa4e2666.svg" alt="Nebula Graph" style={{ width: '100px', height: '100px' }} />
                    NebulaGraph
                  </div>
                ),
                value: 'nebulaGraph',
                style: { height: '100%' },
              },
            ]}
            fieldProps={{
              // optionType: 'card',
              buttonStyle: 'solid',
            }}
            rules={[{ required: true}]}
          />
        </ProForm.Group>
        <ProForm.Group>
          <ProFormText
            name="databaseUri"
            label="数据库 URI"
            rules={[{ required: true, message: '请输入数据库URI' }]}
          />
          <ProFormText
            name="username"
            label="用户名"
            rules={[{ required: true, message: '请输入用户名' }]}
          />
          <ProFormText.Password
            name="password"
            label="密码"
            rules={[{ required: true, message: '请输入密码' }]}
          />
          <ProFormText
            name="databaseName"
            label="数据库名称"
            rules={[{ required: true, message: '请输入数据库名称' }]}
          />
        </ProForm.Group>
      </ProForm>

      {/* 新增的表格部分 */}
      
      <ProTable
        headerTitle="已连接的数据库配置"
        columns={[
          // { title: 'ID', dataIndex: 'key', key: 'key' },
          { title: '数据库类型', dataIndex: 'databaseType', key: 'databaseType' },
          { title: '数据库 URI', dataIndex: 'databaseUri', key: 'databaseUri' },
          { title: '用户名', dataIndex: 'username', key: 'username' },
          { title: '数据库名称', dataIndex: 'databaseName', key: 'databaseName' },
          {
            title: '连接状态',
            key: 'isConnected',
            render: (_, record) => (
              <Tag color={1 ? 'green' : 'red'}>
                {1 ? '已连接' : '未连接'}
              </Tag>
            ),
          },
          {
            title: '操作',
            key: 'action',
            render: (_, record) => (
              <Button type="link" onClick={() => handleDelete(record.key)}>删除</Button>
            ),
          },
        ]}
        dataSource={configs}
        rowKey="key"
        search={false}
        pagination={false}
        style={{ marginTop: 24 }}
      />
    </PageContainer>
  );
};

export default DataSourcePage;
