using System;
using System.IO;
using System.Runtime.InteropServices;

namespace SoulbrainWeather.Process
{
    class NetworkShareAccesser : IDisposable
    {
        private readonly string _networkName;

        public NetworkShareAccesser(string networkName, string username, string password)
        {
            _networkName = networkName;

            var netResource = new NetResource
            {
                Scope = ResourceScope.GlobalNetwork,
                ResourceType = ResourceType.Disk,
                DisplayType = ResourceDisplaytype.Share,
                RemoteName = networkName
            };

            var result = WNetAddConnection2(
                netResource,
                password,
                username,
                0);

            if (result != 0)
            {
                throw new IOException("네트워크 연결 실패: " + result);
            }
        }

        public void Dispose()
        {
            WNetCancelConnection2(_networkName, 0, true);
        }

        [DllImport("mpr.dll")]
        private static extern int WNetAddConnection2(NetResource netResource,
            string password, string username, int flags);

        [DllImport("mpr.dll")]
        private static extern int WNetCancelConnection2(string name, int flags, bool force);

        [StructLayout(LayoutKind.Sequential)]
        public class NetResource
        {
            public ResourceScope Scope;
            public ResourceType ResourceType;
            public ResourceDisplaytype DisplayType;
            public int Usage;
            public string LocalName;
            public string RemoteName;
            public string Comment;
            public string Provider;
        }

        public enum ResourceScope : int
        {
            Connected = 1,
            GlobalNetwork,
            Remembered,
            Recent,
            Context
        }

        public enum ResourceType : int
        {
            Any = 0,
            Disk = 1,
            Print = 2,
        }

        public enum ResourceDisplaytype : int
        {
            Generic = 0x0,
            Domain = 0x01,
            Server = 0x02,
            Share = 0x03,
            File = 0x04,
            Group = 0x05,
        }
    }
}
