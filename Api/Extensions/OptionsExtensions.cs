using Api.Options;
using Microsoft.Extensions.Options;

namespace Api.Extensions;

public static class OptionsExtensions
{
    public static IServiceCollection AddOptionsWithValidation(this IServiceCollection services)
    {
        services.AddOptionsWithFluentValidation<CorsOptions>(CorsOptions.ConfigurationSectionName);
        services.AddOptionsWithFluentValidation<MongoDbOptions>(MongoDbOptions.ConfigurationSectionName);

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
