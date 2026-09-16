namespace BusanSensorServer.Model.External
{
    public class NodeInfo
    {
        public enum Fields { NodeNo, ServiceNo, RegionNo, GroupNo, NodeName, NodePosition, Longitude, Latitude, X, Y, EquipmentZoneNo }
        
        public int NodeNo { get; set; }
        public int ServiceNo { get; set; }
        public int RegionNo { get; set; }
        public int GroupNo { get; set; }
        public string NodeName { get; set; }
        public string NodePosition { get; set; }
        public double Longitude { get; set; }
        public double Latitude { get; set; }
        public double X { get; set; }
        public double Y { get; set; }
        public int EquipmentZoneNo { get; set; }
        
        public static string TableName { get { return "BusanExternalNodeInfo"; } }

        public static string GetFieldName(Fields field, out bool isNullable)
        {
            if (field == Fields.NodeName ||
                field == Fields.NodePosition ||
                field == Fields.Longitude ||
                field == Fields.Latitude ||
                field == Fields.X ||
                field == Fields.Y ||
                field == Fields.EquipmentZoneNo)
                isNullable = true;
            else
                isNullable = false;

            return field.ToString();
        }
    }
}