using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace Base.Model.Spatial
{
	public class EquipmentZone : Table
	{
		public enum Fields { eqp_zone_sn, name, text_center_crdnt_x, text_center_crdnt_y, text_center_crdnt_z, brdcst_text, disp_text, site_sn };
		public enum WriteFields { eqp_zone_sn, name, text_center_crdnt_x, text_center_crdnt_y, text_center_crdnt_z, brdcst_text, disp_text, site_sn };

		public int eqp_zone_sn { get; set; }
		public string name { get; set; }
		public double? text_center_crdnt_x { get; set; }
		public double? text_center_crdnt_y { get; set; }
		public double? text_center_crdnt_z { get; set; }
		public string/* nullable */ brdcst_text { get; set; }
		public string/* nullable */ disp_text { get; set; }
		public int site_sn { get; set; }

		public static string TableName { get { return "sp_eqp_zone"; } }

		public override string GetTableName()
		{
			return TableName;
		}

		public override string GetPrimaryCondition()
		{
			return string.Format("{0} = {1}", Fields.eqp_zone_sn, eqp_zone_sn);
		}

		public override Type GetFieldType()
		{
			return typeof(Fields);
		}

		public override Type GetWriteFieldType()
		{
			return typeof(WriteFields);
		}

		public void FromCopy(EquipmentZone obj)
		{
			this.eqp_zone_sn = obj.eqp_zone_sn;
			this.name = obj.name;
			this.text_center_crdnt_x = obj.text_center_crdnt_x;
			this.text_center_crdnt_y = obj.text_center_crdnt_y;
			this.text_center_crdnt_z = obj.text_center_crdnt_z;
			this.brdcst_text = obj.brdcst_text;
			this.disp_text = obj.disp_text;
			this.site_sn = obj.site_sn;
		}
	}
}
