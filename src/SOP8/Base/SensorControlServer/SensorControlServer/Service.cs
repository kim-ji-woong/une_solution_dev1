using System.Threading;
using System.Collections.Generic;
using System.Diagnostics;

namespace SensorControlServer
{
    public class Service : IPipeOwer
    {
        private volatile bool m_closeThread = false;
        //private List<ProcessData> m_processDatas = new List<ProcessData>();

        private string m_strOwnFolderPath = "";

        public bool CloseThread
        {
            get { return m_closeThread; }
        }

        public Service()
        {
            ReadOwnFolderPath();
        }

        private void ReadOwnFolderPath()
        {
            using (Process process = Process.GetCurrentProcess())
            {
                string strPath = process.MainModule.FileName;

                int index = strPath.LastIndexOf('\\');

                if (index > 0)
                    m_strOwnFolderPath = strPath.Substring(0, index);
            }
        }

        public bool Start()
        {
            List<ProcessData> processDatas = ReadProcessDatas();
            //m_processDatas = processDatas;

            RunProcess(processDatas);
            BeginThread();

            PipeServer.Start(this);
            return true;
        }

        private List<ProcessData> ReadProcessDatas()
        {
            List<string> lines = FileManager.ReadFile(m_strOwnFolderPath);
            List<ProcessData> processDatas = new List<ProcessData>();

            if (lines != null)
            {
                char chBegin = (char)0x02;
                //char chEnd = (char)0x03;

                foreach (string strLine in lines)
                {
                    if (strLine.Length > 0 && strLine[0] == chBegin)
                    {
                        string[] tokens = strLine.Split('\t');

                        if (tokens.Length >= 4)
                        {
                            ProcessData processData = new ProcessData();

                            processData.Name = tokens[1].Trim();
                            processData.Path = tokens[2].Trim();
                            processData.Status = tokens[3].Trim().ToLower();

                            processDatas.Add(processData);
                        }
                    }
                }
            }

            return processDatas;
        }

        private void BeginThread()
        {
            Thread t = new Thread(new ThreadStart(MonitoringThread));
            t.Start();
        }

        private void MonitoringThread()
        {
            m_closeThread = false;
            string strErrorMessage;

            while (m_closeThread == false)
            {
                /*List<string> filePathList = GetProcessList();

                if (filePathList.Count > 0)
                {
                    Dictionary<string, int> dicProcessResult = ProcessManager.CheckProcess(filePathList, m_strOwnFolderPath);

                    foreach (ProcessData processData in m_processDatas)
                    {
                        if (m_closeThread)
                            break;

                        int processID;
                        string strFilePath = processData.Path.ToLower();

                        if (dicProcessResult.TryGetValue(strFilePath, out processID))
                        {
                            processData.ProcessID = processID;
                            processData.Status = "run";
                        }
                        else
                        {
                            processData.ProcessID = -1;
                            processData.Status = "ready";
                        }
                    }
                }*/

                AlarmManager.CheckTimeout(PipeServer.GetSopWebServerUrl(), out strErrorMessage);
                Thread.Sleep(1000);
            }
        }

        public void Stop()
        {
            List<ProcessData> processDatas = ReadProcessDatas();
            Dictionary<string, string> dicProcessPathList = new Dictionary<string, string>();

            foreach (ProcessData data in processDatas)
            {
                dicProcessPathList[data.Path.ToLower()] = data.Path;
            }

            ProcessManager.KillProcess(dicProcessPathList);
            /*List<int> processIDs = new List<int>();

            foreach (ProcessData processData in m_processDatas)
            {
                if (processData.Status == "run" && processData.ProcessID > 0)
                    processIDs.Add(processData.ProcessID);
            }

            if (processIDs.Count > 0)
            {
                ProcessManager.KillProcess(processIDs);
            }*/

            m_closeThread = true;
        }

        private void RunProcess(List<ProcessData> processDatas)
        {
            List<string> filePathList = new List<string>();

            foreach (ProcessData processData in processDatas)
            {
                if (processData.Status == "run")
                {
                    filePathList.Add(processData.Path.ToLower());
                    processData.Status = "ready";
                }
            }

            if (filePathList.Count > 0)
            {
                ProcessManager.RunProcess(filePathList);
            }
        }

        /*private List<string> GetProcessList(bool? ready = null)
        {
            List<string> filePathList = new List<string>();

            foreach (ProcessData processData in m_processDatas)
            {
                if (ready == true)
                {
                    if (processData.Status != "ready")
                        continue;
                }
                else if (ready == false)
                {
                    if (processData.Status != "run")
                        continue;
                }

                string strFilePath = processData.Path.ToLower();
                filePathList.Add(strFilePath);
            }

            return filePathList;
        }*/
    }

    class ProcessData
    {
        private string m_strProcessName = "";
        private string m_strProcessPath = "";
        private string m_strStatus = "";
        private int m_processID = -1;

        public string Name
        {
            get { return m_strProcessName; }
            set { m_strProcessName = value; }
        }

        public string Path
        {
            get { return m_strProcessPath; }
            set { m_strProcessPath = value; }
        }

        public string Status
        {
            get { return m_strStatus; }
            set { m_strStatus = value; }
        }

        public int ProcessID
        {
            get { return m_processID; }
            set { m_processID = value; }
        }
    }
}
