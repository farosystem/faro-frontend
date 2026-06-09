import React from 'react';
import withRouter from '../../components/Common/withRouter';

const TableInvoicesParameters = ({ ...props }) => {
  const { data, mode } = props;

  return (
    <div className="table-responsive mb-3">
      <table className="table table-hover table-striped mb-0">
        <thead>
          <tr>
            <th>Descripción</th>
            <th>Valor</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data.map((invoice, i) => (
            <tr key={`invoicesParameters-${i}`}>
              <td>{invoice.type}</td>
              <td>{invoice.value}</td>
              <td></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default withRouter(TableInvoicesParameters);
