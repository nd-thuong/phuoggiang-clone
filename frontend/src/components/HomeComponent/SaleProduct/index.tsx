import React from 'react';
import dayjs from 'dayjs';
import CountdownTimer from './CountdownTimer';
import './style.scss';
import { Flex } from 'antd';
import { Tilt_Warp } from 'next/font/google';
import csx from 'classnames';

const fontTilt_Warp = Tilt_Warp({
  subsets: ['latin'],
  weight: ['400'],
  display: 'swap',
  style: ['normal'],
  variable: '--font-Tilt_Warp',
});

const Index = () => {
  return (
    <div className="main-container">
      <div className="sale-product">
        <div className="flex flex-nowrap gap-x-4 sm:gap-x-6 items-center">
          <Flex gap={3} wrap="wrap">
            <h1
              className={csx(
                'text-[15px] sm:text-[25px] md:text-[30px] leading-[20px] sm:leading-[40px] md:leading-[50px] font-bold italic uppercase',
                fontTilt_Warp.className
              )}
            >
              sản phẩm
            </h1>
            <h1
              className={csx(
                'text-[15px] sm:text-[25px] md:text-[30px] leading-[20px] sm:leading-[40px] md:leading-[50px] font-bold italic uppercase animate-pulse text-red-700 whitespace-nowrap',
                fontTilt_Warp.className
              )}
            >
              khuyến mãi
            </h1>
          </Flex>
          <CountdownTimer
            targetDate={dayjs()
              .add(3, 'day')
              .add(4, 'hour')
              .add(40, 'minutes')
              .add(58, 'milliseconds')}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
