using System.Collections.Generic;
using Base.Model.Sop.Component;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace Sop7ToSop8.Migration.Sop
{
    using Models;

    class GridManager
    {
        private IMigrationClient m_client = null;
        private int m_nSop8SiteNo = -1;

        public GridManager(IMigrationClient client, int sop8SiteNo)
        {
            m_client = client;
            m_nSop8SiteNo = sop8SiteNo;
        }

        public bool Run()
        {
            m_client.SendStatus("SOP Grid 데이터를 읽어옵니다.");
            string strErrorMessage;

            IDataManager dataManager = m_client.Sop8DataManager.Clone();

            if (dataManager.BeginBatch(out strErrorMessage) == false)
                return false;

            if (ReadSop7(dataManager, out strErrorMessage) == false)
            {
                string strTemp;
                dataManager.BatchRollback(out strTemp);

                m_client.SendStatus(strErrorMessage);
                return false;
            }

            if (dataManager.BatchCommit(out strErrorMessage) == false)
            {
                string strTemp;
                dataManager.BatchRollback(out strTemp);
                return false;
            }

            m_client.SendStatus("SOP Grid 데이터를 옮기는데 성공하였습니다.");
            return true;
        }

        private bool ReadSop7(IDataManager dataManager, out string strErrorMessage)
        {
            string strSQL = "Select ID, StepMemberID from SopComponentSectionGrid";
            IEnumerable<dynamic> arrGridResults = m_client.Sop7DataManager.GetSelect().Select(strSQL, out strErrorMessage);

            if (arrGridResults == null)
                return false;

            strSQL = "Select GridID, ColumnIndex, Width from SopComponentSectionGridColumn";
            IEnumerable<dynamic> arrColumnResults = m_client.Sop7DataManager.GetSelect().Select(strSQL, out strErrorMessage);

            if (arrColumnResults == null)
                return false;

            strSQL = "Select GridID, RowIndex, Height from SopComponentSectionGridRow";
            IEnumerable<dynamic> arrRowResults = m_client.Sop7DataManager.GetSelect().Select(strSQL, out strErrorMessage);

            if (arrRowResults == null)
                return false;

            // 자동증가 초기화
            if (dataManager.GetUpdate().Update("DBCC CHECKIDENT(" + GridEx.TableName + ", reseed, 0)", out strErrorMessage) == false)
                return false;

            // 자동증가 해제
            if (dataManager.GetUpdate().Update("SET IDENTITY_INSERT " + GridEx.TableName + " ON", out strErrorMessage) == false)
                return false;

            foreach (var data in arrGridResults)
            {
                if (CreateSop8Grid(dataManager, data, out strErrorMessage) == false)
                {
                    // 자동증가 설정
                    string strTemp;
                    dataManager.GetUpdate().Update("SET IDENTITY_INSERT " + GridEx.TableName + " OFF", out strTemp);
                    return false;
                }
            }

            foreach (var data in arrColumnResults)
            {
                if (CreateSop8GridColumn(dataManager, data, out strErrorMessage) == false)
                {
                    // 자동증가 설정
                    string strTemp;
                    dataManager.GetUpdate().Update("SET IDENTITY_INSERT " + GridEx.TableName + " OFF", out strTemp);
                    return false;
                }
            }

            foreach (var data in arrRowResults)
            {
                if (CreateSop8GridRow(dataManager, data, out strErrorMessage) == false)
                {
                    // 자동증가 설정
                    string strTemp;
                    dataManager.GetUpdate().Update("SET IDENTITY_INSERT " + GridEx.TableName + " OFF", out strTemp);
                    return false;
                }
            }

            // 자동증가 설정
            if (dataManager.GetUpdate().Update("SET IDENTITY_INSERT " + GridEx.TableName + " OFF", out strErrorMessage) == false)
                return false;

            return true;
        }

        private bool CreateSop8Grid(IDataManager dataManager, dynamic data, out string strErrorMessage)
        {
            GridEx model = new GridEx();
            model.grid_sn = data.ID;
            model.step_memb_sn = data.StepMemberID;

            return dataManager.GetCreate().Insert<GridEx>(model, out strErrorMessage);
        }

        private bool CreateSop8GridColumn(IDataManager dataManager, dynamic data, out string strErrorMessage)
        {
            GridColumn model = new GridColumn();
            model.grid_sn = data.GridID;
            model.column_no = data.ColumnIndex;
            model.width = data.Width;

            return dataManager.GetCreate().Insert<GridColumn>(model, out strErrorMessage);
        }

        private bool CreateSop8GridRow(IDataManager dataManager, dynamic data, out string strErrorMessage)
        {
            GridRow model = new GridRow();
            model.grid_sn = data.GridID;
            model.row_no = data.RowIndex;
            model.height = data.Height;

            return dataManager.GetCreate().Insert<GridRow>(model, out strErrorMessage);
        }
    }
}
