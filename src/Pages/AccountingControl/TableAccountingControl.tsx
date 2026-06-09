import { Link } from 'react-router-dom';

import withRouter from '@/components/Common/withRouter';
import ButtonIconTable from '@/components/Common/ButtonIconTable';
import { getFechaTable, getFechaTZ } from '@/helpers/helpers';

const TableAccountingControl = ({ ...props }) => {
  const { data, onDelete, view } = props;

  const onClickDelete = async (id, nombre) => {
    await onDelete(id, nombre);
  };

  const getSupplierValue = (item) => {
    if (item.usuario !== null) {
      return item.usuario.nombre;
    }
    if (item.cliente !== null) {
      return item.cliente.nombre;
    }
    if (item.proveedor !== null) {
      return item.proveedor.empresa;
    }
    return '';
  };

  const getReferenceValue = (item) => {
    const model = item.referenciaModelo?.toString() ?? '';
    const name = item.referenciaNombre?.toString() ?? '';
    const id = item.referenciaID?.toString() ?? '';

    const parts = [];
    if (model) parts.push(model);
    if (name) parts.push(name);
    // if (id) parts.push(`ID: ${id}`);

    return parts.length ? parts.join(' • ') : '-';
  };

  const formatDateTime = (value: string | null | undefined) => {
    if (!value) return '';
    // display date + time (hour/minute) in Costa Rica timezone
    return getFechaTZ('fechaHora', value) || getFechaTable(value);
  };

  const formatPaymentDate = (value: string | null | undefined) => {
    if (!value) return '-';
    return getFechaTZ('fechaHora', value) || getFechaTable(value);
  };

  return (
    <div className="table-responsive mb-3">
      <table className="table table-hover table-striped mb-0">
        <thead>
          <tr>
            <th>Identificador</th>
            <th>Referencia</th>
            {view === 'TODOS' && <th>Tipo cuenta</th>}
            <th>Titular</th>
            <th>Registro</th>
            <th>Pago</th>
            <th>Estado</th>
            <th>Monto</th>
            <th>Tipo pago</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {data.map((accounting, i) => (
            <tr key={`Customer-${i}`}>
              <td>{accounting.consecutivo ? accounting.consecutivo.consecutivo : ''}</td>
              <td>{getReferenceValue(accounting)}</td>
              {view === 'TODOS' && <td>{accounting.tipoRegistroContable}</td>}
              <td>{getSupplierValue(accounting)}</td>
              <td>{formatDateTime(accounting.fechaRegistro)}</td>
              <td>{formatPaymentDate(accounting.fechaPago)}</td>
              <td>{accounting.estadoRegistroContable}</td>
              <td>₡{accounting.monto}</td>
              <td>{accounting.tipoPago ? accounting.tipoPago : 'PENDIENTE'}</td>
              <td>
                <div className="d-flex justify-content-end mx-1 my-1">
                  <Link
                    to={`/editaccountingcontrol/${accounting.tipoRegistroContable}/${accounting.id}`}
                  >
                    <ButtonIconTable icon="mdi mdi-pencil" color="warning" />
                  </Link>

                  <ButtonIconTable
                    icon="mdi mdi-delete"
                    color="danger"
                    onClick={() => {
                      onClickDelete(accounting.id, accounting.tipoRegistroContable);
                    }}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default withRouter(TableAccountingControl);
