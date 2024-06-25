import React, { useState, useEffect } from 'react';

interface Props {
  targetDate: any;
}

type TimeLeft = {
  days?: number;
  hours?: number;
  minutes?: number;
  seconds?: number;
};

const CountdownTimer: React.FC<Props> = ({ targetDate }) => {
  const calculateTimeLeft = () => {
    const difference = +new Date(targetDate) - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  });

  const { days, hours, minutes, seconds } = timeLeft;

  return (
    <div>
      <div className="flex flex-nowrap items-center gap-x-3">
        <span className="text-[#fff] font-bold bg-red-600 px-[15px] py-[8px] rounded-[10px]">
          {(days as number) > 9 ? days : `0${days}`}
        </span>
        <span className="text-[#fff] font-bold bg-red-600 px-[15px] py-[8px] rounded-[10px]">
          {(hours as number) > 9 ? hours : `0${hours}`}
        </span>
        <span className="text-[#fff] font-bold bg-red-600 px-[15px] py-[8px] rounded-[10px]">
          {(minutes as number) > 9 ? minutes : `0${minutes}`}
        </span>
        <span className="text-[#fff] font-bold bg-red-600 px-[15px] py-[8px] rounded-[10px]">
          {(seconds as number) > 9 ? seconds : `0${seconds}`}
        </span>
      </div>
    </div>
  );
};

export default CountdownTimer;
