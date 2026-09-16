using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace Soulbrain.Model.Cfd
{
	public class MaterialRange : Table
	{
		public enum Fields { mttr_sn, ordr_no, min_value, max_value, color_red, color_green, color_blue, descp };
		public enum WriteFields { mttr_sn, ordr_no, min_value, max_value, color_red, color_green, color_blue, descp };

		public int mttr_sn { get; set; }
		public int ordr_no { get; set; }
		public double min_value { get; set; }
		public double max_value { get; set; }
		public int color_red { get; set; }
		public int color_green { get; set; }
		public int color_blue { get; set; }
		public string descp { get; set; }

		public static string TableName { get { return "cfd_mttr_range"; } }

		public override string GetTableName()
		{
			return TableName;
		}

		public override string GetPrimaryCondition()
		{
			return string.Format("{0} = {1} and {2} = {3}", Fields.mttr_sn, mttr_sn, Fields.ordr_no, ordr_no);
		}

		public override Type GetFieldType()
		{
			return typeof(Fields);
		}

		public override Type GetWriteFieldType()
		{
			return typeof(WriteFields);
		}

		public void FromCopy(MaterialRange obj)
		{
			this.mttr_sn = obj.mttr_sn;
			this.ordr_no = obj.ordr_no;
			this.min_value = obj.min_value;
			this.max_value = obj.max_value;
			this.color_red = obj.color_red;
			this.color_green = obj.color_green;
			this.color_blue = obj.color_blue;
			this.descp = obj.descp;
		}
	}
}
