using Soulbrain.Model;
using System.Collections.Generic;
using Response;

namespace Soulbrain.BLL.Response
{
    public class ResponseWorker : MessageResult
    {
        private List<Worker> m_buildingGroupWorkers = null;
        private List<Worker> m_buildingWorkers = null;
        private List<Worker> m_zoneWorkers = null;
        private List<Worker> m_equipZoneWorkers = null;

        public List<Worker> BuildingGroupWorkers
        {
            get { return m_buildingGroupWorkers; }
            set { m_buildingGroupWorkers = value; }
        }
        public List<Worker> BuildingWorkers
        {
            get { return m_buildingWorkers; }
            set { m_buildingWorkers = value; }
        }
        public List<Worker> ZoneWorkers
        {
            get { return m_zoneWorkers; }
            set { m_zoneWorkers = value; }
        }
        public List<Worker> EquipZoneWorkers
        {
            get { return m_equipZoneWorkers; }
            set { m_equipZoneWorkers = value; }
        }

        public ResponseWorker()
            : base()
        {
        }

        public ResponseWorker(bool success, string message)
            : base(success, message)
        {
        }
    }
}
