<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Teacher;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TeacherController extends Controller
{
    // GET /api/teachers
    public function index()
    {
        return Teacher::orderBy('last_name')->get();
    }

    // POST /api/teachers
    public function store(Request $request)
    {
        if (!in_array(Auth::user()->role->name, ['admin', 'registrar'])) {
        return response()->json(['message' => 'Unauthorized'], 403);
    }

        $validated = $request->validate([
            'user_id' => 'nullable|exists:users,id',
            'staff_number' => 'required|string|unique:teachers,staff_number',
            'first_name' => 'required|string',
            'last_name' => 'required|string',
            'phone' => 'nullable|string',
            'email' => 'nullable|email|unique:teachers,email',
            'department' => 'nullable|string',
            'status' => 'required|in:active,inactive,on_leave', // active, inactive, on_leave
        ]);

        return Teacher::create($validated);
    }

    // GET /api/teachers/{id}
    public function show($id)
    {
        return Teacher::findOrFail($id);
    }

    // PUT /api/teachers/{id}
    public function update(Request $request, $id)
    {
        if (!in_array(Auth::user()->role->name, ['admin', 'registrar'])) {
        return response()->json(['message' => 'Unauthorized'], 403);
    }

        $teacher = Teacher::findOrFail($id);

        $validated = $request->validate([
            'user_id' => 'nullable|exists:users,id',
            'staff_number' => 'string|unique:teachers,staff_number,' . $teacher->id,
            'first_name' => 'string',
            'last_name' => 'string',
            'phone' => 'nullable|string',
            'email' => 'nullable|email|unique:teachers,email,' . $teacher->id,
            'department' => 'nullable|string',
            'status' =>  'nullable|in:active,inactive,on_leave',
        ]);

        $teacher->update($validated);

        return $teacher;
    }

    // DELETE /api/teachers/{id}
    public function destroy($id)
    {
        if (Auth::user()->role->name !== 'admin') {
        return response()->json(['message' => 'Unauthorized'], 403);
    }
    
        $teacher = Teacher::findOrFail($id);

        $teacher->update([
            'status' => 'inactive'
        ]);

        return response()->json([
            'message' => 'Teacher deactivated'
        ]);
    }
}
