# Integración ORBE - Control de Disponibilidad

## Descripción

Esta actualización agrega funcionalidad completa para gestionar la disponibilidad de habitaciones a través del Channel Manager ORBE directamente desde el sistema FARO.

## Funcionalidades Agregadas

### 1. Servicio ORBE (`OrbeService.js`)

Servicio centralizado para manejar todas las operaciones con la API ORBE:

- **`updateAvailability()`**: Actualiza disponibilidad de habitaciones
- **`acknowledgeReservation()`**: Envía notificación de reconocimiento de reservas
- **`getReservations()`**: Obtiene lista de reservas desde ORBE

### 2. Control de Disponibilidad en ChannelBookingForm

#### Características:

- **Formulario de Disponibilidad**:

  - Campo para tipo de habitación (pre-poblado desde la reserva)
  - Selector de fecha (pre-poblado con fecha de llegada)
  - Campo numérico para cantidad de habitaciones
  - Selector de estado (Abierto/Cerrado)

- **Validaciones**:

  - Verificación de campos requeridos
  - Modal de confirmación para acciones críticas
  - Manejo de errores con mensajes informativos

- **Estados Visuales**:
  - Spinner durante procesamiento
  - Alertas de éxito/error
  - Badges de estado actual

### 3. Reconocimiento Automático de Reservas

- El cambio de estado de notificación envía automáticamente el reconocimiento a ORBE
- Feedback visual del resultado de la operación

## Estructura de Archivos

```
src/
├── services/
│   └── OrbeService.js                 # Servicio centralizado para ORBE
└── Pages/Reception/ListBooking/
    └── (components)/channel-manager/
        └── ChannelBookingForm.js      # Componente actualizado con control de disponibilidad
```

## API Endpoints Utilizados

### Backend (FARO_API)

- `POST /api/orbe/availability` - Actualizar disponibilidad
- `POST /api/orbe/notifications` - Enviar notificaciones de reconocimiento
- `GET /api/orbe/reservations` - Obtener reservas

### Configuración Requerida

Las siguientes variables de entorno deben estar configuradas en el backend:

```env
ORBE_USERNAME=tu_usuario_orbe
ORBE_PASSWORD=tu_contraseña_orbe
ORBE_HOTEL_CODE=tu_codigo_hotel
```

## Uso

### 1. Acceder al Control de Disponibilidad

1. Navegar a **Recepción > Lista de Reservas**
2. Seleccionar una reserva del Channel Manager ORBE
3. El formulario de edición incluirá la sección "Control de Disponibilidad ORBE"

### 2. Actualizar Disponibilidad

1. **Configurar parámetros**:

   - Verificar/modificar el tipo de habitación
   - Seleccionar la fecha deseada
   - Establecer la cantidad de habitaciones disponibles
   - Elegir el estado (Abierto/Cerrado)

2. **Ejecutar actualización**:
   - Hacer clic en "Actualizar"
   - Confirmar la acción en el modal
   - Aguardar confirmación de éxito

### 3. Cambiar Estado de Reconocimiento

1. En la sección "Estado de Notificación"
2. Seleccionar entre "Reserva Recibida" o "Pendiente de Procesar"
3. El cambio se envía automáticamente a ORBE

## Mensajes de Estado

### Éxito

- ✅ "Disponibilidad actualizada exitosamente en ORBE"
- ✅ "Estado de reconocimiento actualizado exitosamente en ORBE"

### Errores Comunes

- ❌ "Por favor complete todos los campos requeridos"
- ❌ "Error de comunicación con ORBE"
- ❌ "Timeout en la conexión con ORBE"
- ❌ "Datos inválidos proporcionados"

## Consideraciones Técnicas

### Seguridad

- Validación de datos tanto en frontend como backend
- Manejo seguro de credenciales ORBE
- Timeouts configurados para evitar bloqueos

### Performance

- Llamadas asíncronas que no bloquean la UI
- Indicadores visuales de progreso
- Manejo de errores robusto

### UX/UI

- Confirmaciones para acciones críticas
- Feedback inmediato de resultados
- Estados de carga claros
- Información contextual en alertas

## Troubleshooting

### Problema: "Error de conexión con el servidor"

**Solución**: Verificar que el backend esté ejecutándose en `http://localhost:4000`

### Problema: "Error de comunicación con ORBE"

**Solución**:

1. Verificar credenciales ORBE en variables de entorno
2. Comprobar conectividad a `https://capi.orbebooking.com`

### Problema: "Datos inválidos proporcionados"

**Solución**: Verificar formato de fecha (YYYY-MM-DD) y que quantity sea numérico

## Próximas Mejoras

- [ ] Historial de cambios de disponibilidad
- [ ] Actualizaciones por rango de fechas
- [ ] Sincronización bidireccional automática
- [ ] Dashboard de disponibilidad en tiempo real
