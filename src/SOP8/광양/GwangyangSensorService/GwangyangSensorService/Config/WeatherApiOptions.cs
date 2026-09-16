namespace GwangyangSensorService.Config
{
    public sealed class WeatherApiOptions
    {
        public string ServiceKey { get; set; } = string.Empty;
        public string BaseUrl { get; set; } = "https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtFcst";
        public int Nx { get; set; } = 127;
        public int Ny { get; set; } = 34;
        public int NumOfRows { get; set; } = 60;
        public int PageNo { get; set; } = 1;
        public string DataType { get; set; } = "JSON";
    }
}
