using System;
using System.Collections.Generic;
using System.Windows.Forms;

namespace IntegrationServer.Options
{
    using Datas;
    using static dnsData.CommonCode.SdmsSensor;

    public partial class PanelJohnson : UserControl, IOptionPanel
    {
        private IManager m_manager = null;

        public int SequenceNo
        {
            get; set;
        }

        public PanelJohnson(IManager manager)
        {
            m_manager = manager;
            InitializeComponent();
        }

        public void LoadServerDetailData(ServerData data)
        {
            if (data.ServerProperties == null)
                return;

            if (data == null || data.ServerProperties == null)
            {
                if (data.ServerType == ServerType.Fire_Johnson)
                {
                    rbMux1.Checked = rbMux2.Checked = false;
                }
                return;
            }

            foreach (KeyValuePair<ServerProperty, object> pair in data.ServerProperties)
            {
                if (data.ServerType == ServerType.Fire_Johnson)
                {
                    rbMux1.CheckedChanged -= rb_CheckedChanged;
                    rbMux2.CheckedChanged -= rb_CheckedChanged;

                    if (pair.Key == ServerProperty.MuxType)
                    {
                        // json 파일 읽을때 int64 타입으로 읽어와서 그냥 string으로 비교했음
                        if (pair.Value.ToString() == ((int)MuxTypes.Mux1).ToString())
                            rbMux1.Checked = true;
                        else if (pair.Value.ToString() == ((int)MuxTypes.Mux2).ToString())
                            rbMux2.Checked = true;
                    }

                    rbMux1.CheckedChanged += rb_CheckedChanged;
                    rbMux2.CheckedChanged += rb_CheckedChanged;
                }
            }
        }

        private void rb_CheckedChanged(object sender, EventArgs e)
        {
            if (m_manager.ServerSetting.ServerDatas == null)
                return;

            if (sender is RadioButton)
            {
                RadioButton rbBtn = sender as RadioButton;
                if (rbBtn == null)
                    return;

                foreach (var item in m_manager.ServerSetting.ServerDatas)
                {
                    if (item.SeqNo == m_manager.CurrentServerSeqNo)
                    {
                        if (rbBtn == rbMux1 || rbBtn == rbMux2)
                        {
                            int nMuxType = rbMux1.Checked ? (int)MuxTypes.Mux1 : rbMux2.Checked ? (int)MuxTypes.Mux2 : (int)MuxTypes.None;
                            m_manager.SetServerProperty(item, ServerProperty.MuxType, nMuxType);
                        }
                        break;
                    }
                }
            }
        }
    }
}
