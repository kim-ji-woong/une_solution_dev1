using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace Soulbrain.Model
{
	public class Worker : Table
	{
		public enum Fields { wrkr_no, buld_group_sn, buld_sn, zone_sn, eqp_zone_sn, wrkr_ty_optn_code, wrkr_ty_code, wrkr_co };
		public enum WriteFields { buld_group_sn, buld_sn, zone_sn, eqp_zone_sn, wrkr_ty_optn_code, wrkr_ty_code, wrkr_co };

		public int wrkr_no { get; set; }
		public int? buld_group_sn { get; set; }
		public int? buld_sn { get; set; }
		public int? zone_sn { get; set; }
		public int? eqp_zone_sn { get; set; }
		public int wrkr_ty_optn_code { get; set; }
		public int wrkr_ty_code { get; set; }
		public int wrkr_co { get; set; }

		public static string TableName { get { return "sdms_wrkr"; } }

		public override string GetTableName()
		{
			return TableName;
		}

		public override string GetPrimaryCondition()
		{
			return string.Format("{0} = {1}", Fields.wrkr_no, wrkr_no);
		}

		public override Type GetFieldType()
		{
			return typeof(Fields);
		}

		public override Type GetWriteFieldType()
		{
			return typeof(WriteFields);
		}

		public void FromCopy(Worker obj)
		{
			this.wrkr_no = obj.wrkr_no;
			this.buld_group_sn = obj.buld_group_sn;
			this.buld_sn = obj.buld_sn;
			this.zone_sn = obj.zone_sn;
			this.eqp_zone_sn = obj.eqp_zone_sn;
			this.wrkr_ty_optn_code = obj.wrkr_ty_optn_code;
			this.wrkr_ty_code = obj.wrkr_ty_code;
			this.wrkr_co = obj.wrkr_co;
		}
	}
}
