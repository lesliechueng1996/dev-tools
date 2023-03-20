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
    <html lang="en" className="dark">
      <body className="flex dark:bg-slate-900 min-w-min">
        <aside className="w-1/4">
          <Menu />
        </aside>
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
