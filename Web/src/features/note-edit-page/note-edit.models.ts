export interface NoteResponse {
  id: string;
  slug: string;
  title: string;
  content: string;
  tags: string[];
  createdOnUtc: string;
  createdBy: string;
  updatedOnUtc?: string;
  updatedBy?: string;
  deletedOnUtc?: string;
  deletedBy?: string;
}

export interface UpdateNoteRequest {
  noteId?: string;
  slug: string;
  title: string;
  content: string;
  tags?: string[];
}
