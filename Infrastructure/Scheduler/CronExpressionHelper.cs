using Cronos;

namespace Infrastructure.Scheduler;

public static class CronExpressionHelper
{
    public static DateTime? GetNextOccurrence(string expression)
    {
        if (string.IsNullOrWhiteSpace(expression))
        {
            return null;
        }

        if (!CronExpression.TryParse(expression, out CronExpression? cronExpression))
        {
            return null;
        }

        return cronExpression.GetNextOccurrence(DateTime.UtcNow);
    }

    public static DateTime GetNextOccurrence(string expression, DateTime defaultValue)
    {
        return GetNextOccurrence(expression) ?? defaultValue;
    }

    public static bool IsValidCronExpression(string expression)
    {
        if (string.IsNullOrWhiteSpace(expression))
        {
            return false;
        }

        return CronExpression.TryParse(expression, out CronExpression _);
    }
}
