export enum PermissionType {
  FullAccess = 'FullAccess',

  ReadLog = 'ReadLog',

  CreateNote = 'CreateNote',
  ReadNote = 'ReadNote',
  ReadOwnNote = 'ReadOwnNote',
  UpdateNote = 'UpdateNote',
  UpdateOwnNote = 'UpdateOwnNote',
  DeleteNote = 'DeleteNote',
  DeleteOwnNote = 'DeleteOwnNote',
  RestoreNote = 'RestoreNote',
  RestoreOwnNote = 'RestoreOwnNote',

  ReadNoteImage = 'ReadNoteImage',
  DeleteNoteImage = 'DeleteNoteImage',
  UploadNoteImage = 'UploadNoteImage',

  ReadNoteTag = 'ReadNoteTag',
  UpdateNoteTag = 'UpdateNoteTag',
  DeleteNoteTag = 'DeleteNoteTag',

  ReadOutboxMessage = 'ReadOutboxMessage',
  DeleteOutboxMessage = 'DeleteOutboxMessage',
  RunOutboxMessage = 'RunOutboxMessage',

  ReadJob = 'ReadJob',
  UpdateJobPeriod = 'UpdateJobPeriod',
  RunJob = 'RunJob',

  CreateUser = 'CreateUser',
  ReadUser = 'ReadUser',
  DeleteUser = 'DeleteUser',
  RestoreUser = 'RestoreUser',
  ResendVerificationEmail = 'ResendVerificationEmail',

  ReadUserPermission = 'ReadUserPermission',
  UpdateUserPermission = 'UpdateUserPermission',
}
