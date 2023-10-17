import React, { useState,useEffect } from 'react';
import axios from 'axios';
import Toast from "../../../components/reusable/toast";
function AbsenceReportValidation({ report,handleMainClick }) {
  const [checkedRows, setCheckedRows] = useState({});
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showDangerToast, setShowDangerToast] = useState(false);
  const [showWarningToast, setShowWarningToast] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage, setPostsPerPage] = useState(4);


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

  // Function to handle checkbox changes
  const handleCheckboxChange = (detailId) => {
    setCheckedRows((prevCheckedRows) => ({
      ...prevCheckedRows,
      [detailId]: !prevCheckedRows[detailId],
    }));
  };

  // Function to handle validation
  const handleValidation = () => {
    // Prepare an array of detail IDs that are checked
    const selectedDetailIds = Object.keys(checkedRows).filter(
      (detailId) => checkedRows[detailId]
    );
    axios.post('/updateValidation', { selectedDetailIds })
      .then((response) => {
        handleAlert("success");
          setTimeout(() => {
          handleMainClick("ListTeacherAbsenceReports");
        }, 1500);
      })
      .catch((error) => {
        console.log(error);
        handleAlert("danger");
        setTimeout(() => {
        //handleMainClick("ListLevels");
      }, 1500);
      });
  };

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  let currentPosts = [];
  if(report.details.length > 0)
  currentPosts = report.details.slice(indexOfFirstPost, indexOfLastPost);


  const listDetails =currentPosts.map((detail) =>{
    return ((
        <tr key={detail.id} className="bg-white border-b">
          <td scope="col" className="px-6 py-3">
            {detail.student.user.lastName + ' ' + detail.student.user.firstName}
          </td>
          <td scope="col" className="px-6 py-3">
            {detail.retard ? 'Yes' : 'No'}
          </td>
          <td scope="col" className="px-6 py-3">
            {detail.absence ? 'Yes' : 'No'}
          </td>
          <td scope="col" className="px-6 py-3">
            {detail.remark}
          </td>
          <td scope="col" className="px-6 py-3">
            {detail.validated==true ? "validated" : (<input
              type="checkbox"
              checked={!!checkedRows[detail.id]}
              onChange={() => handleCheckboxChange(detail.id)}
            />)}

          </td>
        </tr>
      ))
  });
  const totalPages = Math.ceil(report.details.length / postsPerPage);
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
         <div>
                {showSuccessToast && <Toast type="success" message="Absence report details validated successfully." />}
                {showDangerToast && <Toast type="danger" message="Error validating absence report details" />}
        </div>
      <div className="w-full flex justify-center items-center">
        <h2 className="text-gray-700 font-medium text-xl">Report Details</h2>
      </div>
      {/* Render the report details in a table */}
      <table className="w-5/6 text-sm text-left text-gray-500 shadow-md mt-12">
        <thead className="text-xs text-gray-700 uppercase bg-gray-300">
          <tr key={report.id}>
            <th scope="col" className="px-6 py-3">
              Student
            </th>
            <th scope="col" className="px-6 py-3">
              Retard
            </th>
            <th scope="col" className="px-6 py-3">
              Absence
            </th>
            <th scope="col" className="px-6 py-3">
              Remark
            </th>
            <th scope="col" className="px-6 py-3">
              Validate
            </th>
          </tr>
        </thead>
        <tbody>
    {listDetails}
        </tbody>
      </table>
      {renderPagination()}
      <button
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={handleValidation}
      >
        Validate
      </button>


    </div>
  );
}

export default AbsenceReportValidation;
