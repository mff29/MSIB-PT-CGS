<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Todo List</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
</head>
<body>
    <div class="container mt-5 pb-3 bg-info m-auto rounded">
        <h1 class="text-center">Todo List</h1>
        @if(session('success'))
            <div class="alert alert-success alert-dismissible fade show" role="alert">
                {{ session('success') }}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        @endif

        <!-- Form Tambah Todo -->
        <form action="{{ route('todolist.store') }}" method="POST" class="mb-4">
            @csrf
            <div class="mb-3">
                <label for="title" class="form-label">Judul:</label>
                <input type="text" name="title" id="title" class="form-control" required>
            </div>
            <div class="mb-3">
                <label for="description" class="form-label">Deskripsi:</label>
                <textarea name="description" id="description" class="form-control" required></textarea>
            </div>
            <button type="submit" class="btn btn-success">Tambah</button>
        </form>
        <hr>

        <h2>Daftar Todo</h2>
        <ul class="list-group">
            @forelse($todos as $todo)
                <li class="list-group-item d-flex justify-content-between align-items-center">
                    <div>
                        <strong>{{ $todo['title'] }}</strong> - {{ $todo['description'] }}
                    </div>
                    <div>
                        <button class="btn btn-warning btn-sm edit-btn" data-id="{{ $todo['id'] }}" data-title="{{ $todo['title'] }}" data-description="{{ $todo['description'] }}">Edit</button>
                        <form action="{{ route('todolist.destroy', $todo['id']) }}" method="POST" style="display:inline;">
                            @csrf
                            @method('DELETE')
                            <button class="btn btn-danger btn-sm" onclick="return confirm('Apakah Anda yakin?')">Hapus</button>
                        </form>
                    </div>
                </li>
            @empty
                <li class="list-group-item">Tidak ada todo.</li>
            @endforelse
        </ul>
    </div>

    <!-- Modal Edit Todo -->
    <div class="modal fade" id="editModal" tabindex="-1" aria-labelledby="editModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <form id="editForm" action="#" method="POST">
                    @csrf
                    @method('PUT')
                    <div class="modal-header">
                        <h5 class="modal-title" id="editModalLabel">Edit Todo</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="mb-3">
                            <label for="editTitle" class="form-label">Judul:</label>
                            <input type="text" name="title" id="editTitle" class="form-control" required>
                        </div>
                        <div class="mb-3">
                            <label for="editDescription" class="form-label">Deskripsi:</label>
                            <textarea name="description" id="editDescription" class="form-control" required></textarea>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Tutup</button>
                        <button type="submit" class="btn btn-primary">Simpan Perubahan</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <script>
        $(document).ready(function () {
            $('.edit-btn').on('click', function () {
                const id = $(this).data('id');
                const title = $(this).data('title');
                const description = $(this).data('description');

                $('#editTitle').val(title);
                $('#editDescription').val(description);
                $('#editForm').attr('action', '/todolist/' + id);
                $('#editModal').modal('show');
            });
        });
    </script>
</body>
</html>
