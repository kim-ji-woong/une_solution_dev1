using System;
using System.Configuration;
using System.Drawing;
using System.Runtime.InteropServices;
using System.Windows.Forms;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using dnsDapperDBUtil.DataAccessLayer.DAL;

namespace BusanSensorServer
{
    public class ServiceManager
    {
        private NotifyIcon m_icon = null;
        private ContextMenuStrip m_contextMenu = null;
        private System.ComponentModel.IContainer components = null;

        private ToolStripMenuItem tsMenuClose;
        private string m_strAppName = "부산 센서서버";
        
        [StructLayout(LayoutKind.Sequential)]
        public struct PointInter
        {
            public int X;
            public int Y;

            public static explicit operator Point(PointInter point)
            {
                return new Point(point.X, point.Y);
            }
        }
        
        [DllImport("user32.dll")]
        public static extern bool GetCursorPos(out PointInter lpPoint);
        
        private ProcessManager m_processManager;
        
        public ServiceManager()
        {
            CreateNotifyicon();
            m_processManager = new ProcessManager();
        }

        private void CreateNotifyicon()
        {
            this.components = new System.ComponentModel.Container();
            this.m_contextMenu = new System.Windows.Forms.ContextMenuStrip();

            this.m_contextMenu = new System.Windows.Forms.ContextMenuStrip(this.components);
            this.tsMenuClose = new System.Windows.Forms.ToolStripMenuItem();

            // Initialize contextMenu1
            this.m_contextMenu.Items.AddRange(new System.Windows.Forms.ToolStripItem[] {
                this.tsMenuClose});
            this.m_contextMenu.Size = new System.Drawing.Size(181, 70);

            // Create the NotifyIcon.
            this.m_icon = new System.Windows.Forms.NotifyIcon(this.components);

            // The Icon property sets the icon that will appear
            // in the systray for this application.
            m_icon.Icon = global::BusanSensorServer.Resource.weather;

            // The ContextMenu property sets the menu that will
            // appear when the systray icon is right clicked.
            m_icon.ContextMenuStrip = this.m_contextMenu;

            // The Text property sets the text that will be displayed,
            // in a tooltip, when the mouse hovers over the systray icon.
            m_icon.Text = m_strAppName;
            m_icon.Visible = true;

            // Handle the DoubleClick event to activate the form.
            m_icon.MouseClick += new System.Windows.Forms.MouseEventHandler(this.trayIcon_MouseClick);

            // 
            // tsMenuClose
            // 
            this.tsMenuClose.Name = "tsMenuClose";
            this.tsMenuClose.Size = new System.Drawing.Size(180, 22);
            this.tsMenuClose.Text = "종료";
            this.tsMenuClose.Click += new System.EventHandler(this.tsMenuClose_Click);
        }
        
        private void tsMenuClose_Click(object sender, EventArgs e)
        {
            //m_timer.Dispose();
            //t_timer.Dispose();
            Application.Exit();
        }

        private void trayIcon_MouseClick(object sender, MouseEventArgs e)
        {
            if (e.Button == MouseButtons.Right)
                m_contextMenu.Show();
        }
    }
}