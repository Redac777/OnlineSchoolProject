import { useState } from 'react';
import flecheDroite from '../../../../../../public/images/flecheDroite.png';
import flecheBas from '../../../../../../public/images/flecheBas.png';
import dashboardIcon from '../../../../../../public/images/graphique.png';
import schoolsIcon from '../../../../../../public/images/school.png';
import postsIcon from '../../../../../../public/images/newsfeed.png';
import school from '../../../../../../public/images/schoollogobestqrmbg.png';
const SuperAdminSideBar = ({user,handleSidebarClick,renderedComponent}) => {
    return (
        <div className={`print:hidden bg-main-bg flex flex-col border-dashed ${user.lang=="عربي" ? "border-l" : "border-r"} h-screen`}>
            {/* Dashboard image  */}
            <div className="mt-6 flex items-center justify-center">
                <img src={user.user_type=="admin-platform" ? school  : (user.schoolImg ? user.schoolImg : null)} className="w-28"/>
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
                    <h3 className="font-roboto text-gray-700 font-black">{user.lastName + " " + user.firstName}</h3>
                    </>
                )}
            </div>
            {/* sideBar links */}
            <ul className="mt-6">
                {/* Dashboard */}
                <li className={`flex items-center ${user.lang=="عربي" ? "justify-end" : "justify-start"} gap-4 mx-6 cursor-pointer py-3 px-4 rounded-lg hover:bg-slate-300 ${renderedComponent==="SuperAdminHome" ? "bg-slate-300":""}`}>
                {user.lang=="عربي" ? (
                    <>
                    <a className={`text-sm ${(renderedComponent==="SuperAdminHome")? "text-slate-800 font-bold" : "text-sideBarITemsColor font-medium"}`} onClick={()=>{handleSidebarClick("Home")}}>
                    لوحة القيادة
                    </a>
                    <img src={dashboardIcon} className={`w-6 p-1 rounded-full ${(renderedComponent=="SuperAdminHome") ? "bg-slate-800" : ""}`} />
                    </>
                ): (
                    <>
                    <img src={dashboardIcon} className={`w-6 p-1 rounded-full ${(renderedComponent=="SuperAdminHome") ? "bg-slate-800" : ""}`} />
                    <a className={`text-sm ${(renderedComponent==="SuperAdminHome")? "text-slate-800 font-bold" : "text-sideBarITemsColor font-medium"}`} onClick={()=>{handleSidebarClick("Home")}}>
                        {user.lang=="eng" ? 'Dashboard' : 'Panneau de gestion'}
                    </a>
                    </>
                )}
                </li>
                {/* Schools */}
                <li className={`flex items-center ${user.lang=="عربي" ? "justify-end" : "justify-start"} gap-4 mx-6 cursor-pointer py-3 px-4 rounded-lg hover:bg-slate-300 ${renderedComponent==="ListSchools" ? "bg-slate-300":""}`}>
                {user.lang=="عربي" ? (
                    <>
                    <a className={`text-sm ${(renderedComponent==="ListSchools")? "text-slate-800 font-bold" : "text-sideBarITemsColor font-medium"}`} onClick={()=>{handleSidebarClick("ListSchools")}}>
                        مدارس                    </a>
                    <img src={schoolsIcon} className={`w-6 p-1 rounded-full ${(renderedComponent=="ListSchools") ? "bg-slate-800" : ""}`} />
                    </>
                ): (
                    <>
                    <img src={schoolsIcon} className={`w-6 p-1 rounded-full ${(renderedComponent=="ListSchools") ? "bg-slate-800" : ""}`} />
                    <a className={`text-sm ${(renderedComponent==="ListSchools")? "text-slate-800 font-bold" : "text-sideBarITemsColor font-medium"}`} onClick={()=>{handleSidebarClick("ListSchools")}}>
                    {user.lang=="eng" ? 'Schools' : 'Ecoles'}
                    </a>
                    </>
                )}
                </li>

                {/* Packs */}
                <li className={`flex items-center ${user.lang=="عربي" ? "justify-end" : "justify-start"} gap-4 mx-6 cursor-pointer py-3 px-4 rounded-lg hover:bg-slate-300 ${renderedComponent==="ListPacks" ? "bg-slate-300":""}`}>
                {user.lang=="عربي" ? (
                    <>
                    <a className={`text-sm ${(renderedComponent==="ListPacks")? "text-slate-800 font-bold" : "text-sideBarITemsColor font-medium"}`} onClick={()=>{handleSidebarClick("ListPacks")}}>
                    خطط                           </a>
                    <img src={postsIcon} className={`w-6 p-1 rounded-full ${(renderedComponent=="ListPacks") ? "bg-slate-800" : ""}`} />
                    </>
                ): (
                    <>
                    <img src={postsIcon} className={`w-6 p-1 rounded-full ${(renderedComponent=="ListPacks") ? "bg-slate-800" : ""}`} />
                    <a className={`text-sm ${(renderedComponent==="ListPacks")? "text-slate-800 font-bold" : "text-sideBarITemsColor font-medium"}`} onClick={()=>{handleSidebarClick("ListPacks")}}>
                    {user.lang=="eng" ? 'Packs' : "Plans d'abonnment "}
                    </a>
                    </>
                )}
                </li>

                {/* Posts */}
                <li className={`flex items-center ${user.lang=="عربي" ? "justify-end" : "justify-start"} gap-4 mx-6 cursor-pointer py-3 px-4 rounded-lg hover:bg-slate-300 ${renderedComponent==="ListPosts" ? "bg-slate-300":""}`}>
                {user.lang=="عربي" ? (
                    <>
                    <a className={`text-sm ${(renderedComponent==="ListPosts")? "text-slate-800 font-bold" : "text-sideBarITemsColor font-medium"}`} onClick={()=>{handleSidebarClick("ListPosts")}}>
                        منشورات                      </a>
                    <img src={postsIcon} className={`w-6 p-1 rounded-full ${(renderedComponent=="ListPosts") ? "bg-slate-800" : ""}`} />
                    </>
                ): (
                    <>
                    <img src={postsIcon} className={`w-6 p-1 rounded-full ${(renderedComponent=="ListPosts") ? "bg-slate-800" : ""}`} />
                    <a className={`text-sm ${(renderedComponent==="ListPosts")? "text-slate-800 font-bold" : "text-sideBarITemsColor font-medium"}`} onClick={()=>{handleSidebarClick("ListPosts")}}>
                    {user.lang=="eng" ? 'Posts' : 'Publications'}
                    </a>
                    </>
                )}
                </li>

            </ul>

        </div>
    )

}

export default SuperAdminSideBar;
