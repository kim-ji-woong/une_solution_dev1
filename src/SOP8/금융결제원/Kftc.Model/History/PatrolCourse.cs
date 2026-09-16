using dnsDapperDBUtil.DataAccessLayer.IDAL;
using System;
using System.Collections.Generic;
using System.Text;

namespace Kftc.Model.History
{
    public class PatrolCourse : Table
    {
        public enum Fields { patrl_cours_hist_sn, patrl_hist_sn, patrl_cours_name, patrl_place, patrl_place_tm };
        public enum WriteFields { patrl_hist_sn, patrl_cours_name, patrl_place, patrl_place_tm };

        public int patrl_cours_hist_sn { get; set; }
        public int patrl_hist_sn { get; set; }
        public string patrl_cours_name { get; set; }
        public string patrl_place { get; set; }
        public DateTime patrl_place_tm { get; set; }

        public static string TableName { get { return "his_patrl_cours"; } }

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

        public void FromCopy(PatrolCourse obj)
        {
            this.patrl_cours_hist_sn = obj.patrl_cours_hist_sn;
            this.patrl_hist_sn = obj.patrl_hist_sn;
            this.patrl_cours_name = obj.patrl_cours_name;
            this.patrl_place = obj.patrl_place;
            this.patrl_place_tm = obj.patrl_place_tm;
        }
    }
}
