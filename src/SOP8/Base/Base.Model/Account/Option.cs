using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace Base.Model.Account
{
	public class Option : Table
	{
		public enum Fields { user_sn, optn_cl, optn_sclas, optn_indx, optn_value };
		public enum WriteFields { user_sn, optn_cl, optn_sclas, optn_indx, optn_value };

		public int user_sn { get; set; }
		public string optn_cl { get; set; }
		public string optn_sclas { get; set; }
		public int optn_indx { get; set; }
		public string/* nullable */ optn_value { get; set; }

		public static string TableName { get { return "acc_optn"; } }

		public override string GetTableName()
		{
			return TableName;
		}

		public override string GetPrimaryCondition()
		{
			return string.Format("{0} = {1} and {2} = '{3}' and {4} = '{5}' and {6} = {7}", Fields.user_sn, user_sn, Fields.optn_cl, optn_cl, Fields.optn_sclas, optn_sclas, Fields.optn_indx, optn_indx);
		}

		public override Type GetFieldType()
		{
			return typeof(Fields);
		}

		public override Type GetWriteFieldType()
		{
			return typeof(WriteFields);
		}

		public void FromCopy(Option obj)
		{
			this.user_sn = obj.user_sn;
			this.optn_cl = obj.optn_cl;
			this.optn_sclas = obj.optn_sclas;
			this.optn_indx = obj.optn_indx;
			this.optn_value = obj.optn_value;
		}
	}
}
