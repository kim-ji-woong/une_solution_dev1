using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace Base.Model.Sensor
{
	public class ServerInfo : Table
	{
		public enum Fields { sensor_server_sn, lc, ip, port, cnnc_sttus, alarm_server_url, usab, sensor_server_ty_optn_code, sensor_server_ty_code, site_sn };
		public enum WriteFields { sensor_server_sn, lc, ip, port, cnnc_sttus, alarm_server_url, usab, sensor_server_ty_optn_code, sensor_server_ty_code, site_sn };

		public int sensor_server_sn { get; set; }
		public string lc { get; set; }
		public string ip { get; set; }
		public int? port { get; set; }
		public bool? cnnc_sttus { get; set; }
		public string/* nullable */ alarm_server_url { get; set; }
		public bool? usab { get; set; }
		public int sensor_server_ty_optn_code { get; set; }
		public int sensor_server_ty_code { get; set; }
		public int? site_sn { get; set; }

		public static string TableName { get { return "fa_sensor_server"; } }

		public override string GetTableName()
		{
			return TableName;
		}

		public override string GetPrimaryCondition()
		{
			return string.Format("{0} = {1}", Fields.sensor_server_sn, sensor_server_sn);
		}

		public override Type GetFieldType()
		{
			return typeof(Fields);
		}

		public override Type GetWriteFieldType()
		{
			return typeof(WriteFields);
		}

		public void FromCopy(ServerInfo obj)
		{
			this.sensor_server_sn = obj.sensor_server_sn;
			this.lc = obj.lc;
			this.ip = obj.ip;
			this.port = obj.port;
			this.cnnc_sttus = obj.cnnc_sttus;
			this.alarm_server_url = obj.alarm_server_url;
			this.usab = obj.usab;
			this.sensor_server_ty_optn_code = obj.sensor_server_ty_optn_code;
			this.sensor_server_ty_code = obj.sensor_server_ty_code;
			this.site_sn = obj.site_sn;
		}
	}
}
