using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace DCOP.Model
{
    public class DataCenter : Table
	{
		public enum Fields { DataCenterNo, DataCenterName, RegionNo, SiteNo, Address, RegTime, Width, Length, Height, TileWidth, TileLength, TileElevation, Latitude, Longitude, Barcode, WeatherSiteNo };
		public enum WriteFields { DataCenterName, RegionNo, SiteNo, Address, RegTime, Width, Length, Height, TileWidth, TileLength, TileElevation, Latitude, Longitude, Barcode, WeatherSiteNo };

		public int DataCenterNo { get; set; }
		public string DataCenterName { get; set; }
		public int RegionNo { get; set; }
		public int SiteNo { get; set; }
		public string Address { get; set; }
		public DateTime RegTime { get; set; }
		public int Width { get; set; }
		public int Length { get; set; }
		public int Height { get; set; }
		public int TileWidth { get; set; }
		public int TileLength { get; set; }
		public int TileElevation { get; set; }
		public double Latitude { get; set; }
		public double Longitude { get; set; }
		public string Barcode { get; set; }
		public int WeatherSiteNo { get; set; }

		public static string TableName { get { return "DataCenter"; } }

		public override string GetTableName()
		{
			return TableName;
		}

		public override string GetPrimaryCondition()
		{
			return string.Format("{0} = {1}", Fields.DataCenterNo, DataCenterNo);
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
