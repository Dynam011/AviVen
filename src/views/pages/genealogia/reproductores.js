import React, { useState } from 'react'
import {
  CCard, CCardBody, CCardHeader, CCol, CRow, CForm, CFormLabel, CFormInput,
  CButton, CFormSelect, CFormFeedback, CFormCheck, CTable, CTableHead, CTableRow,
  CTableHeaderCell, CTableBody, CTableDataCell, CBadge, CModal, CModalHeader,
  CModalBody, CModalFooter, CImage, CTooltip, CInputGroup, CInputGroupText
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilUser, cilCheckCircle, cilXCircle, cilPaw, cilPlus, cilPen, cilTrash, cilChevronRight } from '@coreui/icons'

// Mock de reproductores
const estados = [
  { value: 'activo', label: 'Activo', color: 'success' },
  { value: 'enfermo', label: 'Enfermo', color: 'warning' },
  { value: 'retirado', label: 'Retirado', color: 'secondary' },
  { value: 'fallecido', label: 'Fallecido', color: 'danger' },
]

const mockReproductores = [
  {
    id: 1,
    codigo: 'R-001',
    fecha_nacimiento: '2022-01-10',
    sexo: 'M',
    estado: 'activo',
    foto: '',
    carrera: 'Gallina ponedora',
    registros: 'Vacunado, revisión veterinaria 2023',
    genealogia: { padre: 'R-010', madre: 'R-011' },
  },
  {
    id: 2,
    codigo: 'R-002',
    fecha_nacimiento: '2021-07-22',
    sexo: 'F',
    estado: 'enfermo',
    foto: '',
    carrera: 'Gallina reproductora',
    registros: 'Tratamiento antibiótico 2024',
    genealogia: { padre: 'R-012', madre: 'R-013' },
  },
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

const Reproductores = () => {
  const [reproductores, setReproductores] = useState(mockReproductores)
  const [form, setForm] = useState({
    codigo: '',
    fecha_nacimiento: '',
    sexo: '',
    estado: '',
    foto: '',
    carrera: '',
    registros: '',
  })
  const [formError, setFormError] = useState('')
  const [selectedIds, setSelectedIds] = useState([])
  const [previewGenealogia, setPreviewGenealogia] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [editId, setEditId] = useState(null)
  const [fotoPreview, setFotoPreview] = useState('')

  // Validación automática del código
  const validarCodigo = (codigo) => {
    if (!codigo) return false
    return !reproductores.some(r => r.codigo === codigo && r.id !== editId)
  }

  // Manejo de cambios en el formulario
  const handleChange = (e) => {
    const { name, value, files } = e.target
    if (name === 'foto' && files && files[0]) {
      setForm({ ...form, foto: files[0] })
      setFotoPreview(URL.createObjectURL(files[0]))
    } else {
      setForm({ ...form, [name]: value })
    }
  }

  // Guardar o editar reproductor
  const handleSubmit = (e) => {
    e.preventDefault()
    setFormError('')
    if (!form.codigo || !validarCodigo(form.codigo)) {
      setFormError('Código inválido o duplicado.')
      return
    }
    if (!form.fecha_nacimiento || !form.sexo || !form.estado) {
      setFormError('Complete todos los campos obligatorios.')
      return
    }
    if (editId) {
      setReproductores(reproductores.map(r =>
        r.id === editId ? { ...form, id: editId, foto: fotoPreview || r.foto } : r
      ))
    } else {
      setReproductores([
        ...reproductores,
        {
          ...form,
          id: reproductores.length + 1,
          foto: fotoPreview,
        },
      ])
    }
    setForm({
      codigo: '',
      fecha_nacimiento: '',
      sexo: '',
      estado: '',
      foto: '',
      carrera: '',
      registros: '',
    })
    setFotoPreview('')
    setEditId(null)
    setShowModal(false)
  }

  // Edición en línea
  const handleEdit = (id) => {
    const r = reproductores.find(r => r.id === id)
    setForm({ ...r })
    setFotoPreview(r.foto)
    setEditId(id)
    setShowModal(true)
  }

  // Selección múltiple para operaciones por lotes
  const handleSelect = (id) => {
    setSelectedIds(selectedIds.includes(id)
      ? selectedIds.filter(i => i !== id)
      : [...selectedIds, id])
  }

  // Operación por lotes: actualizar estado
  const handleBatchUpdate = (estado) => {
    setReproductores(reproductores.map(r =>
      selectedIds.includes(r.id) ? { ...r, estado } : r
    ))
    setSelectedIds([])
  }

  // Previsualización genealógica (simulada)
  const handlePreviewGenealogia = (r) => {
    setPreviewGenealogia(r.genealogia)
  }

  return (
    <CRow className="g-3">
      {/* Panel de formulario */}
      <CCol md={4}>
        <CCard>
          <CCardHeader>
            <CIcon icon={cilUser} className="me-2 text-success" />
            <strong>{editId ? 'Editar' : 'Registrar'} Reproductor</strong>
          </CCardHeader>
          <CCardBody>
            <CForm onSubmit={handleSubmit}>
              <CFormLabel>Código del Criador</CFormLabel>
              <CInputGroup className="mb-3">
                <CFormInput
                  name="codigo"
                  value={form.codigo}
                  onChange={handleChange}
                  required
                  invalid={form.codigo && !validarCodigo(form.codigo)}
                  placeholder="Ej: R-007"
                />
                <CInputGroupText>
                  {form.codigo && validarCodigo(form.codigo)
                    ? <CIcon icon={cilCheckCircle} className="text-success" />
                    : <CIcon icon={cilXCircle} className="text-danger" />}
                </CInputGroupText>
              </CInputGroup>
              <CFormLabel>Fecha de Nacimiento</CFormLabel>
              <CFormInput
                type="date"
                name="fecha_nacimiento"
                value={form.fecha_nacimiento}
                onChange={handleChange}
                required
                className="mb-3"
              />
              <div className="mb-3">
                <CFormLabel>Edad</CFormLabel>
                <div>{calcularEdad(form.fecha_nacimiento)}</div>
              </div>
              <CFormLabel>Sexo</CFormLabel>
              <div className="mb-3">
                <CFormCheck
                  inline
                  type="radio"
                  name="sexo"
                  label="Macho"
                  value="M"
                  checked={form.sexo === 'M'}
                  onChange={handleChange}
                />
                <CFormCheck
                  inline
                  type="radio"
                  name="sexo"
                  label="Hembra"
                  value="F"
                  checked={form.sexo === 'F'}
                  onChange={handleChange}
                />
              </div>
              <CFormLabel>Estado</CFormLabel>
              <CFormSelect
                name="estado"
                value={form.estado}
                onChange={handleChange}
                required
                className="mb-3"
              >
                <option value="">Seleccione estado</option>
                {estados.map(e => (
                  <option key={e.value} value={e.value}>{e.label}</option>
                ))}
              </CFormSelect>
              <CFormLabel>Carrera/Especialidad</CFormLabel>
              <CFormInput
                name="carrera"
                value={form.carrera}
                onChange={handleChange}
                placeholder="Ej: Gallina ponedora"
                className="mb-3"
              />
              <CFormLabel>Registros Veterinarios</CFormLabel>
              <CFormInput
                name="registros"
                value={form.registros}
                onChange={handleChange}
                placeholder="Ej: Vacunado, revisión veterinaria"
                className="mb-3"
              />
              <CFormLabel>Foto</CFormLabel>
              <CFormInput
                type="file"
                name="foto"
                accept="image/*"
                onChange={handleChange}
                className="mb-3"
              />
              {fotoPreview && (
                <div className="mb-3">
                  <CImage src={fotoPreview} thumbnail width={80} height={80} />
                </div>
              )}
              {formError && <CFormFeedback className="d-block mb-2">{formError}</CFormFeedback>}
              <CButton color="success" type="submit" className="w-100">
                {editId ? 'Actualizar' : 'Registrar'}
              </CButton>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>

      {/* Panel de listado */}
      <CCol md={8}>
        <CCard>
          <CCardHeader className="d-flex justify-content-between align-items-center">
            <span>
              <CIcon icon={cilPaw} className="me-2 text-primary" />
              <strong>Reproductores Registrados</strong>
            </span>
            <div>
              <CButton
                color="secondary"
                size="sm"
                className="me-2"
                disabled={selectedIds.length === 0}
                onClick={() => handleBatchUpdate('retirado')}
              >
                Retirar seleccionados
              </CButton>
              <CButton
                color="danger"
                size="sm"
                disabled={selectedIds.length === 0}
                onClick={() => handleBatchUpdate('fallecido')}
              >
                Marcar como fallecidos
              </CButton>
            </div>
          </CCardHeader>
          <CCardBody style={{ overflowX: 'auto' }}>
            <CTable align="middle" hover responsive>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>
                    <CFormCheck
                      checked={selectedIds.length === reproductores.length}
                      onChange={() =>
                        setSelectedIds(
                          selectedIds.length === reproductores.length
                            ? []
                            : reproductores.map(r => r.id)
                        )
                      }
                    />
                  </CTableHeaderCell>
                  <CTableHeaderCell>Código</CTableHeaderCell>
                  <CTableHeaderCell>Foto</CTableHeaderCell>
                  <CTableHeaderCell>Edad</CTableHeaderCell>
                  <CTableHeaderCell>Sexo</CTableHeaderCell>
                  <CTableHeaderCell>Estado</CTableHeaderCell>
                  <CTableHeaderCell>Carrera</CTableHeaderCell>
                  <CTableHeaderCell>Registros</CTableHeaderCell>
                  <CTableHeaderCell>Genealogía</CTableHeaderCell>
                  <CTableHeaderCell>Acciones</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {reproductores.map(r => (
                  <CTableRow key={r.id}>
                    <CTableDataCell>
                      <CFormCheck
                        checked={selectedIds.includes(r.id)}
                        onChange={() => handleSelect(r.id)}
                      />
                    </CTableDataCell>
                    <CTableDataCell>{r.codigo}</CTableDataCell>
                    <CTableDataCell>
                      {r.foto ? (
                        <CImage src={r.foto} thumbnail width={40} height={40} />
                      ) : (
                        <CIcon icon={cilUser} size="lg" className="text-muted" />
                      )}
                    </CTableDataCell>
                    <CTableDataCell>{calcularEdad(r.fecha_nacimiento)}</CTableDataCell>
                    <CTableDataCell>
                      <CBadge color={r.sexo === 'M' ? 'primary' : 'warning'}>
                        {r.sexo === 'M' ? 'Macho' : 'Hembra'}
                      </CBadge>
                    </CTableDataCell>
                    <CTableDataCell>
                      <CBadge color={estados.find(e => e.value === r.estado)?.color || 'secondary'}>
                        {estados.find(e => e.value === r.estado)?.label || r.estado}
                      </CBadge>
                    </CTableDataCell>
                    <CTableDataCell>{r.carrera}</CTableDataCell>
                    <CTableDataCell>{r.registros}</CTableDataCell>
                    <CTableDataCell>
                      <CTooltip
                        content={
                          <div>
                            <div><strong>Padre:</strong> {r.genealogia?.padre || '-'}</div>
                            <div><strong>Madre:</strong> {r.genealogia?.madre || '-'}</div>
                          </div>
                        }
                        placement="right"
                      >
                        <CButton
                          color="light"
                          size="sm"
                          onMouseEnter={() => handlePreviewGenealogia(r)}
                          onMouseLeave={() => setPreviewGenealogia(null)}
                        >
                          <CIcon icon={cilChevronRight} />
                        </CButton>
                      </CTooltip>
                    </CTableDataCell>
                    <CTableDataCell>
                      <CButton
                        color="info"
                        size="sm"
                        className="me-1"
                        onClick={() => handleEdit(r.id)}
                      >
                        <CIcon icon={cilPen} />
                      </CButton>
                      <CButton
                        color="danger"
                        size="sm"
                        onClick={() =>
                          setReproductores(reproductores.filter(x => x.id !== r.id))
                        }
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
          <strong>{editId ? 'Editar' : 'Registrar'} Reproductor</strong>
        </CModalHeader>
        <CModalBody>
          <CForm onSubmit={handleSubmit}>
            <CFormLabel>Código del Criador</CFormLabel>
            <CInputGroup className="mb-3">
              <CFormInput
                name="codigo"
                value={form.codigo}
                onChange={handleChange}
                required
                invalid={form.codigo && !validarCodigo(form.codigo)}
                placeholder="Ej: R-007"
              />
              <CInputGroupText>
                {form.codigo && validarCodigo(form.codigo)
                  ? <CIcon icon={cilCheckCircle} className="text-success" />
                  : <CIcon icon={cilXCircle} className="text-danger" />}
              </CInputGroupText>
            </CInputGroup>
            <CFormLabel>Fecha de Nacimiento</CFormLabel>
            <CFormInput
              type="date"
              name="fecha_nacimiento"
              value={form.fecha_nacimiento}
              onChange={handleChange}
              required
              className="mb-3"
            />
            <div className="mb-3">
              <CFormLabel>Edad</CFormLabel>
              <div>{calcularEdad(form.fecha_nacimiento)}</div>
            </div>
            <CFormLabel>Sexo</CFormLabel>
            <div className="mb-3">
              <CFormCheck
                inline
                type="radio"
                name="sexo"
                label="Macho"
                value="M"
                checked={form.sexo === 'M'}
                onChange={handleChange}
              />
              <CFormCheck
                inline
                type="radio"
                name="sexo"
                label="Hembra"
                value="F"
                checked={form.sexo === 'F'}
                onChange={handleChange}
              />
            </div>
            <CFormLabel>Estado</CFormLabel>
            <CFormSelect
              name="estado"
              value={form.estado}
              onChange={handleChange}
              required
              className="mb-3"
            >
              <option value="">Seleccione estado</option>
              {estados.map(e => (
                <option key={e.value} value={e.value}>{e.label}</option>
              ))}
            </CFormSelect>
            <CFormLabel>Carrera/Especialidad</CFormLabel>
            <CFormInput
              name="carrera"
              value={form.carrera}
              onChange={handleChange}
              placeholder="Ej: Gallina ponedora"
              className="mb-3"
            />
            <CFormLabel>Registros Veterinarios</CFormLabel>
            <CFormInput
              name="registros"
              value={form.registros}
              onChange={handleChange}
              placeholder="Ej: Vacunado, revisión veterinaria"
              className="mb-3"
            />
            <CFormLabel>Foto</CFormLabel>
            <CFormInput
              type="file"
              name="foto"
              accept="image/*"
              onChange={handleChange}
              className="mb-3"
            />
            {fotoPreview && (
              <div className="mb-3">
                <CImage src={fotoPreview} thumbnail width={80} height={80} />
              </div>
            )}
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

export default Reproductores