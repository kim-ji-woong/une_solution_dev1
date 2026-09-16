using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AccessERP
{
    class ImageManager
    {
        private AccessERPManager m_parent = null;

        private string m_strAccessPath = null;
        private string m_strServerPath = null;

        public ImageManager(AccessERPManager parent, string strAccessPath, string strServerPath)
        {
            m_parent = parent;
            m_strAccessPath = strAccessPath;
            m_strServerPath = strServerPath;
        }

        public bool Synchronization(out string strErrMsg)
        {
            bool bRet = false;
            strErrMsg = null;

            try
            {
                // 폴더 존재 확인
                if (!Directory.Exists(m_strAccessPath))
                {
                    throw new ApplicationException($"출입카드 PC 경로를 확인해주세요: {m_strAccessPath}");
                }
                else if (!Directory.Exists(m_strServerPath))
                {
                    throw new ApplicationException($"웹서버 경로를 확인해주세요: {m_strServerPath}");
                }

                // 각 폴더의 png 파일 목록 가져오기
                var accessFiles = Directory.GetFiles(m_strAccessPath, "*.png")
                    .Select(f => new FileInfo(f))
                    .ToList();

                var serverFiles = Directory.GetFiles(m_strServerPath, "*.png")
                    .Select(f => new FileInfo(f))
                    .ToList();

                // 출입카드 폴더 파일명 목록
                var accessFileNames = accessFiles.Select(f => f.Name).ToHashSet();

                // 웹서버 폴더 파일명 목록
                var serverFileNames = serverFiles.Select(f => f.Name).ToHashSet();

                // 서버에 존재하지 않는 이미지 다운로드
                foreach (var accessFile in accessFiles)
                {
                    if (!serverFileNames.Contains(accessFile.Name))
                    {
                        string destPath = Path.Combine(m_strServerPath, accessFile.Name);
                        File.Copy(accessFile.FullName, destPath);
                        m_parent.Logger.Write($"이미지 다운로드: {accessFile.Name}");
                    }
                }

                // 출입카드에서 존재하지 않는 이미지 삭제
                foreach (var serverFile in serverFiles)
                {
                    if (!accessFileNames.Contains(serverFile.Name))
                    {
                        File.Delete(serverFile.FullName);
                        m_parent.Logger.Write($"삭제: {serverFile.Name}");
                    }
                }

                foreach (var accessFile in accessFiles)
                {
                    if (serverFileNames.Contains(accessFile.Name))
                    {
                        string serverFilePath = Path.Combine(m_strServerPath, accessFile.Name);
                        var serverFile = new FileInfo(serverFilePath);

                        // 파일 크기 비교 (byte 단위)
                        if (accessFile.Length != serverFile.Length)
                        {
                            File.Copy(accessFile.FullName, serverFilePath, true);
                            Console.WriteLine($"덮어쓰기: {accessFile.Name} (업데이트)");
                        }
                    }
                }

                bRet = true;
            }
            catch (Exception e)
            {
                strErrMsg = e.Message;
            }

            return bRet;
        }
    }
}
