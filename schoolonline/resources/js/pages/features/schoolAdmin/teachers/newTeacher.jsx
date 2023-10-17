import React, { useState, useEffect } from "react";
import Select from "react-select";
import Button from "../../../components/reusable/button";
import Toast from '../../../components/reusable/toast';
import axios from "axios";

const NewTeacher = ({ year, schoolToEdit,handleMainClick }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedLevels, setSelectedLevels] = useState([]);
  const [selectedClasses, setSelectedClasses] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [levels, setLevels] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [classes, setClasses] = useState([]);
  const [filteredClasses, setFilteredClasses] = useState([]);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showDangerToast, setShowDangerToast] = useState(false);

  const generateCodeAndPassword = (firstName, lastName) => {
    const randomNumbers =
      Math.floor(Math.random() * 9000000000) + 1000000000;
    const code = `${firstName.charAt(0).toUpperCase()}${lastName.charAt(
      lastName.length - 1
    ).toUpperCase()}${randomNumbers}`;
    const password = code; // Utilisez le même code comme mot de passe pour cet exemple
    return { code, password };
  };

  useEffect(() => {
    if (showSuccessToast || showDangerToast ) {
      const timer = setTimeout(() => {
        setShowSuccessToast(false);
        setShowDangerToast(false);

      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [showSuccessToast, showDangerToast]);

  const handleAlert = (type) => {
    if (type === "success") setShowSuccessToast(true);
    else setShowDangerToast(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Générer le code et le mot de passe
    const { code, password } = generateCodeAndPassword(firstName, lastName);


    // console.log("firstname : " + firstName + ", lastname : " + lastName);
    // console.log("code : "+code);
    // console.log("password : "+password);
    // console.log("email : "+email);
    // console.log("phone : "+phone);


    // console.log("selected classes : "+selectedClassesIds);
    // console.log("selected subjects : "+selectedSubjectsIds);
    // Créez un objet teacher avec les données du formulaire
    const teacherData = {
      firstName : firstName,
      lastName : lastName,
      email : email,
      phone : phone,
      code : code,
      password : password,
      selectedClasses : selectedClasses,
      selectedSubjects : selectedSubjects,
      school_id : schoolToEdit.id,
    };
    try {
        const response = axios.post('/create-teacher', teacherData)
        .then((response) => {
            if (response.data && response.data.success) {
              // Teacher creation was successful, reset fields, and show a success message
              handleAlert("success");
              setTimeout(() => {
                handleMainClick("ListTeachers");
            }, 1500);
            } else {
              // Handle the case where the response does not have a success property (indicating an error)
              console.error("Error creating teacher:", response);
              handleAlert("danger");
            }
          })
       .catch((error) => {
        // Afficher un message d'erreur en cas d'échec
        handleAlert("danger");
          setTimeout(() => {
          console.error('Error creating teacher:', error);
      }, 1500);
    });
} catch (error) {
    handleAlert("danger");
          setTimeout(() => {
          console.error('Error creating teacher:', error);
      }, 1500);
}
};

  useEffect(() => {
    // Récupérer la liste des niveaux en fonction de l'année et de l'école
    axios
      .get(`/listLevels?selectedYear=${year}&school=${schoolToEdit.id}`)
      .then((response) => {
        setLevels(response.data);
      });

    // Récupérer la liste des matières en fonction de l'année et de l'école
    axios
      .get(`/listSubjects?selectedYear=${year}&school=${schoolToEdit.id}`)
      .then((response) => {
        setSubjects(response.data);
      });

    // Récupérer la liste de toutes les classes (non filtrées par niveau) au chargement initial
    axios.get(`/listClasses?selectedYear=${year}&school=${schoolToEdit.id}`).then((response) => {
      setClasses(response.data);
    });
  }, [year, schoolToEdit]);

  // Filtrer les classes en fonction des niveaux sélectionnés
  useEffect(() => {
    // Obtenez la liste des classes correspondant aux niveaux sélectionnés
    const filteredClasses = classes.filter((classe) =>
      selectedLevels.some((level) => classe.level_id === level.value)
    );
    setFilteredClasses(filteredClasses);
  }, [selectedLevels, classes]);

  // Reste du composant inchangé...

  return (
    <div className="w-full flex flex-col justify-center">
        <div>
      {showSuccessToast && <Toast type="success" message="Teacher added successfully." />}
      {showDangerToast && <Toast type="danger" message="Error adding teacher." />}
      </div>
        <div className="w-full flex justify-center items-center">
            <h2 className="text-gray-700 font-medium text-xl">New Teacher</h2>
        </div>
        <div className="w-full flex justify-center items-center">
            <form onSubmit={handleSubmit} className="w-2/3 flex flex-col items-center justify-center p-8 mt-8 shadow-md shadow-gray-300 rounded-lg">
                <div className="flex flex-col items-center mb-6 w-full">
                    <div className="flex justify-center gap-24">
                        <div className="w-64">
                            <label>Last Name :</label>
                            <input
                            className="outline-none w-full"
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            />
                        </div>
                        <div className="w-64">
                            <label>First Name :</label>
                            <input
                            type="text"
                            value={firstName}
                            className="outline-none w-full"
                            onChange={(e) => setFirstName(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="flex justify-center gap-24 mt-4">
                        <div className="w-64">
                            <label>Email :</label>
                            <input
                                className="outline-none w-full"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="w-64">
                            <label>Phone :</label>
                            <input
                                className="outline-none w-full"
                                type="text"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
                <div className="flex flex-col items-center">
                    <div className="w-60">
                        <label>Levels :</label>
                        <Select
                            isMulti
                            options={levels.map((level) => ({
                                value: level.id,
                                label: level.name,
                            }))}
                            value={selectedLevels}
                            onChange={(selectedOptions) =>
                            setSelectedLevels(selectedOptions)
                            }
                        />
                    </div>
                    <div className="w-60 mt-4">
                        <label>Classes :</label>
                        <Select
                        isMulti
                        options={filteredClasses.map((classe) => ({
                            value: classe.id,
                            label: classe.name,
                        }))}
                        value={selectedClasses}
                        onChange={(selectedOptions) =>
                            setSelectedClasses(selectedOptions)
                        }
                        />
                    </div>
                    <div className="w-60 mt-4">
                        <label>Subjects :</label>
                        <Select
                            isMulti
                            options={subjects.map((subject) => ({
                                value: subject.id,
                                label: subject.name,
                            }))}
                            value={selectedSubjects}
                            onChange={(selectedOptions) =>
                            setSelectedSubjects(selectedOptions)
                            }
                        />
                    </div>
                </div>
                <div className="w-full flex justify-center mt-8">
                    <Button type="submit" buttonText="Add"/>
                </div>
            </form>
        </div>
    </div>
  );
};

export default NewTeacher;
