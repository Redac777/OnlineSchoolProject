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
const FinanceDepartmentSideBar = ({user,handleSidebarClick,renderedComponent,school}) => {
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
                    </div>
                    </>
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

                {/* Services */}
                <li className={`flex items-center ${user.lang=="عربي" ? "justify-end" : "justify-start"} gap-4 mx-6 cursor-pointer py-3 px-4 rounded-lg hover:bg-slate-300 ${renderedComponent==="ListServices" ? "bg-slate-300":""}`}>
                {user.lang=="عربي" ? (
                    <>
                    <a className={`text-sm ${(renderedComponent==="ListServices")? "text-slate-800 font-bold" : "text-sideBarITemsColor font-medium"}`} onClick={()=>{handleSidebarClick("ListServices")}}>
                    خدمات                      </a>
                    <img src={classIcon} className={`w-6 p-1 rounded-full ${(renderedComponent=="ListServices") ? "bg-slate-800" : ""}`} />
                    </>
                ): (
                    <>
                    <img src={classIcon} className={`w-6 p-1 rounded-full ${(renderedComponent=="ListServices") ? "bg-slate-800" : ""}`} />
                    <a className={`text-sm ${(renderedComponent==="ListServices")? "text-slate-800 font-bold" : "text-sideBarITemsColor font-medium"}`} onClick={()=>{handleSidebarClick("ListServices")}}>
                    Services
                    </a>
                    </>
                )}
                </li>

                {/* StudentServices */}
                <li className={`flex items-center ${user.lang=="عربي" ? "justify-end" : "justify-start"} gap-4 mx-6 cursor-pointer py-3 px-4 rounded-lg hover:bg-slate-300 ${renderedComponent==="ListStudentsToManage" ? "bg-slate-300":""}`}>
                {user.lang=="عربي" ? (
                    <>
                    <a className={`text-sm ${(renderedComponent==="ListStudentsToManage")? "text-slate-800 font-bold" : "text-sideBarITemsColor font-medium"}`} onClick={()=>{handleSidebarClick("ListStudentsToManage")}}>
                    الخدمات المخصصة                          </a>
                    <img src={postsIcon} className={`w-6 p-1 rounded-full ${(renderedComponent=="ListStudentsToManage") ? "bg-slate-800" : ""}`} />
                    </>
                ): (
                    <>
                    <img src={postsIcon} className={`w-6 p-1 rounded-full ${(renderedComponent=="ListStudentsToManage") ? "bg-slate-800" : ""}`} />
                    <a className={`text-sm ${(renderedComponent==="ListStudentsToManage")? "text-slate-800 font-bold" : "text-sideBarITemsColor font-medium"}`} onClick={()=>{handleSidebarClick("ListStudentsToManage")}}>
                    {user.lang=="eng" ? 'Student & Fees' : 'Frais et paiements'}
                    </a>
                    </>
                )}
                </li>

                {/* Posts */}
                <li className={`flex items-center ${user.lang=="عربي" ? "justify-end" : "justify-start"} gap-4 mx-6 cursor-pointer py-3 px-4 rounded-lg hover:bg-slate-300 ${renderedComponent==="ListFinancePosts" ? "bg-slate-300":""}`}>
                {user.lang=="عربي" ? (
                    <>
                    <a className={`text-sm ${(renderedComponent==="ListFinancePosts")? "text-slate-800 font-bold" : "text-sideBarITemsColor font-medium"}`} onClick={()=>{handleSidebarClick("ListFinancePosts")}}>
                    منشورات                          </a>
                    <img src={postsIcon} className={`w-6 p-1 rounded-full ${(renderedComponent=="ListFinancePosts") ? "bg-slate-800" : ""}`} />
                    </>
                ): (
                    <>
                    <img src={postsIcon} className={`w-6 p-1 rounded-full ${(renderedComponent=="ListFinancePosts") ? "bg-slate-800" : ""}`} />
                    <a className={`text-sm ${(renderedComponent==="ListFinancePosts")? "text-slate-800 font-bold" : "text-sideBarITemsColor font-medium"}`} onClick={()=>{handleSidebarClick("ListFinancePosts")}}>
                    {user.lang=="eng" ? 'Posts' : 'Publications'}
                    </a>
                    </>
                )}
                </li>
            </ul>

        </div>
    )
}

export default FinanceDepartmentSideBar;
