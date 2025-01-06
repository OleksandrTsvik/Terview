using Api.Options;
using Api.Options.Validators;
using Microsoft.Extensions.Options;

namespace Api.Extensions;

public static class OptionsExtensions
{
    public static IServiceCollection AddOptionsWithValidation(this IServiceCollection services)
    {
        services.AddOptionsWithFluentValidation<CloudinaryOptions>(CloudinaryOptions.ConfigurationSectionName);
        services.AddOptionsWithFluentValidation<CorsOptions>(CorsOptions.ConfigurationSectionName);

        services.AddOptionsWithFluentValidation<EmailOptions>(EmailOptions.ConfigurationSectionName);

        services.AddOptionsWithFluentValidation<FilesOptions>(FilesOptions.ConfigurationSectionName);

        services.AddOptionsWithFluentValidation<JobsOptions>(JobsOptions.ConfigurationSectionName);
        services.AddOptionsWithFluentValidation<JwtOptions>(JwtOptions.ConfigurationSectionName);

        services.AddOptionsWithFluentValidation<MongoDbOptions>(MongoDbOptions.ConfigurationSectionName);

        services.AddOptionsWithFluentValidation<OutboxOptions>(OutboxOptions.ConfigurationSectionName);

        services.AddOptionsWithFluentValidation<SchedulerOptions>(SchedulerOptions.ConfigurationSectionName);
        services.AddOptionsWithFluentValidation<SecurityOptions>(SecurityOptions.ConfigurationSectionName);
        services.AddOptionsWithFluentValidation<SeedOptions>(SeedOptions.ConfigurationSectionName);

        return services;
    }

    private static IServiceCollection AddOptionsWithFluentValidation<TOptions>(
        this IServiceCollection services,
        string configurationSection)
        where TOptions : class
    {
        services.AddOptions<TOptions>()
            .BindConfiguration(configurationSection)
            .ValidateFluentValidation()
            .ValidateOnStart();

        return services;
    }

    private static OptionsBuilder<TOptions> ValidateFluentValidation<TOptions>(
        this OptionsBuilder<TOptions> builder)
        where TOptions : class
    {
        builder.Services.AddSingleton<IValidateOptions<TOptions>>(serviceProvider =>
            new FluentValidateOptions<TOptions>(serviceProvider, builder.Name));

        return builder;
    }
}
