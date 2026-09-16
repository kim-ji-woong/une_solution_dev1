using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace GwangyangSensorService.Models
{
    public sealed class UltraSrtFcstResponse
    {
        [JsonPropertyName("response")]
        public UltraSrtFcstEnvelope Response { get; set; }
    }

    public sealed class UltraSrtFcstEnvelope
    {
        [JsonPropertyName("header")]
        public UltraSrtFcstHeader Header { get; set; }

        [JsonPropertyName("body")]
        public UltraSrtFcstBody Body { get; set; }
    }

    public sealed class UltraSrtFcstHeader
    {
        [JsonPropertyName("resultCode")]
        public string ResultCode { get; set; }

        [JsonPropertyName("resultMsg")]
        public string ResultMsg { get; set; }
    }

    public sealed class UltraSrtFcstBody
    {
        [JsonPropertyName("dataType")]
        public string DataType { get; set; }

        [JsonPropertyName("items")]
        public UltraSrtFcstItems Items { get; set; }

        [JsonPropertyName("pageNo")]
        public int PageNo { get; set; }

        [JsonPropertyName("numOfRows")]
        public int NumOfRows { get; set; }

        [JsonPropertyName("totalCount")]
        public int TotalCount { get; set; }
    }

    public sealed class UltraSrtFcstItems
    {
        [JsonPropertyName("item")]
        public List<UltraSrtFcstItem> Item { get; set; } = new List<UltraSrtFcstItem>();
    }

    public sealed class UltraSrtFcstItem
    {
        [JsonPropertyName("baseDate")]
        public string BaseDate { get; set; }

        [JsonPropertyName("baseTime")]
        public string BaseTime { get; set; }

        [JsonPropertyName("category")]
        public string Category { get; set; }

        [JsonPropertyName("fcstDate")]
        public string FcstDate { get; set; }

        [JsonPropertyName("fcstTime")]
        public string FcstTime { get; set; }

        [JsonPropertyName("fcstValue")]
        public string FcstValue { get; set; }

        [JsonPropertyName("nx")]
        public int Nx { get; set; }

        [JsonPropertyName("ny")]
        public int Ny { get; set; }
    }
}
