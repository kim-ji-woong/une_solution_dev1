using System;
using System.Collections.Generic;
using Base.SOPManager.IBLL.Response;
using Base.SOPManager.IBLL.Models;
using Base.SOPManager.IBLL.Models.Category;
using Base.SOPManager.IBLL.Models.Component;
using Base.Model.Sop.Category;
using Base.Model.Sop.Component;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using System.IO;
using System.Xml;
using System.Xml.Linq;
using System.Text;
using Response.Resource;
using dnsData.CommonCode;
using Base.Model.Common.Team;

namespace Base.SOPManager.BLL.Process
{
    using Validation;
    using Resource;

    class XMLManager
    {
        private const string XMLVersion = "V2.0";
        private const string ProcessTeamDelimeter = "\t";
        private const string ProcessTeamConnector = "_";
        private const string TeamPathDelimeter = "/";

        public static ResponseSave Save(SOPData sopData, IDataManager dataManager)
        {
            SaveManager._SectionDataToSectionData(sopData);

            string strErrorMessage;
            Dictionary<ActionStepData, bool> dicActiveActionSteps = new Dictionary<ActionStepData, bool>();

            Component errorSection = null;
            ActionStep errorActionStep = null;

            if (ValidationChecker.CheckSOPValidation(sopData.ActionStepDatas, dicActiveActionSteps, out errorActionStep, out errorSection, out strErrorMessage) == false)
                return GetResponseSaveXML(null, null, null, strErrorMessage, errorActionStep, errorSection);

            if (sopData.DisasterCategory == null)
                return GetResponseSaveXML(null, null, null, ID.Get<ErrorMessage>("noDisasterCategory").Value());

            if (sopData.SubDisasterCategory == null)
                return GetResponseSaveXML(null, null, null, ID.Get<ErrorMessage>("noSubDisasterCategory").Value());

            if (sopData.Disaster == null)
                return GetResponseSaveXML(null, null, null, ID.Get<ErrorMessage>("noDisaster").Value());

            string strXMLFileName;
            string strXML = Save(dataManager, sopData, dicActiveActionSteps, out strXMLFileName, out strErrorMessage);

            if (strXML == null || strXML.Length == 0)
                return GetResponseSaveXML(null, null, null, strErrorMessage);

            return GetResponseSaveXML(sopData, strXML, strXMLFileName, "");
        }

        private static ResponseSave GetResponseSaveXML(SOPData sopData, string strXML, string strXMLFileName, string strMessage, ActionStep errorActionStep = null, Component errorSection = null)
        {
            ResponseSave result = new ResponseSave();

            if (sopData == null || strXML == null)
            {
                result.Success = false;
            }
            else
            {
                result.Success = true;
                result.SOPData = sopData;
                result.XMLData = strXML;
                result.XMLFileName = strXMLFileName;
            }

            result.Message = strMessage;
            result.ErrorSection = errorSection;
            result.ErrorActionStep = errorActionStep;
            return result;
        }

        private static string Save(IDataManager dataManager, SOPData sopData, Dictionary<ActionStepData, bool> dicActiveActionSteps, out string strXMLFileName, out string strErrorMessage)
        {
            strErrorMessage = null;
            strXMLFileName = "";

            try
            {
                using (var stream = new MemoryStream())
                {
                    using (var writer = new XmlTextWriter(stream, new UTF8Encoding(false)))
                    {
                        writer.Formatting = Formatting.Indented;

                        writer.WriteStartDocument();
                        WriteSopData(writer, dataManager, sopData, dicActiveActionSteps, ref strXMLFileName, ref strErrorMessage);
                        writer.WriteEndDocument();
                    }

                    if (strErrorMessage != null)
                        return null;

                    return Encoding.UTF8.GetString(stream.ToArray());
                }
            }
            catch (Exception e)
            {
                strErrorMessage = e.Message;
            }

            return null;
        }

        private static bool WriteSopData(XmlTextWriter writer, IDataManager dataManager, SOPData sopData, Dictionary<ActionStepData, bool> dicActiveActionSteps, ref string strXMLFileName, ref string strErrorMessage)
        {
            try
            {
                writer.WriteStartElement("SOP");

                if (WriteHeader(writer, sopData, ref strXMLFileName, ref strErrorMessage) == false)
                    return false;
                if (WriteBody(writer, dataManager, sopData, ref strErrorMessage) == false)
                    return false;

                writer.WriteFullEndElement();
            }
            catch (Exception e)
            {
                strErrorMessage = e.Message;
                return false;
            }

            return true;
        }

        private static bool WriteBody(XmlTextWriter writer, IDataManager dataManager, SOPData sopData, ref string strErrorMessage)
        {
            writer.WriteStartElement("Body");
            writer.WriteStartElement("ActionStepList");

            int index = 1;

            foreach (ActionStepData actionStepData in sopData.ActionStepDatas)
            {
                if (actionStepData.ActionStep == null)
                    continue;

                if (WriteActionStep(writer, dataManager, actionStepData, index++, ref strErrorMessage) == false)
                    return false;
            }

            writer.WriteFullEndElement();   // ActionStepList
            writer.WriteFullEndElement();   // Body
            return true;
        }

        private static bool WriteActionStep(XmlTextWriter writer, IDataManager dataManager, ActionStepData actionStepData, int actionStepIndex, ref string strErrorMessage)
        {
            if (actionStepData.ActionStep == null)// || actionStepData.ActionStep.action_step_sn <= 0)
            {
                strErrorMessage = ID.Get<ErrorMessage>("noActionStep").Value();
                return false;
            }

            if (actionStepData.ActionStep.action_step_sn <= 0)
                actionStepData.ActionStep.action_step_sn = actionStepIndex;

            writer.WriteStartElement("ActionStep");

            AddAttribute(writer, "no", actionStepData.ActionStep.action_step_sn.ToString());
            AddElementText(writer, "StepName", actionStepData.StepName);

            writer.WriteStartElement("StepMemberList");

            int index = 1;

            foreach (StepMemberData stepMemberData in actionStepData.StepMemberDatas)
            {
                if (WriteStepMember(writer, dataManager, stepMemberData, actionStepIndex * 10 + index, ref strErrorMessage) == false)
                    return false;

                index++;
            }

            writer.WriteFullEndElement();   // StepMemberList

            writer.WriteFullEndElement();   // ActionStep
            return true;
        }

        private static bool WriteStepMember(XmlTextWriter writer, IDataManager dataManager, StepMemberData stepMemberData, int stepMemberIndex, ref string strErrorMessage)
        {
            if (stepMemberData.StepMember == null)// || stepMemberData.StepMember.step_memb_sn <= 0)
            {
                strErrorMessage = ID.Get<ErrorMessage>("noSOPDatas").Value();
                return false;
            }

            if (stepMemberData.StepMember.step_memb_sn <= 0)
                stepMemberData.StepMember.step_memb_sn = stepMemberIndex;

            writer.WriteStartElement("StepMember");

            AddAttribute(writer, "no", stepMemberData.StepMember.step_memb_sn.ToString());

            if (WriteGrid(writer, stepMemberData.GridColumnWidth, stepMemberData.GridRowHeight, ref strErrorMessage) == false)
                return false;

            // Key : 상위 4byte(Column Index), 하위 4바이트(Row Index)
            // Value : Section Number
            Dictionary<long, int> dicGridPositionSectionNumbers = new Dictionary<long, int>();

            if (WriteComponentList(writer, dataManager, stepMemberData.Sections, dicGridPositionSectionNumbers, ref strErrorMessage) == false)
                return false;

            WriteArrowList(writer, stepMemberData.Arrows, dicGridPositionSectionNumbers);

            writer.WriteFullEndElement();   // StepMember
            return true;
        }

        private static bool WriteComponentList(XmlTextWriter writer, IDataManager dataManager, List<SectionData> sectionDatas, Dictionary<long, int> dicGridPositionSectionNumbers, ref string strErrorMessage)
        {
            Dictionary<int, string> dicRegularPath = new Dictionary<int, string>();
            Dictionary<int, KeyValuePair<Temporary, string>> dicTemporaryPath = new Dictionary<int, KeyValuePair<Temporary, string>>();

            if (ReadTeamList(dataManager, dicRegularPath, dicTemporaryPath, ref strErrorMessage) == false)
                return false;

            SetSectionText(sectionDatas);
            SetSectionNumbers(sectionDatas, dicGridPositionSectionNumbers);

            writer.WriteStartElement("ComponentList");

            foreach (SectionData sectionData in sectionDatas)
            {
                if (sectionData.Component == null)
                {
                    strErrorMessage = ID.Get<ErrorMessage>("unknownComponentType").Value();
                    return false;
                }

                writer.WriteStartElement("Component");

                AddAttribute(writer, "no", sectionData.Component.compn_sn.ToString());
                AddElementText(writer, "ColumnIndex", sectionData.Component.column_no.ToString());
                AddElementText(writer, "RowIndex", sectionData.Component.row_no.ToString());
                AddElementText(writer, "Text", sectionData.Text);

                if (WriteComponentProperty(writer, dataManager, sectionData, dicRegularPath, dicTemporaryPath, ref strErrorMessage) == false)
                    return false;

                writer.WriteFullEndElement();   // Component
            }

            writer.WriteFullEndElement();   // ComponentList
            return true;
        }

        private static void SetSectionText(List<SectionData> sectionDatas)
        {
            foreach (SectionData sectionData in sectionDatas)
            {
                if (sectionData.EndpointData != null)
                {
                    if (sectionData.EndpointData.Endpoint != null)
                        sectionData.Endpoint = sectionData.EndpointData.Endpoint;
                }
                else if (sectionData.CommentData != null)
                {
                    if (sectionData.CommentData.Comment != null)
                        sectionData.Comment = sectionData.CommentData.Comment;
                }
                else if (sectionData.DecisionData != null)
                {
                    if (sectionData.DecisionData.Decision != null)
                        sectionData.Decision = sectionData.DecisionData.Decision;
                }
                else if (sectionData.ProcessData != null)
                {
                    if (sectionData.ProcessData.Process != null)
                        sectionData.Process = sectionData.ProcessData.Process;
                }
                else if (sectionData.TransmissionData != null)
                {
                    if (sectionData.TransmissionData.Transmission != null)
                        sectionData.Transmission = sectionData.TransmissionData.Transmission;
                }
            }
        }

        // dicGridPositionSectionNumbers : Grid 위치를 사용하여 Section 번호를 검색
        // Key : 상위 4byte(Column Index), 하위 4바이트(Row Index)
        // Value : Section Number
        private static void SetSectionNumbers(List<SectionData> sectionDatas, Dictionary<long, int> dicGridPositionSectionNumbers)
        {
            int componentNo = 1;

            foreach (SectionData sectionData in sectionDatas)
            {
                if (sectionData.Component == null)
                    continue;

                if (sectionData.Comment != null)
                    sectionData.Comment.compn_sn = componentNo;
                else if (sectionData.Decision != null)
                    sectionData.Decision.compn_sn = componentNo;
                else if (sectionData.Process != null)
                    sectionData.Process.compn_sn = componentNo;
                else if (sectionData.Endpoint != null)
                    sectionData.Endpoint.compn_sn = componentNo;
                else if (sectionData.Transmission != null)
                    sectionData.Transmission.compn_sn = componentNo;
                else
                    continue;

                long key = (((long)sectionData.Component.column_no) << 32) | (long)sectionData.Component.row_no;
                dicGridPositionSectionNumbers[key] = componentNo;

                sectionData.Component.compn_sn = componentNo++;
            }
        }

        private static void WriteArrowList(XmlTextWriter writer, List<ArrowData> arrowDatas, Dictionary<long, int> dicGridPositionSectionNumbers)
        {
            writer.WriteStartElement("ArrowList");

            foreach (ArrowData arrowData in arrowDatas)
            {
                int beginComponentNo = GetComponentNumberFromGridPosition(arrowData.BeginColumnIndex, arrowData.BeginRowIndex, dicGridPositionSectionNumbers);
                int endComponentNo = GetComponentNumberFromGridPosition(arrowData.EndColumnIndex, arrowData.EndRowIndex, dicGridPositionSectionNumbers);

                if (beginComponentNo > 0 && endComponentNo > 0)
                {
                    writer.WriteStartElement("Arrow");

                    if (arrowData.Text != null && arrowData.Text.Length > 0)
                        AddElementText(writer, "Text", arrowData.Text);

                    AddElementText(writer, "BeginComponentNo", beginComponentNo.ToString());
                    AddElementText(writer, "BeginComponentPosition", arrowData.BeginPosition.ToString());
                    AddElementText(writer, "EndComponentNo", endComponentNo.ToString());
                    AddElementText(writer, "EndComponentPosition", arrowData.EndPosition.ToString());

                    writer.WriteFullEndElement();   // Arrow
                }
            }

            writer.WriteFullEndElement();   // ArrowList
        }

        private static int GetComponentNumberFromGridPosition(int columnIndex, int rowIndex, Dictionary<long, int> dicGridPositionSectionNumbers)
        {
            long key = (((long)columnIndex) << 32) | (long)rowIndex;

            int componentNo;

            if (dicGridPositionSectionNumbers.TryGetValue(key, out componentNo))
                return componentNo;

            return -1;
        }

        private static bool ReadTeamList(IDataManager dataManager, Dictionary<int, string> dicRegularPath, Dictionary<int, KeyValuePair<Temporary, string>> dicTemporaryPath, ref string strErrorMessage)
        {
            IEnumerable<Regular> regulars = dataManager.GetSelect().Select<Regular>(null, out strErrorMessage);

            if (regulars == null)
                return false;

            IEnumerable<Temporary> temporaries = dataManager.GetSelect().Select<Temporary>(null, out strErrorMessage);

            if (temporaries == null)
                return false;

            Dictionary<int, Regular> dicRegulars = new Dictionary<int, Regular>();
            Dictionary<int, Temporary> dicTemporaries = new Dictionary<int, Temporary>();

            foreach (Regular regular in regulars)
            {
                dicRegulars[regular.rgl_sn] = regular;
            }

            foreach (Temporary temporary in temporaries)
            {
                dicTemporaries[temporary.tmpr_sn] = temporary;
            }

            SetTeamPath(dicRegulars, dicRegularPath, TeamPathDelimeter);
            SetTeamPath(dicTemporaries, dicTemporaryPath, TeamPathDelimeter);
            return true;
        }

        private static void SetTeamPath(Dictionary<int, Temporary> dicTemporaries, Dictionary<int, KeyValuePair<Temporary, string>> dicTemporaryPath, string strDelimeter)
        {
            foreach (KeyValuePair<int, Temporary> pair in dicTemporaries)
            {
                string strTeamPath = GetTeamPath(dicTemporaries, pair.Value, strDelimeter);
                dicTemporaryPath[pair.Value.tmpr_sn] = new KeyValuePair<Temporary, string>(pair.Value, strTeamPath);
            }
        }

        private static string GetTeamPath(Dictionary<int, Temporary> dicTemporaries, Temporary temporary, string strDelimeter)
        {
            string strPath = strPath = temporary.team_name;
            Temporary parent = GetParent(dicTemporaries, temporary);

            while (parent != null)
            {
                strPath = parent.team_name + strDelimeter + strPath;
                parent = GetParent(dicTemporaries, parent);
            }

            return strPath;
        }

        private static Temporary GetParent(Dictionary<int, Temporary> dicTemporaries, Temporary temporary)
        {
            if (temporary.parnts_sn == null)
                return null;

            Temporary parent;

            if (dicTemporaries.TryGetValue((int)temporary.parnts_sn, out parent))
                return parent;

            return null;
        }

        private static void SetTeamPath(Dictionary<int, Regular> dicRegulars, Dictionary<int, string> dicRegularPath, string strDelimeter)
        {
            foreach (KeyValuePair<int, Regular> pair in dicRegulars)
            {
                string strTeamPath = GetTeamPath(dicRegulars, pair.Value, strDelimeter);
                dicRegularPath[pair.Value.rgl_sn] = strTeamPath;
            }
        }

        private static string GetTeamPath(Dictionary<int, Regular> dicRegulars, Regular regular, string strDelimeter)
        {
            string strPath = strPath = regular.team_name;
            Regular parent = GetParent(dicRegulars, regular);

            while (parent != null)
            {
                strPath = parent.team_name + strDelimeter + strPath;
                parent = GetParent(dicRegulars, parent);
            }

            return strPath;
        }

        private static Regular GetParent(Dictionary<int, Regular> dicRegulars, Regular regular)
        {
            if (regular.parnts_sn == null)
                return null;

            Regular parent;

            if (dicRegulars.TryGetValue((int)regular.parnts_sn, out parent))
                return parent;

            return null;
        }

        private static bool WriteComponentProperty(XmlTextWriter writer, IDataManager dataManager, SectionData sectionData, Dictionary<int, string> dicRegularPath, Dictionary<int, KeyValuePair<Temporary, string>> dicTemporaryPath, ref string strErrorMessage)
        {
            if (sectionData.Component.compn_code == Sop.ComponentType.Comment || sectionData.Component.compn_code == Sop.ComponentType.Comment - (int)CodeType.ComponentType)
                return WriteCommentProperty(writer, (CommentData)sectionData.Component, ref strErrorMessage);
            else if (sectionData.Component.compn_code == Sop.ComponentType.Decision || sectionData.Component.compn_code == Sop.ComponentType.Decision - (int)CodeType.ComponentType)
                return WriteDecisionProperty(writer, (DecisionData)sectionData.Component, ref strErrorMessage);
            else if (sectionData.Component.compn_code == Sop.ComponentType.Endpoint || sectionData.Component.compn_code == Sop.ComponentType.Endpoint - (int)CodeType.ComponentType)
                return WriteEndpointProperty(writer, (EndpointData)sectionData.Component, ref strErrorMessage);
            else if (sectionData.Component.compn_code == Sop.ComponentType.Process || sectionData.Component.compn_code == Sop.ComponentType.Process - (int)CodeType.ComponentType)
                return WriteProcessProperty(writer, (ProcessData)sectionData.Component, dicRegularPath, dicTemporaryPath, ref strErrorMessage);
            else if (sectionData.Component.compn_code == Sop.ComponentType.Transmission || sectionData.Component.compn_code == Sop.ComponentType.Transmission - (int)CodeType.ComponentType)
                return WriteTransmissionProperty(writer, (TransmissionData)sectionData.Component, dicRegularPath, dicTemporaryPath, ref strErrorMessage);

            strErrorMessage = ID.Get<ErrorMessage>("unknownComponentType").Value();
            return false;
        }

        private static bool WriteTransmissionProperty(XmlTextWriter writer, TransmissionData transmission, Dictionary<int, string> dicRegularPath, Dictionary<int, KeyValuePair<Temporary, string>> dicTemporaryPath, ref string strErrorMessage)
        {
            if (transmission == null || transmission.Transmission == null)
            {
                strErrorMessage = ID.Get<ErrorMessage>("emptyTransmission").Value();
                return false;
            }

            writer.WriteStartElement("Property");
            AddAttribute(writer, "type", (Sop.ComponentType.Transmission - (int)CodeType.ComponentType).ToString());

            AddElementText(writer, "UseSMS", transmission.Transmission.sms_yn ? "true" : "false");
            AddElementText(writer, "UseBroadcast", transmission.Transmission.brdcst_yn ? "true" : "false");
            AddElementText(writer, "UseEmail", transmission.Transmission.email_yn ? "true" : "false");

            if (transmission.Transmission.mssage != null && transmission.Transmission.mssage.Length > 0)
                AddElementText(writer, "Message", transmission.Transmission.mssage);

            WriteTeamList(writer, transmission, dicRegularPath, dicTemporaryPath);

            if (transmission.Transmission.leadr_prvuse_yn != null)
                AddElementText(writer, "OnlyTeamLeader", (bool)transmission.Transmission.leadr_prvuse_yn ? "true" : "false");

            AddElementText(writer, "AutoRun", transmission.Transmission.atmc_execut_yn ? "true" : "false");

            if (transmission.Transmission.siren_yn != null)
                AddElementText(writer, "UseSiren", (bool)transmission.Transmission.siren_yn ? "true" : "false");

            writer.WriteFullEndElement();   // Property

            return true;
        }

        private static bool WriteProcessProperty(XmlTextWriter writer, ProcessData process, Dictionary<int, string> dicRegularPath, Dictionary<int, KeyValuePair<Temporary, string>> dicTemporaryPath, ref string strErrorMessage)
        {
            if (process == null || process.Process == null)
            {
                strErrorMessage = ID.Get<ErrorMessage>("emptyProcess").Value();
                return false;
            }

            writer.WriteStartElement("Property");
            AddAttribute(writer, "type", (Sop.ComponentType.Process - (int)CodeType.ComponentType).ToString());

            WriteTeamList(writer, process, dicRegularPath, dicTemporaryPath);

            if (process.Process.leadr_prvuse_yn != null)
                AddElementText(writer, "OnlyTeamLeader", (bool)process.Process.leadr_prvuse_yn ? "true" : "false");

            AddElementText(writer, "AutoRun", process.Process.atmc_execut_yn ? "true" : "false");

            WriteProcessMissions(writer, process);

            writer.WriteFullEndElement();   // Property

            return true;
        }

        private static void WriteProcessMissions(XmlTextWriter writer, ProcessData process)
        {
            writer.WriteStartElement("MissionList");

            if (process.Missions != null)
            {
                foreach (ProcessMission mission in process.Missions)
                {
                    AddElementText(writer, "Mission", mission.misn_contents);
                }
            }

            writer.WriteFullEndElement();   // MissionList
        }

        private static void WriteTeamList(XmlTextWriter writer, TransmissionData transmission, Dictionary<int, string> dicRegularPath, Dictionary<int, KeyValuePair<Temporary, string>> dicTemporaryPath)
        {
            List<KeyValuePair<int, string>> teamPathList = GetTeamList(transmission, dicRegularPath, dicTemporaryPath);

            if (teamPathList.Count > 0)
            {
                writer.WriteStartElement("TeamList");

                foreach (KeyValuePair<int, string> pair in teamPathList)
                {
                    writer.WriteStartElement("Team");
                    AddAttribute(writer, "type", pair.Key.ToString());
                    AddAttribute(writer, "name", pair.Value.ToString());
                    writer.WriteFullEndElement();   // Team
                }

                writer.WriteFullEndElement();   // TeamList
            }
        }

        private static List<KeyValuePair<int, string>> GetTeamList(TransmissionData transmission, Dictionary<int, string> dicRegularPath, Dictionary<int, KeyValuePair<Temporary, string>> dicTemporaryPath)
        {
            List<KeyValuePair<int, string>> teamPathList = new List<KeyValuePair<int, string>>();

            foreach (TransmissionRegular regular in transmission.Regulars)
            {
                string strRegularPath;

                if (dicRegularPath.TryGetValue(regular.rgl_sn, out strRegularPath))
                {
                    teamPathList.Add(new KeyValuePair<int, string>((int)Receiver.TeamDataType.RegularTeam, strRegularPath));
                }
            }

            foreach (TransmissionTemporaryEx temporary in transmission.Temporaries)
            {
                KeyValuePair<Temporary, string> pair;

                if (dicTemporaryPath.TryGetValue(temporary.tmpr_sn, out pair))
                {
                    temporary.nor_yn = pair.Key.nor_yn;
                    teamPathList.Add(new KeyValuePair<int, string>(temporary.nor_yn == null || (bool)temporary.nor_yn ? (int)Receiver.TeamDataType.TemporaryNormalTeam : (int)Receiver.TeamDataType.TemporaryEmergencyTeam, pair.Value));
                }
            }

            return teamPathList;
        }

        private static void WriteTeamList(XmlTextWriter writer, ProcessData process, Dictionary<int, string> dicRegularPath, Dictionary<int, KeyValuePair<Temporary, string>> dicTemporaryPath)
        {
            List<KeyValuePair<int, string>> teamPathList = GetTeamList(process, dicRegularPath, dicTemporaryPath);

            if (teamPathList.Count > 0)
            {
                writer.WriteStartElement("TeamList");
                
                foreach (KeyValuePair<int, string> pair in teamPathList)
                {
                    writer.WriteStartElement("Team");
                    AddAttribute(writer, "type", pair.Key.ToString());
                    AddAttribute(writer, "name", pair.Value.ToString());
                    writer.WriteFullEndElement();   // Team
                }

                writer.WriteFullEndElement();   // TeamList
            }
        }


        private static List<KeyValuePair<int, string>> GetTeamList(ProcessData process, Dictionary<int, string> dicRegularPath, Dictionary<int, KeyValuePair<Temporary, string>> dicTemporaryPath)
        {
            List<KeyValuePair<int, string>> teamPathList = new List<KeyValuePair<int, string>>();
            
            foreach (ProcessRegular regular in process.Regulars)
            {
                string strRegularPath;

                if (dicRegularPath.TryGetValue(regular.rgl_sn, out strRegularPath))
                {
                    teamPathList.Add(new KeyValuePair<int, string>((int)Receiver.TeamDataType.RegularTeam, strRegularPath));
                }
            }

            foreach (ProcessTemporaryEx temporary in process.Temporaries)
            {
                KeyValuePair<Temporary, string> pair;

                if (dicTemporaryPath.TryGetValue(temporary.tmpr_sn, out pair))
                {
                    temporary.nor_yn = pair.Key.nor_yn;
                    teamPathList.Add(new KeyValuePair<int, string>(temporary.nor_yn == null || (bool)temporary.nor_yn ? (int)Receiver.TeamDataType.TemporaryNormalTeam : (int)Receiver.TeamDataType.TemporaryEmergencyTeam, pair.Value));
                }
            }

            return teamPathList;
        }

        private static bool WriteEndpointProperty(XmlTextWriter writer, EndpointData endpoint, ref string strErrorMessage)
        {
            if (endpoint == null || endpoint.Endpoint == null)
            {
                strErrorMessage = ID.Get<ErrorMessage>("emptyEndpoint").Value();
                return false;
            }

            writer.WriteStartElement("Property");
            AddAttribute(writer, "type", (Sop.ComponentType.Endpoint - (int)CodeType.ComponentType).ToString());
            AddElementText(writer, "IsBegin", endpoint.Endpoint.begin_yn ? "true" : "false");
            writer.WriteFullEndElement();   // Property

            return true;
        }

        private static bool WriteDecisionProperty(XmlTextWriter writer, DecisionData decision, ref string strErrorMessage)
        {
            if (decision == null || decision.Decision == null)
            {
                strErrorMessage = ID.Get<ErrorMessage>("emptyDecision").Value();
                return false;
            }

            writer.WriteStartElement("Property");
            AddAttribute(writer, "type", (Sop.ComponentType.Decision - (int)CodeType.ComponentType).ToString());

            if (decision.Decision.atmc_execut_script != null && decision.Decision.atmc_execut_script.Length > 0)
            {
                AddElementText(writer, "AutoRunScript", decision.Decision.atmc_execut_script);

                if (decision.AutoScriptVariables != null)
                {
                    string strVariables = "";

                    foreach (var variable in decision.AutoScriptVariables)
                    {
                        string strVariable = variable.vriabl_name + "_" + variable.dcs_vriabl_code.ToString();

                        if (strVariables.Length == 0)
                            strVariables = strVariable;
                        else
                            strVariables += "," + strVariable;
                    }

                    if (strVariables.Length > 0)
                        AddElementText(writer, "AutoRunScriptVariableTypes", strVariables);
                }
            }

            writer.WriteFullEndElement();   // Property

            return true;
        }

        private static bool WriteCommentProperty(XmlTextWriter writer, CommentData comment, ref string strErrorMessage)
        {
            if (comment == null)
            {
                strErrorMessage = ID.Get<ErrorMessage>("emptyComment").Value();
                return false;
            }

            writer.WriteStartElement("Property");
            AddAttribute(writer, "type", (Sop.ComponentType.Comment - (int)CodeType.ComponentType).ToString());
            writer.WriteFullEndElement();   // Property

            return true;
        }

        private static bool WriteGrid(XmlTextWriter writer, List<int> gridColumnWidth, List<int> gridRowHeight, ref string strErrorMessage)
        {
            if (gridColumnWidth == null || gridRowHeight == null || gridColumnWidth.Count == 0 || gridRowHeight.Count == 0)
            {
                strErrorMessage = ID.Get<ErrorMessage>("failSaveGrid").Value();
                return false;
            }

            writer.WriteStartElement("Grid");

            writer.WriteStartElement("Columns");

            int columnCount = gridColumnWidth.Count;

            for (int i=0;i<columnCount;i++)
            {
                writer.WriteStartElement("Column");

                AddAttribute(writer, "index", i.ToString());
                AddAttribute(writer, "width", gridColumnWidth[i].ToString());

                writer.WriteFullEndElement();   // Column
            }

            writer.WriteFullEndElement();   // Columns

            writer.WriteStartElement("Rows");

            int rowCount = gridRowHeight.Count;

            for (int i = 0; i < rowCount; i++)
            {
                writer.WriteStartElement("Row");

                AddAttribute(writer, "index", i.ToString());
                AddAttribute(writer, "height", gridRowHeight[i].ToString());

                writer.WriteFullEndElement();   // Row
            }

            writer.WriteFullEndElement();   // Rows

            writer.WriteFullEndElement();   // Grid
            return true;
        }

        private static void AddElementText(XmlTextWriter writer, string strElement, string strText)
        {
            writer.WriteStartElement(strElement);
            writer.WriteString(strText);
            writer.WriteFullEndElement();
        }

        private static void AddAttribute(XmlTextWriter writer, string strAttrName, string strAttrValue)
        {
            writer.WriteStartAttribute(strAttrName);
            writer.WriteString(strAttrValue);
            writer.WriteEndAttribute();
        }

        private static bool WriteHeader(XmlTextWriter writer, SOPData sopData, ref string strXMLFileName, ref string strErrorMessage)
        {
            writer.WriteStartElement("Header");

            writer.WriteStartElement("XMLVersion");
            writer.WriteString(XMLVersion);
            writer.WriteFullEndElement();

            if (sopData.DisasterCategory == null || sopData.DisasterCategory.lclas_name.Length == 0)
            {
                strErrorMessage = ID.Get<ErrorMessage>("noDisasterCategory").Value();
                return false;
            }

            writer.WriteStartElement("Category");
            writer.WriteString(sopData.DisasterCategory.lclas_name);
            writer.WriteFullEndElement();

            if (sopData.SubDisasterCategory == null || sopData.SubDisasterCategory.mclas_name.Length == 0)
            {
                strErrorMessage = ID.Get<ErrorMessage>("noSubDisasterCategory").Value();
                return false;
            }

            writer.WriteStartElement("SubCategory");
            writer.WriteString(sopData.SubDisasterCategory.mclas_name);
            writer.WriteFullEndElement();

            if (sopData.Disaster == null || sopData.Disaster.sclas_name.Length == 0)
            {
                strErrorMessage = ID.Get<ErrorMessage>("noDisaster").Value();
                return false;
            }

            writer.WriteStartElement("Disaster");
            writer.WriteString(sopData.Disaster.sclas_name);
            writer.WriteFullEndElement();

            strXMLFileName = sopData.Disaster.sclas_name + ".sop";

            if (sopData.Version == null)
            {
                strErrorMessage = ID.Get<ErrorMessage>("failSaveVersion").Value();
                return false;
            }

            writer.WriteStartElement("Normal");
            writer.WriteString(sopData.Disaster.nor_yn ? "1" : "0");
            writer.WriteFullEndElement();

            writer.WriteStartElement("SOPVersion");

            if (sopData.Version.descp != null)
            {
                string strDescription = sopData.Version.descp.Trim();

                if (strDescription.Length > 0)
                {
                    writer.WriteStartAttribute("description");
                    writer.WriteString(strDescription);
                    writer.WriteEndAttribute();
                }
            }
            writer.WriteString(sopData.Version.name);
            writer.WriteFullEndElement();

            writer.WriteFullEndElement();
            return true;
        }

        public static ResponseOpen Open(IDataManager dataManager, string strXML, int siteNo)
        {
            XElement xml = XElement.Parse(strXML);

            XElement xSOP = xml.Name == "SOP" ? xml : null;

            if (xSOP == null)
                return new ResponseOpen(false, ID.Get<ErrorMessage>("xml").Value("noSOPTagInXML"));

            return ReadSOP(xSOP, dataManager, siteNo);
        }

        private static ResponseOpen ReadSOP(XElement xSOP, IDataManager dataManager, int siteNo)
        {
            XElement xHeader = FindElement(xSOP, "Header");
            XElement xBody = FindElement(xSOP, "Body");

            if (xHeader == null)
                return new ResponseOpen(false, ID.Get<ErrorMessage>("xml").Value("noHeaderTagInXML"));

            if (xBody == null)
                return new ResponseOpen(false, ID.Get<ErrorMessage>("xml").Value("noBodyTagInXML"));

            LargeClass dc;
            MiddleClass sdc;
            SmallClass disaster;
            Model.Sop.Category.Version version;

            string strErrorMessage;

            if (ReadHeader(xHeader, dataManager, siteNo, out dc, out sdc, out disaster, out version, out strErrorMessage) == false)
                return new ResponseOpen(false, strErrorMessage);

            List<ActionStepData> actionStepDatas = ReadBody(xBody, dataManager, disaster.sclas_sn, dc.site_sn, out strErrorMessage);

            if (actionStepDatas == null)
                return new ResponseOpen(false, strErrorMessage);

            SOPData sopData = new SOPData();

            sopData.DisasterCategory = dc;
            sopData.SubDisasterCategory = sdc;
            sopData.Disaster = disaster;
            sopData.ActionStepDatas.AddRange(actionStepDatas);
            sopData.Version = version;

            // 빠진 단계가 있으면 채워넣는다.
            AddEmptyActionStepDatas(sopData, dataManager);

            ResponseOpen response = new ResponseOpen(true, "");
            response.SOPData = sopData;
            return response;
        }

        private static void AddEmptyActionStepDatas(SOPData sopData, IDataManager dataManager)
        {
            if (sopData.ActionStepDatas.Count >= 4)
                return;

            int siteNo = 1;

            if (sopData.Version != null)
                siteNo = sopData.Version.site_sn;

            LoadManager loadManager = new LoadManager(dataManager);
            ResponseActionStepDatas response = loadManager.GetDefaultActionStepDatas(siteNo);

            if (response.Success == false)
                return;

            for (int i=0;i<response.ActionStepDatas.Count;i++)
            {
                ActionStepData actionStepData = response.ActionStepDatas[i];

                if (GetActionStepData(actionStepData.StepName, sopData.ActionStepDatas) == null)
                    sopData.ActionStepDatas.Insert(i, actionStepData);
            }
        }

        private static ActionStepData GetActionStepData(string strStepName, List<ActionStepData> actionStepDatas)
        {
            foreach (ActionStepData actionStepData in actionStepDatas)
            {
                if (actionStepData.StepName == strStepName)
                    return actionStepData;
            }

            return null;
        }

        private static List<ActionStepData> ReadBody(XElement xHeader, IDataManager dataManager, int sclas_sn, int nSiteNo, out string strErrorMessage)
        {
            strErrorMessage = null;

            XElement xActionStepList = FindElement(xHeader, "ActionStepList");

            if (xActionStepList == null)
            {
                strErrorMessage = ID.Get<ErrorMessage>("xml").Value("noActionStepListTagInBody");
                return null;
            }

            Dictionary<string, int> dicRegularPath = new Dictionary<string, int>();
            Dictionary<string, int> dicTemporaryNormalPath = new Dictionary<string, int>();
            Dictionary<string, int> dicTemporaryEmergencyPath = new Dictionary<string, int>();

            if (ReadTeamList(dataManager, dicRegularPath, dicTemporaryNormalPath, dicTemporaryEmergencyPath, ref strErrorMessage) == false)
                return null;

            List<ActionStepData> actionStepDatas = new List<ActionStepData>();

            foreach (XElement element in xActionStepList.Elements())
            {
                if (element.Name == "ActionStep")
                {
                    ActionStepData actionStepData = ReadActionStep(element, sclas_sn, nSiteNo, dicRegularPath, dicTemporaryNormalPath, dicTemporaryEmergencyPath, out strErrorMessage);

                    if (actionStepData == null)
                        return null;
                    else
                    {
                        if (IsValidActionStep(actionStepData, out strErrorMessage))
                            actionStepDatas.Add(actionStepData);
                        else
                            return null;
                    }
                }
            }

            if (actionStepDatas.Count == 0)
            {
                strErrorMessage = ID.Get<ErrorMessage>("xml").Value("noValidActionStep");
                return null;
            }

            return actionStepDatas;
        }

        private static bool IsValidActionStep(ActionStepData actionStepData, out string strErrorMessage)
        {
            List<ActionStepData> actionStepDatas = new List<ActionStepData>();
            actionStepDatas.Add(actionStepData);

            Dictionary<ActionStepData, bool> dicActiveActionSteps = new Dictionary<ActionStepData, bool>();
            dicActiveActionSteps[actionStepData] = true;

            ActionStep errorActionStep;
            Component errorComponent;

            return ValidationChecker.CheckSOPValidation(actionStepDatas, dicActiveActionSteps, out errorActionStep, out errorComponent, out strErrorMessage);
        }

        private static bool ReadTeamList(IDataManager dataManager, Dictionary<string, int> dicRegularPath, Dictionary<string, int> dicTemporaryNormalPath, Dictionary<string, int> dicTemporaryEmergencyPath, ref string strErrorMessage)
        {
            IEnumerable<Regular> regulars = dataManager.GetSelect().Select<Regular>(null, out strErrorMessage);

            if (regulars == null)
                return false;

            IEnumerable<Temporary> temporaries = dataManager.GetSelect().Select<Temporary>(null, out strErrorMessage);

            if (temporaries == null)
                return false;

            Dictionary<int, Regular> dicRegulars = new Dictionary<int, Regular>();
            Dictionary<int, Temporary> dicTemporaries = new Dictionary<int, Temporary>();

            foreach (Regular regular in regulars)
            {
                dicRegulars[regular.rgl_sn] = regular;
            }

            foreach (Temporary temporary in temporaries)
            {
                dicTemporaries[temporary.tmpr_sn] = temporary;
            }

            SetTeamPath(dicRegulars, dicRegularPath, TeamPathDelimeter);
            SetTeamPath(dicTemporaries, dicTemporaryNormalPath, TeamPathDelimeter);
            SetTeamPath(dicTemporaries, dicTemporaryEmergencyPath, TeamPathDelimeter);
            return true;
        }

        private static void SetTeamPath(Dictionary<int, Regular> dicRegulars, Dictionary<string, int> dicRegularPath, string strDelimeter)
        {
            foreach (KeyValuePair<int, Regular> pair in dicRegulars)
            {
                string strTeamPath = GetTeamPath(dicRegulars, pair.Value, strDelimeter);
                dicRegularPath[strTeamPath] = pair.Value.rgl_sn;
            }
        }

        private static void SetTeamPath(Dictionary<int, Temporary> dicTemporaries, Dictionary<string, int> dicTemporaryPath, string strDelimeter)
        {
            foreach (KeyValuePair<int, Temporary> pair in dicTemporaries)
            {
                string strTeamPath = GetTeamPath(dicTemporaries, pair.Value, strDelimeter);
                dicTemporaryPath[strTeamPath] = pair.Value.tmpr_sn;
            }
        }

        private static ActionStepData ReadActionStep(XElement xActionStep, int sclas_sn, int nSiteNo, Dictionary<string, int> dicRegularPath, Dictionary<string, int> dicTemporaryNormalPath, Dictionary<string, int> dicTemporaryEmergencyPath, out string strErrorMessage)
        {
            strErrorMessage = null;

            ActionStepData actionStepData = new ActionStepData();
            ActionStep actionStep = new ActionStep();
            actionStepData.ActionStep = actionStep;
            actionStep.sclas_sn = sclas_sn;
            actionStep.action_step_sn = -1;

            foreach (XElement element in xActionStep.Elements())
            {
                if (element.Name == "StepName")
                {
                    actionStep.action_step_name = element.Value;
                    actionStepData.StepName = element.Value;
                }
                else if (element.Name == "UserDefinedConfigID")
                {
                    // 나중에 구현
                }
                else if (element.Name == "StepMemberList")
                {
                    if (ReadStepMemberList(element, actionStepData.StepMemberDatas, actionStep.action_step_sn, nSiteNo, dicRegularPath, dicTemporaryNormalPath, dicTemporaryEmergencyPath, out strErrorMessage) == false)
                        return null;
                }

                XAttribute attrNo = FindAttribute(element, "no");

                if (attrNo != null)
                {
                    int? actionStepNo = GetInt(attrNo.Value);

                    if (actionStepNo != null)
                        actionStep.action_step_sn = (int)actionStepNo;
                }
            }

            return actionStepData;
        }

        private static bool ReadStepMemberList(XElement xStepMemberList, List<StepMemberData> stepMemberDatas, int action_step_sn, int nSiteNo, Dictionary<string, int> dicRegularPath, Dictionary<string, int> dicTemporaryNormalPath, Dictionary<string, int> dicTemporaryEmergencyPath, out string strErrorMessage)
        {
            strErrorMessage = null;

            foreach (XElement element in xStepMemberList.Elements())
            {
                if (element.Name == "StepMember")
                {
                    StepMemberData stepMemberData = ReadStepMember(element, action_step_sn, nSiteNo, dicRegularPath, dicTemporaryNormalPath, dicTemporaryEmergencyPath, out strErrorMessage);

                    if (stepMemberData == null)
                        return false;
                    else
                    {
                        if (stepMemberData.GridColumnWidth.Count > 0 &&
                            stepMemberData.GridRowHeight.Count > 0 &&
                            stepMemberData.Sections.Count > 0)
                            stepMemberDatas.Add(stepMemberData);
                    }
                }
            }

            return true;
        }

        private static StepMemberData ReadStepMember(XElement xStepMember, int action_step_sn, int nSiteNo, Dictionary<string, int> dicRegularPath, Dictionary<string, int> dicTemporaryNormalPath, Dictionary<string, int> dicTemporaryEmergencyPath, out string strErrorMessage)
        {
            strErrorMessage = null;

            StepMemberData stepMemberData = new StepMemberData();
            stepMemberData.StepMember = new StepMember();
            stepMemberData.StepMember.action_step_sn = action_step_sn;
            stepMemberData.StepMember.step_memb_sn = -1;

            /*foreach (XAttribute attr in xStepMember.Attributes())
            {
                if (attr.Name == "no")
                {
                    int? stepMemberNo = GetInt(attr.Value);

                    if (stepMemberNo != null)
                        stepMemberData.StepMember.step_memb_sn = (int)stepMemberNo;
                }
            }*/

            Dictionary<int, SectionData> dicSections = new Dictionary<int, SectionData>();

            foreach (XElement element in xStepMember.Elements())
            {
                if (element.Name == "Grid")
                {
                    if (ReadGrid(element, stepMemberData.GridColumnWidth, stepMemberData.GridRowHeight, out strErrorMessage) == false)
                        return null;
                }
                else if (element.Name == "ComponentList")
                {
                    if (ReadSections(element, stepMemberData.StepMember.step_memb_sn, stepMemberData.Sections, dicSections, stepMemberData.GridColumnWidth, stepMemberData.GridRowHeight, dicRegularPath, dicTemporaryNormalPath, dicTemporaryEmergencyPath, out strErrorMessage) == false)
                        return null;
                }
                else if (element.Name == "ArrowList")
                {
                    if (ReadArrows(element, stepMemberData.StepMember.step_memb_sn, stepMemberData.Arrows, dicSections, out strErrorMessage) == false)
                        return null;
                }
            }

            return stepMemberData;
        }

        // dicSectionData.Key : SectionData No
        private static bool ReadArrows(XElement xSections, int step_memb_sn, List<ArrowData> arrowDatas, Dictionary<int, SectionData> dicSections, out string strErrorMessage)
        {
            strErrorMessage = null;

            foreach (XElement element in xSections.Elements())
            {
                if (element.Name == "Arrow")
                {
                    ArrowData arrowData = ReadArrow(element, dicSections, out strErrorMessage);

                    if (arrowData == null)
                        return false;
                    else
                    {
                        arrowData.Arrow.step_memb_sn = step_memb_sn;
                        arrowDatas.Add(arrowData);
                    }
                }
            }

            return true;
        }

        private static ArrowData ReadArrow(XElement xSections, Dictionary<int, SectionData> dicSections, out string strErrorMessage)
        {
            strErrorMessage = null;

            ArrowData arrowData = new ArrowData();
            arrowData.Arrow = new Arrow();

            bool readBeginComponentNo = false, readEndComponentNo = false;
            bool readBeginPosition = false, readEndPosition = false;

            foreach (XElement element in xSections.Elements())
            {
                if (element.Name == "BeginComponentNo" || element.Name == "EndComponentNo")
                {
                    bool isBegin = element.Name == "BeginComponentNo";

                    int no;

                    if (int.TryParse(element.Value, out no))
                    {
                        SectionData sectionData;

                        if (dicSections.TryGetValue(no, out sectionData))
                        {
                            if (isBegin)
                            {
                                arrowData.Arrow.begin_compn_sn = sectionData.Component.compn_sn;
                                arrowData.BeginColumnIndex = sectionData.Component.column_no;
                                arrowData.BeginRowIndex = sectionData.Component.row_no;
                                readBeginComponentNo = true;
                            }
                            else
                            {
                                arrowData.Arrow.end_compn_sn = sectionData.Component.compn_sn;
                                arrowData.EndColumnIndex = sectionData.Component.column_no;
                                arrowData.EndRowIndex = sectionData.Component.row_no;
                                readEndComponentNo = true;
                            }
                        }
                    }
                }
                else if (element.Name == "BeginComponentPosition" || element.Name == "EndComponentPosition")
                {
                    bool isBegin = element.Name == "BeginComponentPosition";

                    int pos;

                    if (int.TryParse(element.Value, out pos))
                    {
                        if (isBegin)
                        {
                            arrowData.Arrow.begin_arrw_lc_code = pos;
                            arrowData.BeginPosition = pos;
                            readBeginPosition = true;
                        }
                        else
                        {
                            arrowData.Arrow.end_arrw_lc_code = pos;
                            arrowData.EndPosition = pos;
                            readEndPosition = true;
                        }
                    }
                }
            }

            if (readBeginComponentNo == false)
            {
                strErrorMessage = ID.Get<ErrorMessage>("xml").Value("noBeginComponentNoInArrow");
                return null;
            }

            if (readEndComponentNo == false)
            {
                strErrorMessage = ID.Get<ErrorMessage>("xml").Value("noEndComponentNoInArrow");
                return null;
            }

            if (readBeginPosition == false)
            {
                strErrorMessage = ID.Get<ErrorMessage>("xml").Value("noBeginComponentPositionInArrow");
                return null;
            }

            if (readEndPosition == false)
            {
                strErrorMessage = ID.Get<ErrorMessage>("xml").Value("noEndComponentPositionInArrow");
                return null;
            }

            return arrowData;
        }

        // dicSectionData.Key : SectionData No
        private static bool ReadSections(XElement xSections, int step_memb_sn, List<SectionData> sectionDatas, Dictionary<int, SectionData> dicSections, List<int> gridColumnWidth, List<int> gridRowHeight, Dictionary<string, int> dicRegularPath, Dictionary<string, int> dicTemporaryNormalPath, Dictionary<string, int> dicTemporaryEmergencyPath, out string strErrorMessage)
        {
            strErrorMessage = null;

            foreach (XElement element in xSections.Elements())
            {
                if (element.Name == "Component")
                {
                    SectionData sectionData = ReadSection(element, gridColumnWidth, gridRowHeight, dicRegularPath, dicTemporaryNormalPath, dicTemporaryEmergencyPath, out strErrorMessage);

                    if (sectionData == null)
                        return false;
                    else
                    {
                        sectionData.Component.step_memb_sn = step_memb_sn;
                        sectionDatas.Add(sectionData);
                        dicSections[sectionData.Component.compn_sn] = sectionData;
                    }
                }
            }

            return true;
        }

        private static SectionData ReadSection(XElement xSection, List<int> gridColumnWidth, List<int> gridRowHeight, Dictionary<string, int> dicRegularPath, Dictionary<string, int> dicTemporaryNormalPath, Dictionary<string, int> dicTemporaryEmergencyPath, out string strErrorMessage)
        {
            strErrorMessage = null;

            int nColumnCount = gridColumnWidth.Count;
            int nRowCount = gridRowHeight.Count;

            SectionData sectionData = new SectionData();
            bool readNo = false;
            int sectionNo = -1;

            foreach (XAttribute attr in xSection.Attributes())
            {
                if (attr.Name == "no")
                {
                    int? no = GetInt(attr.Value);

                    if (no == null)
                    {
                        strErrorMessage = string.Format(ID.Get<ErrorMessageFormat>("xml").Value("onlyIntegerAttr2"), attr.Name, attr.Value);
                        return null;
                    }
                    else
                    {
                        sectionNo = (int)no;
                        readNo = true;
                    }
                }
            }

            if (readNo == false)
            {
                strErrorMessage = ID.Get<ErrorMessage>("xml").Value("noNoAttrInComponent");
                return null;
            }

            string strText = null;
            int? columnNo = null;
            int? rowNo = null;

            foreach (XElement element in xSection.Elements())
            {
                if (element.Name == "ColumnIndex")
                {
                    int? columnIndex = GetInt(element.Value);

                    if (columnIndex == null)
                    {
                        strErrorMessage = string.Format(ID.Get<ErrorMessageFormat>("xml").Value("onlyIntegerTag2"), element.Name, element.Value);
                        return null;
                    }

                    if (columnIndex < 0 || columnIndex >= nColumnCount)
                    {
                        strErrorMessage = string.Format(ID.Get<ErrorMessageFormat>("xml").Value("noDefinedTag"), element.Name, element.Value);
                        return null;
                    }

                    columnNo = (int)columnIndex;
                    //sectionData.Component.column_no = (int)columnIndex;
                }
                else if (element.Name == "RowIndex")
                {
                    int? rowIndex = GetInt(element.Value);

                    if (rowIndex == null)
                    {
                        strErrorMessage = string.Format(ID.Get<ErrorMessageFormat>("xml").Value("onlyIntegerTag2"), element.Name, element.Value);
                        return null;
                    }

                    if (rowIndex < 0 || rowIndex >= nRowCount)
                    {
                        strErrorMessage = string.Format(ID.Get<ErrorMessageFormat>("xml").Value("noDefinedTag"), element.Name, element.Value);
                        return null;
                    }

                    rowNo = (int)rowIndex;
                    //sectionData.Component.row_no = (int)rowIndex;
                }
                else if (element.Name == "Text")
                {
                    strText = element.Value;
                }
                else if (element.Name == "Property")
                {
                    if (ReadSectionProperty(element, sectionData, dicRegularPath, dicTemporaryNormalPath, dicTemporaryEmergencyPath, out strErrorMessage) == false)
                        return null;
                }
            }

            if (strText != null && strText.Length > 0)
                SetSectionText(sectionData, strText);

            if (columnNo != null)
                sectionData.Component.column_no = (int)columnNo;
            else
            {
                strErrorMessage = ID.Get<ErrorMessage>("xml").Value("noColumnIndexInComponent");
                return null;
            }

            if (rowNo != null)
                sectionData.Component.row_no = (int)rowNo;
            else
            {
                strErrorMessage = ID.Get<ErrorMessage>("xml").Value("noRowIndexInComponent");
                return null;
            }

            if (readNo)
                sectionData.Component.compn_sn = sectionNo;

            return sectionData;
        }

        private static void SetSectionText(SectionData sectionData, string strText)
        {
            if (sectionData.Comment != null)
                sectionData.Comment.contents = strText;
            else if (sectionData.Decision != null)
                sectionData.Decision.title = strText;
            else if (sectionData.Process != null)
                sectionData.Process.title = strText;
            else if (sectionData.Transmission != null)
                sectionData.Transmission.title = strText;
            else if (sectionData.Endpoint != null)
                sectionData.Endpoint.title = strText;
        }

        private static bool ReadSectionProperty(XElement xProperty, SectionData sectionData, Dictionary<string, int> dicRegularPath, Dictionary<string, int> dicTemporaryNormalPath, Dictionary<string, int> dicTemporaryEmergencyPath, out string strErrorMessage)
        {
            strErrorMessage = null;

            int? type = null;

            foreach (XAttribute attr in xProperty.Attributes())
            {
                if (attr.Name == "type")
                {
                    type = GetInt(attr.Value.Trim());

                    if (type == null)
                    {
                        strErrorMessage = string.Format(ID.Get<ErrorMessageFormat>("xml").Value("onlyIntegerAttr1"), attr.Name, attr.Value);
                        return false;
                    }
                }
            }

            if (type == null)
            {
                strErrorMessage = ID.Get<ErrorMessageFormat>("xml").Value("noTypeAttrInProperty");
                return false;
            }
            /*else
                sectionData.Component.compn_code = (int)type;*/

            if ((int)type == Sop.ComponentType.Process || (int)type == Sop.ComponentType.Process - (int)CodeType.ComponentType)
            {
                if (ReadProcessProperty(xProperty, sectionData, dicRegularPath, dicTemporaryNormalPath, dicTemporaryEmergencyPath, out strErrorMessage) == false)
                    return false;
            }
            else if ((int)type == Sop.ComponentType.Comment || (int)type == Sop.ComponentType.Comment - (int)CodeType.ComponentType)
            {
                if (ReadCommentProperty(xProperty, sectionData, out strErrorMessage) == false)
                    return false;
            }
            else if ((int)type == Sop.ComponentType.Decision || (int)type == Sop.ComponentType.Decision - (int)CodeType.ComponentType)
            {
                if (ReadDecisionProperty(xProperty, sectionData, out strErrorMessage) == false)
                    return false;
            }
            else if ((int)type == Sop.ComponentType.Endpoint || (int)type == Sop.ComponentType.Endpoint - (int)CodeType.ComponentType)
            {
                if (ReadEndpointProperty(xProperty, sectionData, out strErrorMessage) == false)
                    return false;
            }
            else if ((int)type == Sop.ComponentType.Transmission || (int)type == Sop.ComponentType.Transmission - (int)CodeType.ComponentType)
            {
                if (ReadTransmissionProperty(xProperty, sectionData, dicRegularPath, dicTemporaryNormalPath, dicTemporaryEmergencyPath, out strErrorMessage) == false)
                    return false;
            }
            else
            {
                strErrorMessage = ID.Get<ErrorMessage>("unknownComponentType").Value();
                return false;
            }

            sectionData.Component.compn_code = (int)type;
            return true;
        }

        private static bool ReadTransmissionProperty(XElement xProperty, SectionData sectionData, Dictionary<string, int> dicRegularPath, Dictionary<string, int> dicTemporaryNormalPath, Dictionary<string, int> dicTemporaryEmergencyPath, out string strErrorMessage)
        {
            strErrorMessage = null;
            bool readTeamList = false, readAutoRun = false, readUseSMS = false, readUseBroadcast = false;

            sectionData.TransmissionData = new TransmissionData();
            sectionData.TransmissionData.Transmission = new Model.Sop.Component.Transmission();
            sectionData.Transmission = sectionData.TransmissionData.Transmission;

            foreach (XElement element in xProperty.Elements())
            {
                if (element.Name == "UseSMS")
                {
                    bool? useSMS = GetBoolean(element.Value);

                    if (useSMS != null)
                    {
                        sectionData.Transmission.sms_yn = (bool)useSMS;
                        readUseSMS = true;
                    }
                }
                else if (element.Name == "UseBroadcast")
                {
                    bool? useBroadcast = GetBoolean(element.Value);

                    if (useBroadcast != null)
                    {
                        sectionData.Transmission.brdcst_yn = (bool)useBroadcast;
                        readUseBroadcast = true;
                    }
                }
                else if (element.Name == "UseEmail")
                {
                    bool? useEmail = GetBoolean(element.Value);

                    if (useEmail != null)
                        sectionData.Transmission.email_yn = (bool)useEmail;
                }
                else if (element.Name == "Message")
                {
                    sectionData.Transmission.mssage = element.Value;
                }
                else if (element.Name == "TeamList")
                {
                    if (ReadTeamList(element, sectionData.TransmissionData.Regulars, sectionData.TransmissionData.Temporaries, dicRegularPath, dicTemporaryNormalPath, dicTemporaryEmergencyPath, out strErrorMessage) == false)
                        return false;
                    else
                        readTeamList = true;
                }
                else if (element.Name == "OnlyTeamLeader")
                {
                    bool? onlyTeamLeader = GetBoolean(element.Value.Trim());

                    if (onlyTeamLeader == null)
                    {
                        strErrorMessage = string.Format(ID.Get<ErrorMessageFormat>("xml").Value("onlyBooleanTag2"), element.Name, element.Value);
                        return false;
                    }

                    sectionData.Transmission.leadr_prvuse_yn = (bool)onlyTeamLeader;
                }
                else if (element.Name == "AutoRun")
                {
                    bool? autoRun = GetBoolean(element.Value.Trim());

                    if (autoRun == null)
                    {
                        strErrorMessage = string.Format(ID.Get<ErrorMessageFormat>("xml").Value("onlyBooleanTag2"), element.Name, element.Value);
                        return false;
                    }

                    sectionData.Transmission.atmc_execut_yn = (bool)autoRun;
                    readAutoRun = true;
                }
                else if (element.Name == "UseSiren")
                {
                    bool? useSiren = GetBoolean(element.Value);

                    if (useSiren != null)
                        sectionData.Transmission.siren_yn = (bool)useSiren;
                }
            }

            /*if (readTeamList == false)
            {
                strErrorMessage = ID.Get<ErrorMessage>("xml").Value("noTeamListTagInTransmissionProperty");
                return false;
            }*/

            if (readAutoRun == false)
            {
                strErrorMessage = ID.Get<ErrorMessage>("xml").Value("noAutoRunTagInTransmissionProperty");
                return false;
            }

            if (readUseSMS == false)
            {
                strErrorMessage = ID.Get<ErrorMessage>("xml").Value("noUseSMSTagInTransmissionProperty");
                return false;
            }

            if (readUseBroadcast == false)
            {
                strErrorMessage = ID.Get<ErrorMessage>("xml").Value("noUseBroadcastTagInTransmissionProperty");
                return false;
            }

            return true;
        }

        private static bool ReadEndpointProperty(XElement xProperty, SectionData sectionData, out string strErrorMessage)
        {
            strErrorMessage = null;

            sectionData.EndpointData = new EndpointData();
            sectionData.EndpointData.Endpoint = new Model.Sop.Component.Endpoint();
            sectionData.Endpoint = sectionData.EndpointData.Endpoint;

            foreach (XElement element in xProperty.Elements())
            {
                if (element.Name == "IsBegin")
                {
                    bool? isBegin = GetBoolean(element.Value);

                    if (isBegin != null)
                        sectionData.EndpointData.Endpoint.begin_yn = (bool)isBegin;
                }
            }

            return true;
        }

        private static bool ReadDecisionProperty(XElement xProperty, SectionData sectionData, out string strErrorMessage)
        {
            strErrorMessage = null;

            sectionData.DecisionData = new DecisionData();
            sectionData.DecisionData.Decision = new Model.Sop.Component.Decision();
            sectionData.Decision = sectionData.DecisionData.Decision;

            foreach (XElement element in xProperty.Elements())
            {
                if (element.Name == "AutoRunScript")
                {
                    sectionData.DecisionData.Decision.atmc_execut_script = element.Value;
                }
            }

            return true;
        }

        private static bool ReadCommentProperty(XElement xProperty, SectionData sectionData, out string strErrorMessage)
        {
            strErrorMessage = null;

            sectionData.CommentData = new CommentData();
            sectionData.CommentData.Comment = new Model.Sop.Component.Comment();
            sectionData.Comment = sectionData.CommentData.Comment;

            return true;
        }

        private static bool ReadProcessProperty(XElement xProperty, SectionData sectionData, Dictionary<string, int> dicRegularPath, Dictionary<string, int> dicTemporaryNormalPath, Dictionary<string, int> dicTemporaryEmergencyPath, out string strErrorMessage)
        {
            strErrorMessage = null;
            bool readTeamList = false, readAutoRun = false, readMissionList = false;

            sectionData.ProcessData = new ProcessData();
            sectionData.ProcessData.Process = new Model.Sop.Component.Process();
            sectionData.Process = sectionData.ProcessData.Process;

            foreach (XElement element in xProperty.Elements())
            {
                if (element.Name == "TeamList")
                {
                    if (ReadTeamList(element, sectionData.ProcessData.Regulars, sectionData.ProcessData.Temporaries, dicRegularPath, dicTemporaryNormalPath, dicTemporaryEmergencyPath, out strErrorMessage) == false)
                        return false;
                    else
                        readTeamList = true;
                }
                else if (element.Name == "OnlyTeamLeader")
                {
                    bool? onlyTeamLeader = GetBoolean(element.Value.Trim());

                    if (onlyTeamLeader == null)
                    {
                        strErrorMessage = string.Format(ID.Get<ErrorMessageFormat>("xml").Value("onlyBooleanTag2"), element.Name, element.Value);
                        return false;
                    }

                    sectionData.ProcessData.Process.leadr_prvuse_yn = (bool)onlyTeamLeader;
                }
                else if (element.Name == "AutoRun")
                {
                    bool? autoRun = GetBoolean(element.Value.Trim());

                    if (autoRun == null)
                    {
                        strErrorMessage = string.Format(ID.Get<ErrorMessageFormat>("xml").Value("onlyBooleanTag2"), element.Name, element.Value);
                        return false;
                    }

                    sectionData.ProcessData.Process.atmc_execut_yn = (bool)autoRun;
                    readAutoRun = true;
                }
                else if (element.Name == "MissionList")
                {
                    List<ProcessMission> missions = ReadProcessMissions(element, out strErrorMessage);

                    if (missions == null)
                        return false;
                    else
                    {
                        foreach (var mission in missions)
                        {
                            sectionData.ProcessData.Missions.Add(new ProcessMissionEx(mission));
                        }
                    }

                    readMissionList = true;
                }
            }

            /*if (readTeamList == false)
            {
                strErrorMessage = ID.Get<ErrorMessage>("xml").Value("noTeamListTagInProcessProperty");
                return false;
            }*/

            if (readAutoRun == false)
            {
                strErrorMessage = ID.Get<ErrorMessage>("xml").Value("noAutoRunTagInProcessProperty");
                return false;
            }

            if (readMissionList == false)
            {
                strErrorMessage = ID.Get<ErrorMessage>("xml").Value("noMissionListTagInProcessProperty");
                return false;
            }

            return true;
        }

        private static List<ProcessMission> ReadProcessMissions(XElement xMissions, out string strErrorMessage)
        {
            strErrorMessage = null;

            List<ProcessMission> missions = new List<ProcessMission>();

            foreach (XElement element in xMissions.Elements())
            {
                if (element.Name == "Mission")
                {
                    string strProcessMission = element.Value.Trim();

                    if (strProcessMission.Length > 0)
                    {
                        ProcessMission mission = new ProcessMission();
                        mission.misn_contents = strProcessMission;
                        missions.Add(mission);
                    }
                }
            }

            return missions;
        }

        private static bool ReadTeamList(XElement xTeamList, List<TransmissionRegular> regulars, List<TransmissionTemporaryEx> temporaries, Dictionary<string, int> dicRegularPath, Dictionary<string, int> dicTemporaryNormalPath, Dictionary<string, int> dicTemporaryEmergencyPath, out string strErrorMessage)
        {
            strErrorMessage = null;

            foreach (XElement element in xTeamList.Elements())
            {
                if (element.Name == "Team")
                {
                    XAttribute attrType = FindAttribute(element, "type");

                    if (attrType == null)
                    {
                        strErrorMessage = ID.Get<ErrorMessage>("xml").Value("noTypeInTeam");
                        return false;
                    }

                    XAttribute attrName = FindAttribute(element, "name");

                    if (attrName == null)
                    {
                        strErrorMessage = ID.Get<ErrorMessage>("xml").Value("noNameInTeam");
                        return false;
                    }

                    int teamType;
                    string strType = attrType.Value;

                    if (int.TryParse(strType, out teamType))
                    {
                        if (teamType == (int)Receiver.TeamDataType.RegularTeam)
                        {
                            int? teamNo = GetTeamNumber(dicRegularPath, attrName.Value);

                            if (teamNo != null)
                            {
                                TransmissionRegular regular = new TransmissionRegular();
                                regular.rgl_sn = (int)teamNo;
                                regulars.Add(regular);
                            }
                        }
                        else if (teamType == (int)Receiver.TeamDataType.TemporaryNormalTeam || teamType == (int)Receiver.TeamDataType.TemporaryEmergencyTeam)
                        {
                            int? teamNo = GetTeamNumber(teamType == (int)Receiver.TeamDataType.TemporaryNormalTeam ? dicTemporaryNormalPath : dicTemporaryEmergencyPath, attrName.Value);

                            if (teamNo != null)
                            {
                                TransmissionTemporaryEx temporary = new TransmissionTemporaryEx();
                                temporary.tmpr_sn = (int)teamNo;
                                temporary.nor_yn = teamType == (int)Receiver.TeamDataType.TemporaryNormalTeam;
                                temporaries.Add(temporary);
                            }
                        }
                    }
                }
            }

            return true;
        }

        private static bool ReadTeamList(XElement xTeamList, List<ProcessRegular> regulars, List<ProcessTemporaryEx> temporaries, Dictionary<string, int> dicRegularPath, Dictionary<string, int> dicTemporaryNormalPath, Dictionary<string, int> dicTemporaryEmergencyPath, out string strErrorMessage)
        {
            strErrorMessage = null;

            foreach (XElement element in xTeamList.Elements())
            {
                if (element.Name == "Team")
                {
                    XAttribute attrType = FindAttribute(element, "type");

                    if (attrType == null)
                    {
                        strErrorMessage = ID.Get<ErrorMessage>("xml").Value("noTypeInTeam");
                        return false;
                    }

                    XAttribute attrName = FindAttribute(element, "name");

                    if (attrName == null)
                    {
                        strErrorMessage = ID.Get<ErrorMessage>("xml").Value("noNameInTeam");
                        return false;
                    }

                    int teamType;
                    string strType = attrType.Value;

                    if (int.TryParse(strType, out teamType))
                    {
                        if (teamType == (int)Receiver.TeamDataType.RegularTeam)
                        {
                            int? teamNo = GetTeamNumber(dicRegularPath, attrName.Value);

                            if (teamNo != null)
                            {
                                ProcessRegular regular = new ProcessRegular();
                                regular.rgl_sn = (int)teamNo;
                                regulars.Add(regular);
                            }
                        }
                        else if (teamType == (int)Receiver.TeamDataType.TemporaryNormalTeam || teamType == (int)Receiver.TeamDataType.TemporaryEmergencyTeam)
                        {
                            int? teamNo = GetTeamNumber(teamType == (int)Receiver.TeamDataType.TemporaryNormalTeam ? dicTemporaryNormalPath : dicTemporaryEmergencyPath, attrName.Value);

                            if (teamNo != null)
                            {
                                ProcessTemporaryEx temporary = new ProcessTemporaryEx();
                                temporary.tmpr_sn = (int)teamNo;
                                temporary.nor_yn = teamType == (int)Receiver.TeamDataType.TemporaryNormalTeam;
                                temporaries.Add(temporary);
                            }
                        }
                    }
                }
            }

            return true;
        }

        private static int? GetTeamNumber(Dictionary<string, int> dicTeamPath, string strTeamPath)
        {
            int teamNo;

            if (dicTeamPath.TryGetValue(strTeamPath, out teamNo))
                return teamNo;

            return null;
        }

        private static bool ReadGrid(XElement xGrid, List<int> gridColumnWidth, List<int> gridRowHeight, out string strErrorMessage)
        {
            strErrorMessage = null;

            foreach (XElement element in xGrid.Elements())
            {
                if (element.Name == "Columns")
                {
                    if (ReadColumn(element, gridColumnWidth, out strErrorMessage) == false)
                        return false;
                }
                else if (element.Name == "Rows")
                {
                    if (ReadRow(element, gridRowHeight, out strErrorMessage) == false)
                        return false;
                }
            }

            return true;
        }

        private static bool ReadColumn(XElement xColumns, List<int> gridColumnWidth, out string strErrorMessage)
        {
            strErrorMessage = null;
            
            foreach (XElement element in xColumns.Elements())
            {
                if (element.Name == "Column")
                {
                    foreach (XAttribute attr in element.Attributes())
                    {
                        if (attr.Name == "width")
                        {
                            int? width = GetInt(attr.Value);

                            if (width == null)
                            {
                                strErrorMessage = string.Format(ID.Get<ErrorMessageFormat>("xml").Value("onlyIntegerInWidth"), attr.Value);
                                return false;
                            }
                            else
                                gridColumnWidth.Add((int)width);
                        }
                    }
                }
            }

            return true;
        }

        private static bool ReadRow(XElement xRows, List<int> gridRowHeight, out string strErrorMessage)
        {
            strErrorMessage = null;
            
            foreach (XElement element in xRows.Elements())
            {
                if (element.Name == "Row")
                {
                    foreach (XAttribute attr in element.Attributes())
                    {
                        if (attr.Name == "height")
                        {
                            int? height = GetInt(attr.Value);

                            if (height == null)
                            {
                                strErrorMessage = string.Format(ID.Get<ErrorMessageFormat>("xml").Value("onlyIntegerInHeight"), attr.Value);
                                return false;
                            }
                            else
                                gridRowHeight.Add((int)height);
                        }
                    }
                }
            }

            return true;
        }

        private static bool ReadHeader(XElement xHeader, IDataManager dataManager, int siteNo, out LargeClass dc, out MiddleClass sdc, out SmallClass disaster, out Model.Sop.Category.Version version, out string strErrorMessage)
        {
            dc = null;
            sdc = null;
            disaster = null;
            version = null;

            XElement xXMLVersion = FindElement(xHeader, "XMLVersion");
            XElement xCategory = FindElement(xHeader, "Category");
            XElement xSubCategory = FindElement(xHeader, "SubCategory");
            XElement xDisaster = FindElement(xHeader, "Disaster");
            XElement xNormal = FindElement(xHeader, "Normal");
            XElement xSopVersion = FindElement(xHeader, "SOPVersion");

            if (CheckHeaderValidation(xXMLVersion, xCategory, xSubCategory, xDisaster, xNormal, xSopVersion, out strErrorMessage) == false)
                return false;

            int lclas_sn, mclas_sn;

            if (GetCategoryInfo(dataManager, xCategory.Value, xSubCategory.Value, siteNo, out lclas_sn, out mclas_sn, out strErrorMessage) == false)
                return false;

            XAttribute attrDescription = FindAttribute(xSopVersion, "description");

            dc = new LargeClass();
            dc.lclas_name = xCategory.Value;
            dc.site_sn = siteNo;
            dc.lclas_sn = lclas_sn;

            sdc = new MiddleClass();
            sdc.mclas_name = xSubCategory.Value;
            sdc.lclas_sn = lclas_sn;
            sdc.mclas_sn = mclas_sn;

            disaster = new SmallClass();
            disaster.sclas_name = xDisaster.Value;
            disaster.mclas_sn = mclas_sn;
            disaster.sclas_sn = -1;

            bool? isNormal = GetBoolean(xNormal.Value);

            if (isNormal == null)
            {
                strErrorMessage = string.Format(ID.Get<ErrorMessageFormat>("xml").Value("onlyBooleanTag1"), xNormal.Name, xNormal.Value);
                return false;
            }
            else
                disaster.nor_yn = (bool)isNormal;

            version = new Model.Sop.Category.Version();
            version.creat_de = DateTime.Now;
            version.last_acces_de = version.creat_de;
            version.site_sn = dc.site_sn;
            version.name = xSopVersion.Value;
            version.ver_sn = -1;
            disaster.ver_sn = version.ver_sn;

            if (attrDescription != null)
                version.descp = attrDescription.Value;

            return true;
        }

        private static bool GetCategoryInfo(IDataManager dataManager, string strLargeClassName, string strSubClassName, int siteNo, out int lclas_sn, out int mclas_sn, out string strErrorMessage)
        {
            lclas_sn = mclas_sn = -1;

            string strCondition = string.Format("{0} = '{1}' and {2} = {3}", LargeClass.Fields.lclas_name, strLargeClassName, LargeClass.Fields.site_sn, siteNo);
            LargeClass largeClass = dataManager.GetSelect().SelectFirst<LargeClass>(strCondition, out strErrorMessage);

            if (largeClass == null)
            {
                if (strErrorMessage != null)
                    return false;
                else
                {
                    strErrorMessage = "알수없는 SOP 대분류입니다.";
                    return false;
                }
            }

            strCondition = string.Format("{0} = '{1}' and {2} = {3}", MiddleClass.Fields.mclas_name, strSubClassName, MiddleClass.Fields.lclas_sn, largeClass.lclas_sn);
            MiddleClass middleClass = dataManager.GetSelect().SelectFirst<MiddleClass>(strCondition, out strErrorMessage);

            if (middleClass == null)
            {
                if (strErrorMessage != null)
                    return false;
            }
            else
                mclas_sn = middleClass.mclas_sn;

            lclas_sn = largeClass.lclas_sn;
            return true;
        }

        private static bool CheckHeaderValidation(XElement xXMLVersion, XElement xCategory, XElement xSubCategory, XElement xDisaster, XElement xNormal, XElement xSopVersion, out string strErrorMessage)
        {
            if (xXMLVersion == null || xXMLVersion.Value == null || xXMLVersion.Value.Length == 0)
            {
                strErrorMessage = ID.Get<ErrorMessage>("xml").Value("noXMLVersionTagInHeader");
                return false;
            }
            else if (xXMLVersion.Value != XMLVersion)
            {
                strErrorMessage = ID.Get<ErrorMessage>("xml").Value("noCurrentXMLVersion");
                return false;
            }

            if (xCategory == null)
            {
                strErrorMessage = ID.Get<ErrorMessage>("xml").Value("noCategoryTagInHeader");
                return false;
            }

            if (xSubCategory == null)
            {
                strErrorMessage = ID.Get<ErrorMessage>("xml").Value("noSubCategoryTagInHeader");
                return false;
            }

            if (xDisaster == null)
            {
                strErrorMessage = ID.Get<ErrorMessage>("xml").Value("noDisasterTagInHeader");
                return false;
            }

            if (xNormal == null)
            {
                strErrorMessage = ID.Get<ErrorMessage>("xml").Value("noNormalTagInHeader");
                return false;
            }

            if (xSopVersion == null)
            {
                strErrorMessage = ID.Get<ErrorMessage>("xml").Value("noSOPVersionTagInHeader");
                return false;
            }

            strErrorMessage = null;
            return true;
        }

        private static XElement FindElement(XElement node, string strNodeName)
        {
            foreach (XElement element in node.Elements())
            {
                if (element.Name == strNodeName)
                    return element;
            }

            return null;
        }

        private static XAttribute FindAttribute(XElement node, string strAttrName)
        {
            foreach (XAttribute attr in node.Attributes())
            {
                if (attr.Name == strAttrName)
                    return attr;
            }

            return null;
        }

        private static bool? GetBoolean(string strValue)
        {
            if (strValue == "1")
                return true;
            else if (strValue == "0")
                return false;

            string strLower = strValue.ToLower();

            if (string.Compare(strLower, "true") == 0)
                return true;
            else if (string.Compare(strLower, "false") == 0)
                return false;

            return null;
        }

        private static int? GetInt(string strValue)
        {
            int data;

            if (int.TryParse(strValue, out data))
                return data;

            return null;
        }
    }
}
