const HTTP_STATUS_CREATED = 201;
const HTTP_STATUS_BAD_REQUEST = 400;
const HTTP_STATUS_NOT_FOUND = 404;

class NotesHandler {
  constructor(service) {
    this._service = service;

    this.postNoteHandler = this.postNoteHandler.bind(this);
    this.getNotesHandler = this.getNotesHandler.bind(this);
    this.getNoteByIdHandler = this.getNoteByIdHandler.bind(this);
    this.putNoteByIdHandler = this.putNoteByIdHandler.bind(this);
    this.deleteNoteByIdHandler = this.deleteNoteByIdHandler.bind(this);
    this.handleError = this.handleError.bind(this);
  }

  // eslint-disable-next-line class-methods-use-this
  handleError(h, error, statusCode = HTTP_STATUS_BAD_REQUEST) {
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
      response.code(HTTP_STATUS_CREATED);
      return response;
    } catch (error) {
      return this.handleError(h, error, HTTP_STATUS_NOT_FOUND);
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
      return this.handleError(h, error, HTTP_STATUS_NOT_FOUND);
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
      return this.handleError(h, error, HTTP_STATUS_NOT_FOUND);
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
      return this.handleError(h, error, HTTP_STATUS_NOT_FOUND);
    }
  }
}

module.exports = NotesHandler;
