# Terview

## Running Locally

### Api

To run the `api` locally, you first need to install dependencies:

```sh
dotnet restore
dotnet build
```

> Be sure to fill in the `Api/appsettings.json` file!

Run `api`:

```sh
cd Api
dotnet watch --no-hot-reload --environment Local --launch-profile Local
```

### Web

To run the `web` locally, you first need to install dependencies:

```sh
cd Web
npm install
```

Run `web`:

```sh
cd Web
npm run dev
```

Then open [http://localhost:3000/](http://localhost:3000/) to see web app.

## References

- [Vertical Slice Architecture: Structuring Vertical Slices](https://www.milanjovanovic.tech/blog/vertical-slice-architecture-structuring-vertical-slices)
- [Vertical Slice Architecture](https://www.milanjovanovic.tech/blog/vertical-slice-architecture)
- [Productive Web API Development with FastEndpoints and Vertical Slice Architecture in .NET](https://antondevtips.com/blog/productive-web-api-development-with-fast-endpoints-and-vertical-slice-architecture-in-dotnet)
- [Implementing the Outbox Pattern](https://www.milanjovanovic.tech/blog/implementing-the-outbox-pattern)
- [Lightweight In-Memory Message Bus Using .NET Channels](https://www.milanjovanovic.tech/blog/lightweight-in-memory-message-bus-using-dotnet-channels)
- [Options Pattern in ASP.NET Core – Bind & Validate Configurations from appsettings.json](https://codewithmukesh.com/blog/options-pattern-in-aspnet-core/)
- [[Microsoft] Background tasks with hosted services in ASP.NET Core](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/host/hosted-services?view=aspnetcore-8.0&tabs=visual-studio)
- [[Microsoft] Naming of environment variables](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/configuration/?view=aspnetcore-8.0#naming-of-environment-variables)
- [[RTK Query] createApi](https://redux-toolkit.js.org/rtk-query/api/createApi)
- [[RTK Query] Code Splitting](https://redux-toolkit.js.org/rtk-query/usage/code-splitting)
- [Migrate to ESLint 9.x](https://medium.com/ekino-france/migrate-to-eslint-9-x-29727f790249)
- [[Vite] Deploying a Static Site](https://vite.dev/guide/static-deploy)
- [[Vite] Using Environment Variables in Config](https://vite.dev/config/#using-environment-variables-in-config)
- [How to create a type guard for string union types in TypeScript](https://www.qualdesk.com/blog/2021/type-guard-for-string-union-types-typescript/)
- [Day.js](https://day.js.org/docs/en/installation/installation)
- [[CKEditor 5] React rich text editor component (npm)](https://ckeditor.com/docs/ckeditor5/latest/getting-started/installation/self-hosted/react/react-default-npm.html)
- [[CKEditor 5] Simple upload adapter](https://ckeditor.com/docs/ckeditor5/latest/features/images/image-upload/simple-upload-adapter.html)
- [[YouTube] Request Validation in .NET / C# Minimal APIs](https://www.youtube.com/watch?v=1qJTVcR1VN8)
- [[YouTube] Transactional Outbox Pattern | Clean Architecture, .NET 6](https://www.youtube.com/watch?v=XALvnX7MPeo)
- [[YouTube] ASP.NET Core MediatR Notifications Alternative](https://www.youtube.com/watch?v=G8lnnaGhmFI)
