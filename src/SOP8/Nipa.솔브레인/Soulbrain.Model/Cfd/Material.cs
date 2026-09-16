using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace Soulbrain.Model.Cfd
{
    public class Material : Table
	{
		public enum Fields { mttr_sn, name, min_value, max_value, min_color_red, min_color_green, min_color_blue, max_color_red, max_color_green, max_color_blue };
		public enum WriteFields { mttr_sn, name, min_value, max_value, min_color_red, min_color_green, min_color_blue, max_color_red, max_color_green, max_color_blue };

		public int mttr_sn { get; set; }
		public string name { get; set; }
		public double min_value { get; set; }
		public double max_value { get; set; }
		public int min_color_red { get; set; }
		public int min_color_green { get; set; }
		public int min_color_blue { get; set; }
		public int max_color_red { get; set; }
		public int max_color_green { get; set; }
		public int max_color_blue { get; set; }

		public static string TableName { get { return "cfd_mttr"; } }

		public override string GetTableName()
		{
			return TableName;
		}

		public override string GetPrimaryCondition()
		{
			return string.Format("{0} = {1}", Fields.mttr_sn, mttr_sn);
		}

		public override Type GetFieldType()
		{
			return typeof(Fields);
		}

		public override Type GetWriteFieldType()
		{
			return typeof(WriteFields);
		}

		public void FromCopy(Material obj)
		{
			this.mttr_sn = obj.mttr_sn;
			this.name = obj.name;
			this.min_value = obj.min_value;
			this.max_value = obj.max_value;
			this.min_color_red = obj.min_color_red;
			this.min_color_green = obj.min_color_green;
			this.min_color_blue = obj.min_color_blue;
			this.max_color_red = obj.max_color_red;
			this.max_color_green = obj.max_color_green;
			this.max_color_blue = obj.max_color_blue;
		}
	}
}
