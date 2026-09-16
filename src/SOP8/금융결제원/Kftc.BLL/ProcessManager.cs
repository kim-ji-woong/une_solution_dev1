using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace Kftc.BLL
{
    using Request;
    using Response;
    using Process;
    using dnsExcelReport.Models;
    using global::Response;

    public class ProcessManager
    {
        private IDataManager m_dataManager = null;

        public ProcessManager(IDataManager dataManager)
        {
            m_dataManager = dataManager;
        }

        public ResponseAllCCTVs RequestAllCCTVs()
        {
            CCTVManager cctvManager = new CCTVManager(m_dataManager);
            return cctvManager.GetAllCCTVs();
        }

        public ResponseDoorStatus RequestDoorStatus(RequestDoorStatus data)
        {
            DoorManager doorManager = new DoorManager(m_dataManager);
            return doorManager.RequestDoorStatus(data);
        }

        public ResponsePatrolHistory RequestPatrolHistory(RequestPatrolHistory data)
        {
            PatrolManager manager = new PatrolManager(m_dataManager);
            return manager.GetPatrolHistory(data);
        }

        public ResponseCourseList RequestCourseList()
        {
            PatrolManager manager = new PatrolManager(m_dataManager);
            return manager.GetCourseList();
        }

        public ResponseExcelInfo DownloadExcelPartialPatrolHistory(RequestExcelPartialPatrolHistory data)
        {
            PatrolManager manager = new PatrolManager(m_dataManager);
            return manager.DownloadExcelPartialPatrolHistory(data);
        }

        public ResponseExcelInfo DownloadExcelAllPatrolHistory(RequestExcelPatrolHistory data)
        {
            PatrolManager manager = new PatrolManager(m_dataManager);
            return manager.DownloadExcelAllPatrolHistory(data);
        }

        public ResponseComingHistory RequestComingHistory()
        {
            ComingPersonManager manager = new ComingPersonManager(m_dataManager);
            return manager.GetComingHistory();
        }

        public ResponseAreaComingHistory RequestAreaComingHistory()
        {
            ComingPersonManager manager = new ComingPersonManager(m_dataManager);
            return manager.GetAreaComingHistory();
        }

        public ResponseRouteHistory RequestRouteHistory(string strCardNo)
        {
            ComingPersonManager manager = new ComingPersonManager(m_dataManager);
            return manager.GetRouteHistory(strCardNo);
        }

        public ResponseLastComingPerson RequesttLastComingPerson()
        {
            ComingPersonManager manager = new ComingPersonManager(m_dataManager);
            return manager.GetLastComingPerson();
        }

        public ResponseElevators RequestElevators()
        {
            ElevatorManager manager = new ElevatorManager(m_dataManager);
            return manager.GetElevators();
        }

        public ResponseTotalDoorStatus RequestTotalDoorStatus()
        {
            DoorManager doorManager = new DoorManager(m_dataManager);
            return doorManager.RequestTotalDoorStatus();
        }

        public ResponseSensorinfo RequestSensorInfo(RequestSensorInfo data)
        {
            SensorManager sensorManager = new SensorManager(m_dataManager);
            return sensorManager.RequestSensorInfo(data);
        }

        public ResponseCCTVList RequestCCTVList(RequestCCTVList data)
        {
            CCTVManager cctvManager = new CCTVManager(m_dataManager);
            return cctvManager.GetCCTVList(data);
        }

        public ResponseEquipmentList RequestEquipmentList(RequestEquipmentList data)
        {
            EquipmentManager manager = new EquipmentManager(m_dataManager);
            return manager.GetEquipmentList(data.SearchText);
        }

        public ResponseEquipmentType RequestEquipmentType()
        {
            EquipmentManager manager = new EquipmentManager(m_dataManager);
            return manager.GetEquipmentType();
        }

        public ResponseEquipment RequestInsertEquipment(RequestInsertEquipment data)
        {
            EquipmentManager manager = new EquipmentManager(m_dataManager);
            return manager.InsertEquipment(data.Equipment);
        }

        public ResponseEquipment RequestUpdateEquipment(RequestEquipment data)
        {
            EquipmentManager manager = new EquipmentManager(m_dataManager);
            return manager.UpdateEquipment(data.Equipment);
        }

        public MessageResult RequestDeleteEquipment(RequestDeleteEquipment data)
        {
            EquipmentManager manager = new EquipmentManager(m_dataManager);
            return manager.DeleteEquipment(data.Equipments);
        }

        public ResponseExcelInfo DownloadExcelEquipments()
        {
            EquipmentManager manager = new EquipmentManager(m_dataManager);
            return manager.DownloadExcelEquipments();
        }

        public ResponseComingPersonHistory RequestComingHistories(RequestComingPersonHistory data)
        {
            ComingPersonManager manager = new ComingPersonManager(m_dataManager);
            return manager.GetComingHistories(data);
        }

        public ResponseComingDoors RequestComingDoors()
        {
            ComingPersonManager manager = new ComingPersonManager(m_dataManager);
            return manager.GetComingDoors();
        }

        public ResponseExcelInfo RequestExcelPartialComingHistory(RequestExcelPartialComingHistory request)
        {
            ComingPersonManager manager = new ComingPersonManager(m_dataManager);
            return manager.DownloadExcelComingHistory(request);
        }

        public ResponseExcelInfo RequestExcelAllComingHistory(RequestExcelComingHistory request)
        {
            ComingPersonManager manager = new ComingPersonManager(m_dataManager);
            return manager.DownloadExcelAllComingHistory(request);
        }

        public ResponseParentList RequestParentItemList()
        {
            EquipmentManager manager = new EquipmentManager(m_dataManager);
            return manager.GetParentList();
        }

        public ResponseParentEquipList RequestParentEquipmentList(RequestEquipmentList data)
        {
            EquipmentManager manager = new EquipmentManager(m_dataManager);
            return manager.GetParentEquipmentList(data.SearchText);
        }

        public ResponseTpsList RequestTpsList()
        {
            EquipmentManager manager = new EquipmentManager(m_dataManager);
            return manager.GetTpsList();
        }

        public ResponseParentEquipment RequestInsertParentEquipment(RequestInsertParentEquip data)
        {
            EquipmentManager manager = new EquipmentManager(m_dataManager);
            return manager.InsertParentEquipment(data.Equipment);
        }

        public MessageResult RequestUpdateParentEquipment(RequestParentEquipment data)
        {
            EquipmentManager manager = new EquipmentManager(m_dataManager);
            return manager.UpdateParentEquipment(data.Equipment);
        }

        public MessageResult RequestDeleteParentEquipment(RequestDeleteParentEquipment data)
        {
            EquipmentManager manager = new EquipmentManager(m_dataManager);
            return manager.DeleteParentEquipment(data.Equipments);
        }


        public ResponseParentEquipList RequestTpsParentEquipments(RequestTpsParentEquipments data)
        {
            EquipmentManager manager = new EquipmentManager(m_dataManager);
            return manager.GetTpsParentEquipments(data.TpsNo);
        }

        public ResponseTpsEquipment RequestTpsEquipments(RequestTpsEquipments data)
        {
            EquipmentManager manager = new EquipmentManager(m_dataManager);
            return manager.GetTpsEquipments(data.ParentNo);
        }

        public ResponseCurrentParkingInfo RequestCurrentParkingInfo()
        {
            ParkingManager manager = new ParkingManager(m_dataManager);
            return manager.GetCurrentParkingInfo();
        }

        public ResponseParkingImage RequestParkingImage(int nParkingHisNo)
        {
            ParkingManager manager = new ParkingManager(m_dataManager);
            return manager.GetParkingImage(nParkingHisNo);
        }

        public ResponseParkingInfo RequestParkingManual(int nParkingHisNo)
        {
            ParkingManager manager = new ParkingManager(m_dataManager);
            return manager.InsertParkingManual(nParkingHisNo);
        }

        public ResponseParkingHistory RequestParkingHistory(RequestParkingHistory data)
        {
            ParkingManager manager = new ParkingManager(m_dataManager);
            return manager.GetParkingHistory(data);
        }

        public ResponseExcelInfo RequestExcelPartialParkingHistory(RequestExcelPartialParkingHistory data)
        {
            ParkingManager manager = new ParkingManager(m_dataManager);
            return manager.DownloadExcelParkingHistory(data);
        }

        public ResponseExcelInfo RequestExceAllParkingHistory(RequestExcelParkingHistory data)
        {
            ParkingManager manager = new ParkingManager(m_dataManager);
            return manager.DownloadExcelAllParkingHistory(data);
        }
    }
}
