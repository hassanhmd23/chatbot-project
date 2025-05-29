<?php

namespace App\Console\Commands;

use App\Models\Chunk;
use App\Services\ChunkTextService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use OpenAI\Laravel\Facades\OpenAI;

class ChunkData extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:chunk-data';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command that Will Chunk Data';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $text = Storage::get('lebanese-traffic-Law.md');

        $page_number = 1;
        $chunked_chunks = ChunkTextService::handle($text);

        $this->info("Chunking data and inserting them...");

        foreach ($chunked_chunks as $chunkSection => $chunkContent) {

            try {
                $guid = md5($chunkContent);
                $chunk = Chunk::query()->updateOrCreate(
                    [
                        'guid' => $guid,
                    ],
                    [
                        'section_number' => $chunkSection,
                        'content' => $chunkContent,
                        'sort_order' => $page_number,
                    ]
                );

                $results = OpenAI::embeddings()->create([
                    'model' => 'text-embedding-3-small',
                    'input' => $chunkContent,
                    'encoding_format' => 'float',
                ]);

                $chunk->update([
                    'embedding_1536' => $results->embeddings[0]->embedding,
                ]);


            } catch (\Exception $e) {
                Log::error('Error parsing Text', ['error' => $e->getMessage()]);
            }
        }
        $this->info("Data has been chunked and inserted to the database");
    }
}
