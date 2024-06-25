import { ButtonCustom } from '@/components/CommonComponent/Button/ButtonCustom';
import FormItem from '@/components/CommonComponent/FormItem';
import { SEO } from '@/configs/seo.config';
import { useUserStore } from '@/stores/user.store';
import { ValueInfoUser } from '@/types/user';
import { variables } from '@/utils/variables';
import { Col, Form, Row } from 'antd';
import { DefaultSeo } from 'next-seo';
import React, { useEffect } from 'react';

const Index = () => {
  const { user, updateInfoUser, loading, getMe } = useUserStore();
  const [formRef] = Form.useForm();
  useEffect(() => {
    formRef.setFieldsValue({
      ...user,
    });
  }, [user, formRef]);
  const onFinish = (values: ValueInfoUser) => {
    updateInfoUser(values, () => {
      getMe();
    });
  };

  return (
    <>
      <DefaultSeo {...SEO} title="Thông tin tài khoản" />
      <Form form={formRef} className="min-h-[60vh]" onFinish={onFinish}>
        <Row className="justify-center mt-[30px]">
          <Col span={8} className="border p-[20px] rounded-[10px] bg-white shadow">
            <h1 className="text-[#000] text-[20px] font-bold leading-[30px] text-center mb-[20px]">
              Thông tin tài khoản
            </h1>
            <Row>
              <Col xxl={5} xl={5} lg={5} md={5} sm={24} xs={24}>
                <p className="text-left">Tài khoản</p>
              </Col>
              <Col xxl={19} xl={19} lg={19} md={19} sm={24} xs={24}>
                <FormItem name="username" label="" type={variables.INPUT} disabled />
              </Col>
            </Row>
            <Row>
              <Col xxl={5} xl={5} lg={5} md={5} sm={24} xs={24}>
                <p className="text-left">Họ và tên</p>
              </Col>
              <Col xxl={19} xl={19} lg={19} md={19} sm={24} xs={24}>
                <FormItem
                  name="fullName"
                  label=""
                  type={variables.INPUT}
                  rules={[variables.RULES.EMPTY]}
                />
              </Col>
            </Row>
            <Row>
              <Col xxl={5} xl={5} lg={5} md={5} sm={24} xs={24}>
                <p className="text-left">Email</p>
              </Col>
              <Col xxl={19} xl={19} lg={19} md={19} sm={24} xs={24}>
                <FormItem
                  name="email"
                  label=""
                  type={variables.INPUT}
                  rules={[variables.RULES.EMPTY, variables.RULES.EMAIL_SPECIAL_CHARACTER]}
                />
              </Col>
            </Row>
            <Row>
              <Col xxl={5} xl={5} lg={5} md={5} sm={24} xs={24}>
                <p className="text-left">Số điện thoại</p>
              </Col>
              <Col xxl={19} xl={19} lg={19} md={19} sm={24} xs={24}>
                <FormItem
                  name="phone"
                  label=""
                  type={variables.INPUT}
                  rules={[variables.RULES.EMPTY, variables.RULES.PHONE]}
                />
              </Col>
            </Row>
            <Row>
              <Col xxl={5} xl={5} lg={5} md={5} sm={24} xs={24}>
                <p className="text-left">Địa chỉ</p>
              </Col>
              <Col xxl={19} xl={19} lg={19} md={19} sm={24} xs={24}>
                <FormItem
                  name="address"
                  label=""
                  type={variables.TEXTAREA}
                  rules={[variables.RULES.EMPTY]}
                />
              </Col>
            </Row>
            <Row>
              <Col xxl={5} xl={5} lg={5} md={5} sm={24} xs={24}>
                <p className="text-left">Giới tính</p>
              </Col>
              <Col xxl={19} xl={19} lg={19} md={19} sm={24} xs={24}>
                <FormItem
                  name="gender"
                  label=""
                  type={variables.RADIO}
                  data={variables.ARRAY_GENDER}
                  rules={[variables.RULES.EMPTY]}
                />
              </Col>
            </Row>
            <Row>
              <ButtonCustom type="primary" htmlType="submit" loading={loading}>
                Cập nhật tài khoản
              </ButtonCustom>
            </Row>
          </Col>
        </Row>
      </Form>
    </>
  );
};

export default Index;
