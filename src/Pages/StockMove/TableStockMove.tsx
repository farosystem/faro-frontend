import withRouter from '@/components/Common/withRouter';
import { getFechaTable } from '@/helpers/helpers';

const TableStockMove = ({ ...props }) => {
  const { data } = props;

  const moneda = {
    'US Dollar': '$',
    Colón: '₡',
    Yen: '¥'
  };

  return (
    <div className="table-responsive mb-3">
      <table className="table table-hover table-striped mb-0">
        <thead>
          <tr>
            <th></th>
            <th>Lote / Platillo</th>
            <th>Proveedor / Cliente</th>
            <th>Cantidad</th>
            <th>Precio unidad</th>
            <th>Total</th>
            <th>Almacén</th>
            <th>Fecha de registro</th>
          </tr>
        </thead>
        <tbody>
          {data.map((move, i) => {
            const lote = move.lote?.toString() ?? '';
            const isAnulacion = lote.toLowerCase().includes('anulacion');

            return (
              <tr key={`move-${i}`} className={isAnulacion ? 'table-secondary' : ''}>
                <td>
                  <span
                    className={`badge ${
                      isAnulacion
                        ? 'bg-warning text-dark'
                        : move.tipo === 'ENTRADA'
                          ? 'bg-success'
                          : 'bg-danger'
                    } me-2`}
                  >
                    {isAnulacion ? 'ANULACION' : move.tipo === 'ENTRADA' ? 'ENTRADA' : 'SALIDA'}
                  </span>
                  {!isAnulacion &&
                    (move.tipo === 'ENTRADA' ? (
                      <i className="mdi mdi-plus align-middle" style={{ color: '#0AC074' }}></i>
                    ) : (
                      <i className="mdi mdi-minus align-middle" style={{ color: '#FF3D60' }}></i>
                    ))}
                  {isAnulacion && (
                    <i
                      className="mdi mdi-alert-circle align-middle"
                      style={{ color: '#FFC107' }}
                    ></i>
                  )}
                </td>
                <td>
                  {isAnulacion ? <span className="font-weight-bold">{lote}</span> : lote || '-'}
                </td>
                <td>
                  {isAnulacion ? (
                    <span className="text-muted">Sistema (Annulation)</span>
                  ) : move.cedido === null || move.cedido === false ? (
                    <span>{move.proveedor ? move.proveedor.empresa : 'No especificado'}</span>
                  ) : (
                    <span>{move.cliente ? move.cliente.nombre : 'No especificado'}</span>
                  )}
                </td>
                <td>{move.cantidad ?? ''}</td>
                {isAnulacion ? (
                  <>
                    <td>-</td>
                    <td className="text-danger">
                      <strong>{move.cantidad ? `-${move.cantidad}` : '-'}</strong>
                    </td>
                  </>
                ) : move.tipo === 'ENTRADA' ? (
                  <>
                    <td>{`₡${move.precio_unidad}`}</td>
                    <td>{`₡${move.precio}`}</td>
                  </>
                ) : (
                  <>
                    <td></td>
                    <td></td>
                  </>
                )}
                <td>{isAnulacion ? '-' : move.almacen?.nombre || ''}</td>
                <td>{getFechaTable(move.fecha)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default withRouter(TableStockMove);
