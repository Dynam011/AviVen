import { exact } from 'prop-types'
import React from 'react'


const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const Inicio = React.lazy(() => import('./views/pages/inicio'))
const Genealogia = React.lazy(() => import('./views/pages/genealogia/genealogia'))
const Reproductores = React.lazy(() => import('./views/pages/genealogia/reproductores'))
const Galpones = React.lazy(() => import('./views/pages/galpones/galpones'))
const Inventario = React.lazy(() => import('./views/pages/inventario/inventario'))
const Clientes = React.lazy(() => import('./views/pages/clientes/clientes'))

const routes = [
  { path: '/',  element: Inicio, name: 'Inicio' },
  { path: '/dashboard', name: 'Panel', element: Dashboard },
 { path: '/genealogia', name: 'Genealogia', element: Genealogia },
 { path: '/reproductores', name: 'Reproductores', element: Reproductores },
 { path: '/galpones', name: 'Galpones', element: Galpones },
 { path: '/inventario', name: 'Inventario', element: Inventario },
 { path: '/clientes', name: 'Clientes', element: Clientes },

]

export default routes
