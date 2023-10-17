import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from "react-select";
import Label from "../../../components/reusable/label";
const ListStudentsToManage = ({year,schoolToEdit,handleMainClick}) => {
  const [levels, setLevels] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [students, setStudents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(4);
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
    // Charger la liste des niveaux depuis votre API
    axios.get(`/listLevels?selectedYear=${year}&school=${schoolToEdit.id}`).then((response) => {
        setLevels(response.data);
      });
      if (selectedLevel) {
        // Fetch subjects filtered by the selected level ID
        axios.get(`/listClasses?level_id=${selectedLevel.value}&selectedYear=${year}&school=${schoolToEdit.id}`).then((response) => {
          setClasses(response.data);
        });
        if (selectedClass) {
                axios.get(`/listStudents?classe_id=${selectedClass.value}&selectedYear=${year}&school=${schoolToEdit.id}`).then((response) => {
                setStudents(response.data);
                });
          }
      }
  }, [year,selectedLevel,selectedClass]);
  const options = levels.map((level) => ({
    value: level.id,
    label: level.name,
  }));
  const classesOptions = classes.map((classe) => ({
    value: classe.id,
    label: classe.name,
  }));




  const showInfos = (student,levelId) => {
    console.log(student.id);
    console.log(levelId);
  }

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  let currentPosts = [];
  if(students.length > 0)
  currentPosts = students.slice(indexOfFirstPost, indexOfLastPost);

  const liststudents = currentPosts.map((student) => {
    return(
    <tr class="bg-white border-b">
            <td className="px-6 py-3">
                {student.user.lastName + " " + student.user.firstName}
            </td>
            <td className="px-6 py-3">
            <div className="flex w-full h-full items-center">
                    <a href="#" className="font-medium text-footerColor hover:underline" onClick={()=>{handleMainClick("ManageStudentFees",student,selectedLevel.value)}}>Manage Services</a>
                    <a href="#" className="font-medium text-blue-600 hover:underline pl-5" onClick={()=>{handleMainClick("StudentPaiements",student,selectedLevel.value)}}>Manage Fees</a>
                </div>
            </td>
        </tr>
  )
});

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

  return (
    <div className="w-full flex flex-col items-center">
        <div className="w-full flex justify-center items-center">
            <h2 className="text-gray-700 font-medium text-xl">List Students</h2>
        </div>
        <div className="w-3/4 mt-6">
            <div className='flex'>
                <div className='flex flex-col'>
                    <Label forName="level" labelText="Select level" variableClassName="mx-3"/>
                    <Select
                    id="category-select"
                    options={options}
                    styles={customStyles}
                    value={selectedLevel}
                    components={{ Option: customOption }}
                    isSearchable={false}
                    onChange={(selectedOption)=>{setSelectedLevel(selectedOption);}}
                    placeholder="Select level"
                    />
                </div>
                {selectedLevel && (
                <div className="flex flex-col">
                    <Label forName="level" labelText="Select class" variableClassName="mx-3"/>
                    <Select
                    id="category-select"
                    options={classesOptions}
                    styles={customStyles}
                    value={selectedClass}
                    components={{ Option: customOption }}
                    isSearchable={false}
                    onChange={(selectedOption) => {setSelectedClass(selectedOption);}}
                    placeholder="Select Class"
                    />
                </div>
                )}
            </div>
            <table class="w-5/6 text-sm text-left text-gray-500 shadow-md mt-6">
                <thead class="text-xs text-gray-700 uppercase bg-gray-300">
                    <tr>
                        <th scope="col" class="px-6 py-3">
                            Student Name
                        </th>
                        <th scope="col" class="px-6 py-3">
                            Action
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {selectedClass && liststudents}
                </tbody>
            </table>
        </div>
        {renderPagination()}
    </div>
  );
};

export default ListStudentsToManage;
