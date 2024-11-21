using System.Reflection;

namespace SharedKernel.CollectionNameAttribute;

public static class CollectionNameHelper
{
    public static string GetCollectionName<T>()
    {
        object[] attributes = typeof(T).GetCustomAttributes(
            typeof(CollectionNameAttribute),
            inherit: false);

        var collectionNameAttribute = (CollectionNameAttribute?)attributes.FirstOrDefault();

        if (collectionNameAttribute is null)
        {
            throw new CollectionNameAttributeNotFoundException(typeof(T));
        }

        return collectionNameAttribute.Name;
    }

    public static IEnumerable<Type> GetClassesWithCollectionNameAttribute(Assembly assembly)
    {
        return assembly.GetTypes()
            .Where(type =>
                type.IsClass &&
                type.GetCustomAttributes(typeof(CollectionNameAttribute), inherit: false).Length > 0);
    }
}
