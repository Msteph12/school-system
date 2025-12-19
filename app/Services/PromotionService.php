<?php

namespace App\Services;

use App\Models\AcademicYear;
use App\Models\ClassStudent;
use App\Models\SchoolClass;
use Illuminate\Support\Facades\DB;

class PromotionService
{
    public function promoteStudents(
        int $fromAcademicYearId,
        int $toAcademicYearId
    ) {
         $fromYear = AcademicYear::findOrFail($fromAcademicYearId);
        $toYear   = AcademicYear::findOrFail($toAcademicYearId);

        // 🔒 Lock enforcement
        if ($fromYear->isLocked()) {
            throw new \Exception('Cannot promote students from a locked academic year.');
        }

        if ($toYear->isLocked()) {
            throw new \Exception('Cannot promote students into a locked academic year.');
        }

        DB::transaction(function () use ($fromAcademicYearId, $toAcademicYearId, $fromYear) {

            // 1. Get all active enrollments for the current year
            $enrollments = ClassStudent::where('academic_year_id', $fromAcademicYearId)
                ->where('status', 'active')
                ->get();

            foreach ($enrollments as $enrollment) {

                $student = $enrollment->student;
                $currentClass = $enrollment->schoolClass;
                $currentGrade = $currentClass->grade;

                // 2. Decide promotion outcome
                $decision = $this->getPromotionDecision($student);

                if ($decision === 'withdrawn') {
                    $enrollment->update(['status' => 'withdrawn']);
                    continue;
                }

                // 3. Determine next grade
                $nextGradeId = $decision === 'repeat'
                    ? $currentGrade->id
                    : $this->getNextGradeId($currentGrade);

                if (!$nextGradeId) {
                    // Final grade completed
                    $enrollment->update(['status' => 'graduated']);
                    continue;
                }

                // 4. Find available class in target grade
                $nextClass = $this->findAvailableClass($nextGradeId, $toAcademicYearId);

                if (!$nextClass) {
                    throw new \Exception('No available class for grade ID: ' . $nextGradeId);
                }

                // 5. Create new enrollment
                ClassStudent::create([
                    'student_id'        => $student->id,
                    'class_id'          => $nextClass->id,
                    'academic_year_id'  => $toAcademicYearId,
                    'status'            => $decision === 'repeat' ? 'repeated' : 'active',
                ]);

                // 6. Close previous enrollment
                $enrollment->update(['status' => 'promoted']);
            }

            // 🔐 Lock the old academic year AFTER successful promotion
            $fromYear->update(['status' => 'locked']);
        });
    }

    private function getPromotionDecision($student)
    {
        // Placeholder logic
        // Later this comes from admin UI

        return 'promote'; // promote | repeat | withdrawn
    }
    private function getNextGradeId($grade)
    {
        return $grade->next_grade_id ?? null;
    }
    private function findAvailableClass($gradeId, $academicYearId)
{
    return SchoolClass::where('grade_id', $gradeId)
        ->get()
        ->first(function ($class) use ($academicYearId) {

            $currentCount = $class->classStudents()
                ->where('academic_year_id', $academicYearId)
                ->count();

            return $currentCount < $class->capacity;
        });
}

}
