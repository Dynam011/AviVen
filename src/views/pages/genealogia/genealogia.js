import React, { useState, useEffect } from 'react'
import {
  CCard, CCardBody, CCardHeader, CCol, CRow, CForm, CFormLabel, CFormSelect,
  CButton, CInputGroup, CInputGroupText, CFormFeedback, CFormTextarea, CSpinner,
  CModal, CModalHeader, CModalBody, CModalFooter, CFormInput, CBadge
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilList, cilPlus, cilSearch, cilUser, cilChevronRight, cilChevronBottom } from '@coreui/icons'

// Simulación de datos de lotes reproductores y galpones (reemplaza por fetch a tu API)
const mockLotes = [
  { id: 1, lote: 'Lote Gallinas 2024-01', tipo: 'Gallinas', galpon: 'Galpón 1' },
  { id: 2, lote: 'Lote Gallos 2024-01', tipo: 'Gallos', galpon: 'Galpón 2' },
  { id: 3, lote: 'Lote Gallinas 2024-02', tipo: 'Gallinas', galpon: 'Galpón 3' },
  { id: 4, lote: 'Lote Gallos 2024-02', tipo: 'Gallos', galpon: 'Galpón 2' },
]
const mockGalpones = [
  { id: 1, nombre: 'Galpón 1' },
  { id: 2, nombre: 'Galpón 2' },
  { id: 3, nombre: 'Galpón 3' },
]

// Simulación de genealogía por lotes parentales
const mockGenealogiaLotes = [
  {
    id: 1,
    lote_gallinas: 1,
    lote_gallos: 2,
    lote_pollitos: 'Pollitos 2024-03',
    galpon_eclosion: 3,
    observaciones: 'Eclosión exitosa',
  },
  {
    id: 2,
    lote_gallinas: 3,
    lote_gallos: 4,
    lote_pollitos: 'Pollitos 2024-04',
    galpon_eclosion: 1,
    observaciones: 'Línea experimental',
  },
]

const GenealogiaLotes = () => {
  const [lotes, setLotes] = useState([])
  const [galpones, setGalpones] = useState([])
  const [genealogia, setGenealogia] = useState([])
  const [form, setForm] = useState({
    lote_gallinas: '',
    lote_gallos: '',
    lote_pollitos: '',
    galpon_eclosion: '',
    observaciones: '',
  })
  const [formError, setFormError] = useState('')
  const [search, setSearch] = useState('')
  const [filtered, setFiltered] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(false)

  // Simula fetch inicial
  useEffect(() => {
    setLotes(mockLotes)
    setGalpones(mockGalpones)
    setGenealogia(mockGenealogiaLotes)
    setFiltered(mockGenealogiaLotes)
  }, [])

  // Filtro instantáneo
  useEffect(() => {
    if (!search) {
      setFiltered(genealogia)
    } else {
      setFiltered(
        genealogia.filter(g =>
          [
            lotes.find(l => l.id === g.lote_gallinas)?.lote || '',
            lotes.find(l => l.id === g.lote_gallos)?.lote || '',
            g.lote_pollitos || '',
          ]
            .join(' ')
            .toLowerCase()
            .includes(search.toLowerCase())
        )
      )
    }
  }, [search, genealogia, lotes])

  // Manejo de formulario
  const handleChange = (e) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setFormError('')
    if (!form.lote_gallinas || !form.lote_gallos || !form.lote_pollitos || !form.galpon_eclosion) {
      setFormError('Complete todos los campos obligatorios.')
      return
    }
    if (form.lote_gallinas === form.lote_gallos) {
      setFormError('El lote de gallinas y el de gallos deben ser diferentes.')
      return
    }
    setLoading(true)
    setTimeout(() => {
      setGenealogia([
        ...genealogia,
        {
          id: genealogia.length + 1,
          lote_gallinas: Number(form.lote_gallinas),
          lote_gallos: Number(form.lote_gallos),
          lote_pollitos: form.lote_pollitos,
          galpon_eclosion: Number(form.galpon_eclosion),
          observaciones: form.observaciones,
        },
      ])
      setForm({
        lote_gallinas: '',
        lote_gallos: '',
        lote_pollitos: '',
        galpon_eclosion: '',
        observaciones: '',
      })
      setLoading(false)
      setShowModal(false)
    }, 800)
  }

  return (
    <CRow className="g-3">
      {/* Panel izquierdo: Formulario */}
      <CCol md={5}>
        <CCard>
          <CCardHeader>
            <CIcon icon={cilUser} className="me-2 text-success" />
            <strong>Registrar Genealogía de Lotes</strong>
          </CCardHeader>
          <CCardBody>
            <CForm onSubmit={handleSubmit}>
              <CFormLabel>Lote de Gallinas</CFormLabel>
              <CFormSelect
                name="lote_gallinas"
                value={form.lote_gallinas}
                onChange={handleChange}
                required
                className="mb-3"
              >
                <option value="">Seleccione el lote de gallinas</option>
                {lotes.filter(l => l.tipo === 'Gallinas').map(l => (
                  <option key={l.id} value={l.id}>{l.lote} ({l.galpon})</option>
                ))}
              </CFormSelect>
              <CFormLabel>Lote de Gallos</CFormLabel>
              <CFormSelect
                name="lote_gallos"
                value={form.lote_gallos}
                onChange={handleChange}
                required
                className="mb-3"
              >
                <option value="">Seleccione el lote de gallos</option>
                {lotes.filter(l => l.tipo === 'Gallos').map(l => (
                  <option key={l.id} value={l.id}>{l.lote} ({l.galpon})</option>
                ))}
              </CFormSelect>
              <CFormLabel>Lote de Pollitos (resultado)</CFormLabel>
              <CFormInput
                name="lote_pollitos"
                value={form.lote_pollitos}
                onChange={handleChange}
                required
                className="mb-3"
                placeholder="Ej: Pollitos 2024-05"
              />
              <CFormLabel>Galpón de Eclosión</CFormLabel>
              <CFormSelect
                name="galpon_eclosion"
                value={form.galpon_eclosion}
                onChange={handleChange}
                required
                className="mb-3"
              >
                <option value="">Seleccione galpón</option>
                {galpones.map(g => (
                  <option key={g.id} value={g.id}>{g.nombre}</option>
                ))}
              </CFormSelect>
              <CFormLabel>Observaciones</CFormLabel>
              <CFormTextarea
                name="observaciones"
                value={form.observaciones}
                onChange={handleChange}
                rows={3}
                className="mb-3"
                placeholder="Observaciones sobre la genealogía..."
              />
              {formError && <CFormFeedback className="d-block mb-2">{formError}</CFormFeedback>}
              <CButton color="success" type="submit" disabled={loading} className="w-100">
                {loading ? <CSpinner size="sm" /> : 'Registrar'}
              </CButton>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>

      {/* Panel derecho: Listado */}
      <CCol md={7}>
        <CCard>
          <CCardHeader className="d-flex align-items-center justify-content-between">
            <span>
              <CIcon icon={cilList} className="me-2 text-primary" />
              <strong>Genealogía de Lotes Registrada</strong>
            </span>
            <CInputGroup style={{ width: 250 }}>
              <CInputGroupText>
                <CIcon icon={cilSearch} />
              </CInputGroupText>
              <input
                type="text"
                className="form-control"
                placeholder="Buscar lote o galpón..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </CInputGroup>
          </CCardHeader>
          <CCardBody style={{ minHeight: 350 }}>
            {filtered.length === 0 && <div className="text-muted">No hay registros.</div>}
            {filtered.map((g, idx) => (
              <div key={g.id} className="mb-3">
                <div className="d-flex align-items-center">
                  <CIcon icon={cilChevronRight} className="me-1 text-secondary" />
                  <CBadge color="primary" className="me-1">
                    Gallinas: {lotes.find(l => l.id === g.lote_gallinas)?.lote}
                  </CBadge>
                  <CBadge color="warning" className="me-1">
                    Gallos: {lotes.find(l => l.id === g.lote_gallos)?.lote}
                  </CBadge>
                  <CBadge color="info" className="me-1">
                    Pollitos: {g.lote_pollitos}
                  </CBadge>
                  <CBadge color="secondary" className="me-1">
                    Eclosión: {galpones.find(ga => ga.id === g.galpon_eclosion)?.nombre}
                  </CBadge>
                  {g.observaciones && <span className="ms-2 text-muted">{g.observaciones}</span>}
                </div>
              </div>
            ))}
          </CCardBody>
        </CCard>
      </CCol>

      {/* Botón flotante para añadir rápidamente */}
      <CButton
        color="primary"
        style={{
          position: 'fixed',
          bottom: 32,
          right: 32,
          borderRadius: '50%',
          width: 56,
          height: 56,
          zIndex: 1000,
        }}
        onClick={() => setShowModal(true)}
      >
        <CIcon icon={cilPlus} size="xl" />
      </CButton>

      {/* Modal de entrada rápida */}
      <CModal visible={showModal} onClose={() => setShowModal(false)}>
        <CModalHeader>
          <strong>Añadir Genealogía de Lotes</strong>
        </CModalHeader>
        <CModalBody>
          <CForm onSubmit={handleSubmit}>
            <CFormLabel>Lote de Gallinas</CFormLabel>
            <CFormSelect
              name="lote_gallinas"
              value={form.lote_gallinas}
              onChange={handleChange}
              required
              className="mb-3"
            >
              <option value="">Seleccione el lote de gallinas</option>
              {lotes.filter(l => l.tipo === 'Gallinas').map(l => (
                <option key={l.id} value={l.id}>{l.lote} ({l.galpon})</option>
              ))}
            </CFormSelect>
            <CFormLabel>Lote de Gallos</CFormLabel>
            <CFormSelect
              name="lote_gallos"
              value={form.lote_gallos}
              onChange={handleChange}
              required
              className="mb-3"
            >
              <option value="">Seleccione el lote de gallos</option>
              {lotes.filter(l => l.tipo === 'Gallos').map(l => (
                <option key={l.id} value={l.id}>{l.lote} ({l.galpon})</option>
              ))}
            </CFormSelect>
            <CFormLabel>Lote de Pollitos (resultado)</CFormLabel>
            <CFormInput
              name="lote_pollitos"
              value={form.lote_pollitos}
              onChange={handleChange}
              required
              className="mb-3"
              placeholder="Ej: Pollitos 2024-05"
            />
            <CFormLabel>Galpón de Eclosión</CFormLabel>
            <CFormSelect
              name="galpon_eclosion"
              value={form.galpon_eclosion}
              onChange={handleChange}
              required
              className="mb-3"
            >
              <option value="">Seleccione galpón</option>
              {galpones.map(g => (
                <option key={g.id} value={g.id}>{g.nombre}</option>
              ))}
            </CFormSelect>
            <CFormLabel>Observaciones</CFormLabel>
            <CFormTextarea
              name="observaciones"
              value={form.observaciones}
              onChange={handleChange}
              rows={3}
              className="mb-3"
              placeholder="Observaciones sobre la genealogía..."
            />
            {formError && <CFormFeedback className="d-block mb-2">{formError}</CFormFeedback>}
            <CButton color="success" type="submit" disabled={loading} className="w-100">
              {loading ? <CSpinner size="sm" /> : 'Registrar'}
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

export default GenealogiaLotes