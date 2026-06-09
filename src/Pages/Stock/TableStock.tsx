import { Link } from 'react-router-dom';
import withRouter from '@/components/Common/withRouter';
import ButtonIconTable from '@/components/Common/ButtonIconTable';
import { calculateStockMovements } from '@/helpers/helpers';

interface StockItem {
  materia_prima: {
    id: string;
    nombre: string;
    unidad: string;
    tipo: string;
  };
  movimientos?: any[];
}

interface TableStockProps {
  data: StockItem[];
}

const getStockBadge = (stock: number) => {
  if (stock <= 0) {
    return <span className="badge bg-danger">Sin stock</span>;
  }
  if (stock <= 5) {
    return <span className="badge bg-warning text-dark">Stock bajo</span>;
  }
  return <span className="badge bg-success">Stock OK</span>;
};

const TableStock = ({ data }: TableStockProps) => {
  return (
    <div className="table-responsive mb-3">
      <table className="table table-hover table-striped mb-0">
        <thead>
          <tr>
            <th>Nombre</th>
            {/* <th>País</th> */}
            <th>Existencias</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {data.map((product, i) => {
            const stock = calculateStockMovements(
              Array.isArray(product.movimientos) ? product.movimientos : []
            );

            return (
              <tr key={`product-${i}`}>
                <td>{product.materia_prima.nombre}</td>
                {/* <td>{product.materia_prima.pais}</td> */}
                <td>
                  <div className="d-flex align-items-center gap-2">
                    <span>
                      {stock} {product.materia_prima.unidad}
                    </span>
                    {getStockBadge(stock)}
                  </div>
                </td>
                <td>
                  <div className="d-flex">
                    <Link
                      to={`/product/movements/${product.materia_prima.tipo}/${product.materia_prima.nombre}/${product.materia_prima.id}`}
                    >
                      <button
                        type="button"
                        className="me-2 btn btn-outline-secondary waves-effect waves-light"
                      >
                        Movimientos <i className="mdi mdi-swap-horizontal ms-2"></i>
                      </button>
                    </Link>
                    <Link
                      to={`/editproduct/${product.materia_prima.tipo}/${product.materia_prima.id}`}
                    >
                      <ButtonIconTable icon="mdi mdi-pencil" color="warning" />
                    </Link>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default withRouter(TableStock);
