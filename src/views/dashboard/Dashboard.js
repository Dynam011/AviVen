import React, { useEffect, useState } from 'react'
import {
  CCard, CCardBody, CCardHeader, CCol, CRow, CTable, CTableBody, CTableDataCell,
  CTableHead, CTableHeaderCell, CTableRow, CWidgetStatsA, CBadge
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLeaf, cilBarChart, cilStorage, cilBell, cilUser } from '@coreui/icons'

const API_URL = 'http://localhost:3001'

const Dashboard = () => {
  const [insumos, setInsumos] = useState([])
  const [galpones, setGalpones] = useState([])
  const [ventas, setVentas] = useState([])
  const [clientes, setClientes] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [insumosRes, galponesRes, ventasRes, clientesRes] = await Promise.all([
          fetch(`${API_URL}/insumos`),
          fetch(`${API_URL}/galpones`),
          fetch(`${API_URL}/ventas`),
          fetch(`${API_URL}/clientes`),
        ])
        setInsumos(await insumosRes.json())
        setGalpones(await galponesRes.json())
        setVentas(await ventasRes.json())
        setClientes(await clientesRes.json())
      } catch (error) {
        console.error('Error al cargar los datos del dashboard:', error)
      }
    }
    fetchData()
  }, [])

  // Estadísticas generales
  const totalHens = galpones.reduce((sum, g) => sum + (g.aves || 0), 0)
  const totalIngresos = ventas.reduce((sum, v) => sum + (v.total || 0), 0)
  const totalClientes = clientes.length

  // Stock de alimento
  const feedStock = insumos.find(i => i.nombre?.toLowerCase().includes('alimento'))?.stock_actual || 0

  // Alertas
  const desinfectante = insumos.find(i => i.nombre?.toLowerCase().includes('desinfectante'))
  const vacunas = insumos.find(i => i.nombre?.toLowerCase().includes('vacuna'))
  const alerts = []
  if (desinfectante && desinfectante.stock_actual < 20) {
    alerts.push({ type: 'Crítico', msg: 'Stock de desinfectante bajo. ¡Reponer urgente!', color: 'danger' })
  }
  if (vacunas && vacunas.stock_actual < 50) {
    alerts.push({ type: 'Advertencia', msg: 'Vacunas en nivel bajo. Programar compra.', color: 'warning' })
  }

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

  // Últimas ventas
  const ultimasVentas = [...ventas].sort((a, b) => new Date(b.fecha) - new Date(a.fecha)).slice(0, 5)

  return (
    <>
      {/* Widgets de estadísticas generales */}
      <CRow className="mb-4 g-3">
        <CCol xs={12} sm={6} lg={3}>
          <CWidgetStatsA
            className="mb-4 h-100"
            color="success"
            value={totalHens.toLocaleString()}
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
            value={`$${totalIngresos.toLocaleString()}`}
            title="Ingresos por Ventas"
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
            value={totalClientes}
            title="Clientes Activos"
            style={{ background: 'linear-gradient(135deg, #f7971e 0%, #ffd200 100%)', color: '#222' }}
            chart={
              <div className="d-flex justify-content-center align-items-center" style={{ height: 48 }}>
                <CIcon icon={cilUser} size="xl" style={{ color: '#b8860b', maxWidth: 40, maxHeight: 40 }} />
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

      {/* Últimas Ventas */}
      <CCard className="mb-4">
        <CCardHeader>
          <h4>Últimas Ventas Registradas</h4>
        </CCardHeader>
        <CCardBody>
          <CTable align="middle" className="mb-0 border" hover responsive>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>Cliente</CTableHeaderCell>
                <CTableHeaderCell>Insumo</CTableHeaderCell>
                <CTableHeaderCell>Fecha</CTableHeaderCell>
                <CTableHeaderCell>Total</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {ultimasVentas.map((venta) => (
                <CTableRow key={venta.id_venta}>
                  <CTableDataCell>{clientes.find(c => c.id_cliente === venta.id_cliente)?.nombre || 'N/A'}</CTableDataCell>
                  <CTableDataCell>{insumos.find(i => i.id_insumo === venta.id_insumo)?.nombre || 'N/A'}</CTableDataCell>
                  <CTableDataCell>{venta.fecha}</CTableDataCell>
                  <CTableDataCell>
                    <CBadge color="success">
                      ${Number(venta.total).toLocaleString()}
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
            <span className="text-success">¡Todo en orden! No hay alertas activas.</span>
          )}
        </CCardBody>
      </CCard>
    </>
  )
}

export default Dashboard