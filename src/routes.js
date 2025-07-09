
import React from 'react'


const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const Inicio = React.lazy(() => import('./views/pages/inicio'))
const Genealogia = React.lazy(() => import('./views/pages/genealogia/genealogia'))
const Reproductores = React.lazy(() => import('./views/pages/genealogia/reproductores'))
const Galpones = React.lazy(() => import('./views/pages/galpones/galpones'))
const Inventario = React.lazy(() => import('./views/pages/inventario/inventario'))
const Clientes = React.lazy(() => import('./views/pages/clientes/clientes'))
const Ventas = React.lazy(() => import('./views/pages/ventas/ventas'))
const Pagos = React.lazy(() => import('./views/pages/pagos/pagos'))
const Production = React.lazy(() => import('./views/pages/production/production'))
const Insumos = React.lazy(() => import('./views/pages/insumos/insumos'))
const Proveedores = React.lazy(() => import('./views/pages/proveedores/proveedores'))
const compras = React.lazy(() => import('./views/pages/compras/compras'))


const routes = [
  { path: '/',  element: Inicio, name: 'Inicio' },
  { path: '/dashboard', name: 'Panel', element: Dashboard },
 { path: '/genealogia', name: 'Genealogia', element: Genealogia },
 { path: '/reproductores', name: 'Reproductores', element: Reproductores },
 { path: '/galpones', name: 'Galpones', element: Galpones },
 { path: '/inventario', name: 'Inventario', element: Inventario },
 { path: '/clientes', name: 'Clientes', element: Clientes },
 { path: '/ventas', name: 'Ventas', element: Ventas },
  { path: '/pagos', name: 'Pagos', element: Pagos },
    { path: '/production', name: 'Produccion', element: Production },
        { path: '/insumos', name: 'Insumos', element: Insumos },
         { path: '/proveedores', name: 'Proveedor', element: Proveedores },
         { path: '/compras', name: 'compras', element: compras },

]

export default routes
