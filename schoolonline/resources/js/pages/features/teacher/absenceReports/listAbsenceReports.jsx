import React, { useEffect, useState } from "react";
import Button from "../../../components/reusable/button";
import axios from "axios";
import Select from "react-select";

export default function ListAbsenceReports({ handleMainClick, year, schoolToEdit,user }) {
  const [reports, setReports] = useState([]);
  const [levels, setLevels] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [isFilterActive, setIsFilterActive] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(4);
  const handleClearFilter = () => {
    setSelectedClass(null);
    setSelectedLevel(null);
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
      marginTop: "-0.4rem",
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

    if(selectedClass){
        axios.get(`/listTeacherAbsenceReports?selectedYear=${year}&school=${schoolToEdit.id}&class_id=${selectedClass.value}`).then((response) => {
            setReports(response.data);
          });
    }
    else{
        axios.get(`/listTeacherAbsenceReports?selectedYear=${year}&school=${schoolToEdit.id}`).then((response) => {
            setReports(response.data);
          });
    }

  }, [year, schoolToEdit.id,selectedClass]);
  console.log(reports);

  const handleDeleteReport = (id) => {
    const confirmation = window.confirm("Please confirm the delete action.");
    if (confirmation) {
      // Make a DELETE request to delete the absence report by ID
      axios.delete(`/deleteAbsenceReport/${id}`)
        .then((response) => {
          // Handle the response here (e.g., show a success or error message)
          console.log(response.data);
          // After successful deletion, remove the report from the local state
          setReports((prevReports) => prevReports.filter((report) => report.id !== id));
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  const handleFilterByCategory = (selectedOption) => {
    setIsFilterActive(true);
    setSelectedClass(selectedOption);
  };
  const filteredReports = selectedClass
    ? reports.filter((report) => report.class_id === selectedClass.value)
    : reports;

    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    let currentPosts = [];
    if(filteredReports.length > 0)
    currentPosts = filteredReports.slice(indexOfFirstPost, indexOfLastPost);

  const listReports = currentPosts.map((report) => {
    const createdDate = new Date(report.created_at);
    const date = createdDate.toLocaleDateString();
    const time = createdDate.toLocaleTimeString();
    return(

        <tr key={report.id} className="bg-white border-b">
          <td className="px-6 py-3">{report.id}</td>
          <td className="px-6 py-3">{report.class.name}</td>
          <td className="px-6 py-3">{date + " " + time}</td>
          <td className="px-6 py-3">
            <div className="flex w-full h-full items-center">
              <a href="#" className="font-medium text-red-600 hover:underline" onClick={() => handleMainClick("AbsenceReportDetails",report)}>Details</a>
            </div>
          </td>
        </tr>
      );
  });

  const totalPages = Math.ceil(filteredReports.length / postsPerPage);
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
    <div className="w-full flex flex-col justify-center items-center">
      <div className="flex justify-start items-center w-5/6">
        <div className="w-1/4">
          <Button buttonText="Add" type="button" onClick={() => handleMainClick("NewAbsenceReport")} />
        </div>
        <div className="w-3/4 flex justify-center items-center mt-12">
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
            <div className="flex justify-center items-center">
                <div className="flex flex-col mx-1">
                    <label className="mx-3">Classes</label>
                    <Select
                        styles={customStyles}
                        components={{ Option: customOption }}
                        isSearchable={false}
                        value={selectedClass}
                        placeholder="Select Class"
                        onChange={handleFilterByCategory}
                        options={classes.map((classe) => ({
                            value: classe.id,
                            label: classe.name,
                        }))}
                    />
                </div>
                <div className="flex flex-col mx-1 mt-6">
                    {isFilterActive && (
                        <Button type="button" onClick={handleClearFilter} buttonText="Clear" />
                        )}
                </div>
            </div>
        </div>
      </div>
      <div className="w-full flex justify-center mt-6">
        <table className="w-5/6 text-sm text-left text-gray-500 shadow-md">
          <thead className="text-xs text-gray-700 uppercase bg-gray-300">
            <tr>
              <th scope="col" className="px-6 py-3">
                ID
              </th>
              <th scope="col" className="px-6 py-3">
                Class
              </th>
              <th scope="col" className="px-6 py-3">
                Date
              </th>
              <th scope="col" className="px-6 py-3 w-1/6">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>{listReports}</tbody>
        </table>
      </div>
      {renderPagination()}
    </div>
  );
}
