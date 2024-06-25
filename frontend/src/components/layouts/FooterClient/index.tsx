import React from 'react';
import './style.scss';
import { Col, Flex, Layout, Row, Typography } from 'antd';
import Image from 'next/image';
import LocationIcon from '@/icons/IconLocation';
import PhoneLineIcon from '@/icons/IconPhoneLine';
import PhoneWhiteIcon from '@/icons/IconPhoneWhite';
import EmailWhiteIcon from '@/icons/IconEmailWhite';

const Index = () => {
  return (
    <Layout.Footer>
      <div className="main-container">
        <div className="footer">
          <Row className="footer-row">
            <Col xxl={4} xl={4} lg={4} md={4} sm={10} xs={24}>
              <Flex vertical gap={30}>
                <div className="footer-logo">
                  <Image src="/logo.png" width={100} height={100} alt="logo footer" quality={100} />
                </div>
                <Flex gap={10}>
                  <Image src="/facebook.png" width={30} height={30} alt="facebook" quality={100} />
                  <Image src="/zalo.png" width={30} height={30} alt="facebook" quality={100} />
                </Flex>
              </Flex>
            </Col>
            <Col xxl={12} xl={12} lg={12} md={12} sm={14} xs={24}>
              <Flex vertical className="h-full footer-contact" gap={20}>
                <h2 className="text-[#fff] text-[15px] font-bold leading-[12px]">Liên hệ</h2>
                <Flex vertical gap={8}>
                  <Flex gap={10} align="center" justify="flex-start">
                    <LocationIcon />
                    <p>
                      Địa chỉ: Số 123 Hùng Vương, Phường Nhơn Phú, TP. Quy Nhơn, Tỉnh Bình Định,
                      Việt Nam
                    </p>
                  </Flex>
                  <Flex gap={5} align="center" justify="flex-start">
                    <PhoneWhiteIcon />
                    <p>Hotline: 0935648943</p>
                  </Flex>
                  <Flex gap={5} align="center" justify="flex-start">
                    <EmailWhiteIcon />
                    <p>Email : mayMail@gmail.com</p>
                  </Flex>
                </Flex>
              </Flex>
            </Col>
            <Col xxl={8} xl={8} lg={8} md={8} sm={24} xs={24}>
              <Flex className="w-full h-full footer-map">
                <Image src="/map.png" width={300} height={200} alt="map" />
              </Flex>
            </Col>
          </Row>
        </div>
      </div>
    </Layout.Footer>
  );
};

export default Index;
