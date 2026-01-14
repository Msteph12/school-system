<?php

return [

    /*
    |--------------------------------------------------------------------------
    | School Identity
    |--------------------------------------------------------------------------
    */

    'name' => env('SCHOOL_NAME', 'ST ANTHONY\'S ACADEMY'),

    'logo' => env('SCHOOL_LOGO', public_path('logo.png')),

    /*
    |--------------------------------------------------------------------------
    | Contact Information
    |--------------------------------------------------------------------------
    */

    'address' => env('SCHOOL_ADDRESS', 'PO BOX 12975-00400, NAIROBI, KENYA'),

    'phone' => env('SCHOOL_PHONE', '+254-722894253/+254-720279774'),

    'email' => env('SCHOOL_EMAIL', 'saintanthonysacademy@gmail.com'),

    /*
    |--------------------------------------------------------------------------
    | Footer / Legal
    |--------------------------------------------------------------------------
    */

    'footer_note' => env(
        'SCHOOL_FOOTER_NOTE',
        'This is an official document issued by the school.'
    ),

];
