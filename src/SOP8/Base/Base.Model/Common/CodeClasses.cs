using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace Base.Model.Common
{
	public class CodeClasses : Table
	{
		public enum Fields { cl_code, ty_name, ty_eng_name };
		public enum WriteFields { cl_code, ty_name, ty_eng_name };

		public int cl_code { get; set; }
		public string ty_name { get; set; }
		public string ty_eng_name { get; set; }

		public static string TableName { get { return "co_code_cl"; } }

		public override string GetTableName()
		{
			return TableName;
		}

		public override string GetPrimaryCondition()
		{
			return string.Format("{0} = {1}", Fields.cl_code, cl_code);
		}

		public override Type GetFieldType()
		{
			return typeof(Fields);
		}

		public override Type GetWriteFieldType()
		{
			return typeof(WriteFields);
		}

		public void FromCopy(CodeClasses obj)
		{
			this.cl_code = obj.cl_code;
			this.ty_name = obj.ty_name;
			this.ty_eng_name = obj.ty_eng_name;
		}
	}
}
