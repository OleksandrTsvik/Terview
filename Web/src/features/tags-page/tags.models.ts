import { PagingParams } from '@/common/pagination.models';

export interface TagsState {
  selectedUpdateTag?: string;
}

export interface GetNotesTagsEditRequest extends PagingParams {
  query?: string | null;
}

export interface UpdateNotesTagRequest {
  currentTag: string;
  newTag: string;
}
