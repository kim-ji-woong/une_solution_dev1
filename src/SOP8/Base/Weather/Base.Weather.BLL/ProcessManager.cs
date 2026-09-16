using Base.Weather.IBLL;
using Base.Weather.IBLL.Request;
using Base.Weather.IBLL.Response;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace Base.Weather.BLL
{
    using Process;

    public class ProcessManager : IProcessManager
    {
        private IDataManager m_dataManager = null;

        public ProcessManager(IDataManager dataManager)
        {
            m_dataManager = dataManager;
        }

        public ResponseCurrent RequestCurrentWeather(RequestCurrent data)
        {
            CurrentManager currentManager = new CurrentManager(m_dataManager);
            return currentManager.GetCurrentWeather(data);
        }

        public ResponseWeatherWeeklyInfo RequestWeatherWeeklyInfo(RequestWeatherWeeklyInfo data)
        {
            WeeklyManager weeklyManager = new WeeklyManager(m_dataManager);
            return weeklyManager.GetWeatherWeeklyInfo(data);
        }
    }
}
