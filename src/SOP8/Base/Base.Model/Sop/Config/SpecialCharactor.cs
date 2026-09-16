using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace Base.Model.Sop.Config
{
	public class SpecialCharactor : Table
	{
		public enum Fields { spcl_chrctr_sn, cl, contents, descp };
		public enum WriteFields { spcl_chrctr_sn, cl, contents, descp };

		public int spcl_chrctr_sn { get; set; }
		public string cl { get; set; }
		public string contents { get; set; }
		public string/* nullable */ descp { get; set; }

		public static string TableName { get { return "so_conf_spcl_chrctr"; } }

		public override string GetTableName()
		{
			return TableName;
		}

		public override string GetPrimaryCondition()
		{
			return string.Format("{0} = {1}", Fields.spcl_chrctr_sn, spcl_chrctr_sn);
		}

		public override Type GetFieldType()
		{
			return typeof(Fields);
		}

		public override Type GetWriteFieldType()
		{
			return typeof(WriteFields);
		}

		public void FromCopy(SpecialCharactor obj)
		{
			this.spcl_chrctr_sn = obj.spcl_chrctr_sn;
			this.cl = obj.cl;
			this.contents = obj.contents;
			this.descp = obj.descp;
		}
	}
}
