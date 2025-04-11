using Domain.Users;
using Infrastructure.Options;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.Extensions.Options;

namespace Infrastructure.Email;

public class EmailVerificationTokenFactory
{
    private readonly SecurityOptions _securityOptions;

    public EmailVerificationTokenFactory(IOptions<SecurityOptions> securityOptions)
    {
        _securityOptions = securityOptions.Value;
    }

    public EmailVerificationToken Create(Guid userId)
    {
        string token = Guid.NewGuid().ToString();

        var emailVerificationToken = new EmailVerificationToken
        {
            UserId = userId,
            Token = token,
            ExpiresOnUtc = DateTime.UtcNow.AddHours(_securityOptions.EmailVerificationTokenExpirationInHours)
        };

        return emailVerificationToken;
    }

    public string CreateLink(string token)
    {
        return QueryHelpers.AddQueryString(_securityOptions.EmailVerificationRedirectUrl, "token", token);
    }
}
