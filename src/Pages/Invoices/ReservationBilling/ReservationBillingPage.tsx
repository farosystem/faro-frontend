import { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, CardBody } from 'reactstrap';

import { useQuery } from '@apollo/client';

import { Paquete, Query, Tour } from '@/gql/graphql';
import { OBTENER_PAQUETES } from '@/services/PaquetesService';
import { OBTENER_RESERVA } from '@/services/ReservaService';
import { OBTENER_TOURS } from '@/services/TourService';
import ReservationHeader from './components/Reservation/ReservationHeader';

import { useReservationBillingActions } from './context/reducer/useReservationBillingActions';
import { useReservationBilling } from './hooks/useReservationBilling';
import ReservationSidebar from './components/Reservation/ReservationSidebar';
import SelectionReview from './components/Stepper/SelectionReview';
import InvoiceStepper from './components/Stepper/InvoiceStepper';
import styles from './ReservationBillingPage.module.css';
import { LineaDetalleReservaUI } from '@/lib/seiko-hacienda/core/interfaces/linea-detalle-reserva';

const ReservationBillingPage = () => {
  document.title = 'Facturación Reserva';

  const { id } = useParams();
  const navigate = useNavigate();

  const { data: dataReserva } = useQuery<Query>(OBTENER_RESERVA, {
    variables: { id }
  });

  const reserva = dataReserva?.obtenerReserva || null;

  const { data: dataTours } = useQuery<Query>(OBTENER_TOURS);
  const { data: dataPackages } = useQuery<Query>(OBTENER_PAQUETES);
  const { initialize } = useReservationBillingActions();
  const { lines, selected, rooms, daysUntilCheckin, penaltyRate } = useReservationBilling(reserva);

  const toursMap = useMemo<Record<string, Tour>>(() => {
    const list = dataTours?.obtenerTours || [];

    return list.reduce<Record<string, Tour>>((m, t) => {
      if (t?.id) {
        m[t.id] = t as Tour;
      }
      return m;
    }, {});
  }, [dataTours]);

  const packagesMap = useMemo<Record<string, Paquete>>(() => {
    const list = dataPackages?.obtenerPaquetes || [];

    return list.reduce<Record<string, Paquete>>((m, p) => {
      if (p?.id) {
        m[p.id] = p as Paquete;
      }
      return m;
    }, {});
  }, [dataPackages]);

  useEffect(() => {
    if (dataReserva?.obtenerReserva && lines.length > 0) {
      const reserva = dataReserva.obtenerReserva;

      const uiLines: LineaDetalleReservaUI[] = lines.map((l) => ({
        ...l,
        category: l.category || (l.source === 'room' ? 'Habitaciones' : 'Servicios'),
        source: l.source || 'service',
        reservaHabitacionId: l.reservaHabitacionId || null
      }));

      initialize({
        data: {
          reservation: reserva,
          client: reserva.cliente,
          rooms,
          tours: toursMap,
          packages: packagesMap,
          lines: uiLines
        },
        selection: {
          selectedLineIds: selected,
          modifiedLines: {}
        }
      });
    }
  }, [dataReserva, lines, toursMap, packagesMap, initialize, rooms, selected]);

  const [showStepper, setShowStepper] = useState(true);

  useEffect(() => {
    if (!showStepper) return;
    const t = window.setTimeout(() => {
      try {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        const el = document.querySelector(`.${styles.infoCard}`);
        if (el && typeof el.scrollIntoView === 'function')
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } catch (e) {
        // ignore
      }
    }, 50);

    return () => clearTimeout(t);
  }, [showStepper]);

  return (
    <div className={`${styles.page} page-content`}>
      <Container fluid>
        {/* <div className={styles.breadcrumbs}>
          <Breadcrumbs title="Facturación" breadcrumbItem="Facturación Reserva" />
        </div> */}

        <ReservationHeader
          reserva={reserva}
          onBack={() => navigate('/reception/availability/booking')}
        />

        <Row>
          <Col md={9}>
            {showStepper ? (
              <InvoiceStepper
                isOpen={showStepper}
                onClose={() => setShowStepper(false)}
                onCreateInvoiceSuccess={(payload) => {
                  console.log('Invoice created', payload);
                }}
              />
            ) : (
              <Card className={`${styles.infoCard} mb-3`}>
                <CardBody className={styles.cardBodyCompact}>
                  <SelectionReview />
                </CardBody>
              </Card>
            )}
          </Col>

          <Col md={3}>
            <div className={styles.sidebar}>
              <ReservationSidebar daysUntilCheckin={daysUntilCheckin} penaltyRate={penaltyRate} />

              <Card className={`${styles.infoCard} mt-3`}>
                <CardBody className={styles.cardBodyCompact}>
                  <h6 className={`${styles.sectionTitle}`}>Historial</h6>
                  <div className="text-muted small">No hay facturas registradas</div>
                </CardBody>
              </Card>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ReservationBillingPage;
