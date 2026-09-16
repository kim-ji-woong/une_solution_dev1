
using System;
using System.ServiceProcess;
using System.Windows.Forms;

namespace HanbitService
{
    static class Program
    {
        [STAThread]
        static void Main()
        {
#if WinService
            // Windows Service 모드로 실행
            ServiceBase.Run(new HanbitWindowsService());
#else
            // WinForm 모드로 실행
            Application.Run(new FormMain());
#endif
        }
    }
}
