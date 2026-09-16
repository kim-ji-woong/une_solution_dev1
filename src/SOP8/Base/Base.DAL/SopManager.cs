using System.Collections;
using System.Collections.Generic;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using Base.Model.Sop.Category;

namespace Base.DAL
{
    public class SopManager : JoinManager
    {
        public SopManager(IDataManager dataManager)
            : base(dataManager)
        {
        }

        // 실행중인 SOP인가?
        public bool? IsRunningSOPfromVersion(List<int> versionNos, out string strErrorMessage)
        {
            strErrorMessage = null;

            if (versionNos == null || versionNos.Count == 0)
                return false;

            string strSQL = string.Format("Select a.{4} historyNo from {0} a inner join {1} b on a.{5} = b.{6} and a.{7} is null inner join {2} c on b.{8} = c.{9} inner join {3} d on c.{10} = d.{11} and d.ver_sn in ({12})",
                Model.History.ActionStep.TableName, ActionStep.TableName, SmallClass.TableName, Model.Sop.Category.Version.TableName,
                Model.History.ActionStep.Fields.action_step_hist_sn,
                Model.History.ActionStep.Fields.action_step_sn, ActionStep.Fields.action_step_sn,
                Model.History.ActionStep.Fields.end_time,
                ActionStep.Fields.sclas_sn, SmallClass.Fields.sclas_sn,
                SmallClass.Fields.ver_sn, Model.Sop.Category.Version.Fields.ver_sn,
                string.Join(",", versionNos.ToArray()));

            ArrayList arrDatas = new ArrayList();
            IEnumerable<dynamic> result = this.Select(strSQL, out strErrorMessage);

            if (result == null)
                return null;

            foreach (var item in result)
            {
                int historyNo = item.historyNo;
                return true;
            }

            return false;
        }

        // 실행중인 SOP인가?
        public bool? IsRunningSOPfromDisaster(List<int> disasterNos, out string strErrorMessage)
        {
            strErrorMessage = null;

            if (disasterNos == null || disasterNos.Count == 0)
                return false;

            string strSQL = string.Format("Select a.{3} historyNo from {0} a inner join {1} b on a.{4} = b.{5} and a.{6} is null inner join {2} c on b.{7} = c.{8} and c.{8} in ({9})",
                Model.History.ActionStep.TableName, ActionStep.TableName, SmallClass.TableName,
                Model.History.ActionStep.Fields.action_step_hist_sn,
                Model.History.ActionStep.Fields.action_step_sn, ActionStep.Fields.action_step_sn,
                Model.History.ActionStep.Fields.end_time,
                ActionStep.Fields.sclas_sn, SmallClass.Fields.sclas_sn,
                string.Join(",", disasterNos.ToArray()));

            ArrayList arrDatas = new ArrayList();
            IEnumerable<dynamic> result = this.Select(strSQL, out strErrorMessage);

            if (result == null)
                return null;

            foreach (var item in result)
            {
                int historyNo = item.historyNo;
                return true;
            }

            return false;
        }
    }
}
