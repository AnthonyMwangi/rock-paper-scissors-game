declare module "*.css";
declare module "*.scss";
declare module "*.svg";

declare module '*.svg?react' {
  import { IconProps } from '@/utilities';
  import * as React from 'react';
  const ReactComponent: React.FC<IconProps>;
  export default ReactComponent;
}
