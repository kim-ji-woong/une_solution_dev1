using System;
using System.Collections.Generic;

namespace dnsDapperDBUtil.DataAccessLayer.IDAL
{
    public class Table
    {
        // Pagination을 위하여 추가
        // 2025-12-19 김지웅
        public int rowindex { get; set; }
        public int totalcount { get; set; }

        public virtual string GetTableName()
        {
            return string.Empty;
        }

        public virtual string GetPrimaryCondition()
        {
            return string.Empty;
        }

        public virtual Type GetFieldType()
        {
            return null;
        }

        public virtual Type GetWriteFieldType()
        {
            return null;
        }

        public virtual Type GetGeometryFieldType()
        {
            return null;
        }

        public virtual string GetFieldNames(bool bIsParam = false)
        {
            //nFieldCount = 0;
            string strFields = string.Empty;

            foreach (var type in Enum.GetValues(GetFieldType()))
            {
                if (bIsParam)
                {
                    if (strFields.Length == 0)
                        strFields = "@" + type.ToString();
                    else
                        strFields += ", @" + type.ToString();
                }
                else
                {
                    if (strFields.Length == 0)
                        strFields = type.ToString();
                    else
                        strFields += ", " + type.ToString();
                }

                //nFieldCount++;
            }

            return strFields;
        }

        public virtual string GetWriteFieldNames(bool bIsParam = false, Manager.WebDBManager.DBType dbType = Manager.WebDBManager.DBType.sqlserver)
        {
            string strParamChar = "@";
            if (dbType == Manager.WebDBManager.DBType.oracle)
                strParamChar = ":";

            string strFields = string.Empty;
            Type writeFields = GetWriteFieldType();

            if (writeFields != null)
            {
                foreach (var type in Enum.GetValues(writeFields))
                {
                    if (bIsParam)
                    {
                        if (strFields.Length == 0)
                            strFields = strParamChar + type.ToString();
                        else
                            strFields += ", " + strParamChar + type.ToString();
                    }
                    else
                    {
                        if (strFields.Length == 0)
                            strFields = type.ToString();
                        else
                            strFields += ", " + type.ToString();
                    }
                }
            }

            return strFields;
        }

        public virtual string GetGeometryFieldNames(Manager.WebDBManager.DBType dbType = Manager.WebDBManager.DBType.sqlserver, bool bIsParam = false)
        {
            string strFields = string.Empty;

            foreach (var type in Enum.GetValues(GetFieldType()))
            {
                string strField = type.ToString();
                foreach (var geometryType in Enum.GetValues(GetGeometryFieldType()))
                {
                    if (type.ToString() == geometryType.ToString())
                    {
                        if (dbType == Manager.WebDBManager.DBType.sqlserver)
                        {
                            strField = strField + ".Serialize() as " + strField;
                            break;
                        }
                        else if (dbType == Manager.WebDBManager.DBType.mysql)
                        {
                            strField = $"ST_ASTEXT({strField}) as {strField}";
                            break;
                        }
                        else if (dbType == Manager.WebDBManager.DBType.npgsql)
                        {
                            strField = $"ST_AsText({strField}) as {strField}";
                            break;
                        }
                    }
                }

                if (bIsParam)
                {
                    if (strFields.Length == 0)
                        strFields = "@" + strField;
                    else
                        strFields += ", @" + strField;
                }
                else
                {
                    if (strFields.Length == 0)
                        strFields = strField;
                    else
                        strFields += ", " + strField;
                }
            }

            return strFields;
        }

        /// <summary>
        /// 각 필드의 데이터를 ,로 구분하여 나열
        /// insert sql에 사용함
        /// </summary>
        /// <param name="dbType"></param>
        /// <returns>return "{value1}, {value2}, {value3}..."</returns>
        public virtual string GetFieldDatas(Manager.WebDBManager.DBType dbType = Manager.WebDBManager.DBType.sqlserver)
        {
            string strDatas = string.Empty;

            foreach (var type in Enum.GetValues(GetFieldType()))
            {
                if (strDatas.Length > 0)
                    strDatas += ", ";

                object value = GetValue(type.ToString());
                if (value is int || value is float || value is double)
                {
                    strDatas += value.ToString();
                }
                else if (value is string)
                {
                    strDatas += $"'{value.ToString()}'";
                }
                else if (value is NetTopologySuite.Geometries.Geometry)
                {
                    if (dbType == Manager.WebDBManager.DBType.sqlserver)
                    {
                        strDatas += $"geometry::STGeomFromText('{value.ToString()}', 0)";
                    }
                    else if (dbType == Manager.WebDBManager.DBType.mysql)
                    {
                        strDatas += $"ST_GeomFromText('{value.ToString()}')";
                    }
                    else if (dbType == Manager.WebDBManager.DBType.npgsql)
                    {
                        strDatas += $"'{value.ToString()}'";
                    }
                }
            }

            return strDatas;
        }

        /// <summary>
        /// 각 필드=데이터 형식을 ,로 구분하여 나열
        /// update sql에 사용함
        /// </summary>
        /// <param name="dbType"></param>
        /// <returns>return column1="value1", column2="value2"</returns>
        public virtual string GetUpdateFieldDatas(Manager.WebDBManager.DBType dbType = Manager.WebDBManager.DBType.sqlserver)
        {
            string strDatas = string.Empty;

            foreach (var type in Enum.GetValues(GetFieldType()))
            {
                if (strDatas.Length > 0)
                    strDatas += ", ";
                
                object value = GetValue(type.ToString());

                if (value is int || value is float || value is double)
                {
                    strDatas += $"{type}={value.ToString()}";
                }
                else if (value is string)
                {
                    strDatas += $"{type}='{value.ToString()}'";
                }
                else if (value is NetTopologySuite.Geometries.Geometry)
                {
                    NetTopologySuite.Geometries.Geometry geometry = value as NetTopologySuite.Geometries.Geometry;                    

                    if (dbType == Manager.WebDBManager.DBType.sqlserver)
                    {
                        strDatas += $"{type}=geometry::STGeomFromText('{value.ToString()}', 0)";
                    }
                    else if (dbType == Manager.WebDBManager.DBType.mysql)
                    {
                        strDatas += $"{type}=ST_GeomFromText('{value.ToString()}')";
                    }
                    else if (dbType == Manager.WebDBManager.DBType.npgsql)
                    {
                        strDatas += $"{type}='{value.ToString()}'";
                    }
                }
                else if (value is null)
                {
                    strDatas += $"{type}=null";
                }
            }

            return strDatas;
        }

        public virtual string GetParamFieldNames()
        {            
            //nFieldCount = 0;
            string strFields = "";
            Type writeFields = GetWriteFieldType();

            if (writeFields != null)
            {
                foreach (var type in Enum.GetValues(writeFields))
                {
                    if (strFields.Length == 0)
                        strFields = type.ToString() + "=@" + type.ToString();
                    else
                        strFields += "," + type.ToString() + "=@" + type.ToString();

                    //nFieldCount++;
                }
            }

            return strFields;
        }

        public int GetFieldCount()
        {
            int nFieldCount = 0;
            
            foreach (var type in Enum.GetValues(GetFieldType()))
            {
                nFieldCount++;
            }

            return nFieldCount;
        }

        public virtual object SetValue(System.Collections.ArrayList arr)
        {
            return null;            
        }

        public virtual object GetValue(string strColumnName)
        {
            return null;
        }
    }
}

    
