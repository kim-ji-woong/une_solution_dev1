using System;
using System.Collections;
using System.Collections.Generic;
using dnsDBUtil;

namespace SVMSServer.DAL
{
	using Models;

	public class DeleteManager : QueryManager
	{
		private DataManager m_dataManager = null;

		public DeleteManager(DataManager dataManager)
		{
			m_dataManager = dataManager;
			m_dbManager = m_dataManager.GetDBManager() as DirectDBManager;
		}

		private bool DeleteFromID(string strTableName, int nID, out string strErrorMessage)
		{
			string strSQL = string.Format("Delete from {0} where ID = {1}", strTableName, nID);

			if (m_dbManager.GetResultData(strSQL) == null)
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
				return false;
			}

			strErrorMessage = null;
			return true;
		}

		private bool DeleteFromCondition(string strTableName, string strCondition, string strAdditionalConditions, out string strErrorMessage)
		{
			if (strAdditionalConditions != null && strAdditionalConditions.Length > 0)
			{
				if (strCondition.Length > 0)
					strCondition += " And " + strAdditionalConditions;
				else
					strCondition = strAdditionalConditions;
			}

			string strSQL = string.Format("Delete from {0}", strTableName);

			if (strCondition.Length > 0)
				strSQL += " Where " + strCondition;

			if (m_dbManager.GetResultData(strSQL) == null)
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
				return false;
			}

			strErrorMessage = null;
			return true;
		}

		public bool DeleteCCTV(int sensor_sn, out string strErrorMessage)
		{
			Dictionary<CCTV.Fields, object> dicConditions = new Dictionary<CCTV.Fields, object>();
			dicConditions[CCTV.Fields.sensor_sn] = sensor_sn;

			return DeleteCCTV(dicConditions, null, out strErrorMessage);
		}

		public bool DeleteCCTV(Dictionary<CCTV.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			strErrorMessage = null;
			string strCondition = "";

			if (SetCondition<CCTV.Fields>(ref strCondition, dicConditions, CCTV.GetFieldName, CCTV.TableName, ref strErrorMessage) == false)
				return false;

			return DeleteFromCondition(CCTV.TableName, strCondition, strAdditionalConditions, out strErrorMessage);
		}
	}
}
