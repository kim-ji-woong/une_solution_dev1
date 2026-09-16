using Base.Model.Sensor.CCTV;

namespace Gwangyang.IBLL.Models
{
    public class CctvEx : CCTV
    {
        private string m_strCameraName = "";

        public string CameraName
        {
            get { return m_strCameraName; }
            set { m_strCameraName = value; }
        }

        public CctvEx()
        {
        }

        public CctvEx(CCTV cctv)
        {
            this.camera_ip = cctv.camera_ip;
            this.camera_makr_name = cctv.camera_makr_name;
            this.camera_model_name = cctv.camera_model_name;
            this.cctv_no = cctv.cctv_no;
            this.chnnl = cctv.chnnl;
            this.hd_url = cctv.hd_url;
            this.indoor_yn = cctv.indoor_yn;
            this.ld_url = cctv.ld_url;
            this.password = cctv.password;
            this.sensor_sn = cctv.sensor_sn;
            this.sensor_ty_code = cctv.sensor_ty_code;
            this.sensor_ty_optn_code = cctv.sensor_ty_optn_code;
            this.strmg_ty = cctv.strmg_ty;
            this.unq_key = cctv.unq_key;
            this.url = cctv.url;
            this.user_id = cctv.user_id;
        }
    }
}
