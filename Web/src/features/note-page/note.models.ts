export interface NoteResponse {
  id: string;
  slug: string;
  title: string;
  content: string;
  tags: string[];
  createdOnUtc: string;
  updatedOnUtc?: string;
}
