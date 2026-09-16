using dnsDapperDBUtil.DataAccessLayer.IDAL;
using dnsExcelReport.Models;
using Base.TeamEditor.IBLL.Request;
using dnsExcelReport.Writer;
using dnsExcelReport.Reader;
using Response;
using System.Collections;

namespace Base.TeamEditor.BLL.Process
{
    using Excel.Writer;
    using Excel.Reader;

    class ExcelManager
    {
        public enum Mode { None, RegularTeam };

        private IDataManager m_dataManager = null;

        public ExcelManager(IDataManager dataManager)
        {
            m_dataManager = dataManager;
        }

        public ResponseExcelInfo DownloadRegularTeam(RequestDownloadRegularTeam data)
        {
            return DownloadExcel(Mode.RegularTeam, data.SiteNo);
        }

        public MessageResult UploadRegularTeam(string strFilePath, int? siteNo)
        {
            ArrayList arrDatas = new ArrayList();
            arrDatas.Add(strFilePath);
            arrDatas.Add(siteNo);

            return UploadExcel(Mode.RegularTeam, arrDatas);
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

        private static ExcelWriter MakeInstance(Mode mode, IDataManager dataManager, object parameter = null)
        {
            if (mode == Mode.RegularTeam)
            {
                if (parameter == null || parameter is int?)
                    return new RegularTeamWriter(dataManager, (int?)parameter);
            }

            return null;
        }

        private static ExcelReader MakeReaderInstance(Mode mode, IDataManager dataManager, object parameter = null)
        {
            if (mode == Mode.RegularTeam)
            {
                if (parameter is ArrayList)
                {
                    ArrayList arrDatas = (ArrayList)parameter;

                    if (arrDatas.Count == 2 && arrDatas[0] is string && (arrDatas[1] == null || arrDatas[1] is int?))
                        return new RegularMemberReader(dataManager, (string)arrDatas[0], (int?)arrDatas[1]);
                }
            }

            return null;
        }
    }
}
