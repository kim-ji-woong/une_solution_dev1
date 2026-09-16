using dnsDapperDBUtil.DataAccessLayer.IDAL;
using dnsDapperDBUtil.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;

namespace DapperSample.Model
{
    public class Regular : Table
    {
        public enum Fields { ID, TeamName, ParentTeamID, SiteID }
        public enum WriteFields { TeamName, ParentTeamID, SiteID }
        public int ID { get; set; }
        public string TeamName { get; set; }
        public int? ParentTeamID { get; set; }
        public int SiteID { get; set; }

        public static string TableName = "SopTeamRegular";
        
        public override string GetTableName()
        {
            return TableName;
        }

        public override string GetPrimaryCondition()
        {
            return string.Format("ID = {0}", ID);
        }

        public override Type GetFieldType()
        {
            return typeof(Fields);
        }

        public override Type GetWriteFieldType()
        {
            return typeof(WriteFields);
        }

        public List<RegularMember> RegularMembers { get; set; }
    }
}
