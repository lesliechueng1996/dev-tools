import './globals.css';
import Menu from '@/components/Menu';

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
    <html lang="en" className="">
      <body className="flex min-w-min">
        <aside className="w-1/4 bg-slate-200 dark:bg-slate-900 h-screen min-w-min overflow-y-auto">
          <Menu />
        </aside>
        <main className="flex-1 bg-slate-50 h-screen overflow-y-auto">
          {children}
        </main>
      </body>
    </html>
  );
}
