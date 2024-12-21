export interface MongoDbResponse {
  database: string;
  collections: {
    name: string;
    totalDocuments: number;
    storageSizeInMegabytes: number;
  }[];
}
