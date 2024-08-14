import { Button } from 'antd';
import React, { ReactNode } from 'react';
import csx from 'classnames';
import './style.scss';

interface Props {
  children: ReactNode | string;
  type: 'primary' | 'dashed' | 'default' | 'link' | 'text';
  htmlType?: 'submit';
  loading?: boolean;
  onClick?: () => void;
  className?: string;
  icon?: ReactNode | string;
}
export const ButtonCustom: React.FC<Props> = ({
  type = 'primary',
  children,
  htmlType,
  loading = false,
  onClick,
  className,
  icon = '',
}) => {
  let bgColor = '';
  switch (type) {
    case 'primary':
      bgColor = 'bg-[#006af1]';
      break;
    case 'dashed':
      bgColor = 'bg-[#2eacc1]';
      break;
    case 'default':
      bgColor = 'bg-[#17a446]';
      break;

    default:
      break;
  }

  if (htmlType) {
    return (
      <Button
        type={type}
        className={csx(`btn-${type}`, className, bgColor)}
        htmlType={htmlType}
        loading={loading}
        icon={icon}
      >
        {children}
      </Button>
    );
  }
  return (
    <span>
      <Button
        type={type}
        className={csx(`btn-${type}`, className, bgColor)}
        loading={loading}
        onClick={onClick}
        icon={icon}
      >
        {children}
      </Button>
    </span>
  );
};
