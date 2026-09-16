using Response;
using System.Collections.Generic;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace Base.SOPManager.IBLL
{
    using Response;
    using Models;
    using Models.Category;
    using Request;
    using Models.Component;

    public interface IProcessManager
    {
        /// <summary>
        /// 전체 SOP 목록을 얻어온다.
        /// 각 SOP의 상세 내용도 같이 받아온다.
        /// </summary>
        ResponseDisasterCategories RequestDisasterCategories(int nSiteNo, bool? isNormal);
        /// <summary>
        /// 전체 SOP 목록을 얻어온다.
        /// 각 SOP의 상세 내용은 제외하고 ActionStep 까지만 가져온다.
        /// </summary>
        ResponseDisasterCategories RequestDisasterCategoryList(int nSiteNo, bool? isNormal);
        /// <summary>
        /// 표준 ActionStep 이름 목록을 얻어온다.
        /// </summary>
        ResponseActionStepDatas RequestDefaultActionStepDatas(int nSiteNo);
        /// <summary>
        /// StepMember 객체를 생성한다.
        /// </summary>
        ResponseStepMemberData RequestDefaultStepMemberData(int nActionStepNo);
        /// <summary>
        /// 특정 재난번호(SOP 번호)를 사용하여 해당 SOP에 대한 전체 버전정보를 얻어온다.
        /// </summary>
        ResponseDisasterVersions RequestDisasterVersions(int nDisasterNo);
        /// <summary>
        /// DB에 SOP를 저장한다.
        /// </summary>
        ResponseSave SaveDB(int nUserNo, SOPData sopData);
        /// <summary>
        /// XML 파일에 SOP를 저장한다.
        /// </summary>
        ResponseSave SaveXML(SOPData sopData);
        /// <summary>
        /// DB로부터 SOP를 불러온다.
        /// </summary>
        ResponseOpen OpenDB(int nDisasterNo);
        /// <summary>
        /// DB로부터 전체 SOP를 불러온다.
        /// </summary>
        ResponseOpenAll OpenAll(int? siteNo);
        /// <summary>
        /// 특정 SOP를 삭제한다.
        /// </summary>
        MessageResult Delete(RequestDelete request);
        /// <summary>
        /// 특수문자가 포함된 문자열을 해독한다.
        /// </summary>
        ResponseParseSpecialMessage ParseSpecialMessage(RequestParseSpecialMessage data);
        /// <summary>
        /// 전체 특수문자 목록을 얻어온다.
        /// </summary>
        ResponseSpecialMessageList GetSpecialMessageList();
        /// <summary>
        /// 전체 LinkedSOP 목록을 얻어온다.
        /// </summary>
        ResponseLinkedSOPs GetLinkedSOPs(RequestLinkedSOP data);
        /// <summary>
        /// LinkedSOP를 저장한다.
        /// </summary>
        MessageResult SaveLinkedSOPs(SaveLinkedSOPs data);
        /// <summary>
        /// 연결 설정된 SOP의 버전 개수가 몇개인지 확인한다.
        /// </summary>
        ResponseLoadLinkedSopVersions LoadLinkedSopVersions(int nSiteNo, List<int> versionNos);
        /// <summary>
        /// DB에 저장할 수 있는 문제없는 Section인지 검사한다.
        /// </summary>
        MessageResult CheckSectionData(CheckSectionData data);
        /// <summary>
        /// XML 파일을 불러온다.
        /// </summary>
        ResponseOpen OpenXML(string strXML, int siteNo);

        IEnumerable<ActionStepData> ReadActionSteps(IDataManager dataManager, string strDisasterNos, out string strErrorMessage);
        ActionStepData ReadActionStep(IDataManager dataManager, int actionStepNo, out string strErrorMessage);
        IEnumerable<SectionData> ReadSectionDatas(IDataManager dataManager, string strCondition, out string strErrorMessage);
    }
}
