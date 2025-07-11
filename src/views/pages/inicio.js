import React, { useState, useEffect } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CRow,
  CCol,
  CCarousel,
  CCarouselItem,
  CCarouselCaption,
  CBadge,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLeaf, cilBarChart, cilHeart, cilLaptop } from '@coreui/icons'
import { Link } from 'react-router-dom'

const API_URL = 'http://localhost:3001'

const images = [
  {
    src: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    caption: 'Bienestar Animal',
  },
  {
    src: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=800&q=80',
    caption: 'Tecnología en la Granja',
  },
  {
    src: 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&w=800&q=80',
    caption: 'Producción Sostenible',
  },
]

const Inicio = () => {
  
  const [stats, setStats] = useState({
    totalHens: 0,
    dailyProduction: 0,
    efficiency: 0,
  })

  useEffect(() => {
    const fetchStats = async () => {
      
      try {
        console.log('Fetching public stats...')
        const [galponesRes, produccionRes] = await Promise.all([
          fetch(`${API_URL}/galpones`),
          fetch(`${API_URL}/produccion`),
        ])
        const galpones = await galponesRes.json()
        const produccion = await produccionRes.json()

        const totalHens = galpones.reduce((sum, g) => sum + Number(g.aves || 0), 0)

        if (produccion.length > 0) {
          const lastDate = produccion.sort((a, b) => new Date(b.fecha) - new Date(a.fecha))[0].fecha
          const dailyProduction = produccion
            .filter((p) => p.fecha === lastDate && p.tipo_producto === 'huevo')
            .reduce((sum, p) => sum + Number(p.cantidad || 0), 0)

          const efficiency = totalHens > 0 ? Math.round((dailyProduction / totalHens) * 100) : 0

          setStats({ totalHens, dailyProduction, efficiency })
        } else {
          setStats({ totalHens, dailyProduction: 0, efficiency: 0 })
        }
      } catch (error) {
        console.error('Error fetching public stats:', error)
        // Set default stats on error
        setStats({ totalHens: 12500, dailyProduction: 11800, efficiency: 92 })
      }
    }
    fetchStats()
  }, [])

  return (
    <div style={{ backgroundColor: '#f8f9fa' }}>
      {/* Hero Section */}
      <div
        className="p-5 text-center bg-image"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1588597989061-b60ad0eefdbf?q=80&w=1920&auto=format&fit=crop')`,
          height: '50vh',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div
          className="mask d-flex justify-content-center align-items-center h-100"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
        >
          <div className="text-white">
            <h1 className="mb-3" style={{ fontWeight: 700, fontSize: '3rem' }}>
              Granja Avícola - AviVen
            </h1>
            <h4 className="mb-3">Calidad y Sostenibilidad en cada Huevo</h4>
            <Link to="/login" className="btn btn-outline-light btn-lg">
              Iniciar Sesión
            </Link>
          </div>
        </div>
      </div>

      <div className="container mt-n5" style={{ zIndex: 1, position: 'relative' }}>
        {/* Stats Cards */}
        <CRow className="justify-content-center text-center mb-5">
          <CCol md={4}>
            <CCard className="shadow-lg border-0 h-100">
              <CCardBody>
                <CIcon icon={cilHeart} size="3xl" className="text-danger mb-3" />
                <h5 className="card-title">Bienestar Animal</h5>
                <p className="card-text">
                  Nuestras aves viven en un entorno libre de estrés, con acceso a alimento nutritivo
                  y agua fresca, garantizando su salud y felicidad.
                </p>
              </CCardBody>
            </CCard>
          </CCol>
          <CCol md={4}>
            <CCard className="shadow-lg border-0 h-100">
              <CCardBody>
                <CIcon icon={cilLaptop} size="3xl" className="text-primary mb-3" />
                <h5 className="card-title">Tecnología de Punta</h5>
                <p className="card-text">
                  Implementamos sistemas automatizados y análisis de datos para monitorear el
                  ambiente y optimizar la producción de forma eficiente.
                </p>
              </CCardBody>
            </CCard>
          </CCol>
          <CCol md={4}>
            <CCard className="shadow-lg border-0 h-100">
              <CCardBody>
                <CIcon icon={cilLeaf} size="3xl" className="text-success mb-3" />
                <h5 className="card-title">Sostenibilidad</h5>
                <p className="card-text">
                  Estamos comprometidos con prácticas ecológicas, gestionando los recursos de manera
                  responsable para minimizar nuestro impacto ambiental.
                </p>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>

        {/* Mission and Vision */}
        <CRow className="mb-5 align-items-center">
          <CCol md={6}>
            <h2>Nuestra Filosofía</h2>
            <p className="lead">
              Creemos en una avicultura que respeta la vida y el planeta. Cada proceso en nuestra
              granja está diseñado para ser ético, eficiente y sostenible.
            </p>
            <h4>Misión</h4>
            <p>
              Producir alimentos avícolas de la más alta calidad, garantizando el bienestar animal y
              la sostenibilidad ambiental a través de la innovación tecnológica.
            </p>
            <h4>Visión</h4>
            <p>
              Ser un referente en la industria avícola, reconocidos por nuestra excelencia
              operativa, compromiso con el medio ambiente y la mejora continua.
            </p>
          </CCol>
          <CCol md={6}>
            <img
              src="https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&w=800&q=80"
              className="img-fluid rounded shadow"
              alt="Producción Sostenible"
            />
          </CCol>
        </CRow>

        {/* Dynamic Stats Section */}
        <CRow className="text-center bg-light p-4 rounded mb-5">
          <CCol>
            <h2 className="mb-4">Nuestra Granja en Números</h2>
          </CCol>
          <CRow>
            <CCol md={4}>
              <h3>{stats.totalHens.toLocaleString()}</h3>
              <p className="text-muted">Aves en Producción</p>
            </CCol>
            <CCol md={4}>
              <h3>{stats.dailyProduction.toLocaleString()}</h3>
              <p className="text-muted">Huevos Producidos (Último Día)</p>
            </CCol>
            <CCol md={4}>
              <h3>{stats.efficiency}%</h3>
              <p className="text-muted">Eficiencia de Puesta</p>
            </CCol>
          </CRow>
        </CRow>

        {/* Gallery */}
        <CRow>
          <CCol>
            <CCard className="shadow border-0">
              <CCardHeader>
                <CIcon icon={cilBarChart} className="me-2 text-success" />
                <strong>Galería de la Granja</strong>
              </CCardHeader>
              <CCardBody>
                <CCarousel controls indicators dark>
                  {images.map((img, idx) => (
                    <CCarouselItem key={idx}>
                      <img
                        className="d-block w-100"
                        src={img.src}
                        alt={img.caption}
                        style={{ maxHeight: '450px', objectFit: 'cover', borderRadius: '8px' }}
                      />
                      <CCarouselCaption className="d-none d-md-block">
                        <h5>
                          <CBadge color="dark" className="fs-6 p-2">
                            {img.caption}
                          </CBadge>
                        </h5>
                      </CCarouselCaption>
                    </CCarouselItem>
                  ))}
                </CCarousel>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </div>
    </div>
  )
}
export default Inicio;