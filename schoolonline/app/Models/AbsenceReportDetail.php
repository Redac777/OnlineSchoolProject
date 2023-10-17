<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AbsenceReportDetail extends Model
{
    protected $table = 'absence_report_details';

    protected $fillable = [
        'report_id',
        'student_id',
        'attendance',
        'remark',
        'validated',
    ];

    public function report()
    {
        return $this->belongsTo(AbsenceReport::class, 'report_id');
    }

    public function student()
    {
        return $this->belongsTo(Student::class, 'student_id');
    }
}