import React, { useState, useEffect } from 'react'
import {
  CCard, CCardBody, CCardHeader, CCol, CRow, CForm, CFormLabel, CFormInput,
  CButton, CFormSelect, CFormFeedback, CTable, CTableHead, CTableRow,
  CTableHeaderCell, CTableBody, CTableDataCell, CInputGroup, CInputGroupText,
  CModal, CModalHeader, CModalBody, CModalFooter, CBadge
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilSearch, cilPen, cilTrash, cilPlus, cilTruck } from '@coreui/icons'

const API_URL = 'http://localhost:3001'

const Compras = () => {
  const [compras, setCompras] = useState([])
  const [proveedores, setProveedores] = useState([])
  const [insumos, setInsumos] = useState([])
  const [form, setForm] = useState({
    id_proveedor: '',
    id_insumo: '',
    fecha: '',
    cantidad: '',
    precio_total: '',
  })
  const [formError, setFormError] = useState('')
  const [search, setSearch] = useState('')
  const [editId, setEditId] = useState(null)
  const [showModal, setShowModal] = useState(false)

  // Cargar datos iniciales
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [comprasRes, proveedoresRes, insumosRes] = await Promise.all([
          fetch(`${API_URL}/compras`),
          fetch(`${API_URL}/proveedores`),
          fetch(`${API_URL}/insumos`)
        ]);
        setCompras(await comprasRes.json());
        setProveedores(await proveedoresRes.json());
        setInsumos(await insumosRes.json());
      } catch (error) {
        console.error("Error fetching data:", error)
        setFormError("No se pudieron cargar los datos iniciales.")
      }
    }
    fetchData()
  }, [])

  // Filtrado de compras
  const filteredCompras = compras.filter(item => {
    const proveedor = proveedores.find(p => p.id_proveedor === item.id_proveedor)
    const insumo = insumos.find(i => i.id_insumo === item.id_insumo)
    const searchTerm = search.toLowerCase()
    return (
      (proveedor?.nombre.toLowerCase().includes(searchTerm) || '') ||
      (insumo?.nombre.toLowerCase().includes(searchTerm) || '')
    )
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError('')
    if (!form.id_proveedor || !form.id_insumo || !form.fecha || !form.cantidad || !form.precio_total) {
      setFormError('Todos los campos son obligatorios.')
      return
    }
    if (isNaN(form.cantidad) || Number(form.cantidad) <= 0 || isNaN(form.precio_total) || Number(form.precio_total) <= 0) {
      setFormError('La cantidad y el precio deben ser números positivos.')
      return
    }

    const insumoSeleccionado = insumos.find(i => i.id_insumo === Number(form.id_insumo))
    if (!insumoSeleccionado) {
      setFormError('El insumo seleccionado no es válido.')
      return
    }

    const payload = {
      id_proveedor: Number(form.id_proveedor),
      id_insumo: Number(form.id_insumo),
      fecha: form.fecha,
      cantidad: Number(form.cantidad),
      precio_total: Number(form.precio_total),
    }

    if (editId) {
      // Lógica de edición
      const compraOriginal = compras.find(c => c.id_compra === editId)
      const diferenciaStock = payload.cantidad - compraOriginal.cantidad
      const stockCorregido = Number(insumoSeleccionado.stock_actual) + diferenciaStock

      await fetch(`${API_URL}/insumos/${insumoSeleccionado.id_insumo}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stock_actual: stockCorregido })
      })

      const res = await fetch(`${API_URL}/compras/${editId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload, id_compra: editId })
      })
      const actualizada = await res.json()
      setCompras(compras.map(c => c.id_compra === editId ? actualizada : c))
      setInsumos(insumos.map(i => i.id_insumo === insumoSeleccionado.id_insumo ? { ...i, stock_actual: stockCorregido } : i))

    } else {
      // Crear nueva compra y actualizar stock
      const nuevoStock = Number(insumoSeleccionado.stock_actual) + Number(form.cantidad)
      await fetch(`${API_URL}/insumos/${insumoSeleccionado.id_insumo}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stock_actual: nuevoStock })
      })

      const res = await fetch(`${API_URL}/compras`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      const nueva = await res.json()
      setCompras([...compras, nueva])
      setInsumos(insumos.map(i => i.id_insumo === insumoSeleccionado.id_insumo ? { ...i, stock_actual: nuevoStock } : i))
    }

    resetFormAndModal()
  }

  const handleEdit = (item) => {
    setForm({
      id_proveedor: item.id_proveedor,
      id_insumo: item.id_insumo,
      fecha: item.fecha,
      cantidad: item.cantidad,
      precio_total: item.precio_total,
    })
    setEditId(item.id_compra)
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    // Lógica para revertir el stock si se elimina una compra
    const compra = compras.find(c => c.id_compra === id)
    if (compra) {
      const insumo = insumos.find(i => i.id_insumo === compra.id_insumo)
      if (insumo) {
        const stockRevertido = Math.max(0, insumo.stock_actual - compra.cantidad)
        await fetch(`${API_URL}/insumos/${insumo.id_insumo}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ stock_actual: stockRevertido })
        })
        setInsumos(insumos.map(i => i.id_insumo === insumo.id_insumo ? { ...i, stock_actual: stockRevertido } : i))
      }
    }
    await fetch(`${API_URL}/compras/${id}`, { method: 'DELETE' })
    setCompras(compras.filter(item => item.id_compra !== id))
  }

  const resetFormAndModal = () => {
    setForm({ id_proveedor: '', id_insumo: '', fecha: '', cantidad: '', precio_total: '' })
    setEditId(null)
    setShowModal(false)
  }

  const openNewModal = () => {
    setForm({ id_proveedor: '', id_insumo: '', fecha: '', cantidad: '', precio_total: '' })
    setEditId(null)
    setShowModal(true)
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard>
          <CCardHeader className="d-flex justify-content-between align-items-center">
            <strong><CIcon icon={cilTruck} className="me-2" />Gestión de Compras</strong>
            <div className="d-flex gap-2">
              <CInputGroup style={{ width: '250px' }}>
                <CInputGroupText><CIcon icon={cilSearch} /></CInputGroupText>
                <CFormInput placeholder="Buscar por proveedor o insumo..." value={search} onChange={e => setSearch(e.target.value)} />
              </CInputGroup>
              <CButton color="success" onClick={openNewModal}>
                <CIcon icon={cilPlus} className="me-2" /> Nueva Compra
              </CButton>
            </div>
          </CCardHeader>
          <CCardBody>
            <CTable align="middle" hover responsive>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>ID</CTableHeaderCell>
                  <CTableHeaderCell>Proveedor</CTableHeaderCell>
                  <CTableHeaderCell>Insumo</CTableHeaderCell>
                  <CTableHeaderCell>Fecha</CTableHeaderCell>
                  <CTableHeaderCell>Cantidad</CTableHeaderCell>
                  <CTableHeaderCell>Precio Total</CTableHeaderCell>
                  <CTableHeaderCell>Acciones</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {filteredCompras.map(item => (
                  <CTableRow key={item.id_compra}>
                    <CTableDataCell>{item.id_compra}</CTableDataCell>
                    <CTableDataCell>{proveedores.find(p => p.id_proveedor === item.id_proveedor)?.nombre || 'N/A'}</CTableDataCell>
                    <CTableDataCell>{insumos.find(i => i.id_insumo === item.id_insumo)?.nombre || 'N/A'}</CTableDataCell>
                    <CTableDataCell>{item.fecha}</CTableDataCell>
                    <CTableDataCell>{item.cantidad}</CTableDataCell>
                    <CTableDataCell><CBadge color="warning">${Number(item.precio_total).toLocaleString()}</CBadge></CTableDataCell>
                    <CTableDataCell>
                      <CButton color="info" size="sm" className="me-1" onClick={() => handleEdit(item)}><CIcon icon={cilPen} /></CButton>
                      <CButton color="danger" size="sm" onClick={() => handleDelete(item.id_compra)}><CIcon icon={cilTrash} /></CButton>
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          </CCardBody>
        </CCard>
      </CCol>

      <CModal visible={showModal} onClose={resetFormAndModal}>
        <CModalHeader><strong>{editId ? 'Editar' : 'Registrar'} Compra</strong></CModalHeader>
        <CModalBody>
          <CForm onSubmit={handleSubmit}>
            <CFormLabel>Proveedor</CFormLabel>
            <CFormSelect name="id_proveedor" value={form.id_proveedor} onChange={handleChange} required className="mb-3">
              <option value="">Seleccione proveedor</option>
              {proveedores.map(p => <option key={p.id_proveedor} value={p.id_proveedor}>{p.nombre}</option>)}
            </CFormSelect>

            <CFormLabel>Insumo</CFormLabel>
            <CFormSelect name="id_insumo" value={form.id_insumo} onChange={handleChange} required className="mb-3">
              <option value="">Seleccione insumo</option>
              {insumos.map(i => <option key={i.id_insumo} value={i.id_insumo}>{i.nombre}</option>)}
            </CFormSelect>

            <CFormLabel>Fecha</CFormLabel>
            <CFormInput name="fecha" type="date" value={form.fecha} onChange={handleChange} required className="mb-3" max={new Date().toISOString().split('T')[0]} />

            <CFormLabel>Cantidad</CFormLabel>
            <CFormInput name="cantidad" type="number" value={form.cantidad} onChange={handleChange} required min="1" className="mb-3" />

            <CFormLabel>Precio Total</CFormLabel>
            <CFormInput name="precio_total" type="number" value={form.precio_total} onChange={handleChange} required min="0" className="mb-3" />

            {formError && <CFormFeedback className="d-block mb-2 text-danger">{formError}</CFormFeedback>}
            <CButton color="primary" type="submit" className="w-100 mt-3">{editId ? 'Actualizar' : 'Guardar'} Compra</CButton>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={resetFormAndModal}>Cancelar</CButton>
        </CModalFooter>
      </CModal>
    </CRow>
  )
}

export default Compras