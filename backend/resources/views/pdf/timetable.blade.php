<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: DejaVu Sans, sans-serif; font-size: 12px; }
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid #000; padding: 6px; text-align: left; }
        th { background: #f2f2f2; }
    </style>
</head>
<body>

<h3>
    Timetable – {{ optional($timetables->first()?->schoolClass)->name }}
</h3>

<table>
    <thead>
        <tr>
            <th>Day</th>
            <th>Time</th>
            <th>Subject</th>
            <th>Teacher</th>
            <th>Room</th>
        </tr>
    </thead>
    <tbody>
        @foreach ($timetables as $t)
            <tr>
                <td>{{ $t->day_of_week }}</td>
                <td>{{ $t->start_time }} - {{ $t->end_time }}</td>
                <td>{{ optional($t->subject)->name }}</td>
                <td>{{ optional($t->teacher)->name }}</td>
                <td>{{ $t->room }}</td>
            </tr>
        @endforeach
    </tbody>
</table>

</body>
</html>
