using System.Collections.Generic;
using System.Text.Json.Serialization;
using GwangyangSensorService.Converters;

namespace GwangyangSensorService.Models
{
    public sealed class ReportLastResponse
    {
        [JsonPropertyName("data")]
        public List<ReportLastItem> Data { get; set; } = new List<ReportLastItem>();

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

    public sealed class ReportLastItem
    {
        [JsonPropertyName("id")]
        public string Id { get; set; }

        [JsonPropertyName("sensor_id")]
        [JsonConverter(typeof(TolerantIntListConverter))]
        public List<int> sensor_id { get; set; }

        [JsonPropertyName("category_name")]
        public string CategoryName { get; set; }

        [JsonPropertyName("category_value")]
        public string CategoryValue { get; set; }

        [JsonPropertyName("xpos")]
        public string Xpos { get; set; }

        [JsonPropertyName("ypos")]
        public string Ypos { get; set; }

        [JsonPropertyName("name")]
        public string Name { get; set; }

        [JsonPropertyName("addr")]
        public string Addr { get; set; }

        [JsonPropertyName("use")]
        public int Use { get; set; }

        [JsonPropertyName("grade")]
        public List<string> Grade { get; set; } = new List<string>();

        [JsonPropertyName("sensor_name")]
        public List<string> SensorName { get; set; } = new List<string>();

        [JsonPropertyName("sensor_unit")]
        public List<string> SensorUnit { get; set; }

        [JsonPropertyName("wind_dir")]
        public string WindDir { get; set; }

        [JsonPropertyName("value")]
        [JsonConverter(typeof(TolerantDoubleListConverter))]
        public List<double> Value { get; set; } = new List<double>();

        [JsonPropertyName("intime")]
        public List<string> Intime { get; set; } = new List<string>();

        [JsonPropertyName("units")]
        public List<string> Units { get; set; }
    }
}
