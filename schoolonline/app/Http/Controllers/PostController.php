<?php

namespace App\Http\Controllers;

use App\Models\File;
use App\Models\Post;
use App\Models\Student;
use App\Models\Teacher;
use Illuminate\Http\Request;

class PostController extends Controller
{
    //
    public function store(Request $request)
    {
        // Valider les données du formulaire (vous pouvez personnaliser les règles de validation)
        $request->validate([
            'recipient' => 'required',
            'post_title' => 'required',
            'post_content' => 'required',
            'file_id' => 'nullable',
            'user_id' => 'required',
            'school_id' => 'required',
        ]);

        $post = new Post();
        $post->recipient = $request->input('recipient');
        $post->post_title = $request->input('post_title');
        $post->post_content = $request->input('post_content');
        if ($request->input('file_id')) {
            $post->file_id = $request->input('file_id');
        }
        $post->user_id = $request->input('user_id');
        $post->school_id = $request->input('school_id');
        $post->save();

        // Rediriger vers la page appropriée (par exemple, la liste des posts)
        return response()->json(['success' => true]);
    }
    public function index()
    {
        $posts = Post::with('file')->get();
        return $posts;
    }


    public function listPosts(Request $request)
    {
        $user = auth()->user();
        $addvalue = $request->input('addvalue');
        $selectedSchoolId = $request->input('school');
        $selectedYear = $request->input('selectedYear');
        $selectedSchoolId2 = $request->input('school_id');
        $selectedDepartment = $request->input('department_id');
        $selectedTeacher = $request->input('teacher_id');

        $posts = [];
        $query = Post::query()->with('file', 'user', 'school');

        $query->where('year_id', $selectedYear);

        if ($addvalue == "authUser") {
            $query->where('user_id', $user->id);
            if ($selectedSchoolId2) {
                $query->whereRaw('JSON_CONTAINS(recipient, ?)', [$selectedSchoolId2]);
            }
            $posts = $query->get();
        } else {
            $query->where('user_id', '!=', $user->id);
            if ($user->user_type == "admin-platform") {
                if ($selectedSchoolId2) {
                    $query->Where('school_id', $selectedSchoolId2);
                }
                $posts = $query->get(); // Execute the query
            } else if ($user->user_type == "admin-ecole") {
                if ($addvalue == "superadmin") {
                    $type = "AllSchools";
                    $posts = Post::where(function ($query) use ($selectedSchoolId, $selectedYear, $type) {
                        $query->where('year_id', $selectedYear)
                            ->whereRaw('JSON_CONTAINS(recipient, JSON_QUOTE(?))', [$type])
                            ->orWhere(function ($query) use ($selectedSchoolId) {
                                $query->whereRaw('JSON_CONTAINS(recipient,?)', [$selectedSchoolId]);
                            });

                    })->whereHas('user', function ($query) {
                        $query->where('user_type', 'admin-platform');
                    })->with('file', 'user', 'school')->get();

                } else if ($addvalue == "department") {
                    if ($selectedDepartment) {
                        $posts = Post::where(function ($query) use ($selectedSchoolId, $selectedYear, $selectedDepartment) {
                            $query->where('year_id', $selectedYear)
                                ->where('school_id', $selectedSchoolId);
                        })->whereHas('user', function ($query) use ($selectedDepartment) {
                            $query->where('user_id', $selectedDepartment);
                        })->whereHas('user', function ($query) {
                            $query->where('user_type', 'admin-finance')
                                ->orWhere('user_type', 'admin-administration');
                        })->with('file', 'user', 'school')->get();
                    } else {
                        $posts = Post::where(function ($query) use ($selectedSchoolId, $selectedYear) {
                            $query->where('year_id', $selectedYear)
                                ->where('school_id', $selectedSchoolId);
                        })->whereHas('user', function ($query) {
                            $query->where('user_type', 'admin-finance')
                                ->orWhere('user_type', 'admin-administration');
                        })->with('file', 'user', 'school')->get();
                    }

                } else if ($addvalue == "teacher") {
                    if ($selectedTeacher) {
                        $posts = Post::where('year_id', $selectedYear)
                            ->where('school_id', $selectedSchoolId)
                            ->where('user_id', $selectedTeacher)
                            ->whereHas('user', function ($query) {
                                $query->where('user_type', 'teacher');
                            })
                            ->with('file', 'user', 'school')
                            ->get();
                    } else {
                        $posts = Post::where(function ($query) use ($selectedSchoolId, $selectedYear, $selectedTeacher) {
                            $query->where('year_id', $selectedYear)
                                ->where('school_id', $selectedSchoolId);
                        })->whereHas('user', function ($query) {
                            $query->where('user_type', 'teacher');
                        })->with('file', 'user', 'school')->get();
                    }
                }
            } else if ($user->user_type == "teacher") {
                if ($addvalue == "school") {
                    $type1 = "all";
                    $type2 = "allTeachers";
                    $posts = Post::where(function ($query) use ($user, $selectedYear, $type1, $selectedSchoolId, $type2, $addvalue) {
                        $query->where('year_id', $selectedYear)
                            ->where('school_id', $selectedSchoolId)
                            ->where(function ($query) use ($addvalue, $type1) {
                                $query->whereRaw('JSON_CONTAINS(recipient, JSON_QUOTE(?))', [$addvalue])
                                    ->whereRaw('JSON_CONTAINS(recipient, JSON_QUOTE(?))', [$type1]);
                            })
                            ->orWhere(function ($query) use ($addvalue, $type2) {
                                $query->whereRaw('JSON_CONTAINS(recipient, JSON_QUOTE(?))', [$addvalue])
                                    ->whereRaw('JSON_CONTAINS(recipient, JSON_QUOTE(?))', [$type2]);
                            })
                            ->orWhere(function ($query) use ($addvalue, $user) {
                                $query->whereRaw('JSON_CONTAINS(recipient, JSON_QUOTE(?))', [$addvalue])
                                    ->whereRaw('JSON_CONTAINS(recipient,?)', [$user->id]);
                            });
                    })->whereHas('user', function ($query) {
                        $query->where('user_type', 'admin-ecole');
                    })->with('file', 'user', 'school')->get();
                }
                if ($addvalue == "administration") {
                    $type1 = "allTeachers";
                    $type2 = "all";
                    $posts = Post::where(function ($query) use ($user, $selectedYear, $selectedSchoolId, $type1, $type2, $addvalue) {
                        $query->where('year_id', $selectedYear)
                            ->where('school_id', $selectedSchoolId)
                            ->where(function ($query) use ($addvalue, $type1) {
                                $query->whereRaw('JSON_CONTAINS(recipient, JSON_QUOTE(?))', [$addvalue])
                                    ->whereRaw('JSON_CONTAINS(recipient, JSON_QUOTE(?))', [$type1]);
                            })
                            ->orWhere(function ($query) use ($addvalue, $type2) {
                                $query->whereRaw('JSON_CONTAINS(recipient, JSON_QUOTE(?))', [$addvalue])
                                    ->whereRaw('JSON_CONTAINS(recipient, JSON_QUOTE(?))', [$type2]);
                            })
                            ->orWhere(function ($query) use ($addvalue, $user) {
                                $query->whereRaw('JSON_CONTAINS(recipient, JSON_QUOTE(?))', [$addvalue])
                                    ->whereRaw('JSON_CONTAINS(recipient,?)', [$user->id]);
                            });
                    })->whereHas('user', function ($query) {
                        $query->where('user_type', 'admin-administration');
                    })->with('file', 'user', 'school')->get();
                }
            } else if ($user->user_type == "admin-administration") {
                if ($addvalue == "school") {
                    $type1 = "all";
                    $type2 = "allDepartments";
                    $type3 = "allLevels";
                    $type4 = "allLevelClasses";
                    $type5 = "student";
                    $type6 = "admin_department";
                    $posts = Post::where(function ($query) use ($user, $selectedYear, $selectedSchoolId, $type1, $type2, $type3, $type4, $type5, $type6, $addvalue) {
                        $query->where('year_id', $selectedYear)
                            ->where('school_id', $selectedSchoolId)
                            ->where(function ($query) use ($addvalue, $type1) {
                                $query->whereRaw('JSON_CONTAINS(recipient, JSON_QUOTE(?))', [$addvalue])
                                    ->whereRaw('JSON_CONTAINS(recipient, JSON_QUOTE(?))', [$type1]);
                            })
                            ->orWhere(function ($query) use ($addvalue, $type2) {
                                $query->whereRaw('JSON_CONTAINS(recipient, JSON_QUOTE(?))', [$addvalue])
                                    ->whereRaw('JSON_CONTAINS(recipient, JSON_QUOTE(?))', [$type2]);
                            })
                            ->orWhere(function ($query) use ($addvalue, $type3) {
                                $query->whereRaw('JSON_CONTAINS(recipient, JSON_QUOTE(?))', [$addvalue])
                                    ->whereRaw('JSON_CONTAINS(recipient, JSON_QUOTE(?))', [$type3]);
                            })
                            ->orWhere(function ($query) use ($addvalue, $type4) {
                                $query->whereRaw('JSON_CONTAINS(recipient, JSON_QUOTE(?))', [$addvalue])
                                    ->whereRaw('JSON_CONTAINS(recipient, JSON_QUOTE(?))', [$type4]);
                            })
                            ->orWhere(function ($query) use ($addvalue, $type5) {
                                $query->whereRaw('JSON_CONTAINS(recipient, JSON_QUOTE(?))', [$addvalue])
                                    ->whereRaw('JSON_CONTAINS(recipient, JSON_QUOTE(?))', [$type5]);
                            })
                            ->orWhere(function ($query) use ($addvalue, $user, $type6) {
                                $query->whereRaw('JSON_CONTAINS(recipient, JSON_QUOTE(?))', [$addvalue])
                                    ->whereRaw('JSON_CONTAINS(recipient, JSON_QUOTE(?))', [$type6])
                                    ->whereRaw('JSON_CONTAINS(recipient,?)', [$user->id]);
                            });
                    })->whereHas('user', function ($query) {
                        $query->where('user_type', 'admin-ecole');
                    })->with('file', 'user', 'school')->get();
                }
                if ($addvalue == "teacher") {
                    if ($selectedTeacher) {
                        $posts = Post::where('year_id', $selectedYear)
                            ->where('school_id', $selectedSchoolId)
                            ->where('user_id', $selectedTeacher)
                            ->whereHas('user', function ($query) {
                                $query->where('user_type', 'teacher');
                            })
                            ->with('file', 'user', 'school')
                            ->get();
                    } else {
                        $posts = Post::where('year_id', $selectedYear)
                            ->where('school_id', $selectedSchoolId)
                            ->whereHas('user', function ($query) {
                                $query->where('user_type', 'teacher');
                            })
                            ->with('file', 'user', 'school')
                            ->get();
                    }

                }
            } else if ($user->user_type == "student") {
                if ($addvalue == "school") {
                    $type1 = "all";
                    $type2 = "allLevels";
                    $type3 = "allLevelClasses";
                    $type4 = "student";
                    $student = Student::where('user_id', auth()->user()->id)->first();
                    // if ($student) {
                    //     // Obtenez la classe à laquelle l'étudiant est affecté
                    //     $class = $student->classe;
                    //     $classId = $class->id;
                    // }
                    // if ($class) {
                    //     $level = $class->level;
                    //     $levelId = $level->id;
                    // }
                    $class = $student->classe;
                    $level = $class->level;
                    $posts = Post::where(function ($query) use ($class, $selectedYear, $selectedSchoolId, $type1, $type2, $type3, $type4, $addvalue, $level) {
                        $query->where('year_id', $selectedYear)
                            ->where('school_id', $selectedSchoolId)
                            ->where(function ($query) use ($addvalue, $type1) {
                                $query->whereRaw('JSON_CONTAINS(recipient, JSON_QUOTE(?))', [$addvalue])
                                    ->whereRaw('JSON_CONTAINS(recipient, JSON_QUOTE(?))', [$type1]);
                            })
                            ->orWhere(function ($query) use ($addvalue, $type2) {
                                $query->whereRaw('JSON_CONTAINS(recipient, JSON_QUOTE(?))', [$addvalue])
                                    ->whereRaw('JSON_CONTAINS(recipient, JSON_QUOTE(?))', [$type2]);
                            })
                            ->orWhere(function ($query) use ($addvalue, $level, $type3) {
                                $query->whereRaw('JSON_CONTAINS(recipient, JSON_QUOTE(?))', [$addvalue])
                                    ->whereRaw('JSON_CONTAINS(recipient, JSON_QUOTE(?))', [$type3])
                                    ->whereRaw('JSON_CONTAINS(recipient, ?)', [$level->id]);

                            })
                            ->orWhere(function ($query) use ($addvalue, $class, $type4) {
                                $query->whereRaw('JSON_CONTAINS(recipient, JSON_QUOTE(?))', [$addvalue])
                                    ->whereRaw('JSON_CONTAINS(recipient,JSON_QUOTE(?))', [$type4])
                                    ->whereRaw('JSON_CONTAINS(recipient,?)', [$class->id]);
                            });
                    })->whereHas('user', function ($query) {
                        $query->where('user_type', 'admin-ecole');
                    })->with('file', 'user', 'school')->get();
                }
                if ($addvalue == "teacher") {
                    $student = Student::where('user_id', auth()->user()->id)->first();
                    if ($student) {
                        // Obtenez la classe à laquelle l'étudiant est affecté
                        $class = $student->classe;

                        if ($class) {
                            // Obtenez les enseignants qui enseignent cette classe
                            $teachers = Teacher::whereHas('classes', function ($query) use ($class) {
                                $query->where('class_id', $class->id);
                            })->get();

                            // Maintenant, $teachers contient la liste des enseignants pour la classe de l'étudiant.
                        }
                        $teacherIds = $teachers->pluck('user_id')->toArray();
                    }
                    if ($selectedTeacher) {
                        $posts = Post::where('year_id', $selectedYear)
                            ->where('school_id', $selectedSchoolId)
                            ->where('user_id', $selectedTeacher)
                            ->whereHas('user', function ($query) {
                                $query->where('user_type', 'teacher');
                            })
                            ->with('file', 'user', 'school')
                            ->get();
                    } else {
                        $posts = Post::where('year_id', $selectedYear)
                            ->where('school_id', $selectedSchoolId)
                            ->whereIn('user_id', $teacherIds)
                            ->with('file', 'user', 'school')
                            ->get();

                    }
                }
                if ($addvalue == "administration") {
                    $type1 = "all";
                    $type2 = "allLevels";
                    $type3 = "allLevelClasses";
                    $type4 = "student";
                    $student = Student::where('user_id', auth()->user()->id)->first();
                    // if ($student) {
                    //     // Obtenez la classe à laquelle l'étudiant est affecté
                    //     $class = $student->classe;
                    //     $classId = $class->id;
                    // }
                    // if ($class) {
                    //     $level = $class->level;
                    //     $levelId = $level->id;
                    // }
                    $class = $student->classe;
                    $level = $class->level;
                    $posts = Post::where(function ($query) use ($class, $selectedYear, $selectedSchoolId, $type1, $type2, $type3, $type4, $addvalue, $level) {
                        $query->where('year_id', $selectedYear)
                            ->where('school_id', $selectedSchoolId)
                            ->where(function ($query) use ($addvalue, $type1) {
                                $query->whereRaw('JSON_CONTAINS(recipient, JSON_QUOTE(?))', [$addvalue])
                                    ->whereRaw('JSON_CONTAINS(recipient, JSON_QUOTE(?))', [$type1]);
                            })
                            ->orWhere(function ($query) use ($addvalue, $type2) {
                                $query->whereRaw('JSON_CONTAINS(recipient, JSON_QUOTE(?))', [$addvalue])
                                    ->whereRaw('JSON_CONTAINS(recipient, JSON_QUOTE(?))', [$type2]);
                            })
                            ->orWhere(function ($query) use ($addvalue, $level, $type3) {
                                $query->whereRaw('JSON_CONTAINS(recipient, JSON_QUOTE(?))', [$addvalue])
                                    ->whereRaw('JSON_CONTAINS(recipient, JSON_QUOTE(?))', [$type3])
                                    ->whereRaw('JSON_CONTAINS(recipient, ?)', [$level->id]);

                            })
                            ->orWhere(function ($query) use ($addvalue, $class, $type4) {
                                $query->whereRaw('JSON_CONTAINS(recipient, JSON_QUOTE(?))', [$addvalue])
                                    ->whereRaw('JSON_CONTAINS(recipient,JSON_QUOTE(?))', [$type4])
                                    ->whereRaw('JSON_CONTAINS(recipient,?)', [$class->id]);
                            });
                    })->whereHas('user', function ($query) {
                        $query->where('user_type', 'admin-administration');
                    })->with('file', 'user', 'school')->get();
                }

            } else if ($user->user_type == 'admin-finance') {
                if ($addvalue == "school") {
                    $type1 = "all";
                    $type2 = "allDepartments";
                    $type3 = "admin_department";
                    $posts = Post::where(function ($query) use ($user, $selectedYear, $selectedSchoolId, $type1, $type2, $type3, $addvalue) {
                        $query->where('year_id', $selectedYear)
                            ->where('school_id', $selectedSchoolId)
                            ->where(function ($query) use ($addvalue, $type1) {
                                $query->whereRaw('JSON_CONTAINS(recipient, JSON_QUOTE(?))', [$addvalue])
                                    ->whereRaw('JSON_CONTAINS(recipient, JSON_QUOTE(?))', [$type1]);
                            })
                            ->orWhere(function ($query) use ($addvalue, $type2) {
                                $query->whereRaw('JSON_CONTAINS(recipient, JSON_QUOTE(?))', [$addvalue])
                                    ->whereRaw('JSON_CONTAINS(recipient, JSON_QUOTE(?))', [$type2]);
                            })

                            ->orWhere(function ($query) use ($addvalue, $user, $type3) {
                                $query->whereRaw('JSON_CONTAINS(recipient, JSON_QUOTE(?))', [$addvalue])
                                    ->whereRaw('JSON_CONTAINS(recipient, JSON_QUOTE(?))', [$type3])
                                    ->whereRaw('JSON_CONTAINS(recipient,?)', [$user->id]);
                            });
                    })->whereHas('user', function ($query) {
                        $query->where('user_type', 'admin-ecole');
                    })->with('file', 'user', 'school')->get();
                }
            }

        }
        return response()->json($posts);

    }


    public function delete($id)
    {
        $post = Post::find($id);

        if (!$post) {
            return response()->json(['message' => 'Post not found'], 404);
        }

        if ($post->id === 1) {
            return response()->json(['message' => 'Cannot delete this post'], 400);
        }

        $post->delete();

        return response()->json(['message' => 'Post deleted successfully']);
    }
    public function getPostCount($userId)
    {
        $postCount = Post::where('user_id', '=', $userId)->count();

        return response()->json(['postCount' => $postCount]);
    }

}