import React from 'react'
import {
  CButton,
  CCol,
  CContainer,
  CRow,
  CCard,
  CCardBody,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilWarning } from '@coreui/icons'

const Page404 = () => {
  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8} lg={6}>
            <CCard className="shadow-lg border-0">
              <CCardBody className="text-center py-5">
                <CIcon icon={cilWarning} size="xxl" className="mb-4 text-info" width={64} height={64} />
                <h1 className="display-1 fw-bold mb-3 text-info">404</h1>
                <h4 className="mb-3">¡Vaya! Página no encontrada</h4>
                <p className="text-body-secondary mb-4">
                  Lo sentimos, la página que buscas no existe o fue movida.<br />
                  Por favor, verifica la URL o regresa al inicio.
                </p>
                <CButton color="info" variant="outline" href="/" size="lg">
                  Volver al inicio
                </CButton>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Page404
