using System.Net;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Infrastructure.Options;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using Microsoft.Extensions.Options;

namespace Infrastructure.Health;

public class CloudinaryHealthCheck : IHealthCheck
{
    private readonly Cloudinary _cloudinary;

    public CloudinaryHealthCheck(IOptions<CloudinaryOptions> cloudinaryOptions)
    {
        var account = new Account(
            cloudinaryOptions.Value.CloudName,
            cloudinaryOptions.Value.ApiKey,
            cloudinaryOptions.Value.ApiSecret);

        _cloudinary = new Cloudinary(account);
    }

    public async Task<HealthCheckResult> CheckHealthAsync(
        HealthCheckContext context,
        CancellationToken cancellationToken = default)
    {
        try
        {
            PingResult? result = await _cloudinary.PingAsync(cancellationToken);

            if (result is null)
            {
                return HealthCheckResult.Unhealthy("Cloudinary API returned a null response.");
            }

            if (result.StatusCode != HttpStatusCode.OK)
            {
                return HealthCheckResult.Unhealthy(
                    $"StatusCode: {result.StatusCode}, Message: {result.Error?.Message}");
            }

            return HealthCheckResult.Healthy();
        }
        catch (Exception ex)
        {
            return HealthCheckResult.Unhealthy(exception: ex);
        }
    }
}
