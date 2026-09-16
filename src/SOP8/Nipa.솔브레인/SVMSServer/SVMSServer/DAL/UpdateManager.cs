using System;
using System.Collections;
using System.Collections.Generic;
using dnsDBUtil;

namespace SVMSServer.DAL
{
	using Models;

    public class UpdateManager : QueryManager
	{
		private DataManager m_dataManager = null;

		public UpdateManager(DataManager dataManager)
		{
			m_dataManager = dataManager;
			m_dbManager = m_dataManager.GetDBManager() as DirectDBManager;
		}

		public bool UpdateFromCondition(string strTableName, string strSets, string strCondition, string strAdditionalConditions, out string strErrorMessage)
		{
			if (strAdditionalConditions != null && strAdditionalConditions.Length > 0)
			{
				if (strCondition.Length > 0)
					strCondition += " and " + strAdditionalConditions;
				else
					strCondition = strAdditionalConditions;
			}

			string strSQL = string.Format("Update {0} set {1} where {2}", strTableName, strSets, strCondition);

			if (m_dbManager.GetResultData(strSQL) == null)
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
				return false;
			}

			strErrorMessage = null;
			return true;
		}

		public bool UpdateCCTV(CCTV obj, out string strErrorMessage)
		{
			Dictionary<CCTV.Fields, object> dicSets = new Dictionary<CCTV.Fields, object>();
			dicSets[CCTV.Fields.sensor_ty_optn_code] = obj.sensor_ty_optn_code;
			dicSets[CCTV.Fields.sensor_ty_code] = obj.sensor_ty_code;
			dicSets[CCTV.Fields.cctv_no] = obj.cctv_no;
			dicSets[CCTV.Fields.unq_key] = obj.unq_key;
			dicSets[CCTV.Fields.indoor_yn] = obj.indoor_yn;
			dicSets[CCTV.Fields.strmg_ty] = obj.strmg_ty;
			dicSets[CCTV.Fields.chnnl] = obj.chnnl;
			dicSets[CCTV.Fields.user_id] = obj.user_id;
			dicSets[CCTV.Fields.password] = obj.password;
			dicSets[CCTV.Fields.url] = obj.url;
			dicSets[CCTV.Fields.hd_url] = obj.hd_url;
			dicSets[CCTV.Fields.ld_url] = obj.ld_url;
			dicSets[CCTV.Fields.camera_ip] = obj.camera_ip;
			dicSets[CCTV.Fields.camera_makr_name] = obj.camera_makr_name;
			dicSets[CCTV.Fields.camera_model_name] = obj.camera_model_name;

			Dictionary<CCTV.Fields, object> dicConditions = new Dictionary<CCTV.Fields, object>();
			dicConditions[CCTV.Fields.sensor_sn] = obj.sensor_sn;

			return UpdateCCTV(dicSets, dicConditions, null, out strErrorMessage);
		}

		public bool UpdateCCTV(Dictionary<CCTV.Fields, object> dicSets, Dictionary<CCTV.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			strErrorMessage = null;
			string strCondition = "";
			string strSets = "";

			if (SetData<CCTV.Fields>(ref strSets, dicSets, CCTV.GetFieldName, CCTV.TableName, ref strErrorMessage) == false)
				return false;
			if (SetCondition<CCTV.Fields>(ref strCondition, dicConditions, CCTV.GetFieldName, CCTV.TableName, ref strErrorMessage) == false)
				return false;

			return UpdateFromCondition(CCTV.TableName, strSets, strCondition, strAdditionalConditions, out strErrorMessage);
		}

		public bool UpdateSensor(Sensor obj, out string strErrorMessage)
		{
			Dictionary<Sensor.Fields, object> dicSets = new Dictionary<Sensor.Fields, object>();
			dicSets[Sensor.Fields.sensor_name] = obj.sensor_name;
			dicSets[Sensor.Fields.lc_name] = obj.lc_name;
			dicSets[Sensor.Fields.x] = obj.x;
			dicSets[Sensor.Fields.y] = obj.y;
			dicSets[Sensor.Fields.z] = obj.z;
			dicSets[Sensor.Fields.zone_sn] = obj.zone_sn;
			dicSets[Sensor.Fields.site_sn] = obj.site_sn;
			dicSets[Sensor.Fields.sensor_sttus_optn_code] = obj.sensor_sttus_optn_code;
			dicSets[Sensor.Fields.sensor_sttus_code] = obj.sensor_sttus_code;
			dicSets[Sensor.Fields.enab] = obj.enab;
			dicSets[Sensor.Fields.deleted] = obj.deleted;

			Dictionary<Sensor.Fields, object> dicConditions = new Dictionary<Sensor.Fields, object>();
			dicConditions[Sensor.Fields.sensor_sn] = obj.sensor_sn;
			dicConditions[Sensor.Fields.sensor_ty_optn_code] = obj.sensor_ty_optn_code;
			dicConditions[Sensor.Fields.sensor_ty_code] = obj.sensor_ty_code;

			return UpdateSensor(dicSets, dicConditions, null, out strErrorMessage);
		}

		public bool UpdateSensor(Dictionary<Sensor.Fields, object> dicSets, Dictionary<Sensor.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			strErrorMessage = null;
			string strCondition = "";
			string strSets = "";

			if (SetData<Sensor.Fields>(ref strSets, dicSets, Sensor.GetFieldName, Sensor.TableName, ref strErrorMessage) == false)
				return false;
			if (SetCondition<Sensor.Fields>(ref strCondition, dicConditions, Sensor.GetFieldName, Sensor.TableName, ref strErrorMessage) == false)
				return false;

			return UpdateFromCondition(Sensor.TableName, strSets, strCondition, strAdditionalConditions, out strErrorMessage);
		}
	}
}
