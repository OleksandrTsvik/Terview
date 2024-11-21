namespace SharedKernel.CollectionNameAttribute;

public class CollectionNameAttributeNotFoundException : Exception
{
    public CollectionNameAttributeNotFoundException(Type type)
        : base($"'{type.Name}' does not have a '{nameof(CollectionNameAttribute)} applied'.")
    {
    }
}
