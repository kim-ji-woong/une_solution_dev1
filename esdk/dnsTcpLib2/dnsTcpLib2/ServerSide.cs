using System;
using System.Net;
using System.Net.Sockets;
using System.Threading;
using System.Text;
using System.Collections;
using System.IO;
using System.Diagnostics;

namespace dnsTcpLib2
{
    public class ConnectionLog
    {
        protected string m_strFilePath = "";
        protected StreamWriter m_writer = null;
        protected string m_strErrorMessage = "";
        protected bool m_isOpened = false;



        protected static ConnectionLog m_instance = null;
        internal static ConnectionLog Instance
        {
            get
            {
                if (m_instance == null)
                    m_instance = new ConnectionLog();
                return m_instance;
            }
        }

        protected ConnectionLog()
        {
        }

        public virtual bool Create()
        {
            return Create(Encoding.UTF8);
        }

        public virtual bool Create(Encoding encoding)
        {
            DateTime dtNow = DateTime.Now;
            string strFileName = string.Format("ConnectionLog_{0}{1:00}{2:00}_{3:00}{4:00}{5:00}.log", dtNow.Year, dtNow.Month, dtNow.Day, dtNow.Hour, dtNow.Minute, dtNow.Second);
            return Create(strFileName, encoding);
        }

        public virtual bool Create(string strPath)
        {
            return Create(strPath, Encoding.UTF8);
        }

        public virtual bool Create(string strPath, Encoding encoding)
        {
            m_strErrorMessage = "";

            try
            {
                m_writer = new StreamWriter(strPath, false, encoding);
            }
            catch (IOException e)
            {
                m_isOpened = false;
                m_strFilePath = "";
                m_strErrorMessage = e.Message;
                return false;
            }

            m_strFilePath = strPath;
            m_isOpened = true;
            return true;
        }

        public virtual bool Write(object str, bool writeTime = true)
        {
            m_strErrorMessage = "";

            if (m_writer == null || !m_isOpened)
            {
                m_strErrorMessage = "파일이 생성되지 않았습니다.";
                return false;
            }

            try
            {
                if (writeTime)
                {
                    DateTime dtNow = DateTime.Now;
                    string strTime = string.Format("{0}{1:00}{2:00}_{3:00}{4:00}{5:00} : ", dtNow.Year, dtNow.Month, dtNow.Day, dtNow.Hour, dtNow.Minute, dtNow.Second);
                    m_writer.Write(strTime);
                }

                m_writer.Write(str.ToString());
                m_writer.Flush();
            }
            catch (IOException e)
            {
                m_strErrorMessage = e.Message;
                return false;
            }

            return true;
        }

        public virtual bool WriteLine(object str, Exception e)
        {
            System.Diagnostics.StackTrace trace = new System.Diagnostics.StackTrace(e, true);
            WriteLine("프로그램 오류 : " + str + "," + trace.ToString());
            WriteLine("Line: " + trace.GetFrame(0).GetFileLineNumber());
            return true;
        }

        public virtual bool WriteLine(object str, bool writeTime = true)
        {
            return Write(str.ToString() + "\r\n", writeTime);
        }

        public virtual void Close()
        {
            m_strErrorMessage = "";

            if (m_writer == null || !m_isOpened)
                return;

            m_writer.Close();

            m_isOpened = false;
            m_writer = null;
            m_strFilePath = "";
        }

        public bool IsOpened
        {
            get { return m_isOpened; }
        }

        public string ErrorMessage
        {
            get { return m_strErrorMessage; }
        }

        public string FilePath
        {
            get { return m_strFilePath; }
        }
    }

    /// <SUMMARY>
    /// This class holds useful information for keeping track of each client connected
    /// to the server, and provides the means for sending/receiving data to the remote
    /// host.
    /// </SUMMARY>
    public class ConnectionState
    {
        internal Socket _conn = null;
        internal TcpServer _server = null;
        internal TcpServiceProvider _provider = null;
        internal byte[] _buffer = null;

        private bool m_bAddedLength = true;
        public bool LengthAdd
        {
            get { return m_bAddedLength; }
            set { m_bAddedLength = value; }
        }

        private byte[] m_RecivedBuffer = null;
        public byte[] RecivedBuffer
        {
            get { return m_RecivedBuffer; }
            set { m_RecivedBuffer = value; }
        }

        private object m_tag = null;

        private object m_tag2 = null;
        public object Tag2
        {
            get { return m_tag2; }
            set { m_tag2 = value; }
        }

        private int m_nDataSize = 0;
        public int DataSize
        {
            get { return m_nDataSize; }
            set { m_nDataSize = value; }
        }

        public object Tag
        {
            get { return m_tag; }
            set { m_tag = value; }
        }

        /// <summary>
        ///  RemoteEndPoint가 실제 소켓의 IP와 Port 정보를 담고 있다.
        ///  하지만, 예외가 발생하면 RemoteEndPoint는 Dispose 상태가 되기 때문에 IP와 Port 정보를 얻어올 수 없다.
        ///  따라서, 예외 발생시 로그 기록을 위하여는 PortNo와 IPAddress를 사용한다.
        /// </summary>
        #region PortNo_IPAddress
        private int m_nPort = 0;
        private string m_strIPAddress = "";

        public int PortNo
        {
            get { return m_nPort; }
        }

        public string IPAddress
        {
            get { return m_strIPAddress; }
        }

        public void SetSocket(Socket socket)
        {
            _conn = socket;
            System.Net.IPEndPoint endPoint = (System.Net.IPEndPoint)socket.RemoteEndPoint;

            m_strIPAddress = endPoint.Address.ToString();
            m_nPort = endPoint.Port;
        }
        #endregion

        /// <SUMMARY>
        /// Tells you the IP Address of the remote host.
        /// </SUMMARY>
        public EndPoint RemoteEndPoint
        {
            get { return _conn.RemoteEndPoint; }
        }

        /// <SUMMARY>
        /// Returns the number of bytes waiting to be read.
        /// </SUMMARY>
        public int AvailableData
        {
            get { return _conn.Available; }
        }

        /// <SUMMARY>
        /// Tells you if the socket is connected.
        /// </SUMMARY>
        public bool Connected
        {
            get { return _conn.Connected; }
        }

        /// <SUMMARY>
        /// Reads data on the socket, returns the number of bytes read.
        /// </SUMMARY>
        public int Read(byte[] buffer, int offset, int count)
        {
            try
            {
                //Debug.Debug.WriteLine("Available : " + _conn.Available);

                if (_conn.Available > 0)
                    return _conn.Receive(buffer, offset, count, SocketFlags.None);
                else return 0;
            }
            catch (Exception e)
            {
                ConnectionLog log = null;

                if (_provider == null || _provider.ConnectionLog == null)
                    log = ConnectionLog.Instance;
                else
                    log = _provider.ConnectionLog;

                if (log.IsOpened)
                {
                    /*System.Net.IPEndPoint endPoint = (System.Net.IPEndPoint)this.RemoteEndPoint;
                    string strIP = endPoint.Address.ToString();
                    int nPort = endPoint.Port;*/
                    string strIP = this.IPAddress;
                    int nPort = this.PortNo;

                    string strMe = string.Format("{0}, ({1}:{2})", e.StackTrace, strIP, nPort);
                    log.WriteLine(strMe + e.Message);
                }
            }

            return 0;
        }

        public bool Write(byte[] buffer, int offset, int count, bool bAddedLength)
        {
            try
            {
                if (bAddedLength)
                {
                    uint nDatas = (uint)count;
                    byte[] datas = new byte[nDatas + 4];
                    byte[] nCount = BitConverter.GetBytes(nDatas);

                    datas[0] = nCount[0];
                    datas[1] = nCount[1];
                    datas[2] = nCount[2];
                    datas[3] = nCount[3];

                    Array.Copy(buffer, 0, datas, 4, nDatas);
                    _conn.Send(datas, offset, count + 4, SocketFlags.None);
                }
                else
                {
                    _conn.Send(buffer, offset, count, SocketFlags.None);
                }
            }
            catch (Exception e)
            {
                ConnectionLog log = null;

                if (_provider == null || _provider.ConnectionLog == null)
                    log = ConnectionLog.Instance;
                else
                    log = _provider.ConnectionLog;

                if (log.IsOpened)
                {
                    /*System.Net.IPEndPoint endPoint = (System.Net.IPEndPoint)this.RemoteEndPoint;
                    string strIP = endPoint.Address.ToString();
                    int nPort = endPoint.Port;*/
                    string strIP = this.IPAddress;
                    int nPort = this.PortNo;

                    string strMe = string.Format("{0}, ({1}:{2})", e.StackTrace, strIP, nPort);
                    log.WriteLine(strMe + e.Message);
                }

                return false;
            }

            return true;
        }

        /// <SUMMARY>
        /// Sends Data to the remote host.
        /// </SUMMARY>
        public bool Write(byte[] buffer, int offset, int count)
        {
            return Write(buffer, offset, count, m_bAddedLength);
        }

        public bool WriteAsync(byte[] buffer, int offset, int count)
        {
            //return _SendAsync(buffer, offset, count, true, true);
            return Write(buffer, offset, count);
        }

        private bool _SendAsync(byte[] buffer, int offset, int size, bool addLength, bool addCallback)
        {
            SocketAsyncEventArgs e = new SocketAsyncEventArgs();

            if (addLength == true)
            {
                uint nDatas = (uint)size;
                byte[] datas = new byte[nDatas + 4];
                byte[] nCount = BitConverter.GetBytes(nDatas);
                Debug.WriteLine(size);
                datas[0] = nCount[0];
                datas[1] = nCount[1];
                datas[2] = nCount[2];
                datas[3] = nCount[3];
                Array.Copy(buffer, offset, datas, 4, size);

                e.SetBuffer(datas, 0, datas.Length);
            }
            else
                e.SetBuffer(buffer, offset, size);

            if (addCallback)
                e.Completed += new EventHandler<SocketAsyncEventArgs>(SendCallback);

            bool completedAsync = false;

            try
            {
                completedAsync = _conn.SendAsync(e);
            }
            catch (Exception se)
            {
                ConnectionLog log = null;

                if (_provider == null || _provider.ConnectionLog == null)
                    log = ConnectionLog.Instance;
                else
                    log = _provider.ConnectionLog;

                if (log.IsOpened)
                    log.WriteLine("Socket Exception Message: " + se.Message);

                _conn.Shutdown(SocketShutdown.Both);
                _conn.Close();
            }

            if (!completedAsync)
            {
                // The call completed synchronously so invoke the callback ourselves
                //SendCallback(this, e);
            }

            return true;
        }

        private void SendCallback(object sender, SocketAsyncEventArgs e)
        {
            if (e.SocketError == SocketError.Success)
            {
                // You may need to specify some type of state and 
                // pass it into the BeginSend method so you don't start
                // sending from scratch
                //_SendAsync(e.Buffer, e.Offset, e.Count, false, false);
            }
            else
            {
                try
                {
                    System.Net.IPEndPoint endPoint = (System.Net.IPEndPoint)_conn.RemoteEndPoint;
                    string strIP = endPoint.Address.ToString();
                    int nPort = endPoint.Port;

                    ConnectionLog log = null;

                    if (_provider == null || _provider.ConnectionLog == null)
                        log = ConnectionLog.Instance;
                    else
                        log = _provider.ConnectionLog;

                    if (log.IsOpened)
                    {
                        log.WriteLine(string.Format("Socket Error: {0} when sending to {1}:{2}",
                               e.SocketError,
                               strIP,
                               nPort));
                    }
                }
                catch (Exception)
                {
                }

                _SendAsync(e.Buffer, e.Offset, e.Count, false, false);
            }
        }

        /// <SUMMARY>
        /// Ends connection with the remote host.
        /// </SUMMARY>
        public void EndConnection()
        {
            if (_conn != null && _conn.Connected)
            {
                _conn.Shutdown(SocketShutdown.Both);
                _conn.Close();
            }

            if (_server != null)
                _server.DropConnection(this, false);
        }

        public void SetSocketOption(SocketOptionLevel level, SocketOptionName name, bool opt)
        {
            _conn.SetSocketOption(level, name, opt);
        }
    }

    /// <SUMMARY>
    /// Allows to provide the server with the actual code that is goint to service
    /// incoming connections.
    /// </SUMMARY>
    public abstract class TcpServiceProvider : ICloneable
    {
        private byte[] m_arrReceived = null;
        private ConnectionLog m_log = null;

        public ConnectionLog ConnectionLog
        {
            get { return m_log; }
            set { m_log = value; }
        }



        /// <SUMMARY>
        /// Provides a new instance of the object.
        /// </SUMMARY>
        public virtual object Clone()
        {
            throw new Exception("Derived clases must override Clone method.");
        }

        /// <SUMMARY>
        /// Gets executed when the server accepts a new connection.
        /// </SUMMARY>
        public abstract void OnAcceptConnection(ConnectionState state);

        /// <SUMMARY>
        /// Gets executed when the server detects incoming data.
        /// This method is called only if OnAcceptConnection has already finished.
        /// </SUMMARY>
		public virtual bool OnReceiveData(ConnectionState state)
        {
            byte[] buffer = new byte[1024];
            //Debug.WriteLine(state.ToString());
            while (state.AvailableData > 0)
            {

                int readBytes = state.Read(buffer, 0, 1024);
                //Debug.WriteLine("Read Byte : " + readBytes);


                if (readBytes > 0)
                {
                    if (state.RecivedBuffer == null)
                    {
                        state.RecivedBuffer = new byte[readBytes];
                        Array.Copy(buffer, state.RecivedBuffer, readBytes);

                    }
                    else
                    {
                        byte[] a = state.RecivedBuffer;
                        int nLen = a.Length;
                        Array.Resize(ref a, nLen + readBytes);
                        Array.Copy(buffer, 0, a, nLen, readBytes);
                        state.RecivedBuffer = a;
                    }
                    if (readBytes < 1024)
                        return true;
                }
                else
                {
                    OnDropConnection(state);
                    state.EndConnection(); //If read fails then close connection

                    ConnectionLog log = m_log == null ? ConnectionLog.Instance : m_log;

                    if (log.IsOpened)
                        log.WriteLine("OnReceiveData Fail");
                    return false;
                }
            }

            return true;
        }

        //public virtual bool OnReceiveData(ConnectionState state)
        //{
        //    int nBufferSize = 2048;

        //    byte[] buffer = new byte[nBufferSize];
        //    int readBytes = 0;
        //    int nTotalReadBytes = 0;
        //    do
        //    {
        //        if (state.AvailableData == 0)
        //            return true;

        //        readBytes = state.Read(buffer, 0, nBufferSize);

        //        if (readBytes > 0)
        //        {
        //            if (m_arrReceived == null)
        //            {
        //                int nSize = BitConverter.ToInt32(buffer, 0);
        //                nTotalReadBytes = readBytes - 4;
        //                m_arrReceived = new byte[nTotalReadBytes];
        //                Array.Copy(buffer, 4, m_arrReceived, 0, nTotalReadBytes);
        //                state.DataSize = nSize;

        //            }
        //            else
        //            {
        //                int nExistLen = m_arrReceived.Length;
        //                Array.Resize(ref m_arrReceived, nExistLen + readBytes);
        //                Array.Copy(buffer, 0, m_arrReceived, nExistLen, readBytes);						
        //                nTotalReadBytes += readBytes;
        //            }

        //            //if (nTotalReadBytes >= state.DataSize)
        //            //	return true;
        //        }
        //        else
        //        {
        //            OnDropConnection(state);
        //            state.EndConnection(); //If read fails then close connection

        //            if (ConnectionLog.Instance.IsOpened)
        //                ConnectionLog.Instance.WriteLine("OnReceiveData Fail");
        //            return false;
        //        }
        //    } while (state.DataSize > nTotalReadBytes);

        //    return true;
        //}

        /// <SUMMARY>
        /// Gets executed when the server needs to shutdown the connection.
        /// </SUMMARY>
        public abstract void OnDropConnection(ConnectionState state);

        public void ClearData()
        {
            //ConnectionLog.Instance.WriteLine("Serverside ClearData : " + m_arrReceived.GetHashCode().ToString());
            m_arrReceived = null;
            //ConnectionLog.Instance.WriteLine("ServerSide Finish ClearData");
        }

        public byte[] ReceivedData
        {
            get { return m_arrReceived; }
        }
    }

    public class TcpServer
    {
        private int _port = 0;
        private Socket _listener = null;
        private TcpServiceProvider _provider = null;
        private ArrayList _connections = null;
        private int _maxConnections = 100;

        private AsyncCallback ConnectionReady = null;
        private WaitCallback AcceptConnection = null;
        private AsyncCallback ReceivedDataReady = null;

        protected object m_lockObj = new object();

        private ConnectionLog m_log = null;

        public ConnectionLog ConnectionLog
        {
            get { return m_log; }
            set
            {
                m_log = value;
                if (_provider != null)
                    _provider.ConnectionLog = value;
            }
        }

        /// <SUMMARY>
        /// Initializes server. To start accepting connections call Start method.
        /// </SUMMARY>
        public TcpServer(TcpServiceProvider provider, int port)
        {
            _provider = provider;
            _port = port;
            _listener = new Socket(AddressFamily.InterNetwork, SocketType.Stream,
              ProtocolType.Tcp);
            _connections = new ArrayList();
            ConnectionReady = new AsyncCallback(ConnectionReady_Handler);
            AcceptConnection = new WaitCallback(AcceptConnection_Handler);
            ReceivedDataReady = new AsyncCallback(ReceivedDataReady_Handler);
        }

        /// <SUMMARY>
        /// Start accepting connections.
        /// A false return value tell you that the port is not available.
        /// </SUMMARY>
        public bool Start()
        {
            try
            {
                _listener.Bind(new IPEndPoint(IPAddress.Parse("0.0.0.0"), _port));
                _listener.Listen(100);
                _listener.BeginAccept(ConnectionReady, null);
            }
            catch (Exception e)
            {
                ConnectionLog log = m_log == null ? ConnectionLog.Instance : m_log;

                if (log.IsOpened)
                {
                    log.WriteLine(e.Message);
                }

                return false;
            }

            return true;
        }

        /// <SUMMARY>
        /// Callback function: A new connection is waiting.
        /// </SUMMARY>
        private void ConnectionReady_Handler(IAsyncResult ar)
        {
            lock (m_lockObj)
            {
                try
                {
                    if (_listener == null) return;
                    Socket conn = _listener.EndAccept(ar);
                    if (_connections.Count >= _maxConnections)
                    {
                        //Max number of connections reached.
                        string msg = "SE001: Server busy";
                        conn.Send(Encoding.UTF8.GetBytes(msg), 0, msg.Length, SocketFlags.None);
                        conn.Shutdown(SocketShutdown.Both);
                        conn.Close();
                    }
                    else
                    {
                        //Start servicing a new connection
                        ConnectionState st = new ConnectionState();

                        //st._conn = conn;
                        st.SetSocket(conn);
                        st.SetSocketOption(SocketOptionLevel.Tcp, SocketOptionName.NoDelay, true);
                        st._server = this;
                        st._provider = (TcpServiceProvider)_provider.Clone();
                        st._buffer = new byte[512];
                        _connections.Add(st);
                        //Queue the rest of the job to be executed latter
                        ThreadPool.QueueUserWorkItem(AcceptConnection, st);
                    }
                    //Resume the listening callback loop
                    _listener.BeginAccept(ConnectionReady, null);
                }
                catch (Exception)
                {
                }
            }
        }

        /// <SUMMARY>
        /// Executes OnAcceptConnection method from the service provider.
        /// </SUMMARY>
        private void AcceptConnection_Handler(object state)
        {
            ConnectionState st = state as ConnectionState;
            try
            {
                st._provider.OnAcceptConnection(st);
            }
            catch (Exception e)
            {
                //report error in provider... Probably to the EventLog
                ConnectionLog log = m_log == null ? ConnectionLog.Instance : m_log;

                if (log.IsOpened)
                {
                    try
                    {
                        /*System.Net.IPEndPoint endPoint = (System.Net.IPEndPoint)st.RemoteEndPoint;
                        string strIP = endPoint.Address.ToString();
                        int nPort = endPoint.Port;*/
                        string strIP = st.IPAddress;
                        int nPort = st.PortNo;

                        string strMe = string.Format("{0}, ({1}:{2})", e.StackTrace, strIP, nPort);
                        log.WriteLine(strMe + e.Message);
                    }
                    catch (System.Exception)
                    {
                    }
                }

                return;
            }

            try
            {
                //Starts the ReceiveData callback loop
                if (st._conn.Connected)
                    st._conn.BeginReceive(st._buffer, 0, 0, SocketFlags.None,
                      ReceivedDataReady, st);
            }
            catch (Exception e)
            {
                ConnectionLog log = m_log == null ? ConnectionLog.Instance : m_log;

                if (log.IsOpened)
                {
                    /*System.Net.IPEndPoint endPoint = (System.Net.IPEndPoint)st.RemoteEndPoint;
                    string strIP = endPoint.Address.ToString();
                    int nPort = endPoint.Port;*/
                    string strIP = st.IPAddress;
                    int nPort = st.PortNo;

                    string strMe = string.Format("{0}, ({1}:{2})", e.StackTrace, strIP, nPort);
                    log.WriteLine(strMe + e.Message);
                }

                st._provider.OnDropConnection(st);
                st.EndConnection();
            }
        }

        /// <SUMMARY>
        /// Executes OnReceiveData method from the service provider.
        /// </SUMMARY>
        private void ReceivedDataReady_Handler(IAsyncResult ar)
        {
            ConnectionState st = ar.AsyncState as ConnectionState;

            try
            {
                if (!st._conn.Connected)
                    return;

                st._conn.EndReceive(ar);
                //Im considering the following condition as a signal that the
                //remote host droped the connection.
                if (st._conn.Available == 0)
                {
                    _provider.OnDropConnection(st);
                    DropConnection(st, true);
                }
                else
                {
                    try
                    {

                        st._provider.OnReceiveData(st);
                        //if (st._provider.ReceivedData != null)

                    }
                    catch (Exception e)
                    {
                        //report error in the provider
                        ConnectionLog log = m_log == null ? ConnectionLog.Instance : m_log;

                        if (log.IsOpened)
                        {
                            /*System.Net.IPEndPoint endPoint = (System.Net.IPEndPoint)st.RemoteEndPoint;
                            string strIP = endPoint.Address.ToString();
                            int nPort = endPoint.Port;*/
                            string strIP = st.IPAddress;
                            int nPort = st.PortNo;

                            string strMe = string.Format("{0}, ({1}:{2})", e.StackTrace, strIP, nPort);
                            log.WriteLine(strMe + e.Message);
                        }
                    }

                    try
                    {
                        st.RecivedBuffer = null;
                        st._provider.ClearData();
                    }
                    catch (System.Exception ex)
                    {
                        //report error in the provider
                        ConnectionLog log = m_log == null ? ConnectionLog.Instance : m_log;

                        if (log.IsOpened)
                        {
                            /*System.Net.IPEndPoint endPoint = (System.Net.IPEndPoint)st.RemoteEndPoint;
							string strIP = endPoint.Address.ToString();
							int nPort = endPoint.Port;*/
                            string strIP = st.IPAddress;
                            int nPort = st.PortNo;

                            string strMe = string.Format("{0}, ({1}:{2})", ex.StackTrace, strIP, nPort);
                            log.WriteLine(strMe + ex.Message);
                        }
                    }

                    //Resume ReceivedData callback loop
                    if (st._conn.Connected)
                        st._conn.BeginReceive(st._buffer, 0, 0, SocketFlags.None,
                          ReceivedDataReady, st);
                }
            }
            catch (System.ObjectDisposedException e)
            {
                ConnectionLog log = m_log == null ? ConnectionLog.Instance : m_log;

                if (log.IsOpened)
                {
                    /*System.Net.IPEndPoint endPoint = (System.Net.IPEndPoint)st.RemoteEndPoint;
                    string strIP = endPoint.Address.ToString();
                    int nPort = endPoint.Port;*/
                    string strIP = st.IPAddress;
                    int nPort = st.PortNo;

                    string strMe = string.Format("{0}, ({1}:{2})", e.StackTrace, strIP, nPort);
                    log.WriteLine(strMe + e.Message);
                    log.WriteLine(e.GetType().Name);
                }
            }
            catch (Exception e)
            {
                ConnectionLog log = m_log == null ? ConnectionLog.Instance : m_log;

                if (log.IsOpened)
                {
                    System.Net.IPEndPoint endPoint = (System.Net.IPEndPoint)st.RemoteEndPoint;
                    string strIP = endPoint.Address.ToString();
                    int nPort = endPoint.Port;

                    string strMe = string.Format("{0}, ({1}:{2})", e.StackTrace, strIP, nPort);
                    log.WriteLine(strMe + e.Message);
                    log.WriteLine(e.GetType().Name);
                }

                st._provider.OnDropConnection(st);
                st.EndConnection();
            }
        }

        /// <SUMMARY>
        /// Shutsdown the server
        /// </SUMMARY>
        public void Stop()
        {
            lock (this)
            {
                _listener.Close();
                _listener = null;
                //Close all active connections
                foreach (object obj in _connections)
                {
                    ConnectionState st = obj as ConnectionState;
                    try { st._provider.OnDropConnection(st); }
                    catch (Exception e)
                    {
                        //some error in the provider
                        ConnectionLog log = m_log == null ? ConnectionLog.Instance : m_log;

                        if (log.IsOpened)
                        {
                            /*System.Net.IPEndPoint endPoint = (System.Net.IPEndPoint)st.RemoteEndPoint;
                            string strIP = endPoint.Address.ToString();
                            int nPort = endPoint.Port;*/
                            string strIP = st.IPAddress;
                            int nPort = st.PortNo;

                            string strMe = string.Format("{0}, ({1}:{2})", e.StackTrace, strIP, nPort);
                            log.WriteLine(strMe + e.Message);
                        }
                    }
                    st._conn.Shutdown(SocketShutdown.Both);
                    st._conn.Close();
                }
                _connections.Clear();
            }
        }

        /// <SUMMARY>
        /// Removes a connection from the list
        /// </SUMMARY>
        internal void DropConnection(ConnectionState st, bool shutdown)
        {
            lock (m_lockObj)
            {
                if (shutdown)
                {
                    st._conn.Shutdown(SocketShutdown.Both);
                    st._conn.Close();
                }

                if (_connections.Contains(st))
                    _connections.Remove(st);
            }
        }

        public int MaxConnections
        {
            get
            {
                return _maxConnections;
            }
            set
            {
                _maxConnections = value;
            }
        }

        public int CurrentConnections
        {
            get
            {
                lock (m_lockObj) { return _connections.Count; }
            }
        }
    }
}
