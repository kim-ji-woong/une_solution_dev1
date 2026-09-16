using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace SoulbrainWebAPIServer.Model.HanbitModels
{
    public class RequestData
    {
        public class Scanner
        {
            [Required(ErrorMessage = "Scanner MAC is required")]
            [JsonPropertyName("scanner_mac")]
            public string ScannerMac { get; set; }

            [Required]
            [JsonPropertyName("scanner_name")]
            public string ScannerName { get; set; }

            [Range(-90, 90, ErrorMessage = "Latitude must be between -90 and 90")]
            [JsonPropertyName("scanner_lat")]
            public double ScannerLat { get; set; }

            [Range(-180, 180, ErrorMessage = "Longitude must be between -180 and 180")]
            [JsonPropertyName("scanner_lng")]
            public double ScannerLng { get; set; }
        }

        public class TagInfo
        {
            [Required]
            [JsonPropertyName("tag_mac")]
            public string TagMac { get; set; }

            [JsonPropertyName("tag_lat")]
            public double TagLat { get; set; }

            [JsonPropertyName("tag_lng")]
            public double TagLng { get; set; }
            
            [JsonPropertyName("name")]
            public string Name { get; set; }

            [JsonPropertyName("birth")]
            public string Birth { get; set; }

            [JsonPropertyName("mobile")]
            public string Mobile { get; set; }

            [JsonPropertyName("company")]
            public string Company { get; set; }

            [JsonPropertyName("location")]
            public string Location { get; set; }

            [JsonPropertyName("purpose")]
            public string Purpose { get; set; }

            [JsonPropertyName("manager_name")]
            public string ManagerName { get; set; }
        }
        
        public class RequestScannerTagInfo : Scanner
        {
            [JsonPropertyName("tag_count")] 
            public int TagCount { get; set; }

            [JsonPropertyName("tag_auth")] 
            public int TagAuth { get; set; }

            [JsonPropertyName("tag_unauth")] 
            public int TagUnauth { get; set; }

            [JsonPropertyName("tag_data")] 
            public List<CurrentTagInfo> TagData { get; set; }

            public class CurrentTagInfo : TagInfo
            {
                [JsonPropertyName("sos")] 
                public bool SOS { get; set; }
                
                [JsonPropertyName("auth")] 
                public bool Auth { get; set; }
            }

            [JsonPropertyName("time")] 
            public string Time { get; set; }
            
        }

        public class RequestUnauthTagSignal : TagInfo
        {
            [Required(ErrorMessage = "Scanner MAC is required")]
            [JsonPropertyName("scanner_mac")]
            public string ScannerMac { get; set; }

            [Required]
            [JsonPropertyName("scanner_name")]
            public string ScannerName { get; set; }

            [Range(-90, 90, ErrorMessage = "Latitude must be between -90 and 90")]
            [JsonPropertyName("scanner_lat")]
            public double ScannerLat { get; set; }

            [Range(-180, 180, ErrorMessage = "Longitude must be between -180 and 180")]
            [JsonPropertyName("scanner_lng")]
            public double ScannerLng { get; set; }
            
            [JsonPropertyName("building_name")]
            public string BuildingName { get; set; }
            
            [JsonPropertyName("factory_name")]
            public string FactoryName { get; set; }
            
            [JsonPropertyName("floor_name")]
            public string FloorName { get; set; }
            
            [JsonPropertyName("time")] 
            public string Time { get; set; }

        }
        
        public class RequestSosSignal : TagInfo
        {
            [Required(ErrorMessage = "Scanner MAC is required")]
            [JsonPropertyName("scanner_mac")]
            public string ScannerMac { get; set; }

            [Required]
            [JsonPropertyName("scanner_name")]
            public string ScannerName { get; set; }

            [Range(-90, 90, ErrorMessage = "Latitude must be between -90 and 90")]
            [JsonPropertyName("scanner_lat")]
            public float ScannerLat { get; set; }

            [Range(-180, 180, ErrorMessage = "Longitude must be between -180 and 180")]
            [JsonPropertyName("scanner_lng")]
            public float ScannerLng { get; set; }

            [JsonPropertyName("building_name")]
            public string BuildingName { get; set; }

            [JsonPropertyName("factory_name")]
            public string FactoryName { get; set; }

            [JsonPropertyName("floor_name")]
            public string FloorName { get; set; }

            [JsonPropertyName("flag")]
            public bool Flag { get; set; }

            [JsonPropertyName("time")]
            public string Time { get; set; }
        }
    }
}