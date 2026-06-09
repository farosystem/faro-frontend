import { Fragment } from 'react';
import { Container, Row, Col } from 'reactstrap';

const Footer = () => {
  return (
    <Fragment>
      <footer className="footer transition-footer">
        <Container fluid={true}>
          <Row>
            <Col sm={6}>{new Date().getFullYear()} © FARO.</Col>
            {/* <Col sm={6}>
              <div className="text-sm-end d-none d-sm-block">
                Crafted with <i className="mdi mdi-heart text-danger"></i> by
                Themesdesign
              </div>
            </Col> */}
          </Row>
        </Container>
      </footer>
    </Fragment>
  );
};

export default Footer;
