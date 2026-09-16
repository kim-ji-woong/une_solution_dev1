namespace Base.Weather.IBLL
{
    using Response;
    using Request;

    public interface IProcessManager
    {
        ResponseCurrent RequestCurrentWeather(RequestCurrent data);
        ResponseWeatherWeeklyInfo RequestWeatherWeeklyInfo(RequestWeatherWeeklyInfo data);
    }
}
