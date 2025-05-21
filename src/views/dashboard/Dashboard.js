import React from 'react'
import classNames from 'classnames'

import {
  CAvatar,
  CButton,
  CButtonGroup,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CProgress,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CWidgetStatsA,
  CWidgetStatsB,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import Pag404 from '../pages/page404/Page404';
import { cilUser, cilUserFemale, cilChartPie, cilSchool, cilCheckCircle, cilXCircle, cilStar } from '@coreui/icons'
import MainChart from './MainChart'

const Dashboard = (user) => {
  if (user.permission != 'admin.dashboard') return <Pag404 />
  const stats = {
    totalStudents: 1200,
    approved: 950,
    failed: 250,
    enrolled: 1200,
    attendance: 85, // Porcentaje de asistencia
  }

  const studentTable = [
    {
      name: 'Juan Pérez',
      year: '1° Año',
      status: 'Aprobado',
      average: 18,
      attendance: '95%',
    },
    {
      name: 'María López',
      year: '2° Año',
      status: 'Reprobado',
      average: 9,
      attendance: '80%',
    },
    {
      name: 'Carlos García',
      year: '3° Año',
      status: 'Aprobado',
      average: 19,
      attendance: '100%',
    },
  ]

  const bestMetrics = {
    bestYear: '3° Año',
    bestAverage: 19,
    bestStudent: {
      name: 'Carlos García',
      year: '3° Año',
      average: 19,
    },
    yearAverages: [
      { year: '1° Año', average: 15 },
      { year: '2° Año', average: 16 },
      { year: '3° Año', average: 19 },
      { year: '4° Año', average: 18 },
      { year: '5° Año', average: 17 },
    ],
  }

  return (
    <>
      {/* Widgets de estadísticas generales */}
      <CRow className="mb-4">
        <CCol sm={6} lg={3}>
          <CWidgetStatsA
            className="mb-4"
            color="primary"
            value={stats.totalStudents}
            title="Total Estudiantes"
            chart={<CIcon icon={cilSchool} size="xl" />}
          />
        </CCol>
        <CCol sm={6} lg={3}>
          <CWidgetStatsA
            className="mb-4"
            color="success"
            value={stats.approved}
            title="Estudiantes Aprobados"
            chart={<CIcon icon={cilCheckCircle} size="xl" />}
          />
        </CCol>
        <CCol sm={6} lg={3}>
          <CWidgetStatsA
            className="mb-4"
            color="danger"
            value={stats.failed}
            title="Estudiantes Reprobados"
            chart={<CIcon icon={cilXCircle} size="xl" />}
          />
        </CCol>
        <CCol sm={6} lg={3}>
          <CWidgetStatsA
            className="mb-4"
            color="info"
            value={`${stats.attendance}%`}
            title="Asistencia Promedio"
            chart={<CIcon icon={cilChartPie} size="xl" />}
          />
        </CCol>
      </CRow>

      {/* Gráfico principal */}
      <CCard className="mb-4">
        <CCardHeader>
          <h4>Distribución de Calificaciones</h4>
        </CCardHeader>
        <CCardBody>
          <MainChart />
        </CCardBody>
      </CCard>

      {/* Tabla de estudiantes */}
      <CCard className="mb-4">
        <CCardHeader>
          <h4>Detalles de Estudiantes</h4>
        </CCardHeader>
        <CCardBody>
          <CTable align="middle" className="mb-0 border" hover responsive>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>Nombre</CTableHeaderCell>
                <CTableHeaderCell>Año</CTableHeaderCell>
                <CTableHeaderCell>Estado</CTableHeaderCell>
                <CTableHeaderCell>Promedio</CTableHeaderCell>
                <CTableHeaderCell>Asistencia</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {studentTable.map((student, index) => (
                <CTableRow key={index}>
                  <CTableDataCell>{student.name}</CTableDataCell>
                  <CTableDataCell>{student.year}</CTableDataCell>
                  <CTableDataCell>{student.status}</CTableDataCell>
                  <CTableDataCell>{student.average}</CTableDataCell>
                  <CTableDataCell>{student.attendance}</CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        </CCardBody>
      </CCard>

      {/* Apartado de métricas interesantes */}
      <CCard className="mb-4">
        <CCardHeader>
          <h4>Métricas Destacadas</h4>
        </CCardHeader>
        <CCardBody>
          <CRow>
            <CCol sm={6} lg={4}>
              <CWidgetStatsB
                className="mb-4"
                color="success"
                value={bestMetrics.bestYear}
                title="Año con Mejor Promedio"
                progress={{ value: 19 }}
              />
            </CCol>
            <CCol sm={6} lg={4}>
              <CWidgetStatsB
                className="mb-4"
                color="warning"
                value={bestMetrics.bestStudent.name}
                title="Mejor Estudiante"
                progress={{ value: bestMetrics.bestStudent.average }}
              />
            </CCol>
            <CCol sm={6} lg={4}>
              <CWidgetStatsB
                className="mb-4"
                color="info"
                value={`${bestMetrics.bestAverage}`}
                title="Mejor Promedio General"
                progress={{ value: bestMetrics.bestAverage }}
              />
            </CCol>
          </CRow>
          <h5>Promedios por Año</h5>
          <CTable align="middle" className="mb-0 border" hover responsive>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>Año</CTableHeaderCell>
                <CTableHeaderCell>Promedio</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {bestMetrics.yearAverages.map((yearData, index) => (
                <CTableRow key={index}>
                  <CTableDataCell>{yearData.year}</CTableDataCell>
                  <CTableDataCell>{yearData.average}</CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        </CCardBody>
      </CCard>
    </>
  )
}

export default Dashboard