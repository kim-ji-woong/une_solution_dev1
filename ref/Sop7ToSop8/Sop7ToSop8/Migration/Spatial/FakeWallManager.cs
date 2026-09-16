using System.Collections.Generic;
using Base.Model.Spatial;

namespace Sop7ToSop8.Migration.Spatial
{
    class FakeWallManager
    {
        private IMigrationClient m_client = null;
        private int m_nSop8SiteNo = -1;

        public FakeWallManager(IMigrationClient client, int sop8SiteNo)
        {
            m_client = client;
            m_nSop8SiteNo = sop8SiteNo;
        }

        public bool Run()
        {
            m_client.SendStatus("FakeWall 데이터를 읽어옵니다.");
            string strErrorMessage;

            if (ReadSop7(out strErrorMessage) == false)
            {
                m_client.SendStatus(strErrorMessage);
                return false;
            }

            m_client.SendStatus("FakeWall 데이터를 옮기는데 성공하였습니다.");
            return true;
        }

        private bool ReadSop7(out string strErrorMessage)
        {
            string strSQL = "Select ID, ZoneID, X, Y, Z, Rotate, Scale from SdmsSpatialFakeWall";
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
            FakeWall fakeWall = new FakeWall();
            fakeWall.fake_wall_sn = data.ID;
            fakeWall.zone_sn = data.ZoneID;
            fakeWall.rtate = data.Rotate;
            fakeWall.scale = data.Scale;
            fakeWall.x = data.X;
            fakeWall.y = data.Y;
            fakeWall.z = data.Z;

            return m_client.Sop8DataManager.GetCreate().Insert<FakeWall>(fakeWall, out strErrorMessage);
        }
    }
}
