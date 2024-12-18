export interface NoteResponse {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: Date;
  createdBy: string;
  updatedAt?: Date;
  updatedBy?: string;
  deletedAt?: Date;
  deletedBy?: string;
}

export interface UpdateNoteRequest {
  noteId?: string;
  title: string;
  content: string;
  tags?: string[];
}
