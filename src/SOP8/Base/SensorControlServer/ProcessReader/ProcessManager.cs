using System;
using System.IO;
using System.Collections.Generic;
using System.Text;
using System.Diagnostics;

namespace ProcessReader
{
    class ProcessManager
    {
        public static void ReadProcess(string strInput, string strOutput)
        {
            List<string> filePathList = ReadFilePathList(strInput);
            ReadProcess(filePathList, strOutput);
            File.Delete(strInput);
        }

        private static List<string> ReadFilePathList(string strInput)
        {
            List<string> filePathList = new List<string>();
            StreamReader reader = new StreamReader(strInput, Encoding.UTF8);

            while (reader.EndOfStream == false)
            {
                string strLine = reader.ReadLine();
                filePathList.Add(strLine);
            }

            reader.Close();
            return filePathList;
        }

        private static void ReadProcess(List<string> filePathList, string strOutput)
        {
            Dictionary<string, bool?> dicProcessList = new Dictionary<string, bool?>();
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
            }

            StreamWriter writer = new StreamWriter(strOutput, false, Encoding.UTF8);

            foreach (KeyValuePair<string, int> pair in dicProcessResult)
            {
                writer.WriteLine(pair.Value.ToString() + "\t" + pair.Key);
            }

            writer.Close();
        }
    }
}
