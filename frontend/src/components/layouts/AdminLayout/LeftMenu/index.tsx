import React, { useEffect, useState } from 'react';
import { routes } from './routers';
import Link from 'next/link';
import { Layout, Menu, MenuProps, Space } from 'antd';
import SimpleBar from 'simplebar-react';
import { usePathname } from 'next/navigation';
import './style.scss';

const { Sider, Content } = Layout;

const Index = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [urlSelectedSub, setUrlSelectedSub] = useState<string[]>([]);
  const [openKeysMainMenu, setOpenKeysMainMenu] = useState<string[]>([]);
  const pathname = usePathname();
  const onOpenChangeMainMenu: MenuProps['onOpenChange'] = (keys) => {
    const latestOpenKey = keys.find((key) => openKeysMainMenu.indexOf(key) === -1);
    if (latestOpenKey) {
      setOpenKeysMainMenu(keys);
    } else {
      setOpenKeysMainMenu(latestOpenKey ? [latestOpenKey] : []);
    }
  };
  const renderMenuItem = routes.map((route) => {
    if (route?.children) {
      return {
        key: route.key,
        icon: <span>{route.icon}</span>,
        label: <span className="ant-menu-title-content">{route.label}</span>,
        children: route?.children.map((routeSub) => ({
          key: routeSub.key,
          label: (
            <Link href={`${routeSub.key}`} scroll={false}>
              {routeSub.label}
            </Link>
          ),
        })),
      };
    }
    return {
      key: route.key,
      icon: <Link href={route.key}>{route.icon}</Link>,
      label: (
        <Link href={route.key} scroll={false}>
          {route.label}
        </Link>
      ),
    };
  });

  useEffect(() => {
    const findRoute = routes.find((item) => {
      if (item.children) {
        return item.children.some((subItem) => pathname?.includes(subItem.type as string));
      }
      return pathname?.includes(item?.type as string);
    });
    if (findRoute?.key) {
      setOpenKeysMainMenu([findRoute.key]);
      if (findRoute?.children) {
        const routeChildren = findRoute.children.find((el) =>
          pathname?.includes(el.type as string)
        );

        setUrlSelectedSub([findRoute.key, routeChildren?.key as string]);
      } else {
        setUrlSelectedSub([findRoute.key]);
      }
    }
  }, [pathname]);

  return (
    <Sider
      className="customize-sidebar"
      width={250}
      // trigger={null}
      collapsible
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
    >
      {/* <div className="header-sidebar">
        <Link href="/admin/thong-ke">
          <Space>
            <h3>PNL</h3>
            {!collapsed && <span>Admin</span>}
          </Space>
        </Link>
      </div> */}
      <SimpleBar className="customize-menu-scroll" style={{ height: 'calc(100vh - 66px)' }}>
        <Menu
          theme="dark"
          mode="inline"
          // selectedKeys={['/quan-ly/thuong-hieu']}
          selectedKeys={urlSelectedSub}
          // defaultOpenKeys={[urlSelectedMain]}
          openKeys={openKeysMainMenu}
          onOpenChange={onOpenChangeMainMenu}
          items={renderMenuItem}
        />
      </SimpleBar>
    </Sider>
  );
};

export default Index;
