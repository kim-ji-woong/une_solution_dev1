using dnsDapperDBUtil.DataAccessLayer.IDAL;
using System;
using System.Collections.Generic;
using System.Text;

namespace Kftc.Model.History
{
    public class ComingPerson : Table
    {
        public enum Fields { cmg_nmpr_hist_sn, cmg_nmpr_name, visitr_yn, team_name, clsf_name, cmg_tm, sensor_sn, sensor_sttus_optn_code, sensor_sttus_code, entnc_yn, cmg_event_sn, lc_name, eqpmn_name, empno, card_no, event_name, event_code };
        public enum WriteFields { cmg_nmpr_name, visitr_yn, team_name, clsf_name, cmg_tm, sensor_sn, sensor_sttus_optn_code, sensor_sttus_code, entnc_yn, cmg_event_sn, lc_name, eqpmn_name, empno, card_no, event_name, event_code };

        public int cmg_nmpr_hist_sn { get; set; }
        public string cmg_nmpr_name { get; set; }
        public bool visitr_yn { get; set; }
        public string team_name { get; set; }
        public string clsf_name { get; set; }
        public DateTime cmg_tm { get; set; }
        public int sensor_sn { get; set; }
        public int sensor_sttus_optn_code { get; set; }
        public int sensor_sttus_code { get; set; }
        public bool entnc_yn { get; set; }
        public int cmg_event_sn { get; set; }
        public string lc_name { get; set; }
        public string eqpmn_name { get; set; }
        public string empno { get; set; }
        public string card_no { get; set; }
        public string event_name { get; set; }
        public string event_code { get; set; }

        public static string TableName { get { return "his_cmg_nmpr"; } }

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
    }
}
