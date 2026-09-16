using DapperSample.IDAL;
using DapperSample.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace DapperSample.DAL
{
    public class UpdateManager : QueryManager, IUpdate
    {
        public UpdateManager(DataManager dataManager)
        {
            m_dbManager = dataManager.GetDbManager();
        }

        public bool Update<T, Fields>(Dictionary<Fields, object> dicSets, string strConditions, out string strErrMsg) where T : Table, new()
        {
            try
            {
                T t = new T();

                Dictionary<string, object> dicSetParams = null;
                string strSets = SetData<Fields>(dicSets, ref dicSetParams);
                if (strSets.Length == 0 || dicSetParams == null || dicSetParams.Count == 0)
                {
                    strErrMsg = "update params 오류";
                    return false;
                }

                string strSQL = $"update {t.GetTableName()} set {strSets} where (1=1)";
                strSQL += GetConditions(strConditions);

                m_dbManager.Excute(strSQL, dicSetParams, out strErrMsg);

                return true;
            }
            catch (Exception e)
            {
                strErrMsg = null;
                return false;
            }
        }

        public bool Update<T>(T t, string strAdditionalConditions, out string strErrMsg) where T : Table, new()
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

                if (t.GetWriteFieldType() != null)
                {
                    string strSets = t.GetParamFieldNames();
                    string strSQL = $"update {t.GetTableName()} set {strSets} where (1=1)";
                    strSQL += GetConditions(strConditions);

                    return m_dbManager.Excute(strSQL, t, out strErrMsg);
                }
                else
                {
                    strErrMsg = null;
                    return true;
                }
            }
            catch (Exception e)
            {
                strErrMsg = null;
                return false;
            }
        }
    }
}
