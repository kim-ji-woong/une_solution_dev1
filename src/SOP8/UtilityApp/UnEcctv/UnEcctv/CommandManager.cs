namespace UnEcctv
{
    class CommandManager
    {
        public static bool CloseAll(string strCommand, string strUrl)
        {
            int index = strCommand.IndexOf('/');

            if (index > 0)
            {
                string strUserID = strCommand.Substring(0, index).Trim();
                int userID;

                if (int.TryParse(strUserID, out userID))
                {
                    System.Diagnostics.Process[] processes = System.Diagnostics.Process.GetProcessesByName(System.Diagnostics.Process.GetCurrentProcess().ProcessName);

                    if (processes != null)
                    {
                        foreach (var process in processes)
                        {
                            process.Kill();
                        }
                    }
                }
            }

            return false;
        }

        public static bool ShowAll(string strCommand, bool visible, string strUrl)
        {
            int index = strCommand.IndexOf('/');

            if (index > 0)
            {
                string strUserID = strCommand.Substring(0, index).Trim();
                int userID;

                if (int.TryParse(strUserID, out userID))
                {
                    System.Diagnostics.Process[] processes = System.Diagnostics.Process.GetProcessesByName(System.Diagnostics.Process.GetCurrentProcess().ProcessName);

                    if (processes != null)
                    {
                        foreach (var process in processes)
                        {
                            process.StartInfo.WindowStyle = System.Diagnostics.ProcessWindowStyle.Normal;
                        }
                    }
                }
            }

            return false;
        }
    }
}
