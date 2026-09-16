using dnsDapperDBUtil.DataAccessLayer.IDAL;
using System;

namespace dnsDapperDBUtil.DataAccessLayer.DAL
{
    public class DeleteManager : QueryManager, IDelete
    {
        public DeleteManager(IDataManager dataManager)
        {
            m_dbManager = dataManager.GetDBManager();
        }

        public bool Delete<T>(string strConditions, out string strErrMsg) where T : Table, new()
        {
            try
            {
                T t = new T();

                string strSQL = $"delete from {t.GetTableName()} where (1=1)";
                strSQL += GetConditions(strConditions);

                return m_dbManager.Excute(strSQL, out strErrMsg);
            }
            catch (Exception e)
            {
                strErrMsg = e.Message;
                return false;
            }
        }

        public bool Delete<T>(T t, string strAdditionalConditions, out string strErrMsg) where T : Table
        {
            try
            {
                string strConditions = t.GetPrimaryCondition();

                if (strAdditionalConditions != null)
                {
                    strAdditionalConditions = strAdditionalConditions.Trim();

                    if (strAdditionalConditions.Length > 0)
                    {
                        if (strConditions.Length == 0)
                            strConditions = strAdditionalConditions;
                        else
                            strConditions += " and " + strAdditionalConditions;
                    }
                }

                string strSQL = $"delete from {t.GetTableName()} where (1=1)";
                strSQL += GetConditions(strConditions);

                return m_dbManager.Excute(strSQL, out strErrMsg);
            }
            catch (Exception e)
            {
                strErrMsg = e.Message;
                return false;
            }
        }
    }
}
