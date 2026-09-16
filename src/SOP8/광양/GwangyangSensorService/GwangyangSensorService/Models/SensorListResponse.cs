using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace GwangyangSensorService.Models
{
    public sealed class SensorListResponse
    {
        [JsonPropertyName("data")]
        public List<SensorListItem> Data { get; set; } = new List<SensorListItem>();

        [JsonPropertyName("totalCount")]
        public int TotalCount { get; set; }

        [JsonPropertyName("currentPage")]
        public int CurrentPage { get; set; }

        [JsonPropertyName("totalPage")]
        public int TotalPage { get; set; }

        [JsonPropertyName("currentElement")]
        public int CurrentElement { get; set; }

        [JsonPropertyName("success")]
        public bool Success { get; set; }

        [JsonPropertyName("message")]
        public string Message { get; set; }
    }

    public sealed class SensorListItem
    {
        [JsonPropertyName("sys_op_sensor_code_idx")]
        public int SysOpSensorCodeIdx { get; set; }

        [JsonPropertyName("sensor_name_kor")]
        public string SensorNameKor { get; set; }

        [JsonPropertyName("sensor_name_eng")]
        public string SensorNameEng { get; set; }

        [JsonPropertyName("sensor_unique_id")]
        public int SensorUniqueId { get; set; }

        [JsonPropertyName("sensor_unit")]
        public string SensorUnit { get; set; }

        [JsonPropertyName("limit_notice")]
        public int LimitNotice { get; set; }

        [JsonPropertyName("limit_attention")]
        public int LimitAttention { get; set; }

        [JsonPropertyName("limit_warning")]
        public int LimitWarning { get; set; }
    }
}
