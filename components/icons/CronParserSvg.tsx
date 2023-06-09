import { SVGProps } from 'react';

const CronParserSvg = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="-10 0 1034 1024" {...props}>
    <path
      fill="currentColor"
      d="M480 325c0-20 17-37 37-37s37 17 37 37v162l128 64c13 6 20 19 20 33 0 6-1 12-4 17-6 13-20 21-34 21-5 0-11-1-16-4l-148-75c-13-6-20-19-20-33V325zm37-111c-164 0-297 132-297 296s133 297 297 297 296-133 296-297-132-296-296-296zm0-74c204 0 370 166 370 370S721 881 517 881 146 714 146 510s167-370 371-370z"
    />
  </svg>
);

export default CronParserSvg;
