import React, { useState, useEffect } from 'react'
import {
  CCard, CCardBody, CCardHeader, CCol, CRow, CForm, CFormLabel, CFormInput,
  CButton, CFormSelect, CFormFeedback, CTable, CTableHead, CTableRow,
  CTableHeaderCell, CTableBody, CTableDataCell, CInputGroup, CInputGroupText,
  CModal, CModalHeader, CModalBody, CModalFooter, CBadge
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilSearch, cilPen, cilTrash } from '@coreui/icons'

const tiposProducto = ['huevo', 'ave', 'subproducto']

const API_URL = 'http://localhost:3001'

const Production = () => {
  const [produccion, setProduccion] = useState([])
  const [lotes, setLotes] = useState([])
  const [galpones, setGalpones] = useState([])
  const [form, setForm] = useState({
    fecha: '',
    id_lote: '',
    tipo_producto: '',
    cantidad: '',
    observaciones: '',
  })
  const [formError, setFormError] = useState('')
  const [search, setSearch] = useState('')
  const [filtroGalpon, setFiltroGalpon] = useState('')
  const [filtroTipo, setFiltroTipo] = useState('')
  const [filtroFecha, setFiltroFecha] = useState('')
  const [editId, setEditId] = useState(null)
  const [showModal, setShowModal] = useState(false)

  // Cargar datos desde json-server
  useEffect(() => {
    fetch(`${API_URL}/produccion`)
      .then(res => res.json())
      .then(data => setProduccion(data))
    fetch(`${API_URL}/lotes`)
      .then(res => res.json())
      .then(data => setLotes(data))
    fetch(`${API_URL}/galpones`)
      .then(res => res.json())
      .then(data => setGalpones(data))
  }, [])

  // Filtrado dinámico
  const filtered = produccion.filter(item => {
    const lote = lotes.find(l => l.id_lote === item.id_lote)
    const galpon = galpones.find(g => g.id_galpon === lote?.id_galpon)
    const matchSearch =
      (lote?.tipo?.toLowerCase().includes(search.toLowerCase()) || '') ||
      (item.tipo_producto?.toLowerCase().includes(search.toLowerCase()) || '') ||
      (item.observaciones?.toLowerCase().includes(search.toLowerCase()) || '')
    const matchGalpon = filtroGalpon ? (galpon && galpon.id_galpon === Number(filtroGalpon)) : true
    const matchTipo = filtroTipo ? item.tipo_producto === filtroTipo : true
    const matchFecha = filtroFecha ? item.fecha === filtroFecha : true
    return matchSearch && matchGalpon && matchTipo && matchFecha
  })

  // Manejo de formulario
  const handleChange = (e) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError('')
    if (!form.fecha || !form.id_lote || !form.tipo_producto || !form.cantidad) {
      setFormError('Todos los campos obligatorios deben completarse.')
      return
    }
    if (new Date(form.fecha) > new Date()) {
      setFormError('La fecha no puede ser futura.')
      return
    }
    if (isNaN(form.cantidad) || Number(form.cantidad) <= 0) {
      setFormError('La cantidad debe ser un número positivo.')
      return
    }
    const payload = {
      fecha: form.fecha,
      id_lote: Number(form.id_lote),
      tipo_producto: form.tipo_producto,
      cantidad: Number(form.cantidad),
      observaciones: form.observaciones,
    }

    // --- Sincronizar con inventario ---
    // Buscar insumo relacionado en inventario
    const inventarioRes = await fetch(`${API_URL}/insumos?nombre=${encodeURIComponent(form.tipo_producto)}`)
const inventarioItems = await inventarioRes.json()
let insumo = inventarioItems[0]

// Si no existe el insumo, créalo con id_insumo único y consecutivo
if (!insumo) {
  // Obtener todos los insumos para calcular el siguiente id_insumo
  const allInsumosRes = await fetch(`${API_URL}/insumos`)
  const allInsumos = await allInsumosRes.json()
  // Buscar el mayor id_insumo numérico (siempre número, si no, ajusta el parseo)
  const maxId = allInsumos.length > 0
    ? Math.max(...allInsumos.map(i => Number(i.id_insumo) || 0))
    : 0
  const nextId = maxId + 1

  const nuevoInsumoRes = await fetch(`${API_URL}/insumos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id_insumo: nextId,
      nombre: form.tipo_producto,
      tipo: 'Producto',
      unidad: 'unidad',
      stock_actual: Number(form.cantidad),
    }),
  })
  insumo = await nuevoInsumoRes.json()
} else {
  // Si existe, suma la cantidad producida al stock_actual
  await fetch(`${API_URL}/insumos/${insumo.id_insumo}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      stock_actual: Number(insumo.stock_actual) + Number(form.cantidad),
    }),
  })
}

    if (editId) {
      // Editar producción: ajustar inventario según la diferencia
      const prodAnterior = produccion.find(item => item.id_produccion === editId)
      const diferencia = Number(form.cantidad) - Number(prodAnterior.cantidad)
      if (insumo) {
        await fetch(`${API_URL}/insumos/${insumo.id_insumo}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            stock_actual: Number(insumo.stock_actual) + diferencia,
          }),
        })
      }
      await fetch(`${API_URL}/produccion/${editId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      setProduccion(produccion.map(item =>
        item.id_produccion === editId
          ? { ...payload, id_produccion: editId }
          : item
      ))
    } else {
      // Crear producción
      const res = await fetch(`${API_URL}/produccion`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const nuevo = await res.json()
      setProduccion([...produccion, nuevo])
    }
    setForm({ fecha: '', id_lote: '', tipo_producto: '', cantidad: '', observaciones: '' })
    setEditId(null)
    setShowModal(false)
  }

  const handleEdit = (item) => {
    setForm({
      fecha: item.fecha,
      id_lote: item.id_lote,
      tipo_producto: item.tipo_producto,
      cantidad: item.cantidad,
      observaciones: item.observaciones,
    })
    setEditId(item.id_produccion)
    setShowModal(true)
  }

  // Eliminar producción y restar del inventario
  const handleDelete = async (id) => {
    const prod = produccion.find(item => item.id_produccion === id)
    if (prod) {
      // Buscar insumo relacionado
      const inventarioRes = await fetch(`${API_URL}/insumos?nombre=${encodeURIComponent(prod.tipo_producto)}`)
      const inventarioItems = await inventarioRes.json()
      const insumo = inventarioItems[0]
      if (insumo) {
        await fetch(`${API_URL}/insumos/${insumo.id_insumo}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            stock_actual: Math.max(0, Number(insumo.stock_actual) - Number(prod.cantidad)),
          }),
        })
      }
    }
    await fetch(`${API_URL}/produccion/${id}`, { method: 'DELETE' })
    setProduccion(produccion.filter(item => item.id_produccion !== id))
  }

  // Estadísticas
  const totalProduccion = produccion.reduce((sum, p) => sum + Number(p.cantidad), 0)
  const produccionPorTipo = tiposProducto.map(tipo => ({
    tipo,
    cantidad: produccion.filter(p => p.tipo_producto === tipo).reduce((sum, p) => sum + Number(p.cantidad), 0),
  }))

  return (
    <CRow className="g-3">
      {/* Panel lateral de estadísticas */}
      <CCol md={3}>
        <CCard>
          <CCardHeader>
            <strong>Estadísticas</strong>
          </CCardHeader>
          <CCardBody>
            <div className="mb-2">
              <strong>Producción total:</strong>
              <CBadge color="primary" className="ms-2">{totalProduccion}</CBadge>
            </div>
            <div>
              <strong>Por tipo:</strong>
              <ul className="mb-0">
                {produccionPorTipo.map(t => (
                  <li key={t.tipo}>
                    <CBadge color="info" className="me-2">{t.tipo}</CBadge>
                    {t.cantidad}
                    <div className="progress my-1" style={{ height: 8, background: "#e9ecef" }}>
                      <div
                        className="progress-bar"
                        role="progressbar"
                        style={{
                          width: totalProduccion > 0 ? `${(t.cantidad / totalProduccion) * 100}%` : '0%',
                          background: "#4e73df"
                        }}
                        aria-valuenow={t.cantidad}
                        aria-valuemin="0"
                        aria-valuemax={totalProduccion}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </CCardBody>
        </CCard>
      </CCol>

      {/* Panel principal */}
      <CCol md={9}>
        <CCard>
          <CCardHeader className="d-flex flex-wrap justify-content-between align-items-center">
            <span>
              <strong>Gestión de Producción</strong>
            </span>
            <div className="d-flex flex-wrap gap-2">
              <CFormSelect
                size="sm"
                value={filtroGalpon}
                onChange={e => setFiltroGalpon(e.target.value)}
                style={{ width: 140 }}
              >
                <option value="">Todos los galpones</option>
                {galpones.map(g => (
                  <option key={g.id_galpon} value={g.id_galpon}>{g.nombre}</option>
                ))}
              </CFormSelect>
              <CFormSelect
                size="sm"
                value={filtroTipo}
                onChange={e => setFiltroTipo(e.target.value)}
                style={{ width: 140 }}
              >
                <option value="">Todos los productos</option>
                {tiposProducto.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </CFormSelect>
              <CFormInput
                size="sm"
                type="date"
                value={filtroFecha}
                onChange={e => setFiltroFecha(e.target.value)}
                style={{ width: 140 }}
              />
              <CInputGroup size="sm" style={{ width: 200 }}>
                <CInputGroupText>
                  <CIcon icon={cilSearch} />
                </CInputGroupText>
                <CFormInput
                  placeholder="Buscar lote, tipo o observación..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </CInputGroup>
              <CButton
                color="success"
                size="sm"
                onClick={() => { setShowModal(true); setEditId(null); setForm({ fecha: '', id_lote: '', tipo_producto: '', cantidad: '', observaciones: '' }) }}
              >
                Nueva producción
              </CButton>
            </div>
          </CCardHeader>
          <CCardBody style={{ overflowX: 'auto' }}>
            <CTable align="middle" hover responsive>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>ID</CTableHeaderCell>
                  <CTableHeaderCell>Fecha</CTableHeaderCell>
                  <CTableHeaderCell>Lote</CTableHeaderCell>
                  <CTableHeaderCell>Galpón</CTableHeaderCell>
                  <CTableHeaderCell>Tipo</CTableHeaderCell>
                  <CTableHeaderCell>Cantidad</CTableHeaderCell>
                  <CTableHeaderCell>Observaciones</CTableHeaderCell>
                  <CTableHeaderCell>Acciones</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {filtered.map(item => {
                  const lote = lotes.find(l => l.id_lote === item.id_lote)
                  const galpon = galpones.find(g => g.id_galpon === lote?.id_galpon)
                  return (
                    <CTableRow key={item.id_produccion}>
                      <CTableDataCell>{item.id_produccion}</CTableDataCell>
                      <CTableDataCell>{item.fecha}</CTableDataCell>
                      <CTableDataCell>{lote?.tipo || '-'}</CTableDataCell>
                      <CTableDataCell>{galpon?.nombre || '-'}</CTableDataCell>
                      <CTableDataCell>
                        <CBadge color="info">{item.tipo_producto}</CBadge>
                      </CTableDataCell>
                      <CTableDataCell>
                        <CBadge color="primary">{item.cantidad}</CBadge>
                      </CTableDataCell>
                      <CTableDataCell>{item.observaciones || '-'}</CTableDataCell>
                      <CTableDataCell>
                        <CButton
                          color="info"
                          size="sm"
                          className="me-1"
                          onClick={() => handleEdit(item)}
                        >
                          <CIcon icon={cilPen} />
                        </CButton>
                        <CButton
                          color="danger"
                          size="sm"
                          onClick={() => handleDelete(item.id_produccion)}
                        >
                          <CIcon icon={cilTrash} />
                        </CButton>
                      </CTableDataCell>
                    </CTableRow>
                  )
                })}
              </CTableBody>
            </CTable>
          </CCardBody>
        </CCard>
      </CCol>

      {/* Modal para formulario */}
      <CModal visible={showModal} onClose={() => setShowModal(false)}>
        <CModalHeader>
          <strong>{editId ? 'Editar' : 'Registrar'} Producción</strong>
        </CModalHeader>
        <CModalBody>
          <CForm onSubmit={handleSubmit}>
            <CFormLabel>Fecha</CFormLabel>
            <CFormInput
              name="fecha"
              type="date"
              value={form.fecha}
              onChange={handleChange}
              required
              className="mb-3"
              max={new Date().toISOString().split('T')[0]}
            />
            <CFormLabel>Lote</CFormLabel>
            <CFormSelect
              name="id_lote"
              value={form.id_lote}
              onChange={handleChange}
              required
              className="mb-3"
            >
              <option value="">Seleccione lote</option>
              {lotes.map(l => (
                <option key={l.id_lote} value={l.id_lote}>
                  {l.tipo} (Galpón: {galpones.find(g => g.id_galpon === l.id_galpon)?.nombre || '-'})
                </option>
              ))}
            </CFormSelect>
            <CFormLabel>Tipo de producto</CFormLabel>
            <CFormSelect
              name="tipo_producto"
              value={form.tipo_producto}
              onChange={handleChange}
              required
              className="mb-3"
            >
              <option value="">Seleccione tipo</option>
              {tiposProducto.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </CFormSelect>
            <CFormLabel>Cantidad</CFormLabel>
            <CFormInput
              name="cantidad"
              type="number"
              value={form.cantidad}
              onChange={handleChange}
              min={0}
              required
              className="mb-3"
            />
            <CFormLabel>Observaciones</CFormLabel>
            <CFormInput
              name="observaciones"
              value={form.observaciones}
              onChange={handleChange}
              className="mb-3"
              placeholder="Observaciones adicionales"
            />
            {formError && <CFormFeedback className="d-block mb-2">{formError}</CFormFeedback>}
            <CButton color="success" type="submit" className="w-100">
              {editId ? 'Actualizar' : 'Registrar'}
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

export default Production