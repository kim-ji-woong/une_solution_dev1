using System.Collections.Generic;
using Response.Resource;

namespace Base.SOPManager.BLL.Resource
{
    class ErrorMessage : MessageMap
    {
        private static Dictionary<ID.LanguageTypes, Dictionary<string, object>> m_messageMaps = null;

        private static void Init()
        {
            Dictionary<ID.LanguageTypes, Dictionary<string, object>> dicMessageMaps = new Dictionary<ID.LanguageTypes, Dictionary<string, object>>();

            // 한글
            SetMessage(dicMessageMaps, ID.LanguageTypes.ko, "noDisasterCategory", "SOP의 재난분야가 설정되지 않았습니다.");
            SetMessage(dicMessageMaps, ID.LanguageTypes.ko, "noSubDisasterCategory", "SOP의 재난종류가 설정되지 않았습니다.");
            SetMessage(dicMessageMaps, ID.LanguageTypes.ko, "noDisaster", "SOP의 이름이 설정되지 않았습니다.");
            SetMessage(dicMessageMaps, ID.LanguageTypes.ko, "noActionStep", "SOP의 행동단계 이름이 설정되지 않았습니다.");
            SetMessage(dicMessageMaps, ID.LanguageTypes.ko, "failSaveDisasterCategory", "SOP의 재난분야 저장이 실패하였습니다.");
            SetMessage(dicMessageMaps, ID.LanguageTypes.ko, "failSaveSubDisasterCategory", "SOP의 재난종류 저장이 실패하였습니다.");
            SetMessage(dicMessageMaps, ID.LanguageTypes.ko, "failSaveVersion", "SOP 버전 확인 및 저장이 실패하였습니다.");
            SetMessage(dicMessageMaps, ID.LanguageTypes.ko, "failSave", "SOP 저장이 실패하였습니다.");
            SetMessage(dicMessageMaps, ID.LanguageTypes.ko, "failSaveActionStep", "SOP 행동단계 저장에 실패하였습니다.");
            SetMessage(dicMessageMaps, ID.LanguageTypes.ko, "failSaveStepMember", "SOP 세부 행동단계 저장에 실패하였습니다.");
            SetMessage(dicMessageMaps, ID.LanguageTypes.ko, "failSaveGrid", "Grid 저장에 실패하였습니다.");
            SetMessage(dicMessageMaps, ID.LanguageTypes.ko, "failSaveGridRow", "Grid Row 저장에 실패하였습니다.");
            SetMessage(dicMessageMaps, ID.LanguageTypes.ko, "failSaveGridColumn", "Grid Column 저장에 실패하였습니다.");
            SetMessage(dicMessageMaps, ID.LanguageTypes.ko, "failSaveSection", "SOP Component 저장에 실패하였습니다.");
            SetMessage(dicMessageMaps, ID.LanguageTypes.ko, "failSaveArrow", "SOP 화살표 저장에 실패하였습니다.");
            SetMessage(dicMessageMaps, ID.LanguageTypes.ko, "failSaveDisaster", "SOP 저장에 실패하였습니다.");
            SetMessage(dicMessageMaps, ID.LanguageTypes.ko, "failSaveActionStep", "SOP 행동단계 저장에 실패하였습니다.");
            SetMessage(dicMessageMaps, ID.LanguageTypes.ko, "failSaveStepMember", "SOP 세부 행동단계 저장에 실패하였습니다.");
            SetMessage(dicMessageMaps, ID.LanguageTypes.ko, "failToSaveLinkedSOP", "LinkedSOP를 데이터베이스에 저장하는데 실패하였습니다.");
            SetMessage(dicMessageMaps, ID.LanguageTypes.ko, "failToReadLinkedSOP", "LinkedSOP를 데이터베이스로부터 읽어오는데 실패하였습니다.");
            SetMessage(dicMessageMaps, ID.LanguageTypes.ko, "failToReadDisasterCategory", "SOP의 재난분야를 읽어오는데 실패하였습니다.");
            SetMessage(dicMessageMaps, ID.LanguageTypes.ko, "failToReadLoginUser", "로그인한 사용자 정보를 읽어올 수 없습니다.");
            SetMessage(dicMessageMaps, ID.LanguageTypes.ko, "failToReadSubDisasterCategory", "SOP의 재난종류를 읽어오는데 실패하였습니다.");
            SetMessage(dicMessageMaps, ID.LanguageTypes.ko, "failToReadExternalProgram", "데이터베이스로부터 외부 프로그램 정보를 읽어오는데 실패하였습니다.");
            SetMessage(dicMessageMaps, ID.LanguageTypes.ko, "failToDeleteLinkedSOP", "신호별 SOP Link를 데이터베이스에서 삭제하는데 실패하였습니다.");
            SetMessage(dicMessageMaps, ID.LanguageTypes.ko, "failToOpenDB", "데이터베이스로부터 SOP 정보를 읽어오는데 실패하였습니다.");
            SetMessage(dicMessageMaps, ID.LanguageTypes.ko, "noRegularTeams", "정규조직이 하나도 없습니다.");
            SetMessage(dicMessageMaps, ID.LanguageTypes.ko, "noStandardActionStepNames", "SOP 표준 행동단계 이름들이 설정되어 있지 않습니다.");
            SetMessage(dicMessageMaps, ID.LanguageTypes.ko, "noSOPDatas", "저장할 SOP 데이터가 하나도 없습니다.");
            SetMessage(dicMessageMaps, ID.LanguageTypes.ko, "noAutoRunInProcess", "프로세스 Component에 AutoRun 속성이 정의되어 있지 않습니다.");
            SetMessage(dicMessageMaps, ID.LanguageTypes.ko, "noAutoRunInInternal", "상황전파 Component에 AutoRun 속성이 정의되어 있지 않습니다.");
            SetMessage(dicMessageMaps, ID.LanguageTypes.ko, "noIsBeginInEndpoint", "시작/끝 Component에 IsBegin 속성이 정의되어 있지 않습니다.");
            SetMessage(dicMessageMaps, ID.LanguageTypes.ko, "noUseSMSInInternal", "상황전파 Component에 UseSMS 속성이 정의되어 있지 않습니다.");
            SetMessage(dicMessageMaps, ID.LanguageTypes.ko, "noUseBroadcastInInternal", "상황전파 Component에 UseBroadcast 속성이 정의되어 있지 않습니다.");
            SetMessage(dicMessageMaps, ID.LanguageTypes.ko, "noMessageInInternal", "상황전파 Component에 Message 속성이 정의되어 있지 않습니다.");
            SetMessage(dicMessageMaps, ID.LanguageTypes.ko, "noValidActionStep", "유효한 행동단계 정보가 하나도 없습니다.");
            SetMessage(dicMessageMaps, ID.LanguageTypes.ko, "notConnectedBeginToEnd", "시작 컴포넌트로부터 종료 컴포넌트까지 연결되어 있지 않습니다.");
            SetMessage(dicMessageMaps, ID.LanguageTypes.ko, "failToBeginTransaction", "데이터베이스 Transaction을 시작할 수 없습니다.");
            SetMessage(dicMessageMaps, ID.LanguageTypes.ko, "failToCommitTransaction", "데이터베이스 트랜잭션을 종료할수 없습니다.");
            SetMessage(dicMessageMaps, ID.LanguageTypes.ko, "runningSOP", "실행중인 SOP는 수정하거나 삭제할 수 없습니다.");
            SetMessage(dicMessageMaps, ID.LanguageTypes.ko, "nullParameter", "Parameter가 존재하지 않습니다.");
            SetMessage(dicMessageMaps, ID.LanguageTypes.ko, "unknownComponentType", "알려지지 않은 Component 타입입니다.");
            SetMessage(dicMessageMaps, ID.LanguageTypes.ko, "emptyComment", "설명 컴포넌트의 상세정보가 존재하지 않습니다.");
            SetMessage(dicMessageMaps, ID.LanguageTypes.ko, "emptyDecision", "판단 컴포넌트의 상세정보가 존재하지 않습니다.");
            SetMessage(dicMessageMaps, ID.LanguageTypes.ko, "emptyEndpoint", "시작/끝 컴포넌트의 상세정보가 존재하지 않습니다.");
            SetMessage(dicMessageMaps, ID.LanguageTypes.ko, "emptyProcess", "프로세스 컴포넌트의 상세정보가 존재하지 않습니다.");
            SetMessage(dicMessageMaps, ID.LanguageTypes.ko, "emptyTransmission", "상황전파 컴포넌트의 상세정보가 존재하지 않습니다.");

            SetMessage(dicMessageMaps, ID.LanguageTypes.ko, "xml", "noSOPTagInXML", "SOP 파일에 SOP Tag가 존재하지 않습니다.");
            SetMessage(dicMessageMaps, ID.LanguageTypes.ko, "xml", "noHeaderTagInXML", "SOP 파일에 Header Tag가 존재하지 않습니다.");
            SetMessage(dicMessageMaps, ID.LanguageTypes.ko, "xml", "noBodyTagInXML", "SOP 파일에 Body Tag가 존재하지 않습니다.");
            SetMessage(dicMessageMaps, ID.LanguageTypes.ko, "xml", "noXMLVersionTagInHeader", "Header에 XMLVersion Tag가 존재하지 않습니다.");
            SetMessage(dicMessageMaps, ID.LanguageTypes.ko, "xml", "noCurrentXMLVersion", "현재 버전의 XML 파일이 아닙니다.");
            SetMessage(dicMessageMaps, ID.LanguageTypes.ko, "xml", "noCategoryTagInHeader", "Header에 Category Tag가 존재하지 않습니다.");
            SetMessage(dicMessageMaps, ID.LanguageTypes.ko, "xml", "noSubCategoryTagInHeader", "Header에 SubDisaster Tag가 존재하지 않습니다.");
            SetMessage(dicMessageMaps, ID.LanguageTypes.ko, "xml", "noDisasterTagInHeader", "Header에 Disaster Tag가 존재하지 않습니다.");
            SetMessage(dicMessageMaps, ID.LanguageTypes.ko, "xml", "noNormalTagInHeader", "Header에 Normal Tag가 존재하지 않습니다.");
            SetMessage(dicMessageMaps, ID.LanguageTypes.ko, "xml", "noSOPVersionTagInHeader", "Header에 SOPVersion Tag가 존재하지 않습니다.");
            SetMessage(dicMessageMaps, ID.LanguageTypes.ko, "xml", "noActionStepListTagInBody", "Body에 ActionStepList Tag가 존재하지 않습니다.");
            SetMessage(dicMessageMaps, ID.LanguageTypes.ko, "xml", "noTeamTypeAttrInStepMember", "StepMember에 teamType 속성이 존재하지 않습니다.");
            SetMessage(dicMessageMaps, ID.LanguageTypes.ko, "xml", "noNameAttrInStepMember", "StepMember에 name 속성이 존재하지 않습니다.");
            SetMessage(dicMessageMaps, ID.LanguageTypes.ko, "xml", "noNoAttrInComponent", "Component에 no 속성이 존재하지 않습니다.");
            SetMessage(dicMessageMaps, ID.LanguageTypes.ko, "xml", "noColumnIndexInComponent", "Component에 ColumnIndex Tag가 존재하지 않습니다.");
            SetMessage(dicMessageMaps, ID.LanguageTypes.ko, "xml", "noRowIndexInComponent", "Component에 RowIndex Tag가 존재하지 않습니다.");
            SetMessage(dicMessageMaps, ID.LanguageTypes.ko, "xml", "noTypeAttrInProperty", "Property에 type 속성이 존재하지 않습니다.");
            SetMessage(dicMessageMaps, ID.LanguageTypes.ko, "xml", "noTeamListTagInProcessProperty", "Process Property에 TeamList Tag가 존재하지 않습니다.");
            SetMessage(dicMessageMaps, ID.LanguageTypes.ko, "xml", "noAutoRunTagInProcessProperty", "Process Property에 AutoRun Tag가 존재하지 않습니다.");
            SetMessage(dicMessageMaps, ID.LanguageTypes.ko, "xml", "noTypeInTeam", "Team에 type Tag가 존재하지 않습니다.");
            SetMessage(dicMessageMaps, ID.LanguageTypes.ko, "xml", "noNameInTeam", "Team에 name Tag가 존재하지 않습니다.");
            SetMessage(dicMessageMaps, ID.LanguageTypes.ko, "xml", "noMissionListTagInProcessProperty", "Process Property에 MissionList Tag가 존재하지 않습니다.");
            SetMessage(dicMessageMaps, ID.LanguageTypes.ko, "xml", "noIsBeginTagInEndpointProperty", "시작/끝 Property에 IsBegin Tag가 존재하지 않습니다.");
            SetMessage(dicMessageMaps, ID.LanguageTypes.ko, "xml", "noUseSMSTagInTransmissionProperty", "상황전파 Property에 UseSMS Tag가 존재하지 않습니다.");
            SetMessage(dicMessageMaps, ID.LanguageTypes.ko, "xml", "noUseBroadcastTagInTransmissionProperty", "상황전파 Property에 UseBroadcast Tag가 존재하지 않습니다.");
            SetMessage(dicMessageMaps, ID.LanguageTypes.ko, "xml", "noTeamListTagInTransmissionProperty", "상황전파 Property에 TeamList Tag가 존재하지 않습니다.");
            SetMessage(dicMessageMaps, ID.LanguageTypes.ko, "xml", "noAutoRunTagInTransmissionProperty", "상황전파 Property에 AutoRun Tag가 존재하지 않습니다.");
            SetMessage(dicMessageMaps, ID.LanguageTypes.ko, "xml", "noBeginComponentNoInArrow", "Arrow에 BeginComponentNo Tag가 존재하지 않습니다.");
            SetMessage(dicMessageMaps, ID.LanguageTypes.ko, "xml", "noBeginComponentPositionInArrow", "Arrow에 BeginComponentPosition Tag가 존재하지 않습니다.");
            SetMessage(dicMessageMaps, ID.LanguageTypes.ko, "xml", "noEndComponentNoInArrow", "Arrow에 EndComponentNo Tag가 존재하지 않습니다.");
            SetMessage(dicMessageMaps, ID.LanguageTypes.ko, "xml", "noEndComponentPositionInArrow", "Arrow에 EndComponentPosition Tag가 존재하지 않습니다.");
            // 영문
            // ...

            m_messageMaps = dicMessageMaps;
        }

        protected ErrorMessage(Dictionary<string, object> messageMaps)
            : base(messageMaps)
        {
        }

        public ErrorMessage()
            : base(null)
        {
        }

        public override MessageMap Get(ID.LanguageTypes type)
        {
            if (m_messageMaps == null)
                Init();

            Dictionary<string, object> dicMessageMaps = null;

            if (m_messageMaps.TryGetValue(type, out dicMessageMaps))
            {
                m_maps = dicMessageMaps;
                return this;
                //return new ErrorMessageFormat(dicMessageMaps);
            }

            m_maps = null;
            return this;
            //return new ErrorMessageFormat(null);
        }
    }
}
