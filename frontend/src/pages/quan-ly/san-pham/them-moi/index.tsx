import { SEO } from '@/configs/seo.config';
import { Col, Form, Row } from 'antd';
import { DefaultSeo } from 'next-seo';
import React from 'react';
import { useAsyncEffect } from '@/hooks/useAsyncEffect';
import { productTypeStore } from '@/stores/product-type.store';
import { brandStore } from '@/stores/brand.store';
import { productGroupStore } from '@/stores/productgroup.store';

const Index = () => {
  const { getProductType, data: productTypes } = productTypeStore();
  const { getBrand, data: brands } = brandStore();
  const { getProductGroup, data: productGroups } = productGroupStore();

  useAsyncEffect(async () => {
    await getBrand({ page: 1, take: 50 });
    await getProductGroup({ page: 1, take: 50 });
    await getProductType({ page: 1, take: 50 });
  }, []);

  return (
    <>
      <DefaultSeo {...SEO} title="Thêm mới sản phẩm" />
      <Form layout="vertical">
        <Row>
          <Col span={24} className="mb-2">
            <h1 className="text-[25px] leading-[40px] font-bold">Thêm sản phẩm</h1>
          </Col>
        </Row>
      </Form>
    </>
  );
};

export default Index;
