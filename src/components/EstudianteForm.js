import React, { useState, useEffect } from 'react'
import { CButton, CCol, CForm, CFormInput, CContainer, CRow } from '@coreui/react'

const EstudianteForm = ({ estudiante, onAddEstudiante, onSubmit, onClose }) => {
  const [primerNombre, setPrimerNombre] = useState('')
  const [segundoNombre, setSegundoNombre] = useState('')
  const [primerApellido, setPrimerApellido] = useState('')
  const [segundoApellido, setSegundoApellido] = useState('')
  const [cedula, setCedula] = useState('')
  const [fechaNacimiento, setFechaNacimiento] = useState('')

  useEffect(() => {
    if (estudiante) {
      setPrimerNombre(estudiante.primerNombre || '')
      setSegundoNombre(estudiante.segundoNombre || '')

      setPrimerApellido(estudiante.primerApellido || '')
      setSegundoApellido(estudiante.segundoApellido || '')

      setCedula(estudiante.cedula || '')

      setFechaNacimiento(estudiante.fechaNacimiento || '')
    }
  }, [estudiante])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (estudiante) {
      onSubmit({
        ...estudiante, // Mantiene los datos originales del estudiante
        primerNombre,
        primerApellido,
        cedula,

        fechaNacimiento,
      })
    }
    if (
      primerApellido &&
      segundoApellido &&
      primerNombre &&
      segundoNombre &&
      cedula &&
      fechaNacimiento
    ) {
      onAddEstudiante({
        primerNombre,
        segundoNombre,
        primerApellido,
        segundoApellido,
        cedula,
        fechaNacimiento,
      })

      // Limpiar los campos después de la inserción
      setPrimerNombre('')
      setSegundoNombre('')
      setPrimerApellido('')
      setSegundoApellido('')
      setCedula('')
      setFechaNacimiento('')

      console.log('Cerrando formulario...')
    }
  }

  return (
    <CForm onSubmit={handleSubmit}>
      <CContainer>
        <label>Nombres</label>
        <CRow>
          <CCol sm="auto">
            <CFormInput
              type="text"
              placeholder="Ingresa el primer nombre"
              value={primerNombre}
              onChange={(e) => setPrimerNombre(e.target.value)}
              required
            />
          </CCol>
          <CCol sm="auto">
            <CFormInput
              type="text"
              placeholder="Ingresa el segundo nombre"
              value={segundoNombre}
              onChange={(e) => setSegundoNombre(e.target.value)}
              required
            />
          </CCol>
        </CRow>
        <label>Apellidos</label>
        <CRow>
          <CCol sm="auto">
            <CFormInput
              type="text"
              placeholder="Ingresa el primer apellido"
              value={primerApellido}
              onChange={(e) => setPrimerApellido(e.target.value)}
              required
            />
          </CCol>
          <CCol sm="auto">
            <CFormInput
              type="text"
              placeholder="Ingresa el segundo apellido"
              value={segundoApellido}
              onChange={(e) => setSegundoApellido(e.target.value)}
              required
            />
          </CCol>
        </CRow>
        <label>Cédula</label>
        <CFormInput
          type="text"
          pattern="[0-9]+"
          placeholder="Ingresa la cédula"
          value={cedula}
          maxLength={8}
          onChange={(e) => setCedula(e.target.value.replace(/\D/g, ''))}
          required
        />
        <label>Fecha de Nacimiento</label>
        <CFormInput
          type="date"
          value={fechaNacimiento}
          onChange={(e) => setFechaNacimiento(e.target.value)}
          required
        />
      </CContainer>

      <CButton type="submit" color="primary">
        Agregar Estudiante
      </CButton>
    </CForm>
  )
}

export default EstudianteForm
