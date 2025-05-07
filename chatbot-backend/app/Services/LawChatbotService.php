<?php

namespace App\Services;

use OpenAI\Laravel\Facades\OpenAI;

class LawChatbotService
{
    public static function getCompletion(string $message)
    {
        $embedding = OpenAI::embeddings()->create([
            'model' => 'text-embedding-3-small',
            'input' => $message,
            'encoding_format' => 'float',
        ]);

        $results = new DistanceQuery()->cosineDistance($embedding->embeddings[0]->embedding);

        $content = [];

        foreach ($results as $result) {
            $content[] = HelperService::remove_ascii($result->content);
        }

        $context = implode(" ", $content);

        $results = OpenAI::chat()->create([
            'model' => 'gpt-4o',
            'messages' => [
                ["role" => "system", "content" => 'You are a helpful legal assistant specialized in the Lebanese Traffic Law. Always answer questions based only on the provided context. If the answer cannot be found in the context, say: "I could not find the answer to your question in the Lebanese Traffic Law."'],
                ['role' => 'user', 'content' => "Answer the following question based on the context:\n\nContext:\n$context\n\nQuestion:\n$message"]
            ],
        ]);

        return $results->choices[0]->message->content;
    }
}
