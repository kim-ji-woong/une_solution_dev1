using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace Base.Model.Common
{
	public class Codes : Table
	{
		public enum Fields { code, cl_code, code_name, ordr_no };
		public enum WriteFields { code, cl_code, code_name, ordr_no };

		public int code { get; set; }
		public int cl_code { get; set; }
		public string code_name { get; set; }
		public int ordr_no { get; set; }

		public static string TableName { get { return "co_code"; } }

		public override string GetTableName()
		{
			return TableName;
		}

		public override string GetPrimaryCondition()
		{
			return string.Format("{0} = {1}", Fields.code, code);
		}

		public override Type GetFieldType()
		{
			return typeof(Fields);
		}

		public override Type GetWriteFieldType()
		{
			return typeof(WriteFields);
		}

		public void FromCopy(Codes obj)
		{
			this.code = obj.code;
			this.cl_code = obj.cl_code;
			this.code_name = obj.code_name;
			this.ordr_no = obj.ordr_no;
		}
	}
}
