using dnsTcpLib2;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Sockets;
using System.Text;
using System.Threading.Tasks;

namespace Eraeseeds
{
    class ClientProvider : ClientServiceProvider
    {
        private const byte DLE = 0x10;
        private const byte STX = 0x02;
        private const byte ETX = 0x03;

        private EraeseedsManager m_parentManager = null;

        public ClientProvider(EraeseedsManager parentMgr)
        {
            m_parentManager = parentMgr;

            this.Client.Client.SetSocketOption(SocketOptionLevel.Socket, SocketOptionName.NoDelay, true);
        }

        public override void OnDropConnection()
        {
            m_parentManager.Logger.Write("Connection closed");
        }

        public override void OnReceiveData()
        {
            try
            {
                byte[] data = this.ReceivedData;

                if (data == null || data.Length == 0)
                    return;

                WriteBinaryLog(data, 0, data.Length, "[Received]");
                CheckBytes(data);
            }
            catch (Exception e)
            {
                m_parentManager.Logger.Write("ContactProvider OnReceiveData() : " + e.Message);
            }
        }

        private void CheckBytes(byte[] bytes)
        {
            int len = bytes.Length;

            if (len < 4)
                return;

            if (bytes[0] == DLE && bytes[1] == STX)
            {
                byte cmd = bytes[2];
                int dataLen = (int)bytes[3];

                if (dataLen > 0 && dataLen + 4 + 2 <= len && bytes[dataLen + 4 + 1] == ETX)
                {
                    byte[] dataBytes = new byte[dataLen];
                    Buffer.BlockCopy(bytes, 4, dataBytes, 0, dataLen);
                    m_parentManager.ProcessData(cmd, dataBytes, dataLen);
                }
            }
        }

        public string WriteBinaryLog(byte[] bytes, int nIndex, int len, string strTag)
        {
            string strBytesLog = GetByteString(bytes, nIndex, len);
            m_parentManager.Logger.Write(strTag + " : " + strBytesLog);
            return strTag + " : " + strBytesLog;
        }

        public static string GetByteString(byte[] bytes, int nIndex, int len)
        {
            string strBytes = "";

            for (int i = nIndex; i < nIndex + len; i++)
            {
                byte b = bytes[i];

                if (strBytes.Length == 0)
                    strBytes = string.Format("\t\t{0:X2}", (int)b);
                else
                    strBytes += string.Format(" {0:X2}", (int)b);
            }

            return strBytes;
        }
    }
}
