import { SEO } from '@/configs/seo.config';
import { DefaultSeo } from 'next-seo';
import Link from 'next/link';
import React from 'react';

const NotFound = () => {
  return (
    <>
      <DefaultSeo {...SEO} title="not found" />
      <section className="bg-white dark:bg-gray-900">
        <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
          <div className="mx-auto max-w-screen-sm text-center">
            <h1 className="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-primary-600 dark:text-primary-500">
              404
            </h1>
            <p className="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl dark:text-white">
              Chức năng chưa phát triển
            </p>
            <p className="mb-4 text-lg font-light text-gray-500 dark:text-gray-400">
              Hiện tại chúng tôi chưa phát triển chức năng này, vui lòng chuyển về trang sản phẩm
            </p>
            <Link
              href="/quan-ly/san-pham"
              className="inline-flex text-white bg-blue-600 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-primary-900 my-4"
            >
              Quản lý sản phẩm
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default NotFound;
