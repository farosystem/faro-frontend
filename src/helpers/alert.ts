import Swal, { SweetAlertIcon, SweetAlertPosition } from 'sweetalert2';

export type sweetAlertIcon = 'success' | 'error' | 'warning' | 'info' | 'question';

const AppAlert = Swal.mixin({
  confirmButtonColor: '#0BB197',
  cancelButtonColor: '#FF3D60',
  cancelButtonText: 'Cancelar',
  showClass: {
    popup: 'animate__animated animate__fadeIn animate__faster'
  },
  hideClass: {
    popup: 'animate__animated animate__fadeOut animate__faster'
  }
});

interface BaseAlertParams {
  title: string;
  text?: string;
}

interface InfoAlertParams extends BaseAlertParams {
  icon?: SweetAlertIcon;
  timer?: number;
  position?: SweetAlertPosition;
}

interface ConfirmAlertParams extends BaseAlertParams {
  confirmButtonText?: string;
  icon?: SweetAlertIcon;
  dangerMode?: boolean;
}

interface InputAlertParams extends ConfirmAlertParams {
  inputPlaceholder?: string;
}

export const showInfoAlert = ({
  title,
  text,
  icon = 'info',
  timer,
  position = 'center'
}: InfoAlertParams) => {
  return AppAlert.fire({
    title,
    text,
    icon,
    timer,
    timerProgressBar: !!timer,
    position,
    showConfirmButton: !timer // Oculta el botón si hay un timer
  });
};

/**
 * Alerta de confirmación (Devuelve un boolean para simplificar la lógica en el componente)
 */
export const showConfirmAlert = async ({
  title,
  text,
  confirmButtonText = 'Aceptar',
  icon = 'warning',
  dangerMode = false
}: ConfirmAlertParams): Promise<boolean> => {
  const result = await AppAlert.fire({
    title,
    text,
    icon,
    showCancelButton: true,
    confirmButtonText,
    confirmButtonColor: dangerMode ? '#FF3D60' : '#0BB197' // Invierte colores si es destructivo
  });

  return result.isConfirmed;
};

// backwards-compatible positional confirm alert
export const confirmAlert = async (
  title: string,
  message: string,
  icon: SweetAlertIcon,
  confirmButtonText: string = 'Aceptar',
  cancelButtonText: string = 'Cancelar',
  position: SweetAlertPosition = 'center',
  callback?: () => void
) => {
  const result = await AppAlert.fire({
    title,
    text: message,
    icon,
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText,
    cancelButtonText,
    position
  });
  if (result.isConfirmed && callback) callback();
};

/**
 * Alerta con Input de texto (Devuelve el valor o undefined si cancela)
 */
export const showInputAlert = async ({
  title,
  text,
  confirmButtonText = 'Guardar',
  inputPlaceholder = ''
}: InputAlertParams): Promise<string | undefined> => {
  const result = await AppAlert.fire({
    title,
    text,
    icon: 'question',
    input: 'text',
    inputPlaceholder,
    inputAttributes: { autocapitalize: 'off' },
    showCancelButton: true,
    confirmButtonText
  });

  return result.isConfirmed ? result.value : undefined;
};

/**
 * Simple wrapper for a confirmation dialog with default text suitable for generic use.
 * Returns true if user confirmed, false otherwise.
 */
export const showSweetConfirmation = async (
  title: string,
  text: string,
  confirmButtonText: string = 'Aceptar',
  icon: SweetAlertIcon = 'question'
): Promise<boolean> => {
  return showConfirmAlert({
    title,
    text,
    icon,
    confirmButtonText
  });
};

export interface RequestConfirmationParams {
  title: string;
  bodyText: string;
  confirmButtonText?: string;
  confirmationEvent?: () => void;
  CancelEvent?: () => void;
  showCancelEvent?: boolean;
  blockConfirmAlert?: boolean;
}

export const requestConfirmationAlert = (params: RequestConfirmationParams) => {
  const {
    title,
    bodyText,
    confirmButtonText,
    confirmationEvent,
    CancelEvent,
    showCancelEvent,
    blockConfirmAlert
  } = params;

  AppAlert.fire({
    title: title,
    text: bodyText,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText,
    cancelButtonText: 'Cancelar'
  }).then(async (result) => {
    if (result.isConfirmed) {
      confirmationEvent?.();
      if (blockConfirmAlert) Swal.fire('Guardado!', 'Los cambios han sido guardados.', 'success');
    } else {
      if (showCancelEvent) {
        CancelEvent?.();
        Swal.fire('Cancelado', 'Los cambios no se guardaron.', 'info');
      }
    }
  });
};

export interface RequestConfirmationAsyncParams extends RequestConfirmationParams {
  asyncConfirmationEvent?: () => Promise<void>;
  omitSuccessAlert?: boolean;
}

export const requestConfirmationAlertAsync = (params: RequestConfirmationAsyncParams) => {
  const {
    title,
    bodyText,
    confirmButtonText,
    confirmationEvent,
    asyncConfirmationEvent,
    CancelEvent,
    showCancelEvent,
    omitSuccessAlert
  } = params;

  AppAlert.fire({
    title: title,
    text: bodyText,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText,
    cancelButtonText: 'Cancelar',
    preConfirm: async () => {
      try {
        await asyncConfirmationEvent?.();
      } catch (error) {
        Swal.fire('Cancelado', 'Los cambios no se guardaron.', 'info');
      }
    }
  }).then(async (result) => {
    if (result.isConfirmed) {
      confirmationEvent?.();
      !omitSuccessAlert && Swal.fire('Guardado!', 'Los cambios han sido guardados.', 'success');
    } else {
      if (showCancelEvent) {
        CancelEvent?.();
        Swal.fire('Cancelado', 'Los cambios no se guardaron.', 'info');
      }
    }
  });
};
