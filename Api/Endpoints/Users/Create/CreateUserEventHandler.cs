using Api.Events;
using Api.Infrastructure;
using Domain.Users;
using MongoDB.Driver;

namespace Api.Endpoints.Users.Create;

public class CreateUserEventHandler : IEventHandler<CreateUserEvent>
{
    private readonly IMongoCollection<User> _usersCollection;
    private readonly IMongoCollection<EmailVerificationToken> _emailVerificationTokensCollection;
    private readonly EmailVerificationTokenFactory _emailVerificationTokenFactory;
    private readonly IEmailSender _emailSender;

    public CreateUserEventHandler(
        IMongoCollection<User> usersCollection,
        IMongoCollection<EmailVerificationToken> emailVerificationTokensCollection,
        EmailVerificationTokenFactory emailVerificationTokenFactory,
        IEmailSender emailSender)
    {
        _usersCollection = usersCollection;
        _emailVerificationTokensCollection = emailVerificationTokensCollection;
        _emailVerificationTokenFactory = emailVerificationTokenFactory;
        _emailSender = emailSender;
    }

    public async Task Handle(CreateUserEvent message, CancellationToken cancellationToken = default)
    {
        User? user = await _usersCollection
            .Find(user => user.Id == message.UserId)
            .FirstOrDefaultAsync(cancellationToken);

        if (user is null || user.EmailVerified)
        {
            return;
        }

        EmailVerificationToken emailVerificationToken = _emailVerificationTokenFactory.Create(user.Id);

        await _emailVerificationTokensCollection.InsertOneAsync(emailVerificationToken, null, cancellationToken);

        string verificationLink = _emailVerificationTokenFactory.CreateLink(emailVerificationToken.Token);

        await _emailSender.SendHtmlAsync(
            user.Email,
            "[Terview] Підтвердження електронної пошти",
            $"Щоб підтвердити свою електронну адресу, <a href='{verificationLink}'>натисніть тут</a>.",
            cancellationToken);
    }
}
