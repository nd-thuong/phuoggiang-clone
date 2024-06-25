import { ButtonCustom } from '@/components/CommonComponent/Button/ButtonCustom';
import FormItem from '@/components/CommonComponent/FormItem';
import { useUserStore } from '@/stores/user.store';
import { TypeLogin } from '@/types/user';
import { variables } from '@/utils/variables';
import { Col, Flex, Form, Row } from 'antd';
import { useRouter } from 'next/navigation';
import React from 'react';

const FormLogin = () => {
  const router = useRouter();
  const { login, loading } = useUserStore();

  const onFinish = (values: TypeLogin) => {
    login(values, () => {
      router.push('/');
    });
  };

  return (
    <Form layout="vertical" className="w-full" onFinish={onFinish}>
      <Row className="justify-center">
        <Col span={24} className="form-login p-[20px] shadow-md rounded-[10px] bg-white">
          <div>
            <h1 className="text-[#000] text-[30px] font-bold text-center mb-[20px]">Đăng nhập</h1>
          </div>
          <FormItem
            name="username"
            type={variables.INPUT}
            placeholder="Nhập username/email"
            rules={[variables.RULES.EMPTY]}
            label="Tài khoản"
          />
          <FormItem
            name="password"
            type={variables.INPUT_PASSWORD}
            placeholder="Nhập mật khẩu"
            rules={[variables.RULES.EMPTY]}
            label="Mật khẩu"
          />
          <ButtonCustom type="primary" htmlType="submit" loading={loading}>
            Đăng nhập
          </ButtonCustom>
        </Col>
      </Row>
    </Form>
  );
};

export default FormLogin;
