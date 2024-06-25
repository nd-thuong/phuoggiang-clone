import './global.scss';
import type { AppProps } from 'next/app';
import MainLayout from '@/components/layouts/MainLayout';
import AdminLayout from '@/components/layouts/AdminLayout';
import { usePathname } from 'next/navigation';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);
export default function App({ Component, pageProps }: AppProps) {
  dayjs.tz.setDefault('Asia/Ho_Chi_Minh');
  const pathname = usePathname();

  if (pathname?.includes('/quan-ly')) {
    return (
      <AdminLayout>
        <Component {...pageProps} />
      </AdminLayout>
    );
  }
  return (
    <main>
      <MainLayout>
        <Component {...pageProps} />
      </MainLayout>
    </main>
  );
}
