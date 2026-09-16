using System.Collections.Generic;
using System.Windows.Forms;
using static dnsData.CommonCode.SdmsSensor;

namespace IntegrationServer.Options
{
    using Datas;

    public partial class PanelSVMS : UserControl, IOptionPanel
    {
        private IManager m_manager = null;

        public int SequenceNo
        {
            get; set;
        }


        public PanelSVMS(IManager manager)
        {
            m_manager = manager;
            InitializeComponent();
        }

        public void LoadServerDetailData(ServerData data)
        {
            if (data.ServerProperties == null)
                return;

            foreach (KeyValuePair<ServerProperty, object> pair in data.ServerProperties)
            {
                txtSvmsIP.TextChanged -= OnTextChanged;
                txtSvmsPort.TextChanged -= OnTextChanged;
                txtSvmsID.TextChanged -= OnTextChanged;
                txtSvmsPw.TextChanged -= OnTextChanged;
                txtRtspServerName.TextChanged -= OnTextChanged;
                txtRunRtspServer.TextChanged -= OnTextChanged;
                txtCctvConfig.TextChanged -= OnTextChanged;

                if (data.ServerType == ServerType.CCTV_S1_SVMS)
                {
                    if (pair.Key == ServerProperty.SvmsIP)
                        txtSvmsIP.Text = pair.Value.ToString();
                    else if (pair.Key == ServerProperty.SvmsPort)
                        txtSvmsPort.Text = pair.Value.ToString();
                    else if (pair.Key == ServerProperty.SvmsID)
                        txtSvmsID.Text = pair.Value.ToString();
                    else if (pair.Key == ServerProperty.SvmsPW)
                        txtSvmsPw.Text = pair.Value.ToString();
                    else if (pair.Key == ServerProperty.RtspServerName)
                        txtRtspServerName.Text = pair.Value.ToString();
                    else if (pair.Key == ServerProperty.RunRtspServer)
                        txtRunRtspServer.Text = pair.Value.ToString();
                    else if (pair.Key == ServerProperty.CctvConfig)
                        txtCctvConfig.Text = pair.Value.ToString();
                }

                txtSvmsIP.TextChanged += OnTextChanged;
                txtSvmsPort.TextChanged += OnTextChanged;
                txtSvmsID.TextChanged += OnTextChanged;
                txtSvmsPw.TextChanged += OnTextChanged;
                txtRtspServerName.TextChanged += OnTextChanged;
                txtRunRtspServer.TextChanged += OnTextChanged;
                txtCctvConfig.TextChanged += OnTextChanged;
            }
        }

        private void OnTextChanged(object sender, System.EventArgs e)
        {
            if (m_manager.ServerSetting.ServerDatas == null)
                return;

            TextBox txtCtrl = sender as TextBox;
            if (txtCtrl == null)
                return;

            foreach (var item in m_manager.ServerSetting.ServerDatas)
            {
                if (item.SeqNo == m_manager.CurrentServerSeqNo)
                {
                    if (txtCtrl == txtSvmsIP)
                        m_manager.SetServerProperty(item, ServerProperty.SvmsIP, txtSvmsIP.Text);
                    else if (txtCtrl == txtSvmsPort)
                        m_manager.SetServerProperty(item, ServerProperty.SvmsPort, txtSvmsPort.Text);
                    else if (txtCtrl == txtSvmsID)
                        m_manager.SetServerProperty(item, ServerProperty.SvmsID, txtSvmsID.Text);
                    else if (txtCtrl == txtSvmsPw)
                        m_manager.SetServerProperty(item, ServerProperty.SvmsPW, txtSvmsPw.Text);
                    else if (txtCtrl == txtRtspServerName)
                        m_manager.SetServerProperty(item, ServerProperty.RtspServerName, txtRtspServerName.Text);
                    else if (txtCtrl == txtRunRtspServer)
                        m_manager.SetServerProperty(item, ServerProperty.RunRtspServer, txtRunRtspServer.Text);
                    else if (txtCtrl == txtCctvConfig)
                        m_manager.SetServerProperty(item, ServerProperty.CctvConfig, txtCctvConfig.Text);
                    break;
                }
            }
        }
    }
}
