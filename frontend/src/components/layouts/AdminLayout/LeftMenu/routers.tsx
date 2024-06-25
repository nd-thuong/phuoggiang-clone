import { AppstoreOutlined } from '@ant-design/icons';

type MenuItem = {
  key: string;
  icon?: React.ReactNode | React.JSX.Element | string;
  label: React.ReactNode | React.JSX.Element | string;
  children?: MenuItem[];
  type?: string;
};

export const routes: MenuItem[] = [
  {
    key: 'quan-ly-san-pham',
    icon: <AppstoreOutlined />,
    label: 'Quản lý sản phẩm',
    children: [
      {
        key: '/quan-ly/san-pham',
        label: 'Sản phẩm',
        type: '/san-pham',
      },
      {
        key: '/quan-ly/loai-san-pham',
        label: 'Loại sản phẩm',
        type: '/loai-san-pham',
      },
      {
        key: '/quan-ly/nhom-san-pham',
        label: 'Nhóm sản phẩm',
        type: '/nhom-san-pham',
      },
      {
        key: '/quan-ly/thuong-hieu',
        label: 'Thương hiệu',
        type: '/thuong-hieu',
      },
      {
        key: '/quan-ly/kich-thuoc',
        label: 'Kích thước',
        type: '/kich-thuoc',
      },
      {
        key: '/quan-ly/don-vi',
        label: 'Đơn vị',
        type: '/don-vi',
      },
      {
        key: '/quan-ly/be-mat',
        label: 'Bề mặt',
        type: '/be-mat',
      },
      // {
      //   key: '/quan-ly/xuong-gach',
      //   label: ''
      // },
    ],
  },
];
