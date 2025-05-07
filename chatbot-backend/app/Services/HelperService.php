<?php

namespace App\Services;

class HelperService
{
    public static function remove_ascii($string): string
    {
        return str_replace("\u2019", ' ', preg_replace('/[^\x00-\x7F]+/', '', $string));
    }
}
