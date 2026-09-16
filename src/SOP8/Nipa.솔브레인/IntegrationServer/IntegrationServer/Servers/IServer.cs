using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IntegrationServer.Servers
{
    public interface IServer
    {
        ServerManager GetServerManager();
        int ServerSeqNo { get; }
        int ServerType { get; }
        string ServerAlias { get; }
        void Start();
        void Stop();

        bool IsConnected { get; }
        Logger Logger { get; set; }

        //dnsTcpLib2.ClientServiceProvider Provider { get; }
    }
}
