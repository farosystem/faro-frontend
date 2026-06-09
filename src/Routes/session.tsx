import { ComponentType } from 'react';
import { useQuery } from '@apollo/client';
import { OBTENER_USUARIO_AUTENTICADO } from '@/services/UsuarioService';

// props that will be injected by the HOC
export interface WithSessionProps {
  refetch: () => void;
  session: any;
}

// generic HOC type - P are the props of the wrapped component
function withSession<P extends object>(Component: ComponentType<P & WithSessionProps>) {
  const Wrapped = (props: P) => {
    const { loading, error, data, refetch } = useQuery(OBTENER_USUARIO_AUTENTICADO, {
      pollInterval: 60000
    });

    if (loading) return <p>Cargando...</p>;
    if (error) return null;

    return <Component {...props} refetch={refetch} session={data} />;
  };

  Wrapped.displayName = `withSession(${Component.displayName || Component.name || 'Component'})`;

  return Wrapped;
}

export default withSession;
