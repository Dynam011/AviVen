import React, { useState, useEffect } from 'react'
import {
  CCard, CCardBody, CCardHeader, CCol, CRow, CForm, CFormLabel, CFormInput,
  CButton, CFormSelect, CFormFeedback, CTable, CTableHead, CTableRow,
  CTableHeaderCell, CTableBody, CTableDataCell, CInputGroup, CInputGroupText,
  CModal, CModalHeader, CModalBody, CModalFooter, CBadge
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilSearch, cilPen, cilTrash, cilPlus } from '@coreui/icons'

const API_URL = 'http://localhost:3001'
// Tipos de insumo adaptados a una granja avícola
const tiposInsumo = [
  'Huevo blanco',
  'Pollo vivo',
  'Pollo eviscerado',
  'Gallinaza',
  'Pluma',
  'Alimento balanceado',
  'Vacuna',
  'Limpieza',
  'Otro'
]
const unidades = ['docena', 'unidad', 'kg', 'L', 'g']

const Insumos = () => {
  const [insumos, setInsumos] = useState([])
  const [form, setForm] = useState({
    nombre: '',
    tipo: '',
    unidad: '',
    stock_actual: '',
  })
  const [formError, setFormError] = useState('')
  const [search, setSearch] = useState('')
  const [filtroTipo, setFiltroTipo] = useState('')
  const [editId, setEditId] = useState(null)
  const [showModal, setShowModal] = useState(false)

  // Cargar insumos desde json-server
  useEffect(() => {
    fetch(`${API_URL}/insumos`)
      .then(res => res.json())
      .then(setInsumos)
  }, [])

  // Filtrado dinámico
  const filtered = insumos.filter(item => {
    const matchSearch =
      item.nombre.toLowerCase().includes(search.toLowerCase()) ||
      item.tipo.toLowerCase().includes(search.toLowerCase())
    const matchTipo = filtroTipo ? item.tipo === filtroTipo : true
    return matchSearch && matchTipo
  })

  // Manejo de formulario
  const handleChange = (e) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError('')
    if (!form.nombre || !form.tipo || !form.unidad || form.stock_actual === '') {
      setFormError('Todos los campos son obligatorios.')
      return
    }
    if (isNaN(form.stock_actual) || Number(form.stock_actual) < 0) {
      setFormError('El stock debe ser un número positivo.')
      return
    }
    const payload = {
      nombre: form.nombre,
      tipo: form.tipo,
      unidad: form.unidad,
      stock_actual: Number(form.stock_actual),
    }
    if (editId) {
      await fetch(`${API_URL}/insumos/${editId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload, id_insumo: editId })
      })
      setInsumos(insumos.map(i =>
        i.id_insumo === editId ? { ...payload, id_insumo: editId } : i
      ))
    } else {
      const res = await fetch(`${API_URL}/insumos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      const nuevo = await res.json()
      setInsumos([...insumos, nuevo])
    }
    setForm({ nombre: '', tipo: '', unidad: '', stock_actual: '' })
    setEditId(null)
    setShowModal(false)
  }

  const handleEdit = (item) => {
    setForm({
      nombre: item.nombre,
      tipo: item.tipo,
      unidad: item.unidad,
      stock_actual: item.stock_actual
    })
    setEditId(item.id_insumo)
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    await fetch(`${API_URL}/insumos/${id}`, { method: 'DELETE' })
    setInsumos(insumos.filter(item => item.id_insumo !== id))
  }

  return (
    <CRow className="g-3">
      <CCol md={4}>
        <CCard>
          <CCardHeader>
            <strong>{editId ? 'Editar' : 'Registrar'} Insumo</strong>
          </CCardHeader>
          <CCardBody>
            <CForm onSubmit={handleSubmit}>
              <CFormLabel>Nombre</CFormLabel>
              <CFormInput
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                required
                className="mb-3"
              />
              <CFormLabel>Tipo</CFormLabel>
              <CFormSelect
                name="tipo"
                value={form.tipo}
                onChange={handleChange}
                required
                className="mb-3"
              >
                <option value="">Seleccione tipo</option>
                {tiposInsumo.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </CFormSelect>
              <CFormLabel>Unidad</CFormLabel>
              <CFormSelect
                name="unidad"
                value={form.unidad}
                onChange={handleChange}
                required
                className="mb-3"
              >
                <option value="">Seleccione unidad</option>
                {unidades.map(u => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </CFormSelect>
              <CFormLabel>Stock actual</CFormLabel>
              <CFormInput
                name="stock_actual"
                type="number"
                value={form.stock_actual}
                onChange={handleChange}
                min={0}
                required
                className="mb-3"
              />
              {formError && <CFormFeedback className="d-block mb-2">{formError}</CFormFeedback>}
              <CButton color="success" type="submit" className="w-100">
                {editId ? 'Actualizar' : 'Registrar'}
              </CButton>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
      <CCol md={8}>
        <CCard>
          <CCardHeader className="d-flex flex-wrap justify-content-between align-items-center">
            <span>
              <strong>Listado de Insumos</strong>
            </span>
            <div className="d-flex flex-wrap gap-2">
              <CFormSelect
                size="sm"
                value={filtroTipo}
                onChange={e => setFiltroTipo(e.target.value)}
                style={{ width: 180 }}
              >
                <option value="">Todos los tipos</option>
                {tiposInsumo.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </CFormSelect>
              <CInputGroup size="sm" style={{ width: 200 }}>
                <CInputGroupText>
                  <CIcon icon={cilSearch} />
                </CInputGroupText>
                <CFormInput
                  placeholder="Buscar insumo o tipo..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </CInputGroup>
              <CButton
                color="success"
                size="sm"
                onClick={() => { setShowModal(true); setEditId(null); setForm({ nombre: '', tipo: '', unidad: '', stock_actual: '' }) }}
              >
                <CIcon icon={cilPlus} /> Nuevo insumo
              </CButton>
            </div>
          </CCardHeader>
          <CCardBody style={{ overflowX: 'auto' }}>
            <CTable align="middle" hover responsive>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>ID</CTableHeaderCell>
                  <CTableHeaderCell>Nombre</CTableHeaderCell>
                  <CTableHeaderCell>Tipo</CTableHeaderCell>
                  <CTableHeaderCell>Unidad</CTableHeaderCell>
                  <CTableHeaderCell>Stock actual</CTableHeaderCell>
                  <CTableHeaderCell>Acciones</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {filtered.map(item => (
                  <CTableRow key={item.id_insumo}>
                    <CTableDataCell>{item.id_insumo}</CTableDataCell>
                    <CTableDataCell>{item.nombre}</CTableDataCell>
                    <CTableDataCell>
                      <CBadge color="info">{item.tipo}</CBadge>
                    </CTableDataCell>
                    <CTableDataCell>{item.unidad}</CTableDataCell>
                    <CTableDataCell>
                      <CBadge color={item.stock_actual > 0 ? 'success' : 'danger'}>
                        {item.stock_actual}
                      </CBadge>
                    </CTableDataCell>
                    <CTableDataCell>
                      <CButton
                        color="light"
                        size="sm"
                        className="me-1"
                        onClick={() => handleEdit(item)}
                      >
                        <CIcon icon={cilPen} style={{ color: '#212529' }} />
                      </CButton>
                      <CButton
                        color="light"
                        size="sm"
                        onClick={() => handleDelete(item.id_insumo)}
                      >
                        <CIcon icon={cilTrash} style={{ color: '#dc3545' }} />
                      </CButton>
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          </CCardBody>
        </CCard>
      </CCol>

      {/* Modal para editar/crear insumo */}
      <CModal visible={showModal} onClose={() => setShowModal(false)}>
        <CModalHeader>
          <strong>{editId ? 'Editar' : 'Registrar'} Insumo</strong>
        </CModalHeader>
        <CModalBody>
          <CForm onSubmit={handleSubmit}>
            <CFormLabel>Nombre</CFormLabel>
            <CFormInput
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              required
              className="mb-3"
            />
            <CFormLabel>Tipo</CFormLabel>
            <CFormSelect
              name="tipo"
              value={form.tipo}
              onChange={handleChange}
              required
              className="mb-3"
            >
              <option value="">Seleccione tipo</option>
              {tiposInsumo.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </CFormSelect>
            <CFormLabel>Unidad</CFormLabel>
            <CFormSelect
              name="unidad"
              value={form.unidad}
              onChange={handleChange}
              required
              className="mb-3"
            >
              <option value="">Seleccione unidad</option>
              {unidades.map(u => (
                <option key={u} value={u}>{u}</option>
              ))}
            </CFormSelect>
            <CFormLabel>Stock actual</CFormLabel>
            <CFormInput
              name="stock_actual"
              type="number"
              value={form.stock_actual}
              onChange={handleChange}
              min={0}
              required
              className="mb-3"
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

export default Insumos