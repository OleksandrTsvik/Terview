using Api.Endpoints;
using Api.Extensions;
using Api.Options;
using Infrastructure;
using Infrastructure.Health;
using Serilog;
using SharedKernel;

WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

builder.Host.UseSerilog((context, loggerConfig) =>
    loggerConfig.ReadFrom.Configuration(context.Configuration));

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.CustomSchemaIds(type => type.FullName);
});

builder.Services
    .AddExceptionHandler()
    .AddOptionsWithValidation()
    .AddApiCors(builder.Configuration)
    .AddEndpoints()
    .AddInfrastructure(builder.Configuration)
    .AddEvents()
    .AddFluentValidation();

WebApplication app = builder.Build();

await app.ConfigureDatabaseAsync();

app.UseApiCors();

RouteGroupBuilder routeGroupBuilder = app.MapGroup("api");

app.MapEndpoints(routeGroupBuilder);
app.MapHealthChecks("_health", routeGroupBuilder);

if (EnvironmentHelper.IsLocal)
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseSerilogRequestLogging();

app.UseExceptionHandler();

app.UseAuthentication();
app.UseAuthorization();

app.Run();
