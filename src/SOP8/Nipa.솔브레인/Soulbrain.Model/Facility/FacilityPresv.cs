using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace Soulbrain.Model.Facility
{
    public class FacilityPresv : Table
    {

        public enum Fields {fclty_presv_sn, fclty_presv_name, fclty_id, presv_mesure_id, fclty_presv_model_name, zone_sn, fclty_ty_optn_code, fclty_ty_code, sensor_sn, sensor_ty_optn_code, sensor_ty_code };
        public enum WriteFields { fclty_presv_name, fclty_id, presv_mesure_id, fclty_presv_model_name, fclty_ty_optn_code, fclty_ty_code, sensor_sn, sensor_ty_optn_code, sensor_ty_code };

        public int fclty_presv_sn { get; set; }
        public string fclty_presv_name { get; set; }
        public string fclty_id { get; set; }
        public string presv_mesure_id { get; set; }
        public string fclty_presv_model_name { get; set; }
        public int zone_sn { get; set; }
        public int fclty_ty_optn_code { get; set; }
        public int fclty_ty_code { get; set; }
        public int? sensor_sn { get; set; }
        public int? sensor_ty_optn_code { get; set; }
        public int? sensor_ty_code { get; set; }


        public static string TableName { get { return "fa_fclty_presv"; } }

        public override string GetTableName()
        {
            return TableName;
        }

        public override Type GetFieldType()
        {
            return typeof(Fields);
        }

        public override Type GetWriteFieldType()
        {
            return typeof(WriteFields);
        }

        public void FromCopy(FacilityPresv obj)
        {
            this.fclty_presv_sn = obj.fclty_presv_sn;
            this.fclty_presv_name = obj.fclty_presv_name;
            this.fclty_id = obj.fclty_id;
            this.presv_mesure_id = obj.presv_mesure_id;
            this.fclty_presv_model_name = obj.fclty_presv_model_name;
            this.zone_sn = obj.zone_sn;
            this.fclty_ty_optn_code = obj.fclty_ty_optn_code;
            this.fclty_ty_code = obj.fclty_ty_code;
            this.sensor_sn = obj.sensor_sn;
            this.sensor_ty_optn_code = obj.sensor_ty_optn_code;
            this.sensor_ty_code = obj.sensor_ty_code;
        }
    }
}