import React, { useState } from 'react';
import { CButton, CTable, CTableBody, CTableHead, CTableHeaderCell, CTableRow, CTableDataCell, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react';
import { CIcon } from '@coreui/icons-react';
import { cilTrash, cilPencil } from '@coreui/icons';
import EstudianteForm from './EstudianteForm';

const EstudianteList = ({ estudiantes, onUpdateEstudiante, onDeleteEstudiante }) => {
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedEstudiante, setSelectedEstudiante] = useState(null);

    const handleEdit = (estudiante) => {
        setSelectedEstudiante(estudiante);
        setShowEditModal(true); // Abre el modal de edición
    };


    const handleUpdate = (updatedEstudiante) => {
        onUpdateEstudiante(updatedEstudiante); // Actualiza el estudiante en la lista
        setShowEditModal(false); // Cierra el modal
    };

    const handleDelete = (estudiante) => {
        onDeleteEstudiante(estudiante); // Elimina el estudiante de la lista
    };

    return (
        <>
            <CTable>
                <CTableHead>
                    <CTableRow>
                        <CTableHeaderCell size="sm">Primer nombre</CTableHeaderCell>
                        <CTableHeaderCell size="sm">Segundo nombre</CTableHeaderCell>
                        <CTableHeaderCell size="sm">Primer apellido</CTableHeaderCell>
                        <CTableHeaderCell size="sm">Segundo apellido</CTableHeaderCell>
                        <CTableHeaderCell size="sm">Cedula</CTableHeaderCell>
                        <CTableHeaderCell size="sm">Fecha de Nacimiento</CTableHeaderCell>



                    </CTableRow>
                </CTableHead>
                <CTableBody>
                    {estudiantes.map((estudiante, index) => (
                        <CTableRow key={index}>
                            <CTableDataCell>{estudiante.primerNombre}</CTableDataCell>
                            <CTableDataCell>{estudiante.segundoNombre}</CTableDataCell>
                            <CTableDataCell>{estudiante.primerApellido}</CTableDataCell>
                            <CTableDataCell>{estudiante.segundoApellido}</CTableDataCell>
                            <CTableDataCell>{estudiante.cedula}</CTableDataCell>
                            <CTableDataCell>{estudiante.fechaNacimiento}</CTableDataCell>


                            <CTableDataCell>
                                <CButton
                                    color="primary"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleEdit(estudiante)}
                                    style={{ marginRight: '10px' }}
                                >
                                    <CIcon icon={cilPencil} />
                                </CButton>
                                <CButton
                                    color="danger"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleDelete(estudiante)}
                                >
                                    <CIcon icon={cilTrash} />
                                </CButton>
                            </CTableDataCell>
                        </CTableRow>
                    ))}
                </CTableBody>
            </CTable>

            {/* Modal para editar estudiante */}
            <CModal visible={showEditModal} onClose={() => setShowEditModal(false)}>
                <CModalHeader>
                    <CModalTitle>Editar Estudiante</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    {selectedEstudiante && (
                        <EstudianteForm
                            estudiante={selectedEstudiante}
                            onSubmit={handleUpdate}
                            onClose={() => setShowEditModal(false)}
                        />
                    )}
                </CModalBody>
            
            </CModal>
        </>
    );
};

export default EstudianteList;