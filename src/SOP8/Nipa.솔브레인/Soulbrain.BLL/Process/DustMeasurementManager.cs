using System;
using System.Collections.Generic;
using System.Linq;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using Soulbrain.BLL.Request;
using Soulbrain.BLL.Response;
using Soulbrain.Model.Facility;

namespace Soulbrain.BLL.Process
{
    public class DustMeasurementManager
    {
        private IDataManager m_dataManager = null;
        
        public DustMeasurementManager(IDataManager dataManager)
        {
            m_dataManager = dataManager;
        }
        
        public ResponseDustMeasurementInfo RequestDustMeasurementInfo()
        {
            try
            {
                ResponseDustMeasurementInfo response = new ResponseDustMeasurementInfo(true, "");
                
                IEnumerable<DustMeasurement> dustMeasurements = m_dataManager.GetSelect().Select<DustMeasurement>(null, out string strErrorMessage);
                
                if (dustMeasurements == null)
                    throw new Exception(strErrorMessage);
                
                response.DustMeasurements = dustMeasurements.ToList();
                
                return response;
            }
            catch (Exception exception)
            {
                return new ResponseDustMeasurementInfo(false, exception.Message);
            }
        }
        
        
    }
}