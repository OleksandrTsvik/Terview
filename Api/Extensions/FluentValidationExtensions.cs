using FluentValidation;
using SharedKernel;

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

    public static IRuleBuilderOptions<T, IFormFile> Image<T>(
        this IRuleBuilder<T, IFormFile> ruleBuilder,
        long maxSizeInBytes)
    {
        return ruleBuilder
            .Must(file => file is not null)
            .WithMessage("Null file was provided.")
            .Must((_, file, context) =>
            {
                context.MessageFormatter.AppendArgument("FileName", file.FileName);

                return file.Length > 0;
            })
            .WithMessage("File with name '{FileName}' is empty.")
            .Must((_, file, context) =>
            {
                context.MessageFormatter
                    .AppendArgument("FileName", file.FileName)
                    .AppendArgument("MaxSizeInBytes", maxSizeInBytes);

                return file.Length <= maxSizeInBytes;
            })
            .WithMessage("The file with name '{FileName}' exceeds the maximum allowed size ({MaxSizeInBytes} Bytes).")
            .Must((_, file, context) =>
            {
                context.MessageFormatter.AppendArgument("FileName", file.FileName);
                using Stream stream = file.OpenReadStream();

                return FileHelper.IsImage(stream, file.FileName, file.ContentType);
            })
            .WithMessage("Invalid image format with name '{FileName}'.");
    }
}
