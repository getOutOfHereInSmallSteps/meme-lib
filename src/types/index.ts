import { SVGProps } from 'react';

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export type Meme = {
  id: number;
  name: string;
  url: string;
  likes: number;
};
