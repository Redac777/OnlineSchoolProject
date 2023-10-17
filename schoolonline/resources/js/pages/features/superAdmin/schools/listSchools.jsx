import { useEffect,useState } from "react";
import logo from "../../../../../../public/images/elaraki.png";
import plus from "../../../../../../public/images/plus.png";
import Button from "../../../components/reusable/button";
import axios from 'axios';
export default function Schools({handleMainClick,year}) {
    const [schools,setSchools] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
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

      const handleDeactivate = async (schoolId) => {
        try {
            const response = await axios.put(`/deactivateSchoolUsers/${schoolId}`);

            if (response.status === 200) {
                // Handle successful deactivation, e.g., update UI
                const updatedSchools = schools.map(school => {
                    if (school.id === schoolId) {
                        const updatedUsers = school.users.map(user => ({
                            ...user,
                            account: "deactivated"
                        }));

                        const updatedSchool = { ...school, users: updatedUsers };
                        return updatedSchool;
                    }
                    return school;
                });

                setSchools(updatedSchools);
            } else {
                // Handle error, e.g., show error message
            }
        } catch (error) {
            console.error('Error deactivating school users:', error);
        }
    };




    const handleActivate = async (schoolId) => {
        try {
          const response = await axios.put(`/activateSchoolUsers/${schoolId}`);

          if (response.status === 200) {
            // Handle successful activation, e.g., update UI
            const updatedSchools = schools.map((school) => {
              const updatedUsers = school.users.map((user) => ({
                ...user,
                account: "activated",
              }));

              const updatedSchool = { ...school, users: updatedUsers };
              return updatedSchool;
            });

            setSchools(updatedSchools);
          } else {
            // Handle error, e.g., show error message
          }
        } catch (error) {
          console.error('Error activating school users:', error);
        }
      };



    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await fetch(`/listSchools?selectedYear=${year}`);
            const schoolsData = await response.json();
            setSchools(schoolsData);
        } catch (error) {
            console.log(error);
          }
        }
        fetchData();
    },[year]);
    const indexOfLastPost = currentPage * postsPerPage;
      const indexOfFirstPost = indexOfLastPost - postsPerPage;
      let currentPosts = [];
      if(schools.length > 0)
      currentPosts = schools.slice(indexOfFirstPost, indexOfLastPost);
    const listSchools = currentPosts.sort((a, b) => a.name.localeCompare(b.name)).filter((school) =>
    school.name.toLowerCase().includes(searchQuery.toLowerCase())
  ).map(school => {
        // const createdDate = new Date(school.created_at);
        // const formattedDate = createdDate.toDateString();
        console.log(school.users);
        const user = school.users[0];
        const userId = user ? user.id : null; // Check if user is defined before accessing its properties
        const userCode = user ? user.code : null;
        const userAccount = user ? user.account : null;
        const createdDate = new Date(school.created_at);

        const day = createdDate.getDate();
        const month = createdDate.getMonth() + 1; // Months are zero-indexed, so add 1
        const year = createdDate.getFullYear();

const formattedDate = `${day}/${month<10 ? '0'+month : month}/${year}`;
        return(
            <tr class="bg-white border-b">
                <td scope="row" className="px-6 py-3 font-medium text-gray-900 whitespace-nowrap ">
                    <img src={`http://localhost:8000/images/${school.logo}`} className="w-12"/>
                </td>
                <td className="px-6 py-3">
                    {school.name}
                </td>
                <td className="px-6 py-3">
                    <a onClick={() => {
                        handleMainClick("SchoolAdmin",user);}} className="cursor-pointer hover:underline">{userCode}</a>
                </td>
                <td className="px-6 py-3">
                        {formattedDate}
                </td>
                <td className="px-6 py-3">
                        {school.pack.name}
                </td>
                <td className="px-6 py-3">
                    <div className="flex w-full h-full items-center">
                        <a href="#" className={`font-medium ${userAccount=="activated" ? "text-red-600" : "text-green-600"} hover:underline w-20`} onClick={() => {
                            if(userAccount=="activated")
                            handleDeactivate(school.id);
                            else
                            handleActivate(school.id);
                            }}>{userAccount=="activated" ? "Deactivate" : "Activate"}</a>
                        <a href="#" className="font-medium text-violet-600 hover:underline w-28 pl-3" onClick={()=>handleMainClick("NewMail",user)}>Contact admin</a>
                        <a href="#" className="font-medium text-yellow-600 hover:underline w-20 pl-5" onClick={()=>{handleMainClick("SchoolDetails",school)}}>Details</a>
                    </div>
                </td>
            </tr>
        )

    });

    const totalPages = Math.ceil(schools.length / postsPerPage);
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
    <div className="flex justify-start items-center w-5/6">
    <div className="w-1/4">
    <Button svgContent={plusButtonSvg} buttonText="Add" type="button" onClick={()=>{handleMainClick("NewSchool")}}/>
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
        <input type="search" id="default-search" class="block w-full py-3 pl-10 text-sm text-gray-900 border-b border-gray-300 bg-gray-50 focus:outline-none focus:border-slate-700" placeholder="Search School"  value={searchQuery}
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
                    Logo
                </th>
                <th scope="col" class="px-6 py-3">
                    Name
                </th>
                <th scope="col" class="px-6 py-3">
                    Admin
                </th>
                <th scope="col" class="px-6 py-3">
                    Subsription Date
                </th>
                <th scope="col" class="px-6 py-3">
                    Pack
                </th>
                <th scope="col" class="px-6 py-3 w-1/6">
                    Actions
                </th>
            </tr>
        </thead>
        <tbody>
        {listSchools}
        </tbody>
    </table>
</div>
{renderPagination()}
</div>
)
}
