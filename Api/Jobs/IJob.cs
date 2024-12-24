namespace Api.Jobs;

public interface IJob
{
    Task Run(CancellationToken cancellationToken = default);
}
