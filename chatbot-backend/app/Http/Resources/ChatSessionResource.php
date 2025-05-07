<?php

namespace App\Http\Resources;

use App\Models\ChatSession;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin ChatSession
 */
class ChatSessionResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'chatType' => $this->chat_type,
            'lastMessage' => $this->last_message,
            'lastUpdated' => $this->last_updated,
        ];
    }
}
