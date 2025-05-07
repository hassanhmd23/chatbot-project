<?php

namespace App\Models;

use DateTime;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int id
 * @property int chat_session_id
 * @property string content
 * @property string sender
 * @property array images
 * @property DateTime created_at
 * @property DateTime updated_at
 *
 * @property ChatSession chatSession
 */
class Message extends Model
{
    protected $fillable = [
        'chat_session_id',
        'content',
        'sender',
        'images'
    ];

    protected $casts = [
        'images' => 'array',
        'created_at' => 'datetime',
    ];

    public function chatSession(): BelongsTo
    {
        return $this->belongsTo(ChatSession::class);
    }
}
