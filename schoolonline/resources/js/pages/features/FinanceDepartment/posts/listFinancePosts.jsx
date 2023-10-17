import React from "react";
import { useEffect,useState } from "react";
import axios from "axios";
import Button from "../../../components/reusable/button";
import Toast from "../../../components/reusable/toast";
import Select from "react-select";
const ListFinancePosts = ({handleMainClick,year,schoolToEdit}) => {
    const [posts, setPosts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [showSuccessToast, setShowSuccessToast] = useState(false);
    const [showDangerToast, setShowDangerToast] = useState(false);
    const [showWarningToast, setShowWarningToast] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage, setPostsPerPage] = useState(4);
    const [isFilterActive, setIsFilterActive] = useState(false);
    const [addvalue, setAddvalue] = useState("authValue");
    const [showSelectTeacher, setShowSelectTeacher] = useState(false);


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

      useEffect(()=>{
        setAddvalue("authUser");
      },[])


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


      useEffect(() => {


            axios.get(`/listPosts?selectedYear=${year}&school=${schoolToEdit.id}&addvalue=${addvalue}`).then((response) => {
                setPosts(response.data);
              });


      }, [year,addvalue]);
      const handleAlert = (type) => {
        if (type === "success") setShowSuccessToast(true);
        else if (type === "warning") setShowWarningToast(true);
        else setShowDangerToast(true);
      }
      const handleDeletePost = (id) => {
        const confirmation = confirm("Please confirm delete action");
        if(confirmation){
        axios.delete(`/deletePost/${id}`)
          .then((response) => {
            if(response.data.message =="Post not found")
            handleAlert("danger");
            else if(response.data.message=="Cannot delete this post")
            handleAlert("warning");
            else{
            handleAlert("success");
            setPosts((prevPosts) => prevPosts.filter((post) => post.user.id !== id));
        }
            // Refresh your post list or perform other actions as needed
          })
          .catch((error) => {
            handleAlert("danger");
          });
        }
      };


      const isImage = (filePath) => {
        const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".bmp"];
        const extension = filePath.toLowerCase().slice((filePath.lastIndexOf(".") - 1 >>> 0) + 2);
        return imageExtensions.includes(`.${extension}`);
      };

      const indexOfLastPost = currentPage * postsPerPage;
      const indexOfFirstPost = indexOfLastPost - postsPerPage;
      let currentPosts = [];
      if(posts.length > 0)
      currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);


    const listPosts = currentPosts.filter((post) =>
    post.post_title.toLowerCase().includes(searchQuery.toLowerCase())).map((post,index) => {
        const createdDate = new Date(post.created_at);
        const date = createdDate.toLocaleDateString();
        const time = createdDate.toLocaleTimeString();
        if(post.file)
        return(
            <div className="mb-6">
                {isImage(post.file.file_path) ? (
                    <a
                    key={index}
                    href={isImage(post.file.file_path) ? post.file.file_path : "#"}
                    className="flex items-center justify-center bg-white border border-gray-200 rounded-lg shadow w-400 h-48"
                >

                    <div className="w-1/2"><img
                        className="object-cover w-full rounded-t-lg h-48  md:rounded-none md:rounded-l-lg"
                        src={`http://localhost:8000/storage/${post.file.file_path}`}
                        alt={post.post_title}
                    /></div>
                    <div className="flex flex-col justify-between items-center p-4 leading-normal w-1/2">
                    <h5 className="text-md font-bold tracking-tight text-gray-900 dark:text-white">{post.post_title}</h5>
                    <p className="text-xsm font-normal text-gray-700 dark:text-gray-400">{post.post_content}</p>
                    <div className="pt-6 flex justify-center gap-2 items-center text-3xs">
                    <span className="font-medium">{addvalue=="school" ? post.school.name : post.user.lastName + " " +post.user.firstName}</span>
                    <span>{date + " "+time}</span>
                    </div>
                    </div>
                </a>
                ):(
                    <a
                    key={index}
                    href={isImage(post.file.file_path) ? post.file.file_path : "#"}
                    className="flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow w-96 h-48"
                    >
                        <div className="flex flex-col justify-between p-4 leading-normal">
                        <h5 className="mb-2 text-lg font-bold tracking-tight text-gray-900 dark:text-white">{post.post_title}</h5>
                        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">{post.post_content}</p>
                        <div className="pt-6 flex justify-center gap-2 items-center text-3xs">
                    <span className="font-medium">{addvalue=="school" ? post.school.name : post.user.lastName + " " +post.user.firstName}</span>
                    <span>{date + " "+time}</span>
                    </div>
                        </div>
                        <a
                            href={`http://localhost:8000/storage/${post.file.file_path}`} // The file path to download
                            download = {`${post.post_title}.${post.file.file_type}`} // Add the download attribute
                            className="relative inline-flex items-center px-5 py-2 text-sm font-medium text-center text-white bg-slate-800 rounded-lg hover:bg-gray-700 focus:ring-4 focus:outline-none"
                        >
                            Download Attached File
                        </a>
                    </a>
                )}
            </div>
        )
       else return(

                        <div className="flex flex-col justify-center items-center space-y-4 p-4 leading-normal bg-white border border-gray-200 rounded-lg shadow w-96 h-48">
                            <h5 className="mb-2 text-lg font-bold tracking-tight text-gray-900 dark:text-white">{post.post_title}</h5>
                            <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">{post.post_content}</p>
                            <div className="pt-6 flex justify-center gap-2 items-center text-3xs">
                    <span className="font-medium">{addvalue=="school" ? post.school.name : post.user.lastName + " " +post.user.firstName}</span>
                    <span>{date + " "+time}</span>
                    </div>
                        </div>

        )
        });


const totalPages = Math.ceil(posts.length / postsPerPage);
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
            {showSuccessToast && <Toast type="success" message="Post deleted successfully." />}
            {showDangerToast && <Toast type="danger" message="Error deleting post" />}
            {showDangerToast && <Toast type="warning" message="Cannot delete this post !!" />}
        <div className="flex justify-start items-center w-5/6">

        <div className="w-1/4">
        <Button svgContent={plusButtonSvg} buttonText="Add" type="button" onClick={()=>{handleMainClick("NewPost")}}/>
        </div>
        <div className="w-3/4">
            <form>
            {showSelectTeacher && (
            <div className="flex justify-center items-center">
                <Select
                id="category-select"
                options={teacherOptions}
                styles={customStyles}
                value={selectedTeacher}
                components={{ Option: customOption }}
                isSearchable={false}
                onChange={(selectedOption) => handleFilterByCategory(selectedOption, "teacher")}
                placeholder="Select Teacher"
                />
            {isFilterActive && (
            <Button type="button" onClick={handleClearFilter} buttonText="Clear"/>
            )}
            </div>)}
                <label for="default-search" class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
                <div class="relative">
                    <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                        </svg>
                    </div>
                    <input type="search" id="default-search" class="block w-full py-3 pl-10 text-sm text-gray-900 border-b border-gray-300 bg-gray-50 focus:outline-none focus:border-slate-700" placeholder="Search Post"  value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}/>
                </div>
            </form>
        </div>
        </div>
        <div className="flex flex-col justify-center items-center">
            <div className="w-full flex justify-center mt-4 gap-4">
                <button className={` px-4 py-2 rounded-lg text-slate-800 font-medium hover:bg-gray-400 ${addvalue=="authUser" ? "bg-slate-400" : "bg-gray-300"}`} type="button" onClick={()=>{
                     setShowSelectTeacher(false);
                    setAddvalue("authUser")}}>My posts</button>
                <button className= {`bg-gray-300 px-4 py-2 rounded-lg text-slate-800 font-medium hover:bg-gray-400 ${addvalue=="school" ? "bg-slate-400" : "bg-gray-300"}`} type="button" onClick={()=>{
                     setShowSelectTeacher(false);
                    setAddvalue("school")}}>School posts</button>
            </div>
            <div className="w-full grid grid-cols-2 justify-center items-center mt-6 gap-x-4 pl-24">
                {listPosts ? listPosts : null}
            </div>
        </div>
    {renderPagination()}
    </div>
    )

}
export default ListFinancePosts;
