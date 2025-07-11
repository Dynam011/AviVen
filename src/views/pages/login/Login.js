import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
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
import logo from '../../../assets/images/logo.webp'

const API_URL = 'http://localhost:3001'

const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    // Buscar usuario en db.json (json-server)
    try {
      // CAMBIA usuario POR nombre_usuario SEGÚN TU db.json
      const res = await fetch(`${API_URL}/usuarios?nombre_usuario=${encodeURIComponent(username)}`)
      const users = await res.json()
      if (users.length === 0) {
        setError('Datos incorrectos')
        return
      }
      const user = users[0]

      if (user.password !== password) {
        setError('Datos incorrectos.')
        return
      }
      // Guardar usuario en localStorage
      const fakeToken = btoa(`${user.nombre_usuario}:${Date.now()}`)
      localStorage.setItem('token', fakeToken)
      localStorage.setItem('usuario', JSON.stringify(user))
      navigate('/')
    } catch (err) {
      setError('Error de conexión con el servidor.')
    }
  }

  return (
    <div
      className="min-vh-100 d-flex flex-row align-items-center"
      style={{
        background: 'linear-gradient(135deg, #f9fbe7 0%, #e0f7fa 100%)',
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
          background: 'rgba(255,255,255,0.7)',
          zIndex: 1,
        }}
      />
      <CContainer style={{ position: 'relative', zIndex: 2 }}>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
              <CCard
                className="p-4"
                style={{
                  borderRadius: '1.5rem',
                  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
                  border: 'none',
                  background: 'rgba(255,255,255,0.95)',
                  backdropFilter: 'blur(6px)',
                }}
              >
                <CCardBody>
                  <div className="text-center mb-4">
                    <img
                      src={logo}
                      alt="Logo granja"
                      style={{ width: 60, marginBottom: 10 }}
                    />
                    <h1 style={{ color: '#388e3c', fontWeight: 700, letterSpacing: 1 }}>
                      Granja Avícola
                    </h1>
                    <p className="text-body-secondary" style={{ fontSize: 16 }}>
                      Bienvenido, ingresa para gestionar tu producción
                    </p>
                  </div>
                  <CForm onSubmit={handleLogin}>
                    <CInputGroup className="mb-3">
                      <CInputGroupText style={{ background: '#e8f5e9' }}>
                        <CIcon icon={cilUser} style={{ color: '#388e3c' }} />
                      </CInputGroupText>
                      <CFormInput
                        placeholder="Usuario"
                        autoComplete="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText style={{ background: '#e8f5e9' }}>
                        <CIcon icon={cilLockLocked} style={{ color: '#388e3c' }} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="Contraseña"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </CInputGroup>
                    {error && (
                      <CAlert color="danger" className="py-2 text-center">
                        {error}
                      </CAlert>
                    )}
                    <CRow>
                      <CCol xs={6}>
                        <CButton
                          color="success"
                          className="px-4"
                          style={{
                            background: 'linear-gradient(90deg,rgb(31, 136, 103) 0%, #185a9d 100%)',
                            border: 'none',
                            fontWeight: 600,
                            letterSpacing: 1,
                            color: '#fff',
                          }}
                          type="submit"
                        >
                          Ingresar
                        </CButton>
                      </CCol>
                      <CCol xs={6} className="text-right">
                        <CButton color="link" className="px-0" style={{ color: '#388e3c' }}>
                          ¿Olvidaste tu contraseña?
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
              <CCard
                className="text-white py-5 d-none d-md-block"
                style={{
                  width: '44%',
                  borderRadius: '1.5rem',
                  background: 'linear-gradient(135deg, #43cea2 0%, #388e3c 100%)',
                  border: 'none',
                  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.10)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <CCardBody className="text-center d-flex flex-column align-items-center justify-content-center h-100">
                  <img
                    src={logo}
                    alt="Gallina"
                    style={{
                      width: 80,
                      marginBottom: 16,
                      background: '#fff',
                      borderRadius: '50%',
                      padding: 8,
                    }}
                  />
                  <h2 style={{ fontWeight: 700 }}>¡Únete a la granja!</h2>
                  <p>
                    Gestiona huevos, pollos y producción con facilidad.
                    <br />
                    Regístrate para llevar el control de tu granja avícola.
                  </p>
                  <a href="/#/register">
                    <CButton
                      color="light"
                      className="mt-3"
                      style={{
                        color: '#388e3c',
                        fontWeight: 600,
                        border: 'none',
                        background: '#fff',
                        letterSpacing: 1,
                      }}
                      active
                      tabIndex={-1}
                    >
                      ¡Regístrate!
                    </CButton>
                  </a>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
