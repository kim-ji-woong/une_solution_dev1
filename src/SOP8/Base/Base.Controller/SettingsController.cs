using Microsoft.AspNetCore.Mvc;
using Response;
using Base.Settings.IBLL;
using Base.Settings.IBLL.Request;
using Base.Settings.IBLL.Response;
using dnsExcelReport.Models;
using System.Collections.Generic;
using Microsoft.AspNetCore.Http;
using System.IO;

namespace Base.Controller
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class SettingsController : ControllerBase
    {
        private IProcessManager m_processManager = null;

        public SettingsController(IProcessManager processManager)
        {
            m_processManager = processManager;
        }

        /// <summary>
        /// 환경설정 정보를 요청한다.
        /// 단일 정보 혹은 전체를 요청한다.
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        [HttpPost]
        public IActionResult RequestSetting([FromBody] RequestSettingDatas data)
        {
            ResponseSettingDatas response = m_processManager.RequestSettingData(data);
            return Ok(response);
        }

        /// <summary>
        /// 환경설정 정보를 요청한다.
        /// 다수의 정보를 요청한다.
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        [HttpPost]
        public IActionResult RequestSettingList([FromBody] RequestSettingDataList data)
        {
            ResponseSettingDatas response = m_processManager.RequestSettingDataList(data);
            return Ok(response);
        }

        /// <summary>
        /// 사용자가 편집한 환경설정 정보를 저장한다.
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        [HttpPost]
        public IActionResult Save([FromBody] RequestSave data)
        {
            MessageResult response = m_processManager.Save(data);
            return Ok(response);
        }

        /// <summary>
        /// 환경설정 정보를 초기화한다.
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        [HttpPost]
        public IActionResult Initialize([FromBody] RequestInitialize data)
        {
            MessageResult response = m_processManager.Initialize(data);
            return Ok(response);
        }

        /// <summary>
        /// 건물그룹 정보를 다운로드 한다.
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        [HttpPost]
        public IActionResult DownloadBuildingGroupData([FromBody] RequestDownloadBuildingGroupData data)
        {
            ResponseExcelInfo response = m_processManager.DownloadBuildingGroupData(data);

            if (response.Success == false || response.Bytes == null)
                return Ok(response);

            return File(response.Bytes, "application/vnd.ms-excel", response.FileName);
        }

        /// <summary>
        /// 건물 정보를 다운로드 한다.
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        [HttpPost]
        public IActionResult DownloadBuildingData([FromBody] RequestDownloadBuildingData data)
        {
            ResponseExcelInfo response = m_processManager.DownloadBuildingData(data);

            if (response.Success == false || response.Bytes == null)
                return Ok(response);

            return File(response.Bytes, "application/vnd.ms-excel", response.FileName);
        }

        /// <summary>
        /// 건물그룹 정보를 업로드 한다.
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        public IActionResult UploadBuildingGroupData(List<IFormFile> files, string strSiteNo)
        {
            int? siteNo;
            string strFilePath = GetFilePath(files, strSiteNo, out siteNo);

            MessageResult result = m_processManager.UploadBuildingGroupData(strFilePath, siteNo);
            System.IO.File.Delete(strFilePath);

            return Ok(result);
        }

        /// <summary>
        /// 건물 정보를 업로드 한다.
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        public IActionResult UploadBuildingData(List<IFormFile> files, string strSiteNo)
        {
            int? siteNo;
            string strFilePath = GetFilePath(files, strSiteNo, out siteNo);

            MessageResult result = m_processManager.UploadBuildingData(strFilePath, siteNo);
            System.IO.File.Delete(strFilePath);

            return Ok(result);
        }

        private string GetFilePath(List<IFormFile> files, string strSiteNo, out int? siteNo)
        {
            var filePath = Path.GetTempFileName();
            string strFileName = "";
            string strFilePath = "";

            foreach (var formFile in files)
            {
                if (formFile.Length > 0)
                {
                    strFileName = files[0].FileName;

                    using (var stream = new FileStream(strFileName, FileMode.Create))
                    {
                        formFile.CopyTo(stream);
                        strFilePath = stream.Name;
                    }

                    if (strFilePath.Length > 0)
                        break;
                }
            }

            siteNo = null;

            if (strSiteNo != null)
            {
                int _siteNo;

                if (int.TryParse(strSiteNo.Trim(), out _siteNo))
                    siteNo = _siteNo;
            }

            return strFilePath;
        }
    }
}
