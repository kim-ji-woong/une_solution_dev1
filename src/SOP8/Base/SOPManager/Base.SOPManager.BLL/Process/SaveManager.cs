using System;
using System.Collections.Generic;
using Base.SOPManager.IBLL.Models;
using Base.SOPManager.IBLL.Models.Category;
using Base.SOPManager.IBLL.Models.Component;
using Base.SOPManager.IBLL.Response;
using Base.Model.Sop.Category;
using Base.Model.Sop.Component;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using Base.DAL;
using dnsData.CommonCode;
using Response.Resource;
using Response;
using Base.SOPManager.IBLL.Request;
using Base.Model.Sop.Config;
using Base.Model.Common.Team;

namespace Base.SOPManager.BLL.Process
{
    using Validation;
    using Utility;
    using Resource;

    class SaveManager
    {
        private IDataManager m_dataManager = null;

        public SaveManager(IDataManager dataManager)
        {
            m_dataManager = dataManager;
        }

        public ResponseSave SaveDB(int nUserNo, SOPData sopData)
        {
            _SectionDataToSectionData(sopData);

            ActionStep errorActionStep = null;
            Component errorSection = null;
            string strErrorMessage;
            Dictionary<ActionStepData, bool> dicActiveActionSteps = new Dictionary<ActionStepData, bool>();

            if (ValidationChecker.CheckSOPValidation(sopData.ActionStepDatas, dicActiveActionSteps, out errorActionStep, out errorSection, out strErrorMessage) == false)
                return GetResponseSaveDB(null, strErrorMessage, errorActionStep, errorSection);

            if (sopData.DisasterCategory == null)
                return GetResponseSaveDB(null, ID.Get<ErrorMessage>("noDisasterCategory").Value());

            if (sopData.SubDisasterCategory == null)
                return GetResponseSaveDB(null, ID.Get<ErrorMessage>("noSubDisasterCategory").Value());

            if (sopData.Disaster == null)
                return GetResponseSaveDB(null, ID.Get<ErrorMessage>("noDisaster").Value());

            IDataManager dataManager = m_dataManager.Clone();

            if (dataManager.BeginBatch(out strErrorMessage) == false)
                return new ResponseSave(false, ID.Get<ErrorMessage>("failToBeginTransaction").Value());

            if (sopData.Version != null)
            {
                List<int> versionNos = new List<int>();
                versionNos.Add(sopData.Version.ver_sn);

                // 실행중인 SOP는 편집할 수 없다.
                if (DeleteManager.CheckRunningSop(dataManager, versionNos, null, out strErrorMessage) == false)
                {
                    string strTemp;
                    dataManager.BatchRollback(out strTemp);
                    return GetResponseSaveDB(null, strErrorMessage);
                }
            }

            if (CheckNSave(sopData.DisasterCategory, dataManager, out strErrorMessage) == false)
            {
                string strTemp;
                dataManager.BatchRollback(out strTemp);
                return GetResponseSaveDB(null, strErrorMessage);
            }

            sopData.SubDisasterCategory.lclas_sn = sopData.DisasterCategory.lclas_sn;

            if (CheckNSave(sopData.SubDisasterCategory, dataManager, out strErrorMessage) == false)
            {
                string strTemp;
                dataManager.BatchRollback(out strTemp);
                return GetResponseSaveDB(null, strErrorMessage);
            }

            strErrorMessage = null;
            Model.Sop.Category.Version version = sopData.Version;

            version.last_acces_de = DateTime.Now;
            version.user_sn = nUserNo;

            if (CheckNSave(ref version, nUserNo, sopData.DisasterCategory.site_sn, dataManager, ref strErrorMessage) == false)
            {
                string strTemp;
                dataManager.BatchRollback(out strTemp);

                if (strErrorMessage != null)
                    return new ResponseSave(false, LengthChecker.CheckTextLengthError(strErrorMessage, dataManager));
                else
                    return GetResponseSaveDB(null, ID.Get<ErrorMessage>("failSaveVersion").Value());
            }

            sopData.Disaster.ver_sn = version.ver_sn;
            sopData.Disaster.mclas_sn = sopData.SubDisasterCategory.mclas_sn;

            if (Save(sopData.Disaster, dataManager, out strErrorMessage) == false)
            {
                string strTemp;
                dataManager.BatchRollback(out strTemp);

                System.Diagnostics.Trace.WriteLine(strErrorMessage);
                return GetResponseSaveDB(null, ID.Get<ErrorMessage>("failSave").Value());
            }

            foreach (ActionStepData actionStepData in sopData.ActionStepDatas)
            {
                if (actionStepData.ActionStep == null || actionStepData.StepMemberDatas == null ||
                    actionStepData.StepMemberDatas.Count == 0)
                    continue;

                if (dicActiveActionSteps.ContainsKey(actionStepData) == false)
                    continue;

                actionStepData.ActionStep.sclas_sn = sopData.Disaster.sclas_sn;
                actionStepData.ActionStep.action_step_name = actionStepData.StepName;

                if (Save(actionStepData.ActionStep, dataManager, out strErrorMessage) == false)
                {
                    string strTemp;
                    dataManager.BatchRollback(out strTemp);
                    System.Diagnostics.Trace.WriteLine(strErrorMessage);

                    errorActionStep = actionStepData.ActionStep;
                    return GetResponseSaveDB(null, ID.Get<ErrorMessage>("failSaveActionStep").Value());
                }

                SectionNumberMaker.SetSectionNumbers(actionStepData.StepMemberDatas);

                foreach (StepMemberData stepMemberData in actionStepData.StepMemberDatas)
                {
                    if (stepMemberData.StepMember == null)
                        continue;

                    stepMemberData.StepMember.action_step_sn = actionStepData.ActionStep.action_step_sn;

                    if (Save(stepMemberData.StepMember, dataManager, out strErrorMessage) == false)
                    {
                        string strTemp;
                        dataManager.BatchRollback(out strTemp);
                        System.Diagnostics.Trace.WriteLine(strErrorMessage);

                        errorActionStep = actionStepData.ActionStep;
                        return GetResponseSaveDB(null, ID.Get<ErrorMessage>("failSaveStepMember").Value());
                    }

                    Dictionary<long, Component> dicGridSections = new Dictionary<long, Component>();
                    Grid grid = null;

                    int nGridRowCount, nGridColumnCount;
                    GetGridSize(stepMemberData.Sections, out nGridColumnCount, out nGridRowCount);

                    if (nGridColumnCount > 0 && nGridRowCount > 0)
                    {
                        grid = SaveGrid(stepMemberData, nGridRowCount, nGridColumnCount, dataManager, out strErrorMessage);

                        if (grid == null)
                        {
                            string strTemp;
                            dataManager.BatchRollback(out strTemp);
                            System.Diagnostics.Trace.WriteLine(strErrorMessage);

                            errorActionStep = actionStepData.ActionStep;
                            return GetResponseSaveDB(null, ID.Get<ErrorMessage>("failSaveGrid").Value());
                        }

                        foreach (SectionData section in stepMemberData.Sections)
                        {
                            section.Component.grid_sn = grid.grid_sn;
                            section.Component.step_memb_sn = stepMemberData.StepMember.step_memb_sn;

                            if (Save(section.Component, section.SectionNumber, dataManager, ref strErrorMessage) == false)
                            {
                                string strTemp;
                                dataManager.BatchRollback(out strTemp);
                                System.Diagnostics.Trace.WriteLine(strErrorMessage);

                                errorSection = section.Component;
                                errorActionStep = actionStepData.ActionStep;

                                if (strErrorMessage != null)
                                    return new ResponseSave(false, LengthChecker.CheckTextLengthError(strErrorMessage, dataManager));
                                else
                                    return GetResponseSaveDB(null, ID.Get<ErrorMessage>("failSaveSection").Value());
                            }
                        }
                    }

                    SetArrowConnection(stepMemberData);

                    foreach (ArrowData arrow in stepMemberData.Arrows)
                    {
                        arrow.Arrow.step_memb_sn = stepMemberData.StepMember.step_memb_sn;
                        arrow.Arrow.lc_optn_code = (int)CodeType.ArrowPosition;

                        if (arrow.Text != null && arrow.Text.Length > 0)
                            arrow.Arrow.contents = arrow.Text;

                        if (Save(arrow.Arrow, dataManager, out strErrorMessage) == false)
                        {
                            string strTemp;
                            dataManager.BatchRollback(out strTemp);
                            System.Diagnostics.Trace.WriteLine(strErrorMessage);

                            errorActionStep = actionStepData.ActionStep;
                            return GetResponseSaveDB(null, ID.Get<ErrorMessage>("failSaveArrow").Value());
                        }
                    }
                }
            }

            if (dataManager.BatchCommit(out strErrorMessage) == false)
            {
                string strTemp;
                dataManager.BatchRollback(out strTemp);
                System.Diagnostics.Trace.WriteLine(strErrorMessage);

                return GetResponseSaveDB(null, ID.Get<ErrorMessage>("failToCommitTransaction").Value());
            }

            SectionDataTo_SectionData(sopData, dataManager);
            return GetResponseSaveDB(sopData, "", errorActionStep, errorSection);
        }

        private static void SectionDataTo_SectionData(SOPData sopData, IDataManager dataManager)
        {
            string strErrorMessage;
            IEnumerable<Temporary> temporaries = dataManager.GetSelect().Select<Temporary>(null, out strErrorMessage);

            Dictionary<int, Temporary> dicTemporaries = null;

            if (temporaries != null)
            {
                dicTemporaries = new Dictionary<int, Temporary>();

                foreach (Temporary _temporary in temporaries)
                {
                    dicTemporaries[_temporary.tmpr_sn] = _temporary;
                }
            }

            Temporary temporary;

            foreach (ActionStepData actionStepData in sopData.ActionStepDatas)
            {
                foreach (StepMemberData stepMemberData in actionStepData.StepMemberDatas)
                {
                    stepMemberData.RawSections.Clear();

                    foreach (SectionData sectionData in stepMemberData.Sections)
                    {
                        _SectionData _sectionData = ValidationChecker.SectionDataTo_SectionData(sectionData);
                        stepMemberData.RawSections.Add(_sectionData);

                        if (sectionData.ProcessData != null)
                        {
                            foreach (var processTemporary in sectionData.ProcessData.Temporaries)
                            {
                                if (dicTemporaries.TryGetValue(processTemporary.tmpr_sn, out temporary))
                                    processTemporary.nor_yn = temporary.nor_yn;
                            }
                        }

                        if (sectionData.TransmissionData != null)
                        {
                            foreach (var transmissionTemporary in sectionData.TransmissionData.Temporaries)
                            {
                                if (dicTemporaries.TryGetValue(transmissionTemporary.tmpr_sn, out temporary))
                                    transmissionTemporary.nor_yn = temporary.nor_yn;
                            }
                        }

                        if (_sectionData.Temporaries != null)
                        {
                            foreach (var _temporary in _sectionData.Temporaries)
                            {
                                if (dicTemporaries.TryGetValue(_temporary.tmpr_sn, out temporary))
                                    _temporary.nor_yn = temporary.nor_yn;
                            }
                        }

                        if (_sectionData.TransmissionTemporaries != null)
                        {
                            foreach (var _temporary in _sectionData.TransmissionTemporaries)
                            {
                                if (dicTemporaries.TryGetValue(_temporary.tmpr_sn, out temporary))
                                    _temporary.nor_yn = temporary.nor_yn;
                            }
                        }
                    }
                }
            }
        }

        public static void _SectionDataToSectionData(SOPData sopData)
        {
            foreach (ActionStepData actionStepData in sopData.ActionStepDatas)
            {
                foreach (StepMemberData stepMemberData in actionStepData.StepMemberDatas)
                {
                    foreach (_SectionData _sectionData in stepMemberData.RawSections)
                    {
                        SectionData sectionData = ValidationChecker._SectionDataToSectionData(_sectionData);
                        stepMemberData.Sections.Add(sectionData);
                    }
                }
            }
        }

        private void SetArrowConnection(StepMemberData stepMemberData)
        {
            // key : SectionKey
            Dictionary<int, SectionData> dicSections = new Dictionary<int, SectionData>();

            foreach (SectionData sectionData in stepMemberData.Sections)
            {
                int key = ValidationChecker.GetSectionKey(sectionData.Component);
                dicSections[key] = sectionData;
            }

            foreach (ArrowData arrowData in stepMemberData.Arrows)
            {
                if (arrowData.Arrow == null)
                {
                    arrowData.Arrow = new Arrow();
                    arrowData.Arrow.arrw_sn = arrowData.ArrowNo;
                }

                int keyBegin = ValidationChecker.GetArrowKey(arrowData, true);
                int keyEnd = ValidationChecker.GetArrowKey(arrowData, false);

                SectionData sectionBegin, sectionEnd;

                if (dicSections.TryGetValue(keyBegin, out sectionBegin) && dicSections.TryGetValue(keyEnd, out sectionEnd))
                {
                    arrowData.Arrow.begin_compn_sn = sectionBegin.Component.compn_sn;
                    arrowData.Arrow.end_compn_sn = sectionEnd.Component.compn_sn;
                    arrowData.Arrow.begin_arrw_lc_code = arrowData.BeginPosition;
                    arrowData.Arrow.end_arrw_lc_code = arrowData.EndPosition;
                }
            }
        }

        // DB에 저장되어 있는지 확인하여, 이미 저장되어 있으면 그냥 true를 리턴하고 빠져나온다.
        // 그렇지 않다면 rollback에 RollbackData를 넣은후 DB에 값을 저장한다.
        private bool CheckNSave(LargeClass dc, IDataManager dataManager, out string strErrorMessage)
        {
            strErrorMessage = null;

            if (dc.lclas_sn <= 0)
            {
                if (dc.lclas_name == null || dc.lclas_name.Length == 0)
                    return false;

                Dictionary<LargeClass.Fields, object> dicCondition = new Dictionary<LargeClass.Fields, object>();
                dicCondition[LargeClass.Fields.lclas_name] = dc.lclas_name;

                string strCondition = string.Format("{0} = '{1}'", LargeClass.Fields.lclas_name, dc.lclas_name);
                IEnumerable<LargeClass> disasterCategories = dataManager.GetSelect().Select<LargeClass>(strCondition, out strErrorMessage);

                if (disasterCategories == null)
                    return false;

                foreach (var disasterCategory in disasterCategories)
                {
                    dc.lclas_sn = disasterCategory.lclas_sn;
                    break;
                }

                if (dc.lclas_sn <= 0)
                {
                    int? maxNo = CustomManager.GetMax(dataManager, LargeClass.Fields.lclas_sn.ToString(), LargeClass.TableName, null, out strErrorMessage);

                    if (maxNo == null)
                        return false;

                    dc.lclas_sn = ((int)maxNo) + 1;

                    if (dataManager.GetCreate().Insert<LargeClass>(dc, out strErrorMessage) == false)
                        return false;
                }
            }

            return true;
        }

        // DB에 저장되어 있는지 확인하여, 이미 저장되어 있으면 그냥 true를 리턴하고 빠져나온다.
        private bool CheckNSave(MiddleClass sdc, IDataManager dataManager, out string strErrorMessage)
        {
            strErrorMessage = null;

            if (sdc.mclas_sn <= 0)
            {
                if (sdc.mclas_name == null || sdc.mclas_name.Length == 0)
                    return false;

                string strCondition = string.Format("{0} = '{1}'", MiddleClass.Fields.mclas_name, sdc.mclas_name);
                IEnumerable<MiddleClass> subDisasterCategories = dataManager.GetSelect().Select<MiddleClass>(strCondition, out strErrorMessage);

                if (subDisasterCategories == null)
                    return false;

                foreach (var subDisasterCategory in subDisasterCategories)
                {
                    sdc.mclas_sn = subDisasterCategory.mclas_sn;
                    break;
                }

                if (sdc.mclas_sn <= 0)
                {
                    int? maxNo = CustomManager.GetMax(dataManager, MiddleClass.Fields.mclas_sn.ToString(), MiddleClass.TableName, null, out strErrorMessage);

                    if (maxNo == null)
                        return false;

                    sdc.mclas_sn = ((int)maxNo) + 1;

                    if (dataManager.GetCreate().Insert<MiddleClass>(sdc, out strErrorMessage) == false)
                        return false;
                }
            }

            return true;
        }

        // DB에 저장되어 있는지 확인하여, 이미 저장되어 있으면 그냥 true를 리턴하고 빠져나온다.
        private bool CheckNSave(ref Model.Sop.Category.Version version, int nUserNo, int nSiteNo, IDataManager dataManager, ref string strErrorMessage)
        {
            if (version == null || version.ver_sn <= 0)
            {
                string strVersionName = "V1.0";

                if (version != null)
                {
                    if (version.name == null || version.name.Length == 0)
                        version.name = strVersionName;

                    version.user_sn = nUserNo;
                    version.site_sn = nSiteNo;
                }
                else
                {
                    version.name = strVersionName;
                    version.creat_de = DateTime.Now;
                    version.last_acces_de = version.creat_de;
                    version.user_sn = nUserNo;
                    version.site_sn = nSiteNo;
                }

                DateTime dtNow = DateTime.Now;

                int addedID;

                if (dataManager.GetCreate().Insert<Model.Sop.Category.Version>(version, out addedID, out strErrorMessage) == false)
                    return false;

                version.ver_sn = addedID;
            }
            else
            {
                string strPrevTime = string.Format("{0}-{1:00}-{2:00} {3:00}:{4:00}:{5:00}", version.last_acces_de.Year, version.last_acces_de.Month, version.last_acces_de.Day, version.last_acces_de.Hour, version.last_acces_de.Minute, version.last_acces_de.Second);

                version.last_acces_de = DateTime.Now;
                version.site_sn = nSiteNo;
                version.user_sn = nUserNo;

                string strCondition = string.Format("{0} = {1}", Model.Sop.Category.Version.Fields.ver_sn, version.ver_sn);

                if (dataManager.GetUpdate().Update<Model.Sop.Category.Version>(version, strCondition, out strErrorMessage) == false)
                    return false;

                // 버전정보만 남기고 나머지는 모두 지운다.
                if (DeleteManager.DeleteSOPVersion(version.ver_sn.ToString(), false, dataManager, out strErrorMessage) == false)
                    return false;
            }

            return true;
        }

        private ResponseSave GetResponseSaveDB(SOPData sopData, string strMessage, ActionStep errorActionStep = null, Component errorSection = null)
        {
            ResponseSave result = new ResponseSave();

            if (sopData == null)
            {
                result.Success = false;
            }
            else
            {
                result.Success = true;
                result.SOPData = sopData;
            }

            result.Message = strMessage;
            result.ErrorSection = errorSection;
            result.ErrorActionStep = errorActionStep;
            return result;
        }

        private bool Save(SmallClass disaster, IDataManager dataManager, out string strErrorMessage)
        {
            strErrorMessage = null;

            if (disaster.sclas_name == null || disaster.sclas_name.Length == 0)
            {
                strErrorMessage = ID.Get<ErrorMessage>("noDisaster").Value();
                return false;
            }

            int addedID;

            if (dataManager.GetCreate().Insert<SmallClass>(disaster, out addedID, out strErrorMessage) == false)
                return false;

            disaster.sclas_sn = addedID;
            return true;
        }

        private bool Save(ActionStep actionStep, IDataManager dataManager, out string strErrorMessage)
        {
            strErrorMessage = ID.Get<ErrorMessage>("noActionStep").Value();

            if (actionStep.action_step_name == null || actionStep.action_step_name.Length == 0)
                return false;

            int addedID;

            if (dataManager.GetCreate().Insert<ActionStep>(actionStep, out addedID, out strErrorMessage) == false)
                return false;

            actionStep.action_step_sn = addedID;
            return true;
        }

        private bool Save(StepMember stepMember, IDataManager dataManager, out string strErrorMessage)
        {
            int addedID;

            if (dataManager.GetCreate().Insert<StepMember>(stepMember, out addedID, out strErrorMessage) == false)
                return false;

            stepMember.step_memb_sn = addedID;
            return true;
        }

        private void GetGridSize(List<SectionData> sectionDatas, out int nGridColumnCount, out int nGridRowCount)
        {
            int nMaxColumnIndex = -1, nMaxRowIndex = -1;

            foreach (SectionData sectionData in sectionDatas)
            {
                if (sectionData.Component.column_no > nMaxColumnIndex)
                    nMaxColumnIndex = sectionData.Component.column_no;

                if (sectionData.Component.row_no > nMaxRowIndex)
                    nMaxRowIndex = sectionData.Component.row_no;
            }

            nGridColumnCount = nMaxColumnIndex + 1;
            nGridRowCount = nMaxRowIndex + 1;
        }

        private Grid SaveGrid(StepMemberData stepMemberData, int nGridRowCount, int nGridColumnCount, IDataManager dataManager, out string strErrorMessage)
        {
            int nStepMemberNo = stepMemberData.StepMember.step_memb_sn;

            Grid grid = new Grid();
            grid.step_memb_sn = stepMemberData.StepMember.step_memb_sn;

            int addedID;

            if (dataManager.GetCreate().Insert<Grid>(grid, out addedID, out strErrorMessage) == false)
                return null;

            grid.grid_sn = addedID;

            for (int i = 0; i < nGridRowCount; i++)
            {
                int nCellHeight = stepMemberData.GridRowHeight[i];

                GridRow row = new GridRow();
                row.grid_sn = grid.grid_sn;
                row.row_no = i;
                row.height = nCellHeight;

                if (dataManager.GetCreate().Insert<GridRow>(row, out strErrorMessage) == false)
                    return null;
            }

            for (int i = 0; i < nGridColumnCount; i++)
            {
                int nCellWidth = stepMemberData.GridColumnWidth[i];

                GridColumn column = new GridColumn();
                column.grid_sn = grid.grid_sn;
                column.column_no = i;
                column.width = nCellWidth;

                if (dataManager.GetCreate().Insert<GridColumn>(column, out strErrorMessage) == false)
                    return null;
            }

            return grid;
        }

        private bool Save(Component section, int? sectionNumber, IDataManager dataManager, ref string strErrorMessage)
        {
            if (section.compn_code == Sop.ComponentType.Comment || section.compn_code == Sop.ComponentType.Comment - (int)CodeType.ComponentType)
                return SaveAnnotation((CommentData)section, dataManager, ref strErrorMessage);
            else if (section.compn_code == Sop.ComponentType.Decision || section.compn_code == Sop.ComponentType.Decision - (int)CodeType.ComponentType)
                return SaveDecision((DecisionData)section, sectionNumber, dataManager, ref strErrorMessage);
            else if (section.compn_code == Sop.ComponentType.Endpoint || section.compn_code == Sop.ComponentType.Endpoint - (int)CodeType.ComponentType)
                return SaveEndpoint((EndpointData)section, sectionNumber, dataManager, ref strErrorMessage);
            else if (section.compn_code == Sop.ComponentType.Transmission || section.compn_code == Sop.ComponentType.Transmission - (int)CodeType.ComponentType)
                return SaveTransmission((TransmissionData)section, sectionNumber, dataManager, ref strErrorMessage);
            else if (section.compn_code == Sop.ComponentType.Process || section.compn_code == Sop.ComponentType.Process - (int)CodeType.ComponentType)
                return SaveProcess((ProcessData)section, sectionNumber, dataManager, ref strErrorMessage);

            return true;
        }

        private bool SaveAnnotation(CommentData annotation, IDataManager dataManager, ref string strErrorMessage)
        {
            int addedID;

            if (dataManager.GetCreate().Insert<Component>(annotation, out addedID, out strErrorMessage) == false)
                return false;

            annotation.compn_sn = addedID;
            annotation.Comment.compn_sn = addedID;

            if (dataManager.GetCreate().Insert<Comment>(annotation.Comment, out strErrorMessage) == false)
                return false;

            return true;
        }

        private bool SaveDecision(DecisionData decision, int? sectionNumber, IDataManager dataManager, ref string strErrorMessage)
        {
            int addedID;

            if (dataManager.GetCreate().Insert<Component>(decision, out addedID, out strErrorMessage) == false)
                return false;

            decision.compn_sn = addedID;
            decision.Decision.compn_sn = addedID;
            decision.Decision.execut_no = sectionNumber;

            if (dataManager.GetCreate().Insert<Decision>(decision.Decision, out strErrorMessage) == false)
                return false;

            if (decision.AutoScriptVariables.Count > 0)
            {
                foreach (var variable in decision.AutoScriptVariables)
                {
                    variable.compn_sn = decision.compn_sn;
                }

                if (dataManager.GetCreate().Insert<DecisionAutoScriptVariable>(decision.AutoScriptVariables, out strErrorMessage) == false)
                    return false;
            }

            return true;
        }

        private bool SaveEndpoint(EndpointData endpoint, int? sectionNumber, IDataManager dataManager, ref string strErrorMessage)
        {
            endpoint.Endpoint.execut_no = sectionNumber;

            int addedID;

            if (dataManager.GetCreate().Insert<Component>(endpoint, out addedID, out strErrorMessage) == false)
                return false;

            endpoint.compn_sn = addedID;
            endpoint.Endpoint.compn_sn = addedID;

            if (dataManager.GetCreate().Insert<Endpoint>(endpoint.Endpoint, out strErrorMessage) == false)
                return false;

            return true;
        }

        private bool SaveTransmission(TransmissionData transmission, int? sectionNumber, IDataManager dataManager, ref string strErrorMessage)
        {
            int addedID;

            if (dataManager.GetCreate().Insert<Component>(transmission, out addedID, out strErrorMessage) == false)
                return false;

            transmission.compn_sn = addedID;
            transmission.Transmission.compn_sn = addedID;
            transmission.Transmission.execut_no = sectionNumber;

            if (dataManager.GetCreate().Insert<Transmission>(transmission.Transmission, out strErrorMessage) == false)
                return false;

            if (transmission.Regulars.Count > 0)
            {
                foreach (TransmissionRegular regular in transmission.Regulars)
                {
                    regular.compn_sn = transmission.compn_sn;
                }

                if (dataManager.GetCreate().Insert<TransmissionRegular>(transmission.Regulars, out strErrorMessage) == false)
                    return false;
            }

            if (transmission.Temporaries.Count > 0)
            {
                foreach (TransmissionTemporary temporary in transmission.Temporaries)
                {
                    temporary.compn_sn = transmission.compn_sn;
                }

                List<TransmissionTemporary> transmissionTemporaries = new List<TransmissionTemporary>();
                transmissionTemporaries.AddRange(transmission.Temporaries);

                if (dataManager.GetCreate().Insert<TransmissionTemporary>(transmissionTemporaries, out strErrorMessage) == false)
                    return false;
            }

            return true;
        }

        private bool SaveProcess(ProcessData process, int? sectionNumber, IDataManager dataManager, ref string strErrorMessage)
        {
            int addedID;

            if (dataManager.GetCreate().Insert<Component>(process, out addedID, out strErrorMessage) == false)
                return false;

            process.compn_sn = addedID;
            process.Process.compn_sn = addedID;
            process.Process.execut_no = sectionNumber;

            if (dataManager.GetCreate().Insert<Model.Sop.Component.Process>(process.Process, out strErrorMessage) == false)
                return false;

            if (process.Missions.Count > 0)
            {
                List<ProcessMission> processMissions = new List<ProcessMission>();

                foreach (ProcessMission mission in process.Missions)
                {
                    mission.compn_sn = process.compn_sn;
                    processMissions.Add(mission);
                }

                if (dataManager.GetCreate().Insert<ProcessMission>(processMissions, out strErrorMessage) == false)
                    return false;
            }

            if (process.Regulars.Count > 0)
            {
                foreach (ProcessRegular regular in process.Regulars)
                {
                    regular.compn_sn = process.compn_sn;
                }

                if (dataManager.GetCreate().Insert<ProcessRegular>(process.Regulars, out strErrorMessage) == false)
                    return false;
            }

            if (process.Temporaries.Count > 0)
            {
                foreach (ProcessTemporary temporary in process.Temporaries)
                {
                    temporary.compn_sn = process.compn_sn;
                }

                List<ProcessTemporary> processTemporaries = new List<ProcessTemporary>();
                processTemporaries.AddRange(process.Temporaries);

                if (dataManager.GetCreate().Insert<ProcessTemporary>(processTemporaries, out strErrorMessage) == false)
                    return false;
            }

            return true;
        }

        private bool Save(Arrow arrow, IDataManager dataManager, out string strErrorMessage)
        {
            int addedID;

            if (dataManager.GetCreate().Insert<Arrow>(arrow, out addedID, out strErrorMessage) == false)
                return false;

            arrow.arrw_sn = addedID;
            return true;
        }

        public MessageResult SaveLinkedSOPs(SaveLinkedSOPs data)
        {
            if (data.LinkedSopDatas == null)
            {
                return new MessageResult(false, ID.Get<ErrorMessage>("nullParameter").Value());
            }

            try
            {
                int nSiteNo = data.SiteNo;

                string strErrorMessage = null;
                IEnumerable<LinkedSop> linkedSops = m_dataManager.GetSelect().Select<LinkedSop>(null, out strErrorMessage);

                if (linkedSops == null)
                    return new MessageResult(false, ID.Get<ErrorMessage>("failToSaveLinkedSOP").Value());

                List<int> linkNos = new List<int>();

                foreach (LinkedSop item in data.LinkedSopDatas)
                {
                    LinkedSop temp = new LinkedSop()
                    {
                        link_sop_sn = item.link_sop_sn,
                        sensor_ty_optn_code = (int)CodeType.SensorType,
                        sensor_ty_code = item.sensor_ty_code,
                        sensor_sub_ty_no = item.sensor_sub_ty_no,
                        buld_group_sn = item.buld_group_sn,
                        buld_sn = item.buld_sn,
                        zone_sn = item.zone_sn,
                        lclas_sn = item.lclas_sn,
                        mclas_sn = item.mclas_sn,
                        sclas_name = item.sclas_name,
                        site_sn = item.site_sn,
                        descp = item.descp
                    };

                    CheckLinkedSop(temp, linkedSops);

                    if (temp.link_sop_sn <= 0)
                    {
                        int addedID;

                        if (m_dataManager.GetCreate().Insert<LinkedSop>(temp, out addedID, out strErrorMessage) == false)
                        {
                            System.Diagnostics.Trace.WriteLine(strErrorMessage);
                            return new MessageResult(false, ID.Get<ErrorMessage>("failToSaveLinkedSOP").Value());
                        }

                        temp.link_sop_sn = addedID;
                    }
                    else
                    {
                        if (m_dataManager.GetUpdate().Update<LinkedSop>(temp, null, out strErrorMessage) == false)
                        {
                            System.Diagnostics.Trace.WriteLine(strErrorMessage);
                            return new MessageResult(false, ID.Get<ErrorMessage>("failToSaveLinkedSOP").Value());
                        }
                    }

                    linkNos.Add(temp.link_sop_sn);
                }

                string strCondition = string.Format("{0} = {1}", LinkedSop.Fields.site_sn, nSiteNo);

                if (linkNos.Count > 0)
                    strCondition += string.Format(" and {0} not in ({1})", LinkedSop.Fields.link_sop_sn, string.Join(",", linkNos));

                if (m_dataManager.GetDelete().Delete<LinkedSop>(strCondition, out strErrorMessage) == false)
                {
                    System.Diagnostics.Trace.WriteLine(strErrorMessage);
                    return new MessageResult(false, ID.Get<ErrorMessage>("failToDeleteLinkedSOP").Value());
                }
            }
            catch (Exception ex)
            {
                return new MessageResult(false, ex.Message);
            }

            return new MessageResult(true, "");
        }

        private void CheckLinkedSop(LinkedSop sop, IEnumerable<LinkedSop> linkedSops)
        {
            if (sop.link_sop_sn > 0)
                return;

            foreach (var linkedSop in linkedSops)
            {
                if (sop.buld_group_sn == linkedSop.buld_group_sn &&
                    sop.buld_sn == linkedSop.buld_sn &&
                    sop.zone_sn == linkedSop.zone_sn &&
                    sop.lclas_sn == linkedSop.lclas_sn &&
                    sop.mclas_sn == linkedSop.mclas_sn &&
                    sop.sensor_ty_code == linkedSop.sensor_ty_code &&
                    sop.site_sn == linkedSop.site_sn &&
                    sop.sensor_ty_optn_code == linkedSop.sensor_ty_optn_code &&
                    sop.sclas_name == linkedSop.sclas_name)
                {
                    sop.link_sop_sn = linkedSop.link_sop_sn;
                    return;
                }
            }
        }
    }
}
