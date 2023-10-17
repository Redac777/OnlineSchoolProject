import React from "react";
import { useEffect,useState } from "react";
import axios from "axios";
import Button from "../../../components/reusable/button";
import Toast from "../../../components/reusable/toast";
import Select from "react-select";
const ListDepartments = ({handleMainClick,filtre,year,schoolToEdit}) => {
    const [departments, setDepartments] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [showSuccessToast, setShowSuccessToast] = useState(false);
    const [showDangerToast, setShowDangerToast] = useState(false);
    const [showWarningToast, setShowWarningToast] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [departmentsPerPage, setDepartmentsPerPage] = useState(10);
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

    useEffect(() => {
        // Fetch departments from the backend
        axios.get(`/listDepartments?selectedYear=${year}&school=${schoolToEdit.id}`).then((response) => {
          setDepartments(response.data);
        });
      }, [year]);

      const handleDeleteDepartment = (id) => {
        const confirmation = confirm("Please confirm delete action");
        if(confirmation){
        axios.delete(`/deletedDepartment/${id}`)
          .then((response) => {
            if(response.data.message =="Department not found")
            handleAlert("danger");
            else if(response.data.message=="Cannot delete this department")
            handleAlert("warning");
            else{
            handleAlert("success");
            setDepartments((prevDepartments) => prevDepartments.filter((department) => department.user.id !== id));
        }
            // Refresh your department list or perform other actions as needed
          })
          .catch((error) => {
            handleAlert("danger");
          });
        }
      };
      const indexOfLastDepartment = currentPage * departmentsPerPage;
      const indexOfFirstDepartment = indexOfLastDepartment - departmentsPerPage;
      let currentDepartments = [];
      if(departments.length > 0)
      currentDepartments = departments.slice(indexOfFirstDepartment, indexOfLastDepartment);


    const listDepartments = currentDepartments.filter((department) =>
    department.name.toLowerCase().includes(searchQuery.toLowerCase())).map(department => {
    return(
        <tr class="bg-white border-b">
            <td className="px-6 py-3">
                {department.name}
            </td>
            <td className="px-6 py-3">
            <a onClick={() => {
                        handleMainClick("SchoolAdmin",department.user);}} className="cursor-pointer hover:underline">{department.user.code}</a>
            </td>
            <td className="px-6 py-3">
                <div className="flex w-full h-full items-center">
                    <a href="#" className="font-medium text-violet-600 hover:underline pl-5" onClick={()=>handleMainClick("EditDepartment",department)}>Edit</a>
                    <a href="#" className="font-medium text-yellow-600 hover:underline pl-5" onClick={()=>{handleDeleteDepartment(department.user.id)}}>Delete</a>
                </div>
            </td>
        </tr>
    )});

const totalPages = Math.ceil(departments.length / departmentsPerPage);
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
      <div className="flex justify-center mt-4">
        <button class="flex items-center justify-center px-3 h-8 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white" onClick={() => handlePageChange(currentPage - 1)}>Précédent</button>
        {pageButtons}
        <button class="flex items-center justify-center px-3 h-8 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white" onClick={() => handlePageChange(currentPage + 1)}>Suivant</button>
      </div>
    );
  };
    return(
        <div className="w-full flex flex-col justify-center items-center -mt-12">
            {showSuccessToast && <Toast type="success" message="Department deleted successfully." />}
            {showDangerToast && <Toast type="danger" message="Error deleting department" />}
            {showDangerToast && <Toast type="warning" message="Cannot delete this department !!" />}
        <div className="flex justify-start items-center w-5/6">
        <div className="w-1/4">
        <Button svgContent={plusButtonSvg} buttonText="Add" type="button" onClick={()=>{handleMainClick("NewDepartment")}}/>
        </div>
        <div className="w-3/4">
            <form>
                <label for="default-search" class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
                <div class="relative">
                    <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                        </svg>
                    </div>
                    <input type="search" id="default-search" class="block w-full py-3 pl-10 text-sm text-gray-900 border-b border-gray-300 bg-gray-50 focus:outline-none focus:border-slate-700" placeholder="Search Department"  value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}/>
                </div>
            </form>
        </div>
        </div>
        <div className="w-full flex justify-center">
        <table class="w-5/6 text-sm text-left text-gray-500 shadow-md mt-6">
            <thead class="text-xs text-gray-700 uppercase bg-gray-300">
                <tr>
                    <th scope="col" class="px-6 py-3">
                        Name
                    </th>
                    <th scope="col" class="px-6 py-3">
                        Administrator
                    </th>
                    <th scope="col" class="px-6 py-3 w-1/6">
                        Actions
                    </th>
                </tr>
            </thead>
            <tbody>
            {listDepartments ? listDepartments : null}
            </tbody>
        </table>

    </div>
    {renderPagination()}
    </div>
    )

}

export default ListDepartments;
