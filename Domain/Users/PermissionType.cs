namespace Domain.Users;

public enum PermissionType
{
    FullAccess,

    HealthChecks,
    ReadLog,

    CreateNote,
    ReadNote,
    ReadOwnNote,
    UpdateNote,
    UpdateOwnNote,
    DeleteNote,
    DeleteOwnNote,
    RestoreNote,
    RestoreOwnNote,

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
    DeleteUser,
    RestoreUser,
    ResendVerificationEmail,

    ReadUserPermission,
    UpdateUserPermission,
}
