import { useRef } from 'react';
import { Button, Label, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { useYupValidationResolver } from '../../helpers/yupValidations';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { useMutation } from '@apollo/client';
import { COMPROBAR_USUARIO } from '../../services/UsuarioService';
import Swal from 'sweetalert2';
import { checkUserPermissions } from '../../helpers/roles';

const validationSchema = yup.object({
  user: yup.string().required('Campo requerido'),
  password: yup.string().required('Campo requerido')
});

interface RequestPermissionsProps {
  modalOpen: boolean;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onSuccessConfirmation?: (user: any) => void;
  modules: string[];
  permissions: string[];
  enableConfirmationMessage?: boolean;
  confirmationMessage?: string; // optional custom text shown on success
}

const RequestPermissions = ({
  modalOpen,
  setModalOpen,
  onSuccessConfirmation,
  modules,
  permissions,
  enableConfirmationMessage,
  confirmationMessage // optional custom text shown on success
}: RequestPermissionsProps) => {
  const formRef = useRef(null);

  const [comprobarUsuario] = useMutation(COMPROBAR_USUARIO);

  const resolver = useYupValidationResolver(validationSchema);
  const {
    register,
    handleSubmit,
    reset: resetForm,
    formState: { errors }
  } = useForm<{ user: string; password: string }>({
    resolver
  });

  //comprobarUsuario

  const onSubmit = async (data) => {
    const userFound = await comprobarUsuario({
      variables: { cedula: data.user, clave: data.password }
    });
    if (userFound) {
      const currentUser = userFound?.data?.comprobarUsuario;
      const isAllowed = checkUserPermissions(currentUser?.roles || [], modules, permissions);
      if (isAllowed) {
        onSuccessConfirmation?.(currentUser);
        setModalOpen(false);
        resetForm();
        enableConfirmationMessage &&
          Swal.fire({
            icon: 'success',
            title: 'Autorización exitosa',
            text: confirmationMessage
              ? confirmationMessage
              : 'El usuario ingresado cuenta con los permisos necesarios para realizar esta acción'
          });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'El usuario no existe o no cuenta con los permisos para realizar esta acción'
        });
      }
    }
  };

  return (
    <Modal
      isOpen={modalOpen}
      toggle={() => {
        setModalOpen(false);
        resetForm();
      }}
    >
      <ModalHeader
        toggle={() => {
          setModalOpen(false);
          resetForm();
        }}
      >
        Se requiere permiso para realizar el cambio
      </ModalHeader>
      <ModalBody>
        <form ref={formRef} className="needs-validation" onSubmit={handleSubmit(onSubmit)}>
          <Label for="user">Usuario</Label>
          <input {...register('user')} className="form-control" id="user" />
          {errors?.user && <p className="errorMessage">{errors.user.message as React.ReactNode}</p>}
          <Label for="password" className="mt-3">
            Contraseña
          </Label>
          <input {...register('password')} className="form-control" type="password" id="password" />
          {errors?.password && (
            <p className="errorMessage">{errors.password.message as React.ReactNode}</p>
          )}
        </form>
      </ModalBody>
      <ModalFooter>
        <Button
          color="secondary"
          onClick={() => {
            setModalOpen(false);
            resetForm();
          }}
        >
          Cancelar
        </Button>
        <Button
          color="primary"
          onClick={() => {
            const triggerSubmit = handleSubmit(onSubmit);
            triggerSubmit();
          }}
          disabled={!!(errors?.['user'] || errors?.['password'])}
        >
          Autorizar
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default RequestPermissions;
