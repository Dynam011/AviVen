import React, { useState, useEffect } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CForm,
  CFormLabel,
  CFormInput,
  CButton,
  CFormSelect,
  CFormFeedback,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CInputGroup,
  CInputGroupText,
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
  CBadge,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilSearch, cilPen, cilTrash, cilCloudDownload } from '@coreui/icons'
import { CChartBar } from '@coreui/react-chartjs'

const API_URL = 'http://localhost:3001'

function exportToCSV(data, insumos) {
  // Encabezados claros y ordenados
  const header = ['ID Movimiento', 'Insumo', 'Unidad', 'Cantidad', 'Stock Actual', 'Fecha', 'Motivo']
  const rows = data.map((row) => {
    const insumo = insumos.find((i) => i.id_insumo === row.id_insumo)
    return [
      row.id_inventario,
      insumo?.nombre || '',
      insumo?.unidad || '',
      row.cantidad,
      insumo?.stock_actual ?? '',
      row.fecha,
      row.motivo,
    ]
  })
  // Unir filas y encabezado con salto de línea, separar columnas por coma
const csvContent = [header, ...rows]
  .map((e) =>
    e
      .map((v) =>
        typeof v === 'string' && (v.includes(';') || v.includes('"'))
          ? `"${v.replace(/"/g, '""')}"`
          : v
      )
      .join(';') // <-- cambia aquí a punto y coma
  )
  .join('\n')
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'movimientos_inventario.csv'
  a.click()
  URL.revokeObjectURL(url)
}

const Inventario = () => {
  const [inventario, setInventario] = useState([])
  const [insumos, setInsumos] = useState([])
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

  // Cargar datos desde json-server
  useEffect(() => {
    fetch(`${API_URL}/inventario`)
      .then((res) => res.json())
      .then(setInventario)
    fetch(`${API_URL}/insumos`)
      .then((res) => res.json())
      .then(setInsumos)
  }, [])

  // Filtrado dinámico
  const filtered = inventario.filter((item) => {
    const insumoNombre = insumos.find((i) => i.id_insumo === item.id_insumo)?.nombre || ''
    const matchSearch =
      insumoNombre.toLowerCase().includes(search.toLowerCase()) ||
      item.motivo?.toLowerCase().includes(search.toLowerCase()) ||
      ''
    const matchInsumo = filtroInsumo ? item.id_insumo === Number(filtroInsumo) : true
    const matchFecha = filtroFecha ? item.fecha === filtroFecha : true
    return matchSearch && matchInsumo && matchFecha
  })

  // Manejo de formulario
  const handleChange = (e) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
  }

  const handleSubmit = async (e) => {
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
    const payload = {
      id_insumo: Number(form.id_insumo),
      cantidad: Number(form.cantidad),
      fecha: form.fecha,
      motivo: form.motivo,
    }
    if (editId) {
      await fetch(`${API_URL}/inventario/${editId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload, id_inventario: editId }),
      })
      setInventario(
        inventario.map((item) =>
          item.id_inventario === editId ? { ...payload, id_inventario: editId } : item,
        ),
      )
    } else {
      const res = await fetch(`${API_URL}/inventario`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const nuevo = await res.json()
      setInventario([...inventario, nuevo])
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
    setEditId(item.id_inventario)
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    await fetch(`${API_URL}/inventario/${id}`, { method: 'DELETE' })
    setInventario(inventario.filter((item) => item.id_inventario !== id))
  }

  // Datos para gráfico de movimientos por motivo
  const motivos = [...new Set(inventario.map((i) => i.motivo))]
  const dataGrafico = {
    labels: motivos,
    datasets: [
      {
        label: 'Movimientos por motivo',
        backgroundColor: ['#4e73df', '#1cc88a', '#f6c23e', '#e74a3b'],
        data: motivos.map((m) =>
          inventario.filter((i) => i.motivo === m).reduce((sum, i) => sum + i.cantidad, 0),
        ),
      },
    ],
  }

  // --- ANÁLISIS Y MEJORAS ---
  // 1. El módulo es correcto para una granja avícola: permite registrar ingresos, consumos y ajustes de insumos.
  // 2. Sugerencia: mostrar el stock actual de cada insumo (útil para gestión diaria).
  // 3. Sugerencia: permitir registrar movimientos negativos (consumo) y positivos (ingreso).
  // 4. Sugerencia: mostrar unidad del insumo en el formulario y tabla.
  // 5. Sugerencia: validar que no se consuma más de lo disponible (si se desea control estricto).

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
                {insumos.map((i) => (
                  <option key={i.id_insumo} value={i.id_insumo}>
                    {i.nombre} ({i.unidad}) - Stock: {i.stock_actual}
                  </option>
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
                onChange={(e) => setFiltroInsumo(e.target.value)}
                style={{ width: 150 }}
              >
                <option value="">Todos los insumos</option>
                {insumos.map((i) => (
                  <option key={i.id_insumo} value={i.id_insumo}>
                    {i.nombre}
                  </option>
                ))}
              </CFormSelect>
              <CFormInput
                size="sm"
                type="date"
                value={filtroFecha}
                onChange={(e) => setFiltroFecha(e.target.value)}
                style={{ width: 150 }}
              />
              <CInputGroup size="sm" style={{ width: 200 }}>
                <CInputGroupText>
                  <CIcon icon={cilSearch} />
                </CInputGroupText>
                <CFormInput
                  placeholder="Buscar..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </CInputGroup>
              <CButton style={{ color: '#000' }} 
                color="info"
                size="sm"
                onClick={() => exportToCSV(filtered, insumos)}
                title="Exportar CSV"
              >
                <CIcon style={{ color: '#000' }}  icon={cilCloudDownload} /> CSV
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
                  <CTableHeaderCell>Unidad</CTableHeaderCell>
                  <CTableHeaderCell>Fecha</CTableHeaderCell>
                  <CTableHeaderCell>Motivo</CTableHeaderCell>
                  <CTableHeaderCell>Acciones</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {filtered.map((item) => {
                  const insumo = insumos.find((i) => i.id_insumo === item.id_insumo)
                  return (
                    <CTableRow key={item.id_inventario}>
                      <CTableDataCell>{item.id_inventario}</CTableDataCell>
                      <CTableDataCell>{insumo?.nombre || ''}</CTableDataCell>
                      <CTableDataCell>
                        <CBadge color={item.cantidad < 0 ? 'danger' : 'success'}>
                          {item.cantidad}
                        </CBadge>
                      </CTableDataCell>
                      <CTableDataCell>{insumo?.unidad || ''}</CTableDataCell>
                      <CTableDataCell>{item.fecha}</CTableDataCell>
                      <CTableDataCell>{item.motivo}</CTableDataCell>
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
                          onClick={() => handleDelete(item.id_inventario)}
                        >
                          <CIcon icon={cilTrash} style={{ color: '#dc3545' }} />
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

      {/* Modal para editar */}
      <CModal visible={showModal} onClose={() => setShowModal(false)}>
        <CModalHeader style={{ color: '#000' }} >
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
              {insumos.map((i) => (
                <option key={i.id_insumo} value={i.id_insumo}>
                  {i.nombre}
                </option>
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
              <span style={{ color: '#000' }}>{editId ? 'Actualizar' : 'Registrar'}</span>
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
