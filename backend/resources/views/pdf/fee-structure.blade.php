<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Fee Structure</title>
    <style>
        body { font-family: DejaVu Sans, sans-serif; font-size: 12px; }
        .header { text-align: center; margin-bottom: 20px; }
        .header img { height: 70px; }
        .title { font-size: 16px; font-weight: bold; margin-top: 10px; }
        table { width: 100%; border-collapse: collapse; margin-top: 15px; }
        th, td { border: 1px solid #000; padding: 6px; text-align: left; }
        .footer { margin-top: 20px; }
    </style>
</head>
<body>

<div class="header">
    <img src="{{ public_path('logo.png') }}" alt="School Logo">
    <div class="title">SCHOOL FEE STRUCTURE</div>
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
