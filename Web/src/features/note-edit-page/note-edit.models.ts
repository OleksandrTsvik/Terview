export interface NoteResponse {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdOnUtc: Date;
  createdBy: string;
  updatedOnUtc?: Date;
  updatedBy?: string;
  deletedOnUtc?: Date;
  deletedBy?: string;
}

export interface UpdateNoteRequest {
  noteId?: string;
  title: string;
  content: string;
  tags?: string[];
}
