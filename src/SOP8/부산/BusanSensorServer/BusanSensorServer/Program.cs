using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace BusanSensorServer
{
    static class Program
    {

        private static ServiceManager m_serviceManager = null;
        
        /// <summary>
        ///  The main entry point for the application.
        /// </summary>
        [STAThread]
        static void Main()
        {
            m_serviceManager = new ServiceManager();
            Application.Run();
        }
    }
}
