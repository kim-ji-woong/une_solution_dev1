using System.Collections.Generic;
using System.Linq;
using Base.Model.Common.Team;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using Base.DAL;

namespace Base.TeamEditor.BLL.Process
{
    class DeleteManager
    {
        public static bool RemoveRegularMember(IDataManager dataManager, IEnumerable<RegularMember> regularMembers, out string strErrorMessage)
        {
            strErrorMessage = null;

            foreach (RegularMember member in regularMembers)
            {
                if (RemoveTemporaryMembers(dataManager, null, member.rgl_memb_sn, ref strErrorMessage) == false)
                    return false;

                if (RemoveAccountUser(dataManager, member.rgl_memb_sn, ref strErrorMessage) == false)
                    return false;
            }

            string strMemberNos = "";

            foreach (RegularMember member in regularMembers)
            {
                if (strMemberNos.Length == 0)
                    strMemberNos = member.rgl_memb_sn.ToString();
                else
                    strMemberNos += "," + member.rgl_memb_sn.ToString();
            }

            if (strMemberNos.Length > 0)
            {
                string strCondition = string.Format("{0} in ({1})", Model.History.SMSReceiver.Fields.rgl_memb_sn, strMemberNos);

                if (dataManager.GetDelete().Delete<Model.History.SMSReceiver>(strCondition, out strErrorMessage) == false)
                    return false;

                strCondition = string.Format("{0} in ({1})", RegularMember.Fields.rgl_memb_sn, strMemberNos);

                if (dataManager.GetDelete().Delete<RegularMember>(strCondition, out strErrorMessage) == false)
                    return false;
            }

            return true;
        }

        // regularNos에 해당하는 Regular 팀들을 모두 삭제한다.(하위팀 포함)
        public static bool RemoveRegular(IDataManager dataManager, List<int> regularNos, out string strErrorMessage)
        {
            strErrorMessage = null;

            if (regularNos == null || regularNos.Count == 0)
                return true;

            // regularNos의 하위팀까지 모두 얻어온다.
            string strCondition = string.Format("{0} in ({1})", Regular.Fields.rgl_sn, string.Join(",", regularNos.ToArray()));
            ICollection<int> finalRegularNos = CustomManager.GetRecursiveQuery(dataManager, Regular.TableName, Regular.Fields.rgl_sn.ToString(), Regular.Fields.parnts_sn.ToString(), strCondition, out strErrorMessage);

            if (finalRegularNos == null)
                return false;

            regularNos = new List<int>();
            regularNos.AddRange(finalRegularNos);

            strCondition = string.Format("{0} in ({1})", RegularMember.Fields.rgl_sn, string.Join(",", regularNos.ToArray()));
            IEnumerable<RegularMember> queryResult = dataManager.GetSelect().Select<RegularMember>(strCondition, out strErrorMessage);
            
            if (queryResult == null)
                return false;
            
            var regularMembers = queryResult.ToList();

            if (regularMembers.Any())
            {
                if (RemoveRegularMember(dataManager, regularMembers, out strErrorMessage) == false)
                    return false;
            }

            if (RemoveTemporaryMembers(dataManager, regularNos, null, ref strErrorMessage) == false)
                return false;

            if (dataManager.GetDelete().Delete<RegularMember>(strCondition, out strErrorMessage) == false)
                return false;

            strCondition = string.Format("{0} in ({1})", Model.Sop.Component.TransmissionRegular.Fields.rgl_sn, string.Join(",", regularNos.ToArray()));

            if (dataManager.GetDelete().Delete<Model.Sop.Component.TransmissionRegular>(strCondition, out strErrorMessage) == false)
                return false;

            strCondition = string.Format("{0} in ({1})", Model.Sop.Component.ProcessRegular.Fields.rgl_sn, string.Join(",", regularNos.ToArray()));

            if (dataManager.GetDelete().Delete<Model.Sop.Component.ProcessRegular>(strCondition, out strErrorMessage) == false)
                return false;

            strCondition = string.Format("{0} in ({1})", Regular.Fields.rgl_sn, string.Join(",", regularNos.ToArray()));

            if (dataManager.GetDelete().Delete<Regular>(strCondition, out strErrorMessage) == false)
                return false;

            return true;
        }

        // regularNos에 속해있지 않은 Regular 팀들을 모두 삭제한다.
        public static bool RemoveRegularNot(IDataManager dataManager, List<int> regularNos, out string strErrorMessage)
        {
            strErrorMessage = null;

            bool isEmpty = regularNos == null || regularNos.Count == 0;
            string strCondition = isEmpty ? null : string.Format("{0} not in ({1})", Regular.Fields.rgl_sn, string.Join(",", regularNos.ToArray()));
            IEnumerable<Regular> regulars = dataManager.GetSelect().Select<Regular>(strCondition, out strErrorMessage);

            if (regulars == null)
                return false;

            List<int> teamNos = new List<int>();

            foreach (Regular regular in regulars)
            {
                teamNos.Add(regular.rgl_sn);
            }

            return RemoveRegular(dataManager, teamNos, out strErrorMessage);
        }

        public static bool RemoveTemporaryMembers(IDataManager dataManager, List<TemporaryMember> members, out string strErrorMessage)
        {
            string strMemberNos = "";

            foreach (TemporaryMember member in members)
            {
                if (strMemberNos.Length == 0)
                    strMemberNos = member.tmpr_memb_sn.ToString();
                else
                    strMemberNos +=  "," + member.tmpr_memb_sn.ToString();
            }

            if (strMemberNos.Length > 0)
            {
                /*string strCondition = string.Format("{0} in ({1})", TemporaryMemberRegular.Fields.tmpr_memb_sn, strMemberNos);

                if (dataManager.GetDelete().Delete<TemporaryMemberRegular>(strCondition, out strErrorMessage) == false)
                    return false;

                strCondition = string.Format("{0} in ({1})", TemporaryMemberRegularMember.Fields.tmpr_memb_sn, strMemberNos);

                if (dataManager.GetDelete().Delete<TemporaryMemberRegularMember>(strCondition, out strErrorMessage) == false)
                    return false;*/

                string strCondition = string.Format("{0} in ({1})", TemporaryMember.Fields.tmpr_memb_sn, strMemberNos);

                if (dataManager.GetDelete().Delete<TemporaryMember>(strCondition, out strErrorMessage) == false)
                    return false;
            }
            else
                strErrorMessage = null;

            return true;
        }

        public static bool RemoveTemporaries(IDataManager dataManager, List<int> teamNos, out string strErrorMessage)
        {
            strErrorMessage = null;

            if (teamNos == null || teamNos.Count == 0)
                return true;

            // regularNos의 하위팀까지 모두 얻어온다.
            string strCondition = string.Format("{0} in ({1})", Temporary.Fields.tmpr_sn, string.Join(",", teamNos.ToArray()));
            ICollection<int> finalTeamNos = CustomManager.GetRecursiveQuery(dataManager, Temporary.TableName, Temporary.Fields.tmpr_sn.ToString(), Temporary.Fields.parnts_sn.ToString(), strCondition, out strErrorMessage);

            if (finalTeamNos == null)
                return false;

            string strTeamNos = "";

            foreach (int teamNo in finalTeamNos)
            {
                if (strTeamNos.Length == 0)
                    strTeamNos = teamNo.ToString();
                else
                    strTeamNos += "," + teamNo.ToString();
            }

            strCondition = string.Format("{0} in ({1})", Model.Sop.Component.TransmissionTemporary.Fields.tmpr_sn, strTeamNos);

            if (dataManager.GetDelete().Delete<Model.Sop.Component.TransmissionTemporary>(strCondition, out strErrorMessage) == false)
                return false;

            strCondition = string.Format("{0} in ({1})", Model.Sop.Component.ProcessTemporary.Fields.tmpr_sn, strTeamNos);

            if (dataManager.GetDelete().Delete<Model.Sop.Component.ProcessTemporary>(strCondition, out strErrorMessage) == false)
                return false;

            strCondition = string.Format("{0} in ({1})", TemporaryMember.Fields.tmpr_sn, strTeamNos);

            if (dataManager.GetDelete().Delete<TemporaryMember>(strCondition, out strErrorMessage) == false)
                return false;

            strCondition = string.Format("{0} in ({1})", Temporary.Fields.tmpr_sn, strTeamNos);

            if (dataManager.GetDelete().Delete<Temporary>(strCondition, out strErrorMessage) == false)
                return false;

            return true;
        }

        private static bool RemoveTemporaryMembers(IDataManager dataManager, List<int> regularNos, int? regularMemberNo, ref string strErrorMessage)
        {
            string strCondition = "";
            
            if (regularNos != null)
            {
                /*string strCondition2 = string.Format("{0} in ({1})", TemporaryMemberRegular.Fields.rgl_sn, string.Join(",", regularNos.ToArray()));

                if (dataManager.GetDelete().Delete<TemporaryMemberRegular>(strCondition2, out strErrorMessage) == false)
                    return false;*/

                strCondition = string.Format("{0} in ({1})", TemporaryMember.Fields.rgl_sn, string.Join(",", regularNos.ToArray()));
            }

            if (regularMemberNo != null)
            {
                /*string strCondition2 = string.Format("{0} = {1}", TemporaryMemberRegularMember.Fields.rgl_memb_sn, regularMemberNo);

                if (dataManager.GetDelete().Delete<TemporaryMemberRegularMember>(strCondition2, out strErrorMessage) == false)
                    return false;*/

                if (strCondition.Length == 0)
                    strCondition = string.Format("{0} = {1}", TemporaryMember.Fields.rgl_memb_sn, regularMemberNo);
                else
                    strCondition += string.Format(" and {0} = {1}", TemporaryMember.Fields.rgl_memb_sn, regularMemberNo);
            }

            if (strCondition.Length == 0)
                return true;

            return dataManager.GetDelete().Delete<TemporaryMember>(strCondition, out strErrorMessage);
        }

        public static bool RemoveAccountUser(IDataManager dataManager, int regularMemberNo, ref string strErrorMessage)
        {
            // 연동 계정 옵션 제거
            string strSubQuery = string.Format("Select {0} from {1} where {2} = {3}", Model.Account.User.Fields.user_sn, Model.Account.User.TableName, Model.Account.User.Fields.rgl_memb_sn, regularMemberNo);
            string strCondition = string.Format("{0} in ({1})", Model.Account.Option.Fields.user_sn, strSubQuery);

            if (dataManager.GetDelete().Delete<Model.Account.Option>(strCondition, out strErrorMessage) == false)
                return false;

            // 연동 계정 세션 제거
            strCondition = string.Format("{0} in ({1})", Model.Account.Session.Fields.user_sn, strSubQuery);

            if (dataManager.GetDelete().Delete<Model.Account.Session>(strCondition, out strErrorMessage) == false)
                return false;

            // 삭제할 계정으로 작성된 SOP Component 이력은 계정 정보를 null로 바꾼다.
            Dictionary<Model.History.Component.Fields, object> dicSets = new Dictionary<Model.History.Component.Fields, object>();
            dicSets[Model.History.Component.Fields.user_sn] = null;

            strCondition = string.Format("{0} in ({1})", Model.History.Component.Fields.user_sn, strSubQuery);

            if (dataManager.GetUpdate().Update<Model.History.Component, Model.History.Component.Fields>(dicSets, strCondition, out strErrorMessage) == false)
                return false;

            // 삭제할 계정으로 작성된 SOP Component 이력은 계정 정보를 null로 바꾼다.
            Dictionary<Model.History.ActionStep.Fields, object> dicSets2 = new Dictionary<Model.History.ActionStep.Fields, object>();
            dicSets2[Model.History.ActionStep.Fields.user_sn] = null;

            strCondition = string.Format("{0} in ({1})", Model.History.ActionStep.Fields.user_sn, strSubQuery);

            if (dataManager.GetUpdate().Update<Model.History.ActionStep, Model.History.ActionStep.Fields>(dicSets2, strCondition, out strErrorMessage) == false)
                return false;

            // 삭제할 계정으로 작성된 SOP Version은 계정 정보를 null로 바꾼다.
            Dictionary<Model.Sop.Category.Version.Fields, object> dicSets3 = new Dictionary<Model.Sop.Category.Version.Fields, object>();
            dicSets3[Model.Sop.Category.Version.Fields.user_sn] = null;

            strCondition = string.Format("{0} in ({1})", Model.Sop.Category.Version.Fields.user_sn, strSubQuery);

            if (dataManager.GetUpdate().Update<Model.Sop.Category.Version, Model.Sop.Category.Version.Fields>(dicSets3, strCondition, out strErrorMessage) == false)
                return false;

            Dictionary<Model.History.SensorReaction.Fields, object> dicSets4 = new Dictionary<Model.History.SensorReaction.Fields, object>();
            dicSets4[Model.History.SensorReaction.Fields.user_sn] = null;

            strCondition = string.Format("{0} in ({1})", Model.History.SensorReaction.Fields.user_sn, strSubQuery);

            if (dataManager.GetUpdate().Update<Model.History.SensorReaction, Model.History.SensorReaction.Fields>(dicSets4, strCondition, out strErrorMessage) == false)
                return false;

            Dictionary<Model.Alarm.Current.Fields, object> dicSets5 = new Dictionary<Model.Alarm.Current.Fields, object>();
            dicSets5[Model.Alarm.Current.Fields.user_sn] = null;

            strCondition = string.Format("{0} in ({1})", Model.Alarm.Current.Fields.user_sn, strSubQuery);

            if (dataManager.GetUpdate().Update<Model.Alarm.Current, Model.Alarm.Current.Fields>(dicSets5, strCondition, out strErrorMessage) == false)
                return false;

            strCondition = string.Format("{0} in ({1})", Model.Gltf.PrivateModelData.Fields.user_sn, strSubQuery);

            if (dataManager.GetDelete().Delete<Model.Gltf.PrivateModelData>(strCondition, out strErrorMessage) == false)
                return false;

            strCondition = string.Format("{0} in ({1})", Model.Gltf.PrivateModelOrthoData.Fields.user_sn, strSubQuery);

            if (dataManager.GetDelete().Delete<Model.Gltf.PrivateModelOrthoData>(strCondition, out strErrorMessage) == false)
                return false;

            // 연동 계정 제거
            strCondition = string.Format("{0} in ({1})", Model.Account.User.Fields.user_sn, strSubQuery);

            if (dataManager.GetDelete().Delete<Model.Account.User>(strCondition, out strErrorMessage) == false)
                return false;

            return true;
        }
    }
}
