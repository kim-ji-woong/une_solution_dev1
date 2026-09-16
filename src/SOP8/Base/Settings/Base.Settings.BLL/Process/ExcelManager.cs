using System.Collections;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using dnsExcelReport.Writer;
using dnsExcelReport.Reader;
using dnsExcelReport.Models;
using Base.Settings.IBLL.Request;
using Response;

namespace Base.Settings.BLL.Process
{
    using Excel.Writer;
    using Excel.Reader;

    class ExcelManager
    {
        public enum Mode { None = 0, BuildingData = 1, BuildingGroupData };

        private IDataManager m_dataManager = null;

        public ExcelManager(IDataManager dataManager)
        {
            m_dataManager = dataManager;
        }

        public ResponseExcelInfo DownloadBuildingGroupData(RequestDownloadBuildingGroupData data)
        {
            ArrayList arrDatas = new ArrayList();
            arrDatas.Add(data.BuildingGroupNo);
            arrDatas.Add(data.SiteNo);

            return DownloadExcel(Mode.BuildingGroupData, arrDatas);
        }

        public ResponseExcelInfo DownloadBuildingData(RequestDownloadBuildingData data)
        {
            ArrayList arrDatas = new ArrayList();
            arrDatas.Add(data.BuildingNo);
            arrDatas.Add(data.SiteNo);

            return DownloadExcel(Mode.BuildingData, arrDatas);
        }

        public MessageResult UploadBuildingGroupData(string strFilePath, int? siteNo)
        {
            ArrayList arrDatas = new ArrayList();
            arrDatas.Add(strFilePath);
            arrDatas.Add(siteNo);

            return UploadExcel(Mode.BuildingGroupData, arrDatas);
        }

        public MessageResult UploadBuildingData(string strFilePath, int? siteNo)
        {
            ArrayList arrDatas = new ArrayList();
            arrDatas.Add(strFilePath);
            arrDatas.Add(siteNo);

            return UploadExcel(Mode.BuildingData, arrDatas);
        }

        private MessageResult UploadExcel(Mode mode, object parameter = null)
        {
            ExcelReader excelReader = MakeReaderInstance(mode, m_dataManager, parameter);

            if (excelReader != null)
            {
                string strErrorMessage;

                if (excelReader.Run(out strErrorMessage, parameter) == false)
                    return new MessageResult(false, strErrorMessage);

                return new MessageResult(true, "");
            }

            return new MessageResult(false, "엑셀 문서를 읽어들일 수 없습니다.");
        }

        private ResponseExcelInfo DownloadExcel(Mode mode, object parameter = null)
        {
            ExcelWriter excelWriter = MakeInstance(mode, m_dataManager, parameter);
            ResponseExcelInfo response = null;

            if (excelWriter != null)
            {
                string strErrorMessage;
                byte[] bytes = excelWriter.Run(out strErrorMessage);

                if (bytes != null)
                {
                    response = new ResponseExcelInfo(true, "");
                    response.Bytes = bytes;
                    response.FileName = excelWriter.GetFileName();
                }
                else
                {
                    response = new ResponseExcelInfo(false, strErrorMessage);
                }
            }
            else
                response = new ResponseExcelInfo(false, "엑셀 보고서를 작성할 수 없습니다.");

            return response;
        }

        private static ExcelReader MakeReaderInstance(Mode mode, IDataManager dataManager, object parameter = null)
        {
            if (mode == Mode.BuildingGroupData)
            {
                if (parameter is ArrayList)
                {
                    ArrayList arrDatas = (ArrayList)parameter;

                    if (arrDatas.Count == 2)
                    {
                        return new BuildingGroupDataReader((string)arrDatas[0], dataManager, (int?)arrDatas[1]);
                    }
                }
            }
            else if (mode == Mode.BuildingData)
            {
                if (parameter is ArrayList)
                {
                    ArrayList arrDatas = (ArrayList)parameter;

                    if (arrDatas.Count == 2)
                    {
                        return new BuildingDataReader((string)arrDatas[0], dataManager, (int?)arrDatas[1]);
                    }
                }
            }

            return null;
        }

        private static ExcelWriter MakeInstance(Mode mode, IDataManager dataManager, object parameter = null)
        {
            if (mode == Mode.BuildingGroupData)
            {
                if (parameter is ArrayList)
                {
                    ArrayList arrDatas = (ArrayList)parameter;

                    if (arrDatas.Count == 2)
                    {
                        return new BuildingGroupDataWriter(dataManager, (int?)arrDatas[0], (int?)arrDatas[1]);
                    }
                }
            }
            else if (mode == Mode.BuildingData)
            {
                if (parameter is ArrayList)
                {
                    ArrayList arrDatas = (ArrayList)parameter;

                    if (arrDatas.Count == 2)
                    {
                        return new BuildingDataWriter(dataManager, (int?)arrDatas[0], (int?)arrDatas[1]);
                    }
                }
            }

            return null;
        }
    }
}
