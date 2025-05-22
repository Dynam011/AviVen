import React from 'react'
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
  CBadge,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilLeaf,
  cilBasket,
  cilGroup,
  cilBarChart,
  cilChartPie,
  cilTruck,
  cilMedicalCross,
  cilWarning,
  cilStorage,
  cilBell,
} from '@coreui/icons'

const Dashboard = () => {
  // Datos simulados para la granja avícola
  const stats = {
    totalHens: 12500,
    dailyEggs: 11800,
    feedStock: 3200, // kg
    avgConversion: 92, // %
    alerts: 2,
  }

  const productionTable = [
    {
      date: '2025-05-20',
      eggs: 11800,
      feed: 1200,
      mortality: 3,
      notes: 'Producción estable',
    },
    {
      date: '2025-05-19',
      eggs: 11750,
      feed: 1190,
      mortality: 2,
      notes: 'Sin novedades',
    },
    {
      date: '2025-05-18',
      eggs: 11780,
      feed: 1210,
      mortality: 4,
      notes: 'Revisión de temperatura',
    },
  ]

  const inventory = [
    { item: 'Alimento balanceado', stock: 3200, unit: 'kg', status: 'Suficiente' },
    { item: 'Vacunas', stock: 120, unit: 'dosis', status: 'Bajo' },
    { item: 'Cajas para huevos', stock: 400, unit: 'unidades', status: 'Suficiente' },
    { item: 'Desinfectante', stock: 15, unit: 'litros', status: 'Crítico' },
  ]

  const staff = [
    { name: 'Ana Torres', role: 'Veterinaria', shift: 'Mañana', status: 'Activo' },
    { name: 'Luis Pérez', role: 'Supervisor', shift: 'Tarde', status: 'Activo' },
    { name: 'Carlos Díaz', role: 'Operario', shift: 'Noche', status: 'Ausente' },
  ]

  return (
    <>
      {/* Widgets de estadísticas generales */}
      <CRow className="mb-4 g-3">
        <CCol xs={12} sm={6} lg={3}>
          <CWidgetStatsA
            className="mb-4 h-100"
            color="success"
            value={stats.totalHens}
            title="Gallinas en Producción"
            style={{ background: 'linear-gradient(135deg,rgb(77, 189, 114) 0%,rgb(41, 158, 137) 100%)', color: '#222' }}
            chart={
              <div className="d-flex justify-content-center align-items-center" style={{ height: 48 }}>
                <CIcon icon={cilLeaf} size="xl" style={{ color: '#1b8a5a', maxWidth: 40, maxHeight: 40 }} />
              </div>
            }
          />
        </CCol>
        <CCol xs={12} sm={6} lg={3}>
          <CWidgetStatsA
            className="mb-4 h-100"
            color="warning"
            value={stats.dailyEggs}
            title="Huevos Diarios"
            style={{ background: 'linear-gradient(135deg, #f7971e 0%, #ffd200 100%)', color: '#222' }}
            chart={
              <div className="d-flex justify-content-center align-items-center" style={{ height: 48 }}>
                <CIcon icon={cilBasket} size="xl" style={{ color: '#b8860b', maxWidth: 40, maxHeight: 40 }} />
              </div>
            }
          />
        </CCol>
        <CCol xs={12} sm={6} lg={3}>
          <CWidgetStatsA
            className="mb-4 h-100"
            color="info"
            value={`${stats.avgConversion}%`}
            title="Eficiencia de Conversión"
            style={{ background: 'linear-gradient(135deg, #43cea2 0%, #185a9d 100%)', color: '#fff' }}
            chart={
              <div className="d-flex justify-content-center align-items-center" style={{ height: 48 }}>
                <CIcon icon={cilBarChart} size="xl" style={{ color: '#fff', maxWidth: 40, maxHeight: 40 }} />
              </div>
            }
          />
        </CCol>
        <CCol xs={12} sm={6} lg={3}>
          <CWidgetStatsA
            className="mb-4 h-100"
            color="primary"
            value={`${stats.feedStock} kg`}
            title="Stock de Alimento"
            style={{ background: 'linear-gradient(135deg, #36d1c4 0%, #5b86e5 100%)', color: '#fff' }}
            chart={
              <div className="d-flex justify-content-center align-items-center" style={{ height: 48 }}>
                <CIcon icon={cilStorage} size="xl" style={{ color: '#fff', maxWidth: 40, maxHeight: 40 }} />
              </div>
            }
          />
        </CCol>
      </CRow>

      {/* Tabla de producción diaria */}
      <CCard className="mb-4">
        <CCardHeader>
          <h4>Producción Reciente</h4>
        </CCardHeader>
        <CCardBody>
          <CTable align="middle" className="mb-0 border" hover responsive>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>Fecha</CTableHeaderCell>
                <CTableHeaderCell>Huevos Producidos</CTableHeaderCell>
                <CTableHeaderCell>Alimento Consumido (kg)</CTableHeaderCell>
                <CTableHeaderCell>Mortalidad</CTableHeaderCell>
                <CTableHeaderCell>Notas</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {productionTable.map((prod, index) => (
                <CTableRow key={index}>
                  <CTableDataCell>{prod.date}</CTableDataCell>
                  <CTableDataCell>{prod.eggs}</CTableDataCell>
                  <CTableDataCell>{prod.feed}</CTableDataCell>
                  <CTableDataCell>
                    {prod.mortality}
                    {prod.mortality > 3 && (
                      <CBadge color="danger" className="ms-2">
                        Alto
                      </CBadge>
                    )}
                  </CTableDataCell>
                  <CTableDataCell>{prod.notes}</CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        </CCardBody>
      </CCard>

      {/* Inventario y suministros */}
      <CCard className="mb-4">
        <CCardHeader>
          <h4>Inventario y Suministros</h4>
        </CCardHeader>
        <CCardBody>
          <CTable align="middle" className="mb-0 border" hover responsive>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>Ítem</CTableHeaderCell>
                <CTableHeaderCell>Stock</CTableHeaderCell>
                <CTableHeaderCell>Estado</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {inventory.map((inv, index) => (
                <CTableRow key={index}>
                  <CTableDataCell>{inv.item}</CTableDataCell>
                  <CTableDataCell>
                    {inv.stock} {inv.unit}
                  </CTableDataCell>
                  <CTableDataCell>
                    <CBadge color={
                      inv.status === 'Suficiente'
                        ? 'success'
                        : inv.status === 'Bajo'
                        ? 'warning'
                        : 'danger'
                    }>
                      {inv.status}
                    </CBadge>
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        </CCardBody>
      </CCard>

      {/* Personal y turnos */}
      <CCard className="mb-4">
        <CCardHeader>
          <h4>Personal y Turnos</h4>
        </CCardHeader>
        <CCardBody>
          <CTable align="middle" className="mb-0 border" hover responsive>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>Nombre</CTableHeaderCell>
                <CTableHeaderCell>Rol</CTableHeaderCell>
                <CTableHeaderCell>Turno</CTableHeaderCell>
                <CTableHeaderCell>Estado</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {staff.map((person, index) => (
                <CTableRow key={index}>
                  <CTableDataCell>{person.name}</CTableDataCell>
                  <CTableDataCell>{person.role}</CTableDataCell>
                  <CTableDataCell>{person.shift}</CTableDataCell>
                  <CTableDataCell>
                    <CBadge color={person.status === 'Activo' ? 'success' : 'danger'}>
                      {person.status}
                    </CBadge>
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        </CCardBody>
      </CCard>

      {/* Alertas y notificaciones */}
      <CCard className="mb-4">
        <CCardHeader>
          <h4>
            <CIcon icon={cilBell} className="me-2 text-danger" />
            Alertas y Notificaciones
          </h4>
        </CCardHeader>
        <CCardBody>
          {stats.alerts > 0 ? (
            <ul>
              <li>
                <CBadge color="danger" className="me-2">
                  Crítico
                </CBadge>
                Stock de desinfectante bajo. <strong>¡Reponer urgente!</strong>
              </li>
              <li>
                <CBadge color="warning" className="me-2">
                  Advertencia
                </CBadge>
                Vacunas en nivel bajo. Programar compra.
              </li>
            </ul>
          ) : (
            <span className="text-success">Sin alertas activas.</span>
          )}
        </CCardBody>
      </CCard>
    </>
  )
}

export default Dashboard