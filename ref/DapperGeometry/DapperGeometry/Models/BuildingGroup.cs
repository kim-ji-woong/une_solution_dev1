using dnsDapperDBUtil.DataAccessLayer.IDAL;
//using Microsoft.Spatial;
using NetTopologySuite.Geometries;
using System;
using System.Collections;
using System.Collections.Generic;

namespace DapperGeometry.Models
{
    public class BuildingGroup : Table
    {
        public enum Fields { ID, GroupName, TextCenter }
        public enum WriteFields { ID, GroupName, TextCenter }
        public enum GeometryFields { TextCenter }
        public int ID { get; set; }
        public string GroupName { get; set; }
        public Geometry TextCenter { get; set; }

        public static string TableName = "BuildingGroup";
        
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

        public override Type GetGeometryFieldType()
        {
            return typeof(GeometryFields);
        }

        public override object SetValue(ArrayList arr)
        {
            BuildingGroup t = new BuildingGroup
            {
                ID = (int)arr[0],
                GroupName = arr[1].ToString(),
                TextCenter = (Geometry)arr[2]
            };

            return t;
        }
        public override object GetValue(string strColumnName)
        {
            if (strColumnName == Fields.ID.ToString())
                return ID;
            else if (strColumnName == Fields.GroupName.ToString())
                return GroupName;
            else if (strColumnName == Fields.TextCenter.ToString())
                return TextCenter;

            return null;
        }
    }
}
