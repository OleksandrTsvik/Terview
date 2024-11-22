# Terview

## Running Locally

To run the `api` locally, first, you need to install dependencies:

```sh
dotnet restore
dotnet build
```

Be sure to fill in the `appsettings.json` file!

Run api:

```sh
cd Api
dotnet watch --no-hot-reload --environment Local --launch-profile Local
```

## References

- [Vertical Slice Architecture: Structuring Vertical Slices](https://www.milanjovanovic.tech/blog/vertical-slice-architecture-structuring-vertical-slices)
- [Vertical Slice Architecture](https://www.milanjovanovic.tech/blog/vertical-slice-architecture)
- [Productive Web API Development with FastEndpoints and Vertical Slice Architecture in .NET](https://antondevtips.com/blog/productive-web-api-development-with-fast-endpoints-and-vertical-slice-architecture-in-dotnet)
- [[YT] Request Validation in .NET / C# Minimal APIs](https://www.youtube.com/watch?v=1qJTVcR1VN8)
