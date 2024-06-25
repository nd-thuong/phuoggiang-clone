import { SEO } from '@/configs/seo.config';
import { Col, Row, Tabs } from 'antd';
import { DefaultSeo } from 'next-seo';
import React, { useState } from 'react';
import type { TabsProps } from 'antd';
import FormLogin from './components/FormLogin';
import FormRegister from './components/FormRegister';
import FormForgotPassword from './components/FormForgotPassword';

const Index = () => {
  const items: TabsProps['items'] = [
    {
      key: 'login',
      label: 'Đăng nhập',
      children: <FormLogin />,
    },
    {
      key: 'register',
      label: 'Đăng ký',
      children: <FormRegister />,
    },
    {
      key: 'forgot',
      label: 'Quên mật khẩu',
      children: <FormForgotPassword />,
    },
  ];
  const [titleTab, setTitleTab] = useState<string>('Đăng nhập');

  const onChange = (key: string) => {
    switch (key) {
      case 'login':
        setTitleTab('Đăng nhập');
        break;
      case 'register':
        setTitleTab('Đăng ký');
        break;
      case 'forgot':
        setTitleTab('Quên mật khẩu');
        break;

      default:
        setTitleTab('Đăng nhập');
        break;
    }
  };

  return (
    <>
      <DefaultSeo {...SEO} title={titleTab} />
      <Row className="items-start justify-center min-h-[70vh] mt-[30px]">
        <Col span={12}>
          <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
        </Col>
      </Row>
    </>
  );
};

export default Index;
