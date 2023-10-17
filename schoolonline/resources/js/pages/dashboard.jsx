import React, { useState, useEffect } from "react";
import axios from "axios";
import Spinner from "../pages/components/reusable/spinner";
import Test from "../pages/test";
import Header from "../pages/components/layout/header";
import Profile from "./features/common/profile";
import SuperAdminSideBar from "./components/layout/sidebars/superAdminSideBar";
import SchoolAdminSideBar from "./components/layout/sidebars/schoolAdminSideBar";
import SuperAdminHome from "./components/layout/homes/superAdminHome";
import ListSchools from "./features/superAdmin/schools/listSchools";
import NewSchool from "./features/superAdmin/schools/newSchool";
import SchoolAdmin from "./features/superAdmin/schools/schoolAdmin";
import SchoolDetails from "./features/superAdmin/schools/schoolDetails";
import NewMail from "./features/common/mails/newMail";
import ListMails from "./features/common/mails/listMails";
import MailDetails from "./features/common/mails/MailDetails";
import NewPack from "./features/superAdmin/packs/newPack";
import ListPacks from "./features/superAdmin/packs/listPacks";
import EditPack from "./features/superAdmin/packs/editPack";
import SchoolProfile from "./features/schoolAdmin/schoolProfile";
import SchoolAdminHome from "./components/layout/homes/schoolAdminHome";
import ListLevels from "./features/schoolAdmin/levels/listLevels";
import NewLevel from "./features/schoolAdmin/levels/newLevel";
import EditLevel from "./features/schoolAdmin/levels/editLevel";
import NewSubject from "./features/schoolAdmin/subjects/newSubject";
import ListSubjects from "./features/schoolAdmin/subjects/listSubjects";
import SubjectDetails from "./features/schoolAdmin/subjects/subjectDetails";
import EditSubject from "./features/schoolAdmin/subjects/editSubject";
import NewClass from "./features/schoolAdmin/classes/newClass";
import ListClasses from "./features/schoolAdmin/classes/listClasses";
import EditClass from "./features/schoolAdmin/classes/editClass";
import NewStudent from "./features/schoolAdmin/students/newStudent";
import ListStudents from "./features/schoolAdmin/students/listStudents";
import StudentDetails from "./features/schoolAdmin/students/studentDetails";
import ListDepartments from "./features/schoolAdmin/departments/listDepartments";
import NewDepartment from "./features/schoolAdmin/departments/newDepartment";
//import EditSubject from "./features/schoolAdmin/subjects/editSubject";
import UpgradeClass from "./features/schoolAdmin/classes/upgradeClass";
import EditDepartment from "./features/schoolAdmin/departments/editDepartment";
import NewPost from "./features/superAdmin/posts/newPost";
import ListPosts from "./features/superAdmin/posts/listPosts";
import NewTeacher from "./features/schoolAdmin/teachers/newTeacher";
import ListTeachers from "./features/schoolAdmin/teachers/listTeachers";
import TeacherClasses from "./features/schoolAdmin/teachers/teacherClasses";
import TeacherSubjects from "./features/schoolAdmin/teachers/teacherSubjects";
import NewSchoolPost from "./features/schoolAdmin/posts/newPostSchoolAdmin";
import ListSchoolPosts from "./features/schoolAdmin/posts/listPostsSchoolAdmin";
import TeacherSideBar from "./components/layout/sidebars/teacherSideBar";
import TeacherHome from "./components/layout/homes/teacherHome";
import ListTeacherPosts from"./features/teacher/posts/listTeacherPosts";
import NewTeacherPost from "./features/teacher/posts/newTeacherPost";
import NewAbsenceReport from "./features/teacher/absenceReports/newAbsenceReport";
import ListAbsenceReports from "./features/teacher/absenceReports/listAbsenceReports";
import AbsenceReportDetails from "./features/teacher/absenceReports/absenceReportDetails";
import ListTeacherAbsenceReports from "./features/AdministrationDepartment/absenceReports/listTeacherAbsenceReports";
import AbsenceReportsValidation from "./features/AdministrationDepartment/absenceReports/absenceReportsValidation";
import AdministrationDepartmentHome from "./components/layout/homes/administrationDepartmentHome";
import AdministrationDepartmentSideBar from "./components/layout/sidebars/administrationDepartmentSideBar";
import NewAdministrationPost from "./features/AdministrationDepartment/posts/newAdministrationPost";
import ListAdministrationPosts from "./features/AdministrationDepartment/posts/listAdministrationPosts";
import FinanceDepartmentSideBar from "./components/layout/sidebars/financeDepartmentSideBar";
import FinanceDepartmentHome from "./components/layout/homes/financeDepartmentHome";
import NewService from "./features/FinanceDepartment/services/newService";
import ListServices from "./features/FinanceDepartment/services/listServices";
import EditService from "./features/FinanceDepartment/services/editService";
import ListStudentsToManage from "./features/FinanceDepartment/students&services/listStudentsToManage";
import ManageStudentFees from "./features/FinanceDepartment/students&services/manageStudentFees";
import StudentPaiements from "./features/FinanceDepartment/paiements/studentPaiements";
import ListTeacherStudents from "./features/teacher/myStudents/listTeacherStudents";
import StudentSideBar from "./components/layout/sidebars/studentsidebar";
import StudentHome from "./components/layout/homes/studentHome";
import ListStudentPosts from "./features/student/posts/listStudentPosts";
import ListFinancePosts from "./features/FinanceDepartment/posts/listFinancePosts";
import NewFinancePost from "./features/FinanceDepartment/posts/newFinancePost";
import ListStudentAbsences from "./features/student/absences/listStudentAbsences";
export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [school,setSchool] = useState(null);
  const [opacity, setOpacity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [unreadMailCount,setUnreadMailCount] = useState(-1);
  const [displayedHome,setDisplayedHome] = useState("");
  const [propValue,setPropValue] = useState(null);
  const [propValue2,setPropValue2] = useState(null);
  const [propValue3,setPropValue3] = useState(null);
  const [selectedYear, setSelectedYear] = useState(-1);
  // Get authenticated user
  //Get authenticated user
  useEffect(() => {
    axios.get('/api/authenticated-user')
      .then(response => {
        setUser(response.data);
        setSchool(response.data.school);
        setSelectedYear(response.data.school.year_id);
        switch (response.data.user_type) {
            case "admin-platform":
                setDisplayedHome("SuperAdminHome");
                break;
            case "admin-ecole":
                setDisplayedHome("SchoolAdminHome");
                break;
            case "teacher":
                setDisplayedHome("TeacherHome");
                break;
            case "admin-administration":
                setDisplayedHome("AdministrationDepartmentHome");
                break;
            case "admin-finance":
                setDisplayedHome("FinanceDepartmentHome");
                break;
            case "student":
                    setDisplayedHome("StudentHome");
                    break;

            default :
                setDisplayedHome("SuperAdminHome");
                break;
        }
      })
      .catch(error => {
        console.error('Error fetching user data:', error);
      });
  }, []);

  useEffect(() => {
    if (displayedHome && user && user.user_type) {
      setSelectedComponent(displayedHome);
    }
  }, [displayedHome, user]);

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  };
  const updateSchool = (updatedSchool) => {
    setSchool(updatedSchool);
  }
  const updateUnreadMailCount = (count) => {
    setUnreadMailCount(count); // Update the unread mail count in the parent component
  };
  const handleActionClick = (componentName,addItem1,addItem2,addItem3) => {
    setLoading(true);
    setOpacity(0.4);
    setTimeout(() => {
      setLoading(false);
      setPropValue(addItem1);
      setPropValue2(addItem2);
      setPropValue3(addItem3);
      setSelectedComponent(componentName === "Home" ? displayedHome : componentName);
      setOpacity(1);
    }, 300);
  };

  const handleYearChange = (selectedOption) => {
    setSelectedYear(selectedOption);
  };
  const componentMap = {
    Test,
    Profile,
    SuperAdminHome,
    ListSchools,
    NewSchool,
    SchoolAdmin,
    SchoolDetails,
    NewMail,
    ListMails,
    MailDetails,
    NewPack,
    ListPacks,
    EditPack,
    SchoolAdminSideBar,
    SchoolProfile,
    SchoolAdminHome,
    ListLevels,
    NewLevel,
    EditLevel,
    ListSubjects,
    NewSubject,
    SubjectDetails,
    EditSubject,
    NewClass,
    ListClasses,
    EditClass,
    NewStudent,
    ListStudents,
    StudentDetails,
    UpgradeClass,
    ListDepartments,
    NewDepartment,
    EditDepartment,
    NewPost,
    ListPosts,
    NewTeacher,
    ListTeachers,
    TeacherClasses,
    TeacherSubjects,
    NewSchoolPost,
    ListSchoolPosts,
    TeacherSideBar,
    TeacherHome,
    ListTeacherPosts,
    NewTeacherPost,
    NewAbsenceReport,
    ListAbsenceReports,
    AbsenceReportDetails,
    ListTeacherAbsenceReports,
    AbsenceReportsValidation,
    AdministrationDepartmentHome,
    AdministrationDepartmentSideBar,
    NewAdministrationPost,
    ListAdministrationPosts,
    FinanceDepartmentSideBar,
    FinanceDepartmentHome,
    NewService,
    ListServices,
    EditService,
    ListStudentsToManage,
    ManageStudentFees,
    StudentPaiements,
    ListTeacherStudents,
    StudentSideBar,
    StudentHome,
    ListStudentPosts,
    ListFinancePosts,
    NewFinancePost,
    ListStudentAbsences,
  };

  const RenderedComponent = selectedComponent ? componentMap[selectedComponent] : null;

    if(!user)
        return null;
  return (
    <div className="m-0 w-full h-screen bg-main-bg flex" style={{ opacity: opacity }}>
      {user.lang!="عربي" ? (
        <>
            <div className="w-1/4 h-screen">
                {user && user.user_type === "admin-platform" && <SuperAdminSideBar user={user} handleSidebarClick={handleActionClick} renderedComponent={selectedComponent}/>}
                {user && user.user_type === "admin-ecole" && <SchoolAdminSideBar user={user} handleSidebarClick={handleActionClick} renderedComponent={selectedComponent} school={school}/>}
                {user && user.user_type === "teacher" && <TeacherSideBar user={user} handleSidebarClick={handleActionClick} renderedComponent={selectedComponent} school={school} />}
                {user && user.user_type === "admin-administration" && <AdministrationDepartmentSideBar user={user} handleSidebarClick={handleActionClick} renderedComponent={selectedComponent} school={school} />}
                {user && user.user_type === "admin-finance" && <FinanceDepartmentSideBar user={user} handleSidebarClick={handleActionClick} renderedComponent={selectedComponent} school={school} />}
                {user && user.user_type === "student" && <StudentSideBar user={user} handleSidebarClick={handleActionClick} renderedComponent={selectedComponent} school={school} />}

            </div>
            <div className="flex flex-col w-full items-center">
                <Header user={user} onHeaderClick={handleActionClick} mailCount={unreadMailCount} onYearChange={handleYearChange} selectedYearDef = {selectedYear} />
                <div className="w-full mt-16">
                    {RenderedComponent && <RenderedComponent user={user} handleMainClick={handleActionClick} updateUser={updateUser} schoolAdmin={propValue} school={propValue}
                    recipient={propValue} mail={propValue} updateLuState={updateUnreadMailCount} receptionValue={propValue} mailUser={propValue2} pack={propValue} schoolToEdit={school}
                    updateSchool={updateSchool} level={propValue} filtre={propValue} subject={propValue} classe={propValue} year={selectedYear} receptionFromListMails={propValue3} student={propValue}
                    department={propValue} teacher={propValue} report={propValue} service={propValue} levelId={propValue2}/>}
                </div>
            </div>
      </>
      ) : (
        <>
             <div className="flex flex-col w-full items-center">
                <Header user={user} onHeaderClick={handleActionClick} mailCount={unreadMailCount} onYearChange={handleYearChange} selectedYearDef = {selectedYear} />
                <div className="w-full mt-16">
                    {RenderedComponent && <RenderedComponent user={user} handleMainClick={handleActionClick} updateUser={updateUser} schoolAdmin={propValue} school={propValue}
                    recipient={propValue} mail={propValue} updateLuState={updateUnreadMailCount} receptionValue={propValue} mailUser={propValue2} pack={propValue} schoolToEdit={school}
                    updateSchool={updateSchool} level={propValue} filtre={propValue} subject={propValue} classe={propValue} year={selectedYear} receptionFromListMails={propValue3} student={propValue}
                    department={propValue} teacher={propValue} report={propValue} service={propValue} levelId={propValue2}/>}
                </div>
            </div>
            <div className="w-1/4 h-screen">
                {user && user.user_type === "admin-platform" && <SuperAdminSideBar user={user} handleSidebarClick={handleActionClick} renderedComponent={selectedComponent}/>}
                {user && user.user_type === "admin-ecole" && <SchoolAdminSideBar user={user} handleSidebarClick={handleActionClick} renderedComponent={selectedComponent} school={school}/>}
                {user && user.user_type === "teacher" && <TeacherSideBar user={user} handleSidebarClick={handleActionClick} renderedComponent={selectedComponent} school={school} />}
                {user && user.user_type === "admin-administration" && <AdministrationDepartmentSideBar user={user} handleSidebarClick={handleActionClick} renderedComponent={selectedComponent} school={school} />}
                {user && user.user_type === "admin-finance" && <FinanceDepartmentSideBar user={user} handleSidebarClick={handleActionClick} renderedComponent={selectedComponent} school={school} />}
                {user && user.user_type === "student" && <StudentSideBar user={user} handleSidebarClick={handleActionClick} renderedComponent={selectedComponent} school={school} />}

            </div>
        </>

      )}
      {loading && <Spinner />}

    </div>
  );
}
