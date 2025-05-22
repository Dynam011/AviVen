import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilHome,
  cilSpeedometer,
  cilGroup,
  cilUser,
  cilList,
  cilFactory,
  cilLeaf,
  cilBarChart,
  cilBasket,
  cilStorage,
  cilTruck,
  cilClipboard,
  cilDollar,
  cilSettings,
  cilBell,
  cilChartPie,
  cilMedicalCross,
  cilDescription,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Inicio',
    to: '/',
    icon: <CIcon icon={cilHome} customClassName="nav-icon" />,
  },
    {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilBarChart} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'Gestión Avícola',
  },
  {
    component: CNavGroup,
    name: 'Aves y Reproductores',
    icon: <CIcon icon={cilLeaf} customClassName="nav-icon" />,
    items: [
      { component: CNavItem, name: 'Reproductores', to: '/reproductores' },
      { component: CNavItem, name: 'Genealogía', to: '/genealogia' },
    ],
  },
  {
    component: CNavGroup,
    name: 'Galpones',
    icon: <CIcon icon={cilFactory} customClassName="nav-icon" />,
    items: [
      { component: CNavItem, name: 'Galpones', to: '/galpones' },
    ],
  },
  {
    component: CNavGroup,
    name: 'Insumos y Proveedores',
    icon: <CIcon icon={cilStorage} customClassName="nav-icon" />,
    items: [
      //{ component: CNavItem, name: 'Insumos', to: '/insumos' },
      { component: CNavItem, name: 'Inventario', to: '/inventario' },
      //{ component: CNavItem, name: 'Proveedores', to: '/proveedores' },
      //{ component: CNavItem, name: 'Compras', to: '/compras' },
    ],
  },
  {
    component: CNavGroup,
    name: 'Ventas y Clientes',
    icon: <CIcon icon={cilTruck} customClassName="nav-icon" />,
    items: [
      { component: CNavItem, name: 'Clientes', to: '/clientes' },
      { component: CNavItem, name: 'Ventas', to: '/ventas' },
      //{ component: CNavItem, name: 'Detalle de Ventas', to: '/detalle-ventas' },
      //{ component: CNavItem, name: 'Pagos', to: '/pagos' },
    ],
  },
  /*{
    component: CNavGroup,
    name: 'Usuarios y Seguridad',
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
    items: [
      { component: CNavItem, name: 'Usuarios', to: '/usuarios' },
      { component: CNavItem, name: 'Roles', to: '/roles' },
      { component: CNavItem, name: 'Permisos', to: '/permisos' },
    ],
  },
  {
    component: CNavGroup,
    name: 'Reportes',
    icon: <CIcon icon={cilChartPie} customClassName="nav-icon" />,
    items: [
      { component: CNavItem, name: 'Reportes Generales', to: '/reportes' },
    ],
  },
  {
    component: CNavGroup,
    name: 'Configuración',
    icon: <CIcon icon={cilSettings} customClassName="nav-icon" />,
    items: [
      { component: CNavItem, name: 'Parámetros Generales', to: '/configuracion' },
      { component: CNavItem, name: 'Notificaciones', to: '/notificaciones' },
    ],
  },*/
]

export default _nav