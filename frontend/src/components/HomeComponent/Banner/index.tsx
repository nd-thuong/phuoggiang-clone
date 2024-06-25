import { Carousel, Flex } from 'antd';
import Image from 'next/image';
import React, { useId } from 'react';
import './style.scss';

const Index = () => {
  const items = [
    {
      id: useId(),
      title: 'Đồng hành xây dựng căn nhà mơ ước của bạn-123',
      image: '/banner.jpg',
    },
    {
      id: useId(),
      title: 'Đồng hành xây dựng căn nhà mơ ước của bạn-456',
      image: '/banner.jpg',
    },
    {
      id: useId(),
      title: 'Đồng hành xây dựng căn nhà mơ ước của bạn-789',
      image: '/banner.jpg',
    },
  ];
  return (
    <Carousel autoplay={true} slidesToScroll={1} slidesToShow={1} draggable>
      {items.map((el) => (
        <div className="carousel-item" key={el.id}>
          <Image src={el.image} fill sizes="100%" alt="" />
          <div className="carousel-content">
            <div className="main-container h-full">
              <Flex className="h-full w-full" align="center" justify="center">
                <p className="text-[35px] xl:text-[44px] md:text-[40px] leading-[50px] xl:leading-[64px] md:leading-[56px] font-bold text-[#fff]">
                  {el.title}
                </p>
              </Flex>
            </div>
          </div>
        </div>
      ))}
    </Carousel>
  );
};

export default Index;
