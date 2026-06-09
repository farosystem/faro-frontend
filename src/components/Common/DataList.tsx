import { useCallback, useEffect, useState } from 'react';
import DataListPagination from './DataListPagination';
import TableAccountingControl from '@/Pages/AccountingControl/TableAccountingControl';
import TableAssets from '@/Pages/Assets/TableAssets';
import TableAssetMove from '@/Pages/AssetsMove/TableAssetMove';
import TableCleaningJobs from '@/Pages/CleaningJobs/TableCleaningJobs';
import TableCleanlinessCheck from '@/Pages/CleanlinessCheck/TableCleanlinessCheck';
import TableCustomers from '@/Pages/Customers/TableCustomers';
import TableCashRegisters from '@/Pages/GeneralSettings/CashRegister/TableCashRegisters';
import TableDishType from '@/Pages/GeneralSettings/DishType/TableDishType';
import TableFloors from '@/Pages/GeneralSettings/Floors/TableFloors';
import TablePackage from '@/Pages/GeneralSettings/Hotel/AdminPackage/TablePackage';
import TableAmenities from '@/Pages/GeneralSettings/Hotel/Amenities/TableAmenities';
import TableExternalService from '@/Pages/GeneralSettings/Hotel/ExternalService/TableExternalService';
import TableExtraService from '@/Pages/GeneralSettings/Hotel/ExtraService/TableExtraService';
import TableItems from '@/Pages/GeneralSettings/Hotel/Items/TableItems';
import TableOperativeAreas from '@/Pages/GeneralSettings/Hotel/OperativeAreas/TableOperativeAreas';
import TableRooms from '@/Pages/GeneralSettings/Hotel/Rooms/TableRooms';
import TableSeason from '@/Pages/GeneralSettings/Hotel/Season/TableSeason';
import TableTypeRoomSeason from '@/Pages/GeneralSettings/Hotel/Season/TableTypeRoomSeason';
import TableTours from '@/Pages/GeneralSettings/Hotel/Tours/TableTours';
import TableTypeRoom from '@/Pages/GeneralSettings/Hotel/TypeRoom/TableTypeRoom';
import TableTypeService from '@/Pages/GeneralSettings/Hotel/TypeService/TableTypeService';
import TableLocations from '@/Pages/GeneralSettings/Locations/TableLocations';
import TableMenuType from '@/Pages/GeneralSettings/MenuType/TableMenuType';
import TablePaymentMethod from '@/Pages/GeneralSettings/PaymentMethod/TablePaymentMethod';
import TableRoles from '@/Pages/GeneralSettings/Roles/TableRoles';
import TableSupplyType from '@/Pages/GeneralSettings/SupplyType/TableSupplyType';
import TableTables from '@/Pages/GeneralSettings/Tables/TableTables';
import TableUsers from '@/Pages/GeneralSettings/Users/TableUsers';
import TableInternTransfers from '@/Pages/InternTransfers/TableInternTransfers';
import TableInvoicesIssued from '@/Pages/Invoices/TableInvoicesIssued';
import TableInvoicesParameters from '@/Pages/Invoices/TableInvoicesParameters';
import TableProductsReception from '@/Pages/ProductsReception/TableProductsReception';
import TablePurchaseOrder from '@/Pages/PurchaseOrders/TablePurchaseOrder';
import TableNotes from '@/Pages/Reception/Availability/NewBooking/components/Notes/TableNotes';
import TableDataTypeRoom from '@/Pages/Reception/Availability/NewBooking/components/TableDataTypeRoom';
import TableMenu from '@/Pages/Restaurant/Menu/TableMenu';
import TableOrders from '@/Pages/Restaurant/Orders/TableOrders';
import TableStock from '@/Pages/Stock/TableStock';
import TableStockMove from '@/Pages/StockMove/TableStockMove';
import TableSuppliers from '@/Pages/Suppliers/TableSuppliers';
import TableTaxManagement from '@/Pages/TaxManagement/TableTaxManagement';
import TableWarehouseLines from '@/Pages/Warehouses/TableWarehouseLines';
import TableWarehouses from '@/Pages/Warehouses/TableWarehouses';
import TableDate from './TableDate';

// 1. Crea un mapa/diccionario fuera del componente
const TableComponentsMap = {
  customers: TableCustomers,
  suppliers: TableSuppliers,
  purchaseOrders: TablePurchaseOrder,
  accountingControl: TableAccountingControl,
  productsReception: TableProductsReception,
  stock: TableStock,
  warehouses: TableWarehouses,
  warehouseLines: TableWarehouseLines,
  stockMove: TableStockMove,
  menu: TableMenu,
  cleaningJobs: TableCleaningJobs,
  taxManagement: TableTaxManagement,
  users: TableUsers,
  roles: TableRoles,
  SupplyType: TableSupplyType,
  locations: TableLocations,
  cleanlinessChecks: TableCleanlinessCheck,
  internTransfers: TableInternTransfers,
  assets: TableAssets,
  assetMove: TableAssetMove,
  typeroom: TableTypeRoom,
  amenities: TableAmenities,
  extraservice: TableExtraService,
  externalservice: TableExternalService,
  rooms: TableRooms,
  season: TableSeason,
  package: TablePackage,
  tour: TableTours,
  typservice: TableTypeService,
  operativearea: TableOperativeAreas,
  notes: TableNotes,
  typeroomseason: TableTypeRoomSeason,
  typeroomdata: TableDataTypeRoom,
  invoicesIssued: TableInvoicesIssued,
  invoicesParameters: TableInvoicesParameters,
  tableDate: TableDate,
  orders: TableOrders,
  floors: TableFloors,
  tables: TableTables,
  menuType: TableMenuType,
  dishType: TableDishType,
  paymentMethod: TablePaymentMethod,
  cashRegisters: TableCashRegisters,
  items: TableItems
};

const DataList = ({ data, type, displayLength, onDelete, ...restProps }) => {
  const [page, setPage] = useState(() => {
    const savedPage = localStorage.getItem('active_page_' + type);
    return savedPage && data?.length > displayLength ? parseInt(savedPage, 10) : 1;
  });

  const [datos, setDatos] = useState([]);

  const getData = useCallback(() => {
    const startIndex = (page - 1) * displayLength;
    return data.slice(startIndex, startIndex + displayLength);
  }, [data, page, displayLength]);

  useEffect(() => {
    if (data.length < displayLength && page !== 1) {
      setPage(1);
    } else {
      setDatos(getData());
    }
  }, [data, displayLength, page, getData]);

  const TableComponentToRender = TableComponentsMap[type];

  return (
    <>
      <div className="table-responsive">
        {TableComponentToRender ? (
          <TableComponentToRender data={datos} onDelete={onDelete} {...restProps} />
        ) : (
          <p>Tabla no encontrada para el tipo: {type}</p>
        )}
      </div>

      {data.length > displayLength && (
        <DataListPagination
          type={type}
          length={data.length}
          displayLength={displayLength}
          activePage={page}
          setPage={setPage}
        />
      )}
    </>
  );
};

export default DataList;
