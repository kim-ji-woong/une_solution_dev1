using IntegrationServer.Datas;
using IntegrationServer.Managers;
using IntegrationServer.Options;
using IntegrationServer.Servers;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using dnsDapperDBUtil.DataAccessLayer.DAL;
using static dnsData.CommonCode.SdmsSensor;

namespace IntegrationServer
{
    public partial class FormMain : Form, IManager
    {
        public FormMain()
        {
            InitializeComponent();
        }

        private int m_nCurrentServerSeqNo = -1;
        public int CurrentServerSeqNo
        {
            get { return m_nCurrentServerSeqNo; }
            set
            {
                if (value > 0)
                    gbProperty.Enabled = true;
                else
                    gbProperty.Enabled = false;

                m_nCurrentServerSeqNo = value;
            }
        }

        private int m_nCurrentServerType = -1;
        private ServerSetting m_serverSetting = null;
        public ServerSetting ServerSetting
        {
            get { return m_serverSetting; }
            set { m_serverSetting = value; }
        }

        private readonly int nColumnIndex_SeqNo = 0;
        private readonly int nColumnIndex_ServerType = 1;
        private readonly int nColumnIndex_ServerName = 2;

        private SettingManager m_settingManager = null;
        private ServerManager m_serverManager = null;
        private AlarmManager m_alarmManager = null;

        private bool m_bBeginServer = false;
        private List<IOptionPanel> m_optionPanels = new List<IOptionPanel>();


        #region 초기화
        private void FormMain_Load(object sender, EventArgs e)
        {
            InitComboBox();
            InitGridView();

            LoadSetting();
        }

        private Point m_pProperty = new Point(466, 215);
        private void SetVisibleCtrl()
        {
            foreach (IOptionPanel panel in m_optionPanels)
            {
                if (panel.SequenceNo == m_nCurrentServerSeqNo)
                    panel.Visible = true;
                else
                    panel.Visible = false;
            }

            if (m_nCurrentServerType == ServerType.Fire_Johnson)
                IOptionPanel.AddControl(new PanelJohnson(this), m_nCurrentServerSeqNo, m_pProperty, this.Controls, m_optionPanels);
            else if (m_nCurrentServerType == ServerType.CCTV_S1_SVMS)
                IOptionPanel.AddControl(new PanelSVMS(this), m_nCurrentServerSeqNo, m_pProperty, this.Controls, m_optionPanels);
            else if (m_nCurrentServerType == ServerType.Soulbrain_Hancom)
                IOptionPanel.AddControl(new PanelSoulbrainHancom(this), m_nCurrentServerSeqNo, m_pProperty, this.Controls, m_optionPanels);
            else if (m_nCurrentServerType == ServerType.Soulbrain_HR) 
                IOptionPanel.AddControl(new PanelSoulbrainHRService(this), m_nCurrentServerSeqNo, m_pProperty, this.Controls, m_optionPanels);
        }

        private void InitGridView()
        {
            List<ComboBoxItem> colTypeItems = new List<ComboBoxItem>();
            foreach (int value in Enum.GetValues(typeof(ComboBoxServerTypes)))
            {
                colTypeItems.Add(new ComboBoxItem() { ID = (int)value, Name = dnsData.CommonCode.SdmsSensor.ServerType.GetServerText(value) });
            }

            colServerType.DataSource = colTypeItems;
            colServerType.DisplayMember = "Name";
            colServerType.ValueMember = "ID";
            dataGridView1.CurrentCellDirtyStateChanged += DataGridView1_CurrentCellDirtyStateChanged;
            dataGridView1.CellValueChanged += DataGridView1_CellValueChanged;
            dataGridView1.SelectionChanged += DataGridView1_SelectionChanged;
        }

        private void InitComboBox()
        {
            foreach (DbTypes value in Enum.GetValues(typeof(DbTypes)))
            {
                cbDbType.Items.Add(new ComboBoxItem() { ID = (int)value, Name = value.ToString() });
            }

            cbDbType.DisplayMember = "Name";
            cbDbType.ValueMember = "ID";
        }

        private void LoadSetting()
        {
            if (m_settingManager == null)
                m_settingManager = new SettingManager();

            m_serverSetting = m_settingManager.LoadSetting();
            if (m_serverSetting == null)
            {
                MessageBox.Show("설정값 불러오기 오류");
                return;
            }
            
            m_alarmManager = new AlarmManager(null, new DataManager(m_serverSetting.DbType, m_serverSetting.DbIP, m_serverSetting.DbName, m_serverSetting.DbID, m_serverSetting.DbPW), m_serverSetting.SOPWebServerFrontURL);
            m_alarmManager.Start();

            txtDbIP.TextChanged -= txt_TextChanged;
            txtDbName.TextChanged -= txt_TextChanged;
            txtDbID.TextChanged -= txt_TextChanged;
            txtDbPw.TextChanged -= txt_TextChanged;
            txtServerSiteID.TextChanged -= txt_TextChanged;

            txtDbIP.Text = m_serverSetting.DbIP;
            txtDbName.Text = m_serverSetting.DbName;
            txtDbID.Text = m_serverSetting.DbID;
            txtDbPw.Text = m_serverSetting.DbPW;
            txtLogPath.Text = m_serverSetting.LogPath;
            txtSOPWebServerFrontURL.Text = m_serverSetting.SOPWebServerFrontURL;

            foreach (var item in cbDbType.Items)
            {
                ComboBoxItem dbType = item as ComboBoxItem;
                if (dbType.ID == m_serverSetting.DbType)
                {
                    cbDbType.SelectedItem = item;
                    break;
                }
            }

            LoadGridView();

            txtDbIP.TextChanged += txt_TextChanged;
            txtDbName.TextChanged += txt_TextChanged;
            txtDbID.TextChanged += txt_TextChanged;
            txtDbPw.TextChanged += txt_TextChanged;
            txtServerSiteID.TextChanged += txt_TextChanged;
        }

        private void LoadGridView()
        {
            dataGridView1.Rows.Clear();
            foreach (var item in m_serverSetting.ServerDatas)
            {
                dataGridView1.Rows.Add(item.SeqNo, item.ServerType, item.ServerType);
            }
        }
        #endregion

        #region 설정 관련
        private void LoadServerData()
        {
            if (m_serverSetting == null)
                return;

            SetVisibleCtrl();

            foreach (var item in m_serverSetting.ServerDatas)
            {
                if (item.SeqNo == CurrentServerSeqNo)
                {
                    gbProperty.Text = item.ServerName;
                    cbUse.Checked = item.Use;
                    txtServerSiteID.Text = item.SiteID.ToString();
                    txtServerAlias.Text = item.ServerAlias;
                    txtServerIP.Text = item.IP;
                    txtServerPort.Text = item.Port.ToString();
                    txtSOPWebServerURL.Text = item.SOPWebServerURL == null ? "" : item.SOPWebServerURL.ToString();

                    foreach (IOptionPanel panel in m_optionPanels)
                    {
                        panel.LoadServerDetailData(item);
                    }
                    break;
                }
            }
        }

        private void ResetServerData()
        {
            gbProperty.Text = string.Empty;
            gbProperty.Enabled = false;
        }

        private void SaveServerData()
        {
            try
            {
                List<string> noneAlias = new List<string>();
                foreach (var item in m_serverSetting.ServerDatas)
                {
                    if (item.ServerAlias == null || item.ServerAlias.Trim().Length == 0)
                    {
                        MessageBox.Show("별칭을 입력하세요. SeqNo : " + item.SeqNo);
                        return;
                    }

                    if (noneAlias.Contains(item.ServerAlias.Trim()))
                    {
                        MessageBox.Show("별칭은 중복될 수 없습니다. SeqNo : " + item.SeqNo);
                        return;
                    }

                    noneAlias.Add(item.ServerAlias.Trim());
                }

                m_settingManager = new SettingManager(m_serverSetting.DbType, m_serverSetting.DbIP, m_serverSetting.DbName, m_serverSetting.DbID, m_serverSetting.DbPW);
                if (!m_settingManager.SaveSetting(m_serverSetting, out string strError))
                {
                    MessageBox.Show(strError);
                    return;
                }
                MessageBox.Show("저장완료");
            }
            catch (Exception e)
            {
                MessageBox.Show(e.Message);
            }
        }

        public void SetServerProperty(ServerData data, ServerProperty property, object value)
        {
            if (data == null)
                return;

            if (data.ServerProperties == null)
                data.ServerProperties = new Dictionary<ServerProperty, object>();

            data.ServerProperties[property] = value;
        }

        #endregion



        #region 컨트롤 이벤트
        private void btnDeleteServer_Click(object sender, EventArgs e)
        {
            if (dataGridView1.SelectedRows == null || dataGridView1.SelectedRows.Count == 0 || dataGridView1.SelectedRows[0].Cells[nColumnIndex_ServerName].Value == null)
                return;

            int nSelectedSeqNo = (int)dataGridView1.SelectedRows[0].Cells[nColumnIndex_SeqNo].Value;

            if (!m_settingManager.CheckDeleteServerInfo(nSelectedSeqNo, out string strError))
            {
                MessageBox.Show(strError);
                return;
            }

            m_serverSetting.ServerDatas.RemoveAll(p => p.SeqNo == nSelectedSeqNo);

            foreach (IOptionPanel panel in m_optionPanels)
            {
                if (panel.SequenceNo == nSelectedSeqNo)
                {
                    UserControl ctrl = (UserControl)panel;
                    this.Controls.Remove(ctrl);
                    ctrl.Dispose();
                }
            }

            LoadGridView();
        }

        private void DataGridView1_CurrentCellDirtyStateChanged(object sender, EventArgs e)
        {
            if (dataGridView1.IsCurrentCellDirty)
                dataGridView1.CommitEdit(DataGridViewDataErrorContexts.Commit);
        }

        private void DataGridView1_CellValueChanged(object sender, DataGridViewCellEventArgs e)
        {
            if (dataGridView1.SelectedRows == null || dataGridView1.SelectedRows.Count == 0 || dataGridView1.SelectedRows[0].Cells[nColumnIndex_ServerName].Value == null)
            {
                ResetServerData();
                return;
            }

            dataGridView1.CellValueChanged -= DataGridView1_CellValueChanged;

            int enumServer = (int)dataGridView1.SelectedRows[0].Cells[nColumnIndex_ServerName].Value;

            bool bIsAdd = dataGridView1.SelectedRows[0].Cells[nColumnIndex_SeqNo].Value == null;
            int nServerSeqNo = bIsAdd ? 0 : (int)dataGridView1.SelectedRows[0].Cells[nColumnIndex_SeqNo].Value;
            if (bIsAdd)
            {
                foreach (DataGridViewRow row in dataGridView1.Rows)
                {
                    if (row == dataGridView1.SelectedRows[0])
                        continue;

                    if (row.Cells[nColumnIndex_SeqNo].Value == null)
                        continue;

                    nServerSeqNo = Math.Max(nServerSeqNo, (int)row.Cells[nColumnIndex_SeqNo].Value);
                }
                nServerSeqNo++;
            }

            int nServerType = (int)enumServer;
            string strServerName = ServerType.GetServerText(enumServer);
            dataGridView1.SelectedRows[0].Cells[nColumnIndex_SeqNo].Value = CurrentServerSeqNo = nServerSeqNo;
            dataGridView1.SelectedRows[0].Cells[nColumnIndex_ServerType].Value = m_nCurrentServerType = nServerType;

            if (bIsAdd)
            {
                ServerData data = new ServerData()
                {
                    SeqNo = nServerSeqNo,
                    ServerType = nServerType,
                    ServerName = strServerName
                };

                m_serverSetting.ServerDatas.Add(data);
            }
            else
            {
                foreach (var item in m_serverSetting.ServerDatas)
                {
                    if (item.SeqNo == nServerSeqNo)
                    {
                        item.ServerType = nServerType;
                        item.ServerName = strServerName;
                        break;
                    }
                }
            }

            LoadServerData();

            dataGridView1.CellValueChanged += DataGridView1_CellValueChanged;
        }

        private void DataGridView1_SelectionChanged(object sender, EventArgs e)
        {
            if (dataGridView1.SelectedRows == null || dataGridView1.SelectedRows.Count == 0)
            {
                ResetServerData();
                return;
            }

            DataGridViewRow row = dataGridView1.SelectedRows[0];
            if (row.Cells[nColumnIndex_SeqNo].Value == null || row.Cells[nColumnIndex_ServerType].Value == null)
            {
                ResetServerData();
                return;
            }

            int nSeqNo, nServerType;
            if (!int.TryParse(row.Cells[nColumnIndex_SeqNo].Value.ToString(), out nSeqNo) || !int.TryParse(row.Cells[nColumnIndex_ServerType].Value.ToString(), out nServerType))
            {
                ResetServerData();
                return;
            }

            CurrentServerSeqNo = nSeqNo;
            m_nCurrentServerType = nServerType;
            LoadServerData();
        }

        private void cbDbType_SelectedIndexChanged(object sender, EventArgs e)
        {
            m_serverSetting.DbType = cbDbType.SelectedItem != null && cbDbType.SelectedItem is ComboBoxItem ? ((ComboBoxItem)cbDbType.SelectedItem).ID : 0;
        }

        private void txt_TextChanged(object sender, EventArgs e)
        {
            if (sender is TextBox)
            {
                TextBox txtCtrl = sender as TextBox;
                if (txtCtrl == null)
                    return;

                if (txtCtrl == txtLogPath)
                {
                    m_serverSetting.LogPath = txtLogPath.Text;
                }

                if (m_serverSetting.ServerDatas == null)
                    return;

                if (txtCtrl == txtDbIP || txtCtrl == txtDbName || txtCtrl == txtDbID || txtCtrl == txtDbPw || txtCtrl == txtSOPWebServerFrontURL)
                {
                    if (txtCtrl == txtDbIP)
                        m_serverSetting.DbIP = txtDbIP.Text;
                    else if (txtCtrl == txtDbName)
                        m_serverSetting.DbName = txtDbName.Text;
                    else if (txtCtrl == txtDbID)
                        m_serverSetting.DbID = txtDbID.Text;
                    else if (txtCtrl == txtDbPw)
                        m_serverSetting.DbPW = txtDbPw.Text;
                    else if (txtCtrl == txtSOPWebServerFrontURL)
                        m_serverSetting.SOPWebServerFrontURL = txtSOPWebServerFrontURL.Text;
                }
                else
                {
                    foreach (var item in m_serverSetting.ServerDatas)
                    {
                        if (item.SeqNo == CurrentServerSeqNo)
                        {
                            if (txtCtrl == txtServerIP)
                            {
                                item.IP = txtServerIP.Text;
                            }
                            else if (txtCtrl == txtServerSiteID)
                            {
                                int siteID;
                                if (int.TryParse(txtServerSiteID.Text, out siteID))
                                    item.SiteID = siteID;
                                else
                                {
                                    MessageBox.Show("숫자입력");
                                    txtServerSiteID.Text = "0";
                                }
                            }
                            else if (txtCtrl == txtServerAlias)
                                item.ServerAlias = txtServerAlias.Text;
                            else if (txtCtrl == txtServerPort)
                            {
                                int port;
                                if (int.TryParse(txtServerPort.Text, out port))
                                    item.Port = port;
                                else
                                {
                                    MessageBox.Show("숫자입력");
                                    txtServerPort.Text = "0";
                                }
                            }
                            else if (txtCtrl == txtSOPWebServerURL)
                                item.SOPWebServerURL = txtSOPWebServerURL.Text;
                            break;
                        }
                    }
                }
            }
        }

        private void cbUse_CheckedChanged(object sender, EventArgs e)
        {
            if (m_serverSetting.ServerDatas == null)
                return;

            foreach (var item in m_serverSetting.ServerDatas)
            {
                if (item.SeqNo == CurrentServerSeqNo)
                {
                    item.Use = cbUse.Checked;
                    break;
                }
            }
        }

        private void btnSave_Click(object sender, EventArgs e)
        {
            SaveServerData();
        }

        private void btnSearch_Click(object sender, EventArgs e)
        {
            m_settingManager = new SettingManager(m_serverSetting.DbType, m_serverSetting.DbIP, m_serverSetting.DbName, m_serverSetting.DbID, m_serverSetting.DbPW);
            m_settingManager.LoadServerInfoDB(m_serverSetting);

            LoadServerData();
            LoadGridView();
        }

        private void btnServer_Click(object sender, EventArgs e)
        {
            if (m_bBeginServer)
            {
                if (m_serverManager != null)
                    m_serverManager.StopServer();

                m_bBeginServer = false;
                btnServer.Text = "서버시작";
            }
            else
            {
                m_serverManager = new ServerManager(m_serverSetting);
                if (m_serverManager.BeginServer())
                {
                    m_bBeginServer = true;
                    btnServer.Text = "서버중지";
                }
                else
                {
                    m_bBeginServer = false;
                    btnServer.Text = "서버시작";
                }
            }
        }

        private void FormMain_FormClosing(object sender, FormClosingEventArgs e)
        {
            if (m_bBeginServer)
            {
                m_serverManager.StopServer();
            }
        }


        #endregion
    }



    public class ComboBoxItem
    {
        public int ID { get; set; }
        public string Name { get; set; }
    }
}
