using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace Base.Model.Spatial
{
	public class Zone : Table
	{
		public enum Fields { zone_sn, name, buld_sn, floor_indx, adit_floor, text_center_crdnt_x, text_center_crdnt_y, text_center_crdnt_z, brdcst_text, disp_text, site_sn };
		public enum WriteFields { zone_sn, name, buld_sn, floor_indx, adit_floor, text_center_crdnt_x, text_center_crdnt_y, text_center_crdnt_z, brdcst_text, disp_text, site_sn };

		public int zone_sn { get; set; }
		public string name { get; set; }
		public int? buld_sn { get; set; }
		public int? floor_indx { get; set; }
		public double? adit_floor { get; set; }
		public double? text_center_crdnt_x { get; set; }
		public double? text_center_crdnt_y { get; set; }
		public double? text_center_crdnt_z { get; set; }
		public string/* nullable */ brdcst_text { get; set; }
		public string/* nullable */ disp_text { get; set; }
		public int site_sn { get; set; }

		public static string TableName { get { return "sp_zone"; } }

		public override string GetTableName()
		{
			return TableName;
		}

		public override string GetPrimaryCondition()
		{
			return string.Format("{0} = {1}", Fields.zone_sn, zone_sn);
		}

		public override Type GetFieldType()
		{
			return typeof(Fields);
		}

		public override Type GetWriteFieldType()
		{
			return typeof(WriteFields);
		}

		public void FromCopy(Zone obj)
		{
			this.zone_sn = obj.zone_sn;
			this.name = obj.name;
			this.buld_sn = obj.buld_sn;
			this.floor_indx = obj.floor_indx;
			this.adit_floor = obj.adit_floor;
			this.text_center_crdnt_x = obj.text_center_crdnt_x;
			this.text_center_crdnt_y = obj.text_center_crdnt_y;
			this.text_center_crdnt_z = obj.text_center_crdnt_z;
			this.brdcst_text = obj.brdcst_text;
			this.disp_text = obj.disp_text;
			this.site_sn = obj.site_sn;
		}
	}
}
