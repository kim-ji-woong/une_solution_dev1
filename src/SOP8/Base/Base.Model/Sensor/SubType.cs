using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace Base.Model.Sensor
{
	public class SubType : Table
	{
		public enum Fields { sensor_ty_optn_code, sensor_ty_code, sensor_sub_ty_no, sensor_sub_ty_name, uom, descp };
		public enum WriteFields { sensor_ty_optn_code, sensor_ty_code, sensor_sub_ty_no, sensor_sub_ty_name, uom, descp };

		public int sensor_ty_optn_code { get; set; }
		public int sensor_ty_code { get; set; }
		public int sensor_sub_ty_no { get; set; }
		public string sensor_sub_ty_name { get; set; }
		public string/* nullable */ uom { get; set; }
		public string/* nullable */ descp { get; set; }

		public static string TableName { get { return "fa_sensor_sub_ty"; } }

		public override string GetTableName()
		{
			return TableName;
		}

		public override string GetPrimaryCondition()
		{
			return string.Format("{0} = {1} and {2} = {3} and {4} = {5}", Fields.sensor_ty_optn_code, sensor_ty_optn_code, Fields.sensor_ty_code, sensor_ty_code, Fields.sensor_sub_ty_no, sensor_sub_ty_no);
		}

		public override Type GetFieldType()
		{
			return typeof(Fields);
		}

		public override Type GetWriteFieldType()
		{
			return typeof(WriteFields);
		}

		public void FromCopy(SubType obj)
		{
			this.sensor_ty_optn_code = obj.sensor_ty_optn_code;
			this.sensor_ty_code = obj.sensor_ty_code;
			this.sensor_sub_ty_no = obj.sensor_sub_ty_no;
			this.sensor_sub_ty_name = obj.sensor_sub_ty_name;
			this.uom = obj.uom;
			this.descp = obj.descp;
		}
	}
}
