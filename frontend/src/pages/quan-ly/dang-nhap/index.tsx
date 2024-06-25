import FormItem from '@/components/CommonComponent/FormItem';
import { variables } from '@/utils/variables';
import { Col, Flex, Form, Row } from 'antd';
import React from 'react';
import './style.scss';
import { useRouter } from 'next/router';
import { ButtonCustom } from '@/components/CommonComponent/Button/ButtonCustom';
import { DefaultSeo } from 'next-seo';
import { SEO } from '@/configs/seo.config';
import { useUserStore } from '@/stores/user.store';

const Index = () => {
  const router = useRouter();
  const { login, loading } = useUserStore();
  const onFinish = (values: { username: string; password: string }) => {
    login(values, () => {
      router.replace('/quan-ly/don-vi');
    });
  };

  return (
    <>
      <DefaultSeo {...SEO} title="Quản lý- đăng nhập" />
      <Flex className="h-[100vh]" justify="center" align="center">
        <Form layout="vertical" className="w-full" onFinish={onFinish}>
          <Row className="justify-center">
            <Col span={8} className="form-login p-[20px] shadow-md rounded-[10px] bg-white">
              <div>
                <h1 className="text-[#000] text-[30px] font-bold text-center mb-[20px]">
                  Đăng nhập
                </h1>
              </div>
              <FormItem
                name="username"
                type={variables.INPUT}
                placeholder="Nhập username/ email"
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
              <Flex justify="space-between" align="flex-end">
                <ButtonCustom type="primary" htmlType="submit" loading={loading}>
                  Đăng nhập
                </ButtonCustom>
                <ButtonCustom type="link">Quên mật khẩu</ButtonCustom>
              </Flex>
            </Col>
          </Row>
        </Form>
      </Flex>
    </>
  );
};

export default Index;
// export default withAuth(Index);
