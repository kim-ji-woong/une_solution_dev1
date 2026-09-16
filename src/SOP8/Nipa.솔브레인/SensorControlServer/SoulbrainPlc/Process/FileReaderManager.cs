using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;

using ClosedXML.Excel;

using dnsDapperDBUtil.DataAccessLayer.IDAL;
using dnsPipeHelper;
using Soulbrain.Model.History;

namespace SoulbrainPlc.Process
{
    public class FileReaderManager
    {
        private PlcDataManager m_plcDataManager = null;
        private IDataManager m_dataManager;
        private PlcManager m_parent;

        private long m_nLastReadPosition = 0;
        private bool m_bHasExcutedInitialBackup = false;
        private string m_strBackupPath = null;
        
        public FileReaderManager(IDataManager dataManager, PlcManager parent, string backupPath)
        {
            m_dataManager = dataManager;
            m_parent = parent;
            m_plcDataManager = new PlcDataManager(dataManager, parent);
            m_strBackupPath = backupPath;
        }

        public bool ReadFile(string strFilePath, DateTime dtReadMoment)
        {
            if (File.Exists(strFilePath) == false)
            {
                m_nLastReadPosition = 0;
                m_parent.Logger.Write($@"[ERROR] ReadFile() : File does not exist. FilePath = {strFilePath}");
                return false;
            }
            
            int rowCount = 0;
            DateTime lastProcessedTime = DateTime.MinValue;

            try
            {
                string strLastTm = GetLastDataTm();
                
                if (!DateTime.TryParse(strLastTm, out DateTime dtLastDbTime))
                {
                    m_parent.Logger.Write($@"[ERROR] ReadFile() : DateTime.TryParse() Error. strLastTm = {strLastTm}");
                    return false;
                }
            
                using (FileStream fs = new FileStream(strFilePath, FileMode.Open, FileAccess.Read, FileShare.ReadWrite))
                {
                    if (fs.Length < m_nLastReadPosition || m_nLastReadPosition == 0)
                    {
                        m_nLastReadPosition = 0;
                        fs.Seek(m_nLastReadPosition, SeekOrigin.Begin);

                        using (StreamReader sr = new StreamReader(fs, Encoding.Default, true, 1024, true))
                        {
                            string line;
                            long currentByteOffset = 0;

                            while ((line = sr.ReadLine()) != null)
                            {
                                int lineByteCount = Encoding.Default.GetBytes(line).Length + 2;

                                if (string.IsNullOrEmpty(line) || line.Trim().StartsWith("Date", StringComparison.OrdinalIgnoreCase))
                                {
                                    currentByteOffset += lineByteCount;
                                    continue;
                                }
                                
                                var cols = line.Split(',');

                                string col0 = cols.Length > 0 ? cols[0].Trim(' ', '"') : "";
                                string col1 = cols.Length > 1 ? cols[1].Trim(' ', '"') : "";

                                if (col0.Equals("Date", StringComparison.OrdinalIgnoreCase) || 
                                    col1.Equals("Date", StringComparison.OrdinalIgnoreCase))
                                {
                                    currentByteOffset += lineByteCount;
                                    continue;
                                }

                                int dateIdx = 0;
                                if (string.IsNullOrEmpty(col0) && cols.Length > 1) dateIdx = 1;

                                if (cols.Length >= dateIdx + 2)
                                {
                                    string dateStr = cols[dateIdx].Trim(' ', '"');
                                    string timeStr = cols[dateIdx + 1].Trim(' ', '"');

                                    if (DateTime.TryParse($"{dateStr} {timeStr}", out DateTime fileDt))
                                    {
                                        if (fileDt > dtLastDbTime)
                                        {
                                            m_nLastReadPosition = currentByteOffset;
                                            break; 
                                        }
                                    }
                                }
                                
                                currentByteOffset += lineByteCount;
                            }
                            
                            if (line == null) m_nLastReadPosition = currentByteOffset;
                        }
                    }
                    fs.Seek(m_nLastReadPosition, SeekOrigin.Begin);

                    using (StreamReader sr = new StreamReader(fs, Encoding.Default))
                    {
                        while (!sr.EndOfStream)
                        {
                            string line = sr.ReadLine();
                            rowCount++;

                            if (string.IsNullOrWhiteSpace(line))continue;
                            
                            string[] cols = line.Split(',');
                            
                            string col0 = cols.Length > 0 ? cols[0].Trim(' ', '"') : "";
                            string col1 = cols.Length > 1 ? cols[1].Trim(' ', '"') : "";

                            if (col0.Equals("Date", StringComparison.OrdinalIgnoreCase) || 
                                col1.Equals("Date", StringComparison.OrdinalIgnoreCase)) continue;

                            string strDateTime = $@"{cols[1].Trim(' ', '"')} {cols[2].Trim(' ', '"')}";
                            
                            if (!DateTime.TryParse(strDateTime, out DateTime dtTimestamp))
                            {
                                m_parent.Logger.Write($@"[ERROR] ReadFile() : DateTime.TryParse() Error. Line = {dtTimestamp} {rowCount}");
                                continue;
                            }
                            
                            lastProcessedTime = dtTimestamp;
                            
                            string[] plcValues = new string[12];
                            
                            for (int i = 2; i < plcValues.Length + 2; i++)
                            {
                                if (i >= cols.Length) 
                                {
                                    plcValues[i - 2] = "0"; // 적절하지 않은 데이터는 0으로 처리
                                }
                                else
                                {
                                    string sVal = cols[i + 1].Trim();
                                    plcValues[i - 2] = string.IsNullOrEmpty(sVal) ? "0" : sVal.Trim(' ', '"');
                                }
                            }
                            
                            if (m_plcDataManager == null)
                                throw new Exception($@"[ERROR] ReadFile() : m_plcDataManager is null.");

                            string rowLog = $@"Data Row : {dtTimestamp} {string.Join(" , ", plcValues)}";
                            m_parent.Logger.Write(rowLog);

                            if (m_plcDataManager.ProcessPlcData(dtReadMoment, dtTimestamp, plcValues) == false)
                            {
                                m_parent.Logger.Write($@"[ERROR] ReadFile() : ProcessPlcData() Error. ByteOffset = {sr.BaseStream.Position}");
                                m_parent.Logger.Write($@"[ERROR] ReadFile() : Line = {dtTimestamp} {rowCount}");
                            }
                        }

                        m_nLastReadPosition = fs.Position;
                    }
                }
                
                bool isEndOfDay = (lastProcessedTime != DateTime.MinValue && lastProcessedTime.Hour == 23 && lastProcessedTime.Minute == 59);

                if (!m_bHasExcutedInitialBackup || isEndOfDay)
                {
                    if (ProcessBackupByDate(strFilePath))
                    {
                        m_nLastReadPosition = 0; 
                        m_bHasExcutedInitialBackup = true; // 최초 실행 완료 처리
                        m_parent.Logger.Write($"[INFO] Backup Logic executed. (FirstRun or EndOfDay). File backed up.");
                    }
                    else
                    {
                        m_parent.Logger.Write($"[ERROR] Backup Logic executed. (FirstRun or EndOfDay). File not backed up.");
                    }
                }
                
                return true;
            }
            catch (Exception e)
            {
                m_nLastReadPosition = 0;
                m_parent.Logger.Write($@"[ERROR] ReadFile() : {e.Message}");
                return false;
            }
        }
        
        private bool ProcessBackupByDate(string sourceFilePath)
        {
            try
            {
                string[] allLines = File.ReadAllLines(sourceFilePath, Encoding.Default);
                if (allLines.Length == 0) return false;

                var dataByDate = new Dictionary<DateTime, List<string>>();

                foreach (var line in allLines)
                {
                    if (string.IsNullOrWhiteSpace(line)) continue;

                    var cols = line.Split(',');
                    if (cols.Length > 0 && cols[0].Trim().Equals("Date", StringComparison.OrdinalIgnoreCase)) continue;
                    if (cols.Length > 1 && cols[1].Trim().Equals("Date", StringComparison.OrdinalIgnoreCase)) continue;

                    if (cols.Length >= 3)
                    {
                        string dateStr = cols[1].Trim(' ', '"');
                        if (DateTime.TryParse(dateStr, out DateTime dt))
                        {
                            DateTime dateKey = dt.Date;
                            if (!dataByDate.ContainsKey(dateKey))
                            {
                                dataByDate[dateKey] = new List<string>();
                            }
                            dataByDate[dateKey].Add(line);
                        }
                    }
                }

                if (dataByDate.Count == 0 && allLines.Length > 0) 
                {
                    ClearSourceFile(sourceFilePath, allLines);
                    return true; 
                }

                foreach (var kvp in dataByDate)
                {
                    DateTime targetDate = kvp.Key;
                    List<string> linesToWrite = kvp.Value;

                    SaveToExcel(sourceFilePath, targetDate, linesToWrite);
                }

                ClearSourceFile(sourceFilePath, allLines);
                
                return true;
            }
            catch (Exception ex)
            {
                m_parent.Logger.Write($"[ERROR] ProcessBackupByDate() : {ex.Message}");
                return false;
            }
        }

        private void SaveToExcel(string sourceFilePath, DateTime targetDate, List<string> lines)
        {
            string backupDir = Path.Combine(m_strBackupPath, targetDate.ToString("yyyy"));
            string backupFileName = $"{targetDate:MMdd}.xlsx";
            string backupFilePath = Path.Combine(backupDir, backupFileName);

            if (!Directory.Exists(backupDir)) Directory.CreateDirectory(backupDir);

            using (var workbook = File.Exists(backupFilePath) ? new XLWorkbook(backupFilePath) : new XLWorkbook())
            {
                IXLWorksheet ws;
                bool isNewSheet = false;

                if (workbook.Worksheets.Contains("Data"))
                {
                    ws = workbook.Worksheet("Data");
                }
                else
                {
                    ws = workbook.Worksheets.Add("Data");
                    isNewSheet = true;
                }

                ws.ShowGridLines = false;
                int startRow;
                
                if (isNewSheet)
                {
                    ws.Range("B1:C1").Merge().Value = "일시";
                    ws.Range("D1:H1").Merge().Value = "포장실 미세먼지 측정기";
                    ws.Range("I1:M1").Merge().Value = "원료투입실 미세먼지 측정기";
                    ws.Range("N1:O1").Merge().Value = "2공장 집수정";

                    ws.Cell("B2").Value = "날짜";
                    ws.Cell("C2").Value = "시간";

                    string[] sensorHeaders = { "VOCS", "CO2", "초미세먼지", "미세먼지", "환풍기" };
                    for (int i = 0; i < sensorHeaders.Length; i++) ws.Cell(2, 4 + i).Value = sensorHeaders[i]; // D~H
                    for (int i = 0; i < sensorHeaders.Length; i++) ws.Cell(2, 9 + i).Value = sensorHeaders[i]; // I~M

                    ws.Cell("N2").Value = "수문개도율";
                    ws.Cell("O2").Value = "PH";

                    var headerRange = ws.Range("B1:O2");
                    headerRange.Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
                    headerRange.Style.Alignment.Vertical = XLAlignmentVerticalValues.Center;
                    headerRange.Style.Font.Bold = true;
                    
                    var topHeader = ws.Range("B1:O1");
                    topHeader.Style.Fill.BackgroundColor = XLColor.FromHtml("#289AFF");
                    topHeader.Style.Font.FontColor = XLColor.White;
                    
                    var subHeader = ws.Range("B2:O2");
                    subHeader.Style.Fill.BackgroundColor = XLColor.FromHtml("#BEBEBE");
                    subHeader.Style.Font.FontColor = XLColor.Black;

                    ws.Columns("B:O").AdjustToContents(2, 2);
                    
                    foreach (var col in ws.Columns("B:O"))
                    {
                        if (col.Width < 12) col.Width = 12;
                        if (col.Width > 40) col.Width = 40;
                    }
                    
                    startRow = 3;
                }
                else
                {
                    var lastRowUsed = ws.LastRowUsed();
                    startRow = lastRowUsed != null ? lastRowUsed.RowNumber() + 1 : 1;
                }

                int currentRow = startRow;
                foreach (var line in lines)
                {
                    var cols = line.Split(',');
                    if (cols.Length >= 3)
                    {
                        ws.Cell(currentRow, 2).Value = cols[1].Trim(' ', '"'); // 날짜
                        ws.Cell(currentRow, 3).Value = cols[2].Trim(' ', '"'); // 시간

                        for (int i = 0; i < 12; i++)
                        {
                            int csvIdx = 3 + i;
                            if (csvIdx < cols.Length)
                            {
                                string valStr = cols[csvIdx].Trim(' ', '"');
                                if (double.TryParse(valStr, out double dVal))
                                    ws.Cell(currentRow, 4 + i).Value = dVal;
                                else
                                    ws.Cell(currentRow, 4 + i).Value = valStr;
                            }
                            else
                            {
                                ws.Cell(currentRow, 4 + i).Value = 0;
                            }
                        }
                        currentRow++;
                    }
                }

                int lastRow = Math.Max(2, currentRow - 1);
                var allRange = ws.Range(1, 2, lastRow, 15);
                allRange.Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
                allRange.Style.Alignment.Vertical = XLAlignmentVerticalValues.Center;

                allRange.Style.Border.OutsideBorder = XLBorderStyleValues.Thin;
                allRange.Style.Border.InsideBorder = XLBorderStyleValues.Thin;
                
                //ws.Columns().AdjustToContents();
                workbook.SaveAs(backupFilePath);
            }
        }

        private void ClearSourceFile(string sourceFilePath, string[] allLines)
        {
            var headers = allLines.Where(l => l.StartsWith("Date", StringComparison.OrdinalIgnoreCase) || l.Contains("Date,Time")).Take(1).ToList();
            if (!headers.Any() && allLines.Length > 0) headers.Add(allLines[0]);
            
            File.WriteAllLines(sourceFilePath, headers, Encoding.Default);
        }

        private string GetLastDataTm()
        {
            DateTime GetMaxTime(string tableName, string colName)
            {
                string query = $@"SELECT TOP 1 {colName} FROM {tableName} ORDER BY {colName} DESC";
        
                IEnumerable<dynamic> result = m_dataManager.GetSelect().Select(query, out _);
        
                var item = result?.FirstOrDefault();
                if (item != null)
                {
                    try { return (DateTime)item.tm; } catch { m_parent.Logger.Write($@"[ERROR] GetMaxTime() : {item.tm} is not DateTime."); }
                }
                return DateTime.MinValue;
            }

            DateTime t1 = GetMaxTime(DustMeasurement.TableName, nameof(DustMeasurement.Fields.tm));
            DateTime t2 = GetMaxTime(WaterGather.TableName, nameof(WaterGather.Fields.tm));

            DateTime maxTime = t1 > t2 ? t1 : t2;

            if (maxTime == DateTime.MinValue)
                return DateTime.MinValue.ToString("yyyy-MM-dd HH:mm:ss");

            return maxTime.ToString("yyyy-MM-dd HH:mm:ss");
        }
    }
}