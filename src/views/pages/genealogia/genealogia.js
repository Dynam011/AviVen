import React, { useState, useEffect } from 'react'
import {
  CCard, CCardBody, CCardHeader, CCol, CRow, CForm, CFormLabel, CFormSelect,
  CButton, CInputGroup, CInputGroupText, CFormFeedback, CFormTextarea, CSpinner,
  CModal, CModalHeader, CModalBody, CModalFooter, CTooltip, CBadge
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilList ,cilPlus, cilSearch, cilUser, cilChevronRight, cilChevronBottom } from '@coreui/icons'

// Simulación de datos de reproductores (reemplaza por fetch a tu API)
const mockReproductores = [
  { id: 1, codigo: 'R-001', sexo: 'M' },
  { id: 2, codigo: 'R-002', sexo: 'F' },
  { id: 3, codigo: 'R-003', sexo: 'M' },
  { id: 4, codigo: 'R-004', sexo: 'F' },
  { id: 5, codigo: 'R-005', sexo: 'M' },
  { id: 6, codigo: 'R-006', sexo: 'F' },
]

// Simulación de datos de genealogía (reemplaza por fetch a tu API)
const mockGenealogia = [
  { id: 1, padre: 1, madre: 2, observaciones: 'Línea A', hijos: [7] },
  { id: 2, padre: 3, madre: 4, observaciones: 'Línea B', hijos: [8] },
  { id: 7, padre: 1, madre: 2, observaciones: 'Nieto A', hijos: [] },
  { id: 8, padre: 3, madre: 4, observaciones: 'Nieto B', hijos: [] },
]

function getReproductoresBySexo(sexo) {
  return mockReproductores.filter(r => r.sexo === sexo)
}

// Utilidad para construir árbol genealógico hasta 3 generaciones
function buildGenealogyTree(genealogia, reproductores, rootId, depth = 3) {
  if (!rootId || depth === 0) return null
  const node = genealogia.find(g => g.id === rootId)
  if (!node) return null
  const padre = reproductores.find(r => r.id === node.padre)
  const madre = reproductores.find(r => r.id === node.madre)
  return {
    id: node.id,
    padre: padre ? { ...padre, sub: buildGenealogyTree(genealogia, reproductores, padre.id, depth - 1) } : null,
    madre: madre ? { ...madre, sub: buildGenealogyTree(genealogia, reproductores, madre.id, depth - 1) } : null,
    observaciones: node.observaciones,
  }
}

// Evita referencias circulares en la cadena genealógica
function hasCircularReference(genealogia, padreId, madreId, hijoId) {
  const getAncestors = (id, visited = new Set()) => {
    if (!id || visited.has(id)) return []
    visited.add(id)
    const node = genealogia.find(g => g.id === id)
    if (!node) return []
    return [
      node.padre,
      node.madre,
      ...getAncestors(node.padre, visited),
      ...getAncestors(node.madre, visited),
    ]
  }
  const ancestors = [
    ...getAncestors(padreId),
    ...getAncestors(madreId),
  ]
  return ancestors.includes(hijoId)
}

const Genealogia = () => {
  // Estados
  const [reproductores, setReproductores] = useState([])
  const [genealogia, setGenealogia] = useState([])
  const [padreId, setPadreId] = useState('')
  const [madreId, setMadreId] = useState('')
  const [observaciones, setObservaciones] = useState('')
  const [formError, setFormError] = useState('')
  const [search, setSearch] = useState('')
  const [filtered, setFiltered] = useState([])
  const [selectedNode, setSelectedNode] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(false)

  // Simula fetch inicial
  useEffect(() => {
    setReproductores(mockReproductores)
    setGenealogia(mockGenealogia)
    setFiltered(mockGenealogia)
  }, [])

  // Filtro instantáneo
  useEffect(() => {
    if (!search) {
      setFiltered(genealogia)
    } else {
      setFiltered(
        genealogia.filter(g =>
          [g.padre, g.madre]
            .map(id => reproductores.find(r => r.id === id)?.codigo || '')
            .join(' ')
            .toLowerCase()
            .includes(search.toLowerCase())
        )
      )
    }
  }, [search, genealogia, reproductores])

  // Manejo de formulario
  const handleSubmit = (e) => {
    e.preventDefault()
    setFormError('')
    if (!padreId || !madreId) {
      setFormError('Seleccione ambos padres.')
      return
    }
    if (padreId === madreId) {
      setFormError('Padre y madre no pueden ser el mismo.')
      return
    }
    // Validación de referencia circular
    if (hasCircularReference(genealogia, Number(padreId), Number(madreId), null)) {
      setFormError('Referencia circular detectada en la genealogía.')
      return
    }
    // Simula guardar
    setLoading(true)
    setTimeout(() => {
      setGenealogia([
        ...genealogia,
        {
          id: genealogia.length + 1,
          padre: Number(padreId),
          madre: Number(madreId),
          observaciones,
          hijos: [],
        },
      ])
      setPadreId('')
      setMadreId('')
      setObservaciones('')
      setLoading(false)
      setShowModal(false)
    }, 800)
  }

  // Renderiza árbol genealógico recursivo
  const renderTree = (node, gen = 1) => {
    if (!node || gen > 3) return null
    return (
      <div style={{ marginLeft: gen > 1 ? 24 : 0, borderLeft: gen > 1 ? '2px solid #e0e0e0' : 'none', paddingLeft: 12 }}>
        <div>
          <CIcon icon={cilUser} className="me-2 text-success" />
          <strong>{node.id ? `ID: ${node.id}` : ''}</strong>
          {node.padre && <CBadge color="primary" className="ms-2">Padre: {node.padre.codigo}</CBadge>}
          {node.madre && <CBadge color="warning" className="ms-2">Madre: {node.madre.codigo}</CBadge>}
          {node.observaciones && <span className="ms-2 text-muted">{node.observaciones}</span>}
        </div>
        <div className="d-flex">
          {node.padre && renderTree(node.padre.sub, gen + 1)}
          {node.madre && renderTree(node.madre.sub, gen + 1)}
        </div>
      </div>
    )
  }

  return (
    <CRow className="g-3">
      {/* Panel izquierdo: Formulario */}
      <CCol md={5}>
        <CCard>
          <CCardHeader>
            <CIcon icon={cilUser} className="me-2 text-success" />
            <strong>Registrar Genealogía</strong>
          </CCardHeader>
          <CCardBody>
            <CForm onSubmit={handleSubmit}>
              <CFormLabel>Padre</CFormLabel>
              <CFormSelect
                value={padreId}
                onChange={e => setPadreId(e.target.value)}
                required
                className="mb-3"
              >
                <option value="">Seleccione el padre</option>
                {getReproductoresBySexo('M').map(r => (
                  <option key={r.id} value={r.id}>{r.codigo}</option>
                ))}
              </CFormSelect>
              <CFormLabel>Madre</CFormLabel>
              <CFormSelect
                value={madreId}
                onChange={e => setMadreId(e.target.value)}
                required
                className="mb-3"
              >
                <option value="">Seleccione la madre</option>
                {getReproductoresBySexo('F').map(r => (
                  <option key={r.id} value={r.id}>{r.codigo}</option>
                ))}
              </CFormSelect>
              <CFormLabel>Observaciones</CFormLabel>
              <CFormTextarea
                value={observaciones}
                onChange={e => setObservaciones(e.target.value)}
                rows={4}
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

      {/* Panel derecho: Listado y árbol */}
      <CCol md={7}>
        <CCard>
          <CCardHeader className="d-flex align-items-center justify-content-between">
            <span>
              <CIcon icon={cilList} className="me-2 text-primary" />
              <strong>Genealogía Registrada</strong>
            </span>
            <CInputGroup style={{ width: 250 }}>
              <CInputGroupText>
                <CIcon icon={cilSearch} />
              </CInputGroupText>
              <input
                type="text"
                className="form-control"
                placeholder="Buscar pareja..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </CInputGroup>
          </CCardHeader>
          <CCardBody style={{ minHeight: 350 }}>
            {filtered.length === 0 && <div className="text-muted">No hay registros.</div>}
            {filtered.map((g, idx) => (
              <div key={g.id} className="mb-3">
                <div
                  className="d-flex align-items-center"
                  style={{ cursor: 'pointer' }}
                  onClick={() => setSelectedNode(buildGenealogyTree(genealogia, reproductores, g.id))}
                >
                  <CIcon icon={cilChevronRight} className="me-1 text-secondary" />
                  <span>
                    <CBadge color="primary" className="me-1">
                      Padre: {reproductores.find(r => r.id === g.padre)?.codigo}
                    </CBadge>
                    <CBadge color="warning" className="me-1">
                      Madre: {reproductores.find(r => r.id === g.madre)?.codigo}
                    </CBadge>
                  </span>
                  <CTooltip content="Ver árbol genealógico">
                    <CIcon icon={cilChevronBottom} className="ms-2 text-info" />
                  </CTooltip>
                </div>
                {/* Árbol genealógico expandible */}
                {selectedNode && selectedNode.id === g.id && (
                  <div className="mt-2">{renderTree(selectedNode)}</div>
                )}
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
          <strong>Añadir rápidamente</strong>
        </CModalHeader>
        <CModalBody>
          <CForm onSubmit={handleSubmit}>
            <CFormLabel>Padre</CFormLabel>
            <CFormSelect
              value={padreId}
              onChange={e => setPadreId(e.target.value)}
              required
              className="mb-3"
            >
              <option value="">Seleccione el padre</option>
              {getReproductoresBySexo('M').map(r => (
                <option key={r.id} value={r.id}>{r.codigo}</option>
              ))}
            </CFormSelect>
            <CFormLabel>Madre</CFormLabel>
            <CFormSelect
              value={madreId}
              onChange={e => setMadreId(e.target.value)}
              required
              className="mb-3"
            >
              <option value="">Seleccione la madre</option>
              {getReproductoresBySexo('F').map(r => (
                <option key={r.id} value={r.id}>{r.codigo}</option>
              ))}
            </CFormSelect>
            <CFormLabel>Observaciones</CFormLabel>
            <CFormTextarea
              value={observaciones}
              onChange={e => setObservaciones(e.target.value)}
              rows={4}
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

export default Genealogia