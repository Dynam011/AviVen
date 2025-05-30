import React from 'react'
import { CFooter } from '@coreui/react'

const AppFooter = () => {
  return (
    <CFooter className="px-4">
      <div>
        <span className="ms-1">&copy; 2025 UNEFA.</span>
      </div>
      <div className="ms-auto">
        
      <span>Granja AviVen - Panel de administrativo</span>
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)
