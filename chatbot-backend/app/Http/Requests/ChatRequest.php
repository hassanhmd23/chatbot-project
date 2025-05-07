<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class ChatRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'session_id' => ['required', 'exists:chat_sessions,id'],
            'message' => ['required_without:images', 'nullable', 'string'],
            'images' => ['required_without:message', 'array'],
            'images.*' => ['string'],
        ];
    }
}
