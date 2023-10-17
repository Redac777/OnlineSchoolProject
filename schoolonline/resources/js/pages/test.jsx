import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from "react-select";

const Test = ({ year, schoolToEdit,user }) => {
  const [levels, setLevels] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [students, setStudents] = useState([]);
  const [report, setReport] = useState({});
  const [remarks, setRemarks] = useState({});

  const customStyles = {
    control: (provided) => ({
      ...provided,
      border: "1px solid #e2e8f0",
      borderRadius: "0.375rem",
      margin: "10px",
      width: "160px",
      padding: "1px 0",
      backgroundColor: "white",
    }),
    option: (provided) => ({
      ...provided,
      display: "flex",
      alignItems: "center",
      paddingLeft: "0.5rem",
    }),
    singleValue: (provided) => ({
      ...provided,
      display: "flex",
      alignItems: "center",
      paddingLeft: "0.5rem",
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 2,
      width: "160px",
      marginLeft: "0.7rem",
      marginTop: "0rem",
    }),
  };

  const customOption = ({ innerProps, label, data }) => (
    <div {...innerProps} className="flex items-center cursor-pointer">
      {label}
    </div>
  );

  useEffect(() => {
    // Fetch levels from the backend
    axios.get(`/listLevels?selectedYear=${year}&school=${schoolToEdit.id}`).then((response) => {
      setLevels(response.data);
    });
  }, [year, schoolToEdit.id]);

  useEffect(() => {
    // Fetch classes based on the selected level
    if (selectedLevel) {
      axios.get(`/listClasses?level_id=${selectedLevel.value}&selectedYear=${year}&school=${schoolToEdit.id}`).then((response) => {
        setClasses(response.data);
      });
    } else {
      setClasses([]);
    }
  }, [selectedLevel, year, schoolToEdit.id]);

  useEffect(() => {
    // Fetch students based on the selected class
    if (selectedClass) {
      axios.get(`/listStudents?classe_id=${selectedClass.value}&selectedYear=${year}&school=${schoolToEdit.id}`).then((response) => {
        setStudents(response.data);
        const initialReport = {};
        const initialRemarks = {};

        response.data.forEach((student) => {
          initialReport[student.id] = {
            retard: false,
            absence: false,
          };
          initialRemarks[student.id] = '';
        });

        setReport(initialReport);
        setRemarks(initialRemarks);
      });
    } else {
      setReport({});
      setRemarks({});
      setStudents([]);
    }
  }, [selectedClass, year, schoolToEdit.id]);

  const handleCheckboxChange = (studentId, type) => {
    const updatedReport = { ...report };

    if (type === 'retard' && updatedReport[studentId]?.absence) {
      updatedReport[studentId].absence = false;
    } else if (type === 'absence' && updatedReport[studentId]?.retard) {
      updatedReport[studentId].retard = false;
    }

    updatedReport[studentId] = { ...updatedReport[studentId], [type]: !updatedReport[studentId][type] };
    setReport(updatedReport);
  };

  const handleRemarkChange = (studentId, value) => {
    const updatedRemarks = { ...remarks };
    updatedRemarks[studentId] = value;
    setRemarks(updatedRemarks);
  };

  const handleSubmit = () => {
    // Create an array to store the report data
    const reportData = [];

    // Loop through the students and generate report data
    students.forEach((student) => {
      const studentId = student.id;
      const retard = report[studentId]?.retard || false;
      const absence = report[studentId]?.absence || false;
      const remark = remarks[studentId] || '';

      // Push the data to the reportData array
      reportData.push({
        studentId,
        attendance: retard ? 'retard' : absence ? 'absence' : 'none',
        remark,
      });
    });


    // Send the report data to the backend
    const dataToSend = {
      schoolId: schoolToEdit.id,
      classId: selectedClass.value,
      report: reportData,
    };

    axios.post('/create-absence-report', dataToSend)
      .then((response) => {
        // Handle the response (success or failure)
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };


  return (
    <div>
      <h1>Création de rapport d'absence</h1>

      {/* Sélection du niveau */}
      <div className="mx-1 flex">
        <Select
          styles={customStyles}
          components={{ Option: customOption }}
          options={levels.map((level) => ({
            value: level.id,
            label: level.name,
          }))}
          value={selectedLevel}
          onChange={(selectedOption) => {
            setSelectedLevel(selectedOption);
          }}
        />
      </div>

      {/* Sélection de la classe */}
      <div className="mx-1 flex">
        <Select
          styles={customStyles}
          components={{ Option: customOption }}
          options={classes.map((classe) => ({
            value: classe.id,
            label: classe.name,
          }))}
          value={selectedClass}
          onChange={(selectedOption) => {
            setSelectedClass(selectedOption);
          }}
        />
      </div>

      {/* Tableau des étudiants */}
      <table>
        <thead>
          <tr>
            <th>Nom de l'étudiant</th>
            <th>Retard</th>
            <th>Absence</th>
            <th>Remarque</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.id}>
              <td>{student.user.lastName + " " + student.user.firstName}</td>
              <td>
                <input
                  type="checkbox"
                  checked={report[student.id]?.retard || false}
                  onChange={() => handleCheckboxChange(student.id, 'retard')}
                />
              </td>
              <td>
                <input
                  type="checkbox"
                  checked={report[student.id]?.absence || false}
                  onChange={() => handleCheckboxChange(student.id, 'absence')}
                />
              </td>
              <td>
                <textarea
                  value={remarks[student.id] || ''}
                  onChange={(e) => handleRemarkChange(student.id, e.target.value)}
                  className="w-64 h-14 text-xs"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button onClick={handleSubmit}>Valider le rapport</button>
    </div>
  );
};

export default Test;
