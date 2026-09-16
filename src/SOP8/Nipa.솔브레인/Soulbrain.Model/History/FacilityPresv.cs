using dnsDapperDBUtil.DataAccessLayer.IDAL;
using System;
using System.Collections.Generic;
using System.Text;

namespace Soulbrain.Model.History
{
    public class FacilityPresv : Table
    {
        public enum Fields { fclty_presv_hist_sn, fclty_presv_sn, fclty_id, mesure_id, mesure_tm, mesure_value, mesure_uom, mesure_lim_level_1, mesure_lim_level_2, mesure_lim_level_3, mesure_lim_level_4, mesure_lim_level_5, data_ty_optn_code, data_ty_code, hist_tm };
        public enum WriteFields { fclty_presv_sn, fclty_id, mesure_id, mesure_tm, mesure_value, mesure_uom, mesure_lim_level_1, mesure_lim_level_2, mesure_lim_level_3, mesure_lim_level_4, mesure_lim_level_5, data_ty_optn_code, data_ty_code, hist_tm };

        public long fclty_presv_hist_sn { get; set; }
        public int fclty_presv_sn { get; set; }
        public string fclty_id { get; set; }
        public string mesure_id { get; set; }
        public DateTime mesure_tm { get; set; }
        public double mesure_value { get; set; }
        public string mesure_uom { get; set; }
        public double? mesure_lim_level_1 { get; set; }
        public double? mesure_lim_level_2 { get; set; }
        public double? mesure_lim_level_3 { get; set; }
        public double? mesure_lim_level_4 { get; set; }
        public double? mesure_lim_level_5 { get; set; }
        public int data_ty_optn_code { get; set; }
        public int data_ty_code { get; set; }
        public DateTime hist_tm { get; set; }

        public static string TableName { get { return "his_fclty_presv"; } }

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

        public void FromCopy(FacilityPresv obj)
        {
            this.fclty_presv_hist_sn = obj.fclty_presv_hist_sn;
            this.fclty_presv_sn = obj.fclty_presv_sn;
            this.fclty_id = obj.fclty_id;
            this.mesure_id = obj.mesure_id;
            this.mesure_tm = obj.mesure_tm;
            this.mesure_value = obj.mesure_value;
            this.mesure_uom = obj.mesure_uom;
            this.mesure_lim_level_1 = obj.mesure_lim_level_1;
            this.mesure_lim_level_2 = obj.mesure_lim_level_2;
            this.mesure_lim_level_3 = obj.mesure_lim_level_3;
            this.mesure_lim_level_4 = obj.mesure_lim_level_4;
            this.mesure_lim_level_5 = obj.mesure_lim_level_5;
            this.data_ty_optn_code = obj.data_ty_optn_code;
            this.data_ty_code = obj.data_ty_code;
            this.hist_tm = obj.hist_tm;
        }
    }
}
