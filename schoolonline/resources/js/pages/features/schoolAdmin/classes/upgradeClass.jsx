import React, { useState,useEffect  } from 'react';
import Select from "react-select";
import Label from "../../../components/reusable/label";
import Button from '../../../components/reusable/button';
import Toast from "../../../components/reusable/toast";

import axios from 'axios';

const UpgradeClass = ({ classe,year,schoolToEdit }) => {
  const [targetClass, setTargetClass] = useState('');
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [students, setStudents] = useState([]);
  const [classes,setClasses] = useState([]);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showDangerToast, setShowDangerToast] = useState(false);
  const [showWarningToast, setShowWarningToast] = useState(false);
  const customStyles = {
    control: (provided) => ({
      ...provided,
      border: "1px solid #e2e8f0",
      borderRadius: "0.375rem",
      margin: "10px",
      width: "290px",
      backgroundColor: "#f9fafb",
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
      width :"290px",
      marginLeft: "0.7rem",
      marginTop : "-0.4rem",
    }),
  };

  const customOption = ({ innerProps, label, data }) => (
    <div {...innerProps} className="flex items-center cursor-pointer">
      {label}
    </div>
  );

  useEffect(() => {
    // Fetch the list of classes from the backend API
    axios.get(`/listClasses?selectedYear=${year}&school=${schoolToEdit.id}`).then((response) => {
      setClasses(response.data);
    });
  }, [year]);

  const options = classes.map((classe) => ({
    value: classe.id,
    label: classe.name,
  }));

  // Fetch students for the current class when the component mounts
  useEffect(() => {
    axios.get(`/listStudents?classe_id=${classe.id}&selectedYear=${year}&school=${schoolToEdit.id}`).then((response) => {
        setStudents(response.data);
    });
  }, [classe,year]);

  const handleUpgradeAll = () => {
    // Perform the upgrade operation for all students
    const allStudentIds = students.map((student) => student.id);
    axios.post(`/upgrade-students`, {
      sourceClassId: classe.id,
      targetClassId: targetClass,
      selectedStudents: allStudentIds,
    }).then(response => {
        // Gérer la réponse de la requête ici, par exemple, afficher un message de succès
        console.log(response.data.message);
        handleAlert("success");
          setTimeout(() => {
          //handleMainClick("ListLevels");
        }, 1500);
    })
    .catch(error => {
        // Gérer les erreurs de manière appropriée
        console.error(error);
        handleAlert("danger");
          setTimeout(() => {
          //handleMainClick("ListLevels");
        }, 1500);
    });
  };

  const handleUpgradeSelected = () => {
    // Perform the upgrade operation for selected students
    axios.post(`/upgrade-students`, {
      sourceClassId: classe.id,
      targetClassId: targetClass,
      selectedStudents: selectedStudents,
    }).then(response => {
        // Gérer la réponse de la requête ici, par exemple, afficher un message de succès
        console.log(response.data.message);
        handleAlert("success");
          setTimeout(() => {
          //handleMainClick("ListLevels");
        }, 1500);
    })
    .catch(error => {
        // Gérer les erreurs de manière appropriée
        console.error(error);
        handleAlert("danger");
          setTimeout(() => {
          //handleMainClick("ListLevels");
        }, 1500);
    });
  };

  const handleCheckboxChange = (studentId) => {
    // Toggle the selected state of a student
    const updatedSelection = selectedStudents.includes(studentId)
      ? selectedStudents.filter((id) => id !== studentId)
      : [...selectedStudents, studentId];
    setSelectedStudents(updatedSelection);
  };
  const handleSelectAll = () => {
    setSelectAll(!selectAll); // Toggle the "Select All" state
    if (!selectAll) {
      // If "Select All" is true, select all students
      const allStudentIds = students.map((student) => student.id);
      setSelectedStudents(allStudentIds);
    } else {
      // If "Select All" is false, deselect all students
      setSelectedStudents([]);
    }
  };
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
  const liststudents = students.map((student) => {
    return(
    <tr class="bg-white border-b">
            <td className="px-6 py-3">
                {student.user.lastName + " " + student.user.firstName}
            </td>
            <td className="px-6 py-3">
            <input
              type="checkbox"
              checked={selectedStudents.includes(student.id)}
              onChange={() => handleCheckboxChange(student.id)}
            />
            </td>
        </tr>
  )
});

  return (
    <div className="w-full flex flex-col items-center">
        <div>
                {showSuccessToast && <Toast type="success" message="student(s) upgraded successfully." />}
                {showDangerToast && <Toast type="danger" message="Error upgrading student(s)" />}
        </div>
    <div className="w-full flex justify-center items-center">
    <h2 className="text-gray-700 font-medium text-xl">Upgrade Students from {classe.name}</h2>
    </div>
    <div className="w-3/4 flex justify-between mt-10">
        <div className="flex gap-4 items-end pb-2">
        <Button onClick={handleUpgradeAll} buttonText="Upgrade All" variableClassName="h-fit"/>
        <Button onClick={handleUpgradeSelected} buttonText="Upgrade Selected" variableClassName="h-fit"/>
        <Button onClick={handleSelectAll} variableClassName="h-fit" buttonText={selectAll ? "Deselect All" : "Select All"}/>
        </div>
        <div className='flex flex-col'>
            <Label forName="level" labelText="Upgrade To" variableClassName="mx-3"/>
            <Select
                options={options}
                value={options.find((option) => option.value === targetClass)} // Find the option object that matches targetClass
                onChange={(selectedOption) => setTargetClass(selectedOption.value)} // Update targetClass with the value of the selected option
                styles={customStyles}
                components={{ Option: customOption }}
            />
        </div>
    </div>

        <table class="w-5/6 text-sm text-left text-gray-500 shadow-md mt-6">
            <thead class="text-xs text-gray-700 uppercase bg-gray-300">
                <tr>
                    <th scope="col" class="px-6 py-3">
                        Student
                    </th>
                    <th scope="col" class="px-6 py-3">
                        Select
                    </th>
                </tr>
            </thead>
            <tbody>
                {liststudents}
            </tbody>
        </table>
    </div>
  );
};

export default UpgradeClass;
