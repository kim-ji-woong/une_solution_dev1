using System;
using System.Collections.Generic;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using Base.Model.Sop.Category;
using Base.Model.Sop.Component;
using Base.SOPManager.IBLL.Request;
using Response;
using Response.Resource;
using Base.DAL;

namespace Base.SOPManager.BLL.Process
{
    using Resource;

    class DeleteManager
    {
        public static bool DeleteSOPVersion(string strVersionNos, bool deleteVersion, IDataManager dataManager, out string strErrorMessage)
        {
            strErrorMessage = null;
            LoadManager loadManager = new LoadManager(dataManager);

            if (loadManager.IsRunningVersion(strVersionNos, out strErrorMessage))
            {
                strErrorMessage = "실행중인 SOP는 삭제하거나 수정할 수 없습니다";
                return false;
            }
            else if (strErrorMessage != null)
                return false;

            string strCondition = string.Format("{0} in ({1})", SmallClass.Fields.ver_sn, strVersionNos);
            IEnumerable<SmallClass> disasters = dataManager.GetSelect().Select<SmallClass>(strCondition, out strErrorMessage);

            if (disasters == null)
                return false;

            string strDisasterNos = "";

            foreach (SmallClass disaster in disasters)
            {
                if (strDisasterNos.Length == 0)
                    strDisasterNos = disaster.sclas_sn.ToString();
                else
                    strDisasterNos += ", " + disaster.sclas_sn.ToString();
            }

            if (strDisasterNos.Length == 0)
            {
                if (deleteVersion)
                    return DeleteVersion(strVersionNos, dataManager, out strErrorMessage);

                return true;
            }

            strCondition = string.Format("{0} in ({1})", ActionStep.Fields.sclas_sn, strDisasterNos);
            IEnumerable<ActionStep> actionSteps = dataManager.GetSelect().Select<ActionStep>(strCondition, out strErrorMessage);

            if (actionSteps == null)
                return false;

            string strActionStepNos = "";

            foreach (ActionStep actionStep in actionSteps)
            {
                if (strActionStepNos.Length == 0)
                    strActionStepNos = actionStep.action_step_sn.ToString();
                else
                    strActionStepNos += ", " + actionStep.action_step_sn.ToString();
            }

            if (strActionStepNos.Length == 0)
            {
                if (!DeleteDisaster(strVersionNos, dataManager, out strErrorMessage))
                    return false;

                if (deleteVersion)
                    return DeleteVersion(strVersionNos, dataManager, out strErrorMessage);
                return true;
            }

            strCondition = string.Format("{0} in ({1})", StepMember.Fields.action_step_sn, strActionStepNos);
            IEnumerable<StepMember> stepMembers = dataManager.GetSelect().Select<StepMember>(strCondition, out strErrorMessage);

            if (stepMembers == null)
                return false;

            string strStepMemberNos = "";

            foreach (StepMember stepMember in stepMembers)
            {
                if (strStepMemberNos.Length == 0)
                    strStepMemberNos = stepMember.step_memb_sn.ToString();
                else
                    strStepMemberNos += ", " + stepMember.step_memb_sn.ToString();
            }

            if (strStepMemberNos.Length == 0)
            {
                if (!DeleteActionStepHistory(strActionStepNos, dataManager, out strErrorMessage))
                    return false;
                if (!DeleteActionStep(strDisasterNos, dataManager, out strErrorMessage))
                    return false;
                if (!DeleteDisaster(strVersionNos, dataManager, out strErrorMessage))
                    return false;
                if (deleteVersion)
                    return DeleteVersion(strVersionNos, dataManager, out strErrorMessage);

                return true;
            }
            else
            {
                if (!DeleteComponentHistory(strStepMemberNos, dataManager, out strErrorMessage))
                    return false;

                if (!DeleteComponent(strStepMemberNos, dataManager, out strErrorMessage))
                {
                    return false;
                }

                if (!DeleteSectionGrid(strStepMemberNos, dataManager, out strErrorMessage))
                {
                    return false;
                }
            }
            if (!DeleteActionStepHistory(strActionStepNos, dataManager, out strErrorMessage))
            {
                return false;
            }
            if (!DeleteStepMember(strActionStepNos, dataManager, out strErrorMessage))
            {
                return false;
            }
            if (!DeleteActionStep(strDisasterNos, dataManager, out strErrorMessage))
            {
                return false;
            }
            if (!DeleteDisaster(strVersionNos, dataManager, out strErrorMessage))
            {
                return false;
            }
            if (deleteVersion)
            {
                if (!DeleteVersion(strVersionNos, dataManager, out strErrorMessage))
                {
                    return false;
                }
            }

            return true;
        }

        private static bool DeleteSOPDisaster(string strDisasterNos, bool deleteVersion, IDataManager dataManager, out string strErrorMessage)
        {
            strErrorMessage = null;
            LoadManager loadManager = new LoadManager(dataManager);

            if (loadManager.IsRunningVersion2(strDisasterNos, out strErrorMessage))
            {
                strErrorMessage = "실행중인 SOP는 삭제하거나 수정할 수 없습니다";
                return false;
            }
            else if (strErrorMessage != null)
                return false;

            string strCondition = string.Format("{0} in ({1})", ActionStep.Fields.sclas_sn, strDisasterNos);
            IEnumerable<ActionStep> actionSteps = dataManager.GetSelect().Select<ActionStep>(strCondition, out strErrorMessage);

            if (actionSteps == null)
                return false;

            string strActionStepNos = "";

            foreach (ActionStep actionStep in actionSteps)
            {
                if (strActionStepNos.Length == 0)
                    strActionStepNos = actionStep.action_step_sn.ToString();
                else
                    strActionStepNos += ", " + actionStep.action_step_sn.ToString();
            }

            if (strActionStepNos.Length == 0)
            {
                if (!DeleteDisaster2(strDisasterNos, dataManager, out strErrorMessage))
                    return false;

                if (deleteVersion)
                    return DeleteNoReferenceVersion(dataManager, out strErrorMessage);
                return true;
            }

            strCondition = string.Format("{0} in ({1})", StepMember.Fields.action_step_sn, strActionStepNos);
            IEnumerable<StepMember> stepMembers = dataManager.GetSelect().Select<StepMember>(strCondition, out strErrorMessage);

            if (stepMembers == null)
                return false;

            string strStepMemberNos = "";

            foreach (StepMember stepMember in stepMembers)
            {
                if (strStepMemberNos.Length == 0)
                    strStepMemberNos = stepMember.step_memb_sn.ToString();
                else
                    strStepMemberNos += ", " + stepMember.step_memb_sn.ToString();
            }

            if (strStepMemberNos.Length == 0)
            {
                if (!DeleteActionStepHistory(strActionStepNos, dataManager, out strErrorMessage))
                    return false;
                if (!DeleteActionStep(strDisasterNos, dataManager, out strErrorMessage))
                    return false;
                if (!DeleteDisaster2(strDisasterNos, dataManager, out strErrorMessage))
                    return false;
                if (deleteVersion)
                    return DeleteNoReferenceVersion(dataManager, out strErrorMessage);

                return true;
            }
            else
            {
                if (!DeleteComponent(strStepMemberNos, dataManager, out strErrorMessage))
                {
                    return false;
                }

                if (!DeleteSectionGrid(strStepMemberNos, dataManager, out strErrorMessage))
                {
                    return false;
                }
            }
            if (!DeleteActionStepHistory(strActionStepNos, dataManager, out strErrorMessage))
            {
                return false;
            }
            if (!DeleteStepMember(strActionStepNos, dataManager, out strErrorMessage))
            {
                return false;
            }
            if (!DeleteActionStep(strDisasterNos, dataManager, out strErrorMessage))
            {
                return false;
            }
            if (!DeleteDisaster2(strDisasterNos, dataManager, out strErrorMessage))
            {
                return false;
            }
            if (deleteVersion)
            {
                if (!DeleteNoReferenceVersion(dataManager, out strErrorMessage))
                {
                    return false;
                }
            }

            return true;
        }

        private static bool DeleteVersion(string strVersionNos, IDataManager dataManager, out string strErrorMessage)
        {
            string strCondition = string.Format("{0} in ({1})", Model.Sop.Category.Version.Fields.ver_sn, strVersionNos);
            return dataManager.GetDelete().Delete<Model.Sop.Category.Version>(strCondition, out strErrorMessage);
        }

        private static bool DeleteNoReferenceVersion(IDataManager dataManager, out string strErrorMessage)
        {
            string strCondition = string.Format("{0} not in (Select {1} from {2})", Model.Sop.Category.Version.Fields.ver_sn, SmallClass.Fields.ver_sn, SmallClass.TableName);
            return dataManager.GetDelete().Delete<Model.Sop.Category.Version>(strCondition, out strErrorMessage);
        }

        private static bool DeleteDisaster(string strVersionNos, IDataManager dataManager, out string strErrorMessage)
        {
            string strCondition = string.Format("{0} in ({1})", SmallClass.Fields.ver_sn, strVersionNos);
            return dataManager.GetDelete().Delete<SmallClass>(strCondition, out strErrorMessage);
        }

        private static bool DeleteDisaster2(string strDisasterNos, IDataManager dataManager, out string strErrorMessage)
        {
            string strCondition = string.Format("{0} in ({1})", SmallClass.Fields.sclas_sn, strDisasterNos);
            return dataManager.GetDelete().Delete<SmallClass>(strCondition, out strErrorMessage);
        }

        private static bool DeleteActionStepHistory(string strActionStepNos, IDataManager dataManager, out string strErrorMessage)
        {
            string strCondition = string.Format("{0} in (Select {1} from {2} where {3} in (Select {4} from {5} where {6} in ({7})))",
                Model.History.ComponentDetail.Fields.compn_hist_sn,
                Model.History.Component.Fields.compn_hist_sn,
                Model.History.Component.TableName,
                Model.History.Component.Fields.action_step_hist_sn,
                Model.History.ActionStep.Fields.action_step_hist_sn,
                Model.History.ActionStep.TableName,
                Model.History.ActionStep.Fields.action_step_sn,
                strActionStepNos);

            if (dataManager.GetDelete().Delete<Model.History.ComponentDetail>(strCondition, out strErrorMessage) == false)
                return false;

            strCondition = string.Format("{0} in (Select {1} from {2} where {3} in ({4}))",
                Model.History.Component.Fields.action_step_hist_sn,
                Model.History.ActionStep.Fields.action_step_hist_sn,
                Model.History.ActionStep.TableName,
                Model.History.ActionStep.Fields.action_step_sn,
                strActionStepNos);

            if (dataManager.GetDelete().Delete<Model.History.Component>(strCondition, out strErrorMessage) == false)
                return false;

            strCondition = string.Format("{0} in ({1})",
                Model.History.ActionStep.Fields.action_step_sn,
                strActionStepNos);

            if (dataManager.GetDelete().Delete<Model.History.ActionStep>(strCondition, out strErrorMessage) == false)
                return false;

            return true;
        }

        private static bool DeleteActionStep(string strDisasterNos, IDataManager dataManager, out string strErrorMessage)
        {
            string strCondition = string.Format("{0} in ({1})", ActionStep.Fields.sclas_sn, strDisasterNos);
            return dataManager.GetDelete().Delete<ActionStep>(strCondition, out strErrorMessage);
        }

        private static bool DeleteComponentHistory(string strStepMemberNos, IDataManager dataManager, out string strErrorMessage)
        {
            if (strStepMemberNos.Length == 0)
            {
                strErrorMessage = null;
                return true;
            }

            string strCondition = string.Format("{0} in (Select {1} from {2} where {3} in ({4}))",
                Model.History.Component.Fields.compn_sn,
                Component.Fields.compn_sn,
                Component.TableName,
                Component.Fields.step_memb_sn,
                strStepMemberNos);

            string strSubCondition = string.Format("{0} in (Select {1} from {2} where {3})",
                Model.History.ComponentDetail.Fields.compn_hist_sn,
                Model.History.Component.Fields.compn_hist_sn,
                Model.History.Component.TableName,
                strCondition);

            if (dataManager.GetDelete().Delete<Model.History.ComponentDetail>(strSubCondition, out strErrorMessage) == false)
                return false;

            return dataManager.GetDelete().Delete<Model.History.Component>(strCondition, out strErrorMessage);
        }

        private static bool DeleteComponent(string strStepMemberNos, IDataManager dataManager, out string strErrorMessage)
        {
            string strCondition = string.Format("Select {0} no from {1} where {2} in ({3})", Component.Fields.compn_sn, Component.TableName, Component.Fields.step_memb_sn, strStepMemberNos);
            IEnumerable<dynamic> componentNos = dataManager.GetSelect().Select(strCondition, out strErrorMessage);

            if (componentNos == null)
                return false;

            string strComponentNos = "";

            foreach (var item in componentNos)
            {
                if (strComponentNos.Length == 0)
                    strComponentNos = item.no.ToString();
                else
                    strComponentNos += "," + item.no.ToString();
            }

            if (strComponentNos.Length == 0)
                return true;

            strCondition = string.Format("{0} in ({1})", Comment.Fields.compn_sn, strComponentNos);

            if (dataManager.GetDelete().Delete<Comment>(strCondition, out strErrorMessage) == false)
                return false;

            strCondition = string.Format("{0} in ({1})", DecisionAutoScriptVariable.Fields.compn_sn, strComponentNos);

            if (dataManager.GetDelete().Delete<DecisionAutoScriptVariable>(strCondition, out strErrorMessage) == false)
                return false;

            strCondition = string.Format("{0} in ({1})", Decision.Fields.compn_sn, strComponentNos);

            if (dataManager.GetDelete().Delete<Decision>(strCondition, out strErrorMessage) == false)
                return false;

            strCondition = string.Format("{0} in ({1})", Endpoint.Fields.compn_sn, strComponentNos);

            if (dataManager.GetDelete().Delete<Endpoint>(strCondition, out strErrorMessage) == false)
                return false;

            strCondition = string.Format("{0} in ({1})", ProcessTemporary.Fields.compn_sn, strComponentNos);

            if (dataManager.GetDelete().Delete<ProcessTemporary>(strCondition, out strErrorMessage) == false)
                return false;

            strCondition = string.Format("{0} in ({1})", ProcessRegular.Fields.compn_sn, strComponentNos);

            if (dataManager.GetDelete().Delete<ProcessRegular>(strCondition, out strErrorMessage) == false)
                return false;

            strCondition = string.Format("{0} in ({1})", ProcessMission.Fields.compn_sn, strComponentNos);

            if (dataManager.GetDelete().Delete<ProcessMission>(strCondition, out strErrorMessage) == false)
                return false;

            strCondition = string.Format("{0} in ({1})", Model.Sop.Component.Process.Fields.compn_sn, strComponentNos);

            if (dataManager.GetDelete().Delete<Model.Sop.Component.Process>(strCondition, out strErrorMessage) == false)
                return false;

            strCondition = string.Format("{0} in ({1})", TransmissionRegular.Fields.compn_sn, strComponentNos);

            if (dataManager.GetDelete().Delete<TransmissionRegular>(strCondition, out strErrorMessage) == false)
                return false;

            strCondition = string.Format("{0} in ({1})", TransmissionTemporary.Fields.compn_sn, strComponentNos);

            if (dataManager.GetDelete().Delete<TransmissionTemporary>(strCondition, out strErrorMessage) == false)
                return false;

            strCondition = string.Format("{0} in ({1})", Transmission.Fields.compn_sn, strComponentNos);

            if (dataManager.GetDelete().Delete<Transmission>(strCondition, out strErrorMessage) == false)
                return false;

            strCondition = string.Format("{0} in ({1}) or {2} in ({1})", Arrow.Fields.begin_compn_sn, strComponentNos, Arrow.Fields.end_compn_sn);

            if (dataManager.GetDelete().Delete<Arrow>(strCondition, out strErrorMessage) == false)
                return false;

            strCondition = string.Format("{0} in ({1})", Component.Fields.compn_sn, strComponentNos);

            if (dataManager.GetDelete().Delete<Component>(strCondition, out strErrorMessage) == false)
                return false;

            return true;
        }

        private static bool DeleteSectionGrid(string strStepMemberNos, IDataManager dataManager, out string strErrorMessage)
        {
            string strCondition = string.Format("{0} in (Select {1} from {2} where {3} in ({4}))",
                GridColumn.Fields.grid_sn,
                Grid.Fields.grid_sn,
                Grid.TableName,
                Grid.Fields.step_memb_sn,
                strStepMemberNos);

            if (dataManager.GetDelete().Delete<GridColumn>(strCondition, out strErrorMessage) == false)
                return false;

            strCondition = string.Format("{0} in (Select {1} from {2} where {3} in ({4}))",
                GridRow.Fields.grid_sn,
                Grid.Fields.grid_sn,
                Grid.TableName,
                Grid.Fields.step_memb_sn,
                strStepMemberNos);

            if (dataManager.GetDelete().Delete<GridRow>(strCondition, out strErrorMessage) == false)
                return false;

            strCondition = string.Format("{0} in ({1})",
                Grid.Fields.step_memb_sn,
                strStepMemberNos);

            if (dataManager.GetDelete().Delete<Grid>(strCondition, out strErrorMessage) == false)
                return false;

            return true;
        }

        private static bool DeleteStepMember(string strActionStepNos, IDataManager dataManager, out string strErrorMessage)
        {
            string strCondition = string.Format("{0} in ({1})", StepMember.Fields.action_step_sn, strActionStepNos);
            return dataManager.GetDelete().Delete<StepMember>(strCondition, out strErrorMessage);
        }

        public static MessageResult DeleteSOP(RequestDelete data, IDataManager dataManager)
        {
            dataManager = dataManager.Clone();

            string strErrorMessage;

            if (dataManager.BeginBatch(out strErrorMessage) == false)
            {
                System.Diagnostics.Trace.WriteLine(strErrorMessage);
                return new MessageResult(false, ID.Get<ErrorMessage>("failToBeginTransaction").Value());
            }

            // 실행중인 SOP는 삭제할 수 없다.
            if (CheckRunningSop(dataManager, data.VersionNos, data.DisasterNos, out strErrorMessage) == false)
            {
                string strTemp;
                dataManager.BatchRollback(out strTemp);
                return new MessageResult(false, strErrorMessage);
            }

            if (data.VersionNos != null)
            {
                string strVersionNos = "";

                foreach (int versionNo in data.VersionNos)
                {
                    if (strVersionNos.Length == 0)
                        strVersionNos = versionNo.ToString();
                    else
                        strVersionNos += "," + versionNo.ToString();
                }

                if (strVersionNos.Length > 0)
                {
                    if (DeleteSOPVersion(strVersionNos, true, dataManager, out strErrorMessage) == false)
                    {
                        string strTemp;
                        dataManager.BatchRollback(out strTemp);
                        return new MessageResult(false, strErrorMessage);
                    }
                }
            }
            else if (data.DisasterNos != null)
            {
                string strDisasterNos = "";

                foreach (int disasterNo in data.DisasterNos)
                {
                    if (strDisasterNos.Length == 0)
                        strDisasterNos = disasterNo.ToString();
                    else
                        strDisasterNos += "," + disasterNo.ToString();
                }

                if (strDisasterNos.Length > 0)
                {
                    if (DeleteSOPDisaster(strDisasterNos, true, dataManager, out strErrorMessage) == false)
                    {
                        string strTemp;
                        dataManager.BatchRollback(out strTemp);
                        return new MessageResult(false, strErrorMessage);
                    }
                }
            }

            if (dataManager.BatchCommit(out strErrorMessage) == false)
            {
                System.Diagnostics.Trace.WriteLine(strErrorMessage);

                string strTemp;
                dataManager.BatchRollback(out strTemp);
                return new MessageResult(false, ID.Get<ErrorMessage>("failToCommitTransaction").Value());
            }

            return new MessageResult(true, "");
        }

        public static bool CheckRunningSop(IDataManager dataManager, List<int> versionNos, List<int> disasterNos, out string strErrorMessage)
        {
            strErrorMessage = null;

            SopManager sopManager = new SopManager(dataManager);
            bool? isRunning = null;

            if (versionNos != null)
                isRunning = sopManager.IsRunningSOPfromVersion(versionNos, out strErrorMessage);
            else if (disasterNos != null)
                isRunning = sopManager.IsRunningSOPfromDisaster(disasterNos, out strErrorMessage);
            else
                return true;

            if (isRunning == null)
                return false;

            if (isRunning == true)
            {
                strErrorMessage = ID.Get<ErrorMessage>("runningSOP").Value();
                return false;
            }

            return true;
        }
    }
}
