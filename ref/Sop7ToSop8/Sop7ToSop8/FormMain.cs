using System;
using System.Windows.Forms;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using System.IO;
using System.Text;
using System.Collections.Generic;

namespace Sop7ToSop8
{
    using Migration;

    public partial class FormMain : Form, IMigrationClient
    {
        private IDataManager m_sop7DataManager = null;
        private IDataManager m_sop8DataManager = null;
        private ConfigManager m_configManager = new ConfigManager();
        private MigrationManager m_migrationManager = null;
        private string m_strTempFilePath = "./temp.dat";

        private string m_strInitStatus = "";

        public IDataManager Sop7DataManager
        {
            get { return m_sop7DataManager; }
        }

        public IDataManager Sop8DataManager
        {
            get { return m_sop8DataManager; }
        }

        public FormMain()
        {
            InitializeComponent();
            m_strInitStatus = this.textBoxStatus.Text;
        }

        private void FormMain_Load(object sender, EventArgs e)
        {
            this.textBoxStatus.Text = "";

            string strErrorMessage;

            if (m_configManager.ReadConfig(out strErrorMessage))
            {
                btnBegin.Enabled = true;
            }
            else
            {
                MessageBox.Show(strErrorMessage);
            }

            ReadData();
        }

        private void ReadData()
        {
            if (File.Exists(m_strTempFilePath) == false)
                return;

            StreamReader reader = new StreamReader(m_strTempFilePath, Encoding.UTF8);

            while (reader.EndOfStream == false)
            {
                string strLine = reader.ReadLine().Trim();

                if (strLine.Length == 0)
                    continue;

                if (strLine.ToLower().StartsWith("sop7dbname"))
                {
                    SetTextBox(this.textBoxSop7DbName, strLine);
                }
                else if (strLine.ToLower().StartsWith("sop8dbname"))
                {
                    SetTextBox(this.textBoxSop8DbName, strLine);
                }
                else if (strLine.ToLower().StartsWith("sop8siteno"))
                {
                    SetTextBox(this.textBoxSiteNo, strLine);
                }
            }

            reader.Close();
        }

        private void WriteData()
        {
            StreamWriter writer = new StreamWriter(m_strTempFilePath, false, Encoding.UTF8);

            writer.WriteLine("Sop7DbName\t" + this.textBoxSop7DbName.Text.Trim());
            writer.WriteLine("Sop8DbName\t" + this.textBoxSop8DbName.Text.Trim());
            writer.WriteLine("Sop8SiteNo\t" + this.textBoxSiteNo.Text.Trim());

            writer.Close();
        }

        private void SetTextBox(TextBox textBox, string strLine)
        {
            int index = strLine.IndexOf('\t');

            if (index > 0)
            {
                textBox.Text = strLine.Substring(index + 1).Trim();
            }
        }

        public void SendStatus(string strStatus)
        {
            this.Invoke((MethodInvoker)delegate
            {
                if (this.textBoxStatus.Text.Length == 0)
                    this.textBoxStatus.Text = strStatus;
                else
                    this.textBoxStatus.Text += "\r\n" + strStatus;

                this.textBoxStatus.SelectionStart = this.textBoxStatus.Text.Length;
                this.textBoxStatus.ScrollToCaret();
                this.textBoxStatus.Focus();
            });
        }

        public void Finish()
        {
            this.Invoke((MethodInvoker)delegate
            {
                this.btnBegin.Enabled = true;
            });
        }

        public DialogResult CheckInterrupt()
        {
            DialogResult result = MessageBox.Show(
                "오류를 무시하고 계속 진행할까요?\n(Y: 무시, N: 작업중단, 취소: 계속 무시)",
                "확인",
                MessageBoxButtons.YesNoCancel,
                MessageBoxIcon.Question
            );

            return result;
        }

        private void btnBegin_Click(object sender, EventArgs e)
        {
            if (textBoxSop7DbName.Text.Trim().Length == 0)
            {
                textBoxSop7DbName.Focus();
                MessageBox.Show("SOP7의 Db 이름을 입력하세요.");
                return;
            }

            if (textBoxSop8DbName.Text.Trim().Length == 0)
            {
                textBoxSop8DbName.Focus();
                MessageBox.Show("SOP8의 Db 이름을 입력하세요.");
                return;
            }

            if (textBoxSiteNo.Text.Trim().Length == 0)
            {
                textBoxSiteNo.Focus();
                MessageBox.Show("SOP8의 Site 번호를 입력하세요.");
                return;
            }

            int siteNo;

            if (int.TryParse(textBoxSiteNo.Text.Trim(), out siteNo) == false || siteNo <= 0)
            {
                textBoxSiteNo.Focus();
                MessageBox.Show("SOP8의 Site 번호는 0보다 큰 정수이어야만 합니다.");
                return;
            }

            this.textBoxStatus.Text = "";

            m_sop7DataManager = m_configManager.Sop7Data.MakeDataManager(textBoxSop7DbName.Text.Trim());
            m_sop8DataManager = m_configManager.Sop8Data.MakeDataManager(textBoxSop8DbName.Text.Trim());
            btnBegin.Enabled = false;

            string strErrorMessage;

            if (CheckInitDBData(out strErrorMessage) == false)
            {
                this.textBoxStatus.Text = m_strInitStatus;
                MessageBox.Show(strErrorMessage);
                return;
            }

            m_migrationManager = new MigrationManager(this, siteNo);
            m_migrationManager.Run();
        }

        private void FormMain_FormClosing(object sender, FormClosingEventArgs e)
        {
            WriteData();
        }

        private bool CheckInitDBData(out string strErrorMessage)
        {
            if (CheckSite(out strErrorMessage) == false)
                return false;

            if (CheckCodeClass(out strErrorMessage) == false)
                return false;

            if (CheckCode(out strErrorMessage) == false)
                return false;

            if (CheckSensorSubType(out strErrorMessage) == false)
                return false;

            return true;
        }

        private bool CheckSensorSubType(out string strErrorMessage)
        {
            IEnumerable<Base.Model.Sensor.SubType> subTypes = m_sop8DataManager.GetSelect().Select<Base.Model.Sensor.SubType>(null, out strErrorMessage);

            if (subTypes == null)
                return false;

            foreach (var subType in subTypes)
            {
                return true;
            }

            strErrorMessage = "fa_sensor_sub_ty 테이블이 비어있습니다.";
            return false;
        }

        private bool CheckCode(out string strErrorMessage)
        {
            IEnumerable<Base.Model.Common.Codes> codes = m_sop8DataManager.GetSelect().Select<Base.Model.Common.Codes>(null, out strErrorMessage);

            if (codes == null)
                return false;

            foreach (var code in codes)
            {
                return true;
            }

            strErrorMessage = "co_code 테이블이 비어있습니다.";
            return false;
        }

        private bool CheckCodeClass(out string strErrorMessage)
        {
            IEnumerable<Base.Model.Common.CodeClasses> classes = m_sop8DataManager.GetSelect().Select<Base.Model.Common.CodeClasses>(null, out strErrorMessage);

            if (classes == null)
                return false;

            foreach (var codeClass in classes)
            {
                return true;
            }

            strErrorMessage = "co_code_cl 테이블이 비어있습니다.";
            return false;
        }

        private bool CheckSite(out string strErrorMessage)
        {
            IEnumerable<Base.Model.Common.Site> sites = m_sop8DataManager.GetSelect().Select<Base.Model.Common.Site>(null, out strErrorMessage);

            if (sites == null)
                return false;

            foreach (var site in sites)
            {
                return true;
            }

            strErrorMessage = "co_site 테이블이 비어있습니다.";
            return false;
        }
    }
}
