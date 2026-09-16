using dnsDapperDBUtil.DataAccessLayer.IDAL;
using Kftc.Model.History;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JSParking
{
    public class DBDataManager
    {
        private JSParkingManager m_parent = null;
        private IDataManager m_dataManager = null;
        private string m_strServerPath = null;

        public DBDataManager(JSParkingManager parent, IDataManager dataManager, string strServerPath)
        {
            m_parent = parent;
            m_dataManager = dataManager;
            m_strServerPath = strServerPath;

            // 주차 이미지 저장 폴더 보장
            if (string.IsNullOrEmpty(m_strServerPath) == false && Directory.Exists(m_strServerPath) == false)
                Directory.CreateDirectory(m_strServerPath);
        }

        public bool ReadLastParking(out DateTime dtLast, out string strErrMsg)
        {
            bool bResult = true;

            strErrMsg = null;

            dtLast = new DateTime();
            
            try
            {
                string strSQL = $"SELECT {Parking.Fields.parkng_tm} FROM {Parking.TableName} WHERE {Parking.Fields.user_yn} = 0 ORDER BY {Parking.Fields.parkng_tm} DESC";

                dynamic result = m_dataManager.GetSelect().SelectFirst(strSQL, out strErrMsg);
                if (result == null)
                    throw new ApplicationException("SelectFirst Error: " + strErrMsg);

                dtLast = result.parkng_tm;
            }
            catch (Exception ex)
            {
                strErrMsg = ex.Message;
                bResult = false;
            }           

            return bResult;
        }

        public bool UpdateParkingData(List<ParkingData> parkings, out string strErrMsg)
        {
            strErrMsg = null;
            bool bResult = true;

            if (parkings.Count > 0)
            {
                IDataManager dataManager = m_dataManager.Clone();

                // 커밋 성공 후 파일로 저장할 이미지 목록 (일련번호, 이미지 바이트)
                List<(int nHistSn, byte[] blob)> imageToSave = new List<(int, byte[])>();

                try
                {
                    if (dataManager.BeginBatch(out strErrMsg) == false)
                        throw new ApplicationException("BeginBatch Error" + strErrMsg);

                    foreach (ParkingData parking in parkings)
                    {
                        // 추가
                        Parking data = new Parking();
                        data.parkng_tm = parking.MngDtm;
                        data.parkng_vhcle_no = parking.CarNoAll;
                        data.parkng_entvhcl_yn = parking.IsEntry;
                        data.cmmtkt_yn = (parking.CarParkTp == "2") ? true : false;
                        data.parkng_vhcle_image = null; // 이미지는 DB에 저장하지 않고 파일로 저장 (DB 용량 절감)
                        data.user_yn = false;

                        // 채번된 parkng_hist_sn(identity)을 회수하여 이미지 파일명으로 사용
                        if (dataManager.GetCreate().Insert<Parking>(data, out int nHistSn, out strErrMsg) == false)
                            throw new ApplicationException("Insert Error: " + strErrMsg);

                        if (parking.LprBlob != null)
                            imageToSave.Add((nHistSn, parking.LprBlob));
                    }

                    if (dataManager.BatchCommit(out strErrMsg) == false)
                        throw new ApplicationException("BatchCommit Error: " + strErrMsg);
                }
                catch (Exception e)
                {
                    strErrMsg = e.Message;

                    if (dataManager.BatchRollback(out string _strErrMsg) == false)
                        strErrMsg = _strErrMsg;

                    bResult = false;
                }

                // 커밋 성공한 경우에만 이미지 파일 저장 (롤백 시 고아 파일 방지)
                if (bResult)
                    SaveParkingImages(imageToSave);
            }

            return bResult;
        }

        /// <summary>
        /// 주차 차량 이미지를 parkng_hist_sn 파일명으로 ServerPath 경로에 저장한다.
        /// 개별 파일 저장 실패는 로그만 남기고 나머지 이미지 저장 및 다음 동기화를 계속 진행한다.
        /// </summary>
        private void SaveParkingImages(List<(int nHistSn, byte[] blob)> imageToSave)
        {
            if (string.IsNullOrEmpty(m_strServerPath))
                return;

            foreach (var (nHistSn, blob) in imageToSave)
            {
                try
                {
                    string strPath = Path.Combine(m_strServerPath, $"{nHistSn}.jpg");
                    File.WriteAllBytes(strPath, blob);
                }
                catch (Exception ex)
                {
                    m_parent.Logger.Write($"주차 이미지 파일 저장 실패 (sn={nHistSn}): {ex.Message}");
                }
            }
        }
    }
}
