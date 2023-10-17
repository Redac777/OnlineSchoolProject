import React, { useState,useEffect, useRef } from "react";
import Select from "react-select";
import Input from "../../../components/reusable/input";
import Button from "../../../components/reusable/button";
import Toast from '../../../components/reusable/toast';
import axios from 'axios';


const customStyles = {
  control: (provided) => ({
    ...provided,
    border: "1px solid #e2e8f0",
    borderRadius: "0.375rem",
    margin: "10px",
    width: "150px",
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
    marginTop: "-0.5rem",
    width: "150px",
    marginLeft: "0.6rem",
  }),
};

const customOption = ({ innerProps, label, data }) => (
  <div {...innerProps} className="flex items-center cursor-pointer">
    {label}
  </div>
);

const NewStudent = ({user,handleMainClick,schoolToEdit,year}) => {
  const [codeMassar , setCodeMassar] = useState("");
  const [studentLastName,setStudentLastName] = useState("");
  const [studentFirstName,setStudentFirstName] = useState("");
  const [address,setAddress] = useState("");
  const [levels,setLevels] = useState([]);
  const [selectedLevel,setSelectedLevel] = useState(null);
  const [classes,setClasses] = useState([]);
  const [selectedClass,setSelectedClass] = useState(null);
  const [nomArabe,setNomArabe] = useState("");
  const [prenomArabe,setPrenomArabe] = useState("");
  const [gender, setGender] = useState("");
  const [birthDay, setBirthday] = useState("");
  const [nomTuteur1,setNomTuteur1] = useState("");
  const [prenomTuteur1,setPrenomTuteur1] = useState("");
  const [nomTuteur2,setNomTuteur2] = useState("");
  const [prenomTuteur2,setPrenomTuteur2] = useState("");
  const [cinTuteur1,setCinTuteur1] = useState("");
  const [cinTuteur2,setCinTuteur2] = useState("");
  const [telTuteur1,setTelTuteur1] = useState("");
  const [telTuteur2,setTelTuteur2] = useState("");
  const [jobTuteur1,setJobTuteur1] = useState("");
  const [jobTuteur2,setJobTuteur2] = useState("");
  const [emailTuteur1,setEmailTuteur1] = useState("");
  const [emailTuteur2,setEmailTuteur2] = useState("");
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showDangerToast, setShowDangerToast] = useState(false);
  const [students,setStudents] = useState([]);
  const [classIdMap, setClassIdMap] = useState({});

  useEffect(() => {
    // Effectuez la requête pour récupérer les données des classes
    axios.get(`/listClasses?selectedYear=${year}&school=${schoolToEdit.id}`)
      .then((response) => {
        const classesData = response.data;
        const newClassIdMap = {};

        // Parcours des données des classes pour créer la correspondance
        classesData.forEach((classInfo) => {
          const { id, name } = classInfo;
          newClassIdMap[name] = id;
        });

        // Mettez à jour le state avec la correspondance nom: id
        setClassIdMap(newClassIdMap);
      })
      .catch((error) => {
        // Gérer les erreurs de requête ici
      });
  }, [year]);
  useEffect(() => {
    // Fetch levels from the backend
    setSelectedLevel(null);
    axios.get(`/listLevels?selectedYear=${year}&school=${schoolToEdit.id}`).then((response) => {
        const levelOptions = response.data.map((level) => ({
            value: level.id,
            label: level.name, // Assurez-vous d'ajuster ceci en fonction de la structure de vos données
          }));
        setLevels(levelOptions);
    });
  }, [year]);

  useEffect(() => {
    if (selectedLevel) {
      setSelectedClass(null);
      // Effectuez une requête Axios pour récupérer les classes en fonction du niveau sélectionné
      axios.get(`/listClasses?level_id=${selectedLevel.value}&selectedYear=${year}&school=${schoolToEdit.id}`).then((response) => {
        const classOptions = response.data.map((classe) => ({
          value: classe.id,
          label: classe.name, // Assurez-vous d'ajuster ceci en fonction de la structure de vos données
        }));
        setClasses(classOptions);
      });
    } else {
      // Réinitialisez les classes si aucun niveau n'est sélectionné
      setClasses([]);
    }
  }, [selectedLevel]);
  useEffect(() => {
    if (showSuccessToast || showDangerToast) {
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

  const generateRandomCodeTutor1 = (prenom,nom) => {
    const randomNumbers = Math.floor(Math.random() * 9000000000) + 1000000000; // Generates a 4-digit random number
    const password = `${prenom.charAt(0).toUpperCase()}${nom.charAt(nom.length - 1).toUpperCase()}${randomNumbers}`;
    return password;
};
const generateRandomCodeTutor2 = (prenom,nom) => {
    const randomNumbers = Math.floor(Math.random() * 9000000000) + 1000000000; // Generates a 4-digit random number
    const password = `${prenom.charAt(0).toUpperCase()}${nom.charAt(nom.length - 1).toUpperCase()}${randomNumbers}`;
    return password;
};



  const handleSubmit = async (event) => {
    event.preventDefault();
    const codeTutor1 = generateRandomCodeTutor1(prenomTuteur1,nomTuteur1);
    const codeTutor2 = generateRandomCodeTutor2(prenomTuteur2,nomTuteur2);
    try {
        const response = await axios.post('/create-studentwithparent', {
            studentLastName: studentLastName,
            studentFirstName : studentFirstName,
            arablastName : nomArabe,
            arabfirstName : prenomArabe,
            gender : gender,
            birthDay : birthDay,
            address : address,
            codeMassar : codeMassar,
            tutorOneLastName : nomTuteur1,
            tutorTwoLastName : nomTuteur2,
            tutorOneFirstName : prenomTuteur1,
            tutorTwoFirstName: prenomTuteur2,
            tutorOneCin : cinTuteur1,
            tutorTwoCin : cinTuteur2,
            tutorOneTel  : telTuteur1,
            tutorTwoTel : telTuteur2,
            tutorOneEmail : emailTuteur1,
            tutorTwoEmail : emailTuteur2,
            tutorOneJob  : jobTuteur1,
            tutorTwoJob  : jobTuteur2,
            studentPassword : codeMassar,
            tutorOnePassword : codeTutor1,
            tutorTwoPassword : codeTutor2,
            tutorOneCode : codeTutor1,
            tutorTwoCode : codeTutor2,
            classId : selectedClass.value,
            schoolId : schoolToEdit.id,
        });
        if (response.data.success) {
        // Réinitialiser les champs et afficher un message de succès
        handleAlert("success");
        setTimeout(() => {
        handleMainClick("ListStudents");
      }, 1500);
    console.log("success");
      }
        else{
          handleAlert("danger");
        }
      } catch (error) {
        // Afficher un message d'erreur en cas d'échec
        handleAlert("danger");
          setTimeout(() => {
          console.error('Error creating class:', error);
      }, 1500);
      }
  };

  return (
        <>
      <div>
      {showSuccessToast && <Toast type="success" message="Student(s) added successfully." />}
      {showDangerToast && <Toast type="danger" message="Error adding student(s)." />}
      </div>

    <div className="w-full h-fit flex flex-col justify-center p-6 relative z-0">
      {/* Start of  Header Edit Profile  */}
      <div className="w-full flex justify-center items-center">
        <h2 className="text-gray-700 font-medium text-xl">{user.lang=="eng" ? "New  Student" :(user.lang=="fr" ? "Nouvel élève" :"اضف تلميذ")}</h2>
      </div>
      {/* End of Header Edit Profile */}
      <form className="flex flex-col" onSubmit={handleSubmit}>
        {/* Other form fields htmlFor editing profile information */}
        <div className="flex justify-between items-start pt-8 w-full">
            {/* Start of first part */}
            <div className="w-[30%] flex flex-col gap-4 items-center">
                <div className="flex w-full justify-center items-center">
                    <h2>Student</h2>
                </div>
                <div className="flex w-full justify-between mt-6">
                    {/* Code Massar*/}
                    <div className="flex flex-col justify-center items-center">
                        <div className="flex justify-start items-center w-full">
                            <label htmlFor="codeMassar" class="block mb-1 font-semibold text-sm text-gray-700">{user.lang=="eng" ? "Massar Code" :(user.lang=="fr" ? "Code Massar" : "كود مسار")}</label>
                        </div>
                        <div className="flex items-center w-40">
                            <Input type="text" name="codeMassar" value={codeMassar} onChange={(e)=>{setCodeMassar(e.target.value)}} required/>
                        </div>
                    </div>
                    {/* Gender */}
                    <div className="flex flex-col justify-center items-center ">
                        <div className="w-full flex justify-start items-center">
                            <span className="block mb-1 font-semibold text-sm text-gray-700">{user.lang=="eng" ? "Gender" : (user.lang=="fr" ? "Sexe":"الجنس") }</span>
                        </div>
                        <div className="flex justify-start items-center w-40 space-x-5">
                            <div class="flex items-center">
                                <input id="male-gender" type="radio" value="male" name="gender" checked={gender === 'male'} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 cursor-pointer" onChange={(e) => setGender(e.target.value)}/>
                                <label htmlFor="default-radio-1" class="ml-2 text-sm  text-black dark:text-gray-300">Male</label>
                            </div>
                            <div class="flex items-center">
                                <input id="female-gender" type="radio" value="female" name="gender" checked={gender === 'female'} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 cursor-pointer" onChange={(e) => setGender(e.target.value)}/>
                                <label htmlFor="default-radio-2" class="ml-2 text-sm  text-black dark:text-gray-300">Female</label>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex justify-between w-full">
                    {/* LastName */}
                    <div className="flex flex-col justify-center items-center ">
                        <div className="flex justify-start items-center w-full">
                            <label htmlFor="studentLastName" class="block mb-1 font-semibold text-sm text-gray-700">{user.lang=="eng" ? "Last Name" :(user.lang=="fr" ? "Nom" : "اسم العائلة")}</label>
                        </div>
                        <div className="flex items-center w-40">
                            <Input type="text" name="studentLastName" value={studentLastName} onChange={(e)=>{setStudentLastName(e.target.value)}} required/>
                        </div>
                    </div>
                    {/* FirstName*/}
                    <div className="flex flex-col justify-center items-center ">
                        <div className="flex justify-start items-center w-full">
                            <label htmlFor="studentFirstName" class="block mb-1 font-semibold text-sm text-gray-700">{user.lang=="eng" ? "First Name" : (user.lang=="fr" ? "Prénom":"الاسم الخاص") }</label>
                        </div>
                        <div className="flex items-center w-40">
                            <Input type="text" name="studentFirstName" value={studentFirstName} onChange={(e)=>{setStudentFirstName(e.target.value)}} required/>
                        </div>
                    </div>
                </div>
                <div className="flex justify-between items-center w-full">
                    {/* nom arabe */}
                    <div className="flex flex-col justify-center items-center ">
                        <div className="flex justify-start items-center w-full">
                            <label htmlFor="nomArabe" class="block mb-1 font-semibold text-sm text-gray-700">{user.lang=="eng" ? "Arab Last Name" :(user.lang=="fr" ? "Nom arabe" : " اسم العائلة عربي")}</label>
                        </div>
                        <div className="flex items-center w-40">
                            <Input type="text" name="nomArabe" value={nomArabe} onChange={(e)=>{setNomArabe(e.target.value)}} required/>
                        </div>
                    </div>
                    {/* prenom arabe */}
                    <div className="flex flex-col justify-center items-center ">
                    <div className="flex items-center w-full">
                            <label htmlFor="prenomArabe" class="block mb-1 font-semibold text-sm text-gray-700">{user.lang=="eng" ? "Arab Last Name" :(user.lang=="fr" ? "Prénom arabe" : " اسم العائلة عربي")}</label>
                        </div>
                        <div className="flex items-center w-40">
                            <Input type="text" name="prenomArabe" value={prenomArabe} onChange={(e)=>{setPrenomArabe(e.target.value)}} required/>
                        </div>
                    </div>
                </div>
                <div className="flex justify-between w-full">
                    {/* Birthday */}
                    <div className="flex flex-col justify-center items-center ">
                        <div className="flex items-center w-full">
                            <label htmlFor="birthDay" class="block mb-1 font-semibold text-sm text-gray-700">{user.lang=="eng" ? "Birthday" : (user.lang=="fr" ? "Date de naissance":"تاريخ الميلاد") }</label>
                        </div>
                        <div className="flex items-center w-40">
                            <Input type="date" name="birthDay" value={birthDay} onChange={(e)=>{setBirthday(e.target.value)}} require/>              </div>
                        </div>
                    {/* Address */}
                    <div className="flex flex-col justify-center items-center ">
                        <div className="flex items-center w-full">
                            <label htmlFor="address" class="block mb-1 font-semibold text-sm text-gray-700">{user.lang=="eng" ? "Address" : (user.lang=="fr" ? "Adresse" : "العنوان")}</label>
                        </div>
                        <div className="flex items-center w-40">
                            <Input type="text" name="address" value={address} onChange={(e)=>{setAddress(e.target.value)}} />
                        </div>
                    </div>
                </div>
                <div className="flex justify-between w-full">
                    {/* Select Level */}
                    <div className="flex flex-col justify-center items-center">
                        <div className="flex justify-start items-center">
                            <label htmlFor="level" className="block mb-1 font-semibold text-sm text-gray-700">
                                Niveau
                            </label>
                        </div>
                        <div className="flex w-full items-center justify-start">
                            <Select
                            id="level"
                            name="level"
                            value={selectedLevel}
                            onChange={(selectedOption) => setSelectedLevel(selectedOption)}
                            options={levels}
                            placeholder="Level"
                            styles={customStyles}
                            components={{ Option: customOption }}
                            />
                        </div>
                    </div>
                    {/* Select Class */}
                    <div className="flex flex-col justify-center items-center">
                        <div className="flex justify-start items-center">
                            <label htmlFor="level" className="block mb-1 font-semibold text-sm text-gray-700">
                                Classe
                            </label>
                        </div>
                        <div className="flex w-full items-center justify-start">
                            <Select
                            id="classe"
                            name="classe"
                            value={selectedClass}
                            onChange={(selectedOption) => setSelectedClass(selectedOption)}
                            options={classes}
                            placeholder="Class"
                            styles={customStyles}
                            components={{ Option: customOption }}
                            />
                        </div>
                    </div>
                </div>
            </div>
            {/* End of first part */}

            {/* Start of second Part */}
            <div className="w-[30%] flex flex-col gap-4 items-center justify-center" >
                <div className="flex justify-center items-center w-full">
                    <h2>Tutor 1</h2>
                </div>
                <div className="mt-6 flex justify-between w-full">
                    {/* Tuteur 1 last name */}
                    <div className="flex flex-col justify-center items-center ">
                        <div className="flex items-center w-full">
                            <label htmlFor="nomTuteur1" class="block mb-1 font-semibold text-sm text-gray-700">{user.lang=="eng" ? "Last name" :(user.lang=="fr" ? "Nom" : "اسم النسب")}</label>
                        </div>
                        <div className="flex items-center w-40">
                            <Input type="text" name="nomTuteur1" value={nomTuteur1} onChange={(e)=>{setNomTuteur1(e.target.value)}} required/>
                        </div>
                    </div>
                    {/* Tuteur 1 first name */}
                    <div className="flex flex-col justify-center items-center ">
                        <div className="flex items-center w-full">
                            <label htmlFor="prenomTuteur1" class="block mb-1 font-semibold text-sm text-gray-700">{user.lang=="eng" ? "First name" :(user.lang=="fr" ? "Prenom" :"الاسم الشخصي")}</label>
                        </div>
                        <div className="flex items-center w-40">
                            <Input type="text" name="prenomTuteur1" value={prenomTuteur1} onChange={(e)=>{setPrenomTuteur1(e.target.value)}} required/>
                        </div>
                    </div>
                </div>
                <div className="flex justify-between w-full">
                    {/* Tuteur 1 Cin */}
                    <div className="flex flex-col justify-center items-center ">
                        <div className="flex items-center w-full">
                            <label htmlFor="cinTuteur1" class="block mb-1 font-semibold text-sm text-gray-700">{user.lang=="eng" ? "ID" :(user.lang=="fr" ? "Cin" : "بطاقة التعريف")}</label>
                        </div>
                        <div className="flex items-center w-40">
                            <Input type="text" name="cinTuteur1" value={cinTuteur1} onChange={(e)=>{setCinTuteur1(e.target.value)}} required/>
                        </div>
                    </div>
                    {/* Tuteur 1 job */}
                    <div className="flex flex-col justify-center items-center ">
                        <div className="flex items-center w-full">
                            <label htmlFor="jobTuteur1" class="block mb-1 font-semibold text-sm text-gray-700">{user.lang=="eng" ? "Job" :(user.lang=="fr" ? "Métier" :"المهنة")}</label>
                        </div>
                        <div className="flex items-center w-40">
                            <Input type="text" name="jobTuteur1" value={jobTuteur1} onChange={(e)=>{setJobTuteur1(e.target.value)}} required/>
                        </div>
                    </div>
                </div>
                <div className="flex justify-between w-full">
                    {/* Tuteur 1 Tel */}
                    <div className="flex flex-col justify-center items-center ">
                        <div className="flex items-center w-full">
                            <label htmlFor="telTuteur1" class="block mb-1 font-semibold text-sm text-gray-700">{user.lang=="eng" ? "Phone number" :(user.lang=="fr" ? "Tél" : "الهاتف")}</label>
                        </div>
                        <div className="flex items-center w-40">
                            <Input type="text" name="telTuteur1" value={telTuteur1} onChange={(e)=>{setTelTuteur1(e.target.value)}} required/>
                        </div>
                    </div>
                    {/* Tuteur 1 email */}
                    <div className="flex flex-col justify-center items-center ">
                        <div className="flex items-center w-full">
                            <label htmlFor="emailTuteur1" class="block mb-1 font-semibold text-sm text-gray-700">{user.lang=="eng" ? "Email" :(user.lang=="fr" ? "Email" :"البريد الالكتروني")}</label>
                        </div>
                        <div className="flex items-center w-40">
                            <Input type="text" name="emailTuteur1" value={emailTuteur1} onChange={(e)=>{setEmailTuteur1(e.target.value)}} required/>
                        </div>
                    </div>
                </div>
            </div>
            {/* Start of part 3 */}
            <div className="w-[30%] flex flex-col gap-4 items-center" >
                <div className="flex justify-center items-center">
                    <h3>Tutor 2</h3>
                </div>
                <div className="mt-6 first-letter: flex justify-between w-full">
                    {/* Tuteur 2 last name */}
                    <div className="flex flex-col justify-center items-center ">
                        <div className="flex items-center w-full">
                            <label htmlFor="nomTuteur2" class="block mb-1 font-semibold text-sm text-gray-700">{user.lang=="eng" ? "Last name" :(user.lang=="fr" ? "Nom" : "اسم النسب")}</label>
                        </div>
                        <div className="flex items-center w-40">
                            <Input type="text" name="nomTuteur2" value={nomTuteur2} onChange={(e)=>{setNomTuteur2(e.target.value)}}/>
                        </div>
                    </div>
                    {/* Tuteur 2 first name */}
                    <div className="flex flex-col justify-center items-center ">
                        <div className="flex items-center w-full">
                            <label htmlFor="prenomTuteur2" class="block mb-1 font-semibold text-sm text-gray-700">{user.lang=="eng" ? "First name" :(user.lang=="fr" ? "Prenom" :"الاسم الشخصي")}</label>
                        </div>
                        <div className="flex items-center w-40">
                            <Input type="text" name="prenomTuteur2" value={prenomTuteur2} onChange={(e)=>{setPrenomTuteur2(e.target.value)}}/>
                        </div>
                    </div>
                </div>
                <div className="flex justify-between w-full">
                    {/* Tuteur 2 Cin */}
                    <div className="flex flex-col justify-center items-center ">
                        <div className="flex items-center w-full">
                            <label htmlFor="cinTuteur2" class="block mb-1 font-semibold text-sm text-gray-700">{user.lang=="eng" ? "ID" :(user.lang=="fr" ? "Cin" : "بطاقة التعريف")}</label>
                        </div>
                        <div className="flex items-center w-40">
                            <Input type="text" name="cinTuteur2" value={cinTuteur2} onChange={(e)=>{setCinTuteur2(e.target.value)}}/>
                        </div>
                    </div>
                    {/* Tuteur 2 job */}
                    <div className="flex flex-col justify-center items-center ">
                        <div className="flex items-center w-full">
                            <label htmlFor="jobTuteur1" class="block mb-1 font-semibold text-sm text-gray-700">{user.lang=="eng" ? "Job" :(user.lang=="fr" ? "Métier" :"المهنة")}</label>
                        </div>
                        <div className="flex items-center w-40">
                            <Input type="text" name="jobTuteur2" value={jobTuteur2} onChange={(e)=>{setJobTuteur2(e.target.value)}}/>
                        </div>
                    </div>
                </div>
                <div className="flex justify-between w-full">
                    {/* Tuteur 2 Tel */}
                    <div className="flex flex-col justify-center items-center ">
                        <div className="flex items-center w-full">
                            <label htmlFor="telTuteur2" class="block mb-1 font-semibold text-sm text-gray-700">{user.lang=="eng" ? "Phone number" :(user.lang=="fr" ? "Tél" : "الهاتف")}</label>
                        </div>
                        <div className="flex items-center w-40">
                            <Input type="text" name="telTuteur2" value={telTuteur2} onChange={(e)=>{setTelTuteur2(e.target.value)}}/>
                        </div>
                    </div>
                    {/* Tuteur 2 email */}
                    <div className="flex flex-col justify-center items-center ">
                        <div className="flex items-center w-full">
                            <label htmlFor="emailTuteur2" class="block mb-1 font-semibold text-sm text-gray-700">{user.lang=="eng" ? "Email" :(user.lang=="fr" ? "Email" :"البريد الالكتروني")}</label>
                        </div>
                        <div className="flex items-center w-40">
                            <Input type="text" name="emailTuteur2" value={emailTuteur2} onChange={(e)=>{setEmailTuteur2(e.target.value)}}/>
                        </div>
                    </div>
                </div>
            </div>
            {/* End of part 3 */}
        </div>
        <div className=" flex w-full justify-center gap-6">
            <div className="relative mt-2">
            <Button type="submit" buttonText="Add" />
            </div>

        </div>
      </form>
    </div>
    </>
  );
};

export default NewStudent;






