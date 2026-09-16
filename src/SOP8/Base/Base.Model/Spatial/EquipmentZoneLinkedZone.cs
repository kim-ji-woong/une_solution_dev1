using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace Base.Model.Spatial
{
	public class EquipmentZoneLinkedZone : Table
	{
		public enum Fields { eqp_zone_sn, zone_sn };
		public enum WriteFields { eqp_zone_sn, zone_sn };

		public int eqp_zone_sn { get; set; }
		public int zone_sn { get; set; }

		public static string TableName { get { return "sp_eqp_zone_link_zone"; } }

		public override string GetTableName()
		{
			return TableName;
		}

		public override string GetPrimaryCondition()
		{
			return string.Format("{0} = {1} and {2} = {3}", Fields.eqp_zone_sn, eqp_zone_sn, Fields.zone_sn, zone_sn);
		}

		public override Type GetFieldType()
		{
			return typeof(Fields);
		}

		public override Type GetWriteFieldType()
		{
			return typeof(WriteFields);
		}

		public void FromCopy(EquipmentZoneLinkedZone obj)
		{
			this.eqp_zone_sn = obj.eqp_zone_sn;
			this.zone_sn = obj.zone_sn;
		}
	}
}
