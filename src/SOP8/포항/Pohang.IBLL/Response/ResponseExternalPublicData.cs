using System.Collections.Generic;
using Pohang.Model;
using Response;

namespace Pohang.IBLL.Response
{
    public class ResponseExternalPublicData : MessageResult
    {
        private List<PublicTms> m_publicTmsList = new List<PublicTms>();
        private List<PublicAirKorea> m_publicAirKoreaList = new List<PublicAirKorea>();
        private List<PublicWeather> m_publicWeatherList = new List<PublicWeather>();

        public List<PublicTms> PublicTmsList
        {
            get { return m_publicTmsList; }
            set { m_publicTmsList = value; }
        }
        
        public List<PublicAirKorea> PublicAirKoreaList
        {
            get { return m_publicAirKoreaList; }
            set { m_publicAirKoreaList = value; }
        }
        
        public List<PublicWeather> PublicWeatherList
        {
            get { return m_publicWeatherList; }
            set { m_publicWeatherList = value; }
        }
        
        public ResponseExternalPublicData()
        {
            
        }
        
        public ResponseExternalPublicData(bool success, string message) : base(success, message)
        {
            
        }
        
    }
}