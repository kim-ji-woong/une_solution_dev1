using System.Collections.Generic;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using Response;
using Base.Model.Spatial;

namespace Base.SDMS.BLL.Process
{
    using IBLL.Request;
    using IBLL.Response;
    using IBLL.Models;

    class FakeWallManager
    {
        private IDataManager m_dataManager = null;

        public FakeWallManager(IDataManager dataManager)
        {
            m_dataManager = dataManager;
        }

        public MessageResult UpdateList(RequestUpdateFakeWall data)
        {
            string strDeletedNos = null;
            List<FakeWall> updateFakeWalls = new List<FakeWall>();
            List<FakeWall> addedFakeWalls = new List<FakeWall>();

            foreach (var updateData in data.UpdateDatas)
            {
                if (updateData.IsDeleted)
                {
                    if (strDeletedNos == null)
                        strDeletedNos = updateData.FakeWallNo.ToString();
                    else
                        strDeletedNos += "," + updateData.FakeWallNo.ToString();
                }
                else if (updateData.IsNew)
                {
                    addedFakeWalls.Add(ToFakeWall(updateData));
                }
                else
                {
                    updateFakeWalls.Add(ToFakeWall(updateData));
                }
            }

            string strErrorMessage;
            IDataManager dataManager = m_dataManager.Clone();

            if (dataManager.BeginBatch(out strErrorMessage) == false)
                return new MessageResult(false, "시스템 데이터베이스의 트랜잭션을 시작할 수 없습니다.", ErrorCode.BeginTransactionFail);

            if (DeleteFakeWalls(dataManager, strDeletedNos, out strErrorMessage) == false)
            {
                string strTemp;
                dataManager.BatchRollback(out strTemp);
                return new MessageResult(false, strErrorMessage);
            }

            if (dataManager.GetUpdate().Update<FakeWall>(updateFakeWalls, out strErrorMessage) == false)
            {
                string strTemp;
                dataManager.BatchRollback(out strTemp);
                return new MessageResult(false, strErrorMessage);
            }

            if (dataManager.GetCreate().Insert<FakeWall>(addedFakeWalls, out strErrorMessage) == false)
            {
                string strTemp;
                dataManager.BatchRollback(out strTemp);
                return new MessageResult(false, strErrorMessage);
            }

            if (dataManager.BatchCommit(out strErrorMessage) == false)
            {
                string strTemp;
                dataManager.BatchRollback(out strTemp);
                return new MessageResult(false, "시스템 데이터베이스의 트랜잭션을 종료할 수 없습니다.", ErrorCode.CommitTransactionFail);
            }

            return new MessageResult(true, "");
        }

        public ResponseFakeWall RequestFakeWalls(RequestFakeWall data)
        {
            string strErrorMessage;
            string strCondition = string.Format("{0} = {1}", FakeWall.Fields.zone_sn, data.ZoneNo);
            IEnumerable<FakeWall> fakeWalls = m_dataManager.GetSelect().Select<FakeWall>(strCondition, out strErrorMessage);

            if (fakeWalls == null)
                return new ResponseFakeWall(false, strErrorMessage);

            ResponseFakeWall response = new ResponseFakeWall(true, "");
            response.FakeWalls.AddRange(fakeWalls);
            return response;
        }

        private bool DeleteFakeWalls(IDataManager dataManager, string strDeletedNos, out string strErrorMessage)
        {
            strErrorMessage = null;

            if (strDeletedNos == null || strDeletedNos.Length == 0)
                return true;

            string strCondition = string.Format("{0} in ({1})", FakeWall.Fields.fake_wall_sn, strDeletedNos);
            return dataManager.GetDelete().Delete<FakeWall>(strCondition, out strErrorMessage);
        }

        private FakeWall ToFakeWall(FakeWallData data)
        {
            FakeWall fakeWall = new FakeWall();

            fakeWall.fake_wall_sn = data.FakeWallNo;
            fakeWall.zone_sn = data.ZoneNo;
            fakeWall.x = data.X;
            fakeWall.y = data.Y;
            fakeWall.z = data.Z;
            fakeWall.rtate = data.Rotate;
            fakeWall.scale = data.Scale;

            return fakeWall;
        }
    }
}
