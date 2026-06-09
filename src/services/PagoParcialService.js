import { gql } from '@apollo/client';

export const GUARDAR_PAGO_PARCIAL = gql`
  mutation insertarPagoParcial($input: PagoParcialInput) {
    insertarPagoParcial(input: $input) {
      estado
      message
    }
  }
`;
