using System.Collections;
using System.Collections.Generic;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using Base.SOPManager.IBLL.Response;
using Base.SOPManager.IBLL.Models;
using Base.SOPManager.IBLL.Models.Category;
using Base.SOPManager.IBLL.Models.Component;
using Base.Model.Sop.Category;
using Base.DAL;
using Base.Model.Account;
using Base.Model.Sop.Component;
using Response.Resource;
using Base.Model.Sop.Config;
using System.Linq;
using Base.Model.Common.Team;
using Base.SOPManager.IBLL.Request;
using Base.Model.Common;
using Base.Model.Sensor;
using Base.Model.Spatial;

namespace Base.SOPManager.BLL.Process
{
    using Resource;
    using Models;

    class LoadManager
    {
        private IDataManager m_dataManager = null;

        public LoadManager(IDataManager dataManager)
        {
            m_dataManager = dataManager;
        }

        // SOP 상세정보를 포함한다.
        public ResponseDisasterCategories RequestDisasterCategories(int nSiteNo, bool? isNormal)
        {
            string strErrorMessage;
            IEnumerable<DisasterCategoryData> disasterCategoryDatas = ReadDisasterCategories(nSiteNo, isNormal, true, out strErrorMessage);

            if (disasterCategoryDatas == null)
                return new ResponseDisasterCategories(false, strErrorMessage);

            ResponseDisasterCategories response = new ResponseDisasterCategories(true, "");
            response.DisasterCategoryDatas.AddRange(disasterCategoryDatas);
            return response;
        }

        // SOP 상세정보를 포함하지 않고 ActionStep까지만 얻어온다.
        public ResponseDisasterCategories RequestDisasterCategoryList(int nSiteNo, bool? isNormal)
        {
            string strErrorMessage;
            IEnumerable<DisasterCategoryData> disasterCategoryDatas = ReadDisasterCategories(nSiteNo, isNormal, false, out strErrorMessage);

            if (disasterCategoryDatas == null)
                return new ResponseDisasterCategories(false, strErrorMessage);

            ResponseDisasterCategories response = new ResponseDisasterCategories(true, "");
            response.DisasterCategoryDatas.AddRange(disasterCategoryDatas);
            return response;
        }

        private IEnumerable<DisasterCategoryData> ReadDisasterCategories(int nSiteNo, bool? isNormal, bool includeSections, out string strErrorMessage)
        {
            string strCondition = string.Format("{0} = {1}", LargeClass.Fields.site_sn, nSiteNo);
            IEnumerable<LargeClass> disasterCategories = m_dataManager.GetSelect().Select<LargeClass>(strCondition, out strErrorMessage);

            if (disasterCategories == null)
                return null;

            Dictionary<int, DisasterCategoryData> dicDisasterCategories = new Dictionary<int, DisasterCategoryData>();

            foreach (var disasterCategory in disasterCategories)
            {
                DisasterCategoryData disasterCategoryData = new DisasterCategoryData();
                disasterCategoryData.DisasterCategory = disasterCategory;

                dicDisasterCategories[disasterCategory.lclas_sn] = disasterCategoryData;
            }

            IEnumerable<SubDisasterCategoryData> subDisasterCategoryDatas = ReadSubDisasterCategories(nSiteNo, isNormal, includeSections, out strErrorMessage);

            if (subDisasterCategoryDatas == null)
                return null;

            foreach (var subDisasterCategoryData in subDisasterCategoryDatas)
            {
                DisasterCategoryData disasterCategoryData;

                if (dicDisasterCategories.TryGetValue(subDisasterCategoryData.SubDisasterCategory.lclas_sn, out disasterCategoryData))
                {
                    disasterCategoryData.SubDisasterCategories.Add(subDisasterCategoryData);
                }
            }

            return dicDisasterCategories.Values;
        }

        private IEnumerable<SubDisasterCategoryData> ReadSubDisasterCategories(int nSiteNo, bool? isNormal, bool includeSections, out string strErrorMessage)
        {
            string strCondition = string.Format("{0} in (Select {1} from {2} where {3} = {4})",
                MiddleClass.Fields.lclas_sn,
                LargeClass.Fields.lclas_sn,
                LargeClass.TableName,
                LargeClass.Fields.site_sn,
                nSiteNo);

            IEnumerable<MiddleClass> subDisasterCategories = m_dataManager.GetSelect().Select<MiddleClass>(strCondition, out strErrorMessage);

            if (subDisasterCategories == null)
                return null;

            Dictionary<int, SubDisasterCategoryData> dicSubDisasterCategories = new Dictionary<int, SubDisasterCategoryData>();

            foreach (var subDisasterCategory in subDisasterCategories)
            {
                SubDisasterCategoryData subDisasterCategoryData = new SubDisasterCategoryData();
                subDisasterCategoryData.SubDisasterCategory = subDisasterCategory;

                dicSubDisasterCategories[subDisasterCategoryData.SubDisasterCategory.mclas_sn] = subDisasterCategoryData;
            }

            IEnumerable<VersionDisasterData> versionDisasterDatas = ReadVersionDisasters(nSiteNo, isNormal, includeSections, out strErrorMessage);

            if (versionDisasterDatas == null)
                return null;

            // 같은 이름의 SOP를 하나로 묶어 관리한다.
            Dictionary<string, VersionDisasterData> dicVersionDisasterDatas = new Dictionary<string, VersionDisasterData>();

            foreach (var versionDisasterData in versionDisasterDatas)
            {
                SubDisasterCategoryData subDisasterCategoryData;

                foreach (DisasterData disasterData in versionDisasterData.DisasterDatas)
                {
                    if (dicSubDisasterCategories.TryGetValue(disasterData.Disaster.mclas_sn, out subDisasterCategoryData))
                    {
                        string strKey = string.Format("{0}_{1}_{2}", subDisasterCategoryData.SubDisasterCategory.lclas_sn, subDisasterCategoryData.SubDisasterCategory.lclas_sn, versionDisasterData.DisasterName);

                        VersionDisasterData data;

                        if (dicVersionDisasterDatas.TryGetValue(strKey, out data) == false)
                        {
                            dicVersionDisasterDatas[strKey] = versionDisasterData;
                            subDisasterCategoryData.DisasterDatas.Add(versionDisasterData);
                        }
                        else
                            data.DisasterDatas.AddRange(versionDisasterData.DisasterDatas);

                        //subDisasterCategoryData.DisasterDatas.Add(versionDisasterData);
                        break;
                    }
                }
            }

            return dicSubDisasterCategories.Values;
        }

        private IEnumerable<VersionDisasterData> ReadVersionDisasters(int nSiteNo, bool? isNormal, bool includeSections, out string strErrorMessage)
        {
            string strCondition = string.Format("a.{0} = {1}", Base.Model.Sop.Category.Version.Fields.site_sn, nSiteNo);

            JoinManager joinManager = new JoinManager(m_dataManager);
            ArrayList arrDatas = joinManager.JoinVersionUser(strCondition, out strErrorMessage);

            if (arrDatas == null)
                return null;

            int nDataCount = arrDatas.Count;
            Dictionary<int, Base.Model.Sop.Category.Version> dicVersions = new Dictionary<int, Model.Sop.Category.Version>();
            Dictionary<int, User> dicUsers = new Dictionary<int, User>();

            for (int i= 0;i < nDataCount - 1;i+=2)
            {
                if (arrDatas[i] is Base.Model.Sop.Category.Version && (arrDatas[i + 1] == null || arrDatas[i + 1] is User))
                {
                    Base.Model.Sop.Category.Version version = (Base.Model.Sop.Category.Version)arrDatas[i];
                    User user = (User)arrDatas[i + 1];

                    dicVersions[version.ver_sn] = version;

                    if (user != null)
                        dicUsers[user.user_sn] = user;
                }
            }

            strCondition = string.Format("{0} in (Select {1} from {2} where {3} = {4})",
                SmallClass.Fields.ver_sn,
                Base.Model.Sop.Category.Version.Fields.ver_sn,
                Base.Model.Sop.Category.Version.TableName,
                Base.Model.Sop.Category.Version.Fields.site_sn,
                nSiteNo);

            if (isNormal != null)
            {
                strCondition += string.Format(" and {0} = {1}", 
                    SmallClass.Fields.nor_yn,
                    CustomManager.GetBoolValue(m_dataManager, (bool)isNormal));
            }
                

            IEnumerable<SmallClass> disasters = m_dataManager.GetSelect().Select<SmallClass>(strCondition, out strErrorMessage);

            if (disasters == null)
                return null;

            // Key : Disaster No
            Dictionary<int, DisasterData> dicDisasterDatas = new Dictionary<int, DisasterData>();
            // Key : Version No
            Dictionary<int, VersionDisasterData> dicVersionDisasterDatas = new Dictionary<int, VersionDisasterData>();

            string strDisasterNos = "";

            foreach (SmallClass disaster in disasters)
            {
                VersionDisasterData versionDisasterData;

                if (dicVersionDisasterDatas.TryGetValue(disaster.ver_sn, out versionDisasterData) == false)
                {
                    versionDisasterData = new VersionDisasterData();
                    dicVersionDisasterDatas[disaster.ver_sn] = versionDisasterData;
                }

                Base.Model.Sop.Category.Version version;
                User user = null;

                if (dicVersions.TryGetValue(disaster.ver_sn, out version) == false)
                    continue;

                if (version.user_sn != null && dicUsers.TryGetValue((int)version.user_sn, out user) == false)
                    continue;

                versionDisasterData.DisasterName = disaster.sclas_name;

                DisasterData disasterData = new DisasterData();
                disasterData.Disaster = disaster;
                disasterData.Version = version;
                disasterData.Owner = user == null ? "" : user.user_id;

                versionDisasterData.DisasterDatas.Add(disasterData);
                dicDisasterDatas[disasterData.Disaster.sclas_sn] = disasterData;

                if (strDisasterNos.Length == 0)
                    strDisasterNos = disaster.sclas_sn.ToString();
                else
                    strDisasterNos += "," + disaster.sclas_sn.ToString();
            }

            IEnumerable<ActionStepData> actionStepDatas = ReadActionSteps(m_dataManager, strDisasterNos, includeSections, out strErrorMessage);

            if (actionStepDatas == null)
                return null;

            foreach (ActionStepData actionStepData in actionStepDatas)
            {
                DisasterData disasterData;

                if (dicDisasterDatas.TryGetValue(actionStepData.ActionStep.sclas_sn, out disasterData))
                    disasterData.ActionSteps.Add(actionStepData);
            }

            return dicVersionDisasterDatas.Values;
        }

        public ActionStepData ReadActionStep(IDataManager dataManager, int actionStepNo, out string strErrorMessage)
        {
            strErrorMessage = null;

            string strCondition = string.Format("{0} = {1}", ActionStep.Fields.action_step_sn, actionStepNo);
            ActionStep actionStep = dataManager.GetSelect().SelectFirst<ActionStep>(strCondition, out strErrorMessage);

            if (actionStep == null)
            {
                if (strErrorMessage == null)
                    strErrorMessage = "유효하지 않은 ActionStep 번호입니다.";

                return null;
            }

            ActionStepData actionStepData = new ActionStepData();

            actionStepData.ActionStep = actionStep;
            actionStepData.StepName = actionStep.action_step_name;

            IEnumerable<StepMemberData> stepMemberDatas = ReadStepMembers(dataManager, actionStepNo.ToString(), out strErrorMessage);

            if (stepMemberDatas == null)
                return null;

            foreach (StepMemberData stepMemberData in stepMemberDatas)
            {
                actionStepData.StepMemberDatas.Add(stepMemberData);
            }

            return actionStepData;
        }

        public IEnumerable<ActionStepData> ReadActionSteps(IDataManager dataManager, string strDisasterNos, bool includeSections, out string strErrorMessage)
        {
            strErrorMessage = null;

            if (strDisasterNos == null || strDisasterNos.Length == 0)
                return new List<ActionStepData>();

            string strCondition = string.Format("{0} in ({1})", ActionStep.Fields.sclas_sn, strDisasterNos);
            IEnumerable<ActionStep> actionSteps = dataManager.GetSelect().Select<ActionStep>(strCondition, out strErrorMessage);

            if (actionSteps == null)
                return null;

            string strActionStepNos = "";
            Dictionary<int, ActionStepData> dicActionStepDatas = new Dictionary<int, ActionStepData>();

            foreach (ActionStep actionStep in actionSteps)
            {
                ActionStepData actionStepData = new ActionStepData();

                actionStepData.ActionStep = actionStep;
                actionStepData.StepName = actionStep.action_step_name;

                dicActionStepDatas[actionStep.action_step_sn] = actionStepData;

                if (strActionStepNos.Length == 0)
                    strActionStepNos = actionStep.action_step_sn.ToString();
                else
                    strActionStepNos += "," + actionStep.action_step_sn.ToString();
            }

            if (includeSections)
            {
                IEnumerable<StepMemberData> stepMemberDatas = ReadStepMembers(dataManager, strActionStepNos, out strErrorMessage);

                if (stepMemberDatas == null)
                    return null;

                foreach (StepMemberData stepMemberData in stepMemberDatas)
                {
                    ActionStepData actionStepData;

                    if (dicActionStepDatas.TryGetValue(stepMemberData.StepMember.action_step_sn, out actionStepData))
                        actionStepData.StepMemberDatas.Add(stepMemberData);
                }
            }

            return dicActionStepDatas.Values;
        }

        private IEnumerable<StepMemberData> ReadStepMembers(IDataManager dataManager, string strActionStepNos, out string strErrorMessage)
        {
            strErrorMessage = null;

            if (strActionStepNos == null || strActionStepNos.Length == 0)
                return new List<StepMemberData>();

            string strCondition = string.Format("{0} in ({1})", StepMember.Fields.action_step_sn, strActionStepNos);
            IEnumerable<StepMember> stepMembers = dataManager.GetSelect().Select<StepMember>(strCondition, out strErrorMessage);

            if (stepMembers == null)
                return null;

            string strStepMemberNos = "";
            Dictionary<int, StepMemberData> dicStepMemberDatas = new Dictionary<int, StepMemberData>();

            foreach (StepMember stepMember in stepMembers)
            {
                StepMemberData stepMemberData = new StepMemberData();

                stepMemberData.StepMember = stepMember;
                dicStepMemberDatas[stepMember.step_memb_sn] = stepMemberData;

                if (strStepMemberNos.Length == 0)
                    strStepMemberNos = stepMember.step_memb_sn.ToString();
                else
                    strStepMemberNos += "," + stepMember.step_memb_sn.ToString();
            }

            IEnumerable<SectionData> sections = ReadSections(dataManager, strStepMemberNos, out strErrorMessage);

            if (sections == null)
                return null;

            Dictionary<int, SectionData> dicSections = new Dictionary<int, SectionData>();

            foreach (var section in sections)
            {
                dicSections[section.Component.compn_sn] = section;

                StepMemberData stepMemberData;

                if (dicStepMemberDatas.TryGetValue(section.Component.step_memb_sn, out stepMemberData))
                    stepMemberData.Sections.Add(section);
            }

            IEnumerable<Arrow> arrows = ReadArrows(dataManager, strStepMemberNos, out strErrorMessage);

            if (sections == null)
                return null;

            foreach (var arrow in arrows)
            {
                StepMemberData stepMemberData;

                if (dicStepMemberDatas.TryGetValue(arrow.step_memb_sn, out stepMemberData))
                {
                    SectionData beginSection, endSection;

                    if (dicSections.TryGetValue(arrow.begin_compn_sn, out beginSection) && dicSections.TryGetValue(arrow.end_compn_sn, out endSection))
                    {
                        ArrowData arrowData = new ArrowData();
                        arrowData.Arrow = arrow;
                        arrowData.BeginColumnIndex = beginSection.Component.column_no;
                        arrowData.BeginRowIndex = beginSection.Component.row_no;
                        arrowData.BeginPosition = arrow.begin_arrw_lc_code;
                        arrowData.EndColumnIndex = endSection.Component.column_no;
                        arrowData.EndRowIndex = endSection.Component.row_no;
                        arrowData.EndPosition = arrow.end_arrw_lc_code;
                        arrowData.Text = arrow.contents;
                        arrowData.ArrowNo = arrow.arrw_sn;

                        stepMemberData.Arrows.Add(arrowData);
                    }
                }
            }

            Dictionary<int, List<GridColumn>> dicGridColumns = ReadGridColumns(dataManager, strStepMemberNos, out strErrorMessage);

            if (dicGridColumns == null)
                return null;

            foreach (var pair in dicGridColumns)
            {
                StepMemberData stepMemberData;

                if (dicStepMemberDatas.TryGetValue(pair.Key, out stepMemberData))
                {
                    foreach (var column in pair.Value)
                    {
                        stepMemberData.GridColumnWidth.Add(column.width);
                    }
                }
            }

            Dictionary<int, List<GridRow>> dicGridRows = ReadGridRows(dataManager, strStepMemberNos, out strErrorMessage);

            if (dicGridRows == null)
                return null;

            foreach (var pair in dicGridRows)
            {
                StepMemberData stepMemberData;

                if (dicStepMemberDatas.TryGetValue(pair.Key, out stepMemberData))
                {
                    foreach (var row in pair.Value)
                    {
                        stepMemberData.GridRowHeight.Add(row.height);
                    }
                }
            }

            return dicStepMemberDatas.Values;
        }

        public IEnumerable<SectionData> ReadSectionDatas(IDataManager dataManager, string strCondition, out string strErrorMessage)
        {
            JoinManager joinManager = new JoinManager(dataManager);
            ArrayList arrDatas = joinManager.JoinSectionComponentSectionAnnotationDecisionEndPointProcessTransmission(strCondition, out strErrorMessage);

            if (arrDatas == null)
                return null;

            List<SectionData> sectionDatas = new List<SectionData>();
            int nDataCount = arrDatas.Count;

            Dictionary<int, DecisionData> dicDecisions = new Dictionary<int, DecisionData>();
            Dictionary<int, ProcessData> dicProcesses = new Dictionary<int, ProcessData>();
            Dictionary<int, TransmissionData> dicTransmissions = new Dictionary<int, TransmissionData>();
            string strDecisionNos = "", strProcessNos = "", strTransmissionNos = "";

            for (int i = 0; i < nDataCount - 5; i += 6)
            {
                if (arrDatas[i] is Component &&
                    (arrDatas[i + 1] == null || arrDatas[i + 1] is Comment) &&
                    (arrDatas[i + 2] == null || arrDatas[i + 2] is Decision) &&
                    (arrDatas[i + 3] == null || arrDatas[i + 3] is Endpoint) &&
                    (arrDatas[i + 4] == null || arrDatas[i + 4] is Base.Model.Sop.Component.Process) &&
                    (arrDatas[i + 5] == null || arrDatas[i + 5] is Transmission))
                {
                    Component section = (Component)arrDatas[i];
                    Comment comment = (Comment)arrDatas[i + 1];
                    Decision decision = (Decision)arrDatas[i + 2];
                    Endpoint endpoint = (Endpoint)arrDatas[i + 3];
                    Base.Model.Sop.Component.Process process = (Base.Model.Sop.Component.Process)arrDatas[i + 4];
                    Transmission transmission = (Transmission)arrDatas[i + 5];

                    if (comment != null)
                    {
                        CommentData annotationData = new CommentData();
                        annotationData.Comment = comment;
                        CopyToSection(section, annotationData);

                        SectionData sectionData = new SectionData(annotationData);
                        sectionData.Comment = comment;
                        sectionDatas.Add(sectionData);
                    }
                    else if (decision != null)
                    {
                        DecisionData decisionData = new DecisionData();
                        decisionData.Decision = decision;
                        CopyToSection(section, decisionData);

                        SectionData sectionData = new SectionData(decisionData);
                        sectionData.Decision = decision;
                        sectionData.SectionNumber = decision.execut_no;
                        sectionDatas.Add(sectionData);

                        SetSectionComponent(dicDecisions, ref strDecisionNos, decision.compn_sn, decisionData);
                    }
                    else if (endpoint != null)
                    {
                        EndpointData endpointData = new EndpointData();
                        endpointData.Endpoint = endpoint;
                        CopyToSection(section, endpointData);

                        SectionData sectionData = new SectionData(endpointData);
                        sectionData.Endpoint = endpoint;
                        sectionData.SectionNumber = endpoint.execut_no;
                        sectionDatas.Add(sectionData);
                    }
                    else if (process != null)
                    {
                        ProcessData processData = new ProcessData();
                        processData.Process = process;
                        CopyToSection(section, processData);

                        SectionData sectionData = new SectionData(processData);
                        sectionData.Process = process;
                        sectionData.SectionNumber = process.execut_no;
                        sectionDatas.Add(sectionData);

                        SetSectionComponent(dicProcesses, ref strProcessNos, process.compn_sn, processData);
                    }
                    else if (transmission != null)
                    {
                        TransmissionData transmissionData = new TransmissionData();
                        transmissionData.Transmission = transmission;
                        CopyToSection(section, transmissionData);

                        SectionData sectionData = new SectionData(transmissionData);
                        sectionData.Transmission = transmission;
                        sectionData.SectionNumber = transmission.execut_no;
                        sectionDatas.Add(sectionData);

                        SetSectionComponent(dicTransmissions, ref strTransmissionNos, transmission.compn_sn, transmissionData);
                    }
                }
            }

            if (strDecisionNos.Length > 0)
            {
                if (ReadDecisionDatas(joinManager, dicDecisions, strDecisionNos, out strErrorMessage) == false)
                    return null;
            }

            if (strProcessNos.Length > 0)
            {
                if (ReadProcessDatas(joinManager, dicProcesses, strProcessNos, out strErrorMessage) == false)
                    return null;
            }

            if (strTransmissionNos.Length > 0)
            {
                if (ReadTransmissionDatas(joinManager, dicTransmissions, strTransmissionNos, out strErrorMessage) == false)
                    return null;
            }

            return sectionDatas;
        }

        private IEnumerable<SectionData> ReadSections(IDataManager dataManager, string strStepMemberNos, out string strErrorMessage)
        {
            strErrorMessage = null;

            if (strStepMemberNos == null || strStepMemberNos.Length == 0)
                return new List<SectionData>();

            string strCondition = string.Format("a.{0} in ({1})", Component.Fields.step_memb_sn, strStepMemberNos);
            return ReadSectionDatas(dataManager, strCondition, out strErrorMessage);
        }

        private bool ReadTransmissionDatas(JoinManager joinManager, Dictionary<int, TransmissionData> dicTransmissions, string strTransmissionNos, out string strErrorMessage)
        {
            string strCondition = string.Format("{0} in ({1})", TransmissionRegular.Fields.compn_sn, strTransmissionNos);
            IEnumerable<TransmissionRegular> regulars = joinManager.Select<TransmissionRegular>(strCondition, out strErrorMessage);

            if (regulars == null)
                return false;

            foreach (var regular in regulars)
            {
                TransmissionData transmissionData;

                if (dicTransmissions.TryGetValue(regular.compn_sn, out transmissionData))
                {
                    transmissionData.Regulars.Add(regular);
                }
            }

            strCondition = string.Format("a.{0} in ({1})", TransmissionTemporary.Fields.compn_sn, strTransmissionNos);
            ArrayList arrDatas = joinManager.JoinTransmissionTemporaryTemporary(strCondition, out strErrorMessage);

            if (arrDatas == null)
                return false;

            int nDataCount = arrDatas.Count;

            for (int i=0;i<nDataCount-1;i+=2)
            {
                if (arrDatas[i] is TransmissionTemporary && arrDatas[i + 1] is Temporary)
                {
                    TransmissionTemporary transmissionTemporary = (TransmissionTemporary)arrDatas[i];
                    Temporary temporary = (Temporary)arrDatas[i + 1];
                    TransmissionData transmissionData;

                    if (dicTransmissions.TryGetValue(transmissionTemporary.compn_sn, out transmissionData))
                    {
                        transmissionData.Temporaries.Add(new TransmissionTemporaryEx(transmissionTemporary.compn_sn, transmissionTemporary.tmpr_sn, temporary.nor_yn));
                    }
                }
            }

            return true;
        }

        private bool ReadProcessDatas(JoinManager joinManager, Dictionary<int, ProcessData> dicProcesses, string strProcessNos, out string strErrorMessage)
        {
            /*string strCondition = string.Format("{0} in ({1}) order by {0}, {2}", ProcessExternalMission.Fields.ComponentNo, strProcessNos, ProcessExternalMission.Fields.OrderIndex);
            IEnumerable<ProcessExternalMission> externalMissions = joinManager.Select<ProcessExternalMission>(strCondition, out strErrorMessage);

            if (externalMissions == null)
                return false;

            foreach (var externalMission in externalMissions)
            {
                ProcessData processData;

                if (dicProcesses.TryGetValue(externalMission.ComponentNo, out processData))
                {
                    processData.ExternalMissions.Add(externalMission);
                }
            }*/

            string strCondition = string.Format("{0} in ({1}) order by {0}, {2}", ProcessMission.Fields.compn_sn, strProcessNos, ProcessMission.Fields.misn_sn);
            IEnumerable<ProcessMission> missions = joinManager.Select<ProcessMission>(strCondition, out strErrorMessage);

            if (missions == null)
                return false;

            foreach (var mission in missions)
            {
                ProcessData processData;

                if (dicProcesses.TryGetValue(mission.compn_sn, out processData))
                {
                    processData.Missions.Add(new ProcessMissionEx(mission));
                }
            }

            strCondition = string.Format("{0} in ({1})", ProcessRegular.Fields.compn_sn, strProcessNos);
            IEnumerable<ProcessRegular> regulars = joinManager.Select<ProcessRegular>(strCondition, out strErrorMessage);

            if (regulars == null)
                return false;

            foreach (var regular in regulars)
            {
                ProcessData processData;

                if (dicProcesses.TryGetValue(regular.compn_sn, out processData))
                {
                    processData.Regulars.Add(regular);
                }
            }

            strCondition = string.Format("a.{0} in ({1})", ProcessTemporary.Fields.compn_sn, strProcessNos);
            ArrayList arrDatas = joinManager.JoinProcessTemporaryTemporary(strCondition, out strErrorMessage);

            if (arrDatas == null)
                return false;

            int nDataCount = arrDatas.Count;

            for (int i=0;i<nDataCount-1;i+=2)
            {
                if (arrDatas[i] is ProcessTemporary && arrDatas[i + 1] is Temporary)
                {
                    ProcessTemporary processTemporay = (ProcessTemporary)arrDatas[i];
                    Temporary temporay = (Temporary)arrDatas[i + 1];

                    ProcessData processData;

                    if (dicProcesses.TryGetValue(processTemporay.compn_sn, out processData))
                    {
                        processData.Temporaries.Add(new ProcessTemporaryEx(processTemporay.compn_sn, processTemporay.tmpr_sn, temporay.nor_yn));
                    }
                }
            }

            return true;
        }

        private bool ReadDecisionDatas(JoinManager joinManager, Dictionary<int, DecisionData> dicDecisions, string strDecisionNos, out string strErrorMessage)
        {
            string strCondition = string.Format("{0} in ({1})", DecisionAutoScriptVariable.Fields.compn_sn, strDecisionNos);
            IEnumerable<DecisionAutoScriptVariable> variables = joinManager.Select<DecisionAutoScriptVariable>(strCondition, out strErrorMessage);

            if (variables == null)
                return false;

            foreach (var variable in variables)
            {
                DecisionData decisionData;

                if (dicDecisions.TryGetValue(variable.compn_sn, out decisionData))
                {
                    decisionData.AutoScriptVariables.Add(variable);
                }
            }

            return true;
        }

        private void SetSectionComponent<SectionData>(Dictionary<int, SectionData> dicSectionDatas, ref string strSectionNos, int nComponentNo, SectionData sectionData)
        {
            if (strSectionNos.Length == 0)
                strSectionNos = nComponentNo.ToString();
            else
                strSectionNos += "," + nComponentNo.ToString();

            dicSectionDatas[nComponentNo] = sectionData;
        }

        private void CopyToSection(Component sectionSrc, Component sectionTrg)
        {
            sectionTrg.column_no = sectionSrc.column_no;
            sectionTrg.compn_sn = sectionSrc.compn_sn;
            sectionTrg.compn_code = sectionSrc.compn_code;
            sectionTrg.compn_optn_code = sectionSrc.compn_optn_code;
            sectionTrg.grid_sn = sectionSrc.grid_sn;
            sectionTrg.row_no = sectionSrc.row_no;
            sectionTrg.step_memb_sn = sectionSrc.step_memb_sn;
        }

        private IEnumerable<Arrow> ReadArrows(IDataManager dataManager, string strStepMemberNos, out string strErrorMessage)
        {
            strErrorMessage = null;

            if (strStepMemberNos == null || strStepMemberNos.Length == 0)
                return new List<Arrow>();

            string strCondition = string.Format("{0} in ({1})", Arrow.Fields.step_memb_sn, strStepMemberNos);
            return dataManager.GetSelect().Select<Arrow>(strCondition, out strErrorMessage);
        }

        // Key : StepMember No
        private Dictionary<int, List<GridRow>> ReadGridRows(IDataManager dataManager, string strStepMemberNos, out string strErrorMessage)
        {
            strErrorMessage = null;

            if (strStepMemberNos == null || strStepMemberNos.Length == 0)
                return new Dictionary<int, List<GridRow>>();

            JoinManager joinManager = new JoinManager(dataManager);

            string strCondition = string.Format("a.{0} in ({1}) order by b.{2}", Grid.Fields.step_memb_sn, strStepMemberNos, GridRow.Fields.row_no);
            ArrayList arrDatas = joinManager.JoinSectionGridGridRow(strCondition, out strErrorMessage);

            if (arrDatas == null)
                return null;

            Dictionary<int, List<GridRow>> dicGridRows = new Dictionary<int, List<GridRow>>();
            List<GridRow> rows = null;

            int nDataCount = arrDatas.Count;

            for (int i=0;i<nDataCount-1;i+=2)
            {
                if (arrDatas[i] is Grid && arrDatas[i + 1] is GridRow)
                {
                    Grid grid = (Grid)arrDatas[i];
                    GridRow row = (GridRow)arrDatas[i + 1];

                    if (dicGridRows.TryGetValue(grid.step_memb_sn, out rows) == false)
                    {
                        rows = new List<GridRow>();
                        dicGridRows[grid.step_memb_sn] = rows;
                    }

                    rows.Add(row);
                }
            }

            return dicGridRows;
        }

        // Key : StepMember No
        private Dictionary<int, List<GridColumn>> ReadGridColumns(IDataManager dataManager, string strStepMemberNos, out string strErrorMessage)
        {
            strErrorMessage = null;

            if (strStepMemberNos == null || strStepMemberNos.Length == 0)
                return new Dictionary<int, List<GridColumn>>();

            JoinManager joinManager = new JoinManager(dataManager);

            string strCondition = string.Format("a.{0} in ({1}) order by b.{2}", Grid.Fields.step_memb_sn, strStepMemberNos, GridColumn.Fields.column_no);
            ArrayList arrDatas = joinManager.JoinSectionGridGridColumn(strCondition, out strErrorMessage);

            if (arrDatas == null)
                return null;

            Dictionary<int, List<GridColumn>> dicGridColumns = new Dictionary<int, List<GridColumn>>();
            List<GridColumn> columns = null;

            int nDataCount = arrDatas.Count;

            for (int i = 0; i < nDataCount - 1; i += 2)
            {
                if (arrDatas[i] is Grid && arrDatas[i + 1] is GridColumn)
                {
                    Grid grid = (Grid)arrDatas[i];
                    GridColumn column = (GridColumn)arrDatas[i + 1];

                    if (dicGridColumns.TryGetValue(grid.step_memb_sn, out columns) == false)
                    {
                        columns = new List<GridColumn>();
                        dicGridColumns[grid.step_memb_sn] = columns;
                    }

                    columns.Add(column);
                }
            }

            return dicGridColumns;
        }

        public ResponseActionStepDatas GetDefaultActionStepDatas(int nSiteNo)
        {
            string strErrorMessage;
            List<string> standardActionStepNames = GetStandardActionStepNames(nSiteNo, out strErrorMessage);

            if (standardActionStepNames == null)
                return new ResponseActionStepDatas(false, strErrorMessage);

            List<ActionStepData> actionStepDatas = new List<ActionStepData>();

            foreach (string strActionStepName in standardActionStepNames)
            {
                ActionStepData actionStepData = new ActionStepData();
                actionStepData.StepName = strActionStepName;
                actionStepDatas.Add(actionStepData);
            }

            ResponseActionStepDatas response = new ResponseActionStepDatas(true, "");
            response.ActionStepDatas.AddRange(actionStepDatas);
            return response;
        }

        public ResponseStepMemberData GetDefaultStepMemberData(int nActionStepNo)
        {
            StepMember stepMember = new StepMember();
            stepMember.action_step_sn = nActionStepNo;
            stepMember.step_memb_sn = -1;

            StepMemberData stepMemberData = new StepMemberData();
            stepMemberData.StepMember = stepMember;

            ResponseStepMemberData response = new ResponseStepMemberData(true, "");
            response.StepMemberData = stepMemberData;

            return response;
        }

        private List<string> GetStandardActionStepNames(int nSiteNo, out string strErrorMessage)
        {
            string strCondition = "";
            
            if (nSiteNo > 0)
                strCondition = string.Format("{0} = 'StandardActionStepNames' and {1} = {2}", Model.Common.Option.Fields.prop_name, Model.Common.Option.Fields.site_sn, nSiteNo);
            else
                strCondition = string.Format("{0} = 'StandardActionStepNames'", Model.Common.Option.Fields.prop_name);

            IEnumerable<Model.Common.Option> options = m_dataManager.GetSelect().Select<Model.Common.Option>(strCondition, out strErrorMessage);

            if (options == null)
            {
                if (strErrorMessage != null)
                    return null;
                else
                    return new List<string>() { "관심", "주의", "경계", "심각" };
            }

            Model.Common.Option option = null;

            foreach (var _option in options)
            {
                option = _option;
                break;
            }

            if (option == null)
                return new List<string>() { "관심", "주의", "경계", "심각" };

            string[] actionStepNames = option.prop_value.Split(',');

            if (actionStepNames == null)
                return null;

            if (actionStepNames.Length == 0)
                return new List<string>() { "관심", "주의", "경계", "심각" };

            List<string> actionStepNameList = new List<string>();

            foreach (string strActionStepName in actionStepNames)
            {
                actionStepNameList.Add(strActionStepName.Trim());
            }

            return actionStepNameList;
        }

        public ResponseDisasterVersions GetDisasterVersions(int nDisasterNo)
        {
            string strErrorMessage;

            if (IsRunningVersion2(nDisasterNo.ToString(), out strErrorMessage))
                return new ResponseDisasterVersions(false, ID.Get<ErrorMessage>("runningSOP").Value());

            if (strErrorMessage != null)
                return new ResponseDisasterVersions(false, strErrorMessage);

            JoinManager joinManager = new JoinManager(m_dataManager);
            ArrayList arrDatas = joinManager.JoinDisasterVersionUser(nDisasterNo, out strErrorMessage);

            if (arrDatas == null)
                return new ResponseDisasterVersions(false, strErrorMessage);

            int nDataCount = arrDatas.Count;

            List<VersionData> versions = new List<VersionData>();
            VersionData currentVersion = null;

            for (int i = 0; i < nDataCount - 2; i += 3)
            {
                if (arrDatas[i] is SmallClass && arrDatas[i + 1] is Version && arrDatas[i + 2] is User)
                {
                    SmallClass disaster = (SmallClass)arrDatas[i];
                    Version version = (Version)arrDatas[i + 1];
                    User user = (User)arrDatas[i + 2];

                    VersionData versionData = new VersionData(version);
                    versionData.Owner = user == null ? null : user.user_id;
                    versionData.Version = version;

                    versions.Add(versionData);

                    if (disaster.sclas_sn == nDisasterNo)
                        currentVersion = versionData;
                }
            }

            ResponseDisasterVersions response = new ResponseDisasterVersions(true, "");
            response.CurrentVersion = currentVersion;
            response.Versions.AddRange(versions);

            return response;
        }

        public bool IsRunningVersion2(string strDisasterNos, out string strErrorMessage)
        {
            strErrorMessage = null;
            return false;
            /*string strCondition = string.Format("{0} in (Select {1} from {2} where {3} in ({4})) and {5} is NULL",
                Model.History.ActionStep.Fields.ActionStepNo,
                ActionStep.Fields.action_step_sn,
                ActionStep.TableName,
                ActionStep.Fields.sclas_sn,
                strDisasterNos,
                Model.History.ActionStep.Fields.EndTime);

            Model.History.ActionStep actionStepHistory = m_dataManager.GetSelect().SelectFirst<Model.History.ActionStep>(strCondition, out strErrorMessage);

            if (actionStepHistory == null)
                return false;

            return true;*/
        }

        public bool IsRunningVersion(string strVersionNos, out string strErrorMessage)
        {
            strErrorMessage = null;
            return false;
            /*string strCondition = string.Format("{0} in (Select {1} from {2} where {3} in (Select {4} from {5} where {6} in ({7}))) and {8} is NULL",
                Model.History.ActionStep.Fields.ActionStepNo,
                ActionStep.Fields.action_step_sn,
                ActionStep.TableName,
                ActionStep.Fields.sclas_sn,
                SmallClass.Fields.sclas_sn,
                SmallClass.TableName,
                SmallClass.Fields.ver_sn,
                strVersionNos,
                Model.History.ActionStep.Fields.EndTime);

            Model.History.ActionStep actionStepHistory = m_dataManager.GetSelect().SelectFirst<Model.History.ActionStep>(strCondition, out strErrorMessage);

            if (actionStepHistory == null)
                return false;

            return true;*/
        }

        public ResponseOpen OpenDB(int nDisasterNo)
        {
            string strErrorMessage;

            JoinManager joinManager = new JoinManager(m_dataManager);

            string strCondition = string.Format("c.{0} = {1}", SmallClass.Fields.sclas_sn, nDisasterNo);
            ArrayList arrDatas = joinManager.JoinDisasterCategorySubDisasterCategoryDisasterVersionUser(strCondition, out strErrorMessage);

            if (arrDatas == null)
            {
                System.Diagnostics.Trace.WriteLine(strErrorMessage);
                return new ResponseOpen(false, ID.Get<ErrorMessage>("failToOpenDB").Value());
            }

            int nDataCount = arrDatas.Count;

            for (int i = 0; i < nDataCount - 4; i += 5)
            {
                if (arrDatas[i] is LargeClass &&
                    arrDatas[i + 1] is MiddleClass &&
                    arrDatas[i + 2] is SmallClass &&
                    arrDatas[i + 3] is Version &&
                    (arrDatas[i + 4] == null || arrDatas[i + 4] is User))
                {
                    LargeClass dc = (LargeClass)arrDatas[i];
                    MiddleClass sdc = (MiddleClass)arrDatas[i + 1];
                    SmallClass disaster = (SmallClass)arrDatas[i + 2];
                    User user = (User)arrDatas[i + 4];
                    Version version = (Version)arrDatas[i + 3];

                    SOPData sopData = new SOPData();

                    sopData.DisasterCategory = dc;
                    sopData.SubDisasterCategory = sdc;
                    sopData.Disaster = disaster;
                    sopData.Version = version;

                    IEnumerable<ActionStepData> actionStepDatas = ReadActionSteps(m_dataManager, disaster.sclas_sn.ToString(), true, out strErrorMessage);

                    if (actionStepDatas == null)
                        return new ResponseOpen(false, strErrorMessage);

                    List<ActionStepData> _actionStepDatas = FillActionStepDatas(actionStepDatas, dc.site_sn, out strErrorMessage);

                    sopData.DisasterCategory = dc;
                    sopData.SubDisasterCategory = sdc;
                    sopData.Disaster = disaster;
                    sopData.Version = version;
                    sopData.ActionStepDatas.AddRange(_actionStepDatas);

                    ResponseOpen response = new ResponseOpen(true, "");
                    response.SOPData = sopData;
                    return response;
                }
            }

            return new ResponseOpen(false, ID.Get<ErrorMessage>("failToOpenDB").Value());
        }

        public ResponseOpenAll OpenAll(int? siteNo)
        {
            string strErrorMessage;

            JoinManager joinManager = new JoinManager(m_dataManager);

            string strCondition = siteNo == null ? null : string.Format("a.{0} = {1}", LargeClass.Fields.site_sn, (int)siteNo);
            ArrayList arrDatas = joinManager.JoinDisasterCategorySubDisasterCategoryDisasterVersionUser(strCondition, out strErrorMessage);

            if (arrDatas == null)
            {
                System.Diagnostics.Trace.WriteLine(strErrorMessage);
                return new ResponseOpenAll(false, ID.Get<ErrorMessage>("failToOpenDB").Value());
            }

            // 동일한 경로의 SOP(small class)라면 가장 마지막 버전만 가져오도록 한다.
            // Key : lclassNo / mclassNo / sclassName
            Dictionary<string, SOPData> dicLastVersions = new Dictionary<string, SOPData>();

            int nDataCount = arrDatas.Count;

            for (int i = 0; i < nDataCount - 4; i += 5)
            {
                if (arrDatas[i] is LargeClass &&
                    arrDatas[i + 1] is MiddleClass &&
                    arrDatas[i + 2] is SmallClass &&
                    arrDatas[i + 3] is Version &&
                    (arrDatas[i + 4] == null || arrDatas[i + 4] is User))
                {
                    LargeClass dc = (LargeClass)arrDatas[i];
                    MiddleClass sdc = (MiddleClass)arrDatas[i + 1];
                    SmallClass disaster = (SmallClass)arrDatas[i + 2];
                    User user = (User)arrDatas[i + 4];
                    Version version = (Version)arrDatas[i + 3];

                    SOPData sopData = new SOPData();

                    sopData.DisasterCategory = dc;
                    sopData.SubDisasterCategory = sdc;
                    sopData.Disaster = disaster;
                    sopData.Version = version;

                    string strKey = string.Format("{0}/{1}/{2}", dc.lclas_sn, sdc.mclas_sn, disaster.sclas_name);

                    SOPData lastVersion;

                    if (dicLastVersions.TryGetValue(strKey, out lastVersion) == false)
                        dicLastVersions[strKey] = sopData;
                    else
                    {
                        // 버전이 마지막으로 수정된 날짜로 비교
                        if (lastVersion.Version.last_acces_de < sopData.Version.last_acces_de)
                            dicLastVersions[strKey] = sopData;
                        // 단순히 버전 번호로만 비교
                        /*if (lastVersion.Version.ver_sn < sopData.Version.ver_sn)
                            dicLastVersions[strKey] = sopData;*/
                    }
                }
            }

            ResponseOpenAll response = new ResponseOpenAll(true, "");

            foreach (KeyValuePair<string, SOPData> pair in dicLastVersions)
            {
                IEnumerable<ActionStepData> actionStepDatas = ReadActionSteps(m_dataManager, pair.Value.Disaster.sclas_sn.ToString(), true, out strErrorMessage);

                if (actionStepDatas == null)
                    return new ResponseOpenAll(false, strErrorMessage);

                List<ActionStepData> _actionStepDatas = FillActionStepDatas(actionStepDatas, pair.Value.DisasterCategory.site_sn, out strErrorMessage);

                pair.Value.ActionStepDatas.AddRange(_actionStepDatas);
                AddSopData(response.DisasterCategories, pair.Value);
            }

            return response;
        }

        private void AddSopData(List<LargeClassData> largeClassDatas, SOPData sopData)
        {
            LargeClassData targetLargeClassData = null;

            foreach (LargeClassData largeClassData in largeClassDatas)
            {
                if (sopData.DisasterCategory.lclas_sn == largeClassData.No)
                {
                    targetLargeClassData = largeClassData;
                    break;
                }
            }

            if (targetLargeClassData == null)
            {
                targetLargeClassData = new LargeClassData();
                targetLargeClassData.No = sopData.DisasterCategory.lclas_sn;
                targetLargeClassData.Name = sopData.DisasterCategory.lclas_name;
                largeClassDatas.Add(targetLargeClassData);
            }

            MiddleClassData targetMiddleClassData = null;

            foreach (MiddleClassData middleClassData in targetLargeClassData.SubDisasterCategories)
            {
                if (middleClassData.No == sopData.SubDisasterCategory.mclas_sn)
                {
                    targetMiddleClassData = middleClassData;
                    break;
                }
            }

            if (targetMiddleClassData == null)
            {
                targetMiddleClassData = new MiddleClassData();
                targetMiddleClassData.No = sopData.SubDisasterCategory.mclas_sn;
                targetMiddleClassData.Name = sopData.SubDisasterCategory.mclas_name;
                targetLargeClassData.SubDisasterCategories.Add(targetMiddleClassData);
            }

            targetMiddleClassData.SopDatas.Add(sopData);
        }

        // 부족한 ActionStepData가 있는지 확인해서 없으면 Default 값으로 채워넣는다.
        private List<ActionStepData> FillActionStepDatas(IEnumerable<ActionStepData> actionStepDatas, int siteNo, out string strErrorMessage)
        {
            strErrorMessage = null;

            Dictionary<string, ActionStepData> dicActionStepDatas = new Dictionary<string, ActionStepData>();
            List<ActionStepData> result = new List<ActionStepData>();

            foreach (ActionStepData actionStepData in actionStepDatas)
            {
                dicActionStepDatas[actionStepData.StepName] = actionStepData;
                result.Add(actionStepData);
            }

            if (actionStepDatas.Count() < 4)
            {
                ResponseActionStepDatas response = GetDefaultActionStepDatas(siteNo);

                if (response.Success == false)
                {
                    strErrorMessage = response.Message;
                    return null;
                }

                int actionStepDataCount = response.ActionStepDatas.Count;

                for (int i=0;i<actionStepDataCount;i++)
                {
                    ActionStepData actionStepData = response.ActionStepDatas[i];

                    if (dicActionStepDatas.ContainsKey(actionStepData.StepName) == false)
                    {
                        dicActionStepDatas[actionStepData.StepName] = actionStepData;
                        result.Insert(i, actionStepData);

                        ResponseStepMemberData stepMemberData = GetDefaultStepMemberData(-1);

                        if (stepMemberData.Success == false)
                        {
                            strErrorMessage = stepMemberData.Message;
                            return null;
                        }

                        actionStepData.StepMemberDatas.Add(stepMemberData.StepMemberData);
                    }
                }
            }

            SortSections(result);
            return result;
        }

        // 시작부터 종료까지 화살표 배치에 따라 정렬한다.
        private void SortSections(List<ActionStepData> actionStepDatas)
        {
            foreach (ActionStepData actionStepData in actionStepDatas)
            {
                foreach (var stepMemberData in actionStepData.StepMemberDatas)
                {
                    stepMemberData.Sections.Sort();
                }
            }
        }

        public ResponseSpecialMessageList GetSpecialMessageList()
        {
            string strErrorMessage;
            IEnumerable<SpecialCharactor> messages = m_dataManager.GetSelect().Select<SpecialCharactor>(null, out strErrorMessage);

            if (messages == null)
                return new ResponseSpecialMessageList(false, null, strErrorMessage);

            return new ResponseSpecialMessageList(true, messages, null);
        }

        public ResponseLinkedSOPs GetLinkedSOPs(RequestLinkedSOP data)
        {
            ResponseLinkedSOPs linkedSOPs = new ResponseLinkedSOPs();

            string strErrorMessage;
            string strCondition = data.SiteNo == null ? null : string.Format("{0} = {1}", LinkedSop.Fields.site_sn, (int)data.SiteNo);
            IEnumerable<LinkedSop> linkedSops = m_dataManager.GetSelect().Select<LinkedSop>(strCondition, out strErrorMessage);

            if (linkedSops == null)
            {
                linkedSOPs.Success = false;
                linkedSOPs.Message = strErrorMessage;
                return linkedSOPs;
            }

            Dictionary<int, string> dicSensorTypes = new Dictionary<int, string>();
            Dictionary<long, string> dicSensorSubTypes = new Dictionary<long, string>();

            if (LoadSensorTypes(linkedSops, dicSensorTypes, dicSensorSubTypes, out strErrorMessage) == false)
            {
                linkedSOPs.Success = false;
                linkedSOPs.Message = strErrorMessage;
                return linkedSOPs;
            }

            Dictionary<long, SensorTypeData> dicSensorTypeDatas = ToSensorTypeDataDictionary(data.SensorTypeDatas);

            Dictionary<int, LargeClass> dicLargeClasses = LoadLargeClass(out strErrorMessage);

            if (dicLargeClasses == null)
                return new ResponseLinkedSOPs(false, strErrorMessage);

            Dictionary<int, MiddleClass> dicMiddleClasses = LoadMiddleClass(out strErrorMessage);

            if (dicLargeClasses == null)
                return new ResponseLinkedSOPs(false, strErrorMessage);

            linkedSOPs.Success = true;
            linkedSOPs.LinkedSops = ToLinkedSOPEx(linkedSops, dicSensorTypes, dicSensorSubTypes, dicSensorTypeDatas, dicLargeClasses, dicMiddleClasses, out strErrorMessage);

            if (linkedSOPs.LinkedSops == null)
                return new ResponseLinkedSOPs(false, strErrorMessage);

            return linkedSOPs;
        }

        public ResponseLoadLinkedSopVersions LoadLinkedSopVersions(int nSiteNo, List<int> versionNos)
        {
            string strErrorMessage = null;
            ResponseLoadLinkedSopVersions res = new ResponseLoadLinkedSopVersions();

            try
            {
                string strCondition = string.Format("d.{0} = {1}", LinkedSop.Fields.site_sn, nSiteNo);

                if (versionNos != null && versionNos.Count > 0)
                    strCondition += string.Format("c.{0} in ({1})", SmallClass.Fields.ver_sn, string.Join(",", versionNos));

                List<LinkedSopCountByVersion> sopCounts = SelectLinkedSopCountByVersion(m_dataManager, strCondition, out strErrorMessage);

                if (sopCounts == null)
                {
                    System.Diagnostics.Trace.WriteLine(strErrorMessage);
                    return new ResponseLoadLinkedSopVersions(false, ID.Get<ErrorMessage>("failToReadLinkedSOP").Value());
                }

                res.LinkedSopNos = sopCounts.Select(p => p.LinkedSopNo).ToList();
                res.Success = true;
            }
            catch (System.Exception ex)
            {
                res.Success = false;
                res.Message = ex.Message;
            }

            return res;
        }

        private Dictionary<int, LargeClass> LoadLargeClass(out string strErrorMessage)
        {
            strErrorMessage = null;
            IEnumerable<LargeClass> largeClasses = m_dataManager.GetSelect().Select<LargeClass>(null, out strErrorMessage);

            if (largeClasses == null)
                return null;

            Dictionary<int, LargeClass> dicLargeClasses = new Dictionary<int, LargeClass>();

            foreach (LargeClass largeClass in largeClasses)
            {
                dicLargeClasses[largeClass.lclas_sn] = largeClass;
            }

            return dicLargeClasses;
        }

        private Dictionary<int, MiddleClass> LoadMiddleClass(out string strErrorMessage)
        {
            strErrorMessage = null;
            IEnumerable<MiddleClass> middleClasses = m_dataManager.GetSelect().Select<MiddleClass>(null, out strErrorMessage);

            if (middleClasses == null)
                return null;

            Dictionary<int, MiddleClass> dicMiddleClasses = new Dictionary<int, MiddleClass>();

            foreach (MiddleClass middleClass in middleClasses)
            {
                dicMiddleClasses[middleClass.mclas_sn] = middleClass;
            }

            return dicMiddleClasses;
        }

        private Dictionary<long, SensorTypeData> ToSensorTypeDataDictionary(List<SensorTypeData> sensorTypeDatas)
        {
            Dictionary<long, SensorTypeData> dicSensorTypeDatas = null;

            if (sensorTypeDatas == null || sensorTypeDatas.Count == 0)
                return dicSensorTypeDatas;

            dicSensorTypeDatas = new Dictionary<long, SensorTypeData>();

            foreach (SensorTypeData sensorTypeData in sensorTypeDatas)
            {
                dicSensorTypeDatas[sensorTypeData.GetKey()] = sensorTypeData;
            }

            return dicSensorTypeDatas;
        }

        private List<LinkedSopEx> ToLinkedSOPEx(IEnumerable<LinkedSop> linkedSops, Dictionary<int, string> dicSensorTypes, Dictionary<long, string> dicSensorSubTypes, Dictionary<long, SensorTypeData> dicSensorTypeDatas, Dictionary<int, LargeClass> dicLargeClasses, Dictionary<int, MiddleClass> dicMiddleClasses, out string strErrorMessage)
        {
            strErrorMessage = null;

            Dictionary<int, int> dicZoneNos = new Dictionary<int, int>();
            Dictionary<int, int> dicBuildingNos = new Dictionary<int, int>();
            Dictionary<int, int> dicBuildingGroupNos = new Dictionary<int, int>();
            List<LinkedSopEx> linkedSopExes = new List<LinkedSopEx>();

            foreach (LinkedSop sop in linkedSops)
            {
                string strSensorTypeName = GetSensorTypeName(sop.sensor_ty_code, sop.sensor_sub_ty_no, dicSensorTypes, dicSensorSubTypes, dicSensorTypeDatas);

                LinkedSopEx sopEx = new LinkedSopEx(sop);
                sopEx.SensorTypeName = strSensorTypeName;

                linkedSopExes.Add(sopEx);

                LargeClass largeClass;
                MiddleClass middleClass;

                if (dicLargeClasses.TryGetValue(sop.lclas_sn, out largeClass))
                    sopEx.LargeClassName = largeClass.lclas_name;

                if (dicMiddleClasses.TryGetValue(sop.mclas_sn, out middleClass))
                    sopEx.MiddleClassName = middleClass.mclas_name;

                if (sop.zone_sn != null && sop.zone_sn > 0)
                    dicZoneNos[(int)sop.zone_sn] = (int)sop.zone_sn;

                if (sop.buld_sn != null && sop.buld_sn > 0)
                    dicBuildingNos[(int)sop.buld_sn] = (int)sop.buld_sn;

                if (sop.buld_group_sn != null && sop.buld_group_sn > 0)
                    dicBuildingGroupNos[(int)sop.buld_group_sn] = (int)sop.buld_group_sn;
            }

            if (SetSopZoneNames(dicZoneNos, linkedSopExes, out strErrorMessage) == false)
                return null;

            if (SetSopBuildingNames(dicBuildingNos, linkedSopExes, out strErrorMessage) == false)
                return null;

            if (SetSopBuildingGroupNames(dicBuildingGroupNos, linkedSopExes, out strErrorMessage) == false)
                return null;

            /*if (dicZoneNos.Count > 0)
            {
                Dictionary<int, BuildingGroup> dicBuildingGroups = new Dictionary<int, BuildingGroup>();
                Dictionary<int, Building> dicBuildings = new Dictionary<int, Building>();
                Dictionary<int, Zone> dicZones = new Dictionary<int, Zone>();

                string strZoneNos = string.Join(",", dicZoneNos.Keys);
                string strCondition = string.Format("a.{0} in ({1})", Zone.Fields.zone_sn, strZoneNos);

                JoinManager joinManager = new JoinManager(m_dataManager);
                ArrayList arrDatas = joinManager.JoinZoneBuildingBuildingGroup(strCondition, out strErrorMessage);

                if (arrDatas == null)
                    return null;

                int nDataCount = arrDatas.Count;

                for (int i=0;i<nDataCount-2;i+=3)
                {
                    if (arrDatas[i] is Zone &&
                        (arrDatas[i + 1] == null || arrDatas[i + 1] is Building) &&
                        (arrDatas[i + 2] == null || arrDatas[i + 2] is BuildingGroup))
                    {
                        Zone zone = (Zone)arrDatas[i];
                        Building building = (Building)arrDatas[i + 1];
                        BuildingGroup buildingGroup = (BuildingGroup)arrDatas[i + 2];

                        dicZones[zone.zone_sn] = zone;

                        if (building != null)
                            dicBuildings[building.buld_sn] = building;

                        if (buildingGroup != null)
                            dicBuildingGroups[buildingGroup.buld_group_sn] = buildingGroup;
                    }
                }

                foreach (LinkedSopEx sop in linkedSopExes)
                {
                    if (sop.zone_sn != null)
                    {
                        Zone zone;

                        if (dicZones.TryGetValue((int)sop.zone_sn, out zone))
                        {
                            sop.ZoneName = zone.disp_text;

                            if (zone.buld_sn != null)
                            {
                                Building building;
                                BuildingGroup buildingGroup;

                                if (dicBuildings.TryGetValue((int)zone.buld_sn, out building))
                                {
                                    if (dicBuildingGroups.TryGetValue(building.buld_group_sn, out buildingGroup))
                                    {
                                        sop.BuildingGroupName = buildingGroup.disp_text;
                                        sop.BuildingName = building.disp_text;
                                    }
                                }
                            }
                        }
                    }
                }
            }*/

            return linkedSopExes;
        }

        private bool SetSopBuildingGroupNames(Dictionary<int, int> dicBuildingGroupNos, List<LinkedSopEx> linkedSopExes, out string strErrorMessage)
        {
            strErrorMessage = null;

            if (dicBuildingGroupNos.Count == 0)
                return true;

            string strCondition = string.Format("{0} in ({1})", BuildingGroup.Fields.buld_group_sn, string.Join(",", dicBuildingGroupNos.Keys));
            IEnumerable<BuildingGroup> buildingGroups = m_dataManager.GetSelect().Select<BuildingGroup>(strCondition, out strErrorMessage);

            if (buildingGroups == null)
                return false;

            Dictionary<int, BuildingGroup> dicBuildingGroups = new Dictionary<int, BuildingGroup>();

            foreach (BuildingGroup buildingGroup in buildingGroups)
            {
                dicBuildingGroups[buildingGroup.buld_group_sn] = buildingGroup;
            }

            foreach (var sop in linkedSopExes)
            {
                if (sop.buld_group_sn != null)
                {
                    BuildingGroup buildingGroup;

                    if (dicBuildingGroups.TryGetValue((int)sop.buld_group_sn, out buildingGroup))
                        sop.BuildingGroupName = buildingGroup.disp_text;
                }
            }

            return true;
        }

        private bool SetSopBuildingNames(Dictionary<int, int> dicBuildingNos, List<LinkedSopEx> linkedSopExes, out string strErrorMessage)
        {
            strErrorMessage = null;

            if (dicBuildingNos.Count == 0)
                return true;

            string strCondition = string.Format("{0} in ({1})", Building.Fields.buld_sn, string.Join(",", dicBuildingNos.Keys));
            IEnumerable<Building> buildings = m_dataManager.GetSelect().Select<Building>(strCondition, out strErrorMessage);

            if (buildings == null)
                return false;

            Dictionary<int, Building> dicBuildings = new Dictionary<int, Building>();

            foreach (Building building in buildings)
            {
                dicBuildings[building.buld_sn] = building;
            }

            foreach (var sop in linkedSopExes)
            {
                if (sop.buld_sn != null)
                {
                    Building building;

                    if (dicBuildings.TryGetValue((int)sop.buld_sn, out building))
                        sop.BuildingName = building.disp_text;
                }
            }

            return true;
        }

        private bool SetSopZoneNames(Dictionary<int, int> dicZoneNos, List<LinkedSopEx> linkedSopExes, out string strErrorMessage)
        {
            strErrorMessage = null;

            if (dicZoneNos.Count == 0)
                return true;

            string strCondition = string.Format("{0} in ({1})", Zone.Fields.zone_sn, string.Join(",", dicZoneNos.Keys));
            IEnumerable<Zone> zones = m_dataManager.GetSelect().Select<Zone>(strCondition, out strErrorMessage);

            if (zones == null)
                return false;

            Dictionary<int, Zone> dicZones = new Dictionary<int, Zone>();

            foreach (Zone zone in zones)
            {
                dicZones[zone.zone_sn] = zone;
            }

            foreach (var sop in linkedSopExes)
            {
                if (sop.zone_sn != null)
                {
                    Zone zone;

                    if (dicZones.TryGetValue((int)sop.zone_sn, out zone))
                        sop.ZoneName = zone.disp_text;
                }
            }

            return true;
        }

        private bool LoadSensorTypes(IEnumerable<LinkedSop> linkedSops, Dictionary<int, string> dicSensorTypes, Dictionary<long, string> dicSensorSubTypes, out string strErrorMessage)
        {
            strErrorMessage = null;

            Dictionary<int, int> dicSensorTypeNos = new Dictionary<int, int>();
            Dictionary<long, long> dicSensorSubTypeNos = new Dictionary<long, long>();

            foreach (LinkedSop sop in linkedSops)
            {
                dicSensorTypeNos[sop.sensor_ty_code] = sop.sensor_ty_code;

                if (sop.sensor_sub_ty_no != null)
                {
                    long key = GetSubTypeKey(sop.sensor_ty_code, (int)sop.sensor_sub_ty_no);
                    dicSensorSubTypeNos[key] = key;
                }
            }

            if (dicSensorTypeNos.Count == 0)
                return true;

            string strCondition = string.Format("{0} in ({1})", Codes.Fields.code, string.Join(",", dicSensorTypeNos.Keys));
            IEnumerable<Codes> codes = m_dataManager.GetSelect().Select<Codes>(strCondition, out strErrorMessage);

            if (codes == null)
                return false;

            foreach (Codes code in codes)
            {
                dicSensorTypes[code.code] = code.code_name;
            }

            if (dicSensorSubTypeNos.Count == 0)
                return true;

            strCondition = null;

            foreach (KeyValuePair<long, long> pair in dicSensorSubTypeNos)
            {
                int sensorTypeCode = (int)(pair.Key >> 32);
                int sensorSubTypeNo = (int)(pair.Key & 0xffffffff);

                if (strCondition == null)
                    strCondition = string.Format("({0} = {1} and {2} = {3})", SubType.Fields.sensor_ty_code, sensorTypeCode, SubType.Fields.sensor_sub_ty_no, sensorSubTypeNo);
                else
                    strCondition += string.Format(" or ({0} = {1} and {2} = {3})", SubType.Fields.sensor_ty_code, sensorTypeCode, SubType.Fields.sensor_sub_ty_no, sensorSubTypeNo);
            }

            IEnumerable<SubType> subTypes = m_dataManager.GetSelect().Select<SubType>(strCondition, out strErrorMessage);

            if (subTypes == null)
                return false;

            foreach (SubType subType in subTypes)
            {
                long key = GetSubTypeKey(subType.sensor_ty_code, subType.sensor_sub_ty_no);
                dicSensorSubTypes[key] = subType.sensor_sub_ty_name;
            }

            return true;
        }

        private static string GetSensorTypeName(int sensorTypeNo, int? sensorSubTypeNo, Dictionary<int, string> dicSensorTypes, Dictionary<long, string> dicSensorSubTypes, Dictionary<long, SensorTypeData> dicSensorTypeDatas)
        {
            if (dicSensorTypeDatas != null)
            {
                long key = SensorTypeData.MakeKey(sensorTypeNo, sensorSubTypeNo);
                SensorTypeData sensorTypeData;

                if (dicSensorTypeDatas.TryGetValue(key, out sensorTypeData))
                    return sensorTypeData.SensorTypeName;
            }
            else
            {
                string strSensorTypeName;

                if (sensorSubTypeNo != null)
                {
                    long key = GetSubTypeKey(sensorTypeNo, (int)sensorSubTypeNo);

                    if (dicSensorSubTypes.TryGetValue(key, out strSensorTypeName))
                        return strSensorTypeName;
                }
                else if (dicSensorTypes.TryGetValue(sensorTypeNo, out strSensorTypeName))
                    return strSensorTypeName;
            }

            // Default 값 사용
            LinkedSopEx sop = new LinkedSopEx();
            return sop.SensorTypeName;
        }

        private static long GetSubTypeKey(int sensorTypeNo, int sensorSubTypeNo)
        {
            return ((((long)sensorTypeNo) << 32) | (long)sensorSubTypeNo);
        }

        private static List<LinkedSopCountByVersion> SelectLinkedSopCountByVersion(IDataManager dataManager, string strCondition, out string strErrorMessage)
        {
            string strSQL = string.Format("select d.{0} no, (select count(*) from {1} e where e.{2}= b.{3}) count ", 
                LinkedSop.Fields.link_sop_sn, SmallClass.TableName, SmallClass.Fields.mclas_sn, MiddleClass.Fields.mclas_sn);
            strSQL += string.Format("from {0} a ", LargeClass.TableName);
            strSQL += string.Format("inner join {0} b on a.{1} = b.{2} ", MiddleClass.TableName, LargeClass.Fields.lclas_sn, MiddleClass.Fields.lclas_sn);
            strSQL += string.Format("inner join {0} c on b.{1} = c.{2} ", SmallClass.TableName, MiddleClass.Fields.mclas_sn, SmallClass.Fields.mclas_sn);
            strSQL += string.Format("inner join {0} d on a.{1} = d.{2} ", LinkedSop.TableName, LargeClass.Fields.lclas_sn, LinkedSop.Fields.mclas_sn);
            strSQL += string.Format("and b.{0} = d.{1} and c.{2} = d.{3}",
                MiddleClass.Fields.mclas_sn, LinkedSop.Fields.mclas_sn,
                SmallClass.Fields.sclas_name, LinkedSop.Fields.sclas_name);

            IEnumerable<dynamic> result = dataManager.GetSelect().Select(strSQL, out strErrorMessage);

            if (result == null)
                return null;

            List<LinkedSopCountByVersion> results = new List<LinkedSopCountByVersion>();

            foreach (var item in result)
            {
                var data = item as IDictionary<string, object>;

                LinkedSopCountByVersion sopCount = new LinkedSopCountByVersion();

                sopCount.LinkedSopNo = item.no;
                sopCount.Count = item.count;

                results.Add(sopCount);
            }

            return results;
        }
    }
}
