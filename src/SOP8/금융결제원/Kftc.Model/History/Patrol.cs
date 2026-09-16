using dnsDapperDBUtil.DataAccessLayer.IDAL;
using System;
using System.Collections.Generic;
using System.Text;

namespace Kftc.Model.History
{
    public class Patrol : Table
    {
        public enum Fields { patrl_hist_sn, patrl_tm, patrl_cours_name, patrl_wrkr_name };
        public enum WriteFields { patrl_tm, patrl_cours_name, patrl_wrkr_name };

        public int patrl_hist_sn { get; set; }
        public DateTime patrl_tm { get; set; }
        public string patrl_cours_name { get; set; }
        public string patrl_wrkr_name { get; set; }

        public static string TableName { get { return "his_patrl"; } }

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

        public void FromCopy(Patrol obj)
        {
            this.patrl_hist_sn = obj.patrl_hist_sn;
            this.patrl_tm = obj.patrl_tm;
            this.patrl_cours_name = obj.patrl_cours_name;
            this.patrl_wrkr_name = obj.patrl_wrkr_name;
        }
    }
}
