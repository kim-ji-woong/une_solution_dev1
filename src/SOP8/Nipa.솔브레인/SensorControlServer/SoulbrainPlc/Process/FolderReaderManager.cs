using System;
using System.IO;
using System.Linq;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using dnsPipeHelper;
using SoulbrainPlc.Data;

namespace SoulbrainPlc.Process
{
    public class FolderReaderManager
    {
        IDataManager m_dataManager = null;
        NetworkInfo m_networkInfo = null;
        PlcManager m_parent = null;
        string m_backupPath = null;
        
        private FileReaderManager m_fileReaderManager = null;
        
        public FolderReaderManager(IDataManager dataManager, NetworkInfo networkInfo, PlcManager parent, string backupPath)
        {
            m_dataManager = dataManager;
            m_networkInfo = networkInfo;
            m_parent = parent;
            m_backupPath = backupPath;

            m_fileReaderManager = new FileReaderManager(dataManager, parent, m_backupPath);
        }

        public void ReadFolder()
        {
            try
            {
                using (new PlcNetworkManager(m_networkInfo))
                {
                    DirectoryInfo dirInfo = new DirectoryInfo(m_networkInfo.NetworkFolderPath);

                    if (dirInfo.Exists)
                    {
                        var file = dirInfo.GetFiles("*.*")
                            .Where(s => s.Name.EndsWith(".csv"))
                            .FirstOrDefault(s => s.Name == "SA00000.csv");
                        
                        if (file != null)
                        {
                            if (m_fileReaderManager.ReadFile(file.FullName, DateTime.Now) == false)
                                throw new Exception($@"[ERROR] ReadFile() : ReadFile Error. FilePath = {file.FullName}");
                        }
                        
                    }
                    else
                    {
                        m_parent.Logger.Write($@"[ERROR] ReadFolder() : Folder does not exist. FolderPath = {m_networkInfo.NetworkFolderPath}");
                    }
                }
            }
            catch (Exception e)
            {
                m_parent.Logger.Write($@"[ERROR] ReadFolder() : {e.Message}");
            }
        }
    }
}