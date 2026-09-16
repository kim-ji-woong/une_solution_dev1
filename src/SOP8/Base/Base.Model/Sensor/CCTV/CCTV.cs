using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace Base.Model.Sensor.CCTV
{
	public class CCTV : Table
	{
		public enum Fields { sensor_sn, sensor_ty_optn_code, sensor_ty_code, cctv_no, unq_key, indoor_yn, strmg_ty, chnnl, user_id, password, url, hd_url, ld_url, camera_ip, camera_makr_name, camera_model_name };
		public enum WriteFields { sensor_sn, sensor_ty_optn_code, sensor_ty_code, cctv_no, unq_key, indoor_yn, strmg_ty, chnnl, user_id, password, url, hd_url, ld_url, camera_ip, camera_makr_name, camera_model_name };

		public int sensor_sn { get; set; }
		public int sensor_ty_optn_code { get; set; }
		public int sensor_ty_code { get; set; }
		public int cctv_no { get; set; }
		public string unq_key { get; set; }
		public bool indoor_yn { get; set; }
		public string strmg_ty { get; set; }
		public int? chnnl { get; set; }
		public string/* nullable */ user_id { get; set; }
		public string/* nullable */ password { get; set; }
		public string url { get; set; }
		public string/* nullable */ hd_url { get; set; }
		public string/* nullable */ ld_url { get; set; }
		public string/* nullable */ camera_ip { get; set; }
		public string/* nullable */ camera_makr_name { get; set; }
		public string/* nullable */ camera_model_name { get; set; }

		public static string TableName { get { return "fa_cctv"; } }

		public override string GetTableName()
		{
			return TableName;
		}

		public override string GetPrimaryCondition()
		{
			return string.Format("{0} = {1}", Fields.sensor_sn, sensor_sn);
		}

		public override Type GetFieldType()
		{
			return typeof(Fields);
		}

		public override Type GetWriteFieldType()
		{
			return typeof(WriteFields);
		}

		public void FromCopy(CCTV obj)
		{
			this.sensor_sn = obj.sensor_sn;
			this.sensor_ty_optn_code = obj.sensor_ty_optn_code;
			this.sensor_ty_code = obj.sensor_ty_code;
			this.cctv_no = obj.cctv_no;
			this.unq_key = obj.unq_key;
			this.indoor_yn = obj.indoor_yn;
			this.strmg_ty = obj.strmg_ty;
			this.chnnl = obj.chnnl;
			this.user_id = obj.user_id;
			this.password = obj.password;
			this.url = obj.url;
			this.hd_url = obj.hd_url;
			this.ld_url = obj.ld_url;
			this.camera_ip = obj.camera_ip;
			this.camera_makr_name = obj.camera_makr_name;
			this.camera_model_name = obj.camera_model_name;
		}
	}
}
