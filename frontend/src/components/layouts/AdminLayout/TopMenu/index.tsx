import { ButtonCustom } from '@/components/CommonComponent/Button/ButtonCustom';
import { resetAllStores } from '@/stores/main.store';
import { useUserStore } from '@/stores/user.store';
import { getToken, removeItem } from '@/utils/helper';
import { variables } from '@/utils/variables';
import { Flex, Layout, Popover } from 'antd';
import { useRouter } from 'next/router';
import React from 'react';

const Index = () => {
  const router = useRouter();
  const { user, logout } = useUserStore();
  const handleLogout = () => {
    const token = getToken();
    removeItem();
    resetAllStores();
    if (token) {
      logout({ 'refresh-token': token }, () => {
        router.push(variables.PATHS.QUAN_LY_DANG_NHAP);
      });
    }
  };
  const content = (
    <Flex vertical>
      <p className="text-[#000] text-[15px] text-left mb-[10px] hover:bg-slate-100 px-[10px]">{`Vai trò: ${user?.role}`}</p>
      <p
        className="text-[#000] text-[15px] text-left cursor-pointer hover:bg-slate-100 px-[10px]"
        onClick={handleLogout}
      >
        Logout
      </p>
      {/* <ButtonCustom type="text">{`Vai trò: ${user?.role}`}</ButtonCustom>
      <ButtonCustom type="text" onClick={handleLogout}>
        Logout
      </ButtonCustom> */}
    </Flex>
  );
  return (
    <Layout.Header>
      <Flex justify="flex-end">
        {user ? (
          <Popover content={content} placement="bottom">
            <p className="text-[#fff] text-[20px] font-semibold">{user.username}</p>
          </Popover>
        ) : (
          <></>
        )}
      </Flex>
    </Layout.Header>
  );
};

export default Index;
