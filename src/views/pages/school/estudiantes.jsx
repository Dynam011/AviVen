import React, { useState } from 'react';
import { CCol, CButton, CCard, CCardBody, CCardHeader, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react';
import EstudianteForm from '../../../components/EstudianteForm';
import EstudianteList from '../../../components/EstudianteList';

const  Estudiantes = () => {
    const [showForm, setShowForm] = useState(false);
    const [estudiantes, setEstudiantes] = useState([]);

    const toggleForm = () => {
        setShowForm(!showForm);
    };

    const addEstudiantes = (newEstudiante) => {
        setEstudiantes([...estudiantes, newEstudiante]);
        setShowForm(false); // Cierra el modal después de agregar un docente
    };

    return (
        <CCard>
            <CCardHeader>
                <CCol><h5>Listado de Estudiantes</h5></CCol>
                <CCol >
                <div className="p-3"> <CButton color="primary" onClick={toggleForm}>
                    Agregar Estudiante
                </CButton>
                </div></CCol>
               
            </CCardHeader>
            <CCardBody>
                <EstudianteList estudiantes={estudiantes} />
            </CCardBody>

            {/* Modal para el formulario */}
            <CModal visible={showForm}>
                <CModalHeader>
                    <CModalTitle>Agregar Estudiantes</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <EstudianteForm onAddEstudiante={addEstudiantes}  />
                </CModalBody>
            </CModal>
        </CCard>
    );
};

export default Estudiantes;