import React from "react";
import { useEffect,useState } from "react";
import axios from "axios";
import Button from "../../../components/reusable/button";
import Toast from "../../../components/reusable/toast";
import Select from "react-select";
import Papa from 'papaparse';
const ListStudents = ({handleMainClick,year,classe,schoolToEdit}) => {
    const [students,setStudents] = useState([]);
    const [selectedClass, setSelectedClass] = useState(null); // Nouveau state pour la catégorie sélectionnée
    const [existingClasse,setExistingClasse] = useState(classe?.id || '');
    const [showSuccessToast, setShowSuccessToast] = useState(false);
    const [showDangerToast, setShowDangerToast] = useState(false);
    const [showSuccessToastTwo, setShowSuccessToastTwo] = useState(false);
    const [showDangerToastTwo, setShowDangerToastTwo] = useState(false);
    const [showWarningToast, setShowWarningToast] = useState(false);
    const [isFilterActive, setIsFilterActive] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage, setPostsPerPage] = useState(4);
    const [classes,setClasses] = useState([]);
    const [classIdMap, setClassIdMap] = useState({});
    const [fileUploaded,setFileUploaded] = useState(false);


    useEffect(() => {
        // Fetch the list of classes from the backend API
        axios.get(`/listClasses?selectedYear=${year}&school=${schoolToEdit.id}`).then((response) => {
          setClasses(response.data);
          const classesData = response.data;
          const newClassIdMap = {};
          classesData.forEach((classInfo) => {
            const { id, name } = classInfo;
            newClassIdMap[name] = id;
          });
          setClassIdMap(newClassIdMap);
        });
      }, [year]);

      useEffect(() => {
        if (selectedClass) {
            // Fetch students filtered by the selected level ID
                axios.get(`/listStudents?classe_id=${selectedClass.value}&selectedYear=${year}&school=${schoolToEdit.id}`).then((response) => {
                setStudents(response.data);
                });
          }
          else if(existingClasse) {
            axios.get(`/listStudents?classe_id=${existingClasse}&selectedYear=${year}&school=${schoolToEdit.id}`).then((response) => {
                setStudents(response.data);
              });
        }
         else {
          // Fetch all subjects without level filter
          setFileUploaded(false);
          axios.get(`/listStudents?selectedYear=${year}&school=${schoolToEdit.id}`).then((response) => {
            setStudents(response.data);
          });
        }
      }, [selectedClass,existingClasse,year,fileUploaded]);



    const handleClearFilter = () => {
        setSelectedClass(null); // Réinitialiser la catégorie sélectionnée
        setIsFilterActive(false); // Mettre à jour l'état du filtre
      };

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

    const plusButtonSvg = (
        <svg
          className="w-4 h-4 mr-2"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          />
        </svg>
      );

      const handleDeleteUser = (id,id2,id3) => {
        const confirmation = confirm("Please confirm delete action");
        if(confirmation){
        axios.delete(`/deletedUser/${id}/${id2}/${id3}`)
          .then((response) => {
            if(response.data.message =="User not found")
            handleAlert("danger");
            else if(response.data.message=="Cannot delete this user")
            handleAlert("warning");
            else{
            handleAlert("success");
            setStudents((prevStudents) => prevStudents.filter((student) => student.user.id !== id));
        }
            // Refresh your classe list or perform other actions as needed
          })
          .catch((error) => {
            handleAlert("danger");
          });
        }
      };
    useEffect(() => {
        if (showSuccessToast || showDangerToast || showWarningToast || showDangerToastTwo || showSuccessToastTwo) {
          const timer = setTimeout(() => {
            setShowSuccessToast(false);
            setShowDangerToast(false);
            setShowWarningToast(false);
            setShowDangerToastTwo(false);
            setShowSuccessToastTwo(false);
          }, 1500);

          return () => clearTimeout(timer);
        }
      }, [showSuccessToast, showDangerToast, showWarningToast,showDangerToastTwo,showSuccessToastTwo]);

      const handleAlert = (type) => {
        if (type === "success") setShowSuccessToast(true);
        else if (type === "warning") setShowWarningToast(true);
        else if(type === "successTwo") setShowSuccessToastTwo(true);
        else if (type === "errorTwo") setShowDangerToastTwo(true);
        else setShowDangerToast(true);
      };
      const handleFilterByCategory = (selectedOption) => {
        setIsFilterActive(true);
        setSelectedClass(selectedOption);
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


      const handleFileUpload = (event) => {
        const classesIds = classes.map(classe => classe.id);
        setFileUploaded(true);
        const file = event.target.files[0];
        if (file) {
          Papa.parse(file, {
            header: true, // Assumes the first row contains headers
            complete: (result) => {
              if (result.data && result.data.length > 0) {
                // Create an array to store student data
                const studentsData = result.data;
                studentsData.pop();
                const listStudentsData = [];
                studentsData.forEach((student) => {
                    const tutoronecode = generateRandomCodeTutor1(student.tutorOneFirstName, student.tutorOneLastName);
                    const tutortwocode = generateRandomCodeTutor2(student.tutorTwoFirstName, student.tutorTwoLastName);
                    const originalDate = student.birthDay;
                    const dateParts = originalDate.split('/');
                    const day = dateParts[0];
                    const month = dateParts[1];
                    const year = dateParts[2];
                    // Créez une nouvelle date au format "AAAA-MM-JJ"
                    const formattedDate = `${year}-${month}-${day}`;

                    const studentData = {
                        studentLastName: student.studentLastName,
                        studentFirstName: student.studentFirstName,
                        arablastName: student.arablastName,
                        arabfirstName: student.arabfirstName,
                        gender: student.gender,
                        address: student.address,
                        birthDay: formattedDate,
                        codeMassar : student.codeMassar,
                        studentPassword : student.codeMassar,
                        tutorOneFirstName : student.tutorOneFirstName,
                        tutorOneLastName : student.tutorOneLastName,
                        tutorOneCin : student.tutorOneCin,
                        tutorOneEmail : student.tutorOneEmail,
                        tutorOneJob : student.tutorOneJob,
                        tutorOneTel : student.tutorOneTel,
                        tutorOneCode : tutoronecode,
                        tutorOnePassword : tutoronecode,
                        tutorTwoCode : tutortwocode,
                        tutorTwoPassword : tutortwocode,
                        tutorTwoLastName : student.tutorTwoLastName,
                        tutorTwoFirstName : student.tutorTwoFirstName,
                        tutorTwoCin : student.tutorTwoCin,
                        tutorTwoEmail : student.tutorTwoEmail,
                        tutorTwoJob : student.tutorTwoJob,
                        tutorTwoTel : student.tutorTwoTel,
                        classId : classIdMap[student.classe],
                        schoolId : schoolToEdit.id,

                        // Add other properties here
                      };
                      if(classesIds.includes(studentData.classId))
                        listStudentsData.push(studentData);
                     else{
                     const alertMessage = "Student ignored: " + studentData.studentLastName + " " + studentData.studentFirstName;
                    // Affiche l'alerte sans confirmation
                    alert(alertMessage);

                    // Ferme automatiquement l'alerte après 3 secondes (3000 millisecondes)
                    setTimeout(() => {
                    const alertBox = document.querySelector(".alert");
                    }, 500);
                     }
                })
                handleSubmitForImportedData(listStudentsData);

              }
              else
              console.log("unfound");
            },
            error: (error) => {
              console.error('CSV parsing error:', error);
            },
          });
        }
      };

      const handleSubmitForImportedData = (studentsData) => {
        // Loop through the array of student data
        studentsData.forEach((studentData) => {
          // Make an API request or perform the necessary logic to create the student
          // You would typically make a POST request to your server or database here
          // Example API call (you need to adapt this to your API or database setup):
          axios.post('/create-studentwithparent', studentData)
            .then((response) => {
              // Handle the successful creation of the student (if needed)
              console.log('Student created:', response.data);
              setStudents((prevStudents) => [...prevStudents, response.data.student]);
              handleAlert("successTwo");
              setTimeout(() => {
              handleMainClick("ListStudents");
            }, 1500);
            })
            .catch((error) => {
              // Handle errors (if needed)
              handleAlert("errorTwo");
              console.error('Error creating student:', error);
            });
        });
      };
const indexOfLastPost = currentPage * postsPerPage;
const indexOfFirstPost = indexOfLastPost - postsPerPage;
let currentPosts = [];
if(students.length > 0)
currentPosts = students.slice(indexOfFirstPost, indexOfLastPost);
    const listStudents = currentPosts.map(student => {
    return(
        <tr student="bg-white border-b">
            <td className="px-6 py-3">
                {student.user.code}
            </td>
            <td className="px-6 py-3">
                {student.user.lastName}
            </td>
            <td className="px-6 py-3">
                {student.user.firstName}
            </td>
            <td className="px-6 py-3">
                {student.user.birthDay}
            </td>
            <td className="px-6 py-3">
                {student.classe.name}
            </td>
            <td className="px-6 py-3">
                {student.parents[0].user.phone}
            </td>
            <td className="px-6 py-3">
                <div className="flex w-full h-full items-center">
                    <a href="#" className="font-medium text-yellow-600 hover:underline pl-5" onClick={()=>{handleDeleteUser(student.user.id,student.parents[0].user.id,student.parents[1]?.user.id)}}>Delete</a>
                    <a href="#" className="font-medium text-footerColor hover:underline pl-5" onClick={()=>{handleMainClick("StudentDetails",student)}}>Details</a>
                </div>
            </td>
        </tr>
    )});
    const options = classes.map((classe) => ({
        value: classe.id,
        label: classe.name,
      }));


      const totalPages = Math.ceil(students.length / postsPerPage);
const handlePageChange = (newPage) => {
    if(newPage>0 && newPage<=totalPages)
        setCurrentPage(newPage);
};
const renderPagination = () => {
    const pageButtons = [];

    for (let i = 1; i <= totalPages; i++) {
      pageButtons.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={currentPage === i ? "active flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-blue-100 border rounded-lg border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white " : "flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border rounded-lg border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"}
        >
          {i}
        </button>
      );
    }

    return (
      <div className="flex justify-center">
        <button class="flex items-center justify-center px-3 h-8 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white" onClick={() => handlePageChange(currentPage - 1)}>Précédent</button>
        {pageButtons}
        <button class="flex items-center justify-center px-3 h-8 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white" onClick={() => handlePageChange(currentPage + 1)}>Suivant</button>
      </div>
    );
  };

    return(
        <div className="w-full flex flex-col justify-center items-center -mt-12">
            {showSuccessToast && <Toast type="success" message="student deleted successfully." />}
            {showSuccessToastTwo && <Toast type="success" message="student(s) imported successfully." />}
            {showDangerToastTwo && <Toast type="danger" message="Error importing student(s)" />}
            {showDangerToast && <Toast type="danger" message="Error deleting student" />}
            {showDangerToast && <Toast type="warning" message="Cannot delete this student !!" />}
        <div className="flex justify-start items-center w-5/6">
        <div className="w-1/4 flex justify-between items-center">
        <div className="relative">
                <input type="file" id="file-input" onChange={handleFileUpload} className="hidden"/>
                <label htmlFor="file-input" className="relative inline-flex items-center px-5 py-2 text-sm font-medium text-center text-white bg-slate-800 rounded-lg hover:bg-gray-700 focus:ring-4 focus:outline-none">
                    Import students
                </label>
        </div>
        <div className="relative">
        <Button svgContent={plusButtonSvg} buttonText="Add" type="button" onClick={()=>{handleMainClick("NewStudent")}}/>
        </div>
        </div>
        <div className="w-3/4">
        <form>
        <div student="relative">
            <div className="flex justify-center items-center">
            <Select
              id="category-select"
              options={options}
              styles={customStyles}
              value={selectedClass}
              components={{ Option: customOption }}
              isSearchable={false}
              onChange={handleFilterByCategory}
              placeholder="Select Class"
            />
            {isFilterActive && (
            <Button type="button" onClick={handleClearFilter} buttonText="Clear"/>
            )}
            </div>
        </div>
        </form>
        </div>
        </div>
        <div className="w-full flex justify-center">
        <table class="w-4/5 text-sm text-left text-gray-500 shadow-md mt-6">
            <thead class="text-xs text-gray-700 uppercase bg-gray-300">
                <tr>
                <th scope="col" class="px-6 py-3">
                        Massar Code
                    </th>
                    <th scope="col" class="px-6 py-3">
                        Last Name
                    </th>
                    <th scope="col" class="px-6 py-3">
                        First name
                    </th>
                    <th scope="col" class="px-6 py-3">
                        Birthday
                    </th>
                    <th scope="col" class="px-6 py-3">
                        Class
                    </th>
                    <th scope="col" class="px-6 py-3 w-1/6">
                        Tutor Tel
                    </th>
                    <th scope="col" class="px-6 py-3 w-1/6">
                        Actions
                    </th>
                </tr>
            </thead>
            <tbody>
            {listStudents ? listStudents : null}
            </tbody>
        </table>
    </div>
    {renderPagination()}
    </div>
    )

}

export default ListStudents;
