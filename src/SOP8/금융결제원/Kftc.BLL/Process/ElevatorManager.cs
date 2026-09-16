using System.Collections.Generic;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace Kftc.BLL.Process
{
    using Response;
    using Model.Spatial;

    class ElevatorManager
    {
        private IDataManager m_dataManager = null;

        public ElevatorManager(IDataManager dataManager)
        {
            m_dataManager = dataManager;
        }

        public ResponseElevators GetElevators()
        {
            string strErrorMessage;
            IEnumerable<Elevator> elevators = m_dataManager.GetSelect().Select<Elevator>(null, out strErrorMessage);

            if (elevators == null)
                return new ResponseElevators(false, strErrorMessage);

            ResponseElevators response = new ResponseElevators(true, "");
            response.Elevators.AddRange(elevators);
            return response;
        }
    }
}
