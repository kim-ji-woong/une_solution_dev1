using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace Soulbrain.Model.Facility
{
    public class Scanner : Table
    {
        public enum Fields { scnr_sn, sensor_sn, sensor_ty_optn_code, sensor_ty_code, scnr_macaddr, scnr_name, tag_co, tag_prmisn_co, tag_nnpmsn_co };
        public enum WriteFields { scnr_sn, sensor_sn, sensor_ty_optn_code, sensor_ty_code, scnr_macaddr, scnr_name, tag_co, tag_prmisn_co, tag_nnpmsn_co };

        public int scnr_sn { get; set; }
        public int sensor_sn { get; set; }
        public int sensor_ty_optn_code { get; set; }
        public int sensor_ty_code { get; set; }
        public string scnr_macaddr { get; set; }
        public string scnr_name { get; set; }
        public int? tag_co { get; set; }
        public int? tag_prmisn_co { get; set; }
        public int? tag_nnpmsn_co { get; set; }

        public static string TableName { get { return "fa_scnr"; } }

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

        public void FromCopy(Scanner obj)
        {
            this.scnr_sn = obj.scnr_sn;
            this.sensor_sn = obj.sensor_sn;
            this.sensor_ty_optn_code = obj.sensor_ty_optn_code;
            this.sensor_ty_code = obj.sensor_ty_code;
            this.scnr_macaddr = obj.scnr_macaddr;
            this.scnr_name = obj.scnr_name;
            this.tag_co = obj.tag_co;
            this.tag_prmisn_co = obj.tag_prmisn_co;
            this.tag_nnpmsn_co = obj.tag_nnpmsn_co;
        }
    }
}