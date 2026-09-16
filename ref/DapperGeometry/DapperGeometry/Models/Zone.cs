using dnsDapperDBUtil.DataAccessLayer.IDAL;
//using Microsoft.Spatial;
using NetTopologySuite.Geometries;
using System;
using System.Collections;
using System.Collections.Generic;

namespace DapperGeometry.Models
{
    public class Zone : Table
    {
        public enum Fields { ID, ZoneName, Boundary }
        public enum WriteFields { ID, ZoneName, Boundary }
        public enum GeometryFields { Boundary }
        public int ID { get; set; }
        public string ZoneName { get; set; }
        public Geometry Boundary { get; set; }

        public static string TableName = "Zone";
        
        public override string GetTableName()
        { 
            return TableName;
        }

        public override string GetPrimaryCondition()
        {            
            return $"ID = {ID}";
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
            Zone t = new Zone
            {
                ID = (int)arr[0],
                ZoneName = arr[1].ToString(),
                Boundary = (Geometry)arr[2]
            };

            return t;
        }

        public override object GetValue(string strColumnName)
        {
            if (strColumnName == Fields.ID.ToString())
                return ID;
            else if (strColumnName == Fields.ZoneName.ToString())
                return ZoneName;
            else if (strColumnName == Fields.Boundary.ToString())
                return Boundary;

            return null;
        }
    }
}
