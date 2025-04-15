# Terview

## 🛠️ Infrastructure Services

1. [GitHub Pages](https://vite.dev/guide/static-deploy#github-pages) for deploying `web` application.
2. [Render](https://render.com/) for deploying `api` application.
3. [MongoDB Atlas](https://www.mongodb.com/products/platform/atlas-database) for MongoDB database.
4. [Cloudinary](https://cloudinary.com/) for storing images.
5. **smtp.gmail.com** for sending emails.

## 🚀 Running Locally

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

## 🐳 Docker

### Docker build

```sh
docker build . -t terview:latest
```

### Docker run

```sh
docker run \
  --name terview \
  --memory 1024m \
  -it \
  --rm \
  terview:latest
```
