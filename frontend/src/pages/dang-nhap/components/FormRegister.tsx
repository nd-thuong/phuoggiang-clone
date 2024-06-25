import { ButtonCustom } from '@/components/CommonComponent/Button/ButtonCustom';
import FormItem from '@/components/CommonComponent/FormItem';
import { useUserStore } from '@/stores/user.store';
import { TypeRegister } from '@/types/user';
import { variables } from '@/utils/variables';
import { Col, Flex, Form, Row } from 'antd';
import { omit } from 'lodash';
import { useRouter } from 'next/navigation';
import React from 'react';

const FormRegister = () => {
  const router = useRouter();
  const { register, loading } = useUserStore();

  const onFinish = (values: TypeRegister) => {
    register(omit(values, 'passwordConfirm'), () => {
      router.push('/');
    });
  };

  return (
    <Form layout="vertical" className="w-full" onFinish={onFinish}>
      <Row className="justify-center">
        <Col span={24} className="form-login p-[20px] shadow-md rounded-[10px] bg-white">
          <div>
            <h1 className="text-[#000] text-[30px] font-bold text-center mb-[20px]">Đăng ký</h1>
          </div>
          <FormItem
            name="username"
            type={variables.INPUT}
            placeholder="Nhập tên tài khoản"
            rules={[variables.RULES.EMPTY]}
            label="Tài khoản"
          />
          <FormItem
            name="email"
            type={variables.INPUT}
            placeholder="Nhập email"
            rules={[variables.RULES.EMPTY, variables.RULES.EMAIL_SPECIAL_CHARACTER]}
            label="Email"
          />
          <FormItem
            name="password"
            type={variables.INPUT_PASSWORD}
            placeholder="Nhập mật khẩu"
            rules={[variables.RULES.EMPTY, variables.RULES.PASSOWRD_FORMAT]}
            label="Mật khẩu"
          />
          <FormItem
            name="passwordConfirm"
            type={variables.INPUT_PASSWORD}
            placeholder="Nhập mật khẩu"
            rules={[
              variables.RULES.EMPTY,
              variables.RULES.PASSOWRD_FORMAT,
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Mật khẩu không trùng'));
                },
              }),
            ]}
            label="Nhập lại mật khẩu"
          />
          <Flex justify="space-between" align="flex-end">
            <ButtonCustom type="primary" htmlType="submit" loading={loading}>
              Đăng ký
            </ButtonCustom>
          </Flex>
        </Col>
      </Row>
    </Form>
  );
};

export default FormRegister;
