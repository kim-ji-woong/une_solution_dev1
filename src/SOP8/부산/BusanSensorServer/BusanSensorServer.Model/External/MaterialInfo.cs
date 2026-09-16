namespace BusanSensorServer.Model.External
{
    public class MaterialInfo
    {
        public enum Fields { SensorCodeNo, MaterialNo, SensorCodeName, SensorUniqueNo, SensorUnit, SensorCodeNameEng };
        
        public int SensorCodeNo { get; set; }
        public int MaterialNo { get; set; }
        public string SensorCodeName { get; set; }
        public int SensorUniqueNo { get; set; }
        public string SensorUnit { get; set; }
        public string SensorCodeNameEng { get; set; }
        
        public static string TableName { get { return "BusanExternalMaterialInfo"; } }
        
        public static string GetFieldName(Fields field, out bool isNullable)
        {
            if (field == Fields.SensorCodeName ||
                field == Fields.SensorUnit ||
                field == Fields.SensorCodeNameEng)
                isNullable = true;
            else
                isNullable = false;
            
            return field.ToString();
        }
    }
}