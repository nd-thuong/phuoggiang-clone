import React from 'react';
import HeaderClient from './HeaderClient';
import FooterClient from './FooterClient';
import { ConfigProvider } from 'antd';
import { Roboto } from 'next/font/google';

interface Props {
  children: React.ReactNode;
}
const fontRoboto = Roboto({
  subsets: ['latin'],
  weight: ['100', '300', '400', '500', '700'],
  display: 'swap',
  style: ['normal'],
  variable: '--font-roboto',
});

const MainLayout: React.FC<Props> = ({ children }) => {
  return (
    <div className={fontRoboto.className}>
      <ConfigProvider
        theme={{
          components: {
            Button: {
              colorPrimary: '#14a8d5',
              colorPrimaryHover: '#14a8d5b8',
            },
            Layout: {
              headerHeight: 68,
              headerBg: '#fff',
              headerColor: '#000',
              headerPadding: 0,
              footerPadding: 0,
              footerBg: '#002654',
              colorText: '#fff',
            },
            Menu: {
              itemColor: '#192736',
              colorPrimary: '#f3bf05',
            },
          },
        }}
      >
        <HeaderClient />
        {children}
        <FooterClient />
      </ConfigProvider>
    </div>
  );
};

export default MainLayout;
