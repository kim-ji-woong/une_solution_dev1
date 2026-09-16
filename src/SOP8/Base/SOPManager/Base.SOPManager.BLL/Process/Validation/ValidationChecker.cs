using System.Collections.Generic;
using Base.SOPManager.IBLL.Models.Category;
using Base.SOPManager.IBLL.Models.Component;
using Base.Model.Sop.Category;
using Base.Model.Sop.Component;
using dnsData.CommonCode;
using Response.Resource;
using Response;
using Base.SOPManager.IBLL.Request;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using Base.Model.Account;

namespace Base.SOPManager.BLL.Process.Validation
{
    using Resource;

    class ValidationChecker
    {
        public static bool CheckSOPValidation(List<ActionStepData> actionStepDatas, Dictionary<ActionStepData, bool> dicActiveActionSteps, out ActionStep errorActionStep, out Component errorSection, out string strErrorMessage)
        {
            errorActionStep = null;
            errorSection = null;
            int activeActionStepCount = 0;

            foreach (ActionStepData actionStepData in actionStepDatas)
            {
                if (actionStepData.StepMemberDatas.Count == 0)
                    continue;

                // SOP는 반드시 시작 Component와 종료 Component가 하나 이상씩 존재해야 한다.
                bool? begin = null, end = null;
                int nSectionCount = 0;
                Component sectionBegin = null;
                List<Component> sectionEnds = new List<Component>();
                List<Component> allSections = new List<Component>();
                List<ArrowData> allArrows = new List<ArrowData>();

                foreach (StepMemberData stepMemberData in actionStepData.StepMemberDatas)
                {
                    foreach (SectionData sectionData in stepMemberData.Sections)
                    {
                        allSections.Add(sectionData.Component);
                    }

                    allArrows.AddRange(stepMemberData.Arrows);

                    foreach (SectionData sectionData in stepMemberData.Sections)
                    {
                        nSectionCount++;

                        if (sectionData.Component.compn_code == Sop.ComponentType.Endpoint || sectionData.Component.compn_code == Sop.ComponentType.Endpoint - (int)CodeType.ComponentType)
                        {
                            EndpointData endPointData = (EndpointData)sectionData.Component;

                            if (endPointData.Endpoint != null)
                            {
                                if (endPointData.Endpoint.begin_yn)
                                {
                                    begin = true;

                                    if (sectionBegin == null)
                                        sectionBegin = sectionData.Component;
                                    else
                                    {
                                        strErrorMessage = string.Format("{0}단계에 시작 컴포넌트가 하나 이상 존재합니다.\r\n시작 컴포넌트는 반드시 하나만 있어야 합니다.", actionStepData.StepName);
                                        errorSection = sectionData.Component;
                                        errorActionStep = actionStepData.ActionStep;
                                        return false;
                                    }
                                }
                                else
                                {
                                    end = true;
                                    sectionEnds.Add(sectionData.Component);
                                }

                                if (begin != null && end != null)
                                    break;
                            }
                        }
                    }

                    if (begin != null && end != null)
                        break;
                }

                if (nSectionCount == 0)
                    continue;

                if (begin == null || begin == false)
                {
                    strErrorMessage = string.Format(ID.Get<ErrorMessageFormat>("noBeginComponent").Value(), actionStepData.StepName);
                    return false;
                }
                else if (end == null || end == false)
                {
                    strErrorMessage = string.Format(ID.Get<ErrorMessageFormat>("noEndComponent").Value(), actionStepData.StepName);
                    return false;
                }

                // SOP Component들간의 연결관계를 확인한다.
                if (CheckComponentConnection(allSections, sectionBegin, sectionEnds, allArrows, out errorSection, out strErrorMessage) == false)
                {
                    errorActionStep = actionStepData.ActionStep;
                    return false;
                }

                activeActionStepCount++;
                dicActiveActionSteps[actionStepData] = true;
            }

            if (activeActionStepCount == 0)
            {
                strErrorMessage = ID.Get<ErrorMessage>("noSOPDatas").Value();
                return false;
            }

            strErrorMessage = null;
            return true;
        }

        private static bool CheckComponentConnection(List<Component> sections, Component sectionBegin, List<Component> sectionEnds, List<ArrowData> arrows, out Component errorSection, out string strErrorMessage)
        {
            errorSection = null;
            SectionOrder sectionBeginOrder = null;
            // key : SectionKey
            Dictionary<int, SectionOrder> _dicSectionOrders = new Dictionary<int, SectionOrder>();
            Dictionary<int, Component> dicSectionComponents = new Dictionary<int, Component>();

            foreach (Component section in sections)
            {
                dicSectionComponents[section.compn_sn] = section;

                if (section.compn_code == Sop.ComponentType.Comment || section.compn_code == Sop.ComponentType.Comment - (int)CodeType.ComponentType)
                    continue;

                int key = GetSectionKey(section);

                SectionOrder sectionOrder = new SectionOrder(section);
                _dicSectionOrders[key] = sectionOrder;

                if (section == sectionBegin)
                    sectionBeginOrder = sectionOrder;

                dicSectionComponents[section.compn_sn] = section;
            }

            Dictionary<Component, SectionOrder> dicNextSections = new Dictionary<Component, SectionOrder>();

            foreach (ArrowData arrow in arrows)
            {
                SectionOrder section1, section2;

                if (_dicSectionOrders.TryGetValue(GetArrowKey(arrow, true), out section1) && _dicSectionOrders.TryGetValue(GetArrowKey(arrow, false), out section2))
                {
                    if (section1.NextSections.Contains(section2) == false)
                    {
                        section1.NextSections.Add(section2);
                        dicNextSections[section2.SectionData] = section2;
                    }
                }
            }

            Dictionary<SectionOrder, SectionOrder> dicSectionOrders = new Dictionary<SectionOrder, SectionOrder>();

            if (GoToSectionEnd(sectionBeginOrder, dicSectionOrders) == false)
            {
                strErrorMessage = ID.Get<ErrorMessage>("notConnectedBeginToEnd").Value();
                return false;
            }

            foreach (Component section in sections)
            {
                if (section.compn_code == Sop.ComponentType.Comment || section.compn_code == Sop.ComponentType.Comment - (int)CodeType.ComponentType)
                    continue;

                if (section == sectionBeginOrder.SectionData)
                    continue;

                if (dicNextSections.ContainsKey(section) == false)
                {
                    strErrorMessage = string.Format(ID.Get<ErrorMessageFormat>("unconnectedComponent").Value(), GetComponentTypeName(section), GetComponentText(section));
                    errorSection = section;
                    return false;
                }
            }

            strErrorMessage = null;
            return true;
        }

        private static bool GoToSectionEnd(SectionOrder section, Dictionary<SectionOrder, SectionOrder> dicSections)
        {
            foreach (SectionOrder next in section.NextSections)
            {
                if (next.SectionData.compn_code == Sop.ComponentType.Endpoint || next.SectionData.compn_code == Sop.ComponentType.Endpoint - (int)CodeType.ComponentType)
                {
                    EndpointData endPointData = (EndpointData)next.SectionData;

                    if (endPointData.Endpoint != null && endPointData.Endpoint.begin_yn == false)
                        return true;
                }

                if (dicSections.ContainsKey(next))
                    continue;
                else
                {
                    dicSections[next] = next;

                    if (GoToSectionEnd(next, dicSections))
                        return true;
                }
            }

            return false;
        }

        private static string GetComponentTypeName(Component sectionData)
        {
            if (sectionData.compn_code == Sop.ComponentType.Comment || sectionData.compn_code == Sop.ComponentType.Comment - (int)CodeType.ComponentType)
                return "설명 Component";
            else if (sectionData.compn_code == Sop.ComponentType.Decision || sectionData.compn_code == Sop.ComponentType.Decision - (int)CodeType.ComponentType)
                return "판단 Component";
            else if (sectionData.compn_code == Sop.ComponentType.Endpoint || sectionData.compn_code == Sop.ComponentType.Endpoint - (int)CodeType.ComponentType)
                return "시작/종료 Component";
            else if (sectionData.compn_code == Sop.ComponentType.Transmission || sectionData.compn_code == Sop.ComponentType.Transmission - (int)CodeType.ComponentType)
                return "상황전파 Component";
            else if (sectionData.compn_code == Sop.ComponentType.Process || sectionData.compn_code == Sop.ComponentType.Process - (int)CodeType.ComponentType)
                return "프로세스 Component";

            return "";
        }

        private static string GetComponentText(Component sectionData)
        {
            if (sectionData.compn_code == Sop.ComponentType.Comment || sectionData.compn_code == Sop.ComponentType.Comment - (int)CodeType.ComponentType)
            {
                CommentData annotationData = (CommentData)sectionData;

                if (annotationData.Comment != null)
                    return annotationData.Comment.contents;
            }
            else if (sectionData.compn_code == Sop.ComponentType.Decision || sectionData.compn_code == Sop.ComponentType.Decision - (int)CodeType.ComponentType)
            {
                DecisionData decisionData = (DecisionData)sectionData;

                if (decisionData.Decision != null)
                    return decisionData.Decision.title;
            }
            else if (sectionData.compn_code == Sop.ComponentType.Endpoint || sectionData.compn_code == Sop.ComponentType.Endpoint - (int)CodeType.ComponentType)
            {
                EndpointData endpointData = (EndpointData)sectionData;

                if (endpointData.Endpoint != null)
                    return endpointData.Endpoint.title;
            }
            else if (sectionData.compn_code == Sop.ComponentType.Transmission || sectionData.compn_code == Sop.ComponentType.Transmission - (int)CodeType.ComponentType)
            {
                TransmissionData tranmissionData = (TransmissionData)sectionData;

                if (tranmissionData.Transmission != null)
                    return tranmissionData.Transmission.title;
            }
            else if (sectionData.compn_code == Sop.ComponentType.Process || sectionData.compn_code == Sop.ComponentType.Process - (int)CodeType.ComponentType)
            {
                ProcessData processData = (ProcessData)sectionData;

                if (processData.Process != null)
                    return processData.Process.title;
            }

            return "";
        }

        public static int GetSectionKey(Component section)
        {
            return (section.column_no << 16) | section.row_no;
        }

        public static int GetArrowKey(ArrowData arrow, bool isBegin)
        {
            if (isBegin)
                return (arrow.BeginColumnIndex << 16) | arrow.BeginRowIndex;

            return (arrow.EndColumnIndex << 16) | arrow.EndRowIndex;
        }

        // DB에 저장할 수 있는 문제없는 Section인지 검사한다.
        public static MessageResult CheckSectionData(IDataManager dataManager, CheckSectionData data)
        {
            if (data.ArrowData != null)
                return CheckArrowData(dataManager, data.ArrowData, data.UserNo);

            if (data.SectionData == null)
                return new MessageResult(false, ID.Get<ErrorMessage>("nullParameter").Value());

            SectionData sectionData = _SectionDataToSectionData(data.SectionData);

            if (sectionData == null || sectionData.Component == null)
                return new MessageResult(false, ID.Get<ErrorMessage>("nullParameter").Value());

            string strErrorMessage;
            dataManager = dataManager.Clone();

            if (dataManager.BeginBatch(out strErrorMessage) == false)
                return new MessageResult(false, ID.Get<ErrorMessage>("failToBeginTransaction").Value());

            Grid grid = MakeTempGrid(data.StepMemberNo, data.UserNo, dataManager, ref strErrorMessage);

            if (grid == null)
            {
                string strTemp;
                dataManager.BatchRollback(out strTemp);
                return new MessageResult(false, strErrorMessage);
            }

            GridRow row = new GridRow();
            row.grid_sn = grid.grid_sn;
            row.height = 100;
            row.row_no = sectionData.Component.row_no;

            if (dataManager.GetCreate().Insert<GridRow>(row, out strErrorMessage) == false)
            {
                string strTemp;
                dataManager.BatchRollback(out strTemp);
                System.Diagnostics.Trace.WriteLine(strErrorMessage);
                return new MessageResult(false, ID.Get<ErrorMessage>("failSaveGridRow").Value());
            }

            GridColumn column = new GridColumn();
            column.grid_sn = grid.grid_sn;
            column.width = 100;
            column.column_no = sectionData.Component.column_no;

            if (dataManager.GetCreate().Insert<GridColumn>(column, out strErrorMessage) == false)
            {
                string strTemp;
                dataManager.BatchRollback(out strTemp);
                System.Diagnostics.Trace.WriteLine(strErrorMessage);
                return new MessageResult(false, ID.Get<ErrorMessage>("failSaveGridColumn").Value());
            }

            object section;

            if (sectionData.Component.compn_code == Sop.ComponentType.Comment || sectionData.Component.compn_code == Sop.ComponentType.Comment - (int)CodeType.ComponentType)
            {
                section = MakeTempComment(dataManager, sectionData, grid.grid_sn, grid.step_memb_sn, out strErrorMessage);
            }
            else if (sectionData.Component.compn_code == Sop.ComponentType.Decision || sectionData.Component.compn_code == Sop.ComponentType.Decision - (int)CodeType.ComponentType)
            {
                section = MakeTempDecision(dataManager, sectionData, grid.grid_sn, grid.step_memb_sn, out strErrorMessage);
            }
            else if (sectionData.Component.compn_code == Sop.ComponentType.Endpoint || sectionData.Component.compn_code == Sop.ComponentType.Endpoint - (int)CodeType.ComponentType)
            {
                section = MakeTempEndPoint(dataManager, sectionData, grid.grid_sn, grid.step_memb_sn, out strErrorMessage);
            }
            else if (sectionData.Component.compn_code == Sop.ComponentType.Transmission || sectionData.Component.compn_code == Sop.ComponentType.Transmission - (int)CodeType.ComponentType)
            {
                section = MakeTempTransmission(dataManager, sectionData, grid.grid_sn, grid.step_memb_sn, out strErrorMessage);
            }
            else if (sectionData.Component.compn_code == Sop.ComponentType.Process || sectionData.Component.compn_code == Sop.ComponentType.Process - (int)CodeType.ComponentType)
            {
                section = MakeTempProcess(dataManager, sectionData, grid.grid_sn, grid.step_memb_sn, out strErrorMessage);
            }
            else
            {
                string strTemp;
                dataManager.BatchRollback(out strTemp);
                return new MessageResult(false, ID.Get<ErrorMessage>("unknownComponentType").Value());
            }

            if (section == null)
            {
                string strTemp;
                dataManager.BatchRollback(out strTemp);
                System.Diagnostics.Trace.WriteLine(strErrorMessage);
                return new MessageResult(false, LengthChecker.CheckTextLengthError(strErrorMessage, dataManager));
            }

            // 실제로 저장하려는 것이 아니라 검사만 하는 것이므로 Transaction을 취소한다.
            dataManager.BatchRollback(out strErrorMessage);
            return new MessageResult(true, "");
        }

        private static Model.Sop.Component.Process MakeTempProcess(IDataManager dataManager, SectionData sectionData, int nGridNo, int nStepMemberNo, out string strErrorMessage)
        {
            Component component = MakeTempComponent(dataManager, sectionData, nGridNo, nStepMemberNo, out strErrorMessage);

            if (component == null)
                return null;

            ProcessData processData = (ProcessData)sectionData.Component;
            processData.Process.compn_sn = component.compn_sn;

            if (dataManager.GetCreate().Insert<Model.Sop.Component.Process>(processData.Process, out strErrorMessage) == false)
                return null;

            if (processData.Missions != null && processData.Missions.Count > 0)
            {
                List<ProcessMission> processDataMissions = new List<ProcessMission>();

                foreach (var mission in processData.Missions)
                {
                    mission.compn_sn = component.compn_sn;
                    processDataMissions.Add(mission);
                }

                if (dataManager.GetCreate().Insert<ProcessMission>(processDataMissions, out strErrorMessage) == false)
                    return null;
            }

            if (processData.Regulars != null && processData.Regulars.Count > 0)
            {
                foreach (var regular in processData.Regulars)
                {
                    regular.compn_sn = component.compn_sn;
                }

                if (dataManager.GetCreate().Insert<ProcessRegular>(processData.Regulars, out strErrorMessage) == false)
                    return null;
            }

            if (processData.Temporaries != null && processData.Temporaries.Count > 0)
            {
                foreach (var temporary in processData.Temporaries)
                {
                    temporary.compn_sn = component.compn_sn;
                }

                List<ProcessTemporary> processTemporaries = new List<ProcessTemporary>();
                processTemporaries.AddRange(processData.Temporaries);

                if (dataManager.GetCreate().Insert<ProcessTemporary>(processTemporaries, out strErrorMessage) == false)
                    return null;
            }

            return processData.Process;
        }

        private static Transmission MakeTempTransmission(IDataManager dataManager, SectionData sectionData, int nGridNo, int nStepMemberNo, out string strErrorMessage)
        {
            Component component = MakeTempComponent(dataManager, sectionData, nGridNo, nStepMemberNo, out strErrorMessage);

            if (component == null)
                return null;

            TransmissionData transmissionData = (TransmissionData)sectionData.Component;
            transmissionData.Transmission.compn_sn = component.compn_sn;

            if (dataManager.GetCreate().Insert<Transmission>(transmissionData.Transmission, out strErrorMessage) == false)
                return null;

            if (transmissionData.Regulars != null && transmissionData.Regulars.Count > 0)
            {
                foreach (var regular in transmissionData.Regulars)
                {
                    regular.compn_sn = component.compn_sn;
                }

                if (dataManager.GetCreate().Insert<TransmissionRegular>(transmissionData.Regulars, out strErrorMessage) == false)
                    return null;
            }

            if (transmissionData.Temporaries != null && transmissionData.Temporaries.Count > 0)
            {
                foreach (var temporary in transmissionData.Temporaries)
                {
                    temporary.compn_sn = component.compn_sn;
                }

                List<TransmissionTemporary> transmissionTemporaries = new List<TransmissionTemporary>();
                transmissionTemporaries.AddRange(transmissionData.Temporaries);

                if (dataManager.GetCreate().Insert<TransmissionTemporary>(transmissionTemporaries, out strErrorMessage) == false)
                    return null;
            }

            return transmissionData.Transmission;
        }

        private static Endpoint MakeTempEndPoint(IDataManager dataManager, SectionData sectionData, int nGridNo, int nStepMemberNo, out string strErrorMessage)
        {
            Component component = MakeTempComponent(dataManager, sectionData, nGridNo, nStepMemberNo, out strErrorMessage);

            if (component == null)
                return null;

            IEnumerable<Component> components = dataManager.GetSelect().Select<Component>(null, out strErrorMessage);

            EndpointData endpointData = (EndpointData)sectionData.Component;
            endpointData.Endpoint.compn_sn = component.compn_sn;

            if (dataManager.GetCreate().Insert<Endpoint>(endpointData.Endpoint, out strErrorMessage) == false)
                return null;

            return endpointData.Endpoint;
        }

        private static Decision MakeTempDecision(IDataManager dataManager, SectionData sectionData, int nGridNo, int nStepMemberNo, out string strErrorMessage)
        {
            Component component = MakeTempComponent(dataManager, sectionData, nGridNo, nStepMemberNo, out strErrorMessage);

            if (component == null)
                return null;

            DecisionData decisionData = (DecisionData)sectionData.Component;
            decisionData.Decision.compn_sn = component.compn_sn;

            if (dataManager.GetCreate().Insert<Decision>(decisionData.Decision, out strErrorMessage) == false)
                return null;

            if (dataManager.GetCreate().Insert<DecisionAutoScriptVariable>(decisionData.AutoScriptVariables, out strErrorMessage) == false)
                return null;

            return decisionData.Decision;
        }

        private static Comment MakeTempComment(IDataManager dataManager, SectionData sectionData, int nGridNo, int nStepMemberNo, out string strErrorMessage)
        {
            Component component = MakeTempComponent(dataManager, sectionData, nGridNo, nStepMemberNo, out strErrorMessage);

            if (component == null)
                return null;

            Comment comment = new Comment();
            comment.contents = "Temp";
            comment.compn_sn = component.compn_sn;

            if (dataManager.GetCreate().Insert<Comment>(comment, out strErrorMessage) == false)
                return null;

            return comment;
        }

        private static Component MakeTempComponent(IDataManager dataManager, SectionData sectionData, int nGridNo, int nStepMemberNo, out string strErrorMessage)
        {
            sectionData.Component.grid_sn = nGridNo;
            sectionData.Component.step_memb_sn = nStepMemberNo;

            int addedID;

            if (dataManager.GetCreate().Insert<Component>(sectionData.Component, out addedID, out strErrorMessage) == false)
                return null;

            sectionData.Component.compn_sn = addedID;
            return sectionData.Component;
        }

        private static Grid MakeTempGrid(int nStepMemberNo, int nUserNo, IDataManager dataManager, ref string strErrorMessage)
        {
            if (nStepMemberNo > 0)
            {
                Grid sectionGrid = new Grid();
                sectionGrid.step_memb_sn = nStepMemberNo;

                int addedID;

                if (dataManager.GetCreate().Insert<Grid>(sectionGrid, out addedID, out strErrorMessage) == false)
                    return null;

                sectionGrid.grid_sn = addedID;
                return sectionGrid;
            }

            StepMember stepMember = MakeTempStepMember(dataManager, nUserNo, out strErrorMessage);

            if (stepMember == null)
                return null;

            Grid grid = new Grid();
            grid.step_memb_sn = stepMember.step_memb_sn;

            int _addedID;

            if (dataManager.GetCreate().Insert<Grid>(grid, out _addedID, out strErrorMessage) == false)
                return null;

            grid.grid_sn = _addedID;
            return grid;
        }

        // DB에 저장할 수 있는 문제없는 화살표인지 검사한다.
        public static MessageResult CheckArrowData(IDataManager dataManager, ArrowData data, int nUserNo)
        {
            if (data.Arrow == null)
                return new MessageResult(true, "");

            string strErrorMessage;
            dataManager = dataManager.Clone();

            if (dataManager.BeginBatch(out strErrorMessage) == false)
            {
                System.Diagnostics.Trace.WriteLine(strErrorMessage);
                return new MessageResult(false, ID.Get<ErrorMessage>("failToBeginTransaction").Value());
            }

            if (data.Arrow.step_memb_sn > 0)
            {
                if (dataManager.GetCreate().Insert<Arrow>(data.Arrow, out strErrorMessage) == false)
                {
                    string strTemp;
                    dataManager.BatchRollback(out strTemp);
                    return new MessageResult(false, LengthChecker.CheckTextLengthError(strErrorMessage, dataManager));
                }
            }
            else
            {
                StepMember stepMember = MakeTempStepMember(dataManager, nUserNo, out strErrorMessage);

                if (stepMember == null)
                {
                    string strTemp;
                    dataManager.BatchRollback(out strTemp);
                    return new MessageResult(false, strErrorMessage);
                }

                int addedID;

                if (dataManager.GetCreate().Insert<Arrow>(data.Arrow, out addedID, out strErrorMessage) == false)
                {
                    string strTemp;
                    dataManager.BatchRollback(out strTemp);
                    System.Diagnostics.Trace.WriteLine(strErrorMessage);

                    if (data.Arrow.contents != null && data.Arrow.contents.Length > 0)
                        return new MessageResult(false, LengthChecker.CheckTextLengthError(strErrorMessage, dataManager));
                    else
                        return new MessageResult(false, ID.Get<ErrorMessage>("failSaveArrow").Value());
                }
            }

            // 테스트가 끝났으니 임시로 DB에 저장했던 데이터들은 모두 삭제한다.
            string _strTemp;
            dataManager.BatchRollback(out _strTemp);
            return new MessageResult(true, "");
        }

        private static StepMember MakeTempStepMember(IDataManager dataManager, int nUserNo, out string strErrorMessage)
        {
            IEnumerable<LargeClass> disasterCategories = dataManager.GetSelect().Select<LargeClass>(null, out strErrorMessage);

            if (disasterCategories == null)
            {
                System.Diagnostics.Trace.WriteLine(strErrorMessage);
                strErrorMessage = ID.Get<ErrorMessage>("failToReadDisasterCategory").Value();
                return null;
            }

            LargeClass disasterCategory = null;
            int nSiteNo = 0;

            foreach (var dc in disasterCategories)
            {
                disasterCategory = dc;
                nSiteNo = dc.site_sn;
                break;
            }

            if (disasterCategory == null)
            {
                string strCondition = string.Format("{0} = {1}", User.Fields.user_sn, nUserNo);
                User user = dataManager.GetSelect().SelectFirst<User>(strCondition, out strErrorMessage);

                if (user == null)
                {
                    System.Diagnostics.Trace.WriteLine(strErrorMessage);
                    strErrorMessage = ID.Get<ErrorMessage>("failToReadLoginUser").Value();
                    return null;
                }

                if (user.site_sn == null)
                {
                    strErrorMessage = ID.Get<ErrorMessage>("failSaveArrow").Value();
                    return null;
                }

                disasterCategory = new LargeClass();
                disasterCategory.lclas_name = "Temp";
                disasterCategory.lclas_sn = 1;
                disasterCategory.site_sn = (int)user.site_sn;

                int addedID;

                if (dataManager.GetCreate().Insert<LargeClass>(disasterCategory, out addedID, out strErrorMessage) == false)
                {
                    System.Diagnostics.Trace.WriteLine(strErrorMessage);
                    strErrorMessage = ID.Get<ErrorMessage>("failSaveDisasterCategory").Value();
                    return null;
                }

                disasterCategory.lclas_sn = addedID;
            }

            string strConditions = string.Format("{0} = {1}", MiddleClass.Fields.lclas_sn, disasterCategory.lclas_sn);
            IEnumerable<MiddleClass> subDisasterCategories = dataManager.GetSelect().Select<MiddleClass>(strConditions, out strErrorMessage);

            if (subDisasterCategories == null)
            {
                System.Diagnostics.Trace.WriteLine(strErrorMessage);
                strErrorMessage = ID.Get<ErrorMessage>("failToReadSubDisasterCategory").Value();
                return null;
            }

            MiddleClass subDisasterCategory = null;

            foreach (var sdc in subDisasterCategories)
            {
                subDisasterCategory = sdc;
                break;
            }

            if (subDisasterCategory == null)
            {
                subDisasterCategory = new MiddleClass();
                subDisasterCategory.lclas_sn = disasterCategory.lclas_sn;
                subDisasterCategory.mclas_name = "Temp";

                int addedID;

                if (dataManager.GetCreate().Insert<MiddleClass>(subDisasterCategory, out addedID, out strErrorMessage) == false)
                {
                    System.Diagnostics.Trace.WriteLine(strErrorMessage);
                    strErrorMessage = ID.Get<ErrorMessage>("failSaveSubDisasterCategory").Value();
                    return null;
                }

                subDisasterCategory.mclas_sn = addedID;
            }

            Version version = new Version();
            version.creat_de = System.DateTime.Now;
            version.last_acces_de = version.creat_de;
            version.name = "Temp";
            version.site_sn = nSiteNo;
            version.user_sn = nUserNo;

            int _addedID;

            if (dataManager.GetCreate().Insert<Version>(version, out _addedID, out strErrorMessage) == false)
            {
                System.Diagnostics.Trace.WriteLine(strErrorMessage);
                strErrorMessage = ID.Get<ErrorMessage>("failSaveVersion").Value();
                return null;
            }

            version.ver_sn = _addedID;

            SmallClass disaster = new SmallClass();
            disaster.sclas_name = "Temp";
            disaster.nor_yn = true;
            disaster.mclas_sn = subDisasterCategory.mclas_sn;
            disaster.ver_sn = version.ver_sn;

            if (dataManager.GetCreate().Insert<SmallClass>(disaster, out _addedID, out strErrorMessage) == false)
            {
                System.Diagnostics.Trace.WriteLine(strErrorMessage);
                strErrorMessage = ID.Get<ErrorMessage>("failSaveDisaster").Value();
                return null;
            }

            disaster.sclas_sn = _addedID;

            ActionStep actionStep = new ActionStep();
            actionStep.action_step_name = "Temp";
            actionStep.sclas_sn = disaster.sclas_sn;

            if (dataManager.GetCreate().Insert<ActionStep>(actionStep, out _addedID, out strErrorMessage) == false)
            {
                System.Diagnostics.Trace.WriteLine(strErrorMessage);
                strErrorMessage = ID.Get<ErrorMessage>("failSaveActionStep").Value();
                return null;
            }

            actionStep.action_step_sn = _addedID;

            StepMember stepMember = new StepMember();
            stepMember.action_step_sn = actionStep.action_step_sn;

            if (dataManager.GetCreate().Insert<StepMember>(stepMember, out _addedID, out strErrorMessage) == false)
            {
                System.Diagnostics.Trace.WriteLine(strErrorMessage);
                strErrorMessage = ID.Get<ErrorMessage>("failSaveStepMember").Value();
                return null;
            }

            stepMember.step_memb_sn = _addedID;
            return stepMember;
        }

        public static _SectionData SectionDataTo_SectionData(SectionData data)
        {
            if (data.Component.compn_code == Sop.ComponentType.Comment || data.Component.compn_code == Sop.ComponentType.Comment - (int)CodeType.ComponentType)
            {
                return ToAnnotationData(data);
            }
            else if (data.Component.compn_code == Sop.ComponentType.Decision || data.Component.compn_code == Sop.ComponentType.Decision - (int)CodeType.ComponentType)
            {
                return ToDecisionData(data);
            }
            else if (data.Component.compn_code == Sop.ComponentType.Endpoint || data.Component.compn_code == Sop.ComponentType.Endpoint - (int)CodeType.ComponentType)
            {
                return ToEndPointData(data);
            }
            else if (data.Component.compn_code == Sop.ComponentType.Transmission || data.Component.compn_code == Sop.ComponentType.Transmission - (int)CodeType.ComponentType)
            {
                return ToTransmissionData(data);
            }
            else if (data.Component.compn_code == Sop.ComponentType.Process || data.Component.compn_code == Sop.ComponentType.Process - (int)CodeType.ComponentType)
            {
                return ToProcessData(data);
            }

            return null;
        }

        private static _SectionData ToAnnotationData(SectionData data)
        {
            _SectionData sectionData = new _SectionData();
            ComponentTo_SectionData(data.Component, sectionData);

            if (data.Component is CommentData)
            {
                CommentData annotationData = (CommentData)data.Component;
                sectionData.Text = annotationData.Comment.contents;
                sectionData.SectionNumber = data.SectionNumber;
            }

            return sectionData;
        }

        private static _SectionData ToDecisionData(SectionData data)
        {
            _SectionData sectionData = new _SectionData();
            ComponentTo_SectionData(data.Component, sectionData);

            if (data.Component is DecisionData)
            {
                DecisionData decisionData = (DecisionData)data.Component;
                sectionData.Title = decisionData.Decision.title;
                sectionData.Description = decisionData.Decision.descp;
                sectionData.AutoRunScript = decisionData.Decision.atmc_execut_script;

                sectionData.AutoScriptVariables.AddRange(decisionData.AutoScriptVariables);

                sectionData.SectionNumber = data.SectionNumber;
            }

            return sectionData;
        }

        private static _SectionData ToEndPointData(SectionData data)
        {
            _SectionData sectionData = new _SectionData();
            ComponentTo_SectionData(data.Component, sectionData);

            if (data.Component is EndpointData)
            {
                EndpointData endpointData = (EndpointData)data.Component;
                sectionData.Title = endpointData.Endpoint.title;
                sectionData.begin_yn = endpointData.Endpoint.begin_yn;
                sectionData.SectionNumber = data.SectionNumber;
            }

            return sectionData;
        }

        private static _SectionData ToTransmissionData(SectionData data)
        {
            _SectionData sectionData = new _SectionData();
            ComponentTo_SectionData(data.Component, sectionData);

            if (data.Component is TransmissionData)
            {
                TransmissionData transmissionData = (TransmissionData)data.Component;
                sectionData.Title = transmissionData.Transmission.title;
                sectionData.sms_yn = transmissionData.Transmission.sms_yn;
                sectionData.email_yn = transmissionData.Transmission.email_yn;
                sectionData.brdcst_yn = transmissionData.Transmission.brdcst_yn;
                sectionData.mssage = transmissionData.Transmission.mssage;
                sectionData.atmc_execut_yn = transmissionData.Transmission.atmc_execut_yn;
                sectionData.siren_yn = transmissionData.Transmission.siren_yn;

                sectionData.TransmissionRegulars.AddRange(transmissionData.Regulars);
                sectionData.TransmissionTemporaries.AddRange(transmissionData.Temporaries);

                sectionData.SectionNumber = data.SectionNumber;
            }

            return sectionData;
        }

        private static _SectionData ToProcessData(SectionData data)
        {
            _SectionData sectionData = new _SectionData();
            ComponentTo_SectionData(data.Component, sectionData);

            if (data.Component is ProcessData)
            {
                ProcessData processData = (ProcessData)data.Component;
                sectionData.Title = processData.Process.title;
                sectionData.leadr_prvuse_yn = processData.Process.leadr_prvuse_yn;
                sectionData.atmc_execut_yn = processData.Process.atmc_execut_yn;
                sectionData.Missions.AddRange(processData.Missions);
                sectionData.Regulars.AddRange(processData.Regulars);
                sectionData.Temporaries.AddRange(processData.Temporaries);
                sectionData.SectionNumber = data.SectionNumber;
            }

            return sectionData;
        }

        public static SectionData _SectionDataToSectionData(_SectionData data)
        {
            if (data.compn_code == Sop.ComponentType.Comment || data.compn_code == Sop.ComponentType.Comment - (int)CodeType.ComponentType)
            {
                return ToAnnotationData(data);
            }
            else if (data.compn_code == Sop.ComponentType.Decision || data.compn_code == Sop.ComponentType.Decision - (int)CodeType.ComponentType)
            {
                return ToDecisionData(data);
            }
            else if (data.compn_code == Sop.ComponentType.Endpoint || data.compn_code == Sop.ComponentType.Endpoint - (int)CodeType.ComponentType)
            {
                return ToEndPointData(data);
            }
            else if (data.compn_code == Sop.ComponentType.Transmission || data.compn_code == Sop.ComponentType.Transmission - (int)CodeType.ComponentType)
            {
                return ToTransmissionData(data);
            }
            else if (data.compn_code == Sop.ComponentType.Process || data.compn_code == Sop.ComponentType.Process - (int)CodeType.ComponentType)
            {
                return ToProcessData(data);
            }

            return null;
        }

        private static SectionData ToAnnotationData(_SectionData data)
        {
            CommentData annotationData = new CommentData();
            Comment comment = new Comment();

            _SectionDataToComponent(data, annotationData);

            comment.compn_sn = annotationData.compn_sn;
            comment.contents = data.Text;
            annotationData.Comment = comment;

            SectionData sectionData = new SectionData();
            sectionData.SetComponent(annotationData);
            sectionData.SectionNumber = data.SectionNumber;
            return sectionData;
        }

        private static SectionData ToDecisionData(_SectionData data)
        {
            DecisionData decisionData = new DecisionData();
            Decision decision = new Decision();

            _SectionDataToComponent(data, decisionData);

            decision.compn_sn = decisionData.compn_sn;
            decision.title = data.Title;
            decision.descp = data.Description;
            decision.atmc_execut_script = data.AutoRunScript;
            decision.execut_no = data.SectionNumber;

            decisionData.AutoScriptVariables.AddRange(data.AutoScriptVariables);
            decisionData.Decision = decision;

            SectionData sectionData = new SectionData();
            sectionData.SetComponent(decisionData);
            sectionData.SectionNumber = data.SectionNumber;
            return sectionData;
        }

        private static SectionData ToTransmissionData(_SectionData data)
        {
            TransmissionData transmissionData = new TransmissionData();
            Transmission transmission = new Transmission();

            _SectionDataToComponent(data, transmissionData);

            transmission.compn_sn = transmissionData.compn_sn;
            transmission.title = data.Title;
            transmission.sms_yn = data.sms_yn;
            transmission.email_yn = data.email_yn;
            transmission.brdcst_yn = data.brdcst_yn;
            transmission.mssage = data.mssage;
            transmission.atmc_execut_yn = data.atmc_execut_yn;
            transmission.siren_yn = data.siren_yn;
            transmission.execut_no = data.SectionNumber;

            transmissionData.Regulars.AddRange(data.TransmissionRegulars);
            transmissionData.Temporaries.AddRange(data.TransmissionTemporaries);
            transmissionData.Transmission = transmission;

            SectionData sectionData = new SectionData();
            sectionData.SetComponent(transmissionData);
            sectionData.SectionNumber = data.SectionNumber;
            return sectionData;
        }

        private static SectionData ToEndPointData(_SectionData data)
        {
            EndpointData endpointData = new EndpointData();
            Endpoint endpoint = new Endpoint();

            _SectionDataToComponent(data, endpointData);

            endpoint.compn_sn = endpointData.compn_sn;
            endpoint.title = data.Title;
            endpoint.begin_yn = data.begin_yn;
            endpoint.execut_no = data.SectionNumber;

            endpointData.Endpoint = endpoint;

            SectionData sectionData = new SectionData();
            sectionData.SetComponent(endpointData);
            sectionData.SectionNumber = data.SectionNumber;
            return sectionData;
        }

        private static SectionData ToProcessData(_SectionData data)
        {
            ProcessData processData = new ProcessData();
            Model.Sop.Component.Process process = new Model.Sop.Component.Process();

            _SectionDataToComponent(data, processData);

            process.compn_sn = processData.compn_sn;
            process.title = data.Title;
            process.leadr_prvuse_yn = data.leadr_prvuse_yn;
            process.atmc_execut_yn = data.atmc_execut_yn;
            process.execut_no = data.SectionNumber;

            foreach (var mission in data.Missions)
            {
                processData.Missions.Add(new ProcessMissionEx(mission));
            }

            processData.Regulars.AddRange(data.Regulars);
            processData.Temporaries.AddRange(data.Temporaries);
            processData.Process = process;

            SectionData sectionData = new SectionData();
            sectionData.SetComponent(processData);
            sectionData.SectionNumber = data.SectionNumber;
            return sectionData;
        }

        private static void _SectionDataToComponent(_SectionData data, Component component)
        {
            component.compn_sn = data.compn_sn;
            component.column_no = data.column_no;
            component.compn_code = data.compn_code;
            component.compn_optn_code = (int)dnsData.CommonCode.CodeType.ComponentType;
            component.grid_sn = data.grid_sn;
            component.row_no = data.row_no;
            component.step_memb_sn = data.StepMemberNo;
        }

        private static void ComponentTo_SectionData(Component component, _SectionData data)
        {
            data.compn_sn = component.compn_sn;
            data.column_no = component.column_no;
            data.compn_code = component.compn_code;
            data.grid_sn = component.grid_sn;
            data.row_no = component.row_no;
            data.StepMemberNo = component.step_memb_sn;
        }
    }
}
