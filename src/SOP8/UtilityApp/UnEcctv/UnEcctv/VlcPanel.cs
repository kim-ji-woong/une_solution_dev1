using System;
using Vlc.DotNet.Forms;
using System.Windows.Forms;
using System.IO;

namespace UnEcctv
{
    using Data;

    public partial class VlcPanel : UserControl
    {
        //private VlcControl vlcControl1 = null;
        private IVlcPanelOwner m_owner = null;
        private CCTVData m_data = null;

        public IVlcPanelOwner Owner
        {
            get { return m_owner; }
            set { m_owner = value; }
        }

        public string Title
        {
            get { return labelTitle.Text; }
            set { labelTitle.Text = value; }
        }

        public CCTVData Data
        {
            get { return m_data; }
            set { SetData(value); }
        }

        public VlcPanel()
        {
            InitializeComponent();
        }

        private string[] GetVlcOptions()
        {
            // RTSP 기본옵션을 UDP에서 TCP로 변경
            var options = new[]
            {
                "--rtsp-tcp"
            };

            return options;
        }

        private DirectoryInfo GetVlcDirectory()
        {
            int index = Application.ExecutablePath.LastIndexOf('\\');
            string strFolderPath = index > 0 ? Application.ExecutablePath.Substring(0, index) : Application.ExecutablePath;

            var vlcLibDirectory = new DirectoryInfo(Path.Combine(strFolderPath, "libvlc", IntPtr.Size == 4 ? "win-x86" : "win-x64"));
            return vlcLibDirectory;
        }

        private void OnMouseDoubleClick(object sender, MouseEventArgs e)
        {
            if (m_owner != null)
                m_owner.OnPanelMouseDoubleClick(this);
        }

        private void SetData(CCTVData data)
        {
            if (data == null || data.Url == null || data.Url.Length == 0)
            {
                m_data = null;
                this.Visible = false;

                if (data != null)
                    this.labelTitle.Text = data.Title;
                else
                    this.labelTitle.Text = "";
            }
            else
            {
                this.labelTitle.Text = data.Title;

                try
                {
                    this.vlcControl1.Play(new Uri(data.Url));
                }
                catch (Exception)
                {
                    this.Visible = false;
                    return;
                }

                m_data = data;
                this.Visible = true;
            }
        }
    }

    public interface IVlcPanelOwner
    {
        void OnPanelMouseDoubleClick(VlcPanel panel);
    }
}
