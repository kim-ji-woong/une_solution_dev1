using System;

namespace SoulbrainWeather
{
    static class Program
    {
        /// <summary>
        ///  The main entry point for the application.
        /// </summary>
        [STAThread]
        static void Main()
        {
            WeatherManager.Run();
        }
    }
}
