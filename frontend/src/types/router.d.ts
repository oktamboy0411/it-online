export interface AppRouteConfig {
  path: string;
  element: JSX.Element;
  children?: AppRouteConfig[];
}
