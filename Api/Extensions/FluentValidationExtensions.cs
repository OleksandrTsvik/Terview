using FluentValidation;

namespace Api.Extensions;

public static class FluentValidationExtensions
{
    public static IRuleBuilderOptions<T, string?> TrimWhitespace<T>(
        this IRuleBuilder<T, string?> ruleBuilder,
        string? message = null)
    {
        return ruleBuilder
            .Must(value => value is null || value.Length == value.Trim().Length)
            .WithMessage(message ?? "Remove unnecessary spaces at the beginning or end.");
    }
}
