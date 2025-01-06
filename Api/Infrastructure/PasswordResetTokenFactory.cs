using System.Security.Cryptography;
using Api.Options;
using Domain.Users;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace Api.Infrastructure;

public class PasswordResetTokenFactory
{
    private readonly SecurityOptions _securityOptions;
    private readonly IMongoCollection<PasswordResetToken> _passwordResetTokensCollection;

    public PasswordResetTokenFactory(
        IOptions<SecurityOptions> securityOptions,
        IMongoCollection<PasswordResetToken> passwordResetTokensCollection)
    {
        _securityOptions = securityOptions.Value;
        _passwordResetTokensCollection = passwordResetTokensCollection;
    }

    public async Task<PasswordResetToken?> CreateAsync(
        Guid userId,
        CancellationToken cancellationToken = default)
    {
        long count = await _passwordResetTokensCollection
            .Find(x => x.UserId == userId)
            .CountDocumentsAsync(cancellationToken);

        if (count >= _securityOptions.MaxUserPasswordResetTokens)
        {
            return null;
        }

        string token = Convert.ToBase64String(RandomNumberGenerator.GetBytes(32));

        var passwordResetToken = new PasswordResetToken
        {
            UserId = userId,
            Token = token,
            ExpiresOnUtc = DateTime.UtcNow.AddMinutes(_securityOptions.PasswordResetTokenExpirationInMinutes)
        };

        return passwordResetToken;
    }

    public string CreateLink(string token)
    {
        return QueryHelpers.AddQueryString(_securityOptions.PasswordResetRedirectUrl, "token", token);
    }
}
