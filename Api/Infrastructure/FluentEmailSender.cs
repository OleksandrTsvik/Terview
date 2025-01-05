using FluentEmail.Core;
using FluentEmail.Core.Models;

namespace Api.Infrastructure;

public class FluentEmailSender : IEmailSender
{
    private readonly IFluentEmail _fluentEmail;
    private readonly ILogger<FluentEmailSender> _logger;

    public FluentEmailSender(
        IFluentEmail fluentEmail,
        ILogger<FluentEmailSender> logger)
    {
        _fluentEmail = fluentEmail;
        _logger = logger;
    }

    public async Task SendAsync(
        string email,
        string subject,
        string body,
        CancellationToken cancellationToken = default)
    {
        SendResponse sendResponse = await _fluentEmail
            .To(email)
            .Subject(subject)
            .Body(body)
            .SendAsync(cancellationToken);

        if (sendResponse.ErrorMessages.Count > 0)
        {
            _logger.LogError("{ErrorMessages}", sendResponse.ErrorMessages);
        }
    }

    public async Task SendHtmlAsync(
        string email,
        string subject,
        string body,
        CancellationToken cancellationToken = default)
    {
        SendResponse sendResponse = await _fluentEmail
            .To(email)
            .Subject(subject)
            .Body(body, isHtml: true)
            .SendAsync(cancellationToken);

        if (sendResponse.ErrorMessages.Count > 0)
        {
            _logger.LogError("{ErrorMessages}", sendResponse.ErrorMessages);
        }
    }
}
