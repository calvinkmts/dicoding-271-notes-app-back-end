const HTTP_STATUS_CREATED = 201;

class NotesHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postNoteHandler = this.postNoteHandler.bind(this);
    this.getNotesHandler = this.getNotesHandler.bind(this);
    this.getNoteByIdHandler = this.getNoteByIdHandler.bind(this);
    this.putNoteByIdHandler = this.putNoteByIdHandler.bind(this);
    this.deleteNoteByIdHandler = this.deleteNoteByIdHandler.bind(this);
    this.handleError = this.handleError.bind(this);
  }

  // eslint-disable-next-line class-methods-use-this
  handleError(h, error) {
    const response = h.response({
      status: 'fail',
      message: error.message,
    });
    response.code(error.statusCode);
    return response;
  }

  postNoteHandler(request, h) {
    try {
      this._validator.validateNotePayload(request.payload);

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
      return this.handleError(h, error);
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
      return this.handleError(h, error);
    }
  }

  putNoteByIdHandler(request, h) {
    try {
      this._validator.validateNotePayload(request.payload);

      const { id } = request.params;

      this._service.editNoteById(id, request.payload);

      return {
        status: 'success',
        message: 'Catatan berhasil diperbarui',
      };
    } catch (error) {
      return this.handleError(h, error);
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
      return this.handleError(h, error);
    }
  }
}

module.exports = NotesHandler;
