using Soulbrain.Model;
using System.Collections.Generic;
using Response;
using System;

namespace Soulbrain.BLL.Response
{
    public class ResponseFacilityModelList : MessageResult
    {
        // 모델 정보
        public List<ResFacilityModelData> Models { get; set; }



        public ResponseFacilityModelList()
            : base()
        {
        }

        public ResponseFacilityModelList(bool success, string message)
            : base(success, message)
        {
        }
    }

    public class ResFacilityModelData : Model.Gltf.FacilityZoneModel
    {
        public ResFacilityModelData(Model.Gltf.FacilityZoneModel data)
        {
            this.gltf_fclty_zone_model_sn = data.gltf_fclty_zone_model_sn;
            this.gltf_model_sn = data.gltf_model_sn;
            this.model_file = data.model_file;
            this.camera_lc_x = data.camera_lc_x;
            this.camera_lc_y = data.camera_lc_y;
            this.camera_lc_z = data.camera_lc_z;
            this.camera_rtate_x = data.camera_rtate_x;
            this.camera_rtate_y = data.camera_rtate_y;
            this.camera_rtate_z = data.camera_rtate_z;
            this.fov = data.fov;
            this.near = data.near;
            this.far = data.far;
            this.orbit_x = data.orbit_x;
            this.orbit_y = data.orbit_y;
            this.orbit_z = data.orbit_z;
            this.min_zone_sn = data.min_zone_sn;
            this.max_zone_sn = data.max_zone_sn;
            this.fclty_type_code = data.fclty_type_code;
        }


        // 기본 값은 전체 카메라 정보, 타입ID

        // 건물 정보
        public int buld_sn { get; set; }
        public string BuildingDisplayName { get; set; }
        // 타입 정보 (전처리필터, 이온교환수지, 전력모니터링)
        public string TypeName { get; set; }
        public int? SiteNo { get; set; }


        // 존 정보
        public List<ResFacilityZoneData> ZoneData { get; set; }    
    }

    public class ResFacilityZoneData : Model.Gltf.FacilityZoneModelData
    {
        public ResFacilityZoneData(Model.Gltf.FacilityZoneModelData data)
        {
            this.gltf_fclty_zone_model_sn = data.gltf_fclty_zone_model_sn;
            this.zone_sn = data.zone_sn;
            this.camera_lc_x = data.camera_lc_x;
            this.camera_lc_y = data.camera_lc_y;
            this.camera_lc_z = data.camera_lc_z;
            this.camera_rtate_x = data.camera_rtate_x;
            this.camera_rtate_y = data.camera_rtate_y;
            this.camera_rtate_z = data.camera_rtate_z;
            this.fov = data.fov;
            this.near = data.near;
            this.far = data.far;
            this.orbit_x = data.orbit_x;
            this.orbit_y = data.orbit_y;
            this.orbit_z = data.orbit_z;
        }

        // 기본 값은 존 ID, 카메라 정보
        public string ZoneName { get; set; }
        public string ZoneDisplayName { get; set; }

        // 설비 리스트 정보

    }
}
