import React, { useState } from 'react';
import withRouter from '../../../components/Common/withRouter';
import ButtonIconTable from '../../../components/Common/ButtonIconTable';
import { Link } from 'react-router-dom';

const TableCashRegisters = ({ ...props }) => {
  const { data, onDelete } = props;

  const onClickDelete = async (id, numero) => {
    await onDelete(id, numero);
  };

  return (
    <div className="table-responsive mb-3">
      <table className="table table-hover table-striped mb-0">
        <thead>
          <tr>
            <th>Código</th>
            <th>Nombre</th>
            <th>Número</th>
            <th>Estado</th>
            <th>Módulo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data && data.length > 0 ? (
            data.map((cashRegister, i) => (
              <tr key={`cashRegister-${i}`}>
                <td>{cashRegister.codigo}</td>
                <td>{cashRegister.nombre}</td>
                <td>{cashRegister.numero}</td>
                <td>
                  {cashRegister.estado === 'CIERRE_PARCIAL'
                    ? 'Cierre Parcial'
                    : cashRegister.estado}
                </td>
                <td>
                  {cashRegister.modulo === 'Punto_Venta'
                    ? 'Punto de Venta'
                    : cashRegister.modulo === 'Sin_definir'
                      ? 'Sin definir'
                      : cashRegister.modulo}
                </td>
                <td>
                  <div className="d-flex">
                    <Link to={`/editcashregister/${cashRegister.id}`}>
                      <ButtonIconTable icon="mdi mdi-pencil" color="warning" />
                    </Link>
                    {cashRegister.estado !== 'INACTIVA' && (
                      <ButtonIconTable
                        icon="mdi mdi-delete"
                        color="danger"
                        onClick={() => onClickDelete(cashRegister.id, cashRegister.nombre)}
                      />
                    )}
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center">
                No hay registros disponibles
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default withRouter(TableCashRegisters);
