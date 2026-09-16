using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace Base.Model.Sensor
{
	public class FacilityManager : Table
	{
		public enum Fields { fclty_mgr_sn, sensor_ty_optn_code, sensor_ty_code, detct_ty_optn_code, detct_ty_code, site_sn, buld_group_sn, buld_sn, eqp_zone_sn };
		public enum WriteFields { fclty_mgr_sn, sensor_ty_optn_code, sensor_ty_code, detct_ty_optn_code, detct_ty_code, site_sn, buld_group_sn, buld_sn, eqp_zone_sn };

		public int fclty_mgr_sn { get; set; }
		public int sensor_ty_optn_code { get; set; }
		public int sensor_ty_code { get; set; }
		public int detct_ty_optn_code { get; set; }
		public int detct_ty_code { get; set; }
		public int? site_sn { get; set; }
		public int? buld_group_sn { get; set; }
		public int? buld_sn { get; set; }
		public int? eqp_zone_sn { get; set; }

		public static string TableName { get { return "fa_sensor_fclty_mgr"; } }

		public override string GetTableName()
		{
			return TableName;
		}

		public override string GetPrimaryCondition()
		{
			return string.Format("{0} = {1}", Fields.fclty_mgr_sn, fclty_mgr_sn);
		}

		public override Type GetFieldType()
		{
			return typeof(Fields);
		}

		public override Type GetWriteFieldType()
		{
			return typeof(WriteFields);
		}

		public void FromCopy(FacilityManager obj)
		{
			this.fclty_mgr_sn = obj.fclty_mgr_sn;
			this.sensor_ty_optn_code = obj.sensor_ty_optn_code;
			this.sensor_ty_code = obj.sensor_ty_code;
			this.detct_ty_optn_code = obj.detct_ty_optn_code;
			this.detct_ty_code = obj.detct_ty_code;
			this.site_sn = obj.site_sn;
			this.buld_group_sn = obj.buld_group_sn;
			this.buld_sn = obj.buld_sn;
			this.eqp_zone_sn = obj.eqp_zone_sn;
		}
	}
}
