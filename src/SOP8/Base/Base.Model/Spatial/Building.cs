using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace Base.Model.Spatial
{
	public class Building : Table
	{
		public enum Fields { buld_sn, buld_code, name, buld_group_sn, top_floor_indx, min_floor_indx, text_center_crdnt_x, text_center_crdnt_y, text_center_crdnt_z, brdcst_text, disp_text };
		public enum WriteFields { buld_sn, buld_code, name, buld_group_sn, top_floor_indx, min_floor_indx, text_center_crdnt_x, text_center_crdnt_y, text_center_crdnt_z, brdcst_text, disp_text };

		public int buld_sn { get; set; }
		public string/* nullable */ buld_code { get; set; }
		public string name { get; set; }
		public int buld_group_sn { get; set; }
		public int top_floor_indx { get; set; }
		public int min_floor_indx { get; set; }
		public double? text_center_crdnt_x { get; set; }
		public double? text_center_crdnt_y { get; set; }
		public double? text_center_crdnt_z { get; set; }
		public string/* nullable */ brdcst_text { get; set; }
		public string/* nullable */ disp_text { get; set; }

		public static string TableName { get { return "sp_buld"; } }

		public override string GetTableName()
		{
			return TableName;
		}

		public override string GetPrimaryCondition()
		{
			return string.Format("{0} = {1}", Fields.buld_sn, buld_sn);
		}

		public override Type GetFieldType()
		{
			return typeof(Fields);
		}

		public override Type GetWriteFieldType()
		{
			return typeof(WriteFields);
		}

		public void FromCopy(Building obj)
		{
			this.buld_sn = obj.buld_sn;
			this.buld_code = obj.buld_code;
			this.name = obj.name;
			this.buld_group_sn = obj.buld_group_sn;
			this.top_floor_indx = obj.top_floor_indx;
			this.min_floor_indx = obj.min_floor_indx;
			this.text_center_crdnt_x = obj.text_center_crdnt_x;
			this.text_center_crdnt_y = obj.text_center_crdnt_y;
			this.text_center_crdnt_z = obj.text_center_crdnt_z;
			this.brdcst_text = obj.brdcst_text;
			this.disp_text = obj.disp_text;
		}
	}
}
