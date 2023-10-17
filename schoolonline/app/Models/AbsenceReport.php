<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AbsenceReport extends Model
{
    protected $table = 'absence_reports';

    protected $fillable = [
        'teacher_id',
        'class_id',
        'school_id',
        'year_id',
    ];

    public function teacher()
    {
        return $this->belongsTo(Teacher::class, 'teacher_id');
    }

    public function class ()
    {
        return $this->belongsTo(Classe::class, 'class_id');
    }

    public function school()
    {
        return $this->belongsTo(School::class, 'school_id');
    }

    public function year()
    {
        return $this->belongsTo(Year::class, 'year_id');
    }

    public function details()
    {
        return $this->hasMany(AbsenceReportDetail::class, 'report_id');
    }
}