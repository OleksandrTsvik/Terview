namespace Api.Options;

public class MongoDbOptions
{
    public required string ConnectionString { get; init; }
    public required string DatabaseName { get; init; }
}
