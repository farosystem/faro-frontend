import { useMemo } from 'react';
import ButtonIconTable from './ButtonIconTable';
import { UncontrolledTooltip } from 'reactstrap';
import { useBooking } from '../../Pages/Reception/Availability/NewBooking/context/BookingContext';
import { TipoServicio } from '@/gql/graphql';

interface TableListServiceConfig {
  enableAmount?: boolean;
  enableDelete?: boolean;
  enableEdit?: boolean;
  enableCalendar?: boolean;
  actionDelete?: (...args: any[]) => void;
  actionAmount?: (...args: any[]) => void;
  actionEdit?: (...args: any[]) => void;
  actionCalendar?: (...args: any[]) => void;
}

interface TableListServiceProps {
  headers: string[];
  keys: string[];
  config?: TableListServiceConfig;
  mainKey: string;
  secondKey?: string | undefined;
  type: string;
  amount?: string;
  data?: any[];
  enableAmount?: boolean;
  enableDelete?: boolean;
  actionDelete?: (...args: any[]) => void;
  actionAmount?: (type: any, amount: any, service: any) => void;
  actionEdit?: (data: any, type?: any) => void;
  actionCalendar?: (data: any, type?: any) => void;
}

const TabeListService = ({
  headers,
  keys,
  config = {},
  mainKey,
  secondKey,
  type,
  amount,
  data: propData,
  enableAmount,
  enableDelete,
  actionDelete,
  actionAmount,
  actionEdit,
  actionCalendar
}: TableListServiceProps) => {
  const { state, dispatch } = useBooking();

  // Merge props into config so callers can pass either `config` or top-level props
  const cfg: TableListServiceConfig = {
    ...config,
    enableAmount: enableAmount ?? config.enableAmount,
    enableDelete: enableDelete ?? config.enableDelete,
    enableEdit: (config as any).enableEdit ?? false,
    enableCalendar: (config as any).enableCalendar ?? false,
    actionDelete: actionDelete ?? config.actionDelete,
    actionAmount: actionAmount ?? config.actionAmount,
    actionEdit: actionEdit ?? config.actionEdit,
    actionCalendar: actionCalendar ?? config.actionCalendar
  };

  // If `data` is provided explicitly, use it. Otherwise bind automatically based on `type`.
  const data = useMemo(() => {
    if (Array.isArray(propData)) return propData;

    switch (type) {
      case 'BOOKING':
        return state.selection.extraServices.filter(Boolean);
      case 'ROOM': {
        // Prefer showing services assigned to the currently selected room
        if (state.selection.selectRoom) {
          return (
            (state.selection.servicesPerRoom || [])
              .filter(Boolean)
              .filter(
                (r: any) =>
                  r.room && r.room.numeroHabitacion === state.selection.selectRoom.numeroHabitacion
              )
              .map((r: any) => r.service) || []
          );
        }
        // Fallback to any extraServiceRoom data if no room selected
        return state.selection.extraServiceRoom.filter(Boolean);
      }
      case 'TOUR':
        return state.selection.tours.filter(Boolean);
      default:
        return [];
    }
  }, [state.selection, type, propData]);

  const filteredData = useMemo(() => {
    const services = data || [];
    const filter = state.ui.filter || '';
    if (!filter) return services;
    return services.filter(
      (item) =>
        item.nombre?.toLowerCase().includes(filter.toLowerCase()) ||
        item.descripcion?.toLowerCase().includes(filter.toLowerCase())
    );
  }, [data, state.ui.filter]);

  const handleSearchChange = (e) => {
    dispatch({ type: 'SET_FILTER', payload: e.target.value });
  };

  const onDelete = (element: any) => {
    if (!secondKey) {
      cfg.actionDelete && cfg.actionDelete(element[mainKey]);
    } else {
      cfg.actionDelete && cfg.actionDelete(element[mainKey], element[secondKey as string]);
    }
  };

  const onUpdateAmount = (amount: any, service: any) => {
    cfg.actionAmount && cfg.actionAmount(type, amount, service);
  };

  const onEdit = (element: any) => {
    cfg.actionEdit && cfg.actionEdit(element, type);
  };

  const onCalendar = (element: any) => {
    cfg.actionCalendar && cfg.actionCalendar(element, type);
  };

  return (
    <div className="col table-responsive">
      <table className="table table-hover table-striped mb-0">
        <thead>
          <tr>
            {headers.map((header, index) => (
              <th key={header}>{header}</th>
            ))}
            {cfg.enableAmount && <th key={amount}>{amount}</th>}
            {cfg.enableDelete && (
              <th key="actions" className="text-center">
                Acciones
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {filteredData.map((line, index) => (
            <tr key={index}>
              {keys.map((key, indexKey) => {
                const cellId = `cell-${index}-${indexKey}`;
                return (
                  <td key={cellId} className="hover-cell" id={cellId}>
                    {(() => {
                      const value = line[key];
                      let display = '';
                      let tooltip = '';

                      if (typeof value === 'number') {
                        display = `${value}`;
                        tooltip = display;
                      } else if (value && typeof value === 'object') {
                        // Handle TipoServicio-like objects
                        if (value.cuantificable !== undefined) {
                          display = value.cuantificable ? 'Sí' : 'No';
                          tooltip = JSON.stringify(value);
                        } else if (value.nombre) {
                          display = `${value.nombre}`;
                          tooltip = display;
                        } else {
                          const txt = JSON.stringify(value);
                          display = txt.length > 14 ? `${txt.slice(0, 14)}...` : txt;
                          tooltip = txt;
                        }
                      } else {
                        const txt = (value || '').toString();
                        display = txt.length > 14 ? `${txt.slice(0, 14)}...` : txt;
                        tooltip = txt;
                      }

                      return (
                        <>
                          {display}
                          <UncontrolledTooltip target={cellId}>{tooltip}</UncontrolledTooltip>
                        </>
                      );
                    })()}
                  </td>
                );
              })}
              {cfg.enableAmount && (
                <td>
                  {cfg.enableAmount && (line.tipo as TipoServicio)?.cuantificable === 'true' ? (
                    <div className="col-md-4">
                      <input
                        className="form-control text-center "
                        type="number"
                        id="checkInDate"
                        value={(line as any)?.extra !== undefined ? (line as any)?.extra : 1}
                        onChange={(e) => {
                          onUpdateAmount(e.target.value, line);
                        }}
                        min="0"
                      />
                    </div>
                  ) : (
                    <span>Servicio no es cuantificable.</span>
                  )}
                </td>
              )}
              {(cfg.enableEdit || cfg.enableDelete || cfg.enableCalendar) && (
                <td className="d-flex justify-content-center">
                  {cfg.enableCalendar && (line.tipo as TipoServicio)?.cuantificable === 'true' && (
                    <ButtonIconTable
                      icon="mdi mdi-calendar-range"
                      color="info"
                      onClick={() => {
                        onCalendar(line);
                      }}
                    />
                  )}
                  {cfg.enableEdit && (
                    <ButtonIconTable
                      icon="mdi mdi-pencil"
                      color="warning"
                      onClick={() => onEdit(line)}
                    />
                  )}
                  {cfg.enableDelete && (
                    <ButtonIconTable
                      icon="mdi mdi-delete"
                      color="danger"
                      onClick={() => {
                        onDelete(line);
                      }}
                    />
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TabeListService;
