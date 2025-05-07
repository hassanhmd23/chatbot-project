<?php

namespace App\Models;

use DateTime;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property int id
 * @property int user_id
 * @property string title
 * @property string chat_type
 * @property string last_message
 * @property DateTime last_updated
 * @property DateTime created_at
 * @property DateTime updated_at
 * @property User user
 * @property Message[] messages
 */
class ChatSession extends Model
{
    protected $fillable = [
        'user_id',
        'title',
        'chat_type',
        'last_message',
        'last_updated',
    ];

    protected $casts = [
        'last_updated' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function messages(): HasMany
    {
        return $this->hasMany(Message::class);
    }
}
