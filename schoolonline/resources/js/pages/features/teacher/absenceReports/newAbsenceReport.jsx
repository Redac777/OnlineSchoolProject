import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from "react-select";
import Button from '../../../components/reusable/button';
import Toast from "../../../components/reusable/toast";


const NewAbsenceReport = ({ year, schoolToEdit,user,handleMainClick }) => {
  const [levels, setLevels] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [students, setStudents] = useState([]);
  const [report, setReport] = useState({});
  const [remarks, setRemarks] = useState({});
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showDangerToast, setShowDangerToast] = useState(false);
  const [showWarningToast, setShowWarningToast] = useState(false);

  useEffect(() => {
    if (showSuccessToast || showDangerToast || showWarningToast) {
      const timer = setTimeout(() => {
        setShowSuccessToast(false);
        setShowDangerToast(false);
        setShowWarningToast(false);
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [showSuccessToast, showDangerToast, showWarningToast]);



  const handleAlert = (type) => {
    if (type === "success") setShowSuccessToast(true);
    else if (type === "warning") setShowWarningToast(true);
    else setShowDangerToast(true);
  };


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
    const fetchData = async () => {
      try {
        const response = await axios.get('/teacherLevels', {
          params: {
            teacher_id: user.id,
            school_id: schoolToEdit.id,
            year_id: year,
          },
        });

        // Traitez les données renvoyées par le backend ici
        const data = response.data;

        if (data.success) {
          // Accédez aux niveaux renvoyés par le backend
          const levels = data.levels;
          setLevels(levels);

          // Faites ce que vous voulez avec les niveaux (par exemple, les stocker dans un state React)

        } else {
          // Gérez le cas d'erreur si nécessaire
          console.error('Erreur lors de la récupération des niveaux :', data.message);
        }
      } catch (error) {
        // Gérez les erreurs de requête ici
        console.error('Erreur de requête :', error);
      }
    };

    // Appelez la fonction fetchData pour récupérer les niveaux
    fetchData();
  }, [year, schoolToEdit.id, user.id]);

  useEffect(() => {
    // Fetch classes based on the selected level
    if (selectedLevel) {
        const fetchData = async () => {
            try {
              const response = await axios.get('/teacherClasses', {
                params: {
                    teacher_id: user.id,
                    school_id: schoolToEdit.id,
                    year_id: year,
                    level_id: selectedLevel.value,
                },
              });

              // Traitez les données renvoyées par le backend ici
              const data = response.data;

              if (data.success) {
                // Accédez aux niveaux renvoyés par le backend
                const classes = data.classes;
                setClasses(classes);

                // Faites ce que vous voulez avec les niveaux (par exemple, les stocker dans un state React)

              } else {
                // Gérez le cas d'erreur si nécessaire
                console.error('Erreur lors de la récupération des classes :', data.message);
              }
            } catch (error) {
              // Gérez les erreurs de requête ici
              console.error('Erreur de requête :', error);
            }
          };

          // Appelez la fonction fetchData pour récupérer les niveaux
          fetchData();
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

// console.log(dataToSend);

    axios.post('/create-absence-report', dataToSend)
      .then((response) => {
        handleAlert("success");
          setTimeout(() => {
          handleMainClick("ListAbsenceReports");
        }, 1500);
      })
      .catch((error) => {
        handleAlert("danger");
        console.log(error);
          setTimeout(() => {
          //handleMainClick("ListLevels");
        }, 1500);
      });
  };


  return (
    <div className="w-full flex flex-col items-center">
        <div>
                {showSuccessToast && <Toast type="success" message="Absence report created successfully." />}
                {showDangerToast && <Toast type="danger" message="Error creating absence report" />}
        </div>
        <div className="w-full flex justify-center items-center">
            <h2 className="text-gray-700 font-medium text-xl">Create Absence Report</h2>
        </div>

        <div className="w-3/4 flex justify-center mt-12">
            {/* Sélection du niveau */}
            <div className="mx-1 flex flex-col">
                    <label className="mx-3">Levels</label>
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
            <div className="mx-1 flex flex-col">
            <label className="mx-3">Classes</label>
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
        </div>




      {/* Tableau des étudiants */}
      <table class="w-5/6 text-sm text-left text-gray-500 shadow-md mt-6">
        <thead class="text-xs text-gray-700 uppercase bg-gray-300">
          <tr>
            <th scope="col" class="px-6 py-3">Nom de l'étudiant</th>
            <th scope="col" class="px-6 py-3">Retard</th>
            <th scope="col" class="px-6 py-3">Absence</th>
            <th scope="col" class="px-6 py-3">Remarque</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.id}>
              <td scope="col" class="px-6 py-3">{student.user.lastName + " " + student.user.firstName}</td>
              <td scope="col" class="px-6 py-3">
                <input
                  type="checkbox"
                  checked={report[student.id]?.retard || false}
                  onChange={() => handleCheckboxChange(student.id, 'retard')}
                />
              </td>
              <td scope="col" class="px-6 py-3">
                <input
                  type="checkbox"
                  checked={report[student.id]?.absence || false}
                  onChange={() => handleCheckboxChange(student.id, 'absence')}
                />
              </td>
              <td scope="col" class="px-6 py-3">
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
      <div className='w-full flex justify-center mt-10'>
      <Button  onClick={handleSubmit} buttonText="Create" variableClassName="h-fit"/>
      </div>
    </div>
  );
};

export default NewAbsenceReport;
