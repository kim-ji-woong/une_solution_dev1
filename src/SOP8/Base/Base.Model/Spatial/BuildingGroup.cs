using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace Base.Model.Spatial
{
	public class BuildingGroup : Table
	{
		public enum Fields { buld_group_sn, name, text_center_crdnt_x, text_center_crdnt_y, text_center_crdnt_z, disp_text, site_sn };
		public enum WriteFields { buld_group_sn, name, text_center_crdnt_x, text_center_crdnt_y, text_center_crdnt_z, disp_text, site_sn };

		public int buld_group_sn { get; set; }
		public string name { get; set; }
		public double? text_center_crdnt_x { get; set; }
		public double? text_center_crdnt_y { get; set; }
		public double? text_center_crdnt_z { get; set; }
		public string/* nullable */ disp_text { get; set; }
		public int site_sn { get; set; }

		public static string TableName { get { return "sp_buld_group"; } }

		public override string GetTableName()
		{
			return TableName;
		}

		public override string GetPrimaryCondition()
		{
			return string.Format("{0} = {1}", Fields.buld_group_sn, buld_group_sn);
		}

		public override Type GetFieldType()
		{
			return typeof(Fields);
		}

		public override Type GetWriteFieldType()
		{
			return typeof(WriteFields);
		}

		public void FromCopy(BuildingGroup obj)
		{
			this.buld_group_sn = obj.buld_group_sn;
			this.name = obj.name;
			this.text_center_crdnt_x = obj.text_center_crdnt_x;
			this.text_center_crdnt_y = obj.text_center_crdnt_y;
			this.text_center_crdnt_z = obj.text_center_crdnt_z;
			this.disp_text = obj.disp_text;
			this.site_sn = obj.site_sn;
		}
	}
}
