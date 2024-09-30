<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class TodolistController extends Controller
{
    public function index()
    {
        $todos = session()->get('todos', []);
        return view('todolist.index', compact('todos'));
    }

    public function store(Request $request)
    {
        $todos = session()->get('todos', []);
        $id = count($todos) + 1;
        $todos[] = [
            'id' => $id,
            'title' => $request->input('title'),
            'description' => $request->input('description'),
        ];
        session()->put('todos', $todos);
        return redirect()->route('todolist.index')->with('success', 'Todo berhasil ditambahkan');
    }

    public function update(Request $request, $id)
    {
        $todos = session()->get('todos', []);
        foreach ($todos as &$todo) {
            if ($todo['id'] == $id) {
                $todo['title'] = $request->input('title');
                $todo['description'] = $request->input('description');
                break;
            }
        }
        session()->put('todos', $todos);
        return redirect()->route('todolist.index')->with('success', 'Todo berhasil diperbarui');
    }

    public function destroy($id)
    {
        $todos = session()->get('todos', []);
        foreach ($todos as $key => $todo) {
            if ($todo['id'] == $id) {
                unset($todos[$key]);
                break;
            }
        }
        session()->put('todos', array_values($todos));
        return redirect()->route('todolist.index')->with('success', 'Todo berhasil dihapus');
    }
}
