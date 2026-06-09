import { ReactNode } from 'react';

export interface AppRoute {
  path: string;
  component: ReactNode;
  exact?: boolean;
}
