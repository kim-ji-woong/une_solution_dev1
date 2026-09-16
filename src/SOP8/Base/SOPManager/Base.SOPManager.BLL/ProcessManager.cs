using Base.SOPManager.IBLL;
using Base.SOPManager.IBLL.Response;
using Base.SOPManager.IBLL.Models;
using Base.SOPManager.IBLL.Models.Category;
using Base.SOPManager.IBLL.Request;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using Response;
using System.Collections.Generic;
using Base.SOPManager.IBLL.Models.Component;

namespace Base.SOPManager.BLL
{
    using Process;
    using Process.Utility;
    using Process.Validation;

    public class ProcessManager : IProcessManager
    {
        private IDataManager m_dataManager = null;

        public ProcessManager(IDataManager dataManager)
        {
            m_dataManager = dataManager;
        }

        /// <summary>
        /// 전체 SOP 목록을 얻어온다.
        /// 각 SOP의 상세 내용도 같이 받아온다.
        /// </summary>
        public ResponseDisasterCategories RequestDisasterCategories(int nSiteNo, bool? isNormal)
        {
            LoadManager loadManager = new LoadManager(m_dataManager);
            return loadManager.RequestDisasterCategories(nSiteNo, isNormal);
        }

        /// <summary>
        /// 전체 SOP 목록을 얻어온다.
        /// 각 SOP의 상세 내용은 제외하고 ActionStep 까지만 가져온다.
        /// </summary>
        public ResponseDisasterCategories RequestDisasterCategoryList(int nSiteNo, bool? isNormal)
        {
            LoadManager loadManager = new LoadManager(m_dataManager);
            return loadManager.RequestDisasterCategoryList(nSiteNo, isNormal);
        }

        /// <summary>
        /// 표준 ActionStep 이름 목록을 얻어온다.
        /// </summary>
        public ResponseActionStepDatas RequestDefaultActionStepDatas(int nSiteNo)
        {
            LoadManager loadManager = new LoadManager(m_dataManager);
            return loadManager.GetDefaultActionStepDatas(nSiteNo);
        }

        /// <summary>
        /// StepMember 객체를 생성한다.
        /// </summary>
        public ResponseStepMemberData RequestDefaultStepMemberData(int nActionStepNo)
        {
            LoadManager loadManager = new LoadManager(m_dataManager);
            return loadManager.GetDefaultStepMemberData(nActionStepNo);
        }

        /// <summary>
        /// 특정 재난번호(SOP 번호)를 사용하여 해당 SOP에 대한 전체 버전정보를 얻어온다.
        /// </summary>
        public ResponseDisasterVersions RequestDisasterVersions(int nDisasterNo)
        {
            LoadManager loadManager = new LoadManager(m_dataManager);
            return loadManager.GetDisasterVersions(nDisasterNo);
        }

        /// <summary>
        /// DB에 SOP를 저장한다.
        /// </summary>
        public ResponseSave SaveDB(int nUserNo, SOPData sopData)
        {
            SaveManager saveManager = new SaveManager(m_dataManager);
            return saveManager.SaveDB(nUserNo, sopData);
        }

        /// <summary>
        /// XML 파일에 SOP를 저장한다.
        /// </summary>
        public ResponseSave SaveXML(SOPData sopData)
        {
            return XMLManager.Save(sopData, m_dataManager);
        }

        /// <summary>
        /// DB로부터 SOP를 불러온다.
        /// </summary>
        public ResponseOpen OpenDB(int nDisasterNo)
        {
            LoadManager loadManager = new LoadManager(m_dataManager);
            return loadManager.OpenDB(nDisasterNo);
        }

        /// <summary>
        /// DB로부터 전체 SOP를 불러온다.
        /// </summary>
        public ResponseOpenAll OpenAll(int? siteNo)
        {
            LoadManager loadManager = new LoadManager(m_dataManager);
            return loadManager.OpenAll(siteNo);
        }

        /// <summary>
        /// 특정 SOP를 삭제한다.
        /// </summary>
        public MessageResult Delete(RequestDelete request)
        {
            return DeleteManager.DeleteSOP(request, m_dataManager);
        }

        /// <summary>
        /// 외부 프로그램 목록을 얻어온다.
        /// </summary>
        /// <param name="nProgramNo">0보다 작으면 전체 목록을 얻어온다.</param>
        /*public ResponseExternalProgram GetExternalProgram(int nProgramNo)
        {
            LoadManager loadManger = new LoadManager(m_dataManager);
            return loadManger.GetExternalProgram(nProgramNo);
        }*/

        /// <summary>
        /// 특수문자가 포함된 문자열을 해독한다.
        /// </summary>
        public ResponseParseSpecialMessage ParseSpecialMessage(RequestParseSpecialMessage data)
        {
            return Parser.ParseSpecialMessage(data);
        }

        /// <summary>
        /// 전체 특수문자 목록을 얻어온다.
        /// </summary>
        public ResponseSpecialMessageList GetSpecialMessageList()
        {
            LoadManager loadManager = new LoadManager(m_dataManager);
            return loadManager.GetSpecialMessageList();
        }

        /// <summary>
        /// 전체 LinkedSOP 목록을 얻어온다.
        /// </summary>
        public ResponseLinkedSOPs GetLinkedSOPs(RequestLinkedSOP data)
        {
            LoadManager loadManager = new LoadManager(m_dataManager);
            return loadManager.GetLinkedSOPs(data);
        }

        /// <summary>
        /// LinkedSOP를 저장한다.
        /// </summary>
        public MessageResult SaveLinkedSOPs(SaveLinkedSOPs data)
        {
            SaveManager saveManager = new SaveManager(m_dataManager);
            return saveManager.SaveLinkedSOPs(data);
        }

        /// <summary>
        /// 연결 설정된 SOP의 버전 개수가 몇개인지 확인한다.
        /// </summary>
        public ResponseLoadLinkedSopVersions LoadLinkedSopVersions(int nSiteNo, List<int> versionNos)
        {
            LoadManager loadManager = new LoadManager(m_dataManager);
            return loadManager.LoadLinkedSopVersions(nSiteNo, versionNos);
        }

        /// <summary>
        /// DB에 저장할 수 있는 문제없는 Section인지 검사한다.
        /// </summary>
        public MessageResult CheckSectionData(CheckSectionData data)
        {
            return ValidationChecker.CheckSectionData(m_dataManager, data);
        }

        /// <summary>
        /// XML 파일을 불러온다.
        /// </summary>
        public ResponseOpen OpenXML(string strXML, int siteNo)
        {
            return XMLManager.Open(m_dataManager, strXML, siteNo);
        }

        public IEnumerable<ActionStepData> ReadActionSteps(IDataManager dataManager, string strDisasterNos, out string strErrorMessage)
        {
            LoadManager loadManager = new LoadManager(m_dataManager);
            return loadManager.ReadActionSteps(dataManager, strDisasterNos, true, out strErrorMessage);
        }

        public ActionStepData ReadActionStep(IDataManager dataManager, int actionStepNo, out string strErrorMessage)
        {
            LoadManager loadManager = new LoadManager(m_dataManager);
            return loadManager.ReadActionStep(dataManager, actionStepNo, out strErrorMessage);
        }

        public IEnumerable<SectionData> ReadSectionDatas(IDataManager dataManager, string strCondition, out string strErrorMessage)
        {
            LoadManager loadManager = new LoadManager(m_dataManager);
            return loadManager.ReadSectionDatas(dataManager, strCondition, out strErrorMessage);
        }
    }
}
