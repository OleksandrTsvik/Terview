using Api.Scheduler;
using Microsoft.AspNetCore.Http.HttpResults;
using MongoDB.Bson;
using MongoDB.Driver;

namespace Api.Endpoints.Scheduler.Run;

public class RunJobEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost("scheduler/{id}", Handler)
            .WithTags(Tags.Scheduler)
            .RequireAuthorization();
    }

    public static async Task<Results<NoContent, BadRequest, NotFound>> Handler(
        string id,
        IMongoCollection<Job> jobsCollection,
        CancellationToken cancellationToken)
    {
        if (!ObjectId.TryParse(id, out ObjectId objectId))
        {
            return TypedResults.BadRequest();
        }

        UpdateDefinition<Job> update = Builders<Job>.Update
            .Set(job => job.NextRunTimeInUtc, DateTime.MinValue);

        UpdateResult updateResult = await jobsCollection.UpdateOneAsync(
            job => job.Id == objectId,
            update,
            null,
            cancellationToken);

        return updateResult.MatchedCount > 0 ? TypedResults.NoContent() : TypedResults.NotFound();
    }
}
