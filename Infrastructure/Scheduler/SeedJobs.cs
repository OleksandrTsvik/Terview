using Infrastructure.Jobs;

namespace Infrastructure.Scheduler;

public static class SeedJobs
{
    public static readonly Job[] Jobs =
        [
            new()
            {
                Type = typeof(DeleteExpiredEmailVerificationTokensJob).FullName!,
                Name = "Delete expired email verification tokens",
                CronExpression = "0 6 * * *",
            },
            new()
            {
                Type = typeof(DeleteExpiredPasswordResetTokensJob).FullName!,
                Name = "Delete expired password reset tokens",
                CronExpression = "0 6 * * *",
            },
            new()
            {
                Type = typeof(DeleteExpiredRefreshTokensJob).FullName!,
                Name = "Delete expired refresh tokens",
                CronExpression = "0 6 * * *",
            },
            new()
            {
                Type = typeof(DeleteLogsJob).FullName!,
                Name = "Delete logs",
                CronExpression = "0 */8 * * *",
            },
            new()
            {
                Type = typeof(DeleteNotesJob).FullName!,
                Name = "Delete notes",
                CronExpression = "0 0 1 * *",
            },
            new()
            {
                Type = typeof(DeleteProcessedOutboxMessagesJob).FullName!,
                Name = "Delete processed outbox messages",
                CronExpression = "0 6 * * *",
            },
            new()
            {
                Type = typeof(DeleteUsersJob).FullName!,
                Name = "Delete users",
                CronExpression = "0 0 1 * *",
            }
        ];
}
