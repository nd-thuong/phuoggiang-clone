import './global.scss';
import type { AppProps } from 'next/app';
import MainLayout from '@/components/layouts/MainLayout';
import AdminLayout from '@/components/layouts/AdminLayout';
import { usePathname } from 'next/navigation';
import 'suneditor/dist/css/suneditor.min.css';

export default function App({ Component, pageProps }: AppProps) {
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
