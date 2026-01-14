<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Fee Structure</title>

    <style>
        body {
            font-family: DejaVu Sans, sans-serif;
            font-size: 12px;
            line-height: 1.4;
        }

        .header {
            text-align: center;
            margin-bottom: 20px;
        }

        .header img {
            height: 80px;
            margin-bottom: 10px;
        }

        .school-name {
            font-size: 18px;
            font-weight: bold;
            text-transform: uppercase;
        }

        .school-contact {
            font-size: 11px;
            margin-top: 4px;
        }

        .document-title {
            margin-top: 15px;
            font-size: 16px;
            font-weight: bold;
            text-decoration: underline;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
        }

        th, td {
            border: 1px solid #000;
            padding: 6px;
            text-align: left;
        }

        th {
            background-color: #f2f2f2;
        }

        .footer {
            margin-top: 25px;
            font-size: 11px;
        }
    </style>
</head>
<body>

<div class="header">
    <!-- School Logo -->
    <img src="{{ public_path(config('school.logo', 'logo.png')) }}" alt="School Logo">

    <!-- School Identity -->
    <div class="school-name">
        {{ config('school.name', 'SAMPLE SCHOOL NAME') }}
    </div>

    <div class="school-contact">
        {{ config('school.address', 'P.O. Box XXX, City') }} |
        {{ config('school.phone', '+254 7XX XXX XXX') }} |
        {{ config('school.email', 'info@school.ac.ke') }}
    </div>

    <div class="document-title">
        SCHOOL FEE STRUCTURE
    </div>
</div>


<p>
    <strong>Grade:</strong> {{ $fee->grade->name }} <br>
    <strong>Term:</strong> {{ $fee->term->name }} <br>
    <strong>Academic Year:</strong> {{ $fee->academicYear->name }}
</p>

<table>
    <thead>
        <tr>
            <th>Fee Item</th>
            <th>Amount (KES)</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Tuition (Mandatory)</td>
            <td>{{ number_format($fee->mandatory_amount, 2) }}</td>
        </tr>

        @foreach ($fee->optional_fees ?? [] as $opt)
            <tr>
                <td>{{ $opt['name'] }}</td>
                <td>{{ number_format($opt['amount'], 2) }}</td>
            </tr>
        @endforeach
    </tbody>
</table>

<div class="footer">
    <p><strong>Payment Details</strong></p>
    <p>
        Bank: {{ $fee->payment_details['bankName'] ?? '-' }} <br>
        Account Name: {{ $fee->payment_details['accountName'] ?? '-' }} <br>
        Account Number: {{ $fee->payment_details['accountNumber'] ?? '-' }}
    </p>

    <p><strong>Remarks</strong></p>
    <p>{{ $fee->remarks ?? '—' }}</p>
</div>

</body>
</html>
