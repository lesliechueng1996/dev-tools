import ClientProvider from '@/components/ClientProvider';
import './globals.css';
import Menu from '@/components/Menu';
import DialogProvider from '@/components/DialogProvider';
import dynamic from 'next/dynamic';
import BreadCrumb from '@/components/BreadCrumb';
import NavSettings from '@/components/NavSettings';
const FavoriteProvider = dynamic(
  () => import('@/components/FavoriteProvider'),
  { ssr: false }
);
const ThemeProvider = dynamic(() => import('@/components/ThemeProvider'), {
  ssr: false,
});

export const metadata = {
  title: 'Dev Tools',
  description: 'A dev tools created by next.js',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <DialogProvider>
            <FavoriteProvider>
              <aside className="w-1/4 theme-bg h-screen min-w-min overflow-y-auto">
                <Menu />
              </aside>
              <div className="flex-1 bg-slate-50 dark:bg-slate-800 h-screen flex flex-col">
                <nav className="py-2 w-full theme-bg flex justify-between px-5 items-center">
                  <BreadCrumb />
                  <NavSettings />
                </nav>
                <main className="flex-1 overflow-y-auto px-10 py-5 dark:text-white/70">
                  {children}
                </main>
              </div>
              <ClientProvider />
            </FavoriteProvider>
          </DialogProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
