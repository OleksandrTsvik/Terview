using Api.Extensions;
using Api.Scheduler;
using Domain.Users;
using Microsoft.AspNetCore.Http.HttpResults;
using MongoDB.Bson;
using MongoDB.Driver;

namespace Api.Endpoints.Scheduler.UpdatePeriod;

public class UpdateJobPeriodEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPatch("scheduler/period/{id}", Handler)
            .WithTags(Tags.Scheduler)
            .WithRequestValidation<UpdateJobPeriodRequest>()
            .HasPermission(PermissionType.UpdateJobPeriod);
    }

    public static async Task<Results<NoContent, BadRequest, NotFound>> Handler(
        string id,
        UpdateJobPeriodRequest request,
        IMongoCollection<Job> jobsCollection,
        CancellationToken cancellationToken)
    {
        if (!ObjectId.TryParse(id, out ObjectId objectId))
        {
            return TypedResults.BadRequest();
        }

        UpdateDefinition<Job> update = Builders<Job>.Update
            .Set(job => job.PeriodInSeconds, request.PeriodInSeconds);

        UpdateResult updateResult = await jobsCollection.UpdateOneAsync(
            job => job.Id == objectId,
            update,
            null,
            cancellationToken);

        return updateResult.MatchedCount > 0 ? TypedResults.NoContent() : TypedResults.NotFound();
    }
}
