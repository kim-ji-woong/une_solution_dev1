using dnsDapperDBUtil.DataAccessLayer.DAL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AccessDoor
{
    class AccessManager
    {
        private DataManager m_dataManager = null;
        private AccessDoorManager m_parent = null;

        public AccessManager(AccessDoorManager parent, DataManager dataManager)
        {
            m_parent = parent;
            m_dataManager = dataManager;
        }

        public List<DoorStatus> GetDoorStatus(out string strErrMsg)
        {
            List<DoorStatus> statuses = new List<DoorStatus>();
            strErrMsg = null;

            try
            {
                string strSQL = string.Format(@$"SELECT DeviceID, OpenStatus, DoorStatus FROM View_Door_Status_Ex WHERE LocationName LIKE '%명동%'");

                IEnumerable<dynamic> results = m_dataManager.GetSelect().Select(strSQL, out strErrMsg);
                if (results == null)
                {
                    throw new ApplicationException(strErrMsg);
                }

                foreach (var result in results)
                {
                    DoorStatus status = new DoorStatus();
                    status.DeviceID = result.DeviceID;
                    status.OpenStatus = result.OpenStatus;
                    status.Status = result.DoorStatus;

                    statuses.Add(status);
                }
            }
            catch (Exception e)
            {
                statuses = null;
                strErrMsg = e.Message;
            }

            return statuses;
        }
    }

    public class DoorStatus
    {
        public enum DOOR_STATUS { CLOSE = 0, OPEN }

        public int DeviceID { get; set; }
        public int OpenStatus { get; set; }
        public string Status { get; set; }
    }
}
