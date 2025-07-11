import React, { useState,useEffect } from 'react'
import {
  CCard, CCardBody, CCardHeader, CCol, CRow, CForm, CFormLabel, CFormInput,
  CButton, CFormSelect, CFormFeedback, CTable, CTableHead, CTableRow,
  CTableHeaderCell, CTableBody, CTableDataCell, CInputGroup, CInputGroupText,
  CModal, CModalHeader, CModalBody, CModalFooter, CBadge, CAlert
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilSearch, cilPen, cilTrash, cilCloudDownload } from '@coreui/icons'

const API_URL = 'http://localhost:3001'

const tiposCliente = ['Mayorista', 'Minorista', 'Supermercado', 'Otro']

function exportToCSV(data, usuarios) {
  const header = ['ID Cliente', 'Nombre', 'Tipo', 'Contacto', 'Dirección', 'Usuario Asignado']
  const rows = data.map(row => [
    row.id_cliente,
    row.nombre,
    row.tipo,
    row.contacto,
    row.direccion,
    usuarios.find(u => u.id_usuario === row.id_usuario)?.nombre_completo || 'N/A',
  ])
  const csvContent = [header, ...rows].map(e => e.join(',')).join('\n')
  const blob = new Blob([csvContent], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'clientes.csv'
  a.click()
  URL.revokeObjectURL(url)
}

// Validación de contacto (teléfono o email)
function validarContacto(valor) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const telRegex = /^[0-9+\-\s]{7,}$/
  return emailRegex.test(valor) || telRegex.test(valor)
}

const Clientes = () => {
  const [clientes, setClientes] = useState([])
  const [usuarios, setUsuarios] = useState([])
  const [form, setForm] = useState({
    nombre: '',
    tipo: '',
    contacto: '',
    direccion: '',
    id_usuario: '',
  })
  const [formError, setFormError] = useState('')
  const [search, setSearch] = useState('')
  const [filtroTipo, setFiltroTipo] = useState('')
  const [editId, setEditId] = useState(null)
  const [showModal, setShowModal] = useState(false)

  // Cargar datos desde la API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [clientesRes, usuariosRes] = await Promise.all([
          fetch(`${API_URL}/clientes`),
          fetch(`${API_URL}/usuarios`),
        ])
        setClientes(await clientesRes.json())
        setUsuarios(await usuariosRes.json())
      } catch (error) {
        console.error('Error al cargar los datos:', error)
        setFormError('No se pudieron cargar los datos desde el servidor.')
      }
    }
    fetchData()
  }, [])

  // Estadísticas
  const totalClientes = clientes.length
  const cantidadPorTipo = tiposCliente.map(tipo => ({
    tipo,
    cantidad: clientes.filter(c => c.tipo === tipo).length,
  }))

  // Filtrado dinámico
  const filtered = clientes.filter(item => {
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
    if (!form.nombre || !form.tipo || !form.contacto || !form.direccion || !form.id_usuario) {
      setFormError('Todos los campos son obligatorios.')
      return
    }
    if (!validarContacto(form.contacto)) {
      setFormError('El contacto debe ser un teléfono válido o un email.')
      return
    }

    const payload = {
      ...form,
      id_usuario: Number(form.id_usuario),
    }

    if (editId) {
      const res = await fetch(`${API_URL}/clientes/${editId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload, id: editId }),
      })
      const updated = await res.json()
      setClientes(clientes.map(item => (item.id === editId ? updated : item)))
    } else {
      const maxIdCliente = clientes.length > 0 ? Math.max(...clientes.map(c => c.id_cliente || 0)) : 0
      const nextIdCliente = maxIdCliente + 1
      const newClient = { ...payload, id_cliente: nextIdCliente }

      const res = await fetch(`${API_URL}/clientes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newClient),
      })
      const saved = await res.json()
      setClientes([...clientes, saved])
    }
    setForm({ nombre: '', tipo: '', contacto: '', direccion: '', id_usuario: '' })
    setEditId(null)
    setShowModal(false)
  }

  const handleEdit = (item) => {
    setForm({
      nombre: item.nombre,
      tipo: item.tipo,
      contacto: item.contacto,
      direccion: item.direccion,
      id_usuario: item.id_usuario,
    })
    setEditId(item.id)
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    await fetch(`${API_URL}/clientes/${id}`, { method: 'DELETE' })
    setClientes(clientes.filter(item => item.id !== id))
  }

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
              <strong>Total de clientes:</strong>
              <CBadge color="primary" className="ms-2">{totalClientes}</CBadge>
            </div>
            <div>
              <strong>Cantidad por tipo:</strong>
              <ul className="mb-0">
                {cantidadPorTipo.map(t => (
                  <li key={t.tipo}>
                    <CBadge color="info" className="me-2">{t.tipo}</CBadge>
                    {t.cantidad}
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
              <strong>Gestión de Clientes</strong>
            </span>
            <div className="d-flex flex-wrap gap-2">
              <CFormSelect
                size="sm"
                value={filtroTipo}
                onChange={e => setFiltroTipo(e.target.value)}
                style={{ width: 150 }}
              >
                <option value="">Todos los tipos</option>
                {tiposCliente.map(tipo => (
                  <option key={tipo} value={tipo}>{tipo}</option>
                ))}
              </CFormSelect>
              <CInputGroup size="sm" style={{ width: 200 }}>
                <CInputGroupText>
                  <CIcon icon={cilSearch} />
                </CInputGroupText>
                <CFormInput
                  placeholder="Buscar por nombre o tipo..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </CInputGroup>
              <CButton
                color="info"
                size="sm"
                onClick={() => exportToCSV(filtered, usuarios)}
                title="Exportar CSV"
              >
                <CIcon icon={cilCloudDownload} /> CSV
              </CButton>
              <CButton
                color="success"
                size="sm"
                onClick={() => { setShowModal(true); setEditId(null); setForm({ nombre: '', tipo: '', contacto: '', direccion: '', id_usuario: '' }) }}
              >
                Nuevo cliente
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
                  <CTableHeaderCell>Dirección</CTableHeaderCell>
                  <CTableHeaderCell>Usuario asignado</CTableHeaderCell>
                  <CTableHeaderCell>Acciones</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {filtered.map(item => (
                  <CTableRow key={item.id_cliente || item.id}>
                    <CTableDataCell>{item.id_cliente}</CTableDataCell>
                    <CTableDataCell>{item.nombre}</CTableDataCell>
                    <CTableDataCell>
                      <CBadge color="info">{item.tipo}</CBadge>
                    </CTableDataCell>
                    <CTableDataCell>{item.contacto}</CTableDataCell>
                    <CTableDataCell>{item.direccion}</CTableDataCell>
                    <CTableDataCell>
                      {usuarios.find(u => u.id_usuario === item.id_usuario)?.nombre_completo || 'N/A'}
                    </CTableDataCell>
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
                        onClick={() => handleDelete(item.id)}
                      >
                        <CIcon icon={cilTrash} />
                      </CButton>
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          </CCardBody>
        </CCard>
      </CCol>

      {/* Modal para formulario */}
      <CModal visible={showModal} onClose={() => setShowModal(false)}>
        <CModalHeader>
          <strong>{editId ? 'Editar' : 'Registrar'} Cliente</strong>
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
              {tiposCliente.map(tipo => (
                <option key={tipo} value={tipo}>{tipo}</option>
              ))}
            </CFormSelect>
            <CFormLabel>Contacto</CFormLabel>
            <CFormInput
              name="contacto"
              value={form.contacto}
              onChange={handleChange}
              required
              className="mb-3"
              placeholder="Teléfono o email"
              invalid={form.contacto && !validarContacto(form.contacto)}
            />
            <CFormLabel>Dirección</CFormLabel>
            <CFormInput
              name="direccion"
              value={form.direccion}
              onChange={handleChange}
              required
              className="mb-3"
            />
            <CFormLabel>Usuario asignado</CFormLabel>
            <CFormSelect
              name="id_usuario"
              value={form.id_usuario}
              onChange={handleChange}
              required
              className="mb-3"
            >
              <option value="">Seleccione usuario</option>
              {usuarios.map(u => (
                <option key={u.id_usuario} value={u.id_usuario}>{u.nombre_completo}</option>
              ))}
            </CFormSelect>
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

export default Clientes