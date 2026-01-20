<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Timetable;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;

class TimetableController extends Controller
{
    /**
     * GET /api/timetables
     */
    public function index(Request $request)
    {
        return Timetable::with([
                'schoolClass',
                'subject',
                'teacher',
                'academicYear',
            ])
            ->when($request->class_id, fn ($q) =>
                $q->where('class_id', $request->class_id)
            )
            ->when($request->teacher_id, fn ($q) =>
                $q->where('teacher_id', $request->teacher_id)
            )
            ->when($request->academic_year_id, fn ($q) =>
                $q->where('academic_year_id', $request->academic_year_id)
            )
            ->when($request->day_of_week, fn ($q) =>
                $q->where('day_of_week', $request->day_of_week)
            )
            ->when($request->date, fn ($q) =>
                $q->where('date', $request->date)
            )
            ->orderBy('start_time')
            ->get();
    }

    /**
     * POST /api/timetables
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'class_id'         => 'required|exists:school_classes,id',
            'subject_id'       => 'nullable|exists:subjects,id',
            'teacher_id'       => 'nullable|exists:teachers,id',
            'academic_year_id' => 'required|exists:academic_years,id',
            'date'             => 'required|date',
            'day_of_week'      => 'required|string',
            'start_time'       => 'required',
            'end_time'         => 'required|after:start_time',
            'room'             => 'nullable|string',
        ]);

        $classClash = Timetable::where('class_id', $data['class_id'])
            ->where('date', $data['date'])
            ->where(function ($q) use ($data) {
                $q->whereBetween('start_time', [$data['start_time'], $data['end_time']])
                  ->orWhereBetween('end_time', [$data['start_time'], $data['end_time']]);
            })
            ->exists();

        if ($classClash) {
            return response()->json(['message' => 'This class already has an activity during this time'], 422);
        }

        if (!empty($data['teacher_id'])) {
            $teacherClash = Timetable::where('teacher_id', $data['teacher_id'])
                ->where('date', $data['date'])
                ->where(function ($q) use ($data) {
                    $q->whereBetween('start_time', [$data['start_time'], $data['end_time']])
                      ->orWhereBetween('end_time', [$data['start_time'], $data['end_time']]);
                })
                ->exists();

            if ($teacherClash) {
                return response()->json(['message' => 'Teacher has a timetable clash at this time'], 422);
            }
        }

        $timetable = Timetable::create($data);

        return response()->json([
            'message' => 'Timetable entry created successfully',
            'timetable' => $timetable,
        ], 201);
    }

    /**
     * PUT /api/timetables/{timetable}
     */
    public function update(Request $request, Timetable $timetable)
    {
        $data = $request->validate([
            'subject_id' => 'nullable|exists:subjects,id',
            'teacher_id' => 'nullable|exists:teachers,id',
            'start_time' => 'required',
            'end_time'   => 'required|after:start_time',
            'room'       => 'nullable|string',
        ]);

        $timetable->update($data);

        return response()->json([
            'message' => 'Timetable updated successfully',
            'timetable' => $timetable,
        ]);
    }

    /**
     * GET /api/timetables/{timetable}
     */
    public function show(Timetable $timetable)
    {
        return $timetable->load([
            'schoolClass',
            'subject',
            'teacher',
            'academicYear',
        ]);
    }

    /**
     * POST /api/timetables/{timetable}/publish
     */
    public function publish(Timetable $timetable)
    {
        $timetable->update(['is_published' => true]);

        return response()->json(['message' => 'Timetable published']);
    }

    /**
     * POST /api/timetables/{timetable}/unpublish
     */
    public function unpublish(Timetable $timetable)
    {
        $timetable->update(['is_published' => false]);

        return response()->json(['message' => 'Timetable unpublished']);
    }

    /**
     * GET /api/timetables/export/{classId}
     */
    public function export($classId)
    {
        $timetables = Timetable::with(['schoolClass', 'subject', 'teacher'])
            ->where('class_id', $classId)
            ->orderBy('day_of_week')
            ->orderBy('start_time')
            ->get();

        $pdf = Pdf::loadView('pdf.timetable', [
            'timetables' => $timetables,
        ]);

        return $pdf->download('timetable.pdf');
    }
}
