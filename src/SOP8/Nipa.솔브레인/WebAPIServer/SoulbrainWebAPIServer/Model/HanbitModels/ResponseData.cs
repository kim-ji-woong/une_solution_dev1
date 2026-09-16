using System.Text.Json.Serialization;

namespace SoulbrainWebAPIServer.Model.HanbitModels
{
    public class ResponseData
    {
        
    }

    public class HanbitResponse
    {
        public HanbitResponse()
        {
            
        }
        
        public HanbitResponse(string result, int code, string message)
        {
            Result = result;
            Code = code;
            if (result == "success")
                Data = message;
            else
                Error = message;
        }
        
        [JsonPropertyName("result")]
        public string Result { get; set; } = "success";

        [JsonPropertyName("code")]
        public int Code { get; set; } = 200;

        [JsonPropertyName("data")]
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public object? Data { get; set; }

        [JsonPropertyName("error")]
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public object? Error { get; set; }

    }
    
    
}