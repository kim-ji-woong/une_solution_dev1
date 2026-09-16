namespace Pohang.IBLL.Request
{
    public class RequestExternalSensorCategories
    {
        private bool? m_bRequestExternalSensorCategories = null;
        
        public bool? bRequestExternalSensorCategories
        {
            get { return m_bRequestExternalSensorCategories; }
            set { m_bRequestExternalSensorCategories = value; }
        }
    }
}