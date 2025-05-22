import React from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CRow,
  CCol,
  CCarousel,
  CCarouselItem,
  CCarouselCaption,
  CCardTitle,
  CCardText,
  CProgress,
  CBadge,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLeaf, cilBarChart, cilGroup, cilBasket, cilChartPie } from '@coreui/icons'

const videos = [
  {
    src: 'https://www.youtube.com/embed/iGo5eRtorT8?si=P5C9DjV9bZfhirMz',
    title: '¿Qué es una granja avícola?',
  },
  {
    src: 'https://www.youtube.com/embed/6bgou2Ob2QM?si=gfFu_f8_rBCe5FIG',
    title: 'Procesos modernos en la avicultura',
  },
]

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
  return (
    <div className="container-lg py-4">
      <CRow className="mb-4">
        <CCol md={8}>
          <CCard>
            <CCardHeader>
              <CIcon icon={cilLeaf} className="me-2 text-success" />
              <strong>Bienvenido a Granja Avícola Futurista</strong>
            </CCardHeader>
            <CCardBody>
              <CCardTitle>Misión</CCardTitle>
              <CCardText>
                Producir alimentos avícolas de alta calidad, garantizando el bienestar animal, la sostenibilidad ambiental y la innovación tecnológica, para satisfacer las necesidades alimentarias de la sociedad.
              </CCardText>
              <CCardTitle>Visión</CCardTitle>
              <CCardText>
                Ser líderes en la industria avícola, reconocidos por la excelencia operativa, el compromiso con el medio ambiente y la mejora continua en todos nuestros procesos.
              </CCardText>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol md={4}>
          <CCard className="h-100">
            <CCardHeader>
              <CIcon icon={cilBarChart} className="me-2 text-warning" />
              <strong>Estadísticas Clave</strong>
            </CCardHeader>
            <CCardBody>
              <div className="mb-2">
                <CIcon icon={cilGroup} className="me-2 text-info" />
                <strong>Gallinas:</strong> 12,500
              </div>
              <div className="mb-2">
                <CIcon icon={cilBasket} className="me-2 text-success" />
                <strong>Producción diaria de huevos:</strong> 11,800
              </div>
              <div className="mb-2">
                <CIcon icon={cilChartPie} className="me-2 text-primary" />
                <strong>Eficiencia de conversión:</strong> 92%
              </div>
              <div className="mb-2">
                <CIcon icon={cilLeaf} className="me-2 text-success" />
                <strong>Consumo de alimento/día:</strong> 1,200 kg
              </div>
              <div>
                <CProgress value={92} color="success" className="mb-2" />
                <small>Eficiencia de conversión</small>
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <CRow className="mb-4">
        <CCol md={7}>
          <CCard>
            <CCardHeader>
              <CIcon icon={cilBarChart} className="me-2 text-primary" />
              <strong>¿Cómo funciona una granja avícola moderna?</strong>
            </CCardHeader>
            <CCardBody>
              <ul>
                <li>
                  <strong>Bienestar animal:</strong> Espacios adecuados, alimentación balanceada y monitoreo constante.
                </li>
                <li>
                  <strong>Tecnología:</strong> Uso de sensores, automatización y análisis de datos para optimizar la producción.
                </li>
                <li>
                  <strong>Sostenibilidad:</strong> Gestión eficiente de recursos y reducción del impacto ambiental.
                </li>
                <li>
                  <strong>Control sanitario:</strong> Protocolos estrictos de vacunación y bioseguridad.
                </li>
                <li>
                  <strong>Gestión profesional:</strong> Personal capacitado y procesos certificados.
                </li>
              </ul>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol md={5}>
          
          <CCard>
            <CCardHeader>
              <CIcon icon={cilBarChart} className="me-2 text-danger" />
              <strong>Videos Educativos</strong>
            </CCardHeader>
            <CCardBody>
             <CCarousel controls indicators dark className=" align-items-center">
              
              {videos.map((video, idx) => (
                <CCarouselItem key={idx}>
                <div key={idx} className="mb-3 ratio ratio-16x9 ">
                  <iframe
                    src={video.src}
                    title={video.title}
                    allowFullScreen
                    style={{ borderRadius: '8px', width: '80%', height: '200px' }}
                  ></iframe>
                </div>
                </CCarouselItem>
              ))}
           </CCarousel>
              
            </CCardBody>
          </CCard>

        </CCol>
      </CRow>

      <CRow>
        <CCol>
          <CCard>
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
                      style={{ maxHeight: '350px', objectFit: 'cover', borderRadius: '8px' }}
                    />
                    <CCarouselCaption className="d-none d-md-block">
                      <h5>
                        <CBadge color="success" className="fs-6">{img.caption}</CBadge>
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
  )
}

export default Inicio