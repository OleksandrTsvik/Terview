namespace Api.Endpoints.Dashboard.GetMongoDb;

public class MongoDbResponse
{
    public string Database { get; set; } = string.Empty;
    public List<DatabaseCollectionInformation> Collections { get; set; } = [];
}

public class DatabaseCollectionInformation
{
    public string Name { get; set; } = string.Empty;
    public long TotalDocuments { get; set; }
    public double StorageSizeInMegabytes { get; set; }
}
