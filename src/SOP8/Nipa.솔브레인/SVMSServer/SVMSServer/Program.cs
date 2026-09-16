using System;
using System.Windows.Forms;

namespace SVMSServer
{
    static class Program
    {
        private static TrayManager m_trayManager = null;

        /// <summary>
        /// 해당 애플리케이션의 주 진입점입니다.
        /// </summary>
        [STAThread]
        static void Main()
        {
            m_trayManager = new TrayManager();
            Application.Run();
        }
    }
}
