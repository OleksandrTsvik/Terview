namespace Domain.Users;

public enum PermissionType
{
    FullAccess,

    ReadLog,

    CreateNote,
    ReadNote,
    UpdateNote,
    UpdateOwnNote,
    DeleteNote,
    RestoreNote,

    ReadNoteImage,
    DeleteNoteImage,
    UploadNoteImage,

    ReadNoteTag,
    UpdateNoteTag,
    DeleteNoteTag,

    ReadOutboxMessage,
    DeleteOutboxMessage,
    RunOutboxMessage,

    ReadJob,
    UpdateJobPeriod,
    RunJob,

    CreateUser,
    ReadUser,
    UpdateUser,
    DeleteUser,
    RestoreUser,
    ResendVerificationEmail,
    ReadPermission,
}
