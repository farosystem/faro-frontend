import React, { useEffect, useState } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Button,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane
} from 'reactstrap';
import Breadcrumb from '@/components/Common/Breadcrumb';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { OBTENER_CAJAS } from '@/services/CajasService';
import { convertDataCashRegisterExcel, exportAndDownloadExcel } from '@/helpers/exportExcel';

import CashManagement from './CashManagement/CashManagement';
import CashClosing from './CashClosing/CashClosing';
import CashOpening from './CashOpening/CashOpening';
import CashMovements from './CashMovements/CashMovements';
import MovementRegistration from './MovementRegistration/MovementRegistration';
import CashCalculator from './CashCalculator';

const CashHome = () => {
  document.title = 'Cajas | FARO';
  const navigate = useNavigate();

  const [filter, setFilter] = useState('');
  const [activeTab, setActiveTab] = useState('gestiones');
  // state for tab selection and initial caja when viewing gestiones
  const [initialCajaId, setInitialCajaId] = useState<string | null>(null);
  const [initialCajaForClosing, setInitialCajaForClosing] = useState<string | null>(null);
  const [showCalculator, setShowCalculator] = useState(false);

  // reset closing selection when user leaves the cierre tab
  useEffect(() => {
    if (activeTab !== 'cierre') {
      setInitialCajaForClosing(null);
    }
  }, [activeTab]);

  // when a movement is created elsewhere, automatically show Movimientos tab
  useEffect(() => {
    const handler = () => setActiveTab('movimientos');
    window.addEventListener('movimientoRegistrado', handler);
    return () => window.removeEventListener('movimientoRegistrado', handler);
  }, []);

  const {
    loading: loading_caja,
    error: error_caja,
    data: data_caja,
    refetch
  } = useQuery(OBTENER_CAJAS, { pollInterval: 1000 });

  const getData = () => {
    if (data_caja) {
      if (data_caja.obtenerCajas) {
        let result = data_caja.obtenerCajas.filter((value, index) => {
          if (filter !== '') {
            return getFilteredByKey(value, filter);
          }
          return value;
        });
        // show most recent cajas first based on creation timestamp encoded in Mongo _id
        result = result.slice().sort((a, b) => {
          const ta = a.id ? parseInt(a.id.substring(0, 8), 16) : 0;
          const tb = b.id ? parseInt(b.id.substring(0, 8), 16) : 0;
          return tb - ta;
        });
        return result;
      }
    }
    return [];
  };

  function getFilteredByKey(key, value) {
    const val1 = key.codigo.toLowerCase();
    const val2 = key.nombre.toLowerCase();
    const val3 = key.numero.toString();
    const val4 = (key.modulo || '').toLowerCase();
    const val = value.toLowerCase();
    if (
      val1.includes(val) ||
      val2.includes(val) ||
      val2.includes(val.replace('%', '')) ||
      val3.includes(val) ||
      val4.includes(val)
    ) {
      return key;
    }
  }

  const onClickExportExcel = () => {
    exportAndDownloadExcel('Cajas', convertDataCashRegisterExcel(data));
  };

  const data = getData();

  const openGestionesForCaja = (caja) => {
    setInitialCajaId(caja.id || caja._id || String(caja));
    setActiveTab('gestiones');
  };
  const openCajaDetails = (caja) => {
    setInitialCajaForClosing(caja.id);
    setActiveTab('cierre');
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumb title="Cajas" breadcrumbItem="Inicio" breadcrumbItemUrl="/home" />

          <Row>
            <Col xs="12">
              <Card>
                <CardBody>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h4 className="mb-0">Gestión de Cajas</h4>
                    <div>
                      <Button color="secondary" onClick={() => setShowCalculator(true)}>
                        Calculadora
                      </Button>
                    </div>
                  </div>

                  <Nav tabs>
                    <NavItem>
                      <NavLink
                        className={activeTab === 'gestiones' ? 'active' : ''}
                        onClick={() => setActiveTab('gestiones')}
                      >
                        <i className="bx bx-folder-open me-1"></i> Gestiones
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        className={activeTab === 'registro' ? 'active' : ''}
                        onClick={() => setActiveTab('registro')}
                      >
                        <i className="bx bx-book me-1"></i> Registro
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        className={activeTab === 'movimientos' ? 'active' : ''}
                        onClick={() => setActiveTab('movimientos')}
                      >
                        <i className="bx bx-transfer me-1"></i> Movimientos
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        className={activeTab === 'apertura' ? 'active' : ''}
                        onClick={() => setActiveTab('apertura')}
                      >
                        <i className="bx bx-folder-plus me-1"></i> Apertura
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        className={activeTab === 'cierre' ? 'active' : ''}
                        onClick={() => setActiveTab('cierre')}
                      >
                        <i className="bx bx-folder-minus me-1"></i> Cierre
                      </NavLink>
                    </NavItem>

                    <NavItem>
                      <NavLink
                        className={activeTab === 'historial' ? 'active' : ''}
                        onClick={() => setActiveTab('historial')}
                      >
                        <i className="bx bx-history me-1"></i> Historial
                      </NavLink>
                    </NavItem>
                  </Nav>

                  <TabContent activeTab={activeTab} className="p-3 border border-top-0">
                    <TabPane tabId="gestiones">
                      <CashManagement
                        cajas={data}
                        initialCajaId={initialCajaId}
                        onSelectCaja={openCajaDetails}
                        estadoFiltro="ABIERTA"
                      />
                    </TabPane>

                    <TabPane tabId="historial">
                      <CashManagement cajas={data} estadoFiltro="CERRADA" />
                    </TabPane>

                    <TabPane tabId="apertura">
                      <CashOpening cajas={data} refetchCajas={refetch} />
                    </TabPane>

                    <TabPane tabId="cierre">
                      <CashClosing
                        cajas={data}
                        refetchCajas={refetch}
                        onShowGestiones={openGestionesForCaja}
                        initialCajaId={initialCajaForClosing}
                      />
                    </TabPane>

                    <TabPane tabId="movimientos">
                      <CashMovements cajas={data} />
                    </TabPane>

                    <TabPane tabId="registro">
                      <MovementRegistration />
                    </TabPane>
                  </TabContent>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
      <CashCalculator
        isOpen={showCalculator}
        toggle={() => setShowCalculator(!showCalculator)}
        onConfirm={(result) => {
          console.log('Calculator result:', result);
          // Handle the calculator result here
        }}
      />
    </React.Fragment>
  );
};

export default CashHome;
