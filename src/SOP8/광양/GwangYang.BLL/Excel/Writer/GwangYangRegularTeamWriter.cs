using dnsExcelReport.Models;
using dnsExcelReport.Writer;
using NPOI.HSSF.UserModel;
using System.Collections.Generic;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using Base.Model.Common.Team;
using Base.DAL;
using System.Collections;
using NPOI.SS.UserModel;

namespace Gwangyang.BLL.Excel.Writer
{
    class GwangYangRegularTeamWriter : ExcelWriter
    {
        private const string Column_TeamName = "부서";
        private const string Column_MemberName = "이름";
        private const string Column_PhoneNumber = "휴대폰";
        private const string Column_OfficePhoneNumber = "사무실 전화번호";
        private const string Column_JobLevel = "직급";
        private const string Column_JobPosition = "직위";
        private const string Column_Email = "이메일";

        private const int NormalFontSize = 11;
        private const int RowHeight = 22;

        private IDataManager m_dataManager = null;
        private int? m_siteNo = null;

        public GwangYangRegularTeamWriter(IDataManager dataManager, int? siteNo)
        {
            m_dataManager = dataManager;
            m_siteNo = siteNo;
        }

        public static string GetColumnName(int index)
        {
            if (index == 0)
                return GwangYangRegularTeamWriter.Column_TeamName;
            else if (index == 1)
                return GwangYangRegularTeamWriter.Column_MemberName;
            else if (index == 2)
                return GwangYangRegularTeamWriter.Column_PhoneNumber;
            else if (index == 3)
                return GwangYangRegularTeamWriter.Column_OfficePhoneNumber;
            else if (index == 4)
                return GwangYangRegularTeamWriter.Column_JobLevel;
            else if (index == 5)
                return GwangYangRegularTeamWriter.Column_JobPosition;
            else if (index == 6)
                return GwangYangRegularTeamWriter.Column_Email;

            return null;
        }

        public static int GetColumnCount()
        {
            return 7;
        }

        protected override string GetSubject()
        {
            return "조직 정보";
        }

        protected override ICollection<SheetData> ReadSheetDatas(HSSFWorkbook workbook, out string strErrorMessage)
        {
            Dictionary<Regular, List<RegularMember>> dicRegularMembers = ReadRegularMembers(m_dataManager, m_siteNo, out strErrorMessage);

            if (dicRegularMembers == null)
                return null;

            Dictionary<int, Option> dicTeamOptions = ReadTeamOptions(m_dataManager, out strErrorMessage);

            if (dicTeamOptions == null)
                return null;

            Dictionary<int, Regular> dicRegulars = GetRegularTeams(m_dataManager, out strErrorMessage);

            if (dicRegulars == null)
                return null;

            List<SheetData> sheetDatas = new List<SheetData>();
            sheetDatas.Add(MakeSheet(workbook, dicRegularMembers, dicTeamOptions, dicRegulars));

            return sheetDatas;
        }

        private static Dictionary<int, Option> ReadTeamOptions(IDataManager dataManager, out string strErrorMessage)
        {
            IEnumerable<Option> options = dataManager.GetSelect().Select<Option>(null, out strErrorMessage);

            if (options == null)
                return null;

            Dictionary<int, Option> dicOptions = new Dictionary<int, Option>();

            foreach (Option option in options)
            {
                dicOptions[option.team_optn_no] = option;
            }

            return dicOptions;
        }

        private static Dictionary<Regular, List<RegularMember>> ReadRegularMembers(IDataManager dataManager, int? siteNo, out string strErrorMessage)
        {
            string strCondition = null;

            if (siteNo != null)
            {
                strCondition = string.Format("a.{0} = {1}", Regular.Fields.site_sn, (int)siteNo);
            }

            JoinManager joinManager = new JoinManager(dataManager);
            ArrayList arrDatas = joinManager.JoinRegularRegularMember(strCondition, out strErrorMessage);

            if (arrDatas == null)
                return null;

            Dictionary<int, Regular> dicRegulars = new Dictionary<int, Regular>();
            Dictionary<Regular, List<RegularMember>> dicRegularMembers = new Dictionary<Regular, List<RegularMember>>();

            int nDataCount = arrDatas.Count;

            for (int i = 0; i < nDataCount - 1; i += 2)
            {
                if (arrDatas[i] is Regular && arrDatas[i + 1] is RegularMember)
                {
                    Regular regular = (Regular)arrDatas[i];
                    RegularMember regularMember = (RegularMember)arrDatas[i + 1];

                    Regular _regular;

                    if (dicRegulars.TryGetValue(regular.rgl_sn, out _regular) == false)
                    {
                        _regular = regular;
                        dicRegulars[regular.rgl_sn] = _regular;
                    }

                    List<RegularMember> members;

                    if (dicRegularMembers.TryGetValue(_regular, out members) == false)
                    {
                        members = new List<RegularMember>();
                        dicRegularMembers[_regular] = members;
                    }

                    members.Add(regularMember);
                }
            }

            return dicRegularMembers;
        }

        private static Dictionary<int, Regular> GetRegularTeams(IDataManager dataManager, out string strErrorMessage)
        {
            IEnumerable<Regular> regulars = dataManager.GetSelect().Select<Regular>(null, out strErrorMessage);

            if (regulars == null)
                return null;

            Dictionary<int, Regular> dicRegulars = new Dictionary<int, Regular>();

            foreach (Regular regular in regulars)
            {
                dicRegulars[regular.rgl_sn] = regular;
            }

            return dicRegulars;
        }

        private static string GetTeamPath(Regular team, Dictionary<int, Regular> dicTeams)
        {
            string strTeamPath = team.team_name;

            while (team.parnts_sn != null && team.parnts_sn > 0)
            {
                Regular parent;

                if (dicTeams.TryGetValue((int)team.parnts_sn, out parent) == false)
                    break;

                strTeamPath = parent.team_name + "/" + strTeamPath;
                team = parent;
            }

            return strTeamPath;
        }

        private SheetData MakeSheet(HSSFWorkbook workbook, Dictionary<Regular, List<RegularMember>> dicRegularMembers, Dictionary<int, Option> dicTeamOptions, Dictionary<int, Regular> dicRegulars)
        {
            SheetData sheetData = new SheetData(GetSubject());
            SetTitles(workbook, sheetData, dicRegularMembers.Count == 0);

            Dictionary<int, ICellStyle> dicStyles = new Dictionary<int, ICellStyle>();
            int memberCount = 0;

            foreach (var pair in dicRegularMembers)
            {
                memberCount += pair.Value.Count;
            }

            Dictionary<int, Regular> dicUsedTeams = new Dictionary<int, Regular>();
            int index = 0;

            foreach (var pair in dicRegularMembers)
            {
                Regular regular = pair.Key;
                SetUsedTeam(regular, dicUsedTeams, dicRegulars);

                foreach (RegularMember regularMember in pair.Value)
                {
                    string strJobLevel = null;
                    string strJobPosition = null;

                    if (regularMember.clsf_no != null)
                    {
                        Option option;

                        if (dicTeamOptions.TryGetValue((int)regularMember.clsf_no, out option))
                        {
                            strJobLevel = option.team_optn_name;
                        }
                    }

                    if (regularMember.ofcps_no != null)
                    {
                        Option option;

                        if (dicTeamOptions.TryGetValue((int)regularMember.ofcps_no, out option))
                        {
                            strJobPosition = option.team_optn_name;
                        }
                    }

                    if (regularMember.telno != null && regularMember.telno.Length > 0)
                    {
                        regularMember.telno = dnsDapperDBUtil.AES256Cipher.AES_decrypt(regularMember.telno);
                    }

                    sheetData.ColumnDatas[0].Add(GetText(GetTeamPath(regular, dicRegulars)));
                    sheetData.ColumnDatas[1].Add(GetText(regularMember.memb_name));
                    sheetData.ColumnDatas[2].Add(GetText(regularMember.telno));
                    sheetData.ColumnDatas[3].Add(GetText(regularMember.offm_telno));
                    sheetData.ColumnDatas[4].Add(GetText(strJobLevel));
                    sheetData.ColumnDatas[5].Add(GetText(strJobPosition));
                    sheetData.ColumnDatas[6].Add(GetText(regularMember.email));

                    index++;
                }
            }

            int teamCount = MakeEmptyTeamSheet(dicUsedTeams, dicRegulars, sheetData);

            for (int i = 0; i < index + teamCount; i++)
            {
                sheetData.RowHeight[i] = RowHeight;

                for (int j = 0; j < GetColumnCount(); j++)
                {
                    SetBodyStyle(workbook, sheetData, dicStyles, i, memberCount + teamCount, j);
                }
            }

            return sheetData;
        }

        private void SetUsedTeam(Regular regular, Dictionary<int, Regular> dicUsedTeams, Dictionary<int, Regular> dicRegulars)
        {
            dicUsedTeams[regular.rgl_sn] = regular;

            if (regular.parnts_sn != null)
            {
                Regular parent;

                if (dicRegulars.TryGetValue((int)regular.parnts_sn, out parent))
                    SetUsedTeam(parent, dicUsedTeams, dicRegulars);
            }
        }

        private int MakeEmptyTeamSheet(Dictionary<int, Regular> dicUsedTeams, Dictionary<int, Regular> dicRegulars, SheetData sheetData)
        {
            List<Regular> unusedTeams = new List<Regular>();

            foreach (KeyValuePair<int, Regular> pair in dicRegulars)
            {
                if (dicUsedTeams.ContainsKey(pair.Key))
                    continue;

                unusedTeams.Add(pair.Value);
            }

            bool isChanged = false;

            do
            {
                for (int i = unusedTeams.Count - 1; i >= 0; i--)
                {
                    Regular regular = unusedTeams[i];
                    isChanged = RemoveParents(regular, unusedTeams);

                    if (isChanged)
                        break;
                }
            }
            while (isChanged);

            foreach (Regular regular in unusedTeams)
            {
                sheetData.ColumnDatas[0].Add(GetText(GetTeamPath(regular, dicRegulars)));
                sheetData.ColumnDatas[1].Add(GetText(""));
                sheetData.ColumnDatas[2].Add(GetText(""));
                sheetData.ColumnDatas[3].Add(GetText(""));
                sheetData.ColumnDatas[4].Add(GetText(""));
                sheetData.ColumnDatas[5].Add(GetText(""));
                sheetData.ColumnDatas[6].Add(GetText(""));
            }

            return unusedTeams.Count;
        }

        private bool RemoveParents(Regular regular, List<Regular> unusedTeams, bool isChanged = false)
        {
            if (regular.parnts_sn != null)
            {
                int count = unusedTeams.Count;

                for (int i = 0; i < count; i++)
                {
                    Regular team = unusedTeams[i];

                    if (team.rgl_sn == (int)regular.parnts_sn)
                    {
                        unusedTeams.RemoveAt(i);
                        return RemoveParents(team, unusedTeams, true);
                    }
                }
            }

            return isChanged;
        }

        protected override int WritePrev(ISheet sheet, HSSFWorkbook workbook)
        {
            double dPixelWidth = sheet.GetColumnWidthInPixels(0);
            double dWidth = sheet.GetColumnWidth(0);

            sheet.SetColumnWidth(0, GetColumnWidth(dPixelWidth, dWidth, 70));
            sheet.SetColumnWidth(1, GetColumnWidth(dPixelWidth, dWidth, 70));
            sheet.SetColumnWidth(2, GetColumnWidth(dPixelWidth, dWidth, 130));
            sheet.SetColumnWidth(3, GetColumnWidth(dPixelWidth, dWidth, 150));
            sheet.SetColumnWidth(4, GetColumnWidth(dPixelWidth, dWidth, 64));
            sheet.SetColumnWidth(5, GetColumnWidth(dPixelWidth, dWidth, 64));
            sheet.SetColumnWidth(6, GetColumnWidth(dPixelWidth, dWidth, 150));

            return 0;
        }

        protected override void WritePost(ISheet sheet, HSSFWorkbook workbook)
        {
        }

        private double GetColumnWidth(double standardPixelWidth, double standardWidth, double dPixelWidth)
        {
            return standardWidth * dPixelWidth / standardPixelWidth;
        }

        private void SetBodyStyle(HSSFWorkbook workbook, SheetData sheetData, Dictionary<int, ICellStyle> dicStyles, int rowIndex, int historyCount, int columnIndex)
        {
            int rowMode = 0;

            if (rowIndex == 0)
                rowMode = (int)TableBodyRow.Top;

            if (rowIndex == historyCount - 1)
                rowMode |= (int)TableBodyRow.Bottom;

            if (rowIndex > 0 && rowIndex < historyCount - 1)
                rowMode = (int)TableBodyRow.Middle;

            TableHeaderMode headerMode;

            if (columnIndex == 0)
                headerMode = TableHeaderMode.Left;
            else if (columnIndex == GetColumnCount() - 1)
                headerMode = TableHeaderMode.Right;
            else
                headerMode = TableHeaderMode.Middle;

            ICellStyle style = GetBodyStyle(workbook, dicStyles, headerMode, rowMode);

            Dictionary<int, ICellStyle> _dicStyles;

            if (sheetData.CellStyles.TryGetValue(columnIndex, out _dicStyles) == false)
            {
                _dicStyles = new Dictionary<int, ICellStyle>();
                sheetData.CellStyles[columnIndex] = _dicStyles;
            }

            _dicStyles[rowIndex] = style;
        }

        private void SetTitles(HSSFWorkbook workbook, SheetData sheetData, bool isEmpty)
        {
            for (int i = 0; i < GetColumnCount(); i++)
            {
                sheetData.Titles[i] = GetColumnName(i);
            }

            ICellStyle leftHeader = GetHeaderStyle(workbook, TableHeaderMode.Left);
            ICellStyle middleHeader = GetHeaderStyle(workbook, TableHeaderMode.Middle);
            ICellStyle rightHeader = GetHeaderStyle(workbook, TableHeaderMode.Right);

            if (isEmpty)
            {
                leftHeader.BorderBottom = BorderStyle.Medium;
                middleHeader.BorderBottom = BorderStyle.Medium;
                rightHeader.BorderBottom = BorderStyle.Medium;
            }

            int titleCount = sheetData.Titles.Count;

            foreach (KeyValuePair<int, string> pair in sheetData.Titles)
            {
                sheetData.ColumnDatas[pair.Key] = new List<string>();

                if (pair.Key == 0)
                    sheetData.TitleStyles[pair.Key] = leftHeader;
                else if (pair.Key == titleCount - 1)
                    sheetData.TitleStyles[pair.Key] = rightHeader;
                else
                    sheetData.TitleStyles[pair.Key] = middleHeader;
            }

            sheetData.TitleRowHeight = RowHeight;
        }

        private string GetText(string strText)
        {
            if (strText != null && strText.Length > 0)
                return strText;

            return "-";
        }

        private ICellStyle GetHeaderStyle(HSSFWorkbook workbook, TableHeaderMode headerMode)
        {
            ICellStyle style = workbook.CreateCellStyle();
            style.Alignment = HorizontalAlignment.Center;
            style.VerticalAlignment = VerticalAlignment.Center;

            IFont font = workbook.CreateFont();
            font.FontHeightInPoints = NormalFontSize;
            style.SetFont(font);

            style.BorderTop = BorderStyle.Medium;
            style.BorderBottom = BorderStyle.Double;

            if (headerMode == TableHeaderMode.Left)
            {
                style.BorderLeft = BorderStyle.Medium;
                style.BorderRight = BorderStyle.Dotted;
            }
            else if (headerMode == TableHeaderMode.Middle)
            {
                style.BorderLeft = BorderStyle.Dotted;
                style.BorderRight = BorderStyle.Dotted;
            }
            else if (headerMode == TableHeaderMode.Right)
            {
                style.BorderLeft = BorderStyle.Dotted;
                style.BorderRight = BorderStyle.Medium;
            }

            style.FillPattern = FillPattern.SolidForeground;
            style.FillForegroundColor = IndexedColors.LightTurquoise.Index;
            return style;
        }

        private ICellStyle GetBodyStyle(HSSFWorkbook workbook, Dictionary<int, ICellStyle> dicStyles, TableHeaderMode headerMode, int rowMode)
        {
            ICellStyle style;
            int key = (((int)headerMode) << 16) | rowMode;

            if (dicStyles.TryGetValue(key, out style))
                return style;

            style = workbook.CreateCellStyle();
            style.Alignment = HorizontalAlignment.Center;
            style.VerticalAlignment = VerticalAlignment.Center;

            IFont font = workbook.CreateFont();
            font.FontHeightInPoints = NormalFontSize;
            style.SetFont(font);

            if (IsTop(rowMode))
            {
                style.BorderTop = BorderStyle.Double;

                if (IsBottom(rowMode))
                    style.BorderBottom = BorderStyle.Medium;
                else
                    style.BorderBottom = BorderStyle.Dotted;
            }
            else if (IsVMiddle(rowMode))
            {
                style.BorderTop = BorderStyle.Dotted;

                if (IsBottom(rowMode))
                    style.BorderBottom = BorderStyle.Medium;
                else
                    style.BorderBottom = BorderStyle.Dotted;
            }
            else
            {
                style.BorderTop = BorderStyle.Dotted;
                style.BorderBottom = BorderStyle.Medium;
            }

            if (headerMode == TableHeaderMode.Left)
            {
                style.BorderLeft = BorderStyle.Medium;
                style.BorderRight = BorderStyle.Dotted;
            }
            else if (headerMode == TableHeaderMode.Right)
            {
                style.BorderLeft = BorderStyle.Dotted;
                style.BorderRight = BorderStyle.Medium;
            }
            else
            {
                style.BorderLeft = BorderStyle.Dotted;
                style.BorderRight = BorderStyle.Dotted;
            }

            dicStyles[key] = style;
            return style;
        }
    }
}
