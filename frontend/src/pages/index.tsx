import React from 'react';
import { DefaultSeo } from 'next-seo';
import { SEO } from '@/configs/seo.config';
import Banner from '@/components/HomeComponent/Banner';
import SaleProduct from '@/components/HomeComponent/SaleProduct';

const Home = () => {
  return (
    <>
      <DefaultSeo {...SEO} title="Trang chủ" />
      <Banner />
      <SaleProduct />
    </>
  );
};

export default Home;
