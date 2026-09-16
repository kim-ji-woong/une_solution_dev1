using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace Base.Model.History
{
	public class SMSReceiver : Table
	{
		public enum Fields { sms_hist_sn, rgl_memb_sn };
		public enum WriteFields { sms_hist_sn, rgl_memb_sn };

		public int sms_hist_sn { get; set; }
		public int rgl_memb_sn { get; set; }

		public static string TableName { get { return "his_sms_rcver"; } }

		public override string GetTableName()
		{
			return TableName;
		}

		public override string GetPrimaryCondition()
		{
			return string.Format("{0} = {1} and {2} = {3}", Fields.sms_hist_sn, sms_hist_sn, Fields.rgl_memb_sn, rgl_memb_sn);
		}

		public override Type GetFieldType()
		{
			return typeof(Fields);
		}

		public override Type GetWriteFieldType()
		{
			return typeof(WriteFields);
		}

		public void FromCopy(SMSReceiver obj)
		{
			this.sms_hist_sn = obj.sms_hist_sn;
			this.rgl_memb_sn = obj.rgl_memb_sn;
		}
	}
}
