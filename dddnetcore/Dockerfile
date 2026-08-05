FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

COPY DDDNetCore.csproj ./
RUN dotnet restore DDDNetCore.csproj

COPY . ./
RUN dotnet publish DDDNetCore.csproj -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtime
WORKDIR /app

ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

COPY --from=build /app/publish ./
RUN cp -a /app/wwwroot/uploads /app/seed-uploads

ENTRYPOINT ["sh", "-c", "mkdir -p /app/wwwroot/uploads && cp -rn /app/seed-uploads/. /app/wwwroot/uploads/ 2>/dev/null || true; exec dotnet DDDNetCore.dll"]
