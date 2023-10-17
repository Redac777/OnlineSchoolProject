<?php


use App\Http\Controllers\FileController;
use App\Models\Teacher;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia; // We are going to use this class to render React components
use App\Http\Controllers\UserController;
use App\Http\Controllers\SchoolController;
use App\Http\Controllers\MailingController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\PackController;
use App\Http\Controllers\LevelController;
use App\Http\Controllers\SubjectController;
use App\Http\Controllers\ClassController;
use App\Http\Controllers\YearController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\TeacherController;
use App\Http\Controllers\AbsenceReportController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\StudentPaiementController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', function () {
    return Inertia::render('login/login');
});
Route::post('/api/login', [UserController::class, 'authenticate']);
Route::middleware('auth')->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('dashboard'); // Assuming your component is named dashboard.jsx
    });
    Route::get('/logout', [UserController::class, 'logout']);
    Route::get('/list-years', [YearController::class, 'listYears']);
    Route::get('/api/authenticated-user', [UserController::class, 'getAuthenticatedUser']);
    Route::put('/update-profile/{id}', [UserController::class, 'updateProfile']);
    Route::put('/update-school-profile/{id}', [SchoolController::class, 'updateSchoolProfile']);
    Route::get('/listSchools', [SchoolController::class, 'index']);
    Route::put('/deactivateSchoolUsers/{schoolId}', [UserController::class, 'deactivateSchoolUsers']);
    Route::put('/activateSchoolUsers/{schoolId}', [UserController::class, 'activateSchoolUsers']);
    Route::put('/activateUser/{user}', [UserController::class, 'activateUser']);
    Route::post('/createSchool', [SchoolController::class, 'createSchool']);
    Route::post('/createMailing', [MailingController::class, 'createMailing']);
    Route::get('/mailsSender', [MailingController::class, 'getSenderMessages'])->name('mails.getSenderMessages');
    Route::get('/mails', [MailingController::class, 'index'])->name('mails.index');
    Route::put('/messages/{id}/mark-as-read', [MailingController::class, 'markMessageAsRead']);
    Route::post('/api/posts', [PostController::class, 'store'])->name('posts.store');
    Route::get('/posts', [PostController::class, 'index'])->name('posts.index');
    Route::get('/getSchoolCount', [SchoolController::class, 'getSchoolCount']);
    Route::get('/packs', [PackController::class, 'getAllPacks']);
    Route::post('/create-pack', [PackController::class, 'createPack']);
    Route::delete('/deletedPack/{id}', [PackController::class, 'deletePack']);
    Route::get('/getPackCount', [PackController::class, 'getPackCount']);
    Route::put('/update-pack/{id}', [PackController::class, 'updatePack']);
    Route::get('/listLevels', [LevelController::class, 'index']);
    Route::delete('/deletedLevel/{id}', [LevelController::class, 'deleteLevel']);
    Route::post('/create-level', [LevelController::class, 'createLevel']);
    Route::put('/update-level/{id}', [LevelController::class, 'updateLevel']);
    Route::get('/listSubjects', [SubjectController::class, 'listSubjects'])->name('listSubjects');
    Route::post('/create-subject', [SubjectController::class, 'createSubject']);
    Route::delete('/subject/{subjectId}/detach-level/{levelId}', [SubjectController::class, 'detachLevelFromSubject']);
    Route::delete('/deletedSubject/{id}', [SubjectController::class, 'deleteSubject']);
    Route::post('/update-subject-coefficients/{subject}', [SubjectController::class, 'updateSubjectCoefficients']);
    Route::put('/update-subject/{id}', [SubjectController::class, 'updateSubject']);
    Route::post('/create-class', [ClassController::class, 'createClass']);
    Route::get('/listClasses', [ClassController::class, 'listClasses'])->name('listClasses');
    Route::delete('/deletedClass/{id}', [ClassController::class, 'deleteClass']);
    Route::put('/update-class/{id}', [ClassController::class, 'updateClass']);
    Route::get('/getUserByCode/{email}', [UserController::class, 'getUserByCode']);
    Route::post('/create-studentwithparent', [StudentController::class, 'createStudent']);
    Route::get('/listStudents', [StudentController::class, 'listStudents'])->name('listStudents');
    Route::delete('/deletedStudent/{id}', [StudentController::class, 'deleteStudent']);
    Route::delete('/deletedUser/{id}/{id2}/{id3}', [UserController::class, 'deleteUser']);
    Route::post('/update-year', [YearController::class, 'updateYear']);
    Route::post('/upgrade-students', [StudentController::class, 'upgradeStudents']);
    Route::get('/listDepartments', [DepartmentController::class, 'listDepartments']);
    Route::post('/create-department', [DepartmentController::class, 'createDepartment']);
    Route::delete('/deletedDepartment/{id}', [DepartmentController::class, 'deleteDepartment']);
    Route::put('/update-department/{id}', [DepartmentController::class, 'update']);
    Route::post('/upload-image', [FileController::class, 'upload']);
    Route::get('/listPosts', [PostController::class, 'listPosts']);
    Route::get('/get-post-count/{userId}', [PostController::class, 'getPostCount']);
    Route::post('/create-teacher', [TeacherController::class, 'store']);
    Route::get('/listTeachers', [TeacherController::class, 'listTeachers']);
    Route::delete('/teacher/{teacher_id}/detach-classe/{class_id}', [TeacherController::class, 'detachClassFromTeacher']);
    Route::delete('/teacher/{teacher_id}/detach-subject/{subject_id}', [TeacherController::class, 'detachSubjectFromTeacher']);
    Route::delete('/deletedTeacher/{id}', [TeacherController::class, 'deleteTeacher']);
    Route::get('/teacher/{teacherId}/classes-not-associated', [TeacherController::class, 'getClassesNotAssociatedWithTeacher']);
    Route::post('/teacher/{teacherId}/attach-class/{classId}', [TeacherController::class, 'attachClassToTeacher']);
    Route::get('/teacher/{teacherId}/subjects-not-associated', [TeacherController::class, 'getSubjectsNotAssociatedWithTeacher']);
    Route::post('/teacher/{teacherId}/attach-subject/{subjectId}', [TeacherController::class, 'attachSubjectToTeacher']);
    Route::post('/create-absence-report', [AbsenceReportController::class, 'createAbsenceReport']);
    Route::get('/listTeacherAbsenceReports', [AbsenceReportController::class, 'listTeacherAbsenceReports']);
    Route::get('/listSchoolAbsenceReports', [AbsenceReportController::class, 'listSchoolAbsenceReports']);
    Route::post('/updateValidation', [AbsenceReportController::class, 'updateValidation']);
    Route::post('/create-service', [ServiceController::class, 'createService']);
    Route::get('/listServices', [ServiceController::class, 'index']);
    Route::delete('/deletedService/{id}', [ServiceController::class, 'delete']);
    Route::put('/update-service/{id}', [ServiceController::class, 'update']);
    Route::get('/teacherLevels', [TeacherController::class, 'getTeacherLevels']);
    Route::get('/teacherClasses', [TeacherController::class, 'getTeacherClasses']);
    Route::put('/updateServicePrices/{serviceId}', [ServiceController::class, 'updateServicePrices']);
    Route::get('/api/services', [ServiceController::class, 'getServicesByLevel']);
    Route::get('/api/studentServices', [ServiceController::class, 'getStudentServices']);
    Route::delete('/api/detachService', [ServiceController::class, 'detachService']);
    Route::post('/api/attachServices/{studentId}', [ServiceController::class, 'attachServices']);
    Route::get('/availableServices/{levelId}/{studentId}', [ServiceController::class, 'getAvailableServices']);
    Route::post('/api/student-paiements', [StudentPaiementController::class, 'store']);
    Route::get('/student-payments/{studentId}/details', [StudentPaiementController::class, 'getPaymentDetailsForStudent']);
    Route::get('/studentTeachers', [StudentController::class, 'getStudentTeachers']);
    Route::get('/studentLevelAndClass', [StudentController::class, 'getStudentLevelAndClass']);
    Route::delete('/deletedPost/{id}', [PostController::class, 'delete']);
    Route::get('/studentAbsenceDetails', [AbsenceReportController::class, 'getStudentAbsences']);
    Route::get('/getAuthenticatedStudent', [StudentController::class, 'getAuthenticatedStudent']);
    Route::get('/getStudentCount', [StudentController::class, 'getStudentCount']);
    Route::get('/getTeacherCount', [TeacherController::class, 'getTeacherCount']);
    Route::get('/getDepartmentCount', [DepartmentController::class, 'getDepartmentCount']);
    Route::get('/getServiceCount', [ServiceController::class, 'getServiceCount']);


});
// Route to fetch authenticated user's data