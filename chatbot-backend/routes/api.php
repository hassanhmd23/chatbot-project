<?php

use App\Http\Controllers\ChatController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::group(['prefix' => 'auth', 'controller' => UserController::class], function () {
    Route::post('/register', [UserController::class, 'register']);
    Route::post('/login', [UserController::class, 'login']);
    Route::post('/logout', [UserController::class, 'logout'])->middleware('auth:sanctum');
});
Route::group(['middleware' => ['auth:sanctum']], function () {

    Route::group(['prefix' => 'chat', 'controller' => ChatController::class], function () {
        Route::get('/sessions', 'getSessions');
        Route::post('/sessions', 'createSession');

        Route::get('traffic-law/history/{chatSession}', 'getTrafficLawHistory');
        Route::get('accident/history/{chatSession}', 'getAccidentHistory');

        Route::post('traffic-law/message', 'sendTrafficLawMessage');
        Route::post('accident/message', 'sendAccidentMessage');

        Route::post('upload/image', 'uploadImage');
    });

    Route::get('user', [UserController::class, 'getUser']);

});


