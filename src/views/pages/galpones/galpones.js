import React, { useState } from 'react'
import {
  CCard, CCardBody, CCardHeader, CCol, CRow, CForm, CFormLabel, CFormInput,
  CButton, CFormSelect, CFormFeedback, CBadge, CProgress, CAlert, CImage,
  CListGroup, CListGroupItem, CSidebar, CModal, CModalHeader, CModalBody,
  CModalFooter, CNav, CNavItem, CNavLink
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilWarning, cilCheckCircle, cilLightbulb, cilPlus, cilList, cilGrid, cilCalendar } from '@coreui/icons'

// Mock de galpones
const tiposVentilacion = ['Natural', 'Mecánica', 'Automatizada']
const tiposIluminacion = ['LED', 'Incandescente', 'Natural']
const capacidadMaxima = 5000

const mockGalpones = [
  {
    id: 1,
    nombre: 'Galpón Norte',
    capacidad: 2000,
    aves: 1950,
    ventilacion: 'Mecánica',
    iluminacion: 'LED',
    mantenimiento: [
      { fecha: '2025-05-10', tarea: 'Limpieza general', estado: 'Completado' },
      { fecha: '2025-06-01', tarea: 'Revisión ventiladores', estado: 'Pendiente' },
    ],
    ambiente: { temp: 24, humedad: 60 },
    plano: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 2,
    nombre: 'Galpón Sur',
    capacidad: 3000,
    aves: 2950,
    ventilacion: 'Automatizada',
    iluminacion: 'Natural',
    mantenimiento: [
      { fecha: '2025-05-15', tarea: 'Desinfección', estado: 'Completado' },
      { fecha: '2025-06-03', tarea: 'Cambio de lámparas', estado: 'Pendiente' },
    ],
    ambiente: { temp: 26, humedad: 65 },
    plano: 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&w=400&q=80',
  },
]

// Utilidad para calcular ocupación
function ocupacion(aves, capacidad) {
  return Math.round((aves / capacidad) * 100)
}

// Utilidad para calcular ocupación total
function ocupacionTotal(galpones) {
  const totalAves = galpones.reduce((sum, g) => sum + g.aves, 0)
  const totalCap = galpones.reduce((sum, g) => sum + g.capacidad, 0)
  return { totalAves, totalCap, porcentaje: Math.round((totalAves / totalCap) * 100) }
}

// Mock para cierre de registro
const cierreRegistro = new Date()
cierreRegistro.setDate(cierreRegistro.getDate() + 3)
const cierreStr = cierreRegistro.toLocaleDateString()

const Galpones = () => {
  const [galpones, setGalpones] = useState(mockGalpones)
  const [form, setForm] = useState({
    nombre: '',
    capacidad: '',
    aves: '',
    ventilacion: '',
    iluminacion: '',
  })
  const [formError, setFormError] = useState('')
  const [vista, setVista] = useState('grid')
  const [showModal, setShowModal] = useState(false)

  // Validación automática de capacidad
  const validarCapacidad = (capacidad, aves) => {
    if (!capacidad || isNaN(capacidad) || capacidad <= 0 || capacidad > capacidadMaxima) return false
    if (aves && Number(aves) > Number(capacidad)) return false
    return true
  }

  // Manejo de cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
  }

  // Guardar galpón
  const handleSubmit = (e) => {
    e.preventDefault()
    setFormError('')
    if (!form.nombre || !form.capacidad || !form.aves || !form.ventilacion || !form.iluminacion) {
      setFormError('Complete todos los campos.')
      return
    }
    if (!validarCapacidad(form.capacidad, form.aves)) {
      setFormError(`Capacidad inválida o recuento de aves supera el máximo (${capacidadMaxima}).`)
      return
    }
    setGalpones([
      ...galpones,
      {
        id: galpones.length + 1,
        nombre: form.nombre,
        capacidad: Number(form.capacidad),
        aves: Number(form.aves),
        ventilacion: form.ventilacion,
        iluminacion: form.iluminacion,
        mantenimiento: [],
        ambiente: { temp: 25, humedad: 60 },
        plano: '',
      },
    ])
    setForm({ nombre: '', capacidad: '', aves: '', ventilacion: '', iluminacion: '' })
    setShowModal(false)
  }

  // Plano interactivo (mapa de calor simple)
  const renderPlano = () => (
    <CRow className="mb-3">
      {galpones.map(g => (
        <CCol key={g.id} md={6} className="mb-2">
          <CCard>
            <CCardHeader>
              <strong>{g.nombre}</strong>
              <CBadge
                color={ocupacion(g.aves, g.capacidad) > 90 ? 'danger' : ocupacion(g.aves, g.capacidad) > 75 ? 'warning' : 'success'}
                className="ms-2"
              >
                {ocupacion(g.aves, g.capacidad)}%
              </CBadge>
            </CCardHeader>
            <CCardBody>
              <CImage src={g.plano} width={180} height={90} style={{ objectFit: 'cover', borderRadius: 8 }} />
              <CProgress
                className="mt-3"
                value={ocupacion(g.aves, g.capacidad)}
                color={ocupacion(g.aves, g.capacidad) > 90 ? 'danger' : ocupacion(g.aves, g.capacidad) > 75 ? 'warning' : 'success'}
                animated
                style={{ height: 12 }}
              />
              <div className="mt-2">
                <CIcon icon={cilGrid} className="me-1 text-info" /> {g.ventilacion}
                <CIcon icon={cilLightbulb} className="ms-3 me-1 text-warning" /> {g.iluminacion}
              </div>
              <div className="mt-2">
                <CBadge color="info" className="me-2">Temp: {g.ambiente.temp}°C</CBadge>
                <CBadge color="primary">Humedad: {g.ambiente.humedad}%</CBadge>
              </div>
              <div className="mt-2">
                <strong>Mantenimiento:</strong>
                <ul className="mb-0">
                  {g.mantenimiento.map((m, i) => (
                    <li key={i}>
                      <CIcon icon={cilCalendar} className="me-1" />
                      {m.fecha} - {m.tarea} <CBadge color={m.estado === 'Pendiente' ? 'warning' : 'success'}>{m.estado}</CBadge>
                    </li>
                  ))}
                </ul>
              </div>
              {ocupacion(g.aves, g.capacidad) > 90 && (
                <CAlert color="danger" className="mt-2 p-2">
                  <CIcon icon={cilWarning} className="me-1" />
                  ¡Alerta! El galpón está cerca de su capacidad máxima.
                </CAlert>
              )}
            </CCardBody>
          </CCard>
        </CCol>
      ))}
    </CRow>
  )

  // Listado en cuadrícula
  const renderGrid = () => (
    <CRow>
      {galpones.map(g => (
        <CCol key={g.id} md={6} className="mb-3">
          <CCard>
            <CCardHeader>
              <strong>{g.nombre}</strong>
              <CBadge
                color={ocupacion(g.aves, g.capacidad) > 90 ? 'danger' : ocupacion(g.aves, g.capacidad) > 75 ? 'warning' : 'success'}
                className="ms-2"
              >
                {ocupacion(g.aves, g.capacidad)}%
              </CBadge>
            </CCardHeader>
            <CCardBody>
              <div>
                <CIcon icon={cilCheckCircle} className="me-1 text-info" /> {g.ventilacion}
                <CIcon icon={cilLightbulb} className="ms-3 me-1 text-warning" /> {g.iluminacion}
              </div>
              <div className="mt-2">
                <CBadge color="info" className="me-2">Temp: {g.ambiente.temp}°C</CBadge>
                <CBadge color="primary">Humedad: {g.ambiente.humedad}%</CBadge>
              </div>
              <div className="mt-2">
                <strong>Aves:</strong> {g.aves} / {g.capacidad}
              </div>
              <div className="mt-2">
                <strong>Mantenimiento:</strong>
                <ul className="mb-0">
                  {g.mantenimiento.map((m, i) => (
                    <li key={i}>
                      <CIcon icon={cilCalendar} className="me-1" />
                      {m.fecha} - {m.tarea} <CBadge color={m.estado === 'Pendiente' ? 'warning' : 'success'}>{m.estado}</CBadge>
                    </li>
                  ))}
                </ul>
              </div>
              {ocupacion(g.aves, g.capacidad) > 90 && (
                <CAlert color="danger" className="mt-2 p-2">
                  <CIcon icon={cilWarning} className="me-1" />
                  ¡Alerta! El galpón está cerca de su capacidad máxima.
                </CAlert>
              )}
            </CCardBody>
          </CCard>
        </CCol>
      ))}
    </CRow>
  )

  // Listado en tarjetas
  const renderList = () => (
    <CListGroup>
      {galpones.map(g => (
        <CListGroupItem key={g.id} className="d-flex justify-content-between align-items-center">
          <div>
            <strong>{g.nombre}</strong> - {g.aves}/{g.capacidad} aves
            <CBadge
              color={ocupacion(g.aves, g.capacidad) > 90 ? 'danger' : ocupacion(g.aves, g.capacidad) > 75 ? 'warning' : 'success'}
              className="ms-2"
            >
              {ocupacion(g.aves, g.capacidad)}%
            </CBadge>
          </div>
          <div>
            <CBadge color="info" className="me-2">Temp: {g.ambiente.temp}°C</CBadge>
            <CBadge color="primary">Humedad: {g.ambiente.humedad}%</CBadge>
          </div>
        </CListGroupItem>
      ))}
    </CListGroup>
  )

  // Estado rápido (sidebar)
  const { totalAves, totalCap, porcentaje } = ocupacionTotal(galpones)

  return (
    <CRow className="g-3">
      {/* Barra lateral de estado rápido */}
      <CCol md={3}>
        <CSidebar visible={true} className="border rounded shadow-sm" style={{ minHeight: 400 }}>
          <div className="p-3 border-bottom">
            <strong>Estado rápido</strong>
          </div>
          <div className="p-3">
            <div className="mb-2">
              <strong>Ocupación total:</strong>
              <CProgress
                value={porcentaje}
                color={porcentaje > 90 ? 'danger' : porcentaje > 75 ? 'warning' : 'success'}
                className="mt-2"
                animated
              />
              <div className="mt-1">
                <CBadge color="primary">{totalAves} aves</CBadge> / <CBadge color="secondary">{totalCap} capacidad</CBadge>
              </div>
            </div>
            <div className="mb-2">
              <strong>Próximo cierre de registro:</strong>
              <CAlert color="warning" className="p-2 mt-2 mb-0">
                <CIcon icon={cilCalendar} className="me-1" />
                {cierreStr}
              </CAlert>
              <small className="text-muted">El registro se cerrará 3 días laborables antes de cualquier actualización importante.</small>
            </div>
          </div>
        </CSidebar>
      </CCol>

      {/* Panel principal */}
      <CCol md={9}>
        <CCard>
          <CCardHeader className="d-flex justify-content-between align-items-center">
            <span>
              <strong>Gestión de Galpones</strong>
            </span>
            <div>
              <CNav variant="tabs" role="tablist">
                <CNavItem>
                  <CNavLink active={vista === 'grid'} onClick={() => setVista('grid')}>
                    <CIcon icon={cilGrid} /> Cuadrícula
                  </CNavLink>
                </CNavItem>
                <CNavItem>
                  <CNavLink active={vista === 'list'} onClick={() => setVista('list')}>
                    <CIcon icon={cilList} /> Lista
                  </CNavLink>
                </CNavItem>
              </CNav>
              <CButton color="success" className="ms-3" onClick={() => setShowModal(true)}>
                <CIcon icon={cilPlus} /> Nuevo galpón
              </CButton>
            </div>
          </CCardHeader>
          <CCardBody>
            <h6 className="mb-3">Plano interactivo (mapa de calor)</h6>
            {renderPlano()}
            <h6 className="mb-3">Listado de galpones</h6>
            {vista === 'grid' ? renderGrid() : renderList()}
          </CCardBody>
        </CCard>
      </CCol>

      {/* Modal para añadir galpón */}
      <CModal visible={showModal} onClose={() => setShowModal(false)}>
        <CModalHeader>
          <strong>Registrar Galpón</strong>
        </CModalHeader>
        <CModalBody>
          <CForm onSubmit={handleSubmit}>
            <CFormLabel>Nombre del galpón</CFormLabel>
            <CFormInput
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              required
              className="mb-3"
            />
            <CFormLabel>Capacidad máxima</CFormLabel>
            <CFormInput
              name="capacidad"
              type="number"
              value={form.capacidad}
              onChange={handleChange}
              min={1}
              max={capacidadMaxima}
              required
              className="mb-3"
              invalid={form.capacidad && !validarCapacidad(form.capacidad)}
            />
            <CFormLabel>Recuento actual de aves</CFormLabel>
            <CFormInput
              name="aves"
              type="number"
              value={form.aves}
              onChange={handleChange}
              min={0}
              max={form.capacidad || capacidadMaxima}
              required
              className="mb-3"
              invalid={form.aves && Number(form.aves) > Number(form.capacidad)}
            />
            <CFormLabel>Tipo de ventilación</CFormLabel>
            <CFormSelect
              name="ventilacion"
              value={form.ventilacion}
              onChange={handleChange}
              required
              className="mb-3"
            >
              <option value="">Seleccione</option>
              {tiposVentilacion.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </CFormSelect>
            <CFormLabel>Tipo de iluminación</CFormLabel>
            <CFormSelect
              name="iluminacion"
              value={form.iluminacion}
              onChange={handleChange}
              required
              className="mb-3"
            >
              <option value="">Seleccione</option>
              {tiposIluminacion.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </CFormSelect>
            {formError && <CFormFeedback className="d-block mb-2">{formError}</CFormFeedback>}
            <CButton color="success" type="submit" className="w-100">
              Registrar
            </CButton>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </CButton>
        </CModalFooter>
      </CModal>
    </CRow>
  )
}

export default Galpones