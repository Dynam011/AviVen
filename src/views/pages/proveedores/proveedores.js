import React, { useEffect, useState } from 'react'
import {
  CCard, CCardBody, CCardHeader, CCol, CRow, CForm, CFormLabel, CFormInput,
  CButton, CFormSelect, CFormFeedback, CTable, CTableHead, CTableRow,
  CTableHeaderCell, CTableBody, CTableDataCell, CInputGroup, CInputGroupText,
  CModal, CModalHeader, CModalBody, CModalFooter, CBadge
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilSearch, cilPen, cilTrash, cilPlus, cilPhone, cilEnvelopeClosed } from '@coreui/icons'

const API_URL = 'http://localhost:3001'
const tiposProveedor = [
  'Alimentos',
  'Vacunas',
  'Equipos',
  'Servicios',
  'Transporte',
  'Otro'
]

const Proveedores = () => {
  const [proveedores, setProveedores] = useState([])
  const [form, setForm] = useState({
    nombre: '',
    tipo: '',
    contacto: '',
    telefono: '',
    email: '',
  })
  const [formError, setFormError] = useState('')
  const [search, setSearch] = useState('')
  const [filtroTipo, setFiltroTipo] = useState('')
  const [editId, setEditId] = useState(null)
  const [showModal, setShowModal] = useState(false)

  // Cargar proveedores desde json-server
  useEffect(() => {
    fetch(`${API_URL}/proveedores`)
      .then(res => res.json())
      .then(setProveedores)
  }, [])

  // Filtrado dinámico
  const filtered = proveedores.filter(item => {
    const matchSearch =
      item.nombre.toLowerCase().includes(search.toLowerCase()) ||
      item.tipo.toLowerCase().includes(search.toLowerCase()) ||
      item.contacto.toLowerCase().includes(search.toLowerCase())
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
    if (!form.nombre || !form.tipo || !form.contacto || !form.telefono || !form.email) {
      setFormError('Todos los campos son obligatorios.')
      return
    }
    // Validación simple de email y teléfono
    if (!/\S+@\S+\.\S+/.test(form.email)) {
      setFormError('Email inválido.')
      return
    }
    if (!/^[\d\s()+-]{7,}$/.test(form.telefono)) {
      setFormError('Teléfono inválido.')
      return
    }
    const payload = {
      nombre: form.nombre,
      tipo: form.tipo,
      contacto: form.contacto,
      telefono: form.telefono,
      email: form.email,
    }
    if (editId) {
      await fetch(`${API_URL}/proveedores/${editId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload, id_proveedor: editId })
      })
      setProveedores(proveedores.map(i =>
        i.id_proveedor === editId ? { ...payload, id_proveedor: editId } : i
      ))
    } else {
      const res = await fetch(`${API_URL}/proveedores`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      const nuevo = await res.json()
      setProveedores([...proveedores, nuevo])
    }
    setForm({ nombre: '', tipo: '', contacto: '', telefono: '', email: '' })
    setEditId(null)
    setShowModal(false)
  }

  const handleEdit = (item) => {
    setForm({
      nombre: item.nombre,
      tipo: item.tipo,
      contacto: item.contacto,
      telefono: item.telefono,
      email: item.email
    })
    setEditId(item.id_proveedor)
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    await fetch(`${API_URL}/proveedores/${id}`, { method: 'DELETE' })
    setProveedores(proveedores.filter(item => item.id_proveedor !== id))
  }

  return (
    <CRow className="g-3">
      <CCol md={4}>
        <CCard>
          <CCardHeader>
            <strong>{editId ? 'Editar' : 'Registrar'} Proveedor</strong>
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
                {tiposProveedor.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </CFormSelect>
              <CFormLabel>Contacto</CFormLabel>
              <CFormInput
                name="contacto"
                value={form.contacto}
                onChange={handleChange}
                required
                className="mb-3"
              />
              <CFormLabel>Teléfono</CFormLabel>
              <CFormInput
                name="telefono"
                value={form.telefono}
                onChange={handleChange}
                required
                className="mb-3"
              />
              <CFormLabel>Email</CFormLabel>
              <CFormInput
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
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
              <strong>Listado de Proveedores</strong>
            </span>
            <div className="d-flex flex-wrap gap-2">
              <CFormSelect
                size="sm"
                value={filtroTipo}
                onChange={e => setFiltroTipo(e.target.value)}
                style={{ width: 150 }}
              >
                <option value="">Todos los tipos</option>
                {tiposProveedor.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </CFormSelect>
              <CInputGroup size="sm" style={{ width: 200 }}>
                <CInputGroupText>
                  <CIcon icon={cilSearch} />
                </CInputGroupText>
                <CFormInput
                  placeholder="Buscar proveedor, tipo o contacto..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </CInputGroup>
              <CButton
                color="success"
                size="sm"
                onClick={() => { setShowModal(true); setEditId(null); setForm({ nombre: '', tipo: '', contacto: '', telefono: '', email: '' }) }}
              >
                <CIcon icon={cilPlus} /> Nuevo proveedor
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
                  <CTableHeaderCell>Contacto</CTableHeaderCell>
                  <CTableHeaderCell>Teléfono</CTableHeaderCell>
                  <CTableHeaderCell>Email</CTableHeaderCell>
                  <CTableHeaderCell>Acciones</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {filtered.map(item => (
                  <CTableRow key={item.id_proveedor}>
                    <CTableDataCell>{item.id_proveedor}</CTableDataCell>
                    <CTableDataCell>{item.nombre}</CTableDataCell>
                    <CTableDataCell>
                      <CBadge color="info">{item.tipo}</CBadge>
                    </CTableDataCell>
                    <CTableDataCell>{item.contacto}</CTableDataCell>
                    <CTableDataCell>
                      <CIcon icon={cilPhone} className="me-1 text-success" />
                      {item.telefono}
                    </CTableDataCell>
                    <CTableDataCell>
                      <CIcon icon={cilEnvelopeClosed} className="me-1 text-primary" />
                      {item.email}
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
                        onClick={() => handleDelete(item.id_proveedor)}
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

      {/* Modal para editar/crear proveedor */}
      <CModal visible={showModal} onClose={() => setShowModal(false)}>
        <CModalHeader>
          <strong>{editId ? 'Editar' : 'Registrar'} Proveedor</strong>
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
              {tiposProveedor.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </CFormSelect>
            <CFormLabel>Contacto</CFormLabel>
            <CFormInput
              name="contacto"
              value={form.contacto}
              onChange={handleChange}
              required
              className="mb-3"
            />
            <CFormLabel>Teléfono</CFormLabel>
            <CFormInput
              name="telefono"
              value={form.telefono}
              onChange={handleChange}
              required
              className="mb-3"
            />
            <CFormLabel>Email</CFormLabel>
            <CFormInput
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
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

export default Proveedores