using System;

namespace ProcessReader
{
    static class Program
    {
        /// <summary>
        ///  The main entry point for the application.
        /// </summary>
        [STAThread]
        static void Main(string[] args)
        {
            if (args.Length >= 2)
                ProcessManager.ReadProcess(args[0], args[1]);
        }
    }
}
