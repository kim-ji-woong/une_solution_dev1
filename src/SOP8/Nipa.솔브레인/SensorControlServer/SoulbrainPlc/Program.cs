using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace SoulbrainPlc
{
    static class Program
    {
        /// <summary>
        ///  The main entry point for the application.
        /// </summary>
        [STAThread]
        static void Main()
        {
            Application.ThreadException += (sender, e) => 
            {
                File.AppendAllText("CrashLog.txt", $"[ThreadException] {e.Exception}\n");
            };

            // 2. 모든 스레드의 처리되지 않은 예외 (여기가 가장 중요)
            AppDomain.CurrentDomain.UnhandledException += (sender, e) => 
            {
                File.AppendAllText("CrashLog.txt", $"[Unhandled] {e.ExceptionObject}\n");
            };
            
            PlcManager.Run();
        }
    }
}