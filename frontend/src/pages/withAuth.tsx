// components/withAuth.tsx
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { NextPage } from 'next';
import { useUserStore } from '../stores/user.store';
import { usePathname } from 'next/navigation';

const withAuth = (WrappedComponent: NextPage) => {
  const WithAuth: NextPage = (props) => {
    const router = useRouter();
    const { user } = useUserStore(); // Sử dụng Zustand hook để lấy trạng thái người dùng
    const pathname = usePathname();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      // Không cần kiểm tra user ở đây nếu Zustand store sẽ luôn trả về giá trị đúng
      if (!user || user.role !== 'admin') {
        router.replace('/quan-ly/dang-nhap'); // Nếu không phải admin, chuyển hướng đến trang đăng nhập
      }
      if (user?.username && pathname === '/quan-ly/dang-nhap') {
        router.replace('/');
      }
      setIsLoading(false); // Nếu là admin, kết thúc loading
    }, [router, user, pathname]);

    // Hiển thị trạng thái loading nếu cần
    if (isLoading) {
      return <div>Loading...</div>;
    }

    // Nếu người dùng là admin, hiển thị component được bọc
    return <WrappedComponent {...props} />;
  };

  return WithAuth;
};

export default withAuth;
