using Api.Extensions;
using SharedKernel;

WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services
    .AddExceptionHandler()
    .AddOptionsWithValidation()
    .AddEndpoints()
    .AddFluentValidation()
    .AddMongoDb();

WebApplication app = builder.Build();

app.MapEndpoints();

if (EnvironmentHelper.IsLocal)
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseExceptionHandler();

app.Run();
