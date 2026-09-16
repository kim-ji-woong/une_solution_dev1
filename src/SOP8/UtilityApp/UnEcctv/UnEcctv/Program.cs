using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace UnEcctv
{
    using Data;

    static class Program
    {
        /// <summary>
        ///  The main entry point for the application.
        /// </summary>
        [STAThread]
        static void Main(string[] args)
        {
            string strCommand = null;
            string strUrl;

            if (ProcessArgument(args, ref strCommand, out strUrl))
            {
                System.Drawing.Point? position;
                List<CCTVData> cctvDatas = new List<CCTVData>();
                WebServiceManager webServiceManager = new WebServiceManager(strUrl);

                if (webServiceManager.RunCommand(strCommand, cctvDatas, out position) != null)
                {
                    if (position != null)
                    {
                        Application.SetHighDpiMode(HighDpiMode.SystemAware);
                        Application.EnableVisualStyles();
                        Application.SetCompatibleTextRenderingDefault(false);
                        Application.Run(new FormMain(strCommand, strUrl));
                    }
                }
            }
        }

        static bool ProcessArgument(string[] args, ref string strCommand, out string strUrl)
        {
            strUrl = null;

            if (args == null)
                return true;

            int len = args.Length;

            if (len < 2)
                return true;

            strUrl = args[0].Trim();

            string strTarget = "://";
            int index = args[1].IndexOf(strTarget);

            string strArgument = args[1];

            for (int i = 2; i < len; i++)
            {
                string arg = args[i];
                strArgument += " " + arg;
            }

            if (index > 0)
            {
                strCommand = strArgument.Substring(index + strTarget.Length).Trim();
                string strLowerCommand = strCommand.ToLower();

                if (strLowerCommand.Contains("closeall"))
                    return CommandManager.CloseAll(strCommand, strUrl);
                else if (strLowerCommand.Contains("showall"))
                    return CommandManager.ShowAll(strCommand, true, strUrl);
                else if (strLowerCommand.Contains("hideall"))
                    return CommandManager.ShowAll(strCommand, false, strUrl);
            }

            return true;
        }
    }
}
