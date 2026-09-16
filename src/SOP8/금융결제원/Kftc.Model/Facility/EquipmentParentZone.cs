using dnsDapperDBUtil.DataAccessLayer.IDAL;
using System;
using System.Collections.Generic;
using System.Text;

namespace Kftc.Model.Facility
{
    public class EquipmentParentZone : Table
    {
        public enum Fields { zone_sn, eqp_zone_sn };
        public enum WriteFields { zone_sn, eqp_zone_sn };

        public int zone_sn { get; set; }
        public int eqp_zone_sn { get; set; }

        public static string TableName { get { return "fa_eqpmn_parnts_zone"; } }

        public override string GetTableName()
        {
            return TableName;
        }

        public override Type GetFieldType()
        {
            return typeof(Fields);
        }

        public override Type GetWriteFieldType()
        {
            return typeof(WriteFields);
        }

        public void FromCopy(EquipmentParentZone obj)
        {
            this.zone_sn = obj.zone_sn;
            this.eqp_zone_sn = obj.eqp_zone_sn;
        }
    }
}
