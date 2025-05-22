import React, { useState } from 'react'
import {
  CCard, CCardBody, CCardHeader, CCol, CRow, CForm, CFormLabel, CFormInput,
  CButton, CFormSelect, CFormFeedback, CTable, CTableHead, CTableRow,
  CTableHeaderCell, CTableBody, CTableDataCell, CInputGroup, CInputGroupText,
  CModal, CModalHeader, CModalBody, CModalFooter, CBadge
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilSearch, cilPen, cilTrash, cilCloudDownload } from '@coreui/icons'
import { CChartBar } from '@coreui/react-chartjs'

// Mock de insumos
const mockInsumos = [
  { id: 1, nombre: 'Alimento balanceado' },
  { id: 2, nombre: 'Vacunas' },
  { id: 3, nombre: 'Desinfectante' },
]

// Mock de inventario
const mockInventario = [
  { id: 1, id_insumo: 1, cantidad: 100, fecha: '2025-05-20', motivo: 'Ingreso' },
  { id: 2, id_insumo: 2, cantidad: 50, fecha: '2025-05-21', motivo: 'Consumo' },
  { id: 3, id_insumo: 3, cantidad: 20, fecha: '2025-05-22', motivo: 'Ajuste' },
]

function exportToCSV(data, insumos) {
  const header = ['ID', 'Insumo', 'Cantidad', 'Fecha', 'Motivo']
  const rows = data.map(row => [
    row.id,
    insumos.find(i => i.id === row.id_insumo)?.nombre || '',
    row.cantidad,
    row.fecha,
    row.motivo,
  ])
  const csvContent = [header, ...rows].map(e => e.join(',')).join('\n')
  const blob = new Blob([csvContent], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'inventario.csv'
  a.click()
  URL.revokeObjectURL(url)
}

const Inventario = () => {
  const [inventario, setInventario] = useState(mockInventario)
  const [insumos] = useState(mockInsumos)
  const [form, setForm] = useState({
    id_insumo: '',
    cantidad: '',
    fecha: '',
    motivo: '',
  })
  const [formError, setFormError] = useState('')
  const [search, setSearch] = useState('')
  const [filtroInsumo, setFiltroInsumo] = useState('')
  const [filtroFecha, setFiltroFecha] = useState('')
  const [editId, setEditId] = useState(null)
  const [showModal, setShowModal] = useState(false)

  // Filtrado dinámico
  const filtered = inventario.filter(item => {
    const insumoNombre = insumos.find(i => i.id === item.id_insumo)?.nombre || ''
    const matchSearch =
      insumoNombre.toLowerCase().includes(search.toLowerCase()) ||
      item.motivo.toLowerCase().includes(search.toLowerCase())
    const matchInsumo = filtroInsumo ? item.id_insumo === Number(filtroInsumo) : true
    const matchFecha = filtroFecha ? item.fecha === filtroFecha : true
    return matchSearch && matchInsumo && matchFecha
  })

  // Manejo de formulario
  const handleChange = (e) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setFormError('')
    if (!form.id_insumo || !form.cantidad || !form.fecha || !form.motivo) {
      setFormError('Todos los campos son obligatorios.')
      return
    }
    if (isNaN(form.cantidad) || Number(form.cantidad) < 0) {
      setFormError('La cantidad debe ser un número positivo.')
      return
    }
    if (editId) {
      setInventario(inventario.map(item =>
        item.id === editId ? { ...form, id: editId, cantidad: Number(form.cantidad), id_insumo: Number(form.id_insumo) } : item
      ))
    } else {
      setInventario([
        ...inventario,
        {
          ...form,
          id: inventario.length ? Math.max(...inventario.map(i => i.id)) + 1 : 1,
          cantidad: Number(form.cantidad),
          id_insumo: Number(form.id_insumo),
        },
      ])
    }
    setForm({ id_insumo: '', cantidad: '', fecha: '', motivo: '' })
    setEditId(null)
    setShowModal(false)
  }

  const handleEdit = (item) => {
    setForm({
      id_insumo: item.id_insumo,
      cantidad: item.cantidad,
      fecha: item.fecha,
      motivo: item.motivo,
    })
    setEditId(item.id)
    setShowModal(true)
  }

  const handleDelete = (id) => {
    setInventario(inventario.filter(item => item.id !== id))
  }

  // Datos para gráfico de movimientos por motivo
  const motivos = [...new Set(inventario.map(i => i.motivo))]
  const dataGrafico = {
    labels: motivos,
    datasets: [
      {
        label: 'Movimientos por motivo',
        backgroundColor: ['#4e73df', '#1cc88a', '#f6c23e', '#e74a3b'],
        data: motivos.map(m => inventario.filter(i => i.motivo === m).reduce((sum, i) => sum + i.cantidad, 0)),
      },
    ],
  }

  return (
    <CRow className="g-3">

        <CCol md={4}>
          <CCard>
            <CCardHeader>
            <strong>{editId ? 'Editar' : 'Registrar'} Movimiento</strong>
            </CCardHeader>
            <CCardBody>
            <CForm onSubmit={handleSubmit}>
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
                <option key={i.id} value={i.id}>{i.nombre}</option>
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
              <CFormLabel>Fecha</CFormLabel>
              <CFormInput
                name="fecha"
                type="date"
                value={form.fecha}
                onChange={handleChange}
                required
                className="mb-3"
              />
              <CFormLabel>Motivo</CFormLabel>
              <CFormInput
                name="motivo"
                value={form.motivo}
                onChange={handleChange}
                required
                className="mb-3"
                placeholder="Ej: Ingreso, Consumo, Ajuste..."
              />
              {formError && <CFormFeedback className="d-block mb-2">{formError}</CFormFeedback>}
              <CButton color="success" type="submit" className="w-100">
                {editId ? 'Actualizar' : 'Registrar'}
              </CButton>
            </CForm>
            </CCardBody>
          </CCard>
          <CCard className="mt-4">
            <CCardHeader>
            <strong>Movimientos por motivo</strong>
            </CCardHeader>
            <CCardBody>
            <CChartBar
              data={dataGrafico}
              options={{ responsive: true, plugins: { legend: { display: false } } }}
            />
            </CCardBody>
          </CCard>
        </CCol>

        {/* Panel de listado */}
      <CCol md={8}>
        <CCard>
          <CCardHeader className="d-flex flex-wrap justify-content-between align-items-center">
            <span>
              <strong>Movimientos de Inventario</strong>
            </span>
            <div className="d-flex flex-wrap gap-2">
              <CFormSelect
                size="sm"
                value={filtroInsumo}
                onChange={e => setFiltroInsumo(e.target.value)}
                style={{ width: 150 }}
              >
                <option value="">Todos los insumos</option>
                {insumos.map(i => (
                  <option key={i.id} value={i.id}>{i.nombre}</option>
                ))}
              </CFormSelect>
              <CFormInput
                size="sm"
                type="date"
                value={filtroFecha}
                onChange={e => setFiltroFecha(e.target.value)}
                style={{ width: 150 }}
              />
              <CInputGroup size="sm" style={{ width: 200 }}>
                <CInputGroupText>
                  <CIcon icon={cilSearch} />
                </CInputGroupText>
                <CFormInput
                  placeholder="Buscar..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </CInputGroup>
              <CButton
                color="info"
                size="sm"
                onClick={() => exportToCSV(filtered, insumos)}
                title="Exportar CSV"
              >
                <CIcon icon={cilCloudDownload} /> CSV
              </CButton>
            </div>
          </CCardHeader>
          <CCardBody style={{ overflowX: 'auto' }}>
            <CTable align="middle" hover responsive>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>ID</CTableHeaderCell>
                  <CTableHeaderCell>Insumo</CTableHeaderCell>
                  <CTableHeaderCell>Cantidad</CTableHeaderCell>
                  <CTableHeaderCell>Fecha</CTableHeaderCell>
                  <CTableHeaderCell>Motivo</CTableHeaderCell>
                  <CTableHeaderCell>Acciones</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {filtered.map(item => (
                  <CTableRow key={item.id}>
                    <CTableDataCell>{item.id}</CTableDataCell>
                    <CTableDataCell>
                      {insumos.find(i => i.id === item.id_insumo)?.nombre || ''}
                    </CTableDataCell>
                    <CTableDataCell>
                      <CBadge color={item.cantidad < 0 ? 'danger' : 'success'}>
                        {item.cantidad}
                      </CBadge>
                    </CTableDataCell>
                    <CTableDataCell>{item.fecha}</CTableDataCell>
                    <CTableDataCell>{item.motivo}</CTableDataCell>
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

      {/* Modal para editar */}
      <CModal visible={showModal} onClose={() => setShowModal(false)}>
        <CModalHeader>
          <strong>{editId ? 'Editar' : 'Registrar'} Movimiento</strong>
        </CModalHeader>
        <CModalBody>
          <CForm onSubmit={handleSubmit}>
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
                <option key={i.id} value={i.id}>{i.nombre}</option>
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
            <CFormLabel>Fecha</CFormLabel>
            <CFormInput
              name="fecha"
              type="date"
              value={form.fecha}
              onChange={handleChange}
              required
              className="mb-3"
            />
            <CFormLabel>Motivo</CFormLabel>
            <CFormInput
              name="motivo"
              value={form.motivo}
              onChange={handleChange}
              required
              className="mb-3"
              placeholder="Ej: Ingreso, Consumo, Ajuste..."
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

export default Inventario