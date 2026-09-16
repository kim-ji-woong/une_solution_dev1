using System.Collections.Generic;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace Soulbrain.BLL.Process
{
    using Response;
    using Model;

    class WorkerManager
    {
        private IDataManager m_dataManager = null;

        public WorkerManager(IDataManager dataManager)
        {
            m_dataManager = dataManager;
        }

        public ResponseWorker GetWorkers()
        {
            string strErrorMessage = null;
            ResponseWorker response = null;

            // 건물그룹 작업자 인원 정보 
            List<Worker> buildingGroupWorkers = new List<Worker>();
            // 건물 작업자 인원 정보
            List<Worker> buildingWorkers = new List<Worker>();
            // 층별 작업자 인원 정보
            List<Worker> zoneWorkers = new List<Worker>();
            // 구역별 작업자 인원 정보
            List<Worker> equipZoneWorkers = new List<Worker>();

            if (m_dataManager == null)
                return new ResponseWorker(false, "데이터에 접근할 수 없습니다.");

            IEnumerable<Worker> workerInfos = m_dataManager.GetSelect().Select<Worker>(null, out strErrorMessage);

            if (workerInfos == null)
            {
                response = new ResponseWorker(false, strErrorMessage);
                return response;
            }

            List<Worker> workers = new List<Worker>();
            workers.AddRange(workerInfos);

            buildingGroupWorkers = workers.FindAll(x => x.buld_group_sn != null);
            buildingWorkers = workers.FindAll(x => x.buld_sn != null);
            zoneWorkers = workers.FindAll(x => x.zone_sn != null);
            equipZoneWorkers = workers.FindAll(x => x.eqp_zone_sn != null);

            response = new ResponseWorker(true, "");
            response.BuildingGroupWorkers = buildingGroupWorkers;
            response.BuildingWorkers = buildingWorkers;
            response.ZoneWorkers = zoneWorkers;
            response.EquipZoneWorkers = equipZoneWorkers;

            return response;
        }
    }
}
