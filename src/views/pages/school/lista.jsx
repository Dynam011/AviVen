import { useState } from "react";
import InscriptionForm from "./estudiantes";
import { CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell, CButton } from "@coreui/react";

const InscriptionList = () => {
  const [inscriptions, setInscriptions] = useState([]);

  const addInscription = (data) => {
    setInscriptions([...inscriptions, { id: Date.now(), ...data }]);
  };

  const deleteInscription = (id) => {
    setInscriptions(inscriptions.filter((inscription) => inscription.id !== id));
  };

  return (
    <div>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Inscripciones</h2>
      <InscriptionForm onSubmit={addInscription} />
      
      <CTable striped hover borderless responsive  style={{marginTop: "30px"}}>
        <CTableHead>
          <CTableRow color="primary">
            <CTableHeaderCell>Nombre</CTableHeaderCell>
            <CTableHeaderCell>Apellido</CTableHeaderCell>
            <CTableHeaderCell>Cédula</CTableHeaderCell>
            <CTableHeaderCell>Grado</CTableHeaderCell>
            <CTableHeaderCell>Sección</CTableHeaderCell>
            <CTableHeaderCell>Acciones</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {inscriptions.map((student) => (
            <CTableRow key={student.id}>
              <CTableDataCell>{student.nombre}</CTableDataCell>
              <CTableDataCell>{student.apellido}</CTableDataCell>
              <CTableDataCell>{student.cedula}</CTableDataCell>
              <CTableDataCell>{student.grado}</CTableDataCell>
              <CTableDataCell>{student.seccion}</CTableDataCell>
              <CTableDataCell>
                <CButton color="danger" variant="outline" size="sm" onClick={() => deleteInscription(student.id)}>
                  Eliminar
                </CButton>
              </CTableDataCell>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>
    </div>
  );
};

export default InscriptionList;