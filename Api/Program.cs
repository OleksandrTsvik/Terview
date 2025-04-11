using Api.Endpoints;
using Api.Extensions;
using Api.Options;
using Infrastructure;
using Serilog;
using SharedKernel;

WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

builder.Host.UseSerilog((context, loggerConfig) =>
    loggerConfig.ReadFrom.Configuration(context.Configuration));

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

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
app.MapEndpoints(app.MapGroup("api"));

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
