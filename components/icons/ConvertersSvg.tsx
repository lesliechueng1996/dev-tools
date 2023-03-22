import { SVGProps } from 'react';

const ConvertersSvg = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="-10 0 1034 1024" {...props}>
    <path
      fill="currentColor"
      d="M295 192h438c53 0 96 43 96 96v182l26-25c5-5 12-8 19-8 15 0 26 11 26 26 0 7-3 14-8 19l-68 68c-5 6-12 10-21 10s-16-4-21-10l-68-68c-5-5-8-12-8-19 0-15 12-26 27-26 7 0 14 3 19 8l25 25V288c0-25-19-43-44-43H295c-25 0-44 18-44 43v88c0 15-11 27-26 27s-27-12-27-27v-88c0-53 44-96 97-96zm87 175h255c15 0 26 12 26 27s-11 26-26 26H382c-15 0-26-11-26-26s11-27 26-27zm-158 88h1c9 0 16 4 21 10l67 68c5 5 9 12 9 19 0 15-12 26-27 26-7 0-14-3-19-8l-25-25v182c0 25 19 43 44 43h438c25 0 44-18 44-43v-88c0-15 11-27 26-27s26 12 26 27v88c0 53-43 96-96 96H295c-53 0-97-43-97-96V545l-25 25c-5 5-12 8-19 8-15 0-26-11-26-26 0-7 3-14 8-19l68-68c5-6 12-10 20-10zm158 26h150c15 0 26 12 26 27s-11 26-26 26H382c-15 0-26-11-26-26s11-27 26-27zm0 114h255c15 0 26 11 26 26s-11 27-26 27H382c-15 0-26-12-26-27s11-26 26-26z"
    />
  </svg>
);

export default ConvertersSvg;