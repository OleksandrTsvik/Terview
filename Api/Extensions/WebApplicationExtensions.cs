using Infrastructure.Database;

namespace Api.Extensions;

public static class WebApplicationExtensions
{
    public static void UseApiCors(this WebApplication app)
    {
        app.UseCors("CorsPolicy");
    }

    public static async Task ConfigureDatabaseAsync(this WebApplication app)
    {
        await app.Services.GetRequiredService<DatabaseInitializer>().Execute();
    }
}
