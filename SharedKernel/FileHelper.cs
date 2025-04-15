namespace SharedKernel;

public static class FileHelper
{
    public static readonly string[] ExecutableFileExtensions = [".exe", ".msi"];

    public static readonly string[] ImageExtensions =
    [
        ".jpg", ".jpeg", ".png",
        ".svg", ".webp", ".bmp",
        ".tif", ".tiff", ".ico",
        ".gif"
    ];

    public static bool IsExecutableFile(Stream stream, string? fileName)
    {
        ArgumentNullException.ThrowIfNull(stream);

        string? extension = Path.GetExtension(fileName)?.ToLower();

        if (!string.IsNullOrWhiteSpace(extension) && ExecutableFileExtensions.Contains(extension))
        {
            return true;
        }

        byte[] firstTwoBytes = new byte[2];
        byte[] firstEightBytes = new byte[8];

        stream.Position = 0;
        stream.ReadExactly(firstTwoBytes, 0, 2);

        stream.Position = 0;
        stream.ReadExactly(firstEightBytes, 0, 8);

        byte[] exe = [0x4D, 0x5A]; // .exe, .com, .dll
        byte[] msi = [0xD0, 0xCF, 0x11, 0xE0, 0xA1, 0xB1, 0x1A, 0xE1]; // .msi, .doc, .xls, .ppt, .msg

        return exe.SequenceEqual(firstTwoBytes) || msi.SequenceEqual(firstEightBytes);
    }

    public static bool IsImage(Stream stream, string fileName, string? contentType)
    {
        ArgumentNullException.ThrowIfNull(stream);

        if (IsExecutableFile(stream, fileName))
        {
            return false;
        }

        if (!string.IsNullOrWhiteSpace(contentType) &&
            !contentType.StartsWith("image/", StringComparison.OrdinalIgnoreCase))
        {
            return false;
        }

        string? extension = Path.GetExtension(fileName)?.ToLower();

        if (string.IsNullOrWhiteSpace(extension) || !ImageExtensions.Contains(extension))
        {
            return false;
        }

        return true;
    }
}
