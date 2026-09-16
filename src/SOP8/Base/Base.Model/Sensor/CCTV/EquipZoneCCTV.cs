using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace Base.Model.Sensor.CCTV
{
	public class EquipZoneCCTV : Table
	{
		public enum Fields { eqp_zone_sn, cctv_1, cctv_2, cctv_3, cctv_4 };
		public enum WriteFields { eqp_zone_sn, cctv_1, cctv_2, cctv_3, cctv_4 };

		public int eqp_zone_sn { get; set; }
		public int? cctv_1 { get; set; }
		public int? cctv_2 { get; set; }
		public int? cctv_3 { get; set; }
		public int? cctv_4 { get; set; }

		public static string TableName { get { return "fa_eqp_zone_cctv"; } }

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

		public void FromCopy(EquipZoneCCTV obj)
		{
			this.eqp_zone_sn = obj.eqp_zone_sn;
			this.cctv_1 = obj.cctv_1;
			this.cctv_2 = obj.cctv_2;
			this.cctv_3 = obj.cctv_3;
			this.cctv_4 = obj.cctv_4;
		}
	}
}
