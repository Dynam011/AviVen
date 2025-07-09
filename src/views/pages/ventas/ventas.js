import React, { useState, useEffect } from 'react'
import {
  CCard, CCardBody, CCardHeader, CCol, CRow, CForm, CFormLabel, CFormInput,
  CButton, CFormSelect, CFormFeedback, CTable, CTableHead, CTableRow,
  CTableHeaderCell, CTableBody, CTableDataCell, CInputGroup, CInputGroupText,
  CModal, CModalHeader, CModalBody, CModalFooter, CBadge, CPagination, CPaginationItem
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilSearch, cilPen, cilTrash } from '@coreui/icons'

const API_URL = 'http://localhost:3001'
const estadosVenta = ['Pendiente', 'Pagado', 'Cancelado']
const pageSize = 5

const Ventas = () => {
  const [ventas, setVentas] = useState([])
  const [clientes, setClientes] = useState([])
  const [inventario, setInventario] = useState([])
  const [insumos, setInsumos] = useState([])
  const [form, setForm] = useState({
    id_cliente: '',
    fecha: '',
    total: '0.00',
    estado: '',
    descripcion: '',
    id_insumo: '',
    cantidad: '',
    precio_unitario: '',
  })
  const [formError, setFormError] = useState('')
  const [search, setSearch] = useState('')
  const [filtroFecha, setFiltroFecha] = useState('')
  const [filtroEstado, setFiltroEstado] = useState('')
  const [editId, setEditId] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [page, setPage] = useState(1)

  // Cargar datos desde json-server
  useEffect(() => {
    fetch(`${API_URL}/ventas`).then(res => res.json()).then(setVentas)
    fetch(`${API_URL}/clientes`).then(res => res.json()).then(setClientes)
    fetch(`${API_URL}/inventario`).then(res => res.json()).then(setInventario)
    fetch(`${API_URL}/insumos`).then(res => res.json()).then(setInsumos)
  }, [])

  // Calcular total automáticamente
  useEffect(() => {
    const cantidad = Number(form.cantidad)
    const precio = Number(form.precio_unitario)
    if (!isNaN(cantidad) && !isNaN(precio) && cantidad > 0 && precio >= 0) {
      setForm((f) => ({ ...f, total: (cantidad * precio).toFixed(2) }))
    } else {
      setForm((f) => ({ ...f, total: '0.00' }))
    }
  }, [form.cantidad, form.precio_unitario])

  // Estadísticas
  const totalVentas = ventas.length
  const filtrar = (v) => {
    const cliente = clientes.find(c => c.id_cliente === v.id_cliente)
    const matchCliente = search
      ? (cliente?.nombre?.toLowerCase().includes(search.toLowerCase()) || String(v.id_cliente).includes(search))
      : true
    const matchFecha = filtroFecha ? v.fecha === filtroFecha : true
    const matchEstado = filtroEstado ? v.estado === filtroEstado : true
    return matchCliente && matchFecha && matchEstado
  }
  const ventasFiltradas = ventas.filter(filtrar)
  const totalFiltradas = ventasFiltradas.length
  const totalPages = Math.ceil(ventasFiltradas.length / pageSize)
  const ventasPaginadas = ventasFiltradas.slice((page - 1) * pageSize, page * pageSize)

  // Manejo de formulario
  const handleChange = (e) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
    if (name === 'id_insumo') {
      const insumo = insumos.find(i => i.id_insumo === Number(value))
      setForm(f => ({
        ...f,
        precio_unitario: insumo ? insumo.precio_unitario || '' : ''
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError('')
    // Validaciones
    if (
      !form.id_cliente ||
      !form.fecha ||
      !form.estado ||
      !form.descripcion ||
      !form.id_insumo ||
      !form.cantidad
    ) {
      setFormError('Todos los campos son obligatorios.')
      return
    }
    if (!clientes.some(c => c.id_cliente === Number(form.id_cliente))) {
      setFormError('El cliente seleccionado no existe.')
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
    if (isNaN(form.precio_unitario) || Number(form.precio_unitario) < 0) {
      setFormError('El precio unitario no puede ser negativo.')
      return
    }
    const insumo = insumos.find(i => i.id_insumo === Number(form.id_insumo))
    if (!insumo) {
      setFormError('Debe seleccionar un insumo válido.')
      return
    }
    // Verificar stock
    const stockActual = insumo.stock_actual || 0
    if (Number(form.cantidad) > stockActual) {
      setFormError('No hay suficiente stock para esta venta.')
      return
    }

    // Actualizar inventario (restar stock)
    const nuevoStock = stockActual - Number(form.cantidad)
    await fetch(`${API_URL}/insumos/${insumo.id_insumo}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stock_actual: nuevoStock })
    })
    setInsumos(insumos.map(i => i.id_insumo === insumo.id_insumo ? { ...i, stock_actual: nuevoStock } : i))

    // Registrar venta
    const payload = {
      id_cliente: Number(form.id_cliente),
      fecha: form.fecha,
      total: Number(form.total),
      estado: form.estado,
      descripcion: form.descripcion,
      id_insumo: Number(form.id_insumo),
      cantidad: Number(form.cantidad),
      precio_unitario: Number(form.precio_unitario)
    }
    let ventaGuardada
    if (editId) {
      await fetch(`${API_URL}/ventas/${editId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload, id_venta: editId })
      })
      ventaGuardada = { ...payload, id_venta: editId }
      setVentas(ventas.map(v => v.id_venta === editId ? ventaGuardada : v))
    } else {
      const res = await fetch(`${API_URL}/ventas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      ventaGuardada = await res.json()
      setVentas([...ventas, ventaGuardada])
    }
    setForm({
      id_cliente: '',
      fecha: '',
      total: '0.00',
      estado: '',
      descripcion: '',
      id_insumo: '',
      cantidad: '',
      precio_unitario: ''
    })
    setEditId(null)
    setShowModal(false)
  }

  const handleEdit = (item) => {
    setForm({
      id_cliente: item.id_cliente,
      fecha: item.fecha,
      total: item.total,
      estado: item.estado,
      descripcion: item.descripcion,
      id_insumo: item.id_insumo,
      cantidad: item.cantidad,
      precio_unitario: item.precio_unitario
    })
    setEditId(item.id_venta)
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    await fetch(`${API_URL}/ventas/${id}`, { method: 'DELETE' })
    setVentas(ventas.filter(item => item.id_venta !== id))
  }

  // Reset paginación al filtrar
  useEffect(() => { setPage(1) }, [search, filtroFecha, filtroEstado])

  return (
    <CRow className="g-3">
      {/* Panel lateral de estadísticas */}
      <CCol md={3}>
        <CCard color="primary" textColor="white" className="mb-3">
          <CCardHeader>
            <strong>Estadísticas</strong>
          </CCardHeader>
          <CCardBody>
            <div className="mb-2">
              <strong>Total de ventas:</strong>
              <CBadge className="ms-2">{totalVentas}</CBadge>
            </div>
            <div>
              <strong>Ventas filtradas:</strong>
              <CBadge className="ms-2">{totalFiltradas}</CBadge>
            </div>
            <div className="mt-3">
              <strong>Total facturado:</strong>
              <CBadge color="success" className="ms-2">
                $
                {ventasFiltradas.reduce((sum, v) => sum + Number(v.total), 0).toLocaleString()}
              </CBadge>
            </div>
          </CCardBody>
        </CCard>
      </CCol>

      {/* Panel principal */}
      <CCol md={9}>
        <CCard>
          <CCardHeader className="d-flex flex-wrap justify-content-between align-items-center bg-primary text-white">
            <span>
              <strong>Gestión de Ventas</strong>
            </span>
            <div className="d-flex flex-wrap gap-2">
              <CInputGroup size="sm" style={{ width: 180 }}>
                <CInputGroupText>
                  <CIcon icon={cilSearch} />
                </CInputGroupText>
                <CFormInput
                  placeholder="Buscar por cliente o ID"
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
                value={filtroEstado}
                onChange={e => setFiltroEstado(e.target.value)}
                style={{ width: 140 }}
              >
                <option value="">Todos los estados</option>
                {estadosVenta.map(e => (
                  <option key={e} value={e}>{e}</option>
                ))}
              </CFormSelect>
              <CButton
                color="success"
                size="sm"
                onClick={() => { setShowModal(true); setEditId(null); setForm({
                  id_cliente: '',
                  fecha: '',
                  total: '0.00',
                  estado: '',
                  descripcion: '',
                  id_insumo: '',
                  cantidad: '',
                  precio_unitario: ''
                }) }}
              >
                Nueva venta
              </CButton>
            </div>
          </CCardHeader>
          <CCardBody style={{ overflowX: 'auto' }}>
            <CTable align="middle" hover responsive>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>ID Venta</CTableHeaderCell>
                  <CTableHeaderCell>Cliente</CTableHeaderCell>
                  <CTableHeaderCell>Fecha</CTableHeaderCell>
                  <CTableHeaderCell>Descripción</CTableHeaderCell>
                  <CTableHeaderCell>Insumo</CTableHeaderCell>
                  <CTableHeaderCell>Cantidad</CTableHeaderCell>
                  <CTableHeaderCell>Total</CTableHeaderCell>
                  <CTableHeaderCell>Estado</CTableHeaderCell>
                  <CTableHeaderCell>Acciones</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {ventasPaginadas.map(item => (
                  <CTableRow key={item.id_venta}>
                    <CTableDataCell>{item.id_venta}</CTableDataCell>
                    <CTableDataCell>
                      {clientes.find(c => c.id_cliente === item.id_cliente)?.nombre || item.id_cliente}
                    </CTableDataCell>
                    <CTableDataCell>{item.fecha}</CTableDataCell>
                    <CTableDataCell>{item.descripcion}</CTableDataCell>
                    <CTableDataCell>
                      {insumos.find(i => i.id_insumo === item.id_insumo)?.nombre || item.id_insumo}
                    </CTableDataCell>
                    <CTableDataCell>{item.cantidad}</CTableDataCell>
                    <CTableDataCell>
                      <CBadge color="info">${Number(item.total).toLocaleString()}</CBadge>
                    </CTableDataCell>
                    <CTableDataCell>
                      <CBadge color={
                        item.estado === 'Pagado'
                          ? 'success'
                          : item.estado === 'Pendiente'
                          ? 'warning'
                          : 'danger'
                      }>
                        {item.estado}
                      </CBadge>
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
                        onClick={() => handleDelete(item.id_venta)}
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
          <strong>{editId ? 'Editar' : 'Registrar'} Venta</strong>
        </CModalHeader>
        <CModalBody>
          <CForm onSubmit={handleSubmit}>
            <CFormLabel>Cliente</CFormLabel>
            <CFormSelect
              name="id_cliente"
              value={form.id_cliente}
              onChange={handleChange}
              required
              className="mb-3"
            >
              <option value="">Seleccione cliente</option>
              {clientes.map(c => (
                <option key={c.id_cliente} value={c.id_cliente}>{c.nombre}</option>
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
            <CFormLabel>Descripción</CFormLabel>
            <CFormInput
              name="descripcion"
              value={form.descripcion}
              onChange={handleChange}
              required
              className="mb-3"
              placeholder="Ej: Venta de maíz"
            />
            <CFormLabel>Insumo</CFormLabel>
            <CFormSelect
              name="id_insumo"
              value={form.id_insumo}
              onChange={handleChange}
              required
              className="mb-3"
            >
              <option value="">Seleccione insumo</option>
              {insumos.map(i => (
                <option key={i.id_insumo} value={i.id_insumo}>{i.nombre}</option>
              ))}
            </CFormSelect>
            <CFormLabel>Cantidad</CFormLabel>
            <CFormInput
              name="cantidad"
              type="number"
              value={form.cantidad}
              onChange={handleChange}
              min={1}
              required
              className="mb-3"
            />
            <CFormLabel>Precio unitario</CFormLabel>
            <CFormInput
              name="precio_unitario"
              type="number"
              value={form.precio_unitario}
              onChange={handleChange}
              min={0}
              required
              className="mb-3"
            />
            <CFormLabel>Total</CFormLabel>
            <CFormInput
              name="total"
              type="number"
              value={form.total}
              min={0}
              required
              className="mb-3"
              readOnly
              style={{ backgroundColor: '#e9ecef' }}
            />
            <CFormLabel>Estado</CFormLabel>
            <CFormSelect
              name="estado"
              value={form.estado}
              onChange={handleChange}
              required
              className="mb-3"
            >
              <option value="">Seleccione estado</option>
              {estadosVenta.map(e => (
                <option key={e} value={e}>{e}</option>
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

export default Ventas