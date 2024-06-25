import { ConfigProvider, Flex, Layout, ThemeConfig } from 'antd';
import { Poppins } from 'next/font/google';
import React, { ReactNode, useEffect, useState } from 'react';
import TopMenu from './TopMenu';
import LeftMenu from './LeftMenu';
import { usePathname, useRouter } from 'next/navigation';
import 'simplebar-react/dist/simplebar.min.css';
import { TypeResMe } from '@/types/user';
import { getToken } from '@/utils/helper';
import LoadingPage from '@/components/LoadingPage';
import { variables } from '@/utils/variables';
import { useUserStore } from '@/stores/user.store';

const { Content } = Layout;
type Props = {
  children: ReactNode;
  userInfo?: TypeResMe;
};
const adminFont = Poppins({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  display: 'swap',
  style: ['normal'],
  variable: '--admin-font',
});
const theme: ThemeConfig = {
  token: {
    // colorPrimary: '#005ceb',
    fontFamily: adminFont.style.fontFamily,
  },
  components: {
    Button: {
      colorPrimary: '#005ceb',
      colorPrimaryHover: '#478af1',
      colorPrimaryActive: '#005ceb',
      colorLinkHover: '#478af1',
    },
    Input: {
      activeBorderColor: '#005ceb',
      hoverBorderColor: '#005ceb',
    },
    Tabs: {
      itemHoverColor: '#005ceb',
      itemSelectedColor: '#005ceb',
      itemActiveColor: '#005ceb',
      inkBarColor: '#005ceb',
    },
    Spin: {
      colorPrimary: '#005ceb',
    },
    Table: {
      cellPaddingInline: 8,
    },
  },
  // hashed: false,
};

const Index: React.FC<Props> = ({ children }) => {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { user } = useUserStore();

  useEffect(() => {
    setIsLoading(false);
    const token = getToken();
    if (!token && !user) {
      router.push(variables.PATHS.QUAN_LY_DANG_NHAP);
    }
    if (user && user?.role !== 'admin') {
      router.push('/');
    }
  }, [pathname, router, user]);

  if (isLoading) {
    return <LoadingPage />;
  }

  if (pathname === variables.PATHS.QUAN_LY_DANG_NHAP) {
    return (
      <div className={adminFont.className}>
        <ConfigProvider theme={theme}>{children}</ConfigProvider>
      </div>
    );
  }
  return (
    <div>
      <ConfigProvider theme={theme}>
        <Layout hasSider style={{ minHeight: '100vh' }}>
          <LeftMenu />
          <Layout>
            <TopMenu />
            <Content className="p-[10px]">{children}</Content>
          </Layout>
        </Layout>
      </ConfigProvider>
    </div>
  );
};

export default Index;
