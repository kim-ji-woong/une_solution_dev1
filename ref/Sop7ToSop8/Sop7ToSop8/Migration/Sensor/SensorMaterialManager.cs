using dnsDapperDBUtil.DataAccessLayer.IDAL;
using dnsData.CommonCode;
using Base.Model.Sensor;

namespace Sop7ToSop8.Migration.Sensor
{
    class SensorMaterialManager
    {
        public static bool Run(IDataManager dataManager, SensorZone sensorZone, dynamic sensorData, out string strErrorMessage)
        {
            return MakeSensorMaterial(dataManager, sensorZone, sensorData, out strErrorMessage);
        }

        private static bool MakeSensorMaterial(IDataManager dataManager, SensorZone sensorZone, dynamic sensorData, out string strErrorMessage)
        {
            Material material = new Material();
            material.sensor_zone_sn = sensorZone.sensor_zone_sn;
            material.cur_data = NullableToString(sensorData.CurrentData);
            material.lim_bas = ToNullableDouble(sensorData.LimitBase);

            if (sensorData.LimitType == 1)
            {
                material.sensor_lim_ty_optn_code = (int)CodeType.SensorLimitType;
                material.sensor_lim_ty = SdmsSensor.SensorLimitType.Normal;
            }

            if (dataManager.GetCreate().Insert<Material>(material, out strErrorMessage) == false)
                return false;

            if (sensorData.LimitType == 1)
                return MakeSensorMaterialLimitNormal(dataManager, material, sensorData, out strErrorMessage);

            return true;
        }

        private static double? ToNullableDouble(object value)
        {
            if (value == null)
                return null;

            if (value is double || value is double?)
                return (double)value;

            if (value is string)
            {
                double data;

                if (double.TryParse(((string)value).Trim(), out data))
                    return data;
            }

            return null;
        }

        private static string NullableToString(object value)
        {
            if (value == null)
                return null;

            if (value is string)
                return ((string)value).Trim();

            return string.Format("{0:F2}", (double)value);
        }

        private static bool MakeSensorMaterialLimitNormal(IDataManager dataManager, Material material, dynamic sensorData, out string strErrorMessage)
        {
            strErrorMessage = null;

            if (sensorData.LimitValue == null)
                return true;

            string strLimitValue = sensorData.LimitValue.Trim();

            if (strLimitValue.Length == 0)
                return true;

            bool[] usable = new bool[3];
            double?[] values = new double?[3];

            if (ParseLimitData(strLimitValue, out usable[0], out usable[1], out usable[2], out values[0], out values[1], out values[2], out strErrorMessage) == false)
                return false;

            for (int i = 0; i < 3; i++)
            {
                MaterialLimitData limitData = new MaterialLimitData();
                limitData.sensor_zone_sn = material.sensor_zone_sn;
                limitData.lim_indx = i;
                limitData.usab = usable[i];
                limitData.value = values[i];

                if (dataManager.GetCreate().Insert<MaterialLimitData>(limitData, out strErrorMessage) == false)
                    return false;
            }

            return true;
        }

        private static bool ParseLimitData(string strData, out bool use1, out bool use2, out bool use3, out double? value1, out double? value2, out double? value3, out string strErrorMessage)
        {
            strErrorMessage = null;
            use1 = use2 = use3 = true;
            value1 = value2 = value3 = null;

            string[] tokens = strData.Split('|');

            if (tokens.Length != 2)
            {
                strErrorMessage = "형식에 맞지 않는 데이터입니다. : " + strData;
                return false;
            }

            string strLeft = tokens[0].Trim();
            string strRight = tokens[1].Trim();

            tokens = strLeft.Split(',');

            if (tokens.Length != 3)
            {
                strErrorMessage = "형식에 맞지 않는 데이터입니다. : " + strData;
                return false;
            }

            use1 = tokens[0].Trim().ToLower() == "true";
            use2 = tokens[1].Trim().ToLower() == "true";
            use3 = tokens[2].Trim().ToLower() == "true";

            tokens = strRight.Split(',');

            if (tokens.Length != 3)
            {
                strErrorMessage = "형식에 맞지 않는 데이터입니다. : " + strData;
                return false;
            }

            if (tokens[0].Trim().Length > 0)
            {
                double value;
                double.TryParse(tokens[0].Trim(), out value);
                value1 = value;
            }

            if (tokens[1].Trim().Length > 0)
            {
                double value;
                double.TryParse(tokens[1].Trim(), out value);
                value2 = value;
            }

            if (tokens[2].Trim().Length > 0)
            {
                double value;
                double.TryParse(tokens[2].Trim(), out value);
                value3 = value;
            }

            return true;
        }
    }
}
