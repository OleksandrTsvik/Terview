using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Infrastructure.Database;

public class Log
{
    public ObjectId Id { get; set; }

    public string Level { get; set; } = string.Empty;

    public DateTime UtcTimeStamp { get; set; }

    public string RenderedMessage { get; set; } = string.Empty;

    [BsonExtraElements]
    public BsonDocument Metadata { get; set; } = [];
}
