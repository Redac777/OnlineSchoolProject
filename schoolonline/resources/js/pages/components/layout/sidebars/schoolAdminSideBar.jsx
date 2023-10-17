import { useState,useEffect } from 'react';
import flecheDroite from '../../../../../../public/images/flecheDroite.png';
import flecheBas from '../../../../../../public/images/flecheBas.png';
import dashboardIcon from '../../../../../../public/images/graphique.png';
import schoolsIcon from '../../../../../../public/images/school.png';
import postsIcon from '../../../../../../public/images/newsfeed.png';
import student from '../../../../../../public/images/student.png';
import teacher from '../../../../../../public/images/teacher.png';
import staff from '../../../../../../public/images/staff.png';
import level from '../../../../../../public/images/level.png';
import classIcon from '../../../../../../public/images/class.png';
import subject from '../../../../../../public/images/subject.png';

import school from '../../../../../../public/images/schoollogobestqrmbg.png';
const SchoolAdminSideBar = ({user,school,handleSidebarClick,renderedComponent}) => {
    const [subListAccounts,setSubListAccounts] = useState(false);
    const handleSelectedList = () => {
        setSubListAccounts(!subListAccounts);
    }
    return (
        <div className={`print:hidden bg-main-bg flex flex-col border-dashed ${user.lang=="عربي" ? "border-l" : "border-r"} h-screen`}>
            {/* Dashboard image  */}
            <div className="mt-6 flex items-center justify-center">
                <img src={`http://localhost:8000/storage/${school.logo}`} className="w-28"/>
            </div>
            {/* Profile image and user full name */}
            <div className={`mt-10 mx-6 flex ${user.lang=="عربي" && "justify-end"}  text-sm items-center py-3 px-4 rounded-lg bg-gray-200 gap-5`}>
                {user.lang=="عربي" ? (
                    <>
                    <h3 className="font-roboto text-gray-700 font-black">{user.lastName + " " + user.firstName}</h3>
                    <img src={user.userProfil ? `http://localhost:8000/storage/${user.userProfil}` : null} className="rounded-full w-12 h-12 bg-main-bg  p-1"/>
                    </>
                ): (
                    <>
                    <img src={user.userProfil ? `http://localhost:8000/storage/${user.userProfil}` : null} className="rounded-full w-12 h-12 bg-main-bg  p-1"/>
                    <div className='flex flex-col'>
                    <h3 className="font-roboto text-gray-700 font-black">{user.lastName + " " + user.firstName}</h3>
                    <h3>{user.user_type}</h3>
                    </div>                    </>
                )}
            </div>
            {/* sideBar links */}
            <ul className="mt-6 flex flex-col gap-1">
                {/* Dashboard */}
                <li className={`flex items-center ${user.lang=="عربي" ? "justify-end" : "justify-start"} gap-4 mx-6 cursor-pointer py-3 px-4 rounded-lg hover:bg-slate-300 ${renderedComponent==="SchoolAdminHome" ? "bg-slate-300":""}`}>
                {user.lang=="عربي" ? (
                    <>
                    <a className={`text-sm ${(renderedComponent==="SchoolAdminHome")? "text-slate-800 font-bold" : "text-sideBarITemsColor font-medium"}`} onClick={()=>{handleSidebarClick("Home")}}>
                    لوحة القيادة
                    </a>
                    <img src={dashboardIcon} className={`w-6 p-1 rounded-full ${(renderedComponent=="SchoolAdminHome") ? "bg-slate-800" : ""}`} />
                    </>
                ): (
                    <>
                    <img src={dashboardIcon} className={`w-6 p-1 rounded-full ${(renderedComponent=="SchoolAdminHome") ? "bg-slate-800" : ""}`} />
                    <a className={`text-sm ${(renderedComponent==="SchoolAdminHome")? "text-slate-800 font-bold" : "text-sideBarITemsColor font-medium"}`} onClick={()=>{handleSidebarClick("Home")}}>
                    {user.lang=="eng" ? 'Dashboard' : 'Panneau de gestion'}
                    </a>
                    </>
                )}
                </li>
                {/* Accounts */}
                <li className={`flex items-center ${user.lang=="عربي" ? "justify-end" : "justify-start"} gap-4 mx-6 cursor-pointer py-3 px-4 rounded-lg hover:bg-slate-300 `}>
                {user.lang=="عربي" ? (
                    <>
                    <a className={`text-sm  text-sideBarITemsColor font-medium`} onClick={()=>{handleSelectedList()}}>
                    حسابات                    </a>
                    <img src={schoolsIcon} className={`w-6 p-1 rounded-full`} />
                    </>
                ): (
                    <>
                    <img src={schoolsIcon} className={`w-6 p-1 rounded-full `} />
                    <a className={`text-sm  text-sideBarITemsColor font-medium`} onClick={()=>{handleSelectedList()}}>
                    {user.lang=="eng" ? 'Accounts' : 'Comptes'}
                    </a>
                    </>
                )}
                </li>


                {/* SubList for accounts  */}
                {subListAccounts &&(
                    <ul className="mt-1 mx-7 bg-gray-100 rounded-xl">
                    <li className={`flex items-center ${user.lang=="عربي" ? "justify-end" : "justify-start"} gap-4 px-11 cursor-pointer py-3 rounded-lg hover:bg-slate-300 ${renderedComponent==="ListStudents" ? "bg-slate-300":""}`}>
                    {user.lang=="عربي" ? (
                        <>
                        <a className={`text-xsm ${(renderedComponent==="ListStudents")? "text-slate-800 font-bold" : "text-sideBarITemsColor font-medium"}`} onClick={()=>{handleSidebarClick("ListStudents")}}>
                        تلاميذ                     </a>
                        <img src={student} className={`w-5 p-1 rounded-full ${(renderedComponent=="ListStudents") ? "bg-slate-800" : ""}`} />
                        </>
                    ): (
                        <>
                        <img src={student} className={`w-6 p-1 rounded-full ${(renderedComponent=="ListStudents") ? "bg-slate-800" : ""}`} />
                        <a className={`text-xsm ${(renderedComponent==="ListStudents")? "text-slate-800 font-bold" : "text-sideBarITemsColor font-medium"}`} onClick={()=>{handleSidebarClick("ListStudents")}}>
                        {user.lang=="eng" ? 'Students' : 'Elèves'}
                        </a>
                        </>
                    )}
                    </li>
                    <li className={`flex items-center ${user.lang=="عربي" ? "justify-end" : "justify-start"} gap-4  cursor-pointer py-3 px-11 rounded-lg hover:bg-slate-300 ${renderedComponent==="ListTeachers" ? "bg-slate-300":""}`}>
                    {user.lang=="عربي" ? (
                        <>
                        <a className={`text-xsm ${(renderedComponent==="ListTeachers")? "text-slate-800 font-bold" : "text-sideBarITemsColor font-medium"}`} onClick={()=>{handleSidebarClick("ListTeachers")}}>
                        مدرسين                      </a>
                        <img src={teacher} className={`w-5 p-1 rounded-full ${(renderedComponent=="ListTeachers") ? "bg-slate-800" : ""}`} />
                        </>
                    ): (
                        <>
                        <img src={teacher} className={`w-6 p-1 rounded-full ${(renderedComponent=="ListTeachers") ? "bg-slate-800" : ""}`} />
                        <a className={`text-xsm ${(renderedComponent==="ListTeachers")? "text-slate-800 font-bold" : "text-sideBarITemsColor font-medium"}`} onClick={()=>{handleSidebarClick("ListTeachers")}}>
                        {user.lang=="eng" ? 'Teachers' : 'Professeurs'}
                        </a>
                        </>
                    )}
                     </li>
                     <li className={`flex items-center ${user.lang=="عربي" ? "justify-end" : "justify-start"} gap-4 cursor-pointer py-3 px-11 rounded-lg hover:bg-slate-300 ${renderedComponent==="ListDepartments" ? "bg-slate-300":""}`}>
                    {user.lang=="عربي" ? (
                        <>
                        <a className={`text-xsm ${(renderedComponent==="ListDepartments")? "text-slate-800 font-bold" : "text-sideBarITemsColor font-medium"}`} onClick={()=>{handleSidebarClick("ListDepartments")}}>
                        مراكز                       </a>
                        <img src={staff} className={`w-5 p-1 rounded-full ${(renderedComponent=="ListDepartments") ? "bg-slate-800" : ""}`} />
                        </>
                    ): (
                        <>
                        <img src={staff} className={`w-6 p-1 rounded-full ${(renderedComponent=="ListDepartments") ? "bg-slate-800" : ""}`} />
                        <a className={`text-xsm ${(renderedComponent==="ListDepartments")? "text-slate-800 font-bold" : "text-sideBarITemsColor font-medium"}`} onClick={()=>{handleSidebarClick("ListDepartments")}}>
                        {user.lang=="eng" ? 'Departments' : 'Départments'}
                        </a>
                        </>
                    )}
                     </li>
                </ul>
                )}


                {/* Levels */}
                <li className={`flex items-center ${user.lang=="عربي" ? "justify-end" : "justify-start"} gap-4 mx-6 cursor-pointer py-3 px-4 rounded-lg hover:bg-slate-300 ${renderedComponent==="ListLevels" ? "bg-slate-300":""}`}>
                {user.lang=="عربي" ? (
                    <>
                    <a className={`text-sm ${(renderedComponent==="ListLevels")? "text-slate-800 font-bold" : "text-sideBarITemsColor font-medium"}`} onClick={()=>{handleSidebarClick("ListLevels",false)}}>
                    مستويات                           </a>
                    <img src={level} className={`w-6 p-1 rounded-full ${(renderedComponent=="ListLevels") ? "bg-slate-800" : ""}`} />
                    </>
                ): (
                    <>
                    <img src={level} className={`w-6 p-1 rounded-full ${(renderedComponent=="ListLevels") ? "bg-slate-800" : ""}`} />
                    <a className={`text-sm ${(renderedComponent==="ListLevels")? "text-slate-800 font-bold" : "text-sideBarITemsColor font-medium"}`} onClick={()=>{handleSidebarClick("ListLevels",false)}}>
                    {user.lang=="eng" ? 'Levels' : 'Niveaux'}
                    </a>
                    </>
                )}
                </li>

                {/* Classes */}
                <li className={`flex items-center ${user.lang=="عربي" ? "justify-end" : "justify-start"} gap-4 mx-6 cursor-pointer py-3 px-4 rounded-lg hover:bg-slate-300 ${renderedComponent==="ListClasses" ? "bg-slate-300":""}`}>
                {user.lang=="عربي" ? (
                    <>
                    <a className={`text-sm ${(renderedComponent==="ListClasses")? "text-slate-800 font-bold" : "text-sideBarITemsColor font-medium"}`} onClick={()=>{handleSidebarClick("ListClasses")}}>
                        اقسام                        </a>
                    <img src={classIcon} className={`w-6 p-1 rounded-full ${(renderedComponent=="ListClasses") ? "bg-slate-800" : ""}`} />
                    </>
                ): (
                    <>
                    <img src={classIcon} className={`w-6 p-1 rounded-full ${(renderedComponent=="ListClasses") ? "bg-slate-800" : ""}`} />
                    <a className={`text-sm ${(renderedComponent==="ListClasses")? "text-slate-800 font-bold" : "text-sideBarITemsColor font-medium"}`} onClick={()=>{handleSidebarClick("ListClasses")}}>
                        Classes
                    </a>
                    </>
                )}
                </li>

                {/* Subjects */}
                <li className={`flex items-center ${user.lang=="عربي" ? "justify-end" : "justify-start"} gap-4 mx-6 cursor-pointer py-3 px-4 rounded-lg hover:bg-slate-300 ${renderedComponent==="ListSubjects" ? "bg-slate-300":""}`}>
                {user.lang=="عربي" ? (
                    <>
                    <a className={`text-sm ${(renderedComponent==="ListSubjects")? "text-slate-800 font-bold" : "text-sideBarITemsColor font-medium"}`} onClick={()=>{handleSidebarClick("ListSubjects")}}>
                    مواد                           </a>
                    <img src={subject} className={`w-6 p-1 rounded-full ${(renderedComponent=="ListSubjects") ? "bg-slate-800" : ""}`} />
                    </>
                ): (
                    <>
                    <img src={subject} className={`w-6 p-1 rounded-full ${(renderedComponent=="ListSubjects") ? "bg-slate-800" : ""}`} />
                    <a className={`text-sm ${(renderedComponent==="ListSubjects")? "text-slate-800 font-bold" : "text-sideBarITemsColor font-medium"}`} onClick={()=>{handleSidebarClick("ListSubjects")}}>
                    {user.lang=="eng" ? 'Subjects' : 'Matières'}
                    </a>
                    </>
                )}
                </li>

                {/* Posts */}
                <li className={`flex items-center ${user.lang=="عربي" ? "justify-end" : "justify-start"} gap-4 mx-6 cursor-pointer py-3 px-4 rounded-lg hover:bg-slate-300 ${renderedComponent==="ListSchoolPosts" ? "bg-slate-300":""}`}>
                {user.lang=="عربي" ? (
                    <>
                    <a className={`text-sm ${(renderedComponent==="ListSchoolPosts")? "text-slate-800 font-bold" : "text-sideBarITemsColor font-medium"}`} onClick={()=>{handleSidebarClick("ListSchoolPosts")}}>
                    منشورات                           </a>
                    <img src={postsIcon} className={`w-6 p-1 rounded-full ${(renderedComponent=="ListSchoolPosts") ? "bg-slate-800" : ""}`} />
                    </>
                ): (
                    <>
                    <img src={postsIcon} className={`w-6 p-1 rounded-full ${(renderedComponent=="ListSchoolPosts") ? "bg-slate-800" : ""}`} />
                    <a className={`text-sm ${(renderedComponent==="ListSchoolPosts")? "text-slate-800 font-bold" : "text-sideBarITemsColor font-medium"}`} onClick={()=>{handleSidebarClick("ListSchoolPosts")}}>
                    {user.lang=="eng" ? 'Posts' : 'Publications'}
                    </a>
                    </>
                )}
                </li>

            </ul>

        </div>
    )

}

export default SchoolAdminSideBar;
