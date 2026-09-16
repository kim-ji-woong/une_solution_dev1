using System.Collections.Generic;
using Base.Model.Gltf;

namespace Sop7ToSop8.Migration.Sdms
{
    class GltfModelOrthoDataManager
    {
        private IMigrationClient m_client = null;
        private int m_nSop8SiteNo = -1;

        public GltfModelOrthoDataManager(IMigrationClient client, int sop8SiteNo)
        {
            m_client = client;
            m_nSop8SiteNo = sop8SiteNo;
        }

        public bool Run()
        {
            m_client.SendStatus("GltfModelOrthoData 데이터를 읽어옵니다.");
            string strErrorMessage;

            if (ReadSop7(out strErrorMessage) == false)
            {
                m_client.SendStatus(strErrorMessage);
                return false;
            }

            m_client.SendStatus("GltfModelOrthoData 데이터를 옮기는데 성공하였습니다.");
            return true;
        }

        private bool ReadSop7(out string strErrorMessage)
        {
            string strSQL = "Select ID, ModelID, ModelFile, CameraPositionX, CameraPositionY, CameraPositionZ, CameraRotationX, CameraRotationY, CameraRotationZ, TargetX, TargetY, TargetZ, Zoom, ZoneID from SdmsGltfModelOrthoData";
            IEnumerable<dynamic> arrResults = m_client.Sop7DataManager.GetSelect().Select(strSQL, out strErrorMessage);

            if (arrResults == null)
                return false;

            foreach (var data in arrResults)
            {
                if (CreateSop8(data, out strErrorMessage) == false)
                {
                    // 오류만 알리고 중단시키지 않는다.
                    m_client.SendStatus(strErrorMessage);
                }
            }

            return true;
        }

        private bool CreateSop8(dynamic data, out string strErrorMessage)
        {
            ModelOrthoData modelData = new ModelOrthoData();
            modelData.gltf_model_ortho_data_sn = data.ID;
            modelData.gltf_model_sn = data.ModelID;
            modelData.model_file = data.ModelFile;
            modelData.camera_lc_x = data.CameraPositionX;
            modelData.camera_lc_y = data.CameraPositionY;
            modelData.camera_lc_z = data.CameraPositionZ;
            modelData.camera_rtate_x = data.CameraRotationX;
            modelData.camera_rtate_y = data.CameraRotationY;
            modelData.camera_rtate_z = data.CameraRotationZ;
            modelData.trgt_x = data.TargetX;
            modelData.trgt_y = data.TargetY;
            modelData.trgt_z = data.TargetZ;
            modelData.zoom = data.Zoom;
            modelData.zone_sn = data.ZoneID;

            return m_client.Sop8DataManager.GetCreate().Insert<ModelOrthoData>(modelData, out strErrorMessage);
        }
    }
}
