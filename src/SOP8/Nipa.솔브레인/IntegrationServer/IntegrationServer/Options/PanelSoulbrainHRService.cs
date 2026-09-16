using System.Collections.Generic;
using System.Windows.Forms;
using IntegrationServer.Datas;

namespace IntegrationServer.Options
{
    public partial class PanelSoulbrainHRService : UserControl, IOptionPanel
    {
        private IManager m_manager = null;
    
        public PanelSoulbrainHRService(IManager manager)
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
                DbNameInput.TextChanged -= OnTextChanged;
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
                    if (txtCtrl == DbNameInput)
                    {
                        m_manager.SetServerProperty(item, ServerProperty.HRDbName, DbNameInput.Text);
                    }
                }
            }
        }
    }
}