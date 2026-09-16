using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace Pohang.Model
{
    public class MaterialLink : Table
    {
        public enum Fields { sys_op_sensor_code_idx, sensor_name_kor, sensor_name_eng, sensor_unique_id, sensor_unit, limit_type, limit_notice, limit_attention, limit_warning }
        
        public enum WriteFields { sys_op_sensor_code_idx, sensor_name_kor, sensor_name_eng, sensor_unique_id, sensor_unit, limit_type, limit_notice, limit_attention, limit_warning }
        
        public int sys_op_sensor_code_idx { get; set; }
        
        public string sensor_name_kor { get; set; }
        
        public string sensor_name_eng { get; set; }
        
        public int sensor_unique_id { get; set; }
        
        public string sensor_unit { get; set; }
        
        public int limit_type { get; set; }
        
        public float limit_notice { get; set; }
        
        public float limit_attention { get; set; }
        
        public float limit_warning { get; set; }
        
        public static string TableName
        {
            get { return "ex_material_link"; }
        }
        
        public override string GetTableName()
        {
            return TableName;
        }
        
        public override string GetPrimaryCondition()
        {
            return string.Format("{0} = {1}", Fields.sys_op_sensor_code_idx, sys_op_sensor_code_idx);
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