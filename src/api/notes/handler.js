class NotesHandler {
  constructor(service) {
    this._service = service;
  }

  // eslint-disable-next-line class-methods-use-this
  handleError(h, error, statusCode = 400) {
    const response = h.response({
      status: 'fail',
      message: error.message,
    });
    response.code(statusCode);
    return response;
  }

  postNoteHandler(request, h) {
    try {
      const { title = 'untitled', body, tags } = request.payload;

      const noteId = this._service.addNote({ title, body, tags });

      const response = h.response({
        status: 'success',
        message: 'Catatan berhasil ditambahkan',
        data: {
          noteId,
        },
      });
      response.code(201);
      return response;
    } catch (error) {
      return this.handleError(h, error, 404);
    }
  }

  getNotesHandler() {
    const notes = this._service.getNotes();
    return {
      status: 'success',
      data: {
        notes,
      },
    };
  }

  getNoteByIdHandler(request, h) {
    try {
      const { id } = request.params;

      const note = this._service.getNoteById(id);

      return {
        status: 'success',
        data: {
          note,
        },
      };
    } catch (error) {
      return this.handleError(h, error, 404);
    }
  }

  putNoteByIdHandler(request, h) {
    try {
      const { id } = request.params;

      this._service.editNoteById(id, request.payload);

      return {
        status: 'success',
        message: 'Catatan berhasil diperbarui',
      };
    } catch (error) {
      return this.handleError(h, error, 404);
    }
  }

  deleteNoteByIdHandler(request, h) {
    try {
      const { id } = request.params;
      this._service.deleteNoteById(id);
      return {
        status: 'success',
        message: 'Catatan berhasil dihapus',
      };
    } catch (error) {
      return this.handleError(h, error, 404);
    }
  }
}

module.exports = NotesHandler;
