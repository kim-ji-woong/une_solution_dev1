using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using System.Diagnostics;
using System.Threading;

namespace SensorControlServer
{
    class ProcessManager
    {
        /*public static Dictionary<string, int> CheckProcess(ConcurrentDictionary<string, ProcessStatusData> dicProcessStatusData)
        {
            Dictionary<string, int> dicProcessResult = new Dictionary<string, int>();

            if (dicProcessStatusData == null)
                return dicProcessResult;

            List<string> processPathList = new List<string>();
            processPathList.AddRange(dicProcessStatusData.Keys);

            DateTime dtNow = DateTime.Now;
            ProcessStatusData data;

            foreach (string strPath in processPathList)
            {
                if (dicProcessStatusData.TryGetValue(strPath, out data))
                {
                    TimeSpan span = dtNow - data.TimeStamp;

                    if (span.TotalSeconds < 5)
                    {
                        dicProcessResult[strPath] = data.ProcessID;
                    }
                }
            }

            GC.Collect();
            return dicProcessResult;
        }*/

        public static Dictionary<string, int> CheckProcess(List<string> filePathList, string strFolderPath)
        {
            string strInput = strFolderPath + "\\input.dat";
            WriteInput(strInput, filePathList);

            string strOutput = strFolderPath + "\\output.dat";
            RunProcessReader(strFolderPath, strInput, strOutput);

            for (int i=0;i<10 && File.Exists(strInput);i++)
            {
                Thread.Sleep(1000);
            }

            try
            {
                Dictionary<string, int> dicProcessResult = ReadOutput(strOutput);
                return dicProcessResult;
            }
            catch (Exception)
            {
            }

            return new Dictionary<string, int>();

            /*Dictionary<string, bool?> dicProcessList = new Dictionary<string, bool?>();
            Dictionary<string, int> dicProcessResult = new Dictionary<string, int>();

            foreach (string filePath in filePathList)
            {
                dicProcessList[filePath.ToLower()] = null;
            }

            foreach (var process in Process.GetProcesses())
            {
                try
                {
                    string path = process.MainModule.FileName.ToLower();
                    int pid = process.Id;

                    if (dicProcessList.ContainsKey(path))
                        dicProcessResult[path] = pid;
                }
                catch (Exception)
                {
                }
                finally
                {
                    process.Dispose();
                }
            }*/
            /*string query = "SELECT ProcessId, ExecutablePath, Name FROM Win32_Process";

            using (ManagementObjectSearcher searcher = new ManagementObjectSearcher(query))
            {
                using (var results = searcher.Get())
                {
                    foreach (ManagementObject obj in results)
                    {
                        try
                        {
                            string name = obj["Name"]?.ToString();
                            string path = obj["ExecutablePath"]?.ToString();
                            string pid = obj["ProcessId"]?.ToString();

                            if (path != null)
                                path = path.ToLower();

                            int processID;

                            if (path != null && dicProcessList.ContainsKey(path) && int.TryParse(pid, out processID))
                            {
                                dicProcessResult[path] = processID;
                            }
                        }
                        catch (Exception)
                        {
                        }
                        finally
                        {
                            obj.Dispose();
                        }
                    }
                }
            }

            return dicProcessResult;*/
        }

        private static Dictionary<string, int> ReadOutput(string strOutput)
        {
            Dictionary<string, int> dicProcessResult = new Dictionary<string, int>();
            StreamReader reader = new StreamReader(strOutput, Encoding.UTF8);

            while (reader.EndOfStream == false)
            {
                string strLine = reader.ReadLine().Trim();

                if (strLine.Length == 0)
                    continue;

                string[] tokens = strLine.Split('\t');

                if (tokens.Length >= 2)
                {
                    int processID;

                    if (int.TryParse(tokens[0].Trim(), out processID))
                    {
                        string strFilePath = tokens[1].Trim();
                        dicProcessResult[strFilePath] = processID;
                    }
                }
            }

            reader.Close();
            return dicProcessResult;
        }

        private static void WriteInput(string strInput, List<string> filePathList)
        {
            StreamWriter writer = new StreamWriter(strInput, false, Encoding.UTF8);

            foreach (string filePath in filePathList)
            {
                writer.WriteLine(filePath);
            }

            writer.Close();
        }

        private static void RunProcessReader(string strFolderPath, string strInput, string strOutput)
        {
            string strFilePath = strFolderPath + "\\ProcessReader.exe";
            string strParameter = strInput + " " + strOutput;
            Process.Start(strFilePath, strParameter);
        }

        private static string GetFileName(string strFilePath)
        {
            int index2 = strFilePath.LastIndexOf('.');
            int _index1 = strFilePath.LastIndexOf('/');
            int _index2 = strFilePath.LastIndexOf('\\');

            int index1 = _index1 > _index2 ? _index1 : _index2;

            if (index1 >= 0)
            {
                if (index2 > index1)
                    return strFilePath.Substring(index1 + 1, index2 - index1 - 1);
                else
                    return strFilePath.Substring(index1 + 1);
            }
            else
            {
                if (index2 > 0)
                    return strFilePath.Substring(0, index2 - 1);
            }

            return strFilePath;
        }

        public static void RunProcess(List<string> filePathList)
        {
            Dictionary<string, string> processPathList = new Dictionary<string, string>();

            foreach (string path in filePathList)
            {
                processPathList[path.ToLower()] = path;
            }

            foreach (var process in Process.GetProcesses())
            {
                try
                {
                    string path = process.MainModule.FileName.ToLower();

                    // 중복 실행되지 않도록 한다.
                    if (processPathList.ContainsKey(path))
                        processPathList.Remove(path);
                }
                catch (Exception)
                {
                }
                finally
                {
                    process.Dispose();
                }
            }

            foreach (KeyValuePair<string, string> pair in processPathList)
            {
                ProcessStartInfo info = new ProcessStartInfo(pair.Key);
                Process.Start(info);
            }
        }

        public static void KillProcess(List<int> processIDs)
        {
            if (processIDs.Count == 0)
                return;

            foreach (int processID in processIDs)
            {
                try
                {
                    Process process = Process.GetProcessById(processID);

                    if (process != null)
                        process.Kill();
                }
                catch (Exception)
                {
                }
            }
        }

        public static void KillProcess(Dictionary<string, string> processPathList)
        {
            foreach (var process in Process.GetProcesses())
            {
                try
                {
                    string path = process.MainModule.FileName.ToLower();

                    if (processPathList.ContainsKey(path))
                        process.Kill();
                }
                catch (Exception)
                {
                }
            }
        }
    }
}
