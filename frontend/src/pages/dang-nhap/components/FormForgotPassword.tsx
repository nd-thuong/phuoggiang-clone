import { ButtonCustom } from '@/components/CommonComponent/Button/ButtonCustom';
import FormItem from '@/components/CommonComponent/FormItem';
import { variables } from '@/utils/variables';
import { Col, Flex, Form, Row } from 'antd';
import React from 'react';

const FormForgotPassword = () => {
  return (
    <Form layout="vertical">
      <Row className="bg-white p-[20px] shadow-md rounded-[10px]">
        <Col span={24}>
          <h1 className="text-[#000] text-[30px] font-bold text-center mb-[20px]">Quên mật khẩu</h1>
          <FormItem
            name="email"
            label="Nhập email"
            type={variables.INPUT}
            rules={[variables.RULES.EMPTY, variables.RULES.EMAIL_SPECIAL_CHARACTER]}
            placeholder="Nhập email để lấy mật khẩu mới"
          />
        </Col>
        <Col span={24}>
          <ButtonCustom type="primary" htmlType="submit">
            Gửi email
          </ButtonCustom>
        </Col>
      </Row>
    </Form>
  );
};

export default FormForgotPassword;
