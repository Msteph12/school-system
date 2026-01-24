<?php

namespace App\Services;

use App\Models\ExamTimetable;
use App\Models\ExamTimetableDay;
use App\Models\ExamTimetableSlot;
use Carbon\Carbon;
use Illuminate\Support\Collection;

class ExamTimetableService
{
    /**
     * Auto-generate exam timetable slots
     */
    public function autoGenerate(
        ExamTimetable $timetable,
        Collection $subjects
    ): void {
        $dates = $this->generateDates(
            $timetable->start_date,
            $timetable->end_date
        );

        $subjectIndex = 0;

        foreach ($dates as $date) {
            if ($subjectIndex >= $subjects->count()) {
                break;
            }

            $day = ExamTimetableDay::create([
                'exam_timetable_id' => $timetable->id,
                'exam_date' => $date->toDateString(),
                'day_name' => $date->format('l'),
            ]);

            for ($slot = 1; $slot <= $timetable->max_papers_per_day; $slot++) {
                if ($subjectIndex >= $subjects->count()) {
                    break;
                }

                ExamTimetableSlot::create([
                    'exam_timetable_day_id' => $day->id,
                    'slot_number' => $slot,
                    'subject_id' => $subjects[$subjectIndex]->id,
                ]);

                $subjectIndex++;
            }
        }
    }

    /**
     * Generate Carbon dates from range
     */
    private function generateDates(string $start, string $end): Collection
    {
        $dates = collect();
        $current = Carbon::parse($start);
        $endDate = Carbon::parse($end);

        while ($current->lte($endDate)) {
            $dates->push($current->copy());
            $current->addDay();
        }

        return $dates;
    }
}
