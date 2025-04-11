namespace Infrastructure.Email;

public interface IEmailSender
{
    Task SendAsync(
        string email,
        string subject,
        string body,
        CancellationToken cancellationToken = default);

    Task SendHtmlAsync(
        string email,
        string subject,
        string body,
        CancellationToken cancellationToken = default);
}
