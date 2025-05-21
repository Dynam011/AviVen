import React, { useState } from 'react';
import { CCol, CButton, CCard, CCardBody, CCardHeader, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react';
import DocenteForm from '../../../components/DocenteForm';
import DocenteList from '../../../components/DocenteList';

const Docentes = () => {
    const [showForm, setShowForm] = useState(false);
    const [docentes, setDocentes] = useState([]);

    const toggleForm = () => {
        setShowForm(!showForm);
    };

    const addDocente = (newDocente) => {
        setDocentes([...docentes, newDocente]);
        setShowForm(false); // Cierra el modal después de agregar un docente
    };

    return (
        <CCard>
            <CCardHeader>
                <CCol><h5>Listado de Docentes</h5></CCol>
                <CCol >
                <div className="p-3"> <CButton color="primary" onClick={toggleForm}>
                    Agregar Docente
                </CButton>
                </div></CCol>
               
            </CCardHeader>
            <CCardBody>
                <DocenteList docentes={docentes} />
            </CCardBody>

            {/* Modal para el formulario */}
            <CModal visible={showForm} onClose={toggleForm}>
                <CModalHeader>
                    <CModalTitle>Agregar Docente</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <DocenteForm onAddDocente={addDocente} show={showForm} onClose={toggleForm} />
                </CModalBody>
            </CModal>
        </CCard>
    );
};

export default Docentes;