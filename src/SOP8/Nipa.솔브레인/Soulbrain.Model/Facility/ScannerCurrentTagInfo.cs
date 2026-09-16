using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace Soulbrain.Model.Facility
{
    public class ScannerCurrentTagInfo : Table
    {
        public enum Fields { scnr_sn, tag_macaddr, tag_user_name, tag_user_brthdy, tag_user_telno, tag_user_cmpny_name, tag_lc, purps, charger_name, prmisn_yn, emgnc_yn };
        public enum WriteFields { scnr_sn, tag_macaddr, tag_user_name, tag_user_brthdy, tag_user_telno, tag_user_cmpny_name, tag_lc, purps, charger_name, prmisn_yn, emgnc_yn };

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
        public bool emgnc_yn { get; set; }

        public static string TableName { get { return "fa_scnr_cur_tag_info"; } }

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

        public void FromCopy(ScannerCurrentTagInfo obj)
        {
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
            this.emgnc_yn = obj.emgnc_yn;
        }
        
    }
}