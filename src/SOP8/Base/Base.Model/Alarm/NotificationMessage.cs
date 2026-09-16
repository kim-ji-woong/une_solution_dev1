using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace Base.Model.Alarm
{
	public class NotificationMessage : Table
	{
		public enum Fields { ntcn_sn, ntcn_name, sensor_ty_optn_code, sensor_ty_code, sensor_sub_ty_no, buld_group_sn, buld_sn, zone_sn, mssage, detct_ty_optn_code, detct_ty_code, mssage_ty_optn_code, mssage_ty_code, acti };
		public enum WriteFields { ntcn_name, sensor_ty_optn_code, sensor_ty_code, sensor_sub_ty_no, buld_group_sn, buld_sn, zone_sn, mssage, detct_ty_optn_code, detct_ty_code, mssage_ty_optn_code, mssage_ty_code, acti };

		public int ntcn_sn { get; set; }
		public string/* nullable */ ntcn_name { get; set; }
		public int sensor_ty_optn_code { get; set; }
		public int sensor_ty_code { get; set; }
		public int? sensor_sub_ty_no { get; set; }
		public int? buld_group_sn { get; set; }
		public int? buld_sn { get; set; }
		public int? zone_sn { get; set; }
		public string mssage { get; set; }
		public int detct_ty_optn_code { get; set; }
		public int detct_ty_code { get; set; }
		public int mssage_ty_optn_code { get; set; }
		public int mssage_ty_code { get; set; }
		public bool acti { get; set; }

		public static string TableName { get { return "al_ntcn_mssage"; } }

		public override string GetTableName()
		{
			return TableName;
		}

		public override string GetPrimaryCondition()
		{
			return string.Format("{0} = {1}", Fields.ntcn_sn, ntcn_sn);
		}

		public override Type GetFieldType()
		{
			return typeof(Fields);
		}

		public override Type GetWriteFieldType()
		{
			return typeof(WriteFields);
		}

		public void FromCopy(NotificationMessage obj)
		{
			this.ntcn_sn = obj.ntcn_sn;
			this.ntcn_name = obj.ntcn_name;
			this.sensor_ty_optn_code = obj.sensor_ty_optn_code;
			this.sensor_ty_code = obj.sensor_ty_code;
			this.sensor_sub_ty_no = obj.sensor_sub_ty_no;
			this.buld_group_sn = obj.buld_group_sn;
			this.buld_sn = obj.buld_sn;
			this.zone_sn = obj.zone_sn;
			this.mssage = obj.mssage;
			this.mssage_ty_optn_code = obj.mssage_ty_optn_code;
			this.mssage_ty_code = obj.mssage_ty_code;
			this.acti = obj.acti;
		}
	}
}
