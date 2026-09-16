using System;
using System.Collections;
using System.Collections.Generic;
using System.Threading;
using System.Windows.Forms;
using System.Diagnostics;

namespace SensorControlServer
{
    public partial class FormMain : Form, IPipeOwer
    {
        private bool m_closeThread = false;
        private string m_strOwnFolderPath = "";

        public bool CloseThread
        {
            get { return m_closeThread; }
        }

        public FormMain()
        {
            InitializeComponent();
            ReadOwnFolderPath();
        }

        private void ReadOwnFolderPath()
        {
            Process process = Process.GetCurrentProcess();
            string strPath = process.MainModule.FileName;

            int index = strPath.LastIndexOf('\\');

            if (index > 0)
                m_strOwnFolderPath = strPath.Substring(0, index);
        }

        private void btnRegist_Click(object sender, EventArgs e)
        {
            OpenFileDialog ofd = new OpenFileDialog();
            ofd.Title = "센서 프로세스 등록";
            ofd.Filter = "실행 파일 (*.exe) | *.exe; | 모든 파일 (*.*) | *.*";

            DialogResult result = ofd.ShowDialog();

            if (result == DialogResult.OK)
            {
                AddProcess(ofd.FileName);
            }
        }

        private void btnRemove_Click(object sender, EventArgs e)
        {
            List<int> indices = GetSelectedRowIndices();
            int selectedCount = indices.Count;

            if (selectedCount == 0)
                return;

            string strMessage = string.Format("선택된 {0}개의 프로세스를 삭제하시겠습니까?", selectedCount);
            DialogResult result = MessageBox.Show(strMessage, "확인", MessageBoxButtons.YesNo);

            if (result == DialogResult.No)
                return;

            for (int i= selectedCount-1;i>=0;i--)
            {
                int index = indices[i];
                gridProcessStatus.Rows.RemoveAt(index);
            }
        }

        private List<int> GetSelectedRowIndices()
        {
            List<int> indices = new List<int>();
            int rowCount = gridProcessStatus.Rows.Count;

            for (int i=0;i<rowCount;i++)
            {
                var row = gridProcessStatus.Rows[i];

                if (Convert.ToBoolean(row.Cells[0].Value) == true)
                    indices.Add(i);
            }

            return indices;
        }

        private void AddProcess(string strPath)
        {
            int rowIndex = gridProcessStatus.Rows.Add();

            if (rowIndex >= 0)
            {
                this.Invoke((MethodInvoker)delegate
                {
                    DataGridViewRow row = gridProcessStatus.Rows[rowIndex];
                    row.Cells[2].Value = strPath;
                    //row.Cells[0].Value = rowIndex + 1;
                    row.Cells[1].Selected = true;
                });
            }
        }

        private void FormMain_Load(object sender, EventArgs e)
        {
            List<string> lines = FileManager.ReadFile(m_strOwnFolderPath);

            if (lines != null)
            {
                gridProcessStatus.Rows.Clear();

                char chBegin = (char)0x02;
                char chEnd = (char)0x03;

                DataGridViewRow row = null;
                string strInfo = null;

                foreach (string strLine in lines)
                {
                    if (strLine.Length > 0 && strLine[0] == chBegin)
                    {
                        string[] tokens = strLine.Split('\t');

                        if (tokens.Length >= 4)
                        {
                            int rowIndex = gridProcessStatus.Rows.Add();

                            if (rowIndex >= 0)
                            {
                                row = gridProcessStatus.Rows[rowIndex];

                                //row.Cells[0].Value = rowIndex + 1;
                                row.Cells[1].Value = tokens[1].Trim();
                                row.Cells[2].Value = tokens[2].Trim();
                                //row.Cells[3].Value = tokens[3].Trim();

                                string strStatus = tokens[3].Trim().ToLower();

                                if (strStatus == "run")
                                    row.Cells[0].Value = true;

                                strInfo = null;
                            }
                        }
                    }
                    else if (strLine.Length > 0 && strLine[0] == chEnd)
                    {
                        if (strInfo != null && row != null)
                            row.Tag = strInfo;
                    }
                    else
                    {
                        if (strInfo == null)
                            strInfo = strLine;
                        else
                            strInfo += "\r\n" + strLine;
                    }
                }
            }

            gridProcessStatus_MouseClick(null, null);
            BeginThread();

            PipeServer.Start(this);
        }

        private void BeginThread()
        {
            Thread t = new Thread(new ThreadStart(MonitoringThread));
            t.Start();
        }

        private void EndThread()
        {
            m_closeThread = true;
            Thread.Sleep(1000);
            PipeServer.Stop();
        }

        private void MonitoringThread()
        {
            bool isFirst = true;
            string strErrorMessage;

            while (m_closeThread == false)
            {
                List<string> filePathList = GetProcessList();

                if (filePathList.Count > 0)
                {
                    //Dictionary<string, int> dicProcessResult = ProcessManager.CheckProcess(PipeServer.ProcessStatusData);
                    Dictionary<string, int> dicProcessResult = ProcessManager.CheckProcess(filePathList, m_strOwnFolderPath);

                    int rowCount = gridProcessStatus.Rows.Count;

                    for (int i = rowCount - 1; i >= 0; i--)
                    {
                        if (m_closeThread)
                            break;

                        try
                        {
                            this.Invoke(new Action(() =>
                            {
                                DataGridViewRow row = gridProcessStatus.Rows[i];
                                string strFilePath = row.Cells[2].Value.ToString().ToLower();

                                int processID;

                                if (dicProcessResult.TryGetValue(strFilePath, out processID))
                                {
                                    row.Cells[0].Tag = processID;
                                    row.Cells[3].Value = "Run";
                                }
                                else
                                {
                                    row.Cells[0].Tag = null;
                                    row.Cells[3].Value = "Ready";
                                }
                            }));
                        }
                        catch (Exception)
                        {
                        }
                    }
                }

                if (isFirst)
                {
                    isFirst = false;

                    try
                    {
                        if (m_closeThread == false)
                        {
                            this.Invoke(new Action(() =>
                            {
                                btnRun.Enabled = btnStop.Enabled = true;
                            }));
                        }
                    }
                    catch (Exception)
                    {
                    }
                }

                AlarmManager.CheckTimeout(PipeServer.GetSopWebServerUrl(), out strErrorMessage);
                Thread.Sleep(1000);
            }
        }

        private void SleepControl(Control ctrl, int sleepSeconds)
        {
            ctrl.Enabled = false;

            ArrayList arrDatas = new ArrayList();
            arrDatas.Add(ctrl);
            arrDatas.Add(sleepSeconds);

            Thread t = new Thread(new ParameterizedThreadStart(SleepThread));
            t.Start(arrDatas);
        }

        private void SleepThread(object obj)
        {
            ArrayList arrDatas = (ArrayList)obj;
            Control ctrl = (Control)arrDatas[0];
            int sleepSeconds = (int)arrDatas[1];

            for (int i = 0; i < sleepSeconds * 10; i++)
            {
                Thread.Sleep(100);

                if (m_closeThread)
                    break;
            }

            try
            {
                if (m_closeThread == false)
                {
                    this.Invoke(new Action(() =>
                    {
                        ctrl.Enabled = true;
                    }));
                }
            }
            catch (Exception)
            {
            }
        }

        private void btnRun_Click(object sender, EventArgs e)
        {
            List<string> filePathList = GetProcessList(true, true);

            if (filePathList.Count > 0)
            {
                ProcessManager.RunProcess(filePathList);
                SleepControl(btnRun, 5);
                btnRun.Enabled = false;
            }
        }

        private void btnStop_Click(object sender, EventArgs e)
        {
            List<string> filePathList = GetProcessList(false, true);

            if (filePathList.Count > 0)
            {
                ProcessManager.KillProcess(GetAliveProcessList(true));
            }
        }

        private void btnSave_Click(object sender, EventArgs e)
        {
            FileManager.WriteFile(gridProcessStatus, m_strOwnFolderPath);
        }

        private void gridProcessStatus_MouseClick(object sender, MouseEventArgs e)
        {
            if (gridProcessStatus.SelectedCells.Count == 0)
                return;

            var row = gridProcessStatus.Rows[gridProcessStatus.SelectedCells[0].RowIndex];

            if (row.Tag != null && row.Tag is string)
            {
                string strInfo = (string)row.Tag;
                textBoxAdditionalInfo.Text = strInfo;
            }
            else
                textBoxAdditionalInfo.Text = "";
        }

        private void textBoxAdditionalInfo_TextChanged(object sender, EventArgs e)
        {
            if (gridProcessStatus.SelectedCells.Count == 0)
                return;

            var row = gridProcessStatus.Rows[gridProcessStatus.SelectedCells[0].RowIndex];

            string strInfo = textBoxAdditionalInfo.Text.Trim();

            if (strInfo.Length == 0)
                row.Tag = null;
            else
                row.Tag = strInfo;
        }

        private List<string> GetProcessList(bool? ready = null, bool _checked = false)
        {
            List<string> filePathList = new List<string>();
            int rowCount = gridProcessStatus.Rows.Count;

            for (int i=rowCount-1;i>=0;i--)
            {
                try
                {
                    DataGridViewRow row = gridProcessStatus.Rows[i];

                    if (_checked == false || (_checked && Convert.ToBoolean(row.Cells[0].Value)))
                    {
                        if (ready == true)
                        {
                            if (row.Cells[3].Value.ToString().ToLower() != "ready")
                                continue;
                        }
                        else if (ready == false)
                        {
                            if (row.Cells[3].Value.ToString().ToLower() != "run")
                                continue;
                        }

                        string strFilePath = row.Cells[2].Value.ToString().ToLower();
                        filePathList.Add(strFilePath);
                    }
                }
                catch (Exception)
                {
                }
            }

            return filePathList;
        }

        private List<int> GetAliveProcessList(bool _checked = false)
        {
            List<int> processIDs = new List<int>();
            int rowCount = gridProcessStatus.Rows.Count;

            for (int i = rowCount - 1; i >= 0; i--)
            {
                try
                {
                    DataGridViewRow row = gridProcessStatus.Rows[i];
                    string strStatus = row.Cells[3].Value == null ? "" : row.Cells[3].Value.ToString().ToLower();

                    if (strStatus != "run")
                        continue;

                    if (_checked == false || (_checked && Convert.ToBoolean(row.Cells[0].Value)))
                    {
                        if (row.Cells[0].Tag != null && row.Cells[0].Tag is int)
                        {
                            processIDs.Add((int)row.Cells[0].Tag);
                        }
                    }
                }
                catch (Exception)
                {
                }
            }

            return processIDs;
        }

        private void FormMain_FormClosing(object sender, FormClosingEventArgs e)
        {
            btnSave_Click(null, null);
            EndThread();

            if (MessageBox.Show("실행중인 센서 프로세스 모듈들을 모두 종료시킬까요?", "확인", MessageBoxButtons.YesNo) == DialogResult.Yes)
                ProcessManager.KillProcess(GetAliveProcessList());
        }
    }
}
