import { useQuery } from '@apollo/client';
import { usePackage } from '../context/PackageContext';
import { OBTENER_PAQUETE, OBTENER_PAQUETES } from '@/services/PaquetesService';

export const usePackageCatalog = ({ id }: { id?: string }) => {
  const { dispatch } = usePackage();

  const {
    data: pkgData,
    loading: loadingPackage,
    error: errorPkg
  } = useQuery(OBTENER_PAQUETE, { variables: { id }, pollInterval: 1000 });

  const {
    data: packagesData,
    loading: loadingPackages,
    error: errorPackages
  } = useQuery(OBTENER_PAQUETES);

  // Normaliza según nombre real del campo GraphQL. Ajusta si tu query usa otros nombres.
  const pkg = pkgData?.obtenerPaquete ?? pkgData?.package ?? pkgData ?? null;
  const packages = Array.isArray(packagesData?.obtenerPaquetes)
    ? packagesData.obtenerPaquetes
    : Array.isArray(packagesData?.packages)
      ? packagesData.packages
      : Array.isArray(packagesData)
        ? packagesData
        : [];

  // Fallback: si no encontramos el paquete por la query individual, o la query retorna un paquete vacío,
  // intentar obtenerlo de la lista completa por id
  let finalPkg = pkg;

  const isEmptyPkg = (p) => !p || p.nombre == null || p.nombre === '';

  if (isEmptyPkg(finalPkg) && id && Array.isArray(packages)) {
    const found = packages.find((p) => p.id === id);
    if (found) {
      finalPkg = found;
    }
  }

  return {
    loading: loadingPackage || loadingPackages,
    packages: packages,
    package: finalPkg,
    error: errorPkg ?? errorPackages
  };
};
