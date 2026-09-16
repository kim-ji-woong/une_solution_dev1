using System;
using System.Collections;
using System.Collections.Generic;
using dnsDBUtil;

namespace SVMSServer.DAL
{
	using Models;

	public class SelectManager : QueryManager
	{
		private DataManager m_dataManager = null;

		public SelectManager(DataManager dataManager)
		{
			m_dataManager = dataManager;
			m_dbManager = m_dataManager.GetDBManager() as DirectDBManager;
		}

		private string GetDateTimeString(DateTime time)
		{
			return string.Format("{0}-{1:00}-{2:00} {3:00}:{4:00}:{5:00}", time.Year, time.Month, time.Day, time.Hour, time.Minute, time.Second);
		}

		public CCTV SelectCCTV(int sensor_sn, out string strErrorMessage)
		{
			strErrorMessage = null;
			int nFieldCount;

			string strSQL = string.Format("select {0} from {1} where sensor_sn = {2} ",
				GetFieldNames<CCTV.Fields>(out nFieldCount), CCTV.TableName
				, sensor_sn);

			ArrayList arrResult = m_dbManager.GetResultData(strSQL);

			if (arrResult != null && arrResult.Count >= nFieldCount)
			{
				CCTV model = ReadCCTV(arrResult, 0, out strErrorMessage);

				if (model == null)
					return null;

				return model;
			}
			else
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
			}

			return null;
		}

		public List<CCTV> SelectCCTVs(Dictionary<CCTV.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			return SelectCCTVs(dicConditions, strAdditionalConditions, null, out strErrorMessage);
		}

		public List<CCTV> SelectCCTVs(Dictionary<CCTV.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage)
		{
			strErrorMessage = null;
			int nFieldCount;

			string strSQL = string.Format("select {0} from {1}", GetFieldNames<CCTV.Fields>(out nFieldCount), CCTV.TableName);

			string strCondition = "";

			if (SetCondition<CCTV.Fields>(ref strCondition, dicConditions, CCTV.GetFieldName, CCTV.TableName, ref strErrorMessage) == false)
				return null;

			SetQuery(ref strSQL, strCondition, strAdditionalConditions);

			ArrayList arrResult = topNCount == null ? m_dbManager.GetResultData(strSQL) : m_dbManager.GetResultData(strSQL, (int)topNCount);

			if (arrResult == null)
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
				return null;
			}

			int nResultCount = arrResult.Count;
			List<CCTV> datas = new List<CCTV>();

			for (int i = 0; i < nResultCount - (nFieldCount - 1); i += nFieldCount)
			{
				CCTV model = ReadCCTV(arrResult, i, out strErrorMessage);

				if (model == null)
					return null;
				else
					datas.Add(model);
			}

			return datas;
		}

		private CCTV ReadCCTV(ArrayList arrResult, int index, out string strErrorMessage)
		{
			strErrorMessage = null;
			CCTV model = new CCTV();
			bool isNullable;

			foreach (CCTV.Fields field in CCTV.Fields.GetValues(typeof(CCTV.Fields)))
			{
				string strFieldName = CCTV.GetFieldName(field, out isNullable);

				if (field == CCTV.Fields.sensor_sn)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.sensor_sn = data.Data;
					}
				}
				else if (field == CCTV.Fields.sensor_ty_optn_code)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.sensor_ty_optn_code = data.Data;
					}
				}
				else if (field == CCTV.Fields.sensor_ty_code)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.sensor_ty_code = data.Data;
					}
				}
				else if (field == CCTV.Fields.cctv_no)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.cctv_no = data.Data;
					}
				}
				else if (field == CCTV.Fields.unq_key)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.unq_key = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.unq_key = data;
					}
				}
				else if (field == CCTV.Fields.indoor_yn)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.indoor_yn = data.Data == 1;
					}
				}
				else if (field == CCTV.Fields.strmg_ty)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.strmg_ty = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.strmg_ty = data;
					}
				}
				else if (field == CCTV.Fields.chnnl)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.chnnl = null;
					else
					{
						model.chnnl = data.Data;
					}
				}
				else if (field == CCTV.Fields.user_id)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.user_id = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.user_id = data;
					}
				}
				else if (field == CCTV.Fields.password)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.password = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.password = data;
					}
				}
				else if (field == CCTV.Fields.url)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.url = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.url = data;
					}
				}
				else if (field == CCTV.Fields.hd_url)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.hd_url = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.hd_url = data;
					}
				}
				else if (field == CCTV.Fields.ld_url)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.ld_url = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.ld_url = data;
					}
				}
				else if (field == CCTV.Fields.camera_ip)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.camera_ip = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.camera_ip = data;
					}
				}
				else if (field == CCTV.Fields.camera_makr_name)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.camera_makr_name = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.camera_makr_name = data;
					}
				}
				else if (field == CCTV.Fields.camera_model_name)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.camera_model_name = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.camera_model_name = data;
					}
				}

				index++;
			}

			return model;
		}

		public SubType SelectSubType(int sensor_ty_optn_code, int sensor_ty_code, int sensor_sub_ty_no, out string strErrorMessage)
		{
			strErrorMessage = null;
			int nFieldCount;

			string strSQL = string.Format("select {0} from {1} where sensor_ty_optn_code = {2} and sensor_ty_code = {3} and sensor_sub_ty_no = {4} ",
				GetFieldNames<SubType.Fields>(out nFieldCount), SubType.TableName
				, sensor_ty_optn_code
				, sensor_ty_code
				, sensor_sub_ty_no);

			ArrayList arrResult = m_dbManager.GetResultData(strSQL);

			if (arrResult != null && arrResult.Count >= nFieldCount)
			{
				SubType model = ReadSubType(arrResult, 0, out strErrorMessage);

				if (model == null)
					return null;

				return model;
			}
			else
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
			}

			return null;
		}

		public List<SubType> SelectSubTypes(Dictionary<SubType.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			return SelectSubTypes(dicConditions, strAdditionalConditions, null, out strErrorMessage);
		}

		public List<SubType> SelectSubTypes(Dictionary<SubType.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage)
		{
			strErrorMessage = null;
			int nFieldCount;

			string strSQL = string.Format("select {0} from {1}", GetFieldNames<SubType.Fields>(out nFieldCount), SubType.TableName);

			string strCondition = "";

			if (SetCondition<SubType.Fields>(ref strCondition, dicConditions, SubType.GetFieldName, SubType.TableName, ref strErrorMessage) == false)
				return null;

			SetQuery(ref strSQL, strCondition, strAdditionalConditions);

			ArrayList arrResult = topNCount == null ? m_dbManager.GetResultData(strSQL) : m_dbManager.GetResultData(strSQL, (int)topNCount);

			if (arrResult == null)
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
				return null;
			}

			int nResultCount = arrResult.Count;
			List<SubType> datas = new List<SubType>();

			for (int i = 0; i < nResultCount - (nFieldCount - 1); i += nFieldCount)
			{
				SubType model = ReadSubType(arrResult, i, out strErrorMessage);

				if (model == null)
					return null;
				else
					datas.Add(model);
			}

			return datas;
		}

		private SubType ReadSubType(ArrayList arrResult, int index, out string strErrorMessage)
		{
			strErrorMessage = null;
			SubType model = new SubType();
			bool isNullable;

			foreach (SubType.Fields field in SubType.Fields.GetValues(typeof(SubType.Fields)))
			{
				string strFieldName = SubType.GetFieldName(field, out isNullable);

				if (field == SubType.Fields.sensor_ty_optn_code)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.sensor_ty_optn_code = data.Data;
					}
				}
				else if (field == SubType.Fields.sensor_ty_code)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.sensor_ty_code = data.Data;
					}
				}
				else if (field == SubType.Fields.sensor_sub_ty_no)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.sensor_sub_ty_no = data.Data;
					}
				}
				else if (field == SubType.Fields.sensor_sub_ty_name)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.sensor_sub_ty_name = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.sensor_sub_ty_name = data;
					}
				}
				else if (field == SubType.Fields.uom)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.uom = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.uom = data;
					}
				}
				else if (field == SubType.Fields.descp)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.descp = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.descp = data;
					}
				}

				index++;
			}

			return model;
		}

		public Sensor SelectSensor(int sensor_sn, int sensor_ty_optn_code, int sensor_ty_code, out string strErrorMessage)
		{
			strErrorMessage = null;
			int nFieldCount;

			string strSQL = string.Format("select {0} from {1} where sensor_sn = {2} and sensor_ty_optn_code = {3} and sensor_ty_code = {4} ",
				GetFieldNames<Sensor.Fields>(out nFieldCount), Sensor.TableName
				, sensor_sn
				, sensor_ty_optn_code
				, sensor_ty_code);

			ArrayList arrResult = m_dbManager.GetResultData(strSQL);

			if (arrResult != null && arrResult.Count >= nFieldCount)
			{
				Sensor model = ReadSensor(arrResult, 0, out strErrorMessage);

				if (model == null)
					return null;

				return model;
			}
			else
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
			}

			return null;
		}

		public List<Sensor> SelectSensors(Dictionary<Sensor.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			return SelectSensors(dicConditions, strAdditionalConditions, null, out strErrorMessage);
		}

		public List<Sensor> SelectSensors(Dictionary<Sensor.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage)
		{
			strErrorMessage = null;
			int nFieldCount;

			string strSQL = string.Format("select {0} from {1}", GetFieldNames<Sensor.Fields>(out nFieldCount), Sensor.TableName);

			string strCondition = "";

			if (SetCondition<Sensor.Fields>(ref strCondition, dicConditions, Sensor.GetFieldName, Sensor.TableName, ref strErrorMessage) == false)
				return null;

			SetQuery(ref strSQL, strCondition, strAdditionalConditions);

			ArrayList arrResult = topNCount == null ? m_dbManager.GetResultData(strSQL) : m_dbManager.GetResultData(strSQL, (int)topNCount);

			if (arrResult == null)
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
				return null;
			}

			int nResultCount = arrResult.Count;
			List<Sensor> datas = new List<Sensor>();

			for (int i = 0; i < nResultCount - (nFieldCount - 1); i += nFieldCount)
			{
				Sensor model = ReadSensor(arrResult, i, out strErrorMessage);

				if (model == null)
					return null;
				else
					datas.Add(model);
			}

			return datas;
		}

		private Sensor ReadSensor(ArrayList arrResult, int index, out string strErrorMessage)
		{
			strErrorMessage = null;
			Sensor model = new Sensor();
			bool isNullable;

			foreach (Sensor.Fields field in Sensor.Fields.GetValues(typeof(Sensor.Fields)))
			{
				string strFieldName = Sensor.GetFieldName(field, out isNullable);

				if (field == Sensor.Fields.sensor_sn)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.sensor_sn = data.Data;
					}
				}
				else if (field == Sensor.Fields.sensor_ty_optn_code)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.sensor_ty_optn_code = data.Data;
					}
				}
				else if (field == Sensor.Fields.sensor_ty_code)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.sensor_ty_code = data.Data;
					}
				}
				else if (field == Sensor.Fields.sensor_name)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.sensor_name = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.sensor_name = data;
					}
				}
				else if (field == Sensor.Fields.lc_name)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.lc_name = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.lc_name = data;
					}
				}
				else if (field == Sensor.Fields.x)
				{
					VariousData<float> data = WebDBManager.GetFloatField(arrResult[index].ToString());

					if (data == null)
						model.x = null;
					else
					{
						model.x = data.Data;
					}
				}
				else if (field == Sensor.Fields.y)
				{
					VariousData<float> data = WebDBManager.GetFloatField(arrResult[index].ToString());

					if (data == null)
						model.y = null;
					else
					{
						model.y = data.Data;
					}
				}
				else if (field == Sensor.Fields.z)
				{
					VariousData<float> data = WebDBManager.GetFloatField(arrResult[index].ToString());

					if (data == null)
						model.z = null;
					else
					{
						model.z = data.Data;
					}
				}
				else if (field == Sensor.Fields.zone_sn)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.zone_sn = null;
					else
					{
						model.zone_sn = data.Data;
					}
				}
				else if (field == Sensor.Fields.site_sn)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.site_sn = data.Data;
					}
				}
				else if (field == Sensor.Fields.sensor_sttus_optn_code)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.sensor_sttus_optn_code = null;
					else
					{
						model.sensor_sttus_optn_code = data.Data;
					}
				}
				else if (field == Sensor.Fields.sensor_sttus_code)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.sensor_sttus_code = null;
					else
					{
						model.sensor_sttus_code = data.Data;
					}
				}
				else if (field == Sensor.Fields.enab)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.enab = data.Data == 1;
					}
				}
				else if (field == Sensor.Fields.deleted)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.deleted = data.Data == 1;
					}
				}

				index++;
			}

			return model;
		}

		public SensorZone SelectSensorZone(int sensor_zone_sn, out string strErrorMessage)
		{
			strErrorMessage = null;
			int nFieldCount;

			string strSQL = string.Format("select {0} from {1} where sensor_zone_sn = {2} ",
				GetFieldNames<SensorZone.Fields>(out nFieldCount), SensorZone.TableName
				, sensor_zone_sn);

			ArrayList arrResult = m_dbManager.GetResultData(strSQL);

			if (arrResult != null && arrResult.Count >= nFieldCount)
			{
				SensorZone model = ReadSensorZone(arrResult, 0, out strErrorMessage);

				if (model == null)
					return null;

				return model;
			}
			else
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
			}

			return null;
		}

		public List<SensorZone> SelectSensorZones(Dictionary<SensorZone.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			return SelectSensorZones(dicConditions, strAdditionalConditions, null, out strErrorMessage);
		}

		public List<SensorZone> SelectSensorZones(Dictionary<SensorZone.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage)
		{
			strErrorMessage = null;
			int nFieldCount;

			string strSQL = string.Format("select {0} from {1}", GetFieldNames<SensorZone.Fields>(out nFieldCount), SensorZone.TableName);

			string strCondition = "";

			if (SetCondition<SensorZone.Fields>(ref strCondition, dicConditions, SensorZone.GetFieldName, SensorZone.TableName, ref strErrorMessage) == false)
				return null;

			SetQuery(ref strSQL, strCondition, strAdditionalConditions);

			ArrayList arrResult = topNCount == null ? m_dbManager.GetResultData(strSQL) : m_dbManager.GetResultData(strSQL, (int)topNCount);

			if (arrResult == null)
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
				return null;
			}

			int nResultCount = arrResult.Count;
			List<SensorZone> datas = new List<SensorZone>();

			for (int i = 0; i < nResultCount - (nFieldCount - 1); i += nFieldCount)
			{
				SensorZone model = ReadSensorZone(arrResult, i, out strErrorMessage);

				if (model == null)
					return null;
				else
					datas.Add(model);
			}

			return datas;
		}

		private SensorZone ReadSensorZone(ArrayList arrResult, int index, out string strErrorMessage)
		{
			strErrorMessage = null;
			SensorZone model = new SensorZone();
			bool isNullable;

			foreach (SensorZone.Fields field in SensorZone.Fields.GetValues(typeof(SensorZone.Fields)))
			{
				string strFieldName = SensorZone.GetFieldName(field, out isNullable);

				if (field == SensorZone.Fields.sensor_zone_sn)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.sensor_zone_sn = data.Data;
					}
				}
				else if (field == SensorZone.Fields.sensor_sn)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.sensor_sn = data.Data;
					}
				}
				else if (field == SensorZone.Fields.sensor_ty_optn_code)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.sensor_ty_optn_code = data.Data;
					}
				}
				else if (field == SensorZone.Fields.sensor_ty_code)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.sensor_ty_code = data.Data;
					}
				}
				else if (field == SensorZone.Fields.sensor_sub_ty_no)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.sensor_sub_ty_no = null;
					else
					{
						model.sensor_sub_ty_no = data.Data;
					}
				}
				else if (field == SensorZone.Fields.unq_key)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.unq_key = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.unq_key = data;
					}
				}
				else if (field == SensorZone.Fields.eqp_zone_sn)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.eqp_zone_sn = null;
					else
					{
						model.eqp_zone_sn = data.Data;
					}
				}
				else if (field == SensorZone.Fields.alarm_yn)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.alarm_yn = data.Data == 1;
					}
				}
				else if (field == SensorZone.Fields.tag_no)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.tag_no = null;
					else
					{
						model.tag_no = data.Data;
					}
				}
				else if (field == SensorZone.Fields.acti)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.acti = data.Data == 1;
					}
				}
				else if (field == SensorZone.Fields.sensor_server_sn)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.sensor_server_sn = null;
					else
					{
						model.sensor_server_sn = data.Data;
					}
				}
				else if (field == SensorZone.Fields.descp)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.descp = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.descp = data;
					}
				}

				index++;
			}

			return model;
		}

		public ArrayList JoinSensorCCTV(string strAdditionalConditions, out string strErrorMessage)
        {
			int nSensorFieldCount, nCCTVFieldCount;
			string strSensorFields = GetFieldNames<Sensor.Fields>("a", out nSensorFieldCount);
			string strCCTVFields = GetFieldNames<CCTV.Fields>("b", out nCCTVFieldCount);

			string strSQL = string.Format("Select {0}, {1} from {2} a inner join {3} b on a.{4} = b.{5}",
				strSensorFields, strCCTVFields,
				Sensor.TableName, CCTV.TableName,
				Sensor.Fields.sensor_sn, CCTV.Fields.sensor_sn);

			if (strAdditionalConditions != null && strAdditionalConditions.Length > 0)
			{
				if (strAdditionalConditions.ToLower().Trim().StartsWith("order by"))
					strSQL += " " + strAdditionalConditions;
				else
					strSQL += " where " + strAdditionalConditions;
			}

			ArrayList arrResult = m_dbManager.GetResultData(strSQL);

			if (arrResult == null)
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
				return null;
			}

			int nFieldsCount = nSensorFieldCount + nCCTVFieldCount;

			ArrayList arrDatas = new ArrayList();
			int nResultCount = arrResult.Count;

			for (int i = 0; i < nResultCount - (nFieldsCount - 1); i += nFieldsCount)
			{
				Sensor sensor = ReadSensor(arrResult, i, out strErrorMessage);

				if (sensor == null)
					return null;
				else
					arrDatas.Add(sensor);

				CCTV cctv = ReadCCTV(arrResult, i + nSensorFieldCount, out strErrorMessage);

				if (cctv == null)
					return null;
				else
					arrDatas.Add(cctv);
			}

			strErrorMessage = null;
			return arrDatas;
		}

		public bool GetNewCCTVInfo(out int sensorNo, out int cctvNo, out string strErrorMessage)
        {
			sensorNo = cctvNo = -1;
			strErrorMessage = null;

			string strSQL = string.Format("select ISNULL(max({0}) + 1, 1), ISNULL(max({1}) + 1, 1) from {2}",
				CCTV.Fields.sensor_sn, CCTV.Fields.cctv_no, CCTV.TableName);
			
			ArrayList arrResult = m_dbManager.GetResultData(strSQL);

			if (arrResult == null)
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
				return false;
			}

			if (arrResult.Count == 2)
            {
				VariousData<int> newSensorNo = WebDBManager.GetIntField(arrResult[0].ToString());
				VariousData<int> newCCTVNo = WebDBManager.GetIntField(arrResult[1].ToString());

				if (newSensorNo != null && newCCTVNo != null)
                {
					sensorNo = newSensorNo.Data;
					cctvNo = newCCTVNo.Data;
					return true;
                }
			}

			strErrorMessage = "DB로부터 CCTV 정보를 읽어올 수 없습니다.";
			return false;
		}
	}
}
