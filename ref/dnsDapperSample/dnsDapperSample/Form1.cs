using DapperSample.BLL;
using DapperSample.BLL.DataAccessLayer.DAL;
using dnsDapperDBUtil.DataAccessLayer.DAL;
using System;
using System.Windows.Forms;

namespace dnsDapperSample
{
    public partial class Form1 : Form
    {
        private ProcessManager m_procManager = null;

        public Form1()
        {
            InitializeComponent();

            //m_mssqlManager = new dnsDapperDBUtil.Manager.SqlServerManager("127.0.0.1", "sa", "9449966Ab", "DapperTest");

            //// 1) 1 table query
            //IEnumerable<Member> members = m_mssqlManager.Query<Member>("select id, memberName from member");

            //// 2) 1 table query parameters
            //IEnumerable<Member> members2 = m_mssqlManager.Query<Member>("select * from Member where Id=@id and memberName=@memberName", new { @id = 1, @memberName = "AAA" });

            //// 3) dynamic
            //string strQuery = "select m.id MemberID, m.MemberName, c.ID CompanyID, c.CompanyName from Member m inner join Company c on m.companyID=c.ID";
            //// strQuery = "select 'a' val union all select 'b'";
            //IEnumerable<dynamic> datas1 = m_mssqlManager.Query(strQuery);
            //foreach (var item in datas1)
            //{
            //    var fields = item as IDictionary<string, object>;
            //    //datas1["MemberID"];
            //}

            //// 4) 2 table join
            //dnsDapperDBUtil.Manager.SqlServerManager sql = new dnsDapperDBUtil.Manager.SqlServerManager();
            //using (DbConnection db = dnsDapperDBUtil.Manager.SqlServerManager.GetConnection())
            //{
            //    string strQuery = "select m.*, c.* from Member m inner join Company c on m.companyID=c.ID";
            //    IEnumerable<CompanyMemberDatas> ddd = db.Query<Member, Company, CompanyMemberDatas>(strQuery
            //        , (d1, d2) =>
            //    {
            //        CompanyMemberDatas d3 = new CompanyMemberDatas();
            //        d3.Member = new Member() { ID = d1.ID, MemberName = d1.MemberName };
            //        d3.Company = new Company() { ID = d2.ID, CompanyName = d2.CompanyName };
            //        return d3;
            //    }).AsQueryable();
            //}

            //// 5)
            //IEnumerable<CompanyMemberDatas> dd = m_mssqlManager.Query<Member, Company, CompanyMemberDatas>(strQuery, new CompanyMemberDatas());
        }

        private void btnConnect_Click(object sender, EventArgs e)
        {
            DataManager2 dataManager = new DataManager2(0, txtHost.Text, txtDbName.Text, txtDbId.Text, txtDbPw.Text);                            
            m_procManager = new ProcessManager(dataManager);
        }

        private void btnSite_Click(object sender, EventArgs e)
        {
            if (m_procManager == null)
                btnConnect_Click(null, null);

            m_procManager.LoadManager.LoadRegular();
        }

        private void btnAddRegular_Click(object sender, EventArgs e)
        {
            if (m_procManager == null)
                btnConnect_Click(null, null);

            if (txtRegular.Text.Length == 0)
            {
                MessageBox.Show("팀 이름 입력");
                return;
            }

            int nAddID = m_procManager.SaveManager.AddRegular(txtRegular.Text);
            lblRegularID.Text = "추가된 팀 ID : " + nAddID;
        }

        private void btnTransaction_Click(object sender, EventArgs e)
        {
            if (m_procManager == null)
                btnConnect_Click(null, null);

            m_procManager.SaveManager.TransactionTest();
        }

        private void btnAddMulti_Click(object sender, EventArgs e)
        {
            if (m_procManager == null)
                btnConnect_Click(null, null);

            m_procManager.SaveManager.AddRegulars();
        }

        private void btnDelete_Click(object sender, EventArgs e)
        {
            if (m_procManager == null)
                btnConnect_Click(null, null);

            m_procManager.SaveManager.DeleteRegular();
        }

        private void btnUpdate_Click(object sender, EventArgs e)
        {
            if (m_procManager == null)
                btnConnect_Click(null, null);

            m_procManager.SaveManager.UpdateRegular();
        }
    }
}
