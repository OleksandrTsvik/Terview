using Api.Extensions;
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
    .AddAuth()
    .AddApiCors(builder)
    .AddEndpoints()
    .AddInfrastructure()
    .AddEvents()
    .AddJobs()
    .AddFluentValidation()
    .AddMongoDb();

WebApplication app = builder.Build();

await app.ConfigureDatabaseAsync();

app.UseApiCors();
app.MapEndpoints();

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
