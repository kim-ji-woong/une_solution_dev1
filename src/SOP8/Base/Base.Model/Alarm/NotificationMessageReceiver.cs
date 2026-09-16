using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace Base.Model.Alarm
{
	public class NotificationMessageReceiver : Table
	{
		public enum Fields { rcver_sn, ntcn_sn, rgl_sn, rgl_memb_sn, tmpr_sn, tmpr_memb_sn };
		public enum WriteFields { ntcn_sn, rgl_sn, rgl_memb_sn, tmpr_sn, tmpr_memb_sn };

		public int rcver_sn { get; set; }
		public int ntcn_sn { get; set; }
		public int? rgl_sn { get; set; }
		public int? rgl_memb_sn { get; set; }
		public int? tmpr_sn { get; set; }
		public int? tmpr_memb_sn { get; set; }

		public static string TableName { get { return "al_ntcn_mssage_rcver"; } }

		public override string GetTableName()
		{
			return TableName;
		}

		public override string GetPrimaryCondition()
		{
			return string.Format("{0} = {1}", Fields.rcver_sn, rcver_sn);
		}

		public override Type GetFieldType()
		{
			return typeof(Fields);
		}

		public override Type GetWriteFieldType()
		{
			return typeof(WriteFields);
		}

		public void FromCopy(NotificationMessageReceiver obj)
		{
			this.rcver_sn = obj.rcver_sn;
			this.ntcn_sn = obj.ntcn_sn;
			this.rgl_sn = obj.rgl_sn;
			this.rgl_memb_sn = obj.rgl_memb_sn;
			this.tmpr_sn = obj.tmpr_sn;
			this.tmpr_memb_sn = obj.tmpr_memb_sn;
		}
	}
}
