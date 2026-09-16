using System.Collections.Generic;
using Base.Model.Gltf;

namespace Sop7ToSop8.Migration.Sdms
{
    class GltfModelManager
    {
        private IMigrationClient m_client = null;
        private int m_nSop8SiteNo = -1;

        public GltfModelManager(IMigrationClient client, int sop8SiteNo)
        {
            m_client = client;
            m_nSop8SiteNo = sop8SiteNo;
        }

        public bool Run()
        {
            m_client.SendStatus("GltfModel 데이터를 읽어옵니다.");
            string strErrorMessage;

            if (ReadSop7(out strErrorMessage) == false)
            {
                m_client.SendStatus(strErrorMessage);
                return false;
            }

            m_client.SendStatus("GltfModel 데이터를 옮기는데 성공하였습니다.");
            return true;
        }

        private bool ReadSop7(out string strErrorMessage)
        {
            string strSQL = "Select ID, ParentID, ModelName from SdmsGltfModel";
            IEnumerable<dynamic> arrResults = m_client.Sop7DataManager.GetSelect().Select(strSQL, out strErrorMessage);

            if (arrResults == null)
                return false;

            foreach (var data in arrResults)
            {
                if (CreateSop8(data, out strErrorMessage) == false)
                    return false;
            }

            return true;
        }

        private bool CreateSop8(dynamic data, out string strErrorMessage)
        {
            Model model = new Model();
            model.gltf_model_sn = data.ID;
            model.parnts_sn = data.ParentID;
            model.model_name = data.ModelName;
            model.site_sn = m_nSop8SiteNo;

            return m_client.Sop8DataManager.GetCreate().Insert<Model>(model, out strErrorMessage);
        }
    }
}
