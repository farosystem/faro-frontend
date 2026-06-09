import { ReactNode } from 'react';
import { Navigate, Route, useLocation } from 'react-router-dom';

interface AuthProtectedProps {
  children: ReactNode;
}

const AuthProtected = ({ children }: AuthProtectedProps) => {
  const location = useLocation();

  if (!localStorage.getItem('token')) {
    // Redirect unauthenticated users to login, preserving the current location in state
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

type AccessRouteProps = React.ComponentProps<typeof Route> & {
  component: React.ComponentType<any>;
};

const AccessRoute = ({ component: Component, ...rest }: AccessRouteProps) => {
  // React Router v6 uses the `element` prop instead of `render`
  return <Route {...rest} element={<Component />} />;
};

export { AuthProtected, AccessRoute };
