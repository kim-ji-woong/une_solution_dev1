using dnsDapperDBUtil.DataAccessLayer.IDAL;
using dnsDapperDBUtil.Manager;
using System;
using System.Collections.Generic;

namespace dnsDapperDBUtil.DataAccessLayer.DAL
{
    public class UpdateManager : QueryManager, IUpdate
    {
        public UpdateManager(IDataManager dataManager)
        {
            m_dbManager = dataManager.GetDBManager();
        }

        public bool Update<T, Fields>(Dictionary<Fields, object> dicSets, string strConditions, out string strErrMsg) where T : Table, new()
        {
            strErrMsg = null;

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

                return m_dbManager.Excute(strSQL, dicSetParams, out strErrMsg);
            }
            catch (Exception/* e*/)
            {
                return false;
            }
        }

        public bool Update<T>(T t, string strAdditionalConditions, out string strErrMsg) where T : Table
        {
            strErrMsg = null;

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
            catch (Exception/* e*/)
            {                
                return false;
            }
        }

        public bool Update<T>(List<T> ts, out string strErrMsg) where T : Table
        {
            strErrMsg = null;

            try
            {
                List<QueryParamSet> querySet = new List<QueryParamSet>();
                
                foreach (T t in ts)
                {
                    string strConditions = t.GetPrimaryCondition();
                    if (t.GetWriteFieldType() != null)
                    {
                        string strSets = t.GetParamFieldNames();

                        string strSQL = $"update {t.GetTableName()} set {strSets} where (1=1)";
                        strSQL += GetConditions(strConditions) + ";";

                        querySet.Add(new QueryParamSet() { SQL = strSQL, param = t });
                    }
                    else
                    {
                        strErrMsg = null;
                        return true;
                    } 
                }

                return m_dbManager.Excute(querySet, out strErrMsg);
            }
            catch (Exception/* e*/)
            {
                return false;
            }
        }

        public bool UpdateGeometry<T>(T t, out string strErrMsg) where T : Table
        {
            strErrMsg = null;

            try
            {
                string strConditions = t.GetPrimaryCondition();

                if (t.GetWriteFieldType() != null)
                {
                    string strSets = t.GetUpdateFieldDatas(m_dbManager.DatabaseType);
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
            catch (Exception/* e*/)
            {
                return false;
            }
        }

        public bool UpdateGeometry<T>(List<T> ts, out string strErrMsg) where T : Table
        {
            strErrMsg = null;

            try
            {
                List<QueryParamSet> querySet = new List<QueryParamSet>();

                foreach (T t in ts)
                {
                    string strConditions = t.GetPrimaryCondition();
                    if (t.GetWriteFieldType() != null)
                    {
                        string strSets = t.GetUpdateFieldDatas(m_dbManager.DatabaseType);
                        string strSQL = $"update {t.GetTableName()} set {strSets} where (1=1)";
                        strSQL += GetConditions(strConditions) + ";";

                        querySet.Add(new QueryParamSet() { SQL = strSQL, param = t });
                    }
                    else
                    {
                        strErrMsg = null;
                        return true;
                    }
                }

                return m_dbManager.Excute(querySet, out strErrMsg);
            }
            catch (Exception/* e*/)
            {
                return false;
            }
        }

        public bool Update(string strSQL, out string strErrMsg)
        {
            return m_dbManager.Excute(strSQL, out strErrMsg);
        }
    }
}
