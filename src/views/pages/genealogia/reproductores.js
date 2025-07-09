import React, { useEffect, useState } from 'react'
import {
  CCard, CCardBody, CCardHeader, CCol, CRow, CForm, CFormLabel, CFormInput,
  CButton, CFormSelect, CFormFeedback, CTable, CTableHead, CTableRow,
  CTableHeaderCell, CTableBody, CTableDataCell, CBadge, CModal, CModalHeader,
  CModalBody, CModalFooter, CSpinner,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilUser, cilPaw, cilPen, cilTrash, cilPlus } from '@coreui/icons'

const API_URL = 'http://localhost:3001'

const estados = [
  { value: 'activo', label: 'Activo', color: 'success' },
  { value: 'enfermo', label: 'Enfermo', color: 'warning' },
  { value: 'retirado', label: 'Retirado', color: 'secondary' },
  { value: 'fallecido', label: 'Fallecido', color: 'danger' },
]

// Utilidad para calcular edad
function calcularEdad(fecha) {
  if (!fecha) return ''
  const hoy = new Date()
  const nacimiento = new Date(fecha)
  let edad = hoy.getFullYear() - nacimiento.getFullYear()
  const m = hoy.getMonth() - nacimiento.getMonth()
  if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) {
    edad--
  }
  return `${edad} año(s)`
}

// Componente de formulario reutilizable
const GalloForm = ({ form, galpones, handleChange, handleSubmit, formError, editId, loading }) => (
  <CForm onSubmit={handleSubmit}>
    <CFormLabel>Cantidad de Gallos</CFormLabel>
    <CFormInput
      name="cantidad"
      type="number"
      value={form.cantidad}
      onChange={handleChange}
      required
      className="mb-3"
      min={1}
      placeholder="Ej: 120"
    />
    <CFormLabel>Fecha de Ingreso</CFormLabel>
    <CFormInput
      type="date"
      name="fecha_ingreso"
      value={form.fecha_ingreso}
      onChange={handleChange}
      required
      className="mb-3"
      max={new Date().toISOString().split('T')[0]}
    />
    <CFormLabel>Estado</CFormLabel>
    <CFormSelect name="estado" value={form.estado} onChange={handleChange} required className="mb-3">
      <option value="">Seleccione estado</option>
      {estados.map((e) => (
        <option key={e.value} value={e.value}>
          {e.label}
        </option>
      ))}
    </CFormSelect>
    <CFormLabel>Galpón</CFormLabel>
    <CFormSelect name="galpon" value={form.galpon} onChange={handleChange} required className="mb-3">
      <option value="">Seleccione galpón</option>
      {galpones.map((g) => (
        <option key={g.id_galpon || g.id} value={g.nombre || g.id_galpon}>
          {g.nombre || `Galpón ${g.id_galpon || g.id}`}
        </option>
      ))}
    </CFormSelect>
    <CFormLabel>Observaciones</CFormLabel>
    <CFormInput
      name="observaciones"
      value={form.observaciones}
      onChange={handleChange}
      placeholder="Ej: Gallos de reemplazo"
      className="mb-3"
    />
    {formError && <CFormFeedback className="d-block mb-2 text-danger">{formError}</CFormFeedback>}
    <CButton color="success" type="submit" className="w-100 mt-3" disabled={loading}>
      {loading ? (
        <CSpinner size="sm" />
      ) : editId ? (
        'Actualizar Registro'
      ) : (
        'Guardar Registro'
      )}
    </CButton>
  </CForm>
)

const Reproductores = () => {
  const [gallos, setGallos] = useState([])
  const [galpones, setGalpones] = useState([])
  const [form, setForm] = useState({
    cantidad: '',
    fecha_ingreso: '',
    estado: '',
    galpon: '',
    observaciones: '',
  })
  const [formError, setFormError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editId, setEditId] = useState(null)
  const [loading, setLoading] = useState(false)

  // Cargar galpones y gallos desde json-server
  useEffect(() => {
    fetch(`${API_URL}/galpones`)
      .then(res => res.json())
      .then(setGalpones)
    fetch(`${API_URL}/gallos`)
      .then(res => res.json())
      .then(setGallos)
  }, [])

  // Manejo de cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
  }

  // Guardar o editar registro de gallos por galpón
  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError('')
    setLoading(true)
    if (!form.cantidad || !form.fecha_ingreso || !form.estado || !form.galpon) {
      setFormError('Complete todos los campos obligatorios.')
      return
    }
    if (isNaN(form.cantidad) || Number(form.cantidad) <= 0) {
      setFormError('La cantidad debe ser un número positivo.')
      return
    }
    // Validar que no se repita galpón activo
    if (
      !editId && gallos.some((g) => g.galpon === form.galpon && g.estado === 'activo')
    ) {
      setFormError('Ya hay un registro de gallos activos en este galpón.')
      return
    }

    const payload = {
      cantidad: Number(form.cantidad),
      fecha_ingreso: form.fecha_ingreso,
      estado: form.estado,
      galpon: form.galpon,
      observaciones: form.observaciones,
    }

    if (editId) {
      await fetch(`${API_URL}/gallos/${editId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload, id: editId }),
      })
      setGallos(gallos.map((g) => (g.id === editId ? { ...payload, id: editId } : g)))
    } else {
      const res = await fetch(`${API_URL}/gallos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const nuevo = await res.json()
      setGallos([...gallos, nuevo])
    }
    setForm({
      cantidad: '',
      fecha_ingreso: '',
      estado: '',
      galpon: '',
      observaciones: '',
    })
    setEditId(null)
    setShowModal(false)
    setLoading(false)
  }

  // Edición
  const handleEdit = (id) => {
    const g = gallos.find((g) => g.id === id)
    setForm({ ...g })
    setEditId(id)
    setShowModal(true)
  }

  // Eliminar registro
  const handleDelete = async (id) => {
    await fetch(`${API_URL}/gallos/${id}`, { method: 'DELETE' })
    setGallos(gallos.filter((g) => g.id !== id))
  }

  // Abrir modal para nuevo registro
  const handleAddNew = () => {
    setEditId(null)
    setForm({
      cantidad: '',
      fecha_ingreso: '',
      estado: '',
      galpon: '',
      observaciones: '',
    })
    setShowModal(true)
  }

  return (
    <CRow>
      {/* Panel de listado */}
      <CCol xs={12}>
        <CCard>
          <CCardHeader className="d-flex justify-content-between align-items-center">
            <strong>
              <CIcon icon={cilPaw} className="me-2 text-primary" />
              Gestión de Gallos por Galpón
            </strong>
            <CButton color="success" onClick={handleAddNew}>
              <CIcon icon={cilPlus} className="me-2" /> Nuevo Registro
            </CButton>
          </CCardHeader>
          <CCardBody style={{ overflowX: 'auto' }}>
            <CTable align="middle" hover responsive>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Galpón</CTableHeaderCell>
                  <CTableHeaderCell>Cantidad</CTableHeaderCell>
                  <CTableHeaderCell>Fecha Ingreso</CTableHeaderCell>
                  <CTableHeaderCell>Edad</CTableHeaderCell>
                  <CTableHeaderCell>Estado</CTableHeaderCell>
                  <CTableHeaderCell>Observaciones</CTableHeaderCell>
                  <CTableHeaderCell>Acciones</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {gallos.map((g) => (
                  <CTableRow key={g.id}>
                    <CTableDataCell>
                      {galpones.find((ga) => (ga.nombre || ga.id_galpon) === g.galpon)?.nombre ||
                        `Galpón ${g.galpon}`}
                    </CTableDataCell>
                    <CTableDataCell>{g.cantidad}</CTableDataCell>
                    <CTableDataCell>{g.fecha_ingreso}</CTableDataCell>
                    <CTableDataCell>{calcularEdad(g.fecha_ingreso)}</CTableDataCell>
                    <CTableDataCell>
                      <CBadge color={estados.find((e) => e.value === g.estado)?.color || 'secondary'}>
                        {estados.find((e) => e.value === g.estado)?.label || g.estado}
                      </CBadge>
                    </CTableDataCell>
                    <CTableDataCell>{g.observaciones}</CTableDataCell>
                    <CTableDataCell>
                      <CButton
                        color="info"
                        size="sm"
                        className="me-1"
                        onClick={() => handleEdit(g.id)}
                      >
                        <CIcon icon={cilPen} />
                      </CButton>
                      <CButton
                        color="danger"
                        size="sm"
                        onClick={() => handleDelete(g.id)}
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
          <strong>{editId ? 'Editar' : 'Registrar'} Gallos por Galpón</strong>
        </CModalHeader>
        <CModalBody>
          <GalloForm
            form={form}
            galpones={galpones}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            formError={formError}
            editId={editId}
            loading={loading}
          />
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

export default Reproductores