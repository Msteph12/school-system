<?php

namespace App\Http\Controllers\Api; // correct routing here, dont change it

use App\Http\Controllers\Controller;
use App\Models\ExamTimetable;
use App\Models\Subject;
use App\Services\ExamTimetableService;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class ExamTimetableController extends Controller
{
    protected ExamTimetableService $service;

    public function __construct(ExamTimetableService $service)
    {
        $this->service = $service;
    }

    /**
     * Store timetable header (manual creation)
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'academic_year_id'     => 'required|integer',
            'term_id'              => 'required|integer',
            'exam_type_id'         => 'required|integer',
            'grade_id'             => 'required|integer',
            'start_date'           => 'required|date',
            'end_date'             => 'required|date|after_or_equal:start_date',
            'max_papers_per_day'   => 'required|integer|min:1',
        ]);

        $timetable = ExamTimetable::create($data);

        return response()->json($timetable, Response::HTTP_CREATED);
    }

    /**
     * Auto-generate timetable slots
     */
    public function autoGenerate(Request $request)
    {
        $data = $request->validate([
            'timetable_id'  => 'required|exists:exam_timetables,id',
            'subject_ids'   => 'required|array|min:1',
            'subject_ids.*' => 'required|exists:subjects,id',
        ]);

        $timetable = ExamTimetable::findOrFail($data['timetable_id']);
        $subjects  = Subject::whereIn('id', $data['subject_ids'])->get();

        $this->service->autoGenerate($timetable, $subjects);

        return response()->json([
            'message' => 'Timetable auto-generated successfully',
        ], Response::HTTP_OK);
    }

    /**
     * Show full timetable
     */
    public function show($id)
    {
        $timetable = ExamTimetable::with('days.slots.subject')
            ->findOrFail($id);

        return response()->json($timetable, Response::HTTP_OK);
    }

    /**
     * Publish timetable
     */
    public function publish($id)
    {
        $timetable = ExamTimetable::findOrFail($id);
        $timetable->update(['status' => 'published']);

        return response()->json([
            'message' => 'Timetable published',
        ], Response::HTTP_OK);
    }
}
