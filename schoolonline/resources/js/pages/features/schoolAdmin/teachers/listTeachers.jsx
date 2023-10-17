import { useEffect,useState } from "react";
import logo from "../../../../../../public/images/elaraki.png";
import plus from "../../../../../../public/images/plus.png";
import Button from "../../../components/reusable/button";
import axios from 'axios';
export default function ListTeachers({handleMainClick,year,schoolToEdit}) {
    const [teachers,setTeachers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [showSuccessToast, setShowSuccessToast] = useState(false);
    const [showDangerToast, setShowDangerToast] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage, setPostsPerPage] = useState(4);
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
        // Fetch the list of levels from the backend API

        axios.get(`/listTeachers?selectedYear=${year}&school=${schoolToEdit.id}`).then((response) => {
          setTeachers(response.data);
        });
      }, [year]);
      console.log(teachers);

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


      const handleDeleteTeacher = (id) => {
        const confirmation = confirm("Please confirm delete action");
        if(confirmation){
        axios.delete(`/deletedTeacher/${id}`)
          .then((response) => {
            if(response.data.message =="Teacher not found")
            handleAlert("danger");
            else{
            handleAlert("success");
            setTeachers((prevTeachers) => prevTeachers.filter((teacher) => teacher.user.id !== id));
        }
          })
          .catch((error) => {
            handleAlert("danger");
          });
        }
      }

      let listTeachers = [];
      const indexOfLastPost = currentPage * postsPerPage;
      const indexOfFirstPost = indexOfLastPost - postsPerPage;
      let currentPosts = [];
      if(teachers.length > 0)
      currentPosts = teachers.slice(indexOfFirstPost, indexOfLastPost);
    if(currentPosts.length > 0){
        listTeachers = currentPosts.sort((a, b) => a.user.lastName.localeCompare(b.user.lastName)).filter((teacher) =>
        teacher.user.lastName.toLowerCase().includes(searchQuery.toLowerCase())
      ).map(teacher => {
            return(
                <tr class="bg-white border-b">
                    <td className="px-6 py-3">
                        {teacher.user.code}
                    </td>
                    <td className="px-6 py-3">
                        {teacher.user.lastName}
                    </td>
                    <td className="px-6 py-3">
                            {teacher.user.firstName}
                    </td>
                    <td className="px-6 py-3">
                            {teacher.user.email}
                    </td>
                    <td className="px-6 py-3">
                            {teacher.user.phone}
                    </td>
                    <td className="px-6 py-3">
                        <div className="flex w-full h-full items-center">
                            <a href="#" className="font-medium text-violet-600 hover:underline " onClick={()=>handleMainClick("TeacherClasses",teacher)}>classes</a>
                            <a href="#" className="font-medium text-green-500 hover:underline  pl-5" onClick={()=>{handleMainClick("TeacherSubjects",teacher)}}>subjects</a>
                            <a href="#" className="font-medium text-red-600 hover:underline  pl-5" onClick={()=>{handleDeleteTeacher(teacher.user.id)}}>delete</a>
                        </div>
                    </td>
                </tr>
            )

        });
    }


    const totalPages = Math.ceil(teachers.length / postsPerPage);
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
            <div className="w-full flex flex-col justify-center items-center">
                 {showSuccessToast && <Toast type="success" message="Subject deleted successfully." />}
                {showDangerToast && <Toast type="danger" message="Error deleting subject" />}
            <div className="flex justify-start items-center w-5/6">
            <div className="w-1/4">
            <Button svgContent={plusButtonSvg} buttonText="Add" type="button" onClick={()=>{handleMainClick("NewTeacher")}}/>
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
                <input type="search" id="default-search" class="block w-full py-3 pl-10 text-sm text-gray-900 border-b border-gray-300 bg-gray-50 focus:outline-none focus:border-slate-700" placeholder="Search Teacher"  value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}/>
            </div>
            </form>
            </div>
            </div>
            <div className="w-full flex justify-center mt-6">
            <table class="w-5/6 text-sm text-left text-gray-500 shadow-md">
                <thead class="text-xs text-gray-700 uppercase bg-gray-300">
                    <tr>
                        <th scope="col" class="px-6 py-3">
                            Code
                        </th>
                        <th scope="col" class="px-6 py-3">
                            Last Name
                        </th>
                        <th scope="col" class="px-6 py-3">
                            First Name
                        </th>
                        <th scope="col" class="px-6 py-3">
                            Email
                        </th>
                        <th scope="col" class="px-6 py-3">
                            Phone
                        </th>
                        <th scope="col" class="px-6 py-3 w-1/6">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody>
                {listTeachers}
                </tbody>
            </table>
        </div>
        {renderPagination()}
        </div>
        )

}
