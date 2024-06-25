import React, { useEffect, useState } from 'react';
import { Col, Drawer, Flex, Input, Layout, Menu, MenuProps, Popover, Row } from 'antd';
import './style.scss';
import IconPhoneLine from '@/icons/IconPhoneLine';
import IconCheckOrder from '@/icons/CheckOrderIcon';
import IconUser from '@/icons/IconUser';
import Image from 'next/image';
import Link from 'next/link';
import { CloseOutlined, MenuOutlined, SearchOutlined } from '@ant-design/icons';
import IconShoppingCart from '@/icons/IconShoppingCart';
import csx from 'classnames';
import { useRouter } from 'next/navigation';
import { getToken, removeItem } from '@/utils/helper';
import { resetAllStores } from '@/stores/main.store';
import { variables } from '@/utils/variables';
import { useUserStore } from '@/stores/user.store';

const items: MenuProps['items'] = [
  {
    label: (
      <Link href="/gioi-thieu" className="text-[15px] font-medium uppercase">
        Giới thiệu
      </Link>
    ),
    key: '/gioi-thieu',
  },
  {
    label: (
      <Link href="/san-pham" className="text-[15px] font-medium uppercase">
        Sản phẩm
      </Link>
    ),
    key: '/san-pham',
  },
  {
    label: (
      <Link href="/cam-nhan" className="text-[15px] font-medium uppercase">
        Cảm nhận
      </Link>
    ),
    key: '/cam-nhan',
  },
  {
    label: (
      <Link href="/khach-hang" className="text-[15px] font-medium uppercase">
        Khách hàng
      </Link>
    ),
    key: '/khach-hang',
  },
  {
    label: (
      <Link href="/tin-tuc" className="text-[15px] font-medium uppercase">
        Tin tức
      </Link>
    ),
    key: '/tin-tuc',
  },
  {
    label: (
      <Link href="/lien-he" className="text-[15px] font-medium uppercase">
        Liên hệ
      </Link>
    ),
    key: '/lien-he',
  },
];

const Header = () => {
  const router = useRouter();
  const { user, logout } = useUserStore();
  const [showSearchMobile, setSearchMobile] = useState<boolean>(false);
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const handleClickSearch = () => {
    setSearchMobile(!showSearchMobile);
    setOpenDrawer(!openDrawer);
  };
  const handleClickDrawer = () => {
    setOpenDrawer(!openDrawer);
  };

  useEffect(() => {
    const handleScroll = () => {
      const position = window.scrollY;
      setScrollPosition(position);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleLogout = () => {
    const token = getToken();
    removeItem();
    resetAllStores();
    if (token) {
      logout({ 'refresh-token': token });
    }
  };

  const content = (
    <Flex justify="space-between">
      <div className="drawer-logo">
        <Image
          src="/logo.png"
          width={40}
          height={40}
          alt="logo"
          className="cursor-pointer"
          onClick={() => router.push('/')}
        />
      </div>
      <Flex gap={10} align="center">
        <span className="px-3 cursor-pointer" onClick={handleClickSearch}>
          <SearchOutlined />
        </span>
        <span className="px-3 cursor-pointer">
          <IconShoppingCart />
        </span>
        <span className="px-3 cursor-pointer" onClick={handleClickDrawer}>
          <CloseOutlined />
        </span>
      </Flex>
    </Flex>
  );

  const contentPopover = (
    <Flex vertical>
      <p
        className="text-[15px] leading-[20px] cursor-pointer hover:bg-slate-50 p-[10px]"
        onClick={() => router.push('/thong-tin-tai-khoan')}
      >
        Thông tin tài khoản
      </p>
      <p
        className="text-[15px] leading-[20px] cursor-pointer hover:bg-slate-50 p-[10px]"
        onClick={handleLogout}
      >
        Thoát tài khoản
      </p>
    </Flex>
  );

  return (
    <>
      <div className={csx('main-header header-fixed', { 'shadow-2xl': scrollPosition >= 40 })}>
        <div className={csx('header-top', { hidden: scrollPosition >= 40 })}>
          <div className="main-container h-full">
            <Flex justify="space-between" align="center">
              <Flex className="phone-line" align="center" justify="center" gap={5}>
                <IconPhoneLine />
                <p className="header-top-text">0358.123.534</p>
              </Flex>
              <Flex wrap="nowrap" gap={30} align="center">
                <div className="hidden sm:block">
                  <Flex gap={5} align="center" className="sm:flex hidden">
                    <IconCheckOrder />
                    <p className="header-top-text cursor-pointer">Kiểm tra trạng thái đơn</p>
                  </Flex>
                </div>

                <Flex gap={5} align="center">
                  <IconUser />
                  {user?.username ? (
                    <Popover placement="bottom" content={contentPopover}>
                      <p className="text-[#000] text-[20px]">{user.username}</p>
                    </Popover>
                  ) : (
                    <p
                      className="header-top-text cursor-pointer"
                      onClick={() => router.push(variables.PATHS.DANG_NHAP)}
                    >
                      Đăng nhập
                    </p>
                  )}
                </Flex>
              </Flex>
            </Flex>
          </div>
        </div>
        <Layout.Header>
          <div className="main-container h-full">
            <div className="hidden md:block h-full">
              <Row className="h-full">
                <Col span={16}>
                  <Row gutter={10} className="h-full">
                    <Col>
                      <div className="logo">
                        <Image
                          src="/logo.png"
                          width={60}
                          height={60}
                          alt="logo"
                          className="cursor-pointer"
                          onClick={() => router.push('/')}
                        />
                      </div>
                    </Col>
                    <Col span={20}>
                      <div className="">
                        <Menu items={items} mode="horizontal" />
                      </div>
                    </Col>
                  </Row>
                </Col>
                <Col span={8}>
                  <Flex
                    wrap="nowrap"
                    gap={30}
                    align="center"
                    className="h-full "
                    justify="flex-end"
                  >
                    <div className="">
                      <Input placeholder="Tìm kiếm" prefix={<SearchOutlined />} />
                    </div>
                    <Flex gap={5} align="center">
                      <IconShoppingCart />
                      <p className="text-shopping">Giỏ hàng</p>
                    </Flex>
                  </Flex>
                </Col>
              </Row>
            </div>
            <div className="block md:hidden h-full">
              <Flex align="center" justify="space-between" className="h-full">
                <div className="logo">
                  <Image
                    src="/logo.png"
                    width={60}
                    height={60}
                    alt="logo"
                    className="cursor-pointer"
                    onClick={() => router.push('/')}
                  />
                </div>
                <Flex wrap="nowrap" gap={15}>
                  <span className="px-3 cursor-pointer" onClick={handleClickSearch}>
                    <SearchOutlined />
                  </span>
                  <span className="px-3 cursor-pointer">
                    <IconShoppingCart />
                  </span>
                  <span className="px-3 cursor-pointer" onClick={handleClickDrawer}>
                    <MenuOutlined />
                  </span>
                </Flex>
              </Flex>
            </div>
          </div>
          <div
            className={csx('input-mobile', { block: showSearchMobile, hidden: !showSearchMobile })}
          >
            <Input.Search placeholder="Tìm kiếm" />
          </div>
        </Layout.Header>
      </div>
      <div className="temp-block" />
      <Drawer
        open={openDrawer}
        title={content}
        placement="left"
        closeIcon={false}
        rootClassName="drawer-custom"
        footer={
          <Flex vertical>
            <ul className="drawer-custom-footer">
              <li>
                <Link href="#">Thông tin tài khoản</Link>
              </li>
              <li>
                <Link href="#">Danh sách đơn hàng</Link>
              </li>
              <li>
                <Link href="#">Báo cáo</Link>
              </li>
              <li>
                <Link href="#">Đăng xuất</Link>
              </li>
            </ul>
          </Flex>
        }
      >
        <Menu mode="vertical" items={items} />
      </Drawer>
    </>
  );
};

export default Header;
