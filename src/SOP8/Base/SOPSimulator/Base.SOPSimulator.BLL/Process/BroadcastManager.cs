using dnsDapperDBUtil.DataAccessLayer.IDAL;
using Base.SOPSimulator.IBLL.Request;

namespace Base.SOPSimulator.BLL.Process
{
    class BroadcastManager
    {
        private const string UseBroadcast = "SOP/UseBroadcast";
        private const string UseSiren = "SOP/UseSiren";

        public static bool RunBroadcast(IDataManager dataManager, RequestSendMessage data, out string strErrorMessage)
        {
            strErrorMessage = null;

            if (data.UseBroadcast == false)
                return true;

            if (SmsManager.CheckOption(dataManager, UseBroadcast, data.SiteNo, out strErrorMessage) == false)
            {
                if (strErrorMessage == null)
                    strErrorMessage = "SOP 시스템 환경설정에서 방송 전파를 허용하지 않고 있습니다.\r\n옵션을 확인해 보세요.";

                return false;
            }

            bool useSiren = SmsManager.CheckOption(dataManager, UseSiren, data.SiteNo, out strErrorMessage);

            if (strErrorMessage != null)
                return false;

            if (data.Message == null || data.Message.Length == 0)
            {
                strErrorMessage = "전송할 내용이 존재하지 않습니다.";
                return false;
            }

            Broadcast(data.Message, useSiren);
            return true;
        }

        private static void Broadcast(string strMessage, bool useSiren)
        {
            System.Diagnostics.Trace.WriteLine("방송 실행 : " + strMessage);
        }
    }
}
