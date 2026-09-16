using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace Base.Model.Sop.Config
{
	public class LinkedSop : Table
	{
		public enum Fields { link_sop_sn, sensor_ty_optn_code, sensor_ty_code, sensor_sub_ty_no, buld_group_sn, buld_sn, zone_sn, lclas_sn, mclas_sn, site_sn, sclas_name, descp };
		public enum WriteFields { sensor_ty_optn_code, sensor_ty_code, sensor_sub_ty_no, buld_group_sn, buld_sn, zone_sn, lclas_sn, mclas_sn, site_sn, sclas_name, descp };

		public int link_sop_sn { get; set; }
		public int sensor_ty_optn_code { get; set; }
		public int sensor_ty_code { get; set; }
		public int? sensor_sub_ty_no { get; set; }
		public int? buld_group_sn { get; set; }
		public int? buld_sn { get; set; }
		public int? zone_sn { get; set; }
		public int lclas_sn { get; set; }
		public int mclas_sn { get; set; }
		public int site_sn { get; set; }
		public string sclas_name { get; set; }
		public string/* nullable */ descp { get; set; }

		public static string TableName { get { return "so_conf_link_sop"; } }

		public override string GetTableName()
		{
			return TableName;
		}

		public override string GetPrimaryCondition()
		{
			return string.Format("{0} = {1}", Fields.link_sop_sn, link_sop_sn);
		}

		public override Type GetFieldType()
		{
			return typeof(Fields);
		}

		public override Type GetWriteFieldType()
		{
			return typeof(WriteFields);
		}

		public void FromCopy(LinkedSop obj)
		{
			this.link_sop_sn = obj.link_sop_sn;
			this.sensor_ty_optn_code = obj.sensor_ty_optn_code;
			this.sensor_ty_code = obj.sensor_ty_code;
			this.sensor_sub_ty_no = obj.sensor_sub_ty_no;
			this.buld_group_sn = obj.buld_group_sn;
			this.buld_sn = obj.buld_sn;
			this.zone_sn = obj.zone_sn;
			this.lclas_sn = obj.lclas_sn;
			this.mclas_sn = obj.mclas_sn;
			this.site_sn = obj.site_sn;
			this.sclas_name = obj.sclas_name;
			this.descp = obj.descp;
		}
	}
}
