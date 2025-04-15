using System.Reflection;

namespace Infrastructure;

public static class AssemblyReference
{
    public static readonly Assembly Assembly = typeof(AssemblyReference).Assembly;

    public static readonly IReadOnlyList<string> AssemblyNames = ["Api", nameof(Infrastructure)];

    public static readonly IReadOnlyList<Assembly> Assemblies = AppDomain.CurrentDomain
        .GetAssemblies()
        .Where(assembly => AssemblyNames.Contains(assembly.GetName().Name))
        .ToArray();
}
