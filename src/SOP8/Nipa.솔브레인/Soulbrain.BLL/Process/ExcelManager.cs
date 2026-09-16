using System.Collections;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using dnsExcelReport.Writer;
using dnsExcelReport.Reader;
using dnsExcelReport.Models;
using Response;

namespace Soulbrain.BLL.Process
{
    using Excel.Writer;
    using Excel.Reader;
    using Request;

    class ExcelManager
    {
        public enum Mode { None = 0, FacilityData = 3 };

        private IDataManager m_dataManager = null;

        public ExcelManager(IDataManager dataManager)
        {
            m_dataManager = dataManager;
        }

        public ResponseExcelInfo DownloadFacilityData(RequestDownloadFacilityData data)
        {
            ArrayList arrDatas = new ArrayList();
            arrDatas.Add(data.SiteNo);

            return DownloadExcel(Mode.FacilityData, arrDatas);
        }

        public MessageResult UploadFacilityData(string strFilePath, int? siteNo)
        {
            ArrayList arrDatas = new ArrayList();
            arrDatas.Add(strFilePath);
            arrDatas.Add(siteNo);

            return UploadExcel(Mode.FacilityData, arrDatas);
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
            if (mode == Mode.FacilityData)
            {
                if (parameter is ArrayList)
                {
                    ArrayList arrDatas = (ArrayList)parameter;

                    if (arrDatas.Count == 2)
                    {
                        return new FacilityDataReader((string)arrDatas[0], dataManager, (int?)arrDatas[1]);
                    }
                }
            }

            return null;
        }

        private static ExcelWriter MakeInstance(Mode mode, IDataManager dataManager, object parameter = null)
        {
            if (mode == Mode.FacilityData)
            {
                if (parameter is ArrayList)
                {
                    ArrayList arrDatas = (ArrayList)parameter;

                    if (arrDatas.Count == 1)
                    {
                        return new FacilityDataWriter(dataManager, (int?)arrDatas[0]);
                    }
                }
            }

            return null;
        }
    }
}
