import React, { useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CAlert,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'

const API_URL = 'http://localhost:3001'

const Register = () => {
  const [nombreUsuario, setNombreUsuario] = useState('')
  const [nombreCompleto, setNombreCompleto] = useState('')
  const [password, setPassword] = useState('')
  const [repeatPassword, setRepeatPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    // Validaciones
    if (!nombreUsuario || !nombreCompleto || !password || !repeatPassword) {
      setError('Todos los campos son obligatorios.')
      return
    }
    if (nombreUsuario.length < 5) {
      setError('El usuario debe tener al menos 5 caracteres.')
      return
    }
    if (nombreCompleto.length < 4) {
      setError('El nombre completo debe tener al menos 4 letras.')
      return
    }
    if (password.length < 4) {
      setError('La contraseña debe tener al menos 4 caracteres.')
      return
    }
    if (password !== repeatPassword) {
      setError('Las contraseñas no coinciden.')
      return
    }

    // Verificar si el usuario ya existe
    try {
      const res = await fetch(
        `${API_URL}/usuarios?nombre_usuario=${encodeURIComponent(nombreUsuario)}`,
      )
      const users = await res.json()
      if (users.length > 0) {
        setError('El nombre de usuario ya existe.')
        return
      }

      // Obtener el siguiente id_usuario
      const allRes = await fetch(`${API_URL}/usuarios`)
      const allUsers = await allRes.json()
      const maxId =
        allUsers.length > 0 ? Math.max(...allUsers.map((u) => Number(u.id_usuario) || 0)) : 0
      const nextId = maxId + 1

      // Crear usuario
      const payload = {
        id_usuario: nextId,
        nombre_usuario: nombreUsuario,
        nombre_completo: nombreCompleto,
        password: password,
        id_rol: 1, // Puedes cambiar el rol según tu lógica
      }

      const saveRes = await fetch(`${API_URL}/usuarios`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (saveRes.ok) {
        setSuccess('¡Usuario registrado exitosamente! Ya puedes iniciar sesión.')
        setNombreUsuario('')
        setNombreCompleto('')
        setPassword('')
        setRepeatPassword('')
      } else {
        setError('No se pudo registrar el usuario.')
      }
    } catch (err) {
      setError('Error de conexión con el servidor.')
    }
  }

  return (
    <div
      className="min-vh-100 d-flex flex-row align-items-center justify-content-center"
      style={{
        background: 'linear-gradient(135deg, #e0f7fa 0%, #f9fbe7 100%)',
        backgroundImage: `url('https://images.unsplash.com/photo-1588597989061-b60ad0eefdbf?q=80&w=869&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(255,255,255,0.8)',
          zIndex: 1,
        }}
      />
      <CContainer style={{ position: 'relative', zIndex: 2 }}>
        <CRow className="justify-content-center">
          <CCol md={10} lg={8} xl={6}>
            <CCard
              className="mx-4"
              style={{
                borderRadius: '2rem',
                boxShadow: '0 12px 40px 0 rgba(31, 38, 135, 0.18)',
                border: 'none',
                background: 'rgba(255,255,255,0.98)',
                backdropFilter: 'blur(8px)',
              }}
            >
              <CCardBody className="p-5">
                <div className="text-center mb-4">
                  <img
                    src="src/assets/images/logo.webp"
                    alt="Logo granja"
                    style={{ width: 70, marginBottom: 12, borderRadius: '50%', boxShadow: '0 2px 8px #b2dfdb' }}
                  />
                  <h1 style={{ color: '#388e3c', fontWeight: 800, letterSpacing: 1.5, fontSize: 32 }}>
                    Registro Granja Avícola
                  </h1>
                  <p className="text-body-secondary" style={{ fontSize: 17 }}>
                    Crea tu cuenta para gestionar huevos, pollos y producción
                  </p>
                </div>
                <CForm onSubmit={handleRegister}>
                  <CRow className="g-3">
                    <CCol xs={12} md={6}>
                      <CInputGroup>
                        <CInputGroupText style={{ background: '#e8f5e9' }}>
                          <CIcon icon={cilUser} style={{ color: '#388e3c' }} />
                        </CInputGroupText>
                        <CFormInput
                          placeholder="Usuario"
                          autoComplete="username"
                          value={nombreUsuario}
                          onChange={(e) => setNombreUsuario(e.target.value)}
                          maxLength={20}
                        />
                      </CInputGroup>
                    </CCol>
                    <CCol xs={12} md={6}>
                      <CInputGroup>
                        <CInputGroupText style={{ background: '#e8f5e9' }}>
                          <CIcon icon={cilUser} style={{ color: '#388e3c' }} />
                        </CInputGroupText>
                        <CFormInput
                          placeholder="Nombre completo"
                          autoComplete="name"
                          value={nombreCompleto}
                          onChange={(e) => setNombreCompleto(e.target.value)}
                          maxLength={40}
                        />
                      </CInputGroup>
                    </CCol>
                    <CCol xs={12} md={6}>
                      <CInputGroup>
                        <CInputGroupText style={{ background: '#e8f5e9' }}>
                          <CIcon icon={cilLockLocked} style={{ color: '#388e3c' }} />
                        </CInputGroupText>
                        <CFormInput
                          type="password"
                          placeholder="Contraseña"
                          autoComplete="new-password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          maxLength={20}
                        />
                      </CInputGroup>
                    </CCol>
                    <CCol xs={12} md={6}>
                      <CInputGroup>
                        <CInputGroupText style={{ background: '#e8f5e9' }}>
                          <CIcon icon={cilLockLocked} style={{ color: '#388e3c' }} />
                        </CInputGroupText>
                        <CFormInput
                          type="password"
                          placeholder="Repetir contraseña"
                          autoComplete="new-password"
                          value={repeatPassword}
                          onChange={(e) => setRepeatPassword(e.target.value)}
                          maxLength={20}
                        />
                      </CInputGroup>
                    </CCol>
                  </CRow>
                  {error && (
                    <CAlert color="danger" className="py-2 text-center mt-3">
                      {error}
                    </CAlert>
                  )}
                  {success && (
                    <CAlert color="success" className="py-2 text-center mt-3">
                      {success}
                    </CAlert>
                  )}
                  <div className="d-flex flex-column flex-md-row gap-3 mt-4">
                    <CButton
                      color="primary"
                      style={{
                        background: 'linear-gradient(90deg, #43cea2 0%, #185a9d 100%)',
                        border: 'none',
                        fontWeight: 700,
                        letterSpacing: 1,
                        color: '#fff',
                        fontSize: 17,
                        padding: '0.75rem 1.5rem',
                      }}
                      variant="outline"
                      onClick={() => (window.location.href = '/login')}
                      className="flex-fill"
                    >
                      Ir al Login
                    </CButton>
                    <CButton
                      color="success"
                      style={{
                        background: 'linear-gradient(90deg, #43cea2 0%, #388e3c 100%)',
                        border: 'none',
                        fontWeight: 700,
                        letterSpacing: 1,
                        color: '#fff',
                        fontSize: 17,
                        padding: '0.75rem 1.5rem',
                      }}
                      type="submit"
                      className="flex-fill"
                    >
                      Crear Cuenta
                    </CButton>
                  </div>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Register
