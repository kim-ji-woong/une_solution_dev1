using System.Collections.Generic;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using Sop7ToSop8.Migration.Option.Models;

namespace Sop7ToSop8.Migration.Option
{
    class SystemOptionManager
    {
		private IMigrationClient m_client = null;
		private int m_nSop8SiteNo = -1;

		public SystemOptionManager(IMigrationClient client, int sop8SiteNo)
		{
			m_client = client;
			m_nSop8SiteNo = sop8SiteNo;
		}

		public bool Run()
		{
			m_client.SendStatus("SOP와 SDMS 관련 옵션 데이터를 읽어옵니다.");

			IDataManager dataManager = m_client.Sop8DataManager.Clone();
			if (!dataManager.BeginBatch(out var strErrorMessage))
			{
				return false;
			}

			if (!ReadSop7(dataManager, out strErrorMessage))
			{
				dataManager.BatchRollback(out var _);
				m_client.SendStatus(strErrorMessage);
				return false;
			}

			if (!dataManager.BatchCommit(out strErrorMessage))
			{
				dataManager.BatchRollback(out var _);
				return false;
			}

			m_client.SendStatus("SOP와 SDMS 관련 옵션 데이터를 옮기는데 성공하였습니다.");
			return true;
		}

		private bool ReadSop7(IDataManager dataManager, out string strErrorMessage)
		{
			List<object> arrResults = new List<object>();

			string strSQL = "Select ID, PropertyName, PropertyValue, SiteID, Description from OptionSDMS";
			IEnumerable<object> arrSdmsResults = m_client.Sop7DataManager.GetSelect().Select(strSQL, out strErrorMessage);
			
			if (arrSdmsResults == null)
			{
				return false;
			}

			strSQL = "Select ID, PropertyName, PropertyValue, SiteID, Description from OptionSOPSimulator";
			IEnumerable<object> arrSopResults = m_client.Sop7DataManager.GetSelect().Select(strSQL, out strErrorMessage);
			
			if (arrSopResults == null)
			{
				return false;
			}

			arrResults.AddRange(arrSdmsResults);
			arrResults.AddRange(arrSopResults);

			if (!dataManager.GetUpdate().Update("DBCC CHECKIDENT(" + OptionEx.TableName + ", reseed, 0)", out strErrorMessage))
			{
				return false;
			}
			if (!dataManager.GetUpdate().Update("SET IDENTITY_INSERT " + OptionEx.TableName + " ON", out strErrorMessage))
			{
				return false;
			}

			int index = 0;
			Dictionary<string, string> dicPropertyNames = new Dictionary<string, string>();

			foreach (dynamic data in arrResults)
			{
				if (!(dicPropertyNames.ContainsKey(data.PropertyName) ? true : false))
				{
					dicPropertyNames[data.PropertyName] = data.PropertyName;

					if (this.CreateSop8(dataManager, data, ++index, out strErrorMessage) == false)
					{
						dataManager.GetUpdate().Update("SET IDENTITY_INSERT " + OptionEx.TableName + " OFF", out var _);
						return false;
					}
				}
			}
			if (!dataManager.GetUpdate().Update("SET IDENTITY_INSERT " + OptionEx.TableName + " OFF", out strErrorMessage))
			{
				return false;
			}
			return true;
		}

		private bool CreateSop8(IDataManager dataManager, dynamic data, int optionNo, out string strErrorMessage)
		{
			OptionEx option = new OptionEx();
			option.optn_sn = optionNo;
			option.prop_name = data.PropertyName;
			option.site_sn = m_nSop8SiteNo;
			option.prop_value = data.PropertyValue;
			option.descp = data.Description;
			return dataManager.GetCreate().Insert(option, out strErrorMessage);
		}
	}
}
