using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace Base.Model.Sop.Category
{
	public class SmallClass : Table
	{
		public enum Fields { sclas_sn, sclas_name, mclas_sn, ver_sn, nor_yn, descp };
		public enum WriteFields { sclas_name, mclas_sn, ver_sn, nor_yn, descp };

		public int sclas_sn { get; set; }
		public string sclas_name { get; set; }
		public int mclas_sn { get; set; }
		public int ver_sn { get; set; }
		public bool nor_yn { get; set; }
		public string/* nullable */ descp { get; set; }

		public static string TableName { get { return "so_ctgry_sclas"; } }

		public override string GetTableName()
		{
			return TableName;
		}

		public override string GetPrimaryCondition()
		{
			return string.Format("{0} = {1}", Fields.sclas_sn, sclas_sn);
		}

		public override Type GetFieldType()
		{
			return typeof(Fields);
		}

		public override Type GetWriteFieldType()
		{
			return typeof(WriteFields);
		}

		public void FromCopy(SmallClass obj)
		{
			this.sclas_sn = obj.sclas_sn;
			this.sclas_name = obj.sclas_name;
			this.mclas_sn = obj.mclas_sn;
			this.ver_sn = obj.ver_sn;
			this.nor_yn = obj.nor_yn;
			this.descp = obj.descp;
		}
	}
}
