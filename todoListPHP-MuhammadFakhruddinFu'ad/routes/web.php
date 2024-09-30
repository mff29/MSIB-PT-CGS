<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TodolistController;

// Route::get('/', function () {
//     return view('welcome');
// });

// Route::resource('/todolist', App\Http\Controllers\TodolistController::class );
// use Illuminate\Support\Facades\Route;


Route::get('/', [TodolistController::class, 'index'])->name('todolist.index');
Route::post('/todolist', [TodolistController::class, 'store'])->name('todolist.store');
Route::put('/todolist/{id}', [TodolistController::class, 'update'])->name('todolist.update');
Route::delete('/todolist/{id}', [TodolistController::class, 'destroy'])->name('todolist.destroy');
