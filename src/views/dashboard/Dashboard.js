import React, { useEffect, useState } from 'react'
import {
  CCard, CCardBody, CCardHeader, CCol, CRow, CTable, CTableBody, CTableDataCell,
  CTableHead, CTableHeaderCell, CTableRow, CWidgetStatsA, CBadge
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilLeaf, cilBasket, cilBarChart, cilStorage, cilBell
} from '@coreui/icons'

const API_URL = 'http://localhost:3001'

const Dashboard = () => {
  const [insumos, setInsumos] = useState([])
  const [galpones, setGalpones] = useState([])
  const [gallos, setGallos] = useState([])
  const [personal, setPersonal] = useState([])

  useEffect(() => {
    fetch(`${API_URL}/insumos`).then(res => res.json()).then(setInsumos)
    fetch(`${API_URL}/galpones`).then(res => res.json()).then(setGalpones)
    fetch(`${API_URL}/gallos`).then(res => res.json()).then(setGallos)
    fetch(`${API_URL}/personal`).then(res => res.json()).then(setPersonal).catch(() => setPersonal([]))
  }, [])

  // Estadísticas generales
  const totalHens = galpones.reduce((sum, g) => sum + (g.aves || 0), 0)
  const totalGallos = gallos.reduce((sum, g) => sum + (g.cantidad || 0), 0)

  // Stock de alimento
  const feedStock = insumos.find(i => i.nombre?.toLowerCase().includes('alimento'))?.stock_actual || 0

  // Alertas
  const desinfectante = insumos.find(i => i.nombre?.toLowerCase().includes('desinfectante'))
  const vacunas = insumos.find(i => i.nombre?.toLowerCase().includes('vacuna'))
  const alerts = [
    desinfectante && desinfectante.stock_actual < 20
      ? { type: 'Crítico', msg: 'Stock de desinfectante bajo. ¡Reponer urgente!', color: 'danger' }
      : null,
    vacunas && vacunas.stock_actual < 50
      ? { type: 'Advertencia', msg: 'Vacunas en nivel bajo. Programar compra.', color: 'warning' }
      : null,
  ].filter(Boolean)

  // Inventario y suministros
  const inventoryTable = insumos.map(i => ({
    item: i.nombre,
    stock: i.stock_actual,
    unit: i.unidad,
    status:
      i.stock_actual > 100 ? 'Suficiente'
      : i.stock_actual > 20 ? 'Bajo'
      : 'Crítico'
  }))

  // Personal y turnos (si existe en db.json)
  const staff = Array.isArray(personal) && personal.length > 0
    ? personal
    : [
      { nombre: 'No registrado', rol: '-', turno: '-', estado: '-' }
    ]

  return (
    <>
      {/* Widgets de estadísticas generales */}
      <CRow className="mb-4 g-3">
        <CCol xs={12} sm={6} lg={3}>
          <CWidgetStatsA
            className="mb-4 h-100"
            color="success"
            value={totalHens}
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
            color="primary"
            value={totalGallos}
            title="Gallos Registrados"
            style={{ background: 'linear-gradient(135deg, #36d1c4 0%, #5b86e5 100%)', color: '#fff' }}
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
            color="info"
            value={`${feedStock} kg`}
            title="Stock de Alimento"
            style={{ background: 'linear-gradient(135deg, #43cea2 0%, #185a9d 100%)', color: '#fff' }}
            chart={
              <div className="d-flex justify-content-center align-items-center" style={{ height: 48 }}>
                <CIcon icon={cilStorage} size="xl" style={{ color: '#fff', maxWidth: 40, maxHeight: 40 }} />
              </div>
            }
          />
        </CCol>
        <CCol xs={12} sm={6} lg={3}>
          <CWidgetStatsA
            className="mb-4 h-100"
            color="warning"
            value={insumos.length}
            title="Tipos de Insumos"
            style={{ background: 'linear-gradient(135deg, #f7971e 0%, #ffd200 100%)', color: '#222' }}
            chart={
              <div className="d-flex justify-content-center align-items-center" style={{ height: 48 }}>
                <CIcon icon={cilBasket} size="xl" style={{ color: '#b8860b', maxWidth: 40, maxHeight: 40 }} />
              </div>
            }
          />
        </CCol>
      </CRow>

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
              {inventoryTable.map((inv, index) => (
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
                  <CTableDataCell>{person.nombre}</CTableDataCell>
                  <CTableDataCell>{person.rol}</CTableDataCell>
                  <CTableDataCell>{person.turno}</CTableDataCell>
                  <CTableDataCell>
                    <CBadge color={person.estado === 'Activo' ? 'success' : 'danger'}>
                      {person.estado}
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
          {alerts.length > 0 ? (
            <ul>
              {alerts.map((alert, idx) => (
                <li key={idx}>
                  <CBadge color={alert.color} className="me-2">
                    {alert.type}
                  </CBadge>
                  {alert.msg}
                </li>
              ))}
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