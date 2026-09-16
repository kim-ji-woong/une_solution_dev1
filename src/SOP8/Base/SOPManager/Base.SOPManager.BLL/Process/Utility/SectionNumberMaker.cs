using System.Collections.Generic;
using Base.SOPManager.IBLL.Models.Component;
using dnsData.CommonCode;
using Base.Model.Sop.Component;

namespace Base.SOPManager.BLL.Process.Utility
{
    class SectionNumberMaker
    {
        public static void SetSectionNumbers(List<StepMemberData> stepMemberDatas)
        {
            SectionData beginSection = null;
            Dictionary<SectionData, List<SectionData>> dicLinkedSections = new Dictionary<SectionData, List<SectionData>>();

            List<SectionData> linkedSections;

            foreach (StepMemberData stepMemberData in stepMemberDatas)
            {
                Dictionary<long, SectionData> dicSections = new Dictionary<long, SectionData>();

                foreach (SectionData sectionData in stepMemberData.Sections)
                {
                    if (sectionData.Component.compn_code == Sop.ComponentType.Endpoint || sectionData.Component.compn_code == Sop.ComponentType.Endpoint - (int)CodeType.ComponentType)
                    {
                        EndpointData endpointData = (EndpointData)sectionData.Component;

                        if (endpointData.Endpoint.begin_yn)
                            beginSection = sectionData;
                    }

                    long key = ((((long)sectionData.Component.column_no) << 32) | ((long)sectionData.Component.row_no));
                    dicSections[key] = sectionData;

                    dicSections[sectionData.Component.compn_sn] = sectionData;
                }

                foreach (ArrowData arrowData in stepMemberData.Arrows)
                {
                    if (arrowData.BeginColumnIndex >= 0 && arrowData.BeginRowIndex >= 0 &&
                        arrowData.EndColumnIndex >= 0 && arrowData.EndRowIndex >= 0)
                    {
                        long keyBegin = ((((long)arrowData.BeginColumnIndex) << 32) | ((long)arrowData.BeginRowIndex));
                        long keyEnd = ((((long)arrowData.EndColumnIndex) << 32) | ((long)arrowData.EndRowIndex));

                        SectionData sectionBegin, sectionEnd;

                        if (dicSections.TryGetValue(keyBegin, out sectionBegin) && dicSections.TryGetValue(keyEnd, out sectionEnd))
                        {
                            if (dicLinkedSections.TryGetValue(sectionBegin, out linkedSections) == false)
                            {
                                linkedSections = new List<SectionData>();
                                dicLinkedSections[sectionBegin] = linkedSections;
                            }

                            if (linkedSections.Contains(sectionEnd) == false)
                            {
                                linkedSections.Add(sectionEnd);
                            }
                        }
                    }
                }
            }

            if (beginSection == null)
                return;

            int nSectionNumber = 1;
            beginSection.SectionNumber = nSectionNumber;
            SetSectionNumbers(beginSection, dicLinkedSections, ref nSectionNumber);
        }

        private static void SetSectionNumbers(SectionData sectionData, Dictionary<SectionData, List<SectionData>> dicLinkedSections, ref int nSectionNumber)
        {
            List<SectionData> sections;

            if (dicLinkedSections.TryGetValue(sectionData, out sections))
            {
                List<SectionData> sectionDatas = new List<SectionData>();

                foreach (SectionData section in sections)
                {
                    if (section.Component.compn_code == Sop.ComponentType.Comment || sectionData.Component.compn_code == Sop.ComponentType.Comment - (int)CodeType.ComponentType)
                        continue;

                    if (section.SectionNumber == null)
                    {
                        section.SectionNumber = ++nSectionNumber;
                        sectionDatas.Add(section);
                    }
                }

                foreach (SectionData section in sectionDatas)
                {
                    SetSectionNumbers(section, dicLinkedSections, ref nSectionNumber);
                }
            }
        }
    }
}
