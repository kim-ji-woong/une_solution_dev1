using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SVMSServer.Models
{
    public class CCTV
    {
		public enum Fields { sensor_sn, sensor_ty_optn_code, sensor_ty_code, cctv_no, unq_key, indoor_yn, strmg_ty, chnnl, user_id, password, url, hd_url, ld_url, camera_ip, camera_makr_name, camera_model_name };

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

		public static string GetFieldName(Fields field, out bool isNullable)
		{
			if (field == Fields.chnnl ||
				field == Fields.user_id ||
				field == Fields.password ||
				field == Fields.hd_url ||
				field == Fields.ld_url ||
				field == Fields.camera_ip ||
				field == Fields.camera_makr_name ||
				field == Fields.camera_model_name)
				isNullable = true;
			else
				isNullable = false;

			return field.ToString();
		}
	}
}
