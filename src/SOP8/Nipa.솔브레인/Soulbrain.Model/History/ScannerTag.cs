using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace Soulbrain.Model.History
{
    public class ScannerTag : Table
    {
        public enum Fields { scnr_tag_hist_sn, scnr_sn, tag_macaddr, tag_user_name, tag_user_brthdy, tag_user_telno, tag_user_cmpny_name, tag_lc, purps, charger_name, prmisn_yn, buld_name, fctry_name, floor_name, tm };
        public enum WriteFields { scnr_sn, tag_macaddr, tag_user_name, tag_user_brthdy, tag_user_telno, tag_user_cmpny_name, tag_lc, purps, charger_name, prmisn_yn, buld_name, fctry_name, floor_name, tm };

        public int scnr_tag_hist_sn { get; set; }
        public int scnr_sn { get; set; }
        public string tag_macaddr { get; set; }
        public string tag_user_name { get; set; }
        public string tag_user_brthdy { get; set; }
        public string tag_user_telno { get; set; }
        public string tag_user_cmpny_name { get; set; }
        public string tag_lc { get; set; }
        public string purps { get; set; }
        public string charger_name { get; set; }
        public bool prmisn_yn { get; set; }
        public string buld_name { get; set; }
        public string fctry_name { get; set; }
        public string floor_name { get; set; }
        public DateTime tm { get; set; }

        public static string TableName { get { return "his_scnr_tag"; } }

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

        public void FromCopy(ScannerTag obj)
        {
            this.scnr_tag_hist_sn = obj.scnr_tag_hist_sn;
            this.scnr_sn = obj.scnr_sn;
            this.tag_macaddr = obj.tag_macaddr;
            this.tag_user_name = obj.tag_user_name;
            this.tag_user_brthdy = obj.tag_user_brthdy;
            this.tag_user_telno = obj.tag_user_telno;
            this.tag_user_cmpny_name = obj.tag_user_cmpny_name;
            this.tag_lc = obj.tag_lc;
            this.purps = obj.purps;
            this.charger_name = obj.charger_name;
            this.prmisn_yn = obj.prmisn_yn;
            this.buld_name = obj.buld_name;
            this.fctry_name = obj.fctry_name;
            this.floor_name = obj.floor_name;
            this.tm = obj.tm;
        }
        
    }
}