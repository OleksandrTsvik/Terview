using Api.Jobs;

namespace Api.Scheduler;

public static class SeedJobs
{
    public static readonly Job[] Jobs =
        [
            new()
            {
                Type = typeof(DeleteExpiredEmailVerificationTokensJob).FullName!,
                Name = "Delete expired email verification tokens",
                PeriodInSeconds = (long)new TimeSpan(1, 0, 0, 0).TotalSeconds
            },
            new()
            {
                Type = typeof(DeleteExpiredPasswordResetTokensJob).FullName!,
                Name = "Delete expired password reset tokens",
                PeriodInSeconds = (long)new TimeSpan(1, 0, 0, 0).TotalSeconds
            },
            new()
            {
                Type = typeof(DeleteExpiredRefreshTokensJob).FullName!,
                Name = "Delete expired refresh tokens",
                PeriodInSeconds = (long)new TimeSpan(1, 0, 0, 0).TotalSeconds
            },
            new()
            {
                Type = typeof(DeleteLogsJob).FullName!,
                Name = "Delete logs",
                PeriodInSeconds = (long)new TimeSpan(0, 8, 0, 0).TotalSeconds
            },
            new()
            {
                Type = typeof(DeleteNotesJob).FullName!,
                Name = "Delete notes",
                PeriodInSeconds = (long)new TimeSpan(2, 0, 0, 0).TotalSeconds
            },
            new()
            {
                Type = typeof(DeleteProcessedOutboxMessagesJob).FullName!,
                Name = "Delete processed outbox messages",
                PeriodInSeconds = (long)new TimeSpan(1, 0, 0, 0).TotalSeconds
            },
            new()
            {
                Type = typeof(DeleteUsersJob).FullName!,
                Name = "Delete users",
                PeriodInSeconds = (long)new TimeSpan(7, 0, 0, 0).TotalSeconds
            }
        ];
}
