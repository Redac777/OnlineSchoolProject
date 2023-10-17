import React from "react";
import { useEffect,useState } from "react";
import axios from "axios";
import Button from "../../../components/reusable/button";
import Toast from "../../../components/reusable/toast";
import Select from "react-select";
const ListSubjects = ({handleMainClick,filtre,year,schoolToEdit}) => {
    const [levels,setLevels] = useState([]);
    const [subjects,setSubjects] = useState([]);
    const [selectedLevel, setSelectedLevel] = useState(null);
    const [showSuccessToast, setShowSuccessToast] = useState(false);
    const [showDangerToast, setShowDangerToast] = useState(false);
    const [showWarningToast, setShowWarningToast] = useState(false);
    const [isFilterActive, setIsFilterActive] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage, setPostsPerPage] = useState(4);
    useEffect(() => {
        // Fetch the list of levels from the backend API
        axios.get(`/listLevels?selectedYear=${year}&school=${schoolToEdit.id}`).then((response) => {
          setLevels(response.data);
        });
      }, [year]);
      useEffect(() => {
        if (selectedLevel) {
          // Fetch subjects filtered by the selected level ID
          axios.get(`/listSubjects?level=${selectedLevel.value}&selectedYear=${year}&school=${schoolToEdit.id}`).then((response) => {
            setSubjects(response.data);
          });
        } else {
          // Fetch all subjects without level filter
          axios.get(`/listSubjects?selectedYear=${year}&school=${schoolToEdit.id}`).then((response) => {
            setSubjects(response.data);
          });
        }
      }, [selectedLevel,year]);

    const handleClearFilter = () => {
        setSelectedLevel(null); // Réinitialiser la catégorie sélectionnée
        setIsFilterActive(false); // Mettre à jour l'état du filtre
      };
      const options = levels.map((level) => ({
        value: level.id,
        label: level.name,
      }));

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


      const handleFilterByLevel = (selectedOption) => {
        setIsFilterActive(true);
        setSelectedLevel(selectedOption); // Mettre à jour la catégorie sélectionnée
      };

      const handleDeleteSubject = (id) => {
        const confirmation = confirm("Please confirm delete action");
        if(confirmation){
        axios.delete(`/deletedSubject/${id}`)
          .then((response) => {
            if(response.data.message =="Subject not found")
            handleAlert("danger");
            else if(response.data.message=="Cannot delete this subject")
            handleAlert("warning");
            else{
            handleAlert("success");
            setSubjects((prevSubjects) => prevSubjects.filter((subject) => subject.id !== id));
        }
            // Refresh your subject list or perform other actions as needed
          })
          .catch((error) => {
            handleAlert("danger");
          });
        }
      };

      const indexOfLastPost = currentPage * postsPerPage;
      const indexOfFirstPost = indexOfLastPost - postsPerPage;
      let currentPosts = [];
      if(subjects.length > 0)
      currentPosts = subjects.slice(indexOfFirstPost, indexOfLastPost);

    const listSubjects = currentPosts.map(subject => {
    return(
        <tr class="bg-white border-b">
            <td className="px-6 py-3">
                {subject.name}
            </td>
            <td className="px-6 py-3">
                <div className="flex w-full h-full items-center">
                    <a href="#" className="font-medium text-violet-600 hover:underline" onClick={()=>handleMainClick("EditSubject",subject)}>Edit</a>
                    <a href="#" className="font-medium text-yellow-600 hover:underline pl-5" onClick={()=>{handleDeleteSubject(subject.id)}}>Delete</a>
                    <a href="#" className="font-medium text-footerColor hover:underline pl-5" onClick={()=>handleMainClick("SubjectDetails",subject)}>Details</a>
                </div>
            </td>
        </tr>
    )});

    const totalPages = Math.ceil(subjects.length / postsPerPage);
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
            {showSuccessToast && <Toast type="success" message="Subject deleted successfully." />}
            {showDangerToast && <Toast type="danger" message="Error deleting subject" />}
            {showDangerToast && <Toast type="warning" message="Cannot delete this subject !!" />}
        <div className="flex justify-start items-center w-5/6">
        <div className="w-3/4">
        <Button svgContent={plusButtonSvg} buttonText="Add" type="button" onClick={()=>{handleMainClick("NewSubject")}}/>
        </div>
        <div className="w-1/4">
        <form>
        <label for="default-search" class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
        <div class="relative">

            <div className="flex justify-center items-center">
            <Select
            options={options}
            value={selectedLevel}
            onChange={handleFilterByLevel}
            placeholder="Filter by level"
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
        <table class="w-1/2 text-sm text-left text-gray-500 shadow-md mt-6">
            <thead class="text-xs text-gray-700 uppercase bg-gray-300">
                <tr>
                    <th scope="col" class="px-6 py-3">
                        Name
                    </th>
                    <th scope="col" class="px-6 py-3 w-1/6">
                        Actions
                    </th>
                </tr>
            </thead>
            <tbody>
            {listSubjects ? listSubjects : null}
            </tbody>
        </table>
    </div>
    {renderPagination()}
    </div>
    )

}

export default ListSubjects;
