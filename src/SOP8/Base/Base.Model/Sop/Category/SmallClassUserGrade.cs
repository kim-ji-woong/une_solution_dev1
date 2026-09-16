using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace Base.Model.Sop.Category
{
	public class SmallClassUserGrade : Table
	{
		public enum Fields { sclas_sn, grad_sn };
		public enum WriteFields { sclas_sn, grad_sn };

		public int sclas_sn { get; set; }
		public int grad_sn { get; set; }

		public static string TableName { get { return "so_ctgry_sclas_user_grad"; } }

		public override string GetTableName()
		{
			return TableName;
		}

		public override string GetPrimaryCondition()
		{
			return string.Format("{0} = {1} and {2} = {3}", Fields.sclas_sn, sclas_sn, Fields.grad_sn, grad_sn);
		}

		public override Type GetFieldType()
		{
			return typeof(Fields);
		}

		public override Type GetWriteFieldType()
		{
			return typeof(WriteFields);
		}

		public void FromCopy(SmallClassUserGrade obj)
		{
			this.sclas_sn = obj.sclas_sn;
			this.grad_sn = obj.grad_sn;
		}
	}
}
