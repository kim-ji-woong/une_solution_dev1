using IntegrationServer.Datas;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Text;
using System.Windows.Forms;
using static dnsData.CommonCode.SdmsSensor;

namespace IntegrationServer.Options
{
    public partial class PanelSoulbrainHancom : UserControl, IOptionPanel
    {
        private IManager m_manager = null;

        public PanelSoulbrainHancom(IManager manager)
        {
            m_manager = manager;
            InitializeComponent();
        }

        public int SequenceNo
        {
            get; set;
        }

        public void LoadServerDetailData(ServerData data)
        {
            if (data.ServerProperties == null)
                return;

            foreach (KeyValuePair<ServerProperty, object> pair in data.ServerProperties)
            {
                txtSoulURL.TextChanged -= OnTextChanged;
                txtSoulID.TextChanged -= OnTextChanged;
                txtSoulPW.TextChanged -= OnTextChanged;


                if (data.ServerType == ServerType.Soulbrain_Hancom)
                {
                    if (pair.Key == ServerProperty.SoulURL)
                        txtSoulURL.Text = pair.Value.ToString();
                    else if (pair.Key == ServerProperty.SoulID)
                        txtSoulID.Text = pair.Value.ToString();
                    else if (pair.Key == ServerProperty.SoulPW)
                        txtSoulPW.Text = pair.Value.ToString();

                }

                txtSoulURL.TextChanged += OnTextChanged;
                txtSoulID.TextChanged += OnTextChanged;
                txtSoulPW.TextChanged += OnTextChanged;
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
                    if (txtCtrl == txtSoulURL)
                        m_manager.SetServerProperty(item, ServerProperty.SoulURL, txtSoulURL.Text);
                    else if (txtCtrl == txtSoulID)
                        m_manager.SetServerProperty(item, ServerProperty.SoulID, txtSoulID.Text);
                    else if (txtCtrl == txtSoulPW)
                        m_manager.SetServerProperty(item, ServerProperty.SoulPW, txtSoulPW.Text);
                    break;
                }
            }
        }
    }
}
