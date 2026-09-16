using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace Base.Model.History
{
	public class SMS : Table
	{
		public enum Fields { sms_hist_sn, sensor_zone_hist_sn, sensor_react_hist_sn, sms_contents, send_ty_optn_code, send_ty_code };
		public enum WriteFields { sensor_zone_hist_sn, sensor_react_hist_sn, sms_contents, send_ty_optn_code, send_ty_code };

		public int sms_hist_sn { get; set; }
		public int? sensor_zone_hist_sn { get; set; }
		public int? sensor_react_hist_sn { get; set; }
		public string/* nullable */ sms_contents { get; set; }
		public int? send_ty_optn_code { get; set; }
		public int? send_ty_code { get; set; }

		public static string TableName { get { return "his_sms"; } }

		public override string GetTableName()
		{
			return TableName;
		}

		public override string GetPrimaryCondition()
		{
			return string.Format("{0} = {1}", Fields.sms_hist_sn, sms_hist_sn);
		}

		public override Type GetFieldType()
		{
			return typeof(Fields);
		}

		public override Type GetWriteFieldType()
		{
			return typeof(WriteFields);
		}

		public void FromCopy(SMS obj)
		{
			this.sms_hist_sn = obj.sms_hist_sn;
			this.sensor_zone_hist_sn = obj.sensor_zone_hist_sn;
			this.sensor_react_hist_sn = obj.sensor_react_hist_sn;
			this.sms_contents = obj.sms_contents;
			this.send_ty_optn_code = obj.send_ty_optn_code;
			this.send_ty_code = obj.send_ty_code;
		}
	}
}
