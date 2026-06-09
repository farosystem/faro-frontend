import Assets from '@/Pages/Assets/Assets';
import EditAsset from '@/Pages/Assets/EditAsset';
import NewAsset from '@/Pages/Assets/NewAsset';
import AssetMove from '@/Pages/AssetsMove/AssetMove';
import AssetsMove from '@/Pages/AssetsMove/AssetsMove';
import NewAssetMove from '@/Pages/AssetsMove/NewAssetMove';
import { AppRoute } from '../types';

const assetsRoutes: AppRoute[] = [
  { path: '/assets', component: <Assets /> },
  { path: '/newasset', component: <NewAsset /> },
  { path: '/editasset/:id', component: <EditAsset /> },
  { path: '/assets/movements', component: <AssetsMove /> },
  { path: '/asset/movements/:id', component: <AssetMove /> },
  { path: '/asset/newmovement/:id', component: <NewAssetMove /> },
  { path: '/asset/newmovement', component: <NewAssetMove /> }
];

export default assetsRoutes;
