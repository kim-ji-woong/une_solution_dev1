using dnsDapperDBUtil.DataAccessLayer.IDAL;
using System;
using System.Collections.Generic;
using System.Text;

namespace Kftc.Model.Facility
{
    public class Equipment : Table
    {
        public enum Fields { eqpmn_sn, eqpmn_parnts_sn, eqpmn_no, eqpmn_idntfr, eqpmn_name, model_name, makr_name, stndrd, ip, lc, exchng_tm, eqpmn_memo };
        public enum WriteFields { eqpmn_parnts_sn, eqpmn_no, eqpmn_idntfr, eqpmn_name, model_name, makr_name, stndrd, ip, lc, exchng_tm, eqpmn_memo };

        public int eqpmn_sn { get; set; }
        public int? eqpmn_parnts_sn { get; set; }
        public int eqpmn_no { get; set; }
        public string eqpmn_idntfr { get; set; }
        public string eqpmn_name { get; set; }
        public string model_name { get; set; }
        public string makr_name { get; set; }
        public string stndrd { get; set; }
        public string ip { get; set; }
        public string lc { get; set; }
        public DateTime? exchng_tm { get; set; }
        public string eqpmn_memo { get; set; }

        public static string TableName { get { return "fa_eqpmn"; } }

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

        public void FromCopy(Equipment obj)
        {
            this.eqpmn_sn = obj.eqpmn_sn;
            this.eqpmn_parnts_sn = obj.eqpmn_parnts_sn;
            this.eqpmn_no = obj.eqpmn_no;
            this.eqpmn_idntfr = obj.eqpmn_idntfr;
            this.eqpmn_name = obj.eqpmn_name;
            this.model_name = obj.model_name;
            this.makr_name = obj.makr_name;
            this.stndrd = obj.stndrd;
            this.ip = obj.ip;
            this.lc = obj.lc;
            this.exchng_tm = obj.exchng_tm;
            this.eqpmn_memo = obj.eqpmn_memo;
        }
    }
}
