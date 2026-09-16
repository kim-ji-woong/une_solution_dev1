using System;
using System.Collections;
using System.Collections.Generic;
using dnsDBUtil;

namespace SVMSServer.DAL
{
	using Models;

	public class CreateManager : QueryManager
	{
		private DataManager m_dataManager = null;
		private const int FindCountLimit = 100;

		public CreateManager(DataManager dataManager)
		{
			m_dataManager = dataManager;
			m_dbManager = m_dataManager.GetDBManager() as DirectDBManager;
		}

		private string GetInsertErrorMessage(string tableName)
		{
			return string.Format("{0} 테이블의 데이터 삽입에 실패하였습니다.", tableName);
		}

		private bool EqualsValue(object oldObj, object newObj)
		{
			if (oldObj == null && newObj == null)
				return true;

			if (oldObj is DateTime)
			{
				DateTime dt1, dt2;
				if (DateTime.TryParse(oldObj.ToString(), out dt1) && DateTime.TryParse(newObj.ToString(), out dt2))
				{
					if (Convert.ToDateTime(oldObj).ToString("yyyyMMddHHmmss") == Convert.ToDateTime(newObj).ToString("yyyyMMddHHmmss"))
						return true;
				}
				else
				{
					if (oldObj.ToString().Trim() == newObj.ToString().Trim())
						return true;
				}
			}

			return false;
		}

		public CCTV CreateCCTV(CCTV obj, out string strErrorMessage)
		{
			strErrorMessage = null;
			Dictionary<CCTV.Fields, object> dicFieldDatas = new Dictionary<CCTV.Fields, object>();
			dicFieldDatas[CCTV.Fields.sensor_sn] = obj.sensor_sn;
			dicFieldDatas[CCTV.Fields.sensor_ty_optn_code] = obj.sensor_ty_optn_code;
			dicFieldDatas[CCTV.Fields.sensor_ty_code] = obj.sensor_ty_code;
			dicFieldDatas[CCTV.Fields.cctv_no] = obj.cctv_no;
			dicFieldDatas[CCTV.Fields.unq_key] = obj.unq_key;
			dicFieldDatas[CCTV.Fields.indoor_yn] = obj.indoor_yn;
			dicFieldDatas[CCTV.Fields.strmg_ty] = obj.strmg_ty;
			dicFieldDatas[CCTV.Fields.chnnl] = obj.chnnl;
			dicFieldDatas[CCTV.Fields.user_id] = obj.user_id;
			dicFieldDatas[CCTV.Fields.password] = obj.password;
			dicFieldDatas[CCTV.Fields.url] = obj.url;
			dicFieldDatas[CCTV.Fields.hd_url] = obj.hd_url;
			dicFieldDatas[CCTV.Fields.ld_url] = obj.ld_url;
			dicFieldDatas[CCTV.Fields.camera_ip] = obj.camera_ip;
			dicFieldDatas[CCTV.Fields.camera_makr_name] = obj.camera_makr_name;
			dicFieldDatas[CCTV.Fields.camera_model_name] = obj.camera_model_name;

			string strSQL = string.Format("Insert into {0} ({1}) values ({2})",
				CCTV.TableName,
				GetFieldNames<CCTV.Fields>(),
				GetFieldValues(dicFieldDatas));

			ArrayList arrResult = m_dbManager.GetResultData(strSQL);

			if (arrResult != null)
			{
				CCTV cctv = new CCTV();

				cctv.sensor_sn = obj.sensor_sn;
				cctv.sensor_ty_optn_code = obj.sensor_ty_optn_code;
				cctv.sensor_ty_code = obj.sensor_ty_code;
				cctv.cctv_no = obj.cctv_no;
				cctv.unq_key = obj.unq_key;
				cctv.indoor_yn = obj.indoor_yn;
				cctv.strmg_ty = obj.strmg_ty;
				cctv.chnnl = obj.chnnl;
				cctv.user_id = obj.user_id;
				cctv.password = obj.password;
				cctv.url = obj.url;
				cctv.hd_url = obj.hd_url;
				cctv.ld_url = obj.ld_url;
				cctv.camera_ip = obj.camera_ip;
				cctv.camera_makr_name = obj.camera_makr_name;
				cctv.camera_model_name = obj.camera_model_name;

				return cctv;
			}
			else
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
			}

			return null;
		}

		public Sensor CreateSensor(Sensor obj, out string strErrorMessage)
		{
			strErrorMessage = null;
			Dictionary<Sensor.Fields, object> dicFieldDatas = new Dictionary<Sensor.Fields, object>();
			dicFieldDatas[Sensor.Fields.sensor_ty_optn_code] = obj.sensor_ty_optn_code;
			dicFieldDatas[Sensor.Fields.sensor_ty_code] = obj.sensor_ty_code;
			dicFieldDatas[Sensor.Fields.sensor_name] = obj.sensor_name;
			dicFieldDatas[Sensor.Fields.lc_name] = obj.lc_name;
			dicFieldDatas[Sensor.Fields.x] = obj.x;
			dicFieldDatas[Sensor.Fields.y] = obj.y;
			dicFieldDatas[Sensor.Fields.z] = obj.z;
			dicFieldDatas[Sensor.Fields.zone_sn] = obj.zone_sn;
			dicFieldDatas[Sensor.Fields.site_sn] = obj.site_sn;
			dicFieldDatas[Sensor.Fields.sensor_sttus_optn_code] = obj.sensor_sttus_optn_code;
			dicFieldDatas[Sensor.Fields.sensor_sttus_code] = obj.sensor_sttus_code;
			dicFieldDatas[Sensor.Fields.enab] = obj.enab;
			dicFieldDatas[Sensor.Fields.deleted] = obj.deleted;
			dicFieldDatas[Sensor.Fields.manual_yn] = obj.manual_yn;

			string strSQL = string.Format("Insert into {0} ({1}) values (IsNull((SELECT MAX(sensor_sn) FROM {0} C), 0) + 1, {2})",
				Sensor.TableName,
				GetFieldNames<Sensor.Fields>(),
				GetFieldValues(dicFieldDatas));

			ArrayList arrResult = m_dbManager.GetResultData(strSQL);

			if (arrResult != null)
			{
				bool isNullable;
				string strCondition = string.Format("order by {0} desc, {1} desc, {2} desc",
					Sensor.GetFieldName(Sensor.Fields.sensor_sn, out isNullable),
					Sensor.GetFieldName(Sensor.Fields.sensor_ty_optn_code, out isNullable),
					Sensor.GetFieldName(Sensor.Fields.sensor_ty_code, out isNullable));

				// 가장 마지막에 삽입된 객체를 얻어온다.
				List<Sensor> datas = m_dataManager.GetSelectManager().SelectSensors(null, strCondition, 1, out strErrorMessage);

				if (datas == null || datas.Count == 0)
					return null;

				if (IsSameSensor(obj, datas[0]))
					return datas[0];

				return GetSensor(obj, datas[0].sensor_sn, datas[0].sensor_ty_optn_code, datas[0].sensor_ty_code, 2, FindCountLimit, out strErrorMessage);
			}
			else
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
			}

			return null;
		}

		public Sensor CreateSensor_Sn(Sensor obj, out string strErrorMessage)
		{
			strErrorMessage = null;
			Dictionary<Sensor.Fields, object> dicFieldDatas = new Dictionary<Sensor.Fields, object>();
			dicFieldDatas[Sensor.Fields.sensor_sn] = obj.sensor_sn;
			dicFieldDatas[Sensor.Fields.sensor_ty_optn_code] = obj.sensor_ty_optn_code;
			dicFieldDatas[Sensor.Fields.sensor_ty_code] = obj.sensor_ty_code;
			dicFieldDatas[Sensor.Fields.sensor_name] = obj.sensor_name;
			dicFieldDatas[Sensor.Fields.lc_name] = obj.lc_name;
			dicFieldDatas[Sensor.Fields.x] = obj.x;
			dicFieldDatas[Sensor.Fields.y] = obj.y;
			dicFieldDatas[Sensor.Fields.z] = obj.z;
			dicFieldDatas[Sensor.Fields.zone_sn] = obj.zone_sn;
			dicFieldDatas[Sensor.Fields.site_sn] = obj.site_sn;
			dicFieldDatas[Sensor.Fields.sensor_sttus_optn_code] = obj.sensor_sttus_optn_code;
			dicFieldDatas[Sensor.Fields.sensor_sttus_code] = obj.sensor_sttus_code;
			dicFieldDatas[Sensor.Fields.enab] = obj.enab;
			dicFieldDatas[Sensor.Fields.deleted] = obj.deleted;
			dicFieldDatas[Sensor.Fields.manual_yn] = obj.manual_yn;

			string strSQL = string.Format("Insert into {0} ({1}) values ({2})",
				Sensor.TableName,
				GetFieldNames<Sensor.Fields>(),
				GetFieldValues(dicFieldDatas));

			ArrayList arrResult = m_dbManager.GetResultData(strSQL);

			if (arrResult != null)
			{
				bool isNullable;
				string strCondition = string.Format("order by {0} desc, {1} desc, {2} desc",
					Sensor.GetFieldName(Sensor.Fields.sensor_sn, out isNullable),
					Sensor.GetFieldName(Sensor.Fields.sensor_ty_optn_code, out isNullable),
					Sensor.GetFieldName(Sensor.Fields.sensor_ty_code, out isNullable));

				// 가장 마지막에 삽입된 객체를 얻어온다.
				List<Sensor> datas = m_dataManager.GetSelectManager().SelectSensors(null, strCondition, 1, out strErrorMessage);

				if (datas == null || datas.Count == 0)
					return null;

				if (IsSameSensor(obj, datas[0]))
					return datas[0];

				return GetSensor(obj, datas[0].sensor_sn, datas[0].sensor_ty_optn_code, datas[0].sensor_ty_code, 2, FindCountLimit, out strErrorMessage);
			}
			else
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
			}

			return null;
		}

		private bool IsSameSensor(Sensor oldObject, Sensor newObject)
		{
			if (oldObject.sensor_ty_optn_code == newObject.sensor_ty_optn_code &&
				oldObject.sensor_ty_code == newObject.sensor_ty_code &&
				oldObject.sensor_name == newObject.sensor_name &&
				oldObject.lc_name == newObject.lc_name &&
				oldObject.zone_sn == newObject.zone_sn &&
				oldObject.site_sn == newObject.site_sn &&
				oldObject.sensor_sttus_optn_code == newObject.sensor_sttus_optn_code)
				return true;

			return false;
		}

		private Sensor GetSensor(Sensor obj, int sensor_sn, int sensor_ty_optn_code, int sensor_ty_code, int nCount, int nLimit, out string strErrorMessage)
		{
			bool isNullable;
			string strCondition = string.Format("{0} = {1} and {2} = {3} and {4} = {5} order by {0} desc, {2} desc, {4} desc",
				Sensor.GetFieldName(Sensor.Fields.sensor_sn, out isNullable), sensor_sn,
				Sensor.GetFieldName(Sensor.Fields.sensor_ty_optn_code, out isNullable), sensor_ty_optn_code,
				Sensor.GetFieldName(Sensor.Fields.sensor_ty_code, out isNullable), sensor_ty_code);
			List<Sensor> datas = m_dataManager.GetSelectManager().SelectSensors(null, strCondition, nCount, out strErrorMessage);

			if (datas == null)
				return null;

			foreach (Sensor data in datas)
			{
				if (IsSameSensor(data, obj))
					return data;

				if (data.sensor_ty_code < sensor_ty_code)
					sensor_ty_code = data.sensor_ty_code;
			}

			if (nCount < nLimit)
				return GetSensor(obj, sensor_sn, sensor_ty_optn_code, sensor_ty_code, nCount * 2, nLimit, out strErrorMessage);

			strErrorMessage = GetInsertErrorMessage(Sensor.TableName);
			return null;
		}

		public SensorZone CreateSensorZone(SensorZone obj, out string strErrorMessage)
		{
			strErrorMessage = null;
			Dictionary<SensorZone.Fields, object> dicFieldDatas = new Dictionary<SensorZone.Fields, object>();
			dicFieldDatas[SensorZone.Fields.sensor_sn] = obj.sensor_sn;
			dicFieldDatas[SensorZone.Fields.sensor_ty_optn_code] = obj.sensor_ty_optn_code;
			dicFieldDatas[SensorZone.Fields.sensor_ty_code] = obj.sensor_ty_code;
			dicFieldDatas[SensorZone.Fields.sensor_sub_ty_no] = obj.sensor_sub_ty_no;
			dicFieldDatas[SensorZone.Fields.unq_key] = obj.unq_key;
			dicFieldDatas[SensorZone.Fields.eqp_zone_sn] = obj.eqp_zone_sn;
			dicFieldDatas[SensorZone.Fields.alarm_yn] = obj.alarm_yn;
			dicFieldDatas[SensorZone.Fields.tag_no] = obj.tag_no;
			dicFieldDatas[SensorZone.Fields.acti] = obj.acti;
			dicFieldDatas[SensorZone.Fields.sensor_server_sn] = obj.sensor_server_sn;
			dicFieldDatas[SensorZone.Fields.descp] = obj.descp;

			string strSQL = string.Format("Insert into {0} ({1}) values (IsNull((SELECT MAX(sensor_zone_sn) FROM {0} C), 0) + 1, {2})",
				SensorZone.TableName,
				GetFieldNames<SensorZone.Fields>(),
				GetFieldValues(dicFieldDatas));

			ArrayList arrResult = m_dbManager.GetResultData(strSQL);

			if (arrResult != null)
			{
				bool isNullable;
				string strCondition = string.Format("order by {0} desc",
					SensorZone.GetFieldName(SensorZone.Fields.sensor_zone_sn, out isNullable));

				// 가장 마지막에 삽입된 객체를 얻어온다.
				List<SensorZone> datas = m_dataManager.GetSelectManager().SelectSensorZones(null, strCondition, 1, out strErrorMessage);

				if (datas == null || datas.Count == 0)
					return null;

				if (IsSameSensorZone(obj, datas[0]))
					return datas[0];

				return GetSensorZone(obj, datas[0].sensor_zone_sn, 2, FindCountLimit, out strErrorMessage);
			}
			else
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
			}

			return null;
		}

		public SensorZone CreateSensorZone_Sn(SensorZone obj, out string strErrorMessage)
		{
			strErrorMessage = null;
			Dictionary<SensorZone.Fields, object> dicFieldDatas = new Dictionary<SensorZone.Fields, object>();
			dicFieldDatas[SensorZone.Fields.sensor_zone_sn] = obj.sensor_zone_sn;
			dicFieldDatas[SensorZone.Fields.sensor_sn] = obj.sensor_sn;
			dicFieldDatas[SensorZone.Fields.sensor_ty_optn_code] = obj.sensor_ty_optn_code;
			dicFieldDatas[SensorZone.Fields.sensor_ty_code] = obj.sensor_ty_code;
			dicFieldDatas[SensorZone.Fields.sensor_sub_ty_no] = obj.sensor_sub_ty_no;
			dicFieldDatas[SensorZone.Fields.unq_key] = obj.unq_key;
			dicFieldDatas[SensorZone.Fields.eqp_zone_sn] = obj.eqp_zone_sn;
			dicFieldDatas[SensorZone.Fields.alarm_yn] = obj.alarm_yn;
			dicFieldDatas[SensorZone.Fields.tag_no] = obj.tag_no;
			dicFieldDatas[SensorZone.Fields.acti] = obj.acti;
			dicFieldDatas[SensorZone.Fields.sensor_server_sn] = obj.sensor_server_sn;
			dicFieldDatas[SensorZone.Fields.descp] = obj.descp;

			string strSQL = string.Format("Insert into {0} ({1}) values ({2})",
				SensorZone.TableName,
				GetFieldNames<SensorZone.Fields>(),
				GetFieldValues(dicFieldDatas));

			ArrayList arrResult = m_dbManager.GetResultData(strSQL);

			if (arrResult != null)
			{
				bool isNullable;
				string strCondition = string.Format("{0} = {1} order by {0} desc",
					SensorZone.GetFieldName(SensorZone.Fields.sensor_zone_sn, out isNullable), obj.sensor_zone_sn);

				List<SensorZone> datas = m_dataManager.GetSelectManager().SelectSensorZones(null, strCondition, 1, out strErrorMessage);

				if (datas == null || datas.Count == 0)
					return null;

				if (IsSameSensorZone(obj, datas[0]))
					return datas[0];

				return GetSensorZone(obj, datas[0].sensor_zone_sn, 2, FindCountLimit, out strErrorMessage);
			}
			else
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
			}

			return null;
		}

		private bool IsSameSensorZone(SensorZone oldObject, SensorZone newObject)
		{
			if (oldObject.sensor_sn == newObject.sensor_sn &&
				oldObject.sensor_ty_code == newObject.sensor_ty_code &&
				oldObject.sensor_sub_ty_no == newObject.sensor_sub_ty_no &&
				oldObject.unq_key == newObject.unq_key)
				return true;

			return false;
		}

		private SensorZone GetSensorZone(SensorZone obj, int sensor_zone_sn, int nCount, int nLimit, out string strErrorMessage)
		{
			bool isNullable;
			string strCondition = string.Format("{0} = {1} order by {0} desc",
				SensorZone.GetFieldName(SensorZone.Fields.sensor_zone_sn, out isNullable), sensor_zone_sn);
			List<SensorZone> datas = m_dataManager.GetSelectManager().SelectSensorZones(null, strCondition, nCount, out strErrorMessage);

			if (datas == null)
				return null;

			foreach (SensorZone data in datas)
			{
				if (IsSameSensorZone(data, obj))
					return data;

				if (data.sensor_zone_sn < sensor_zone_sn)
					sensor_zone_sn = data.sensor_zone_sn;
			}

			if (nCount < nLimit)
				return GetSensorZone(obj, sensor_zone_sn, nCount * 2, nLimit, out strErrorMessage);

			strErrorMessage = GetInsertErrorMessage(SensorZone.TableName);
			return null;
		}

		public SvmsEventHistory CreateSvmsEventHistory(SvmsEventHistory obj, out string strErrorMessage)
		{
			strErrorMessage = null;
			Dictionary<SvmsEventHistory.Fields, object> dicFieldDatas = new Dictionary<SvmsEventHistory.Fields, object>();
			dicFieldDatas[SvmsEventHistory.Fields.sensor_zone_sn] = obj.sensor_zone_sn;
			dicFieldDatas[SvmsEventHistory.Fields.sensor_ty_code] = obj.sensor_ty_code;
			dicFieldDatas[SvmsEventHistory.Fields.alarm_yn] = obj.alarm_yn;
			dicFieldDatas[SvmsEventHistory.Fields.process_yn] = obj.process_yn;

			string strFields = RemoveField(GetFieldNames<SvmsEventHistory.Fields>(), SvmsEventHistory.Fields.event_sn.ToString());

			string strSQL = string.Format("Insert into {0} ({1}) values ({2})",
				SvmsEventHistory.TableName,
				strFields,
				GetFieldValues(dicFieldDatas));

			ArrayList arrResult = m_dbManager.GetResultData(strSQL);

			if (arrResult != null)
			{
				SvmsEventHistory history = new SvmsEventHistory();
				history.sensor_zone_sn = obj.sensor_zone_sn;
				history.sensor_ty_code = obj.sensor_ty_code;
				history.alarm_yn = obj.alarm_yn;
				history.process_yn = obj.process_yn;

				return history;
			}
			else
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
			}

			return null;
		}

		private bool IsSameTime(DateTime? time1, DateTime? time2)
		{
			if (time1 == null && time2 == null)
				return true;
			else if (time1 == null || time2 == null)
				return false;

			return IsSameTime2((DateTime)time1, (DateTime)time2);
		}

		private bool IsSameTime2(DateTime time1, DateTime time2)
		{
			if (time1.Year == time2.Year &&
				time1.Month == time2.Month &&
				time1.Day == time2.Day &&
				time1.Hour == time2.Hour &&
				time1.Minute == time2.Minute &&
				time1.Second == time2.Second)
				return true;

			return false;
		}
	}
}