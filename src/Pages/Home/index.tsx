import { Fragment } from 'react';
import { Container, Row } from 'reactstrap';

import Breadcrumbs from '@/components/Common/Breadcrumb';
import ButtonCardHome from './ButtonCardHome';
import { menuRoutes } from '@/constants/menuRoutes';

const Home = () => {
  document.title = 'Inicio | FARO';
  return (
    <Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumbs title="Inicio" />
          <Row className="flex justify-content-center gap-3 pb-3 button-card-home">
            {menuRoutes.map((route, index) => (
              <ButtonCardHome key={index} route={route} />
            ))}
          </Row>
        </Container>
      </div>
    </Fragment>
  );
};

export default Home;
