type MenuItem = {
  id: string;
  label: string;
  expand?: boolean;
  isLeaf: boolean;
  isActive?: boolean;
  icon: (props: SVGProps<SVGSVGElement>) => JSX.Element;
  children?: MenuItem[];
  link?: string;
};
