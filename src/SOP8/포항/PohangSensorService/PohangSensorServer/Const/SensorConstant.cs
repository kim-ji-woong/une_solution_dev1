namespace PohangSensorServer.Const
{
    public class SensorConstant
    {
        public const string Atmosphere = "Atmosphere";
        public const string Rainfall = "Rainfall";
        public const string WaterLevel = "WaterLevel";
        public const string Odor = "Odor";
        public const string AIOdor = "AIOdor";
        public const string Weather = "Weather";
        
        public enum SensorTypeIdx
        {
            Atmosphere = 1,
            WaterLevel = 2,
            Rainfall = 4,
            Odor = 13,
            AIOdor = 14,
            Weather = 5
        }

        public enum SensorDetectType
        {
            Normal = 0,
            Boundary = 1,
            Distribution = 2,
            None = 99,
        }
    }
}