import React from 'react';
import Icon from '@ant-design/icons';
import type { CustomIconComponentProps } from '@ant-design/icons/lib/components/Icon';

const EmailWhiteSvg = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
    <g opacity="0.5">
      <path
        d="M12.3462 12.9062H1.65375C1.33118 12.9062 1.02182 12.7781 0.793731 12.55C0.56564 12.3219 0.4375 12.0126 0.4375 11.69V4.4975C0.4375 4.17493 0.56564 3.86557 0.793731 3.63748C1.02182 3.40939 1.33118 3.28125 1.65375 3.28125H6.5625C6.67853 3.28125 6.78981 3.32734 6.87186 3.40939C6.95391 3.49144 7 3.60272 7 3.71875C7 3.83478 6.95391 3.94606 6.87186 4.02811C6.78981 4.11016 6.67853 4.15625 6.5625 4.15625H1.65375C1.56324 4.15625 1.47645 4.1922 1.41245 4.2562C1.34845 4.3202 1.3125 4.40699 1.3125 4.4975V11.69C1.3125 11.7805 1.34845 11.8673 1.41245 11.9313C1.47645 11.9953 1.56324 12.0312 1.65375 12.0312H12.3462C12.4368 12.0312 12.5236 11.9953 12.5876 11.9313C12.6515 11.8673 12.6875 11.7805 12.6875 11.69V4.4975C12.6875 4.40699 12.6515 4.3202 12.5876 4.2562C12.5236 4.1922 12.4368 4.15625 12.3462 4.15625H11.8125C11.6965 4.15625 11.5852 4.11016 11.5031 4.02811C11.4211 3.94606 11.375 3.83478 11.375 3.71875C11.375 3.60272 11.4211 3.49144 11.5031 3.40939C11.5852 3.32734 11.6965 3.28125 11.8125 3.28125H12.3462C12.6688 3.28125 12.9782 3.40939 13.2063 3.63748C13.4344 3.86557 13.5625 4.17493 13.5625 4.4975V11.69C13.5625 12.0126 13.4344 12.3219 13.2063 12.55C12.9782 12.7781 12.6688 12.9062 12.3462 12.9062Z"
        fill="white"
      />
      <path
        d="M9.68164 1.53125C9.68164 1.28963 9.48577 1.09375 9.24414 1.09375C9.00252 1.09375 8.80664 1.28963 8.80664 1.53125V6.78125C8.80664 7.02287 9.00252 7.21875 9.24414 7.21875C9.48577 7.21875 9.68164 7.02287 9.68164 6.78125V1.53125Z"
        fill="white"
      />
      <path
        d="M6.5625 9.63818H3.0625C2.82088 9.63818 2.625 9.83406 2.625 10.0757C2.625 10.3173 2.82088 10.5132 3.0625 10.5132H6.5625C6.80412 10.5132 7 10.3173 7 10.0757C7 9.83406 6.80412 9.63818 6.5625 9.63818Z"
        fill="white"
      />
      <path
        d="M3.9375 7.75244H3.0625C2.82088 7.75244 2.625 7.94832 2.625 8.18994C2.625 8.43157 2.82088 8.62744 3.0625 8.62744H3.9375C4.17912 8.62744 4.375 8.43157 4.375 8.18994C4.375 7.94832 4.17912 7.75244 3.9375 7.75244Z"
        fill="white"
      />
    </g>
  </svg>
);

const EmailWhiteIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={EmailWhiteSvg} {...props} />
);

export default EmailWhiteIcon;
