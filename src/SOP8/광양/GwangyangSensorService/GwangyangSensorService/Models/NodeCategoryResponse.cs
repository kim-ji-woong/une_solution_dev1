using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace GwangyangSensorService.Models
{
    public sealed class NodeCategoryResponse
    {
        [JsonPropertyName("data")]
        public List<NodeCategoryItem> Data { get; set; } = new List<NodeCategoryItem>();

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

    public sealed class NodeCategoryItem
    {
        [JsonPropertyName("sys_net_node_id")]
        public string SysNetNodeId { get; set; }

        [JsonPropertyName("sys_net_node_name")]
        public string SysNetNodeName { get; set; }

        [JsonPropertyName("geom")]
        public string Geom { get; set; }

        [JsonPropertyName("category_name")]
        public string CategoryName { get; set; }

        [JsonPropertyName("sys_net_node_addr")]
        public string SysNetNodeAddr { get; set; }

        [JsonPropertyName("sensor_unique_id")]
        public string SensorUniqueId { get; set; }

        [JsonPropertyName("sensor_name_kor")]
        public string SensorNameKor { get; set; }

        [JsonPropertyName("sensor_id")]
        public List<string> SensorId { get; set; } = new List<string>();

        [JsonPropertyName("sensor_name")]
        public List<string> SensorName { get; set; } = new List<string>();
    }
}
