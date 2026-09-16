using System;
using System.Windows.Forms;
using System.Collections.Generic;
using System.Drawing;
using System.Runtime.InteropServices;
using System.Diagnostics;
using System.IO;
using System.Configuration;

namespace UnEcctv
{
    using Data;
    using System.Text;
    using System.Web;

    public partial class FormMain : FormNoFrameSizable, IVlcPanelOwner, IProcessOwner
    {
        [DllImport("user32.dll", EntryPoint = "SetWindowPos")]
        public static extern IntPtr SetWindowPos(IntPtr hWnd, int hWndInsertAfter, int x, int Y, int cx, int cy, int wFlags);
        [DllImport("user32.dll", SetLastError = true)]
        [return: MarshalAs(UnmanagedType.Bool)]
        static extern bool GetWindowRect(IntPtr hWnd, ref RECT lpRect);
        [DllImport("user32.dll")]
        private static extern IntPtr GetWindow(IntPtr hWnd, uint uCmd);

        private const string FilePath = "./memory.dat";

        [StructLayout(LayoutKind.Sequential)]
        private struct RECT
        {
            public int Left;
            public int Top;
            public int Right;
            public int Bottom;
        }

        public struct COPYDATASTRUCT
        {
            public IntPtr dwData;
            public int cbData;
            [MarshalAs(UnmanagedType.LPStr)]
            public string lpData;
        }

        [DllImport("Gdi32.dll", EntryPoint = "CreateRoundRectRgn")]
        private static extern IntPtr CreateRoundRectRgn
        (
            int nLeftRect,     // x-coordinate of upper-left corner
            int nTopRect,      // y-coordinate of upper-left corner
            int nRightRect,    // x-coordinate of lower-right corner
            int nBottomRect,   // y-coordinate of lower-right corner
            int nWidthEllipse, // width of ellipse
            int nHeightEllipse // height of ellipse
        );

        private const int WM_COPYDATA = 0x4a;

        private VlcPanel m_bigPanel = null;
        private bool[] m_visiblePanels = new bool[4];
        private WebServiceManager m_webServiceManager = null;
        private List<CCTVData> m_datas = new List<CCTVData>();
        private CCTVStatus m_status = null;
        private VlcPanel[] m_panels = new VlcPanel[4];
        private VlcPanel vlcPanelLT;
        private VlcPanel vlcPanelRT;
        private VlcPanel vlcPanelLB;
        private VlcPanel vlcPanelRB;

        private bool m_bLeftMouseDown = false;
        private Point m_ptMove;
        private Process m_parentProcess = null;

        private PanelManager m_panelManager = null;

        private int radius = 20;

        public FormMain(string strCommand, string strUrl)
        {
            InitializeComponent();

            m_webServiceManager = new WebServiceManager(strUrl);

            Init(strCommand);
            m_panelManager = new PanelManager(this);

            ReadFile();
            Region = System.Drawing.Region.FromHrgn(CreateRoundRectRgn(0, 0, Width, Height, radius, radius));
        }

        private void InitVlcPanels()
        {
            int beginPos = this.btnTemp.Location.X;
            int thisHeight = this.Size.Height - this.panelTop.Size.Height;

            int height = thisHeight - beginPos * 3;
            int width = this.Size.Width - beginPos * 3;

            int vlcWidth = width / 2;
            int vlcHeight = height / 2;

            int x1 = beginPos;
            int y1 = beginPos + this.panelTop.Size.Height;
            int x2 = beginPos + vlcWidth + beginPos;
            int y2 = y1 + vlcHeight + beginPos;

            this.vlcPanelLT = InitVlcPanel(x1, y1, "vlcPanelLT", vlcWidth, vlcHeight);
            this.vlcPanelRT = InitVlcPanel(x2, y1, "vlcPanelRT", vlcWidth, vlcHeight);
            this.vlcPanelLB = InitVlcPanel(x1, y2, "vlcPanelLB", vlcWidth, vlcHeight);
            this.vlcPanelRB = InitVlcPanel(x2, y2, "vlcPanelRB", vlcWidth, vlcHeight);
        }

        private VlcPanel InitVlcPanel(int x, int y, string strName, int vlcWidth, int vlcHeight)
        {
            VlcPanel vlcPanel = new VlcPanel();

            vlcPanel.BackColor = System.Drawing.Color.Black;
            vlcPanel.Data = null;
            vlcPanel.Location = new System.Drawing.Point(x, y);
            vlcPanel.Name = strName;
            vlcPanel.Owner = null;
            vlcPanel.Size = new System.Drawing.Size(vlcWidth, vlcHeight);
            vlcPanel.TabIndex = 1;
            vlcPanel.Title = "title";
            vlcPanel.Visible = false;
            vlcPanel.MouseDoubleClick += new System.Windows.Forms.MouseEventHandler(this.vlcPanel_MouseDoubleClick);

            this.Controls.Add(vlcPanel);

            return vlcPanel;
        }

        private void ResetVlcPanels()
        {
            int beginPos = this.btnTemp.Location.X;
            int thisHeight = this.Size.Height - this.panelTop.Size.Height;

            int height = thisHeight - beginPos * 3;
            int width = this.Size.Width - beginPos * 3;

            int vlcWidth = width / 2;
            int vlcHeight = height / 2;

            int x1 = beginPos;
            int y1 = beginPos + this.panelTop.Size.Height;
            int x2 = beginPos + vlcWidth + beginPos;
            int y2 = y1 + vlcHeight + beginPos;
            int bigWidth = x2 + vlcWidth - x1;
            int bigHeight = y2 + vlcHeight - y1;

            ResetVlcPanel(x1, y1, vlcWidth, vlcHeight, this.vlcPanelLT, bigWidth, bigHeight);
            ResetVlcPanel(x2, y1, vlcWidth, vlcHeight, this.vlcPanelRT, bigWidth, bigHeight);
            ResetVlcPanel(x1, y2, vlcWidth, vlcHeight, this.vlcPanelLB, bigWidth, bigHeight);
            ResetVlcPanel(x2, y2, vlcWidth, vlcHeight, this.vlcPanelRB, bigWidth, bigHeight);
        }

        private void ResetVlcPanel(int x, int y, int vlcWidth, int vlcHeight, VlcPanel vlcPanel, int bigWidth, int bigHeight)
        {
            if (this.m_bigPanel == vlcPanel)
            {
                vlcPanel.Size = new Size(bigWidth, bigHeight);
            }
            else
            {
                vlcPanel.Location = new Point(x, y);
                vlcPanel.Size = new Size(vlcWidth, vlcHeight);
            }
        }

        private void Init(string strCommand)
        {
            InitVlcPanels();

            m_panels[0] = vlcPanelLT;
            m_panels[1] = vlcPanelRT;
            m_panels[2] = vlcPanelLB;
            m_panels[3] = vlcPanelRB;

            SetPanelVisible();

            for (int i = 0; i < 4; i++)
            {
                m_panels[i].Owner = this;
            }

            Point? pt = null;

            m_status = m_webServiceManager.RunCommand(strCommand, m_datas, out pt);

            if (m_status != null)
            {
                if (pt != null)
                    this.Location = (Point)pt;

                string encodedTitle = m_status.Title;
                string decodedTitle = HttpUtility.UrlDecode(encodedTitle, Encoding.UTF8);

                SetMark(m_status.MarkNo);
                m_status.Title = decodedTitle;
                this.labelTitle.Text = decodedTitle;
            }
            else
                this.labelTitle.Text = "";
        }

        public void SetMark(int? markNo)
        {
            if (markNo == null || markNo < 1 || markNo > 3)
            {
                pbMark.Visible = false;
                this.labelTitle.Location = new Point(7, 8);
            }
            else
            {
                if (markNo == 1)
                    pbMark.BackgroundImage = Resource.mark1;
                else if (markNo == 2)
                    pbMark.BackgroundImage = Resource.mark2;
                else if (markNo == 3)
                    pbMark.BackgroundImage = Resource.mark3;

                pbMark.Visible = true;
                this.labelTitle.Location = new Point(20, 8);
            }
        }

        protected override void OnFormLoad(object sender, EventArgs e)
        {
            SetWebViewHandle();
            this.Icon = Icon.FromHandle(Resource._32X32.GetHicon());

            if (m_status == null)
            {
                Application.Exit();
            }
            else
            {
                int len = m_datas.Count;

                // 최대 4개까지만 허용
                for (int i = 0; i < len && i < 4; i++)
                {
                    m_panels[i].Data = m_datas[i];
                }

                // 창이 하나만 있을때는 크게 보이도록 한다.
                if (len == 1)
                    SetBigPanel(m_panels[0]);

                if (m_status != null)
                {
                    timer1.Start();
                }
            }

            base.OnFormLoad(sender, e);
        }

        private void CheckZOrder()
        {
            if (m_parentProcess != null)
            {
                if (this.WindowState == FormWindowState.Minimized)
                    return;

                int parentZOrder, thisZOrder;

                if (GetWindowZOrder(m_parentProcess.MainWindowHandle, out parentZOrder) &&
                    GetWindowZOrder(this.Handle, out thisZOrder))
                {
                    if (thisZOrder < parentZOrder)
                    {
                        const int HWND_TOPMOST = -1;
                        const int SWP_NOMOVE = 2;
                        const int SWP_NOSIZE = 1;
                        const int SWP_SHOWWINDOW = 0x40;

                        // 윈도우를 최상위로 만든다.
                        SetWindowPos(this.Handle, HWND_TOPMOST, 0, 0, 0, 0, SWP_NOMOVE | SWP_NOSIZE | SWP_SHOWWINDOW);
                    }
                }
            }
        }

        private void SetWebViewHandle()
        {
            List<Process> parentProcesses = new List<Process>();
            Process[] processes = Process.GetProcesses();

            string strMainWindowTitle = ConfigurationManager.AppSettings.Get("mainWindowTitle");

            foreach (var process in processes)
            {
                if (process.ProcessName == "msedge" ||
                    process.ProcessName == "chrome" ||
                    process.ProcessName == "whale")
                {
                    if (process.MainWindowTitle.Contains(strMainWindowTitle))
                    {
                        parentProcesses.Add(process);
                    }
                }
            }

            if (parentProcesses.Count == 1)
            {
                // 조건을 만족하는 process가 1개만 있다면 WebView로 설정
                m_parentProcess = parentProcesses[0];
            }
            else
            {
                // 조건을 만족하는 process가 2개 이상일 경우 CCTV창이 해당 process window 안에 포함되는지 여부로 판단
                int x1 = this.Location.X;
                int y1 = this.Location.Y;
                int x2 = x1 + this.Size.Width;
                int y2 = y1 + this.Size.Height;

                List<Process> nominates = new List<Process>();

                foreach (var process in parentProcesses)
                {
                    RECT rect = new RECT();

                    if (GetWindowRect(process.MainWindowHandle, ref rect))
                    {
                        if ((x1 >= rect.Left && x1 <= rect.Right && y1 >= rect.Top && y1 <= rect.Bottom) ||
                            (x2 >= rect.Left && x2 <= rect.Right && y2 >= rect.Top && y2 <= rect.Bottom))
                            nominates.Add(process);
                    }
                }

                if (nominates.Count > 0)
                {
                    if (nominates.Count == 1)
                    {
                        m_parentProcess = nominates[0];
                    }
                    else
                    {
                        // 조건을 만족하는 process가 2개 이상일 경우 z-order가 높은 것을 선택한다.
                        int zOrder, prevZOrder = -1;
                        Process parentProcess = null;

                        foreach (var process in nominates)
                        {
                            if (GetWindowZOrder(process.MainWindowHandle, out zOrder))
                            {
                                if (parentProcess == null || zOrder > prevZOrder)
                                {
                                    parentProcess = process;
                                    prevZOrder = zOrder;
                                }
                            }
                        }

                        if (parentProcess != null)
                        {
                            m_parentProcess = parentProcess;
                        }
                    }
                }
            }
        }

        private static bool GetWindowZOrder(IntPtr hwnd, out int zOrder)
        {
            const uint GW_HWNDPREV = 3;
            const uint GW_HWNDLAST = 1;

            var lowestHwnd = GetWindow(hwnd, GW_HWNDLAST);

            var z = 0;
            var hwndTmp = lowestHwnd;
            while (hwndTmp != IntPtr.Zero)
            {
                if (hwnd == hwndTmp)
                {
                    zOrder = z;
                    return true;
                }

                hwndTmp = GetWindow(hwndTmp, GW_HWNDPREV);
                z++;
            }

            zOrder = int.MinValue;
            return false;
        }

        private void vlcPanel_MouseDoubleClick(object sender, MouseEventArgs e)
        {
            OnPanelMouseDoubleClick((VlcPanel)sender);
        }

        public void OnPanelMouseDoubleClick(VlcPanel panel)
        {
            if (panel == m_bigPanel)
                SetBigPanel(null);
            else
                SetBigPanel(panel);
        }

        private void SetBigPanel(VlcPanel panel)
        {
            if (panel != null)
            {
                SetPanelVisible();

                panel.Size = new System.Drawing.Size(vlcPanelRB.Location.X + vlcPanelRB.Size.Width - vlcPanelLT.Location.X, vlcPanelRB.Location.Y + vlcPanelRB.Size.Height - vlcPanelLT.Location.Y);
                panel.Location = vlcPanelLT.Location;

                ShowPanels(false, panel);
            }
            else
            {
                GetPanelVisible();

                if (m_bigPanel != null)
                {
                    if (m_bigPanel == vlcPanelLT)
                    {
                        m_bigPanel.Location = new System.Drawing.Point(vlcPanelLB.Location.X, vlcPanelRT.Location.Y);
                        m_bigPanel.Size = vlcPanelRT.Size;
                    }
                    else if (m_bigPanel == vlcPanelRT)
                    {
                        m_bigPanel.Location = new System.Drawing.Point(vlcPanelRB.Location.X, vlcPanelLT.Location.Y);
                        m_bigPanel.Size = vlcPanelLT.Size;
                    }
                    else if (m_bigPanel == vlcPanelLB)
                    {
                        m_bigPanel.Location = new System.Drawing.Point(vlcPanelLT.Location.X, vlcPanelRB.Location.Y);
                        m_bigPanel.Size = vlcPanelRT.Size;
                    }
                    else if (m_bigPanel == vlcPanelRB)
                    {
                        m_bigPanel.Location = new System.Drawing.Point(vlcPanelRT.Location.X, vlcPanelLB.Location.Y);
                        m_bigPanel.Size = vlcPanelRT.Size;
                    }
                }
            }

            m_bigPanel = panel;
        }

        // 큰 화면이 보여져야할 상황인지 점검한다.
        public void CheckBigPanel()
        {
            SetPanelVisible();

            if (m_bigPanel != null)
            {
                if (m_panels[1].Visible)
                    SetBigPanel(null);
            }
        }

        private void SetPanelVisible()
        {
            for (int i = 0; i < 4; i++)
            {
                m_visiblePanels[i] = m_panels[i].Visible;
            }
        }

        private void GetPanelVisible()
        {
            for (int i = 0; i < 4; i++)
            {
                m_panels[i].Visible = m_visiblePanels[i];
            }
        }

        private void ShowPanels(bool visible, VlcPanel panel)
        {
            for (int i = 0; i < 4; i++)
            {
                m_panels[i].Visible = visible;
            }

            if (visible == false && panel != null)
                panel.Visible = true;
        }

        // 일정 시간마다 상태를 업데이트 한다.
        private void OnTimer(object sender, EventArgs e)
        {
            if (CheckParentProcess() == false)
                return;

            // CCTV창이 웹뷰 뒤에 숨어있는지 확인한다.
            CheckZOrder();
        }

        // ParentProcess가 종료되었으면 CCTV창도 같이 종료시킨다.
        private bool CheckParentProcess()
        {
            if (m_parentProcess != null)
            {
                if (m_parentProcess.HasExited)
                {
                    this.Close();
                    return false;
                }
            }

            return true;
        }

        private void FormMain_FormClosing(object sender, FormClosingEventArgs e)
        {
        }

        public void SetVisible(bool visible)
        {
            if (visible)
                this.WindowState = FormWindowState.Normal;
            else
                this.WindowState = FormWindowState.Minimized;
        }

        public Dictionary<int, CCTVData> ReadCCTVDatas(List<int> nos)
        {
            return m_webServiceManager.ReadCCTVs(nos);
        }

        protected override void OnFormResize(object sender, EventArgs e)
        {
            if (m_status != null)
            {
                if (m_status.Visible == false)
                {
                    if (this.WindowState != FormWindowState.Minimized)
                    {
                        m_status.Visible = true;
                    }
                }
                else
                {
                    if (this.WindowState == FormWindowState.Minimized)
                    {
                        m_status.Visible = false;
                    }
                }
            }

            base.OnFormResize(sender, e);
        }

        protected override void OnResizeBegin()
        {
            this.Region = null;
        }

        protected override void OnResizeEnd()
        {
            this.Region = Region.FromHrgn(CreateRoundRectRgn(0, 0, Width, Height, radius, radius));
            ResetVlcPanels();
            WriteFile();
        }

        protected override Size GetPanelTopSize()
        {
            return this.panelTop.Size;
        }

        private void pbClose_Click(object sender, EventArgs e)
        {
            this.Close();
        }

        private void pbClose_MouseEnter(object sender, EventArgs e)
        {
            this.Cursor = Cursors.Hand;
        }

        private void pbClose_MouseLeave(object sender, EventArgs e)
        {
            this.Cursor = Cursors.Arrow;
        }

        private void panelTop_MouseDown(object sender, MouseEventArgs e)
        {
            if (e.Button == System.Windows.Forms.MouseButtons.Left)
            {
                m_bLeftMouseDown = true;
                m_ptMove = PointToScreen(new Point(e.X, e.Y));
            }
        }

        private void panelTop_MouseMove(object sender, MouseEventArgs e)
        {
            if (e.Button == MouseButtons.Left)
            {
                if (m_bLeftMouseDown == true)
                {
                    Point pt = PointToScreen(new Point(e.X, e.Y));
                    int dx = pt.X - m_ptMove.X;
                    int dy = pt.Y - m_ptMove.Y;
                    if (!(dx == 0 && dy == 0))
                    {
                        Point ptCur = this.Location;
                        this.Location = new Point(ptCur.X + dx, ptCur.Y + dy);
                        m_ptMove.X += dx;
                        m_ptMove.Y += dy;
                    }
                }
            }
        }

        private void panelTop_MouseUp(object sender, MouseEventArgs e)
        {
            if (e.Button == MouseButtons.Left)
                m_bLeftMouseDown = false;
        }

        protected override void WndProc(ref Message m)
        {
            FormWindowState oldState = this.WindowState;

            base.WndProc(ref m);

            if (m.Msg == WM_COPYDATA)
            {
                COPYDATASTRUCT cds = (COPYDATASTRUCT)m.GetLParam(typeof(COPYDATASTRUCT));
                m_panelManager.ProcessMessage(cds.lpData);
            }

            if (this.WindowState != oldState)
                this.OnWindowStateChanged();
        }

        private void OnWindowStateChanged()
        {
            if (this.m_status.Visible && this.WindowState == FormWindowState.Minimized)
            {
                m_status.Visible = false;
            }
            else if (!this.m_status.Visible && this.WindowState != FormWindowState.Minimized)
            {
                m_status.Visible = true;
            }
        }

        public VlcPanel GetPanel(int index)
        {
            return m_panels[index];
        }

        private void ReadFile()
        {
            try
            {
                if (File.Exists(FilePath))
                {
                    StreamReader reader = new StreamReader(FilePath);
                    string strLine = reader.ReadLine().Trim();
                    reader.Close();

                    int index = strLine.IndexOf(',');

                    if (index > 0)
                    {
                        string strWidth = strLine.Substring(0, index).Trim();
                        string strHeight = strLine.Substring(index + 1).Trim();

                        int width, height;

                        if (int.TryParse(strWidth, out width) && int.TryParse(strHeight, out height))
                        {
                            this.Size = new Size(width, height);
                            ResetVlcPanels();
                        }
                    }
                }
            }
            catch (Exception e)
            {
                System.Diagnostics.Trace.WriteLine(e.Message);
            }
        }

        private void WriteFile()
        {
            string strLine = string.Format("{0},{1}", this.Size.Width, this.Size.Height);

            try
            {
                StreamWriter writer = new StreamWriter(FilePath, false);
                writer.Write(strLine);
                writer.Close();
            }
            catch (Exception e)
            {
                System.Diagnostics.Trace.WriteLine(e.Message);
            }
        }
    }
}
