namespace Infrastructure.Jobs;

public interface IJob
{
    Task Run(CancellationToken cancellationToken = default);
}
