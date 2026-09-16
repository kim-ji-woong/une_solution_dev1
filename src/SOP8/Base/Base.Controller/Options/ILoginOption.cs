namespace Base.Controller.Options
{
    public interface ILoginOption
    {
        string ExternalLoginUrl { get; set; }
        bool AutoLogin { get; set; }
        string StreamServerUrl { get; set; }
    }
}
