<?php

namespace App\Http\Controllers;

use App\Http\Requests\ChatRequest;
use App\Http\Requests\UploadImageRequest;
use App\Http\Resources\ChatSessionResource;
use App\Http\Resources\MessageResource;
use App\Models\ChatSession;
use App\Models\Message;
use App\Services\AccidentChatbotService;
use App\Services\LawChatbotService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ChatController extends Controller
{
    public function getSessions(Request $request)
    {
        $trafficSessions = ChatSession::query()->where('user_id', $request->user()->id)
            ->where('chat_type', 'traffic')
            ->orderBy('last_updated', 'desc')
            ->get();

        $accidentSessions = ChatSession::query()->where('user_id', $request->user()->id)
            ->where('chat_type', 'accident')
            ->orderBy('last_updated', 'desc')
            ->get();

        return response()->json([
            'trafficSessions' => ChatSessionResource::collection($trafficSessions),
            'accidentSessions' => ChatSessionResource::collection($accidentSessions),
        ]);
    }

    public function createSession(Request $request)
    {
        $request->validate([
            'chat_type' => ['required', 'in:traffic,accident'],
            'title' => ['required', 'string', 'max:255'],
        ]);

        $chatCount = ChatSession::query()
            ->where('user_id', $request->user()->id)
            ->where('chat_type', $request->chat_type)
            ->count();

        $session = ChatSession::query()->create([
            'user_id' => $request->user()->id,
            'chat_type' => $request->chat_type,
            'title' => $request->title . ' ' . ($chatCount + 1),
            'last_updated' => now(),
        ]);

        return response()->json($session, 201);
    }

    public function getTrafficLawHistory(ChatSession $chatSession)
    {
        $chatSession->load('messages');

        return response()->json([
            'messages' => MessageResource::collection($chatSession->messages),
        ]);
    }

    public function getAccidentHistory(ChatSession $chatSession)
    {
        $chatSession->load('messages');

        return response()->json([
            'messages' => MessageResource::collection($chatSession->messages),
        ]);
    }

    public function sendTrafficLawMessage(ChatRequest $chatRequest)
    {
        $session = ChatSession::query()->where('id', $chatRequest->validated('session_id'))
            ->where('user_id', $chatRequest->user()->id)
            ->firstOrFail();

        $userMessage = $chatRequest->validated('message');

        Message::query()->create([
            'chat_session_id' => $session->id,
            'content' => $userMessage,
            'sender' => 'user',
        ]);

        $session->update([
            'last_message' => $userMessage,
            'last_updated' => now(),
        ]);

        $response = LawChatbotService::getCompletion($userMessage);

        $aiResponse = Message::query()->create([
            'chat_session_id' => $session->id,
            'content' => $response,
            'sender' => 'assistant',
        ]);

        return MessageResource::make($aiResponse);
    }

    public function sendAccidentMessage(ChatRequest $chatRequest)
    {
        $session = ChatSession::query()->where('id', $chatRequest->validated('session_id'))
            ->where('user_id', $chatRequest->user()->id)
            ->firstOrFail();

        $userMessage = $chatRequest->validated('message');

        Message::query()->create([
            'chat_session_id' => $session->id,
            'content' => $userMessage,
            'sender' => 'user',
            'images' => $chatRequest->validated('images')
        ]);

        $session->update([
            'last_message' => $userMessage,
            'last_updated' => now(),
        ]);

        $messages = $session->messages->map(function ($message) {
            if (!empty($message['images'])) {
                $images = $message['images'];
                $collectedImages = collect($images)->map(function ($image) {
                    $imagePath = Str::after($image, '/storage/');
                    $imageContent = Storage::disk('public')->get($imagePath);
                    $imageType = Storage::disk('public')->mimeType($imagePath);

                    return [
                        'type' => 'image_url',
                        'image_url' => [
                            'url' => "data:$imageType;base64," . base64_encode($imageContent),
                        ]
                    ];
                });
                return
                    [
                        'role' => $message['sender'], 'content' => [
                        ['type' => 'text', 'text' => $message['content'] ?? ''],
                        ...$collectedImages
                    ]
                    ];
            } else {
                return [
                    'role' => $message['sender'],
                    'content' => $message['content'],
                ];
            }
        })->toArray();

        $response = AccidentChatbotService::getCompletion($messages);

        $aiResponse = Message::query()->create([
            'chat_session_id' => $session->id,
            'content' => $response,
            'sender' => 'assistant',
        ]);

        return MessageResource::make($aiResponse);
    }

    public function uploadImage(UploadImageRequest $uploadImageRequest)
    {
        $path = $uploadImageRequest->file('image')->store('images', 'public');
        $url = Storage::disk('public')->url($path);

        return response()->json([
            'url' => $url,
            'id' => Str::uuid(),
        ]);
    }
}
