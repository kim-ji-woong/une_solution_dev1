using System.Text;

namespace HanbitService
{
    public class AlarmData
    {
        public int alarmCode { get; set; }
        public string timestamp { get; set; }
        public int? buildingGroupID { get; set; }
        public string buildingGroupName { get; set; }
        public int? buildingID { get; set; }
        public string buildingName { get; set; }
        public int floorID { get; set; }
        public string floorName { get; set; }
        public int? equipZoneID { get; set; }
        public string equipZoneName { get; set; }
        public int sensorID { get; set; }
        public string sensorName { get; set; }
        public string sensorType { get; set; }
        public bool isAlarm { get; set; }
        public bool isManual { get; set; }
        public string message { get; set; }

        public string ToJson()
        {
            var sb = new StringBuilder();
            sb.Append("{");
            sb.AppendFormat("\"alarmCode\": {0}", alarmCode);
            sb.AppendFormat(", \"timestamp\": \"{0}\"", EscapeJson(timestamp));

            if (buildingGroupID.HasValue)
            {
                sb.AppendFormat(", \"buildingGroupID\": {0}", buildingGroupID.Value);
                sb.AppendFormat(", \"buildingGroupName\": \"{0}\"", EscapeJson(buildingGroupName));
            }

            if (buildingID.HasValue)
            {
                sb.AppendFormat(", \"buildingID\": {0}", buildingID.Value);
                sb.AppendFormat(", \"buildingName\": \"{0}\"", EscapeJson(buildingName));
            }

            sb.AppendFormat(", \"floorID\": {0}", floorID);
            sb.AppendFormat(", \"floorName\": \"{0}\"", EscapeJson(floorName));

            if (equipZoneID.HasValue)
            {
                sb.AppendFormat(", \"equipZoneID\": {0}", equipZoneID.Value);
                sb.AppendFormat(", \"equipZoneName\": \"{0}\"", EscapeJson(equipZoneName));
            }

            sb.AppendFormat(", \"sensorID\": {0}", sensorID);
            sb.AppendFormat(", \"sensorName\": \"{0}\"", EscapeJson(sensorName));

            if (sensorType != null)
                sb.AppendFormat(", \"sensorType\": \"{0}\"", EscapeJson(sensorType));
            else
                sb.Append(", \"sensorType\": null");

            sb.AppendFormat(", \"isAlarm\": {0}", isAlarm ? "true" : "false");
            sb.AppendFormat(", \"isManual\": {0}", isManual ? "true" : "false");

            if (message != null)
                sb.AppendFormat(", \"message\": \"{0}\"", EscapeJson(message));
            else
                sb.Append(", \"message\": null");

            sb.Append("}");
            return sb.ToString();
        }

        private string EscapeJson(string str)
        {
            if (str == null) return "";
            return str.Replace("\\", "\\\\").Replace("\"", "\\\"").Replace("\n", "\\n").Replace("\r", "\\r").Replace("\t", "\\t");
        }
    }
}
