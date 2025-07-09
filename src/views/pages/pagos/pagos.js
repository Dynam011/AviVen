import React, { useState } from 'react'
import {
  CCard, CCardBody, CCardHeader, CCol, CRow, CForm, CFormLabel, CFormInput,
  CButton, CFormSelect, CFormFeedback, CTable, CTableHead, CTableRow,
  CTableHeaderCell, CTableBody, CTableDataCell, CInputGroup, CInputGroupText,
  CModal, CModalHeader, CModalBody, CModalFooter, CBadge, CPagination, CPaginationItem
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilSearch, cilPen, cilTrash } from '@coreui/icons'

// Mock de ventas para selector
const mockVentas = [
  { id_venta: 1, cliente: 'Granja El Sol' },
  { id_venta: 2, cliente: 'Distribuidora Norte' },
  { id_venta: 3, cliente: 'Supermercado Sur' },
]

// Mock de pagos
const mockPagos = [
  { id_pago: 1, id_venta: 1, fecha: '2025-06-01', monto: 500, metodo: 'Efectivo', referencia: 'REC-001' },
  { id_pago: 2, id_venta: 2, fecha: '2025-06-02', monto: 800, metodo: 'Transferencia', referencia: 'TRF-123' },
  { id_pago: 3, id_venta: 1, fecha: '2025-06-03', monto: 700, metodo: 'Tarjeta', referencia: '' },
]

const metodosPago = ['Efectivo', 'Transferencia', 'Tarjeta']

const pageSize = 5

const pagos = () => {
  const [pagos, setPagos] = useState(mockPagos)
  const [ventas] = useState(mockVentas)
  const [form, setForm] = useState({
    id_venta: '',
    fecha: '',
    monto: '',
    metodo: '',
    referencia: '',
  })
  const [formError, setFormError] = useState('')
  const [search, setSearch] = useState('')
  const [filtroFecha, setFiltroFecha] = useState('')
  const [filtroMetodo, setFiltroMetodo] = useState('')
  const [editId, setEditId] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [page, setPage] = useState(1)

  // Estadísticas
  const totalPagos = pagos.length
  const totalIngresado = pagos.reduce((sum, p) => sum + Number(p.monto), 0)

  // Filtro principal
  function filtrar(p) {
    const matchVenta = search
      ? String(p.id_venta).includes(search) ||
        (p.referencia && p.referencia.toLowerCase().includes(search.toLowerCase()))
      : true
    const matchFecha = filtroFecha ? p.fecha === filtroFecha : true
    const matchMetodo = filtroMetodo ? p.metodo === filtroMetodo : true
    return matchVenta && matchFecha && matchMetodo
  }

  const pagosFiltrados = pagos.filter(filtrar)
  const totalPages = Math.ceil(pagosFiltrados.length / pageSize)
  const pagosPaginados = pagosFiltrados.slice((page - 1) * pageSize, page * pageSize)

  // Manejo de formulario
  const handleChange = (e) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setFormError('')
    if (!form.id_venta || !form.fecha || !form.monto || !form.metodo) {
      setFormError('Todos los campos obligatorios deben completarse.')
      return
    }
    if (!ventas.some(v => v.id_venta === Number(form.id_venta))) {
      setFormError('La venta seleccionada no existe.')
      return
    }
    if (new Date(form.fecha) > new Date()) {
      setFormError('La fecha no puede ser futura.')
      return
    }
    if (isNaN(form.monto) || Number(form.monto) <= 0) {
      setFormError('El monto debe ser un número positivo.')
      return
    }
    if (!metodosPago.includes(form.metodo)) {
      setFormError('Seleccione un método de pago válido.')
      return
    }
    if (editId) {
      setPagos(pagos.map(p =>
        p.id_pago === editId
          ? { ...form, id_pago: editId, id_venta: Number(form.id_venta), monto: Number(form.monto) }
          : p
      ))
    } else {
      setPagos([
        ...pagos,
        {
          ...form,
          id_pago: pagos.length ? Math.max(...pagos.map(p => p.id_pago)) + 1 : 1,
          id_venta: Number(form.id_venta),
          monto: Number(form.monto),
        },
      ])
    }
    setForm({ id_venta: '', fecha: '', monto: '', metodo: '', referencia: '' })
    setEditId(null)
    setShowModal(false)
  }

  const handleEdit = (item) => {
    setForm({
      id_venta: item.id_venta,
      fecha: item.fecha,
      monto: item.monto,
      metodo: item.metodo,
      referencia: item.referencia,
    })
    setEditId(item.id_pago)
    setShowModal(true)
  }

  const handleDelete = (id) => {
    setPagos(pagos.filter(item => item.id_pago !== id))
  }

  // Reset paginación al filtrar
  React.useEffect(() => { setPage(1) }, [search, filtroFecha, filtroMetodo])

  return (
    <CRow className="g-3">
      {/* Panel lateral de estadísticas */}
      <CCol md={3}>
        <CCard color="success" textColor="white" className="mb-3">
          <CCardHeader>
            <strong>Estadísticas</strong>
          </CCardHeader>
          <CCardBody>
            <div className="mb-2">
              <strong>Total de pagos:</strong>
              <CBadge  className="ms-2">{totalPagos}</CBadge>
            </div>
            <div>
              <strong>Total ingresado:</strong>
              <CBadge className="ms-2">
                ${totalIngresado.toLocaleString()}
              </CBadge>
            </div>
          </CCardBody>
        </CCard>
      </CCol>

      {/* Panel principal */}
      <CCol md={9}>
        <CCard>
          <CCardHeader className="d-flex flex-wrap justify-content-between align-items-center bg-success text-white">
            <span>
              <strong>Gestión de Pagos</strong>
            </span>
            <div className="d-flex flex-wrap gap-2">
              <CInputGroup size="sm" style={{ width: 180 }}>
                <CInputGroupText>
                  <CIcon icon={cilSearch} />
                </CInputGroupText>
                <CFormInput
                  placeholder="Buscar por venta o referencia"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </CInputGroup>
              <CFormInput
                size="sm"
                type="date"
                value={filtroFecha}
                onChange={e => setFiltroFecha(e.target.value)}
                style={{ width: 140 }}
              />
              <CFormSelect
                size="sm"
                value={filtroMetodo}
                onChange={e => setFiltroMetodo(e.target.value)}
                style={{ width: 140 }}
              >
                <option value="">Todos los métodos</option>
                {metodosPago.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </CFormSelect>
              <CButton
                color="success"
                size="sm"
                onClick={() => { setShowModal(true); setEditId(null); setForm({ id_venta: '', fecha: '', monto: '', metodo: '', referencia: '' }) }}
              >
                Nuevo pago
              </CButton>
            </div>
          </CCardHeader>
          <CCardBody style={{ overflowX: 'auto' }}>
            <CTable align="middle" hover responsive>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Pago</CTableHeaderCell>
                  <CTableHeaderCell>Venta</CTableHeaderCell>
                  <CTableHeaderCell>Fecha</CTableHeaderCell>
                  <CTableHeaderCell>Monto</CTableHeaderCell>
                  <CTableHeaderCell>Método</CTableHeaderCell>
                  <CTableHeaderCell>Referencia</CTableHeaderCell>
                  <CTableHeaderCell>Acciones</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {pagosPaginados.map(item => (
                  <CTableRow key={item.id_pago}>
                    <CTableDataCell>{item.id_pago}</CTableDataCell>
                    <CTableDataCell>
                      <CBadge color="info" className="ms-1">{ventas.find(v => v.id_venta === item.id_venta)?.cliente || ''}</CBadge>
                    </CTableDataCell>
                    <CTableDataCell>{item.fecha}</CTableDataCell>
                    <CTableDataCell>
                      <CBadge color="success">${Number(item.monto).toLocaleString()}</CBadge>
                    </CTableDataCell>
                    <CTableDataCell>
                      <CBadge color={
                        item.metodo === 'Efectivo'
                          ? 'secondary'
                          : item.metodo === 'Transferencia'
                          ? 'primary'
                          : 'warning'
                      }>
                        {item.metodo}
                      </CBadge>
                    </CTableDataCell>
                    <CTableDataCell>{item.referencia || '-'}</CTableDataCell>
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
                        onClick={() => handleDelete(item.id_pago)}
                      >
                        <CIcon icon={cilTrash} />
                      </CButton>
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
            {/* Paginación */}
            <div className="d-flex justify-content-end mt-3">
              <CPagination align="end">
                <CPaginationItem disabled={page === 1} onClick={() => setPage(page - 1)}>
                  &laquo;
                </CPaginationItem>
                {[...Array(totalPages)].map((_, idx) => (
                  <CPaginationItem
                    key={idx}
                    active={page === idx + 1}
                    onClick={() => setPage(idx + 1)}
                  >
                    {idx + 1}
                  </CPaginationItem>
                ))}
                <CPaginationItem disabled={page === totalPages || totalPages === 0} onClick={() => setPage(page + 1)}>
                  &raquo;
                </CPaginationItem>
              </CPagination>
            </div>
          </CCardBody>
        </CCard>
      </CCol>

      {/* Modal para formulario */}
      <CModal visible={showModal} onClose={() => setShowModal(false)}>
        <CModalHeader>
          <strong>{editId ? 'Editar' : 'Registrar'} Pago</strong>
        </CModalHeader>
        <CModalBody>
          <CForm onSubmit={handleSubmit}>
            <CFormLabel>Venta</CFormLabel>
            <CFormSelect
              name="id_venta"
              value={form.id_venta}
              onChange={handleChange}
              required
              className="mb-3"
            >
              <option value="">Seleccione venta</option>
              {ventas.map(v => (
                <option key={v.id_venta} value={v.id_venta}>
                  {v.id_venta} - {v.cliente}
                </option>
              ))}
            </CFormSelect>
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
            <CFormLabel>Monto</CFormLabel>
            <CFormInput
              name="monto"
              type="number"
              value={form.monto}
              onChange={handleChange}
              min={0}
              required
              className="mb-3"
            />
            <CFormLabel>Método</CFormLabel>
            <CFormSelect
              name="metodo"
              value={form.metodo}
              onChange={handleChange}
              required
              className="mb-3"
            >
              <option value="">Seleccione método</option>
              {metodosPago.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </CFormSelect>
            <CFormLabel>Referencia (opcional)</CFormLabel>
            <CFormInput
              name="referencia"
              value={form.referencia}
              onChange={handleChange}
              className="mb-3"
              placeholder="Referencia de pago"
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

export default pagos