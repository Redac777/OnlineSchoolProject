import React from "react";
import { useState,useEffect } from "react";
import axios from 'axios';
import studentHome from "../../../../../../public/images/studentHome.png";
import feeds from "../../../../../../public/images/feeds.png";
import teacherHome from "../../../../../../public/images/teacherHome.png";
import staffHome from "../../../../../../public/images/staffHome.png";

const SchoolAdminHome = ({user,handleMainClick,schoolToEdit,year}) => {
    const [newItems, setNewItems] = useState([]);
    const [studentCount,setStudentCount] = useState(0);
    const [teacherCount,setTeacherCount] = useState(0);
    const [departmentCount,setDepartmentCount] = useState(0);
    const [postCount,setPostCount] = useState(0);
    useEffect(() => {
    const homeItemsEng = [
        { text: "students", linkText: "new student", linkValue: "NewStudent", icon: studentHome, bgColor: `bg-violet-200`, textColor: `text-violet-800`, isHovered: false },
        { text: "teachers", linkText: "new teacher", linkValue: "NewTeacher", icon: teacherHome, bgColor: `bg-slate-400`, textColor: `text-slate-800`, isHovered: false },
        { text: "departments", linkText: "new department", linkValue: "NewDepartment", icon: staffHome, bgColor: `bg-blue-300`, textColor: `text-blue-700`, isHovered: false },
        { text: "posts", linkText: "new post", linkValue: "NewSchoolPost", icon: feeds, bgColor: `bg-pink-200`, textColor: `text-footerColor`, isHovered: false },
      ];
      const homeItemsFr = [
        { text: "élèves", linkText: "ajouter", linkValue: "NewStudent", icon: studentHome, bgColor: `bg-violet-200`, textColor: `text-violet-800`, isHovered: false },
        { text: "professeurs", linkText: "ajouter", linkValue: "NewTeacher", icon: teacherHome, bgColor: `bg-slate-400`, textColor: `text-slate-800`, isHovered: false },
        { text: "départements", linkText: "ajouter", linkValue: "NewDepartment", icon: staffHome, bgColor: `bg-blue-300`, textColor: `text-blue-700`, isHovered: false },
        { text: "publications", linkText: "publier", linkValue: "NewSchoolPost", icon: feeds, bgColor: `bg-pink-200`, textColor: `text-footerColor`, isHovered: false },


      ];
      const homeItemsArabic = [
        { text: "تلاميذ", linkText: "إضافة", linkValue: "NewStudent", icon: studentHome, bgColor: `bg-violet-200`, textColor: `text-violet-800`, isHovered: false },
        { text: "مدرسين", linkText: "إضافة", linkValue: "NewTeacher", icon: teacherHome,  bgColor: `bg-slate-400`, textColor: `text-slate-800`, isHovered: false },
        { text: "مراكز", linkText: "إضافة", linkValue: "NewDepartment", icon: staffHome, bgColor: `bg-blue-300`, textColor: `text-blue-700`, isHovered: false },
        { text: "منشورات", linkText: "نشر", linkValue: "NewSchoolPost", icon: feeds, bgColor: `bg-pink-200`, textColor: `text-footerColor`, isHovered: false },


      ];

      if(user.lang=="eng")
        setNewItems(homeItemsEng);
      else if(user.lang=="fr")
        setNewItems(homeItemsFr);
      else
        setNewItems(homeItemsArabic);
    }, [user.lang]);


      const handleMouseEnter = (item) => {
        setNewItems((prevItems) =>
          prevItems.map((prevItem) =>
            prevItem === item ? { ...prevItem, isHovered: true } : prevItem
          )
        );
      };

      const handleMouseLeave = (item) => {
        setNewItems((prevItems) =>
          prevItems.map((prevItem) =>
            prevItem === item ? { ...prevItem, isHovered: false } : prevItem
          )
        );
      };

      useEffect(() => {
        axios.get(`/getStudentCount?selectedYear=${year}&school=${schoolToEdit.id}`).then((response) => {
          setStudentCount(response.data.studentCount);
        });
        axios.get(`/getTeacherCount?selectedYear=${year}&school=${schoolToEdit.id}`).then((response) => {
            setTeacherCount(response.data.teacherCount);
        });
        axios.get(`/getDepartmentCount?selectedYear=${year}&school=${schoolToEdit.id}`).then((response) => {
            setDepartmentCount(response.data.departmentCount);
        });
        axios.get('/get-post-count/' + user.id).then((response) => {
            setPostCount(response.data.postCount);
          });
      }, [year,schoolToEdit]);


    // My list of home items to be displayed
    const itemsList = newItems.map((item,index) => {
        return (
        <div className="w-1/6 transition-all duration-1000" onMouseEnter={() => handleMouseEnter(item)} onMouseLeave={() => handleMouseLeave(item)}>
            {/* Start of Schools part */}
            <div key={index} className={`${item.isHovered ? "hidden" : "flex"} ${item.bgColor} flex-col h-44 justify-center py-5 gap-2 w-full rounded-xl shadow-md`} >
                <div className="flex justify-center items-center py-2">
                    <img src={item.icon} className={`${item.bgColor} w-10 rounded-full p-2 shadow-lg `}/>
                </div>
                <div className="flex flex-col justify-center items-center py-2">
                    <span className={`${item.textColor} text-2xl font-semibold`}>
                        {index==0 && studentCount}
                        {index==1 && teacherCount}
                        {index==2 && departmentCount}
                        {index==3 && postCount}
                    </span>
                    <span className={`${item.textColor} text-md font-semibold`}>
                        {item.text}
                    </span>
                </div>
            </div>
            {/* End of Schools part */}
            {/* Start of hover Schools Part */}
            <div className={`${item.isHovered ? "flex" : "hidden"} h-44 items-center justify-center bg-gray-200 shadow-md py-5 gap-2 w-full rounded-xl`}>
                <div className="flex justify-center items-center w-full">
                    <a className=" font-medium text-gray-500 bg-gray-200 px-8 py-1 rounded-lg cursor-pointer text-md hover:underline" onClick={()=>{handleMainClick(item.linkValue)}}>{item.linkText}</a>
                </div>
            </div>
            {/* End of hover Schools Part */}
        </div>
        )});

        return (
            <div className={` flex flex-col w-full`}>
                <div className={`flex ${user.lang=="عربي" ? "justify-end" : "justify-start"} items-center px-10 text-gray-800 font-semibold text-xl`}>
                    <h2>{user.lang=="عربي" ? "مرحبًا بعودتك" : (user.lang=="fr" ? "Bienvenu(e) , ravi de vous revoir ! " : "Hi, Welcome Back") }</h2>
                </div>
                <div className={`flex ${user.lang=="عربي" ? "justify-end" : "justify-start"} w-full mt-7 px-10 gap-6`}>
                    {itemsList}
                </div>
            </div>
        )
}

export default SchoolAdminHome;
