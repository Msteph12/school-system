<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">

    <style>
        body {
            font-family: DejaVu Sans, sans-serif;
            font-size: 11px;
            margin: 0;
            padding: 0;
        }

        .center {
            text-align: center;
        }

        .school-name {
            font-size: 13px;
            font-weight: bold;
        }

        .section {
            margin-top: 8px;
        }

        .divider {
            border-top: 1px dashed #000;
            margin: 8px 0;
        }

        .label {
            font-weight: bold;
        }

        .stamp-box {
            border: 1px dashed #000;
            height: 60px;
            margin-top: 15px;
            text-align: center;
            font-size: 10px;
            padding-top: 20px;
        }

        .footer {
            margin-top: 10px;
            font-size: 10px;
            text-align: center;
        }
    </style>
</head>
<body>

    {{-- School Identity --}}
    <div class="center">
        {{-- School Logo --}}
        <img src="{{ public_path(config('school.logo', 'logo.png')) }}" width="60" alt="School Logo">

        <div class="school-name">
            {{ config('school.name', 'YOUR SCHOOL NAME') }}
        </div>

        <div>
            {{ config('school.address', 'P.O. Box XXX – XXXXX') }}
        </div>

        <div>
            Tel: {{ config('school.phone', '07XXXXXXXX') }}
        </div>

        <div>
            Email: {{ config('school.email', 'info@yourschool.ac.ke') }}
        </div>
    </div>


    <div class="divider"></div>

    <div class="center">
        <strong>OFFICIAL FEE RECEIPT</strong>
    </div>

    <div class="section">
        <span class="label">Receipt No:</span> {{ $payment->receipt_number }}<br>
        <span class="label">Issued At:</span> {{ $payment->receipt_generated_at }}
    </div>

    <div class="divider"></div>

    <div class="section">
        <span class="label">Student:</span>
        {{ $payment->student->first_name }} {{ $payment->student->last_name }}<br>

        <span class="label">Admission No:</span>
        {{ $payment->student->admission_number }}

        <span class="label">Grade:</span>
        {{ $payment->student->grade->name ?? '-' }}<br>

        <span class="label">Class:</span>
        {{ $payment->student->class->name ?? '-' }}
    </div>

    <div class="section">
        <span class="label">Academic Year:</span>
        {{ $payment->academicYear->name }}<br>

        <span class="label">Term:</span>
        {{ $payment->term->name }}
    </div>

    <div class="divider"></div>

    <div class="section">
        <span class="label">Amount Paid:</span>
        KES {{ number_format($payment->amount_paid, 2) }}<br>

        <span class="label">Payment Method:</span>
        {{ ucfirst($payment->payment_method) }}<br>

        <span class="label">Reference:</span>
        {{ $payment->reference ?? '-' }}
    </div>

    <div class="divider"></div>

    {{-- Stamp Area --}}
    <div class="stamp-box">
        OFFICIAL SCHOOL STAMP
    </div>

    <div class="footer">
        This receipt is system-generated and valid only when stamped.<br>
        Issued by <strong>YOUR SCHOOL NAME</strong>
    </div>

</body>
</html>
