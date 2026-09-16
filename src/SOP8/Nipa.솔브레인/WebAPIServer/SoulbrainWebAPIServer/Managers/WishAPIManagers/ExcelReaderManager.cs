using ClosedXML.Excel;
using SoulbrainWebAPIServer.Model;
using System;
using System.Collections.Generic;
using System.IO;

namespace SoulbrainWebAPIServer.Managers
{
    public class ExcelReaderManager
    {
        private string m_strExcelPath;
        
        private int PLACE_ID_SheetNo = 2;
        private int PLACE_ID2_SheetNo = 3;
        private int PLACE_ID3_SheetNo = 4;
        private int TEAM_SheetNo = 5;
        
        public ExcelReaderManager(string strExcelPath)
        {
            m_strExcelPath = strExcelPath;
        }

        private string GetFilePath()
        {
            string baseDirectory = AppDomain.CurrentDomain.BaseDirectory;
            string filePath = Path.Combine(baseDirectory, m_strExcelPath);
            string[] arrDir = m_strExcelPath.Split('\\'); // 경로는 Data\\엑셀명
            
            if (!File.Exists(filePath))
            {
                string parentDirectory = Directory.GetParent(baseDirectory)?.FullName ?? "";
                filePath = Path.Combine(parentDirectory, arrDir[^2], arrDir[^1]);
            }
            
            return filePath;
        }
        
        public void SetExcelData(
            ref Dictionary<string, string> dicTeamData, 
            ref Dictionary<string, BuildingData> dicPlaceID,
            ref Dictionary<string, BuildingData> dicPlaceID2,
            ref Dictionary<string, BuildingData> dicPlaceID3
            )
        {
            try
            {
                string strFilePath = GetFilePath();
                
                if (!File.Exists(strFilePath))
                {
                    throw new FileNotFoundException($@"Excel 파일을 찾을 수 없습니다. : {m_strExcelPath}");
                }

                using (var workbook = new XLWorkbook(m_strExcelPath))
                {
                    foreach (var sheet in workbook.Worksheets)
                    {
                        if (sheet.Position == PLACE_ID_SheetNo)
                            SetBuildingGroupData(sheet, ref dicPlaceID);
                        else if (sheet.Position == PLACE_ID2_SheetNo)
                            SetBuildingData(sheet, ref dicPlaceID2);
                        else if (sheet.Position == PLACE_ID3_SheetNo)
                            SetZoneData(sheet, ref dicPlaceID3);
                        else if (sheet.Position == TEAM_SheetNo)
                            SetTeamData(sheet, ref dicTeamData);
                    }
                    
                }
            }
            catch (Exception e)
            {
                Logger.Instance.Write("[Error] ExcelReaderManager.SetExcelData: " + e.Message);
            }
        }

        /// <summary>
        /// 빌딩 그룹 데이터 가공
        /// </summary>
        /// <param name="sheet"></param>
        /// <param name="dicBuildingGroupData"></param>
        private void SetBuildingGroupData(IXLWorksheet sheet, ref Dictionary<string, BuildingData> dicBuildingGroupData)
        {
            // 값이 있는 마지막 Row Num
            int lastRowNum = sheet.LastRowUsed()?.RowNumber() ?? 1;

            for (int targetRowNum = 2; targetRowNum <= lastRowNum; targetRowNum++)
            {
                string bgCode;
                int nID;
                string strBgName;
                string? strBgDisplayName = null;
                int? nFloorIndex = null;
                
                IXLCell cellBgCode = sheet.Cell(targetRowNum, 1);
                IXLCell cellID = sheet.Cell(targetRowNum, 4);
                IXLCell cellBgName = sheet.Cell(targetRowNum, 2);
                IXLCell cellDisplayName = sheet.Cell(targetRowNum, 5);
                IXLCell cellFloorIndex = sheet.Cell(targetRowNum, 6);

                if (cellBgCode.Value.IsBlank)
                {
                    Logger.Instance.Write($@"잘못된 엑셀 값입니다. Sheet: {sheet.Name} Row: {targetRowNum}, Col: 1");
                    return;
                }
                
                // BuildingData 제공시 필수
                if (cellID.Value.IsBlank || cellBgName.Value.IsBlank)
                {
                    Logger.Instance.Write($@"잘못된 엑셀 값입니다. Sheet: {sheet.Name} Row: {targetRowNum}, Col: 4, 2");
                    return;
                }
                
                bgCode = cellBgCode.Value.ToString();
                nID = int.Parse(cellID.Value.ToString());
                strBgName = cellBgName.Value.ToString();

                if (!cellDisplayName.Value.IsBlank && cellDisplayName.Value.IsText)
                    strBgDisplayName = cellDisplayName.Value.ToString();
                
                if (!cellFloorIndex.Value.IsBlank && cellFloorIndex.Value.IsNumber)
                    nFloorIndex = int.Parse(cellFloorIndex.Value.ToString());
                
                BuildingData bgData = new BuildingData(nID, strBgName, strBgDisplayName, nFloorIndex);
                
                dicBuildingGroupData.Add(bgCode, bgData);
            }
        }

        /// <summary>
        /// 빌딩 데이터 가공
        /// </summary>
        /// <param name="sheet"></param>
        /// <param name="dicBuildingData"></param>
        private void SetBuildingData(IXLWorksheet sheet, ref Dictionary<string, BuildingData> dicBuildingData)
        {
            // 값이 있는 마지막 Row Num
            int lastRowNum = sheet.LastRowUsed()?.RowNumber() ?? 1;

            for (int targetRowNum = 2; targetRowNum <= lastRowNum; targetRowNum++)
            {
                string bgCode;
                int nID;
                string strBgName;
                
                IXLCell cellBgCode = sheet.Cell(targetRowNum, 1);
                IXLCell cellID = sheet.Cell(targetRowNum, 4);
                IXLCell cellBgName = sheet.Cell(targetRowNum, 2);
                
                // BuildingData 제공시 필수
                if (cellBgCode.Value.IsBlank || cellID.Value.IsBlank || cellBgName.Value.IsBlank)
                {
                    Logger.Instance.Write($@"잘못된 엑셀 값입니다. Sheet: {sheet.Name} Row: {targetRowNum}, Col: 1, 2, 4");
                    return;
                }
                
                bgCode = cellBgCode.Value.ToString();
                nID = int.Parse(cellID.Value.ToString());
                strBgName = cellBgName.Value.ToString();

                BuildingData bgData = new BuildingData(nID, strBgName);
                
                dicBuildingData.Add(bgCode, bgData);
            }
        }
        
        /// <summary>
        /// 존 데이터 가공
        /// </summary>
        /// <param name="sheet"></param>
        /// <param name="dicZoneData"></param>
        private void SetZoneData(IXLWorksheet sheet, ref Dictionary<string, BuildingData> dicZoneData)
        {
            // 값이 있는 마지막 RowNum
            int lastRowNum = sheet.LastRowUsed()?.RowNumber() ?? 1;

            for (int targetRowNum = 2; targetRowNum <= lastRowNum; targetRowNum++)
            {
                string bCode;
                int nID;
                string strBuildingName;
                int nFloorIndex;

                IXLCell cellBuildingCode = sheet.Cell(targetRowNum, 1);
                IXLCell cellBuildingID = sheet.Cell(targetRowNum, 4);
                IXLCell cellBuildingName = sheet.Cell(targetRowNum, 2);
                IXLCell cellFloorIndex = sheet.Cell(targetRowNum, 5);

                if (cellBuildingCode.Value.IsBlank || cellBuildingID.Value.IsBlank || cellBuildingName.Value.IsBlank)
                {
                    Logger.Instance.Write($@"잘못된 엑셀 값입니다. Sheet: {sheet.Name} Row: {targetRowNum}, Col: 1, 2, 4");
                    return;
                }
                
                bCode = cellBuildingCode.Value.ToString();
                nID = int.Parse(cellBuildingID.Value.ToString());
                strBuildingName = cellBuildingName.Value.ToString();

                if (!cellFloorIndex.Value.IsBlank && cellFloorIndex.Value.IsText)
                {
                    BuildingData bgData = new BuildingData(nID, strBuildingName, null, int.Parse(cellFloorIndex.Value.ToString()));
                    dicZoneData.Add(bCode, bgData);
                }
                else
                {
                    BuildingData bgData = new BuildingData(nID, strBuildingName, null, null);
                    dicZoneData.Add(bCode, bgData);
                }
            }            
            
        }
        
        private void SetTeamData(IXLWorksheet sheet, ref Dictionary<string, string> dicTeamData)
        {
            int lastRowNum = sheet.LastRowUsed()?.RowNumber() ?? 1;

            for (int targetRowNum = 2; targetRowNum <= lastRowNum; targetRowNum++)
            {
                IXLCell cellTeamCode = sheet.Cell(targetRowNum, 1);
                IXLCell cellTeamName = sheet.Cell(targetRowNum, 2);

                if (cellTeamCode.Value.IsBlank || !cellTeamCode.Value.IsText)
                {
                    Logger.Instance.Write($@"부서정보가 잘못되었습니다. Sheet: {sheet.Name} Row: {targetRowNum}, Col: 1");
                    return;
                }

                if (cellTeamName.Value.IsBlank || !cellTeamName.Value.IsText)
                {
                    Logger.Instance.Write($@"부서정보가 잘못되었습니다. Sheet: {sheet.Name} Row: {targetRowNum}, Col: 2");
                    return;
                }
                
                string strTeamCode = cellTeamCode.Value.ToString();
                string strTeamName = cellTeamName.Value.ToString();
                
                dicTeamData.Add(strTeamCode, strTeamName);
            }
        }
    }
}