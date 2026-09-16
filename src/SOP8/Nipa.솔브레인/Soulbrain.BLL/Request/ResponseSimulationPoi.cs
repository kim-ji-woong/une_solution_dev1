using System.Collections.Generic;
using Soulbrain.Model.Facility;
using Response;

namespace Soulbrain.BLL.Request
{
    public class ResponseSimulationPoi : MessageResult
    {
        private List<SimulationPoiEx> m_pois = new List<SimulationPoiEx>();

        public List<SimulationPoiEx> Pois
        {
            get { return m_pois; }
        }

        public ResponseSimulationPoi()
            : base()
        {
        }

        public ResponseSimulationPoi(bool success, string message)
            : base(success, message)
        {
        }
    }

    public class SimulationPoiEx : SimulationPoi
    {
        private List<string> m_names = new List<string>();

        public List<string> Names
        {
            get { return m_names; }
        }

        public SimulationPoiEx(SimulationPoi poi)
        {
            this.FromCopy(poi);
            SetNames();
        }

        private void SetNames()
        {
            m_names.Clear();

            if (this.poi_name != null)
            {
                string[] tokens = this.poi_name.Split(';');

                foreach (string strToken in tokens)
                {
                    m_names.Add(strToken);
                }
            }
        }
    }
}
