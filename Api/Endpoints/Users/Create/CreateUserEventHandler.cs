using Domain.Users;
using Infrastructure.Email;
using Infrastructure.Events;
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
            .Find(user =>
                user.Id == message.UserId &&
                user.DeletedOnUtc == null &&
                user.DeletedBy == null)
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
