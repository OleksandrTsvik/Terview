namespace Infrastructure.Options;

public class MongoDbOptions
{
    public static readonly string ConfigurationSectionName = "MongoDb";

    public required string ConnectionString { get; init; }
    public required string DatabaseName { get; init; }
}
