<?php

namespace App\Models;

use DateTime;
use Illuminate\Database\Eloquent\Model;
use Pgvector\Laravel\HasNeighbors;
use Pgvector\Laravel\Vector;

/**
 * @property int id
 * @property string original_content
 * @property int section_number
 * @property Vector embedding_1536
 * @property string summary
 * @property string content
 * @property int sort_order
 * @property string guid
 * @property DateTime created_at
 * @property DateTime updated_at
 */
class Chunk extends Model
{
    use HasNeighbors;

    protected $fillable = [
        'original_content',
        'section_number',
        'embedding_1536',
        'summary',
        'content',
        'sort_order',
        'guid',
    ];

    protected $casts = [
        'embedding_1536' => Vector::class,
    ];
}
