import { Routes, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { layoutTypes } from '../constants/layout';
import { authProtectedRoutes, publicRoutes } from './routes';
import { AuthProtected } from './AuthProtected';
import { getLayoutType } from '../store/selectors/layout';

import NonAuthLayout from '../Layout/NonAuthLayout';
import VerticalLayout from '../Layout/VerticalLayout/index';

const getLayout = (layoutType) => {
  let Layout = VerticalLayout;
  switch (layoutType) {
    case layoutTypes.VERTICAL:
      Layout = VerticalLayout;
      break;
    default:
      break;
  }
  return Layout;
};

const Index = () => {
  const layoutType = useSelector(getLayoutType);

  const Layout = getLayout(layoutType);

  return (
    <Routes>
      <Route>
        {publicRoutes.map((route, idx) => (
          <Route
            path={route.path}
            element={<NonAuthLayout>{route.component}</NonAuthLayout>}
            key={idx}
          />
        ))}
      </Route>

      <Route>
        {authProtectedRoutes.map((route, idx) => (
          <Route
            path={route.path}
            element={
              <AuthProtected>
                <Layout>{route.component}</Layout>
              </AuthProtected>
            }
            key={idx}
          />
        ))}
      </Route>
    </Routes>
  );
};

export default Index;
