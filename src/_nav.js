import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilSpeedometer,
  cilPeople,
  cilUser,
  cilBook,

  cilChartPie,
  cilSettings,
    

} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Panel Principal',
    to: '/dashboard',
    
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
  {
    component: CNavGroup,
    name: 'Gestión de Estudiantes',
    icon: <CIcon icon={cilPeople} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Inscripción',
        to: '/students/registration',
      },
      {
        component: CNavItem,
        name: 'Listado de Estudiantes',
        to: '/students/list',
      },
      {
        component: CNavItem,
        name: 'Control de Asistencia',
        to: '/students/attendance',
      },
    ],
  },
  {
    component: CNavGroup,
    name: 'Gestión de Docentes',
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Registro de Docentes',
        to: '/teachers/registration',
      },
      {
        component: CNavItem,
        name: 'Asignación de Materias',
        to: '/teachers/subjects',
      },
    ],
  },
  {
    component: CNavGroup,
    name: 'Gestión Académica',
    icon: <CIcon icon={cilBook} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Aulas y Secciones',
        to: '/academic/classrooms',
      },
      {
        component: CNavItem,
        name: 'Horarios',
        to: '/academic/schedules',
      },
      {
        component: CNavItem,
        name: 'Materias',
        to: '/academic/subjects',
      },
      {
        component: CNavItem,
        name: 'Evaluaciones',
        to: '/academic/evaluations',
      },
    ],
  },
  {
    component: CNavGroup,
    name: 'Reportes',
    icon: <CIcon icon={cilChartPie} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Boletines de Calificaciones',
        to: '/reports/grades',
      },
      {
        component: CNavItem,
        name: 'Estadísticas de Rendimiento',
        to: '/reports/performance',
      },
      {
        component: CNavItem,
        name: 'Reportes de Asistencia',
        to: '/reports/attendance',
      },
    ],
  },
  {
    component: CNavGroup,
    name: 'Configuración',
    icon: <CIcon icon={cilSettings} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Períodos Académicos',
        to: '/settings/periods',
      },
      {
        component: CNavItem,
        name: 'Configuración General',
        to: '/settings/general',
      },
    ],
  },
]

export default _nav
