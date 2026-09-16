using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace Weather.Model
{
	public class WeatherSite : Table
	{
		public enum Fields { WeatherSiteNo, Name, RegionCode, ServiceCityCode };
		public enum WriteFields { WeatherSiteNo, Name, RegionCode, ServiceCityCode };

		public int WeatherSiteNo { get; set; }
		public string Name { get; set; }
		public string RegionCode { get; set; }
		public string ServiceCityCode { get; set; }

		public static string TableName { get { return "WeatherSite"; } }

		public override string GetTableName()
		{
			return TableName;
		}

		public override string GetPrimaryCondition()
		{
			return string.Format("{0} = {1}", Fields.WeatherSiteNo, WeatherSiteNo);
		}

		public override Type GetFieldType()
		{
			return typeof(Fields);
		}

		public override Type GetWriteFieldType()
		{
			return typeof(WriteFields);
		}
	}
}
