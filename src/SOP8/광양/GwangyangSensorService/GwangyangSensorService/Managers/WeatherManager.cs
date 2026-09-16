using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using dnsDapperDBUtil.DataAccessLayer.DAL;
using Gwangyang.Model;
using GwangyangSensorService.Models;

namespace GwangyangSensorService.Managers
{
    public class WeatherManager
    {
        private readonly DataManager _dataManager;
        
        private static readonly string LC_NAME = "광양";
        private static readonly IReadOnlyList<string> RequiredKeys = new[]
        {
            "T1H", "RN1", "SKY", "REH", "PTY", "VEC", "WSD"
        };
        
        public WeatherManager(DataManager dataManager)
        {
            _dataManager = dataManager;
        }
        
        public async Task HandleUltraSrtFcstAsync(UltraSrtFcstResponse response)
        {
            var envelope = response?.Response;
            var header = envelope?.Header;
            if (header == null)
            {
                Logging.FileLogger.Instance.Error("UltraSrtFcst API failed: response header is null.");
                return;
            }

            if (header.ResultCode != "00")
            {
                Logging.FileLogger.Instance.Error($"UltraSrtFcst API failed: {header.ResultMsg} Code: {header.ResultCode}");
            }

            var items = envelope?.Body?.Items?.Item;
            if (items == null)
            {
                Logging.FileLogger.Instance.Error("UltraSrtFcst API failed: response items are null.");
                return;
            }

            var earliest = new Dictionary<string, UltraSrtFcstItem>(StringComparer.OrdinalIgnoreCase);
            foreach (var item in items)
            {
                if (string.IsNullOrWhiteSpace(item.Category))
                    continue;

                if (!int.TryParse(item.FcstTime, out int fcstTime))
                    continue;

                if (!earliest.TryGetValue(item.Category, out var existing))
                {
                    earliest[item.Category] = item;
                    continue;
                }

                if (!int.TryParse(existing.FcstTime, out int existingTime) || fcstTime < existingTime)
                    earliest[item.Category] = item;
            }

            List<string> missingKeys = new List<string>();
            foreach (string key in RequiredKeys)
            {
                if (!earliest.TryGetValue(key, out var item))
                    missingKeys.Add(key);
            }

            if (missingKeys.Count > 0)
            {
                Logging.FileLogger.Instance.Error($"Forecast data missing keys: {string.Join(", ", missingKeys)}");
                return;
            }

            await Task.Run(() =>
            {
                string strConditions = $@"{nameof(WeatherData.Fields.lc_name)} like '%{LC_NAME}%'";
                var selectResult = _dataManager.GetSelect().Select<WeatherData>(strConditions, out string errorMessage);

                if (selectResult == null)
                {
                    Logging.FileLogger.Instance.Error($"Failed to retrieve weather data: {errorMessage}");
                    return;
                }

                var curWeatherData = selectResult.ToList();

                WeatherData? existingData = curWeatherData.FirstOrDefault();
                bool isUpdate = existingData != null;
                WeatherData weatherData = existingData ?? new WeatherData { lc_name = LC_NAME };

                ApplyForecast(weatherData, earliest);

                if (isUpdate)
                {
                    if (_dataManager.GetUpdate().Update(weatherData, null, out errorMessage) == false)
                    {
                        Logging.FileLogger.Instance.Error($"Failed to update weather data: {errorMessage}");
                    }
                }
                else
                {
                    if (_dataManager.GetCreate().Insert(weatherData, out string strErrorMessage) == false)
                    {
                        Logging.FileLogger.Instance.Error($"Failed to insert weather data: {strErrorMessage}");
                    }
                }
            });
        }

        private void ApplyForecast(WeatherData weatherData, Dictionary<string, UltraSrtFcstItem> earliest)
        {
            weatherData.temp_value = SetValue(earliest["T1H"]?.FcstValue);
            weatherData.rain_per_hour_value = SetValue(earliest["RN1"]?.FcstValue);
            weatherData.sky_status_value = (int)SetValue(earliest["SKY"]?.FcstValue);
            weatherData.humi_value = SetValue(earliest["REH"]?.FcstValue);
            weatherData.rain_status_value = (int)SetValue(earliest["PTY"]?.FcstValue);
            weatherData.wind_direction_value = SetValue(earliest["VEC"]?.FcstValue);
            weatherData.wind_speed_value = SetValue(earliest["WSD"]?.FcstValue);

            weatherData.last_update_tm = DateTime.Now;
        }
        
        private float SetValue(string? value)
        {
            if (!string.IsNullOrWhiteSpace(value) && float.TryParse(value, out float result))
                return result;

            return 0f;
        }
    }
}
