using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace Base.Model.Sop.Category
{
	public class Version : Table
	{
		public enum Fields { ver_sn, creat_de, last_acces_de, name, user_sn, site_sn, descp };
		public enum WriteFields { creat_de, last_acces_de, name, user_sn, site_sn, descp };

		public int ver_sn { get; set; }
		public DateTime creat_de { get; set; }
		public DateTime last_acces_de { get; set; }
		public string name { get; set; }
		public int? user_sn { get; set; }
		public int site_sn { get; set; }
		public string/* nullable */ descp { get; set; }

		public static string TableName { get { return "so_ctgry_ver"; } }

		public override string GetTableName()
		{
			return TableName;
		}

		public override string GetPrimaryCondition()
		{
			return string.Format("{0} = {1}", Fields.ver_sn, ver_sn);
		}

		public override Type GetFieldType()
		{
			return typeof(Fields);
		}

		public override Type GetWriteFieldType()
		{
			return typeof(WriteFields);
		}

		public void FromCopy(Version obj)
		{
			this.ver_sn = obj.ver_sn;
			this.creat_de = obj.creat_de;
			this.last_acces_de = obj.last_acces_de;
			this.name = obj.name;
			this.user_sn = obj.user_sn;
			this.site_sn = obj.site_sn;
			this.descp = obj.descp;
		}
	}
}
