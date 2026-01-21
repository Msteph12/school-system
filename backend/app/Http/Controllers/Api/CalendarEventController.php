<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CalendarEvent;
use Illuminate\Http\Request;

class CalendarEventController extends Controller
{
    /**
     * Admin + Registrar (read-only)
     */
    public function index(Request $request)
    {
        $events = CalendarEvent::query()
            ->when($request->academic_year_id, fn ($q) =>
                $q->where('academic_year_id', $request->academic_year_id)
            )
            ->when($request->term_id, fn ($q) =>
                $q->where('term_id', $request->term_id)
            )
            ->when($request->grade_id, fn ($q) =>
                $q->where('grade_id', $request->grade_id)
            )
            ->when($request->class_id, fn ($q) =>
                $q->where('class_id', $request->class_id)
            )
            ->when($request->event_type, fn ($q) =>
                $q->where('event_type', $request->event_type)
            )
            ->where('is_active', true)
            ->orderBy('start_datetime')
            ->get();

        return response()->json($events);
    }

    /**
     * Admin only
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => 'required|string',
            'description' => 'nullable|string',
            'start_datetime' => 'required|date',
            'end_datetime' => 'required|date|after:start_datetime',
            'event_type' => 'required|string',
            'academic_year_id' => 'required|exists:academic_years,id',
            'term_id' => 'required|exists:terms,id',
            'grade_id' => 'nullable|exists:grades,id',
            'class_id' => 'nullable|exists:school_classes,id',
        ]);


        $event = CalendarEvent::create($data);

        return response()->json($event, 201);
    }

    /**
     * Admin only
     */
    public function update(Request $request, CalendarEvent $calendarEvent)
    {
        $data = $request->validate([
            'title' => 'sometimes|string',
            'description' => 'nullable|string',
            'start_datetime' => 'sometimes|date',
            'end_datetime' => 'sometimes|date|after:start_datetime',
            'event_type' => 'sometimes|string',
            'academic_year_id' => 'sometimes|exists:academic_years,id',
            'term_id' => 'sometimes|exists:terms,id',
            'grade_id' => 'nullable|exists:grades,id',
            'class_id' => 'nullable|exists:school_classes,id',
            'is_active' => 'boolean',
        ]);

        $calendarEvent->update($data);

        return response()->json($calendarEvent);
    }

    /**
     * Admin only
     */
    public function destroy(CalendarEvent $calendarEvent)
    {
        $calendarEvent->delete();

        return response()->json(['message' => 'Event deleted']);
    }

    /**
     * Admin + Registrar
     */
    public function show(CalendarEvent $calendarEvent)
    {
        return response()->json($calendarEvent);
    }
}
