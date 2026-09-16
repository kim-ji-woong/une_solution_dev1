using System.Windows.Forms;

namespace HanbitService
{
    public partial class FormMain : Form
    {
        private AlarmMonitor m_alarmMonitor;

        public FormMain()
        {
            InitializeComponent();
        }

        private void FormMain_Load(object sender, System.EventArgs e)
        {
            m_alarmMonitor = new AlarmMonitor();
            m_alarmMonitor.Start();
        }

        private void FormMain_FormClosing(object sender, FormClosingEventArgs e)
        {
            m_alarmMonitor?.Stop();
        }
    }
}
