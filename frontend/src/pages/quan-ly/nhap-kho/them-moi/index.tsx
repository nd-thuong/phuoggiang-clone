import { SEO } from '@/configs/seo.config';
import { DefaultSeo } from 'next-seo';
import React from 'react';
import FormInventory from '../components/form';

const Index = () => {
  return (
    <>
      <DefaultSeo {...SEO} title="Thêm sản phẩm vào kho" />
      <FormInventory />
    </>
  );
};

export default Index;
