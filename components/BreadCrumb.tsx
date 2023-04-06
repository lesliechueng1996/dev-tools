'use client';
import { usePathname } from 'next/navigation';
import { HomeIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

type BreadCrumbItemType = {
  label: string;
  link: string;
};

function BreadCrumb() {
  const pathname = usePathname();
  let pathNameWithoutBase = pathname;
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    pathNameWithoutBase = pathNameWithoutBase.replace(
      process.env.NEXT_PUBLIC_BASE_URL,
      ''
    );
  }
  const pathNames: BreadCrumbItemType[] = pathNameWithoutBase
    .split('/')
    .filter((item) => item !== '')
    .reduce((pre: BreadCrumbItemType[], current: string) => {
      if (pre.length === 0) {
        return [
          {
            label: current,
            link: `/${current}`,
          },
        ];
      }

      return [
        ...pre,
        {
          label: current,
          link: `${pre[pre.length - 1].link}/${current}`,
        },
      ];
    }, [] as BreadCrumbItemType[]);

  return (
    <div className="h-full flex gap-2 items-center dark:text-white/70">
      <Link href="/">
        <HomeIcon className="h-6 w-6" />
      </Link>

      {pathNames.length > 0 &&
        pathNames.map((item, index) => (
          <div key={item.label} className="flex items-center gap-2">
            <ChevronRightIcon className="h-6 w-6" />
            <Link href={item.link}>
              <span
                className={
                  index === pathNames.length - 1
                    ? 'font-bold text-sky-600 dark:text-cyan-400'
                    : ''
                }
              >
                {item.label}
              </span>
            </Link>
          </div>
        ))}
    </div>
  );
}

export default BreadCrumb;
