namespace Api.Extensions;

public static class WebApplicationExtensions
{
    public static void UseApiCors(this WebApplication app)
    {
        app.UseCors("CorsPolicy");
    }
}
