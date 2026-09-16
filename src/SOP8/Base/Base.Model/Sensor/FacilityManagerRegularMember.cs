using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace Base.Model.Sensor
{
	public class FacilityManagerRegularMember : Table
	{
		public enum Fields { fclty_mgr_sn, rgl_memb_sn };
		public enum WriteFields { fclty_mgr_sn, rgl_memb_sn };

		public int fclty_mgr_sn { get; set; }
		public int rgl_memb_sn { get; set; }

		public static string TableName { get { return "fa_sensor_fclty_mgr_rgl_memb"; } }

		public override string GetTableName()
		{
			return TableName;
		}

		public override string GetPrimaryCondition()
		{
			return string.Format("{0} = {1} and {2} = {3}", Fields.fclty_mgr_sn, fclty_mgr_sn, Fields.rgl_memb_sn, rgl_memb_sn);
		}

		public override Type GetFieldType()
		{
			return typeof(Fields);
		}

		public override Type GetWriteFieldType()
		{
			return typeof(WriteFields);
		}

		public void FromCopy(FacilityManagerRegularMember obj)
		{
			this.fclty_mgr_sn = obj.fclty_mgr_sn;
			this.rgl_memb_sn = obj.rgl_memb_sn;
		}
	}
}
