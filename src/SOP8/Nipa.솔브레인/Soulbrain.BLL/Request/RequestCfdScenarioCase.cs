namespace Soulbrain.BLL.Request
{
    public class RequestCfdScenarioCase
    {
        private string m_strMaterialName = "";
        private string m_strTargetLocation = "";
        private int m_nBuldingNo = -1;
        private int? m_windDirection = null;
        private double? m_windSpeed = null;

        public string MaterialName
        {
            get { return m_strMaterialName; }
            set { m_strMaterialName = value; }
        }

        public string TargetLocation
        {
            get { return m_strTargetLocation; }
            set { m_strTargetLocation = value; }
        }

        public int BuildingNo
        {
            get { return m_nBuldingNo; }
            set { m_nBuldingNo = value; }
        }

        public int? WindDirection
        {
            get { return m_windDirection; }
            set { m_windDirection = value; }
        }

        public double? WindSpeed
        {
            get { return m_windSpeed; }
            set { m_windSpeed = value; }
        }
    }
}
