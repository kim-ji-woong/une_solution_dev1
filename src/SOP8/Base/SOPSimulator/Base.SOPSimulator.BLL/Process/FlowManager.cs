using dnsDapperDBUtil.DataAccessLayer.IDAL;
using System.Collections.Generic;
using Base.SOPManager.IBLL.Models.Component;
using Base.Model.Sop.Component;
using Base.SOPSimulator.IBLL.Request;

namespace Base.SOPSimulator.BLL.Process
{
    class FlowManager
    {
        public static List<SectionData> GetNextSections(IDataManager dataManager, int componentNo, DecisionValue decisionValue, SOPManager.IBLL.IProcessManager sopProcessManager, out string strErrorMessage)
        {
            string strCondition = string.Format("a.{0} in (Select {1} from {2} where {3} = {4})",
                Component.Fields.compn_sn,
                Arrow.Fields.end_compn_sn,
                Arrow.TableName,
                Arrow.Fields.begin_compn_sn, componentNo);

            IEnumerable<SectionData> sectionDatas = sopProcessManager.ReadSectionDatas(dataManager, strCondition, out strErrorMessage);

            if (sectionDatas == null)
                return null;

            // Key : Section No
            // Value : 이 Section에 연결된 화살표(이 Section이 끝점인 화살표)
            Dictionary<int, Arrow> dicSectionArrows = GetSectionArrows(dataManager, componentNo, sectionDatas, decisionValue, out strErrorMessage);

            if (dicSectionArrows != null && strErrorMessage != null)
                return null;

            List<SectionData> results = new List<SectionData>();

            foreach (SectionData sectionData in sectionDatas)
            {
                // Comment는 제외
                if (sectionData.Comment != null)
                    continue;

                if (dicSectionArrows != null)
                {
                    Arrow arrow;

                    if (dicSectionArrows.TryGetValue(sectionData.Component.compn_sn, out arrow))
                    {
                        if (arrow.contents != null && arrow.contents.Length > 0 && arrow.contents != decisionValue.ArrowText)
                            continue;
                    }
                }

                results.Add(sectionData);
            }

            //results.AddRange(sectionDatas);
            return results;
        }

        // Key : Section No
        // Value : 이 Section에 연결된 화살표(이 Section이 끝점인 화살표)
        // 시작 컴포넌트로부터 뻗어져나간 화살표 목록을 얻어온다.
        private static Dictionary<int, Arrow> GetSectionArrows(IDataManager dataManager, int beginComponentNo, IEnumerable<SectionData> sectionDatas, DecisionValue decisionValue, out string strErrorMessage)
        {
            strErrorMessage = null;

            if (decisionValue == null || decisionValue.ArrowText == null || decisionValue.ArrowText.Length == 0)
                return null;

            Dictionary<int, Arrow> dicSectionArrows = new Dictionary<int, Arrow>();
            string strNextSectionNos = "";

            foreach (SectionData sectionData in sectionDatas)
            {
                // Comment는 제외
                if (sectionData.Comment != null)
                    continue;

                if (strNextSectionNos.Length == 0)
                    strNextSectionNos = sectionData.Component.compn_sn.ToString();
                else
                    strNextSectionNos += "," + sectionData.Component.compn_sn.ToString();
            }

            if (strNextSectionNos.Length > 0)
            {
                string strCondition = string.Format("{0} = {1} and {2} in ({3})", Arrow.Fields.begin_compn_sn, beginComponentNo, Arrow.Fields.end_compn_sn, strNextSectionNos);
                IEnumerable<Arrow> arrows = dataManager.GetSelect().Select<Arrow>(strCondition, out strErrorMessage);

                if (strErrorMessage != null)
                    return null;

                foreach (Arrow arrow in arrows)
                {
                    dicSectionArrows[arrow.end_compn_sn] = arrow;
                }
            }

            return dicSectionArrows;
        }
    }
}
