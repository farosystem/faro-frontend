import { render, screen, waitFor, fireEvent } from '@testing-library/react';

// mock sweetalert helper so it doesn't try to do DOM operations
vi.mock('@/helpers/alert', () => ({
  showInfoAlert: vi.fn(),
  showConfirmAlert: vi.fn().mockResolvedValue(true)
}));
import { showInfoAlert, showConfirmAlert } from '@/helpers/alert';
import { MockedProvider } from '@apollo/client/testing';
import {
  OBTENER_ACTIVIDADES_ECONOMICAS,
  INSERTAR_ACTIVIDAD_ECONOMICA
} from '@/services/MovimientosRestauranteService';
import { UPSERT_FACTURAS_PARAMETRO } from '@/services/FacturasParametrosService';
import { OBTENER_FACTURAS_PARAMETROS } from '@/services/FacturasParametrosService';
import InvoiceCompany from './Company';
import { Provider } from 'react-redux';
import { configureStore } from '../../../store/store';
import { BrowserRouter } from 'react-router-dom';

// simple smoke test for the actividad económica dropdown
it('loads and displays economic activities in the select', async () => {
  const mocks = [
    {
      request: { query: OBTENER_ACTIVIDADES_ECONOMICAS },
      result: {
        data: {
          obtenerActividadesEconomicas: [{ _id: '1', codigo: '123', descripcion: 'Some activity' }]
        }
      }
    },
    {
      request: { query: OBTENER_FACTURAS_PARAMETROS },
      result: {
        data: {
          obtenerFacturasParametros: [{ id: '10', type: 'actividad_economica', value: '123' }]
        }
      }
    },
    {
      request: {
        query: UPSERT_FACTURAS_PARAMETRO,
        variables: { type: 'actividad_economica', value: '123' }
      },
      result: {
        data: {
          upsertFacturasParametro: { id: '10', type: 'actividad_economica', value: '123' }
        }
      }
    },
    {
      request: {
        query: INSERTAR_ACTIVIDAD_ECONOMICA,
        variables: {
          input: {
            codigo: '999',
            descripcion: 'New activity',
            codigoSubclaseTribu: '',
            descripcionSubclaseTribu: ''
          }
        } as any
      },
      result: {
        data: {
          insertarActividadEconomica: {
            estado: true,
            message: 'Creado',
            data: { _id: '2', codigo: '999', descripcion: 'New activity' }
          }
        } as any
      }
    },
    {
      request: {
        query: UPSERT_FACTURAS_PARAMETRO,
        variables: { type: 'actividad_economica', value: '999' }
      },
      result: {
        data: {
          upsertFacturasParametro: { id: '11', type: 'actividad_economica', value: '999' }
        }
      }
    }
  ];

  // render inside redux store and router like the real app
  render(
    <Provider store={configureStore({})}>
      <MockedProvider mocks={mocks} addTypename={false}>
        <BrowserRouter>
          <InvoiceCompany />
        </BrowserRouter>
      </MockedProvider>
    </Provider>
  );

  // wait until the activity chip appears and loading has completed
  await waitFor(() => screen.getByText('123'));
  expect(screen.getByText('123')).toBeInTheDocument();
  expect(screen.getByText('Some activity')).toBeInTheDocument();
  // parameter exists so selectedActividad should be set; check save button shows up

  // select an activity so the user has an active selection
  fireEvent.click(screen.getByText('123'));

  // now create a new activity using the form
  const newBtn = screen.getByText(/Nueva actividad/i);
  fireEvent.click(newBtn);
  let codeInput = screen.getAllByRole('textbox').slice(-2)[0];
  let descInput = screen.getAllByRole('textbox').slice(-1)[0];
  fireEvent.change(codeInput, { target: { value: '999' } });
  // after changed, re-query for latest inputs in case DOM updated
  descInput = screen.getAllByRole('textbox').slice(-1)[0];
  fireEvent.change(descInput, { target: { value: 'New activity' } });
  // after typing values the save button should become enabled
  await waitFor(() => {
    const buttons = screen.getAllByRole('button', { name: /Guardar/i });
    expect(buttons[0]).toBeEnabled();
  });
  const saveNew = screen.getAllByRole('button', { name: /Guardar/i })[0];
  fireEvent.click(saveNew);
  // confirm alert should be called for creation
  await waitFor(() =>
    expect(showInfoAlert).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'Actividad económica creada' })
    )
  );
});
