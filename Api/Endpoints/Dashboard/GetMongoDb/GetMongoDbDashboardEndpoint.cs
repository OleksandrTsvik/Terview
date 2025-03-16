using Microsoft.AspNetCore.Http.HttpResults;
using MongoDB.Bson;
using MongoDB.Driver;

namespace Api.Endpoints.Dashboard.GetMongoDb;

public class GetMongoDbDashboardEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet("dashboard/mongodb", Handler)
            .WithTags(Tags.Dashboard)
            .RequireAuthorization();
    }

    public static async Task<Ok<MongoDbResponse>> Handler(
        IMongoDatabase mongoDatabase,
        CancellationToken cancellationToken)
    {
        IAsyncCursor<BsonDocument> collections = await mongoDatabase
            .ListCollectionsAsync(null, cancellationToken);

        var response = new MongoDbResponse
        {
            Database = mongoDatabase.DatabaseNamespace.DatabaseName
        };

        await collections.ForEachAsync(async (collection) =>
        {
            string collectionName = collection["name"].AsString;

            var command = new BsonDocument("collStats", collectionName);
            BsonDocument stats = await mongoDatabase.RunCommandAsync<BsonDocument>(command);

            long count = stats["count"].IsInt64
                ? stats["count"].AsInt64
                : stats["count"].AsInt32;

            long storageSize = stats["storageSize"].IsInt64
                ? stats["storageSize"].AsInt64
                : stats["storageSize"].AsInt32;

            var collectionInformation = new DatabaseCollectionInformation
            {
                Name = collectionName,
                TotalDocuments = count,
                StorageSizeInMegabytes = storageSize / 1024.0 / 1024.0
            };

            response.Collections.Add(collectionInformation);
        }, cancellationToken);

        response.Collections = response.Collections
            .OrderBy(collection => collection.Name)
            .ToList();

        return TypedResults.Ok(response);
    }
}
