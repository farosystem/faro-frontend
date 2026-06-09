export const checkUserPermissions = (
  currentUserRoles = [],
  modulesNeeded = [],
  permissionsNeeded = []
) => {
  // ensure we have an array and guard against missing properties
  if (!Array.isArray(currentUserRoles)) return false;

  return currentUserRoles.some(
    (rol) =>
      Array.isArray(rol?.permisos) &&
      rol.permisos.some(
        (permiso) =>
          modulesNeeded.includes(permiso?.modulo) &&
          permissionsNeeded.some((perm) => permiso?.[perm])
      )
  );
};
