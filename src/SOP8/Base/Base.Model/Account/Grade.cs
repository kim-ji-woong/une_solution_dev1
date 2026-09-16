using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace Base.Model.Account
{
	public class Grade : Table
	{
		public enum Fields { grad_sn, grad_name };
		public enum WriteFields { grad_sn, grad_name };

		public int grad_sn { get; set; }
		public string grad_name { get; set; }

		public static string TableName { get { return "acc_grad"; } }

		public override string GetTableName()
		{
			return TableName;
		}

		public override string GetPrimaryCondition()
		{
			return string.Format("{0} = {1}", Fields.grad_sn, grad_sn);
		}

		public override Type GetFieldType()
		{
			return typeof(Fields);
		}

		public override Type GetWriteFieldType()
		{
			return typeof(WriteFields);
		}

		public void FromCopy(Grade obj)
		{
			this.grad_sn = obj.grad_sn;
			this.grad_name = obj.grad_name;
		}
	}
}
