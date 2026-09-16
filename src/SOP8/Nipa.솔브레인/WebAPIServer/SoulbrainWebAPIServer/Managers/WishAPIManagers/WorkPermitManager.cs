using dnsDapperDBUtil.DataAccessLayer.DAL;
using SoulbrainWebAPIServer.Model;
using System;
using System.Collections.Generic;

namespace SoulbrainWebAPIServer.Managers
{
    public class WorkPermitManager
    {
        DataManager m_dataManager = null;
        DataManager m_wishDataManager = null;

        public WorkPermitManager(DataManager dataManager, DataManager wishDataManager)
        {
            m_dataManager = dataManager;
            m_wishDataManager = wishDataManager;
        }

        public ResponseCurrentWorkPermitData GetWorkPermitData()
        {
            ResponseCurrentWorkPermitData response = new ResponseCurrentWorkPermitData();

            try
            {
                string strSQL =
                    $@"SELECT GENERAL_CNT, 
                              FIRE_CNT, 
                              HIGH_CNT, 
                              ELEC_CNT, 
                              CLOSENESS_CNT, 
                              CRANE_CNT, 
                              DIGG_CNT, 
                              RADI_CNT, 
                              TOTAL_CNT, 
                              PLANT_PRCS_ID 
                        From SWOV_CURRENT_WORK_PERMIT";

                IEnumerable<dynamic> result = m_wishDataManager.GetSelect().Select(strSQL, out string strErrorMessage);

                if (result == null)
                {
                    response.Success = false;
                    response.Message = strErrorMessage;
                    return response;
                }

                foreach (var item in result)
                {
                    CurrentWorkPermit currentWorkPermit = new CurrentWorkPermit();
                    currentWorkPermit.GENERAL_CNT = (int)item.GENERAL_CNT;
                    currentWorkPermit.FIRE_CNT = (int)item.FIRE_CNT;
                    currentWorkPermit.HIGH_CNT = (int)item.HIGH_CNT;
                    currentWorkPermit.ELEC_CNT = (int)item.ELEC_CNT;
                    currentWorkPermit.CLOSENESS_CNT = (int)item.CLOSENESS_CNT;
                    currentWorkPermit.CRANE_CNT = (int)item.CRANE_CNT;
                    currentWorkPermit.DIGG_CNT = (int)item.DIGG_CNT;
                    currentWorkPermit.RADI_CNT = (int)item.RADI_CNT;
                    currentWorkPermit.TOTAL_CNT = (int)item.TOTAL_CNT;
                    currentWorkPermit.PLANT_PRCS_ID = item.PLANT_PRCS_ID;
                    currentWorkPermit.UpdateTime = DateTime.Now;

                    response.CurrentWorkPermitList.Add(currentWorkPermit);
                }

            }
            catch (Exception e)
            {
                response.Success = false;
                response.Message = e.Message;
                return response;
            }
            
            response.Success = true;
            return response;
        }
    }
}