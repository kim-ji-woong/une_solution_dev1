using System.Collections.Generic;
using System.Configuration;
using System.Windows.Forms;

namespace DalMaker
{
    public partial class FormMain : Form
    {
        private string m_strWebServerURL = "";
        private List<DBTable> m_tables = null;

        public FormMain()
        {
            InitializeComponent();
            m_strWebServerURL = ConfigurationManager.AppSettings.Get("WebServerURL");
        }

        private void btnSearch_Click(object sender, System.EventArgs e)
        {
            string strDBName = textBoxDBName.Text.Trim();

            if (strDBName.Length == 0)
            {
                textBoxDBName.Focus();
                MessageBox.Show("DB 이름을 입력하세요.");
                return;
            }

            textBoxNameSpace.Text = strDBName;

            DBManager dbMgr = new DBManager(strDBName, m_strWebServerURL);
            List<DBTable> tables = dbMgr.ReadTables();

            if (tables != null)
            {
                UpdateGrid(tables);
            }
        }

        private void textBoxDBName_KeyDown(object sender, KeyEventArgs e)
        {
            if (e.KeyCode == Keys.Enter)
            {
                btnSearch_Click(null, null);
            }
        }

        private void UpdateGrid(List<DBTable> tables)
        {
            gridTable.Rows.Clear();
            m_tables = null;

            foreach (DBTable table in tables)
            {
                int nRowIndex = gridTable.Rows.Add();

                if (nRowIndex >= 0)
                {
                    DataGridViewRow row = gridTable.Rows[nRowIndex];
                    row.Cells[0].Value = false;
                    row.Cells[1].Value = table.TableName;
                    row.Cells[2].Value = table.TableName;
                    row.Tag = table;
                }
            }

            m_tables = tables;
        }

        private void btnMakeCode_Click(object sender, System.EventArgs e)
        {
            List<DBTable> selectedTables = GetSelectedTables();

            if (selectedTables == null)
            {
                MessageBox.Show("코드를 생성할 테이블을 선택하세요.");
                return;
            }

            string strNamespace = textBoxNameSpace.Text.Trim();

            if (strNamespace.Length == 0)
            {
                textBoxNameSpace.Focus();
                MessageBox.Show("Namespace를 입력하세요.");
                return;
            }

            if (CheckValidNamespace(strNamespace) == false)
                return;

            if (CheckValidClassName() == false)
                return;

            Dictionary<DBTable, string> dicClassNames = new Dictionary<DBTable, string>();

            foreach (DataGridViewRow row in gridTable.Rows)
            {
                DBTable table = (DBTable)row.Tag;
                string strClassName = (string)row.Cells[2].Value;
                dicClassNames[table] = strClassName.Trim();
            }

            if (checkDapper.Checked)
                Dapper.CodeManager.MakeCode(strNamespace, selectedTables, dicClassNames);
            else
                CodeManager.MakeCode(strNamespace, selectedTables, dicClassNames);
        }

        private bool CheckValidClassName()
        {
            string strErrorMessage;
            Dictionary<string, string> dicNames = new Dictionary<string, string>();

            gridTable.ClearSelection();

            foreach (DataGridViewRow row in gridTable.Rows)
            {
                string strClassName = (string)row.Cells[2].Value;

                if (strClassName == null)
                {
                    row.Cells[2].Selected = true;
                    MessageBox.Show("클래스 이름이 비어있습니다.");
                    return false;
                }

                strClassName = strClassName.Trim();

                if (strClassName.Length == 0)
                {
                    row.Cells[2].Selected = true;
                    MessageBox.Show("클래스 이름이 비어있습니다.");
                    return false;
                }

                if (dicNames.ContainsKey(strClassName))
                {
                    row.Cells[2].Selected = true;
                    MessageBox.Show("중복된 클래스 이름이 존재합니다.");
                    return false;
                }

                dicNames[strClassName] = strClassName;

                string[] tokens = strClassName.Split('.');

                foreach (string strToken in tokens)
                {
                    if (CheckRule("Class 이름", strToken, out strErrorMessage) == false)
                    {
                        row.Cells[2].Selected = true;
                        MessageBox.Show(strErrorMessage);
                        return false;
                    }
                }
            }

            return true;
        }

        private bool CheckValidNamespace(string strNamespace)
        {
            string strErrorMessage;
            string[] tokens = strNamespace.Split('.');

            foreach (string strToken in tokens)
            {
                if (CheckRule("Namespace", strToken, out strErrorMessage) == false)
                {
                    textBoxNameSpace.Focus();
                    MessageBox.Show(strErrorMessage);
                    return false;
                }
            }

            return true;
        }

        private bool CheckRule(string strTarget, string strValue, out string strErrorMessage)
        {
            strErrorMessage = null;

            if (strValue.Length == 0)
            {
                strErrorMessage = strTarget + "의 이름은 비워둘수 없습니다.";
                return false;
            }

            if (strValue.Contains(' ') || strValue.Contains('\t'))
            {
                strErrorMessage = strTarget + "에 빈칸이 존재합니다.";
                return false;
            }

            char first = strValue[0];

            if (first == '_')
                return true;
            else if (first >= 'a' && first <= 'z')
                return true;
            else if (first >= 'A' && first <= 'Z')
                return true;

            strErrorMessage = strTarget + "의 첫글자는 '_' 또는 알파벳으로 시작해야 합니다.";
            return false;
        }

        private List<DBTable> GetSelectedTables()
        {
            List<DBTable> tables = new List<DBTable>();

            foreach (DataGridViewRow row in gridTable.Rows)
            {
                if (row.Cells[0].Value != null &&
                    (bool)row.Cells[0].Value)
                    tables.Add((DBTable)row.Tag);
            }

            return tables;
        }

        private void checkBoxSelectAll_CheckedChanged(object sender, System.EventArgs e)
        {
            bool checkedAll = checkBoxSelectAll.Checked;

            foreach (DataGridViewRow row in gridTable.Rows)
            {
                row.Cells[0].Value = checkedAll;
            }
        }

        private void FormMain_Load(object sender, System.EventArgs e)
        {

        }
    }
}
