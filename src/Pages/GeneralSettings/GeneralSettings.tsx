import React from 'react';
import { Container, Row } from 'reactstrap';

import Breadcrumbs from '../../components/Common/Breadcrumb';
import ButtomCardGeneralSettings from './ButtomCardGeneralSettings';
import { menuRoutes } from '@/constants/menuRoutes';

const GeneralSettings = () => {
  document.title = 'Ajustes generales | FARO';
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumbs
            title="Ajustes generales"
            breadcrumbItem="Inicio"
            breadcrumbItemUrl="/home"
          />
          <Row className="flex justify-content-center gap-3 pb-3">
            {menuRoutes.map((route, index) => (
              <ButtomCardGeneralSettings key={index} route={route} />
            ))}
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default GeneralSettings;
