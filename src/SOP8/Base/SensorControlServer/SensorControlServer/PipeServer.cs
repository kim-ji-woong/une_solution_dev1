using System;
using System.IO;
using System.IO.Pipes;
using System.Threading;
using System.Threading.Tasks;
using dnsPipeHelper;
using System.Configuration;
using dnsDapperDBUtil;

namespace SensorControlServer
{
    class PipeServer
    {
        private static PipeServer m_instance = null;

        private readonly CancellationTokenSource _cts = new CancellationTokenSource();

        private PipeServer()
        {
            
        }

        public static void Start(IPipeOwer owner)
        {
            if (m_instance != null)
                return;

            m_instance = new PipeServer();

            Thread t = new Thread(() => m_instance.ListenThread(owner))
            {
                IsBackground = true
            };

            t.Start();
        }

        public static void Stop()
        {
            if (m_instance == null)
                return;

            m_instance._cts.Cancel();
            m_instance = null;
        }

        private void ListenThread(IPipeOwer owner)
        {
            CancellationToken token = _cts.Token;

            while (owner.CloseThread == false && !token.IsCancellationRequested)
            {
                try
                {
                    var server = new NamedPipeServerStream(
                        Header.PipeName,
                        PipeDirection.InOut,
                        NamedPipeServerStream.MaxAllowedServerInstances, // 다수 연결 허용
                        PipeTransmissionMode.Byte,
                        PipeOptions.Asynchronous
                    );

                    // 비동기 수락을 기다리고, 연결되면 새 Task로 처리
                    Task.Run(async () =>
                    {
                        try
                        {
                            await server.WaitForConnectionAsync(token);

                            if (server.IsConnected)
                            {
                                System.Diagnostics.Trace.WriteLine("[Server] Client connected.");
                                await OnReceiveAsync(server, owner, token);
                            }
                        }
                        catch (OperationCanceledException)
                        {
                            // 종료 시 취소
                        }
                        catch (IOException)
                        {
                            System.Diagnostics.Trace.WriteLine("[Server] Connection aborted.");
                        }
                        catch (Exception ex)
                        {
                            System.Diagnostics.Trace.WriteLine($"[Server] Error: {ex.Message}");
                        }
                        finally
                        {
                            try
                            {
                                if (server.IsConnected)
                                    server.Disconnect();
                            }
                            catch { /* 무시 */ }
                            server.Dispose();
                        }
                    }, token);
                    // 클라이언트 연결 대기
                    /*var server = new NamedPipeServerStream(
                        Header.PipeName,
                        PipeDirection.InOut,
                        NamedPipeServerStream.MaxAllowedServerInstances, // 다수 연결 허용
                        PipeTransmissionMode.Byte,
                        PipeOptions.Asynchronous
                    );

                    Task.Run(() => OnReceive(server, owner));

                    // 새 클라이언트 연결을 비동기로 수락
                    server.WaitForConnectionAsync().ContinueWith(task =>
                    {
                        if (task.IsCompletedSuccessfully)
                        {
                            System.Diagnostics.Trace.WriteLine("[Server] Client connected.");
                            Task.Run(() => OnReceive(server, owner));
                        }
                        else
                        {
                            server.Dispose();
                        }
                    });*/
                }
                catch (Exception e)
                {
                    System.Diagnostics.Trace.WriteLine($"[Server] Exception: {e.Message}");
                }

                Thread.Sleep(1000);
            }
        }

        private async Task OnReceiveAsync(NamedPipeServerStream server, IPipeOwer owner, CancellationToken token)
        {
            using var reader = new StreamReader(server);
            using var writer = new StreamWriter(server) { AutoFlush = true };

            try
            {
                while (server.IsConnected && !owner.CloseThread && !token.IsCancellationRequested)
                {
                    string message = await reader.ReadLineAsync();

                    if (message == null)
                        break;

                    ProcessMessage(message, reader, writer, owner);
                    break;
                }
            }
            catch (IOException)
            {
                System.Diagnostics.Trace.WriteLine("[Server] Client disconnected (pipe broken).");
            }
            catch (Exception ex)
            {
                System.Diagnostics.Trace.WriteLine($"[Server] Error: {ex.Message}");
            }
        }

        private void OnReceive(NamedPipeServerStream server, IPipeOwer owner)
        {
            try
            {
                using (var reader = new StreamReader(server))
                {
                    using (var writer = new StreamWriter(server) { AutoFlush = true })
                    {
                        while (server.IsConnected && !owner.CloseThread)
                        {
                            string message = reader.ReadLine();
                            if (message == null)
                                break;

                            ProcessMessage(message, reader, writer, owner);
                            break;
                        }
                    }
                }
            }
            catch (IOException)
            {
                System.Diagnostics.Trace.WriteLine("[Server] Client disconnected (pipe broken).");
            }
            catch (Exception e)
            {
                System.Diagnostics.Trace.WriteLine($"[Server] Error: {e.Message}");
            }
            finally
            {
                try
                {
                    if (server.IsConnected)
                        server.Disconnect();
                }
                catch { /* 파이프 끊김 무시 */ }
            }
        }

        private void ProcessMessage(string message, StreamReader reader, StreamWriter writer, IPipeOwer owner)
        {
            System.Diagnostics.Trace.WriteLine($"[Server] Received: {message}");

            if (message == Header.RequestDBInfo)
            {
                string reply = GetDbInfo();
                writer.WriteLine(reply);
            }
            else if (message == Header.RequestSOPWebServerUrl)
            {
                string reply = GetSopWebServerUrl();
                writer.WriteLine(reply);
            }
            else if (message == Header.RequestLogFolder)
            {
                string reply = GetLogFolder();
                writer.WriteLine(reply);
            }
            else if (message == Header.RequestSiteNo)
            {
                string reply = GetSiteNo();
                writer.WriteLine(reply);
            }
            else
            {
                writer.WriteLine(Header.ResponseNull);
            }
        }

        private string GetDbInfo()
        {
            string strDbType = ConfigurationManager.AppSettings.Get("DbType");
            string strDbHost = ConfigurationManager.AppSettings.Get("DbHost");
            string strDbName = ConfigurationManager.AppSettings.Get("DbName");
            string strDbId = ConfigurationManager.AppSettings.Get("DbId");
            string strDbPw = ConfigurationManager.AppSettings.Get("DbPw");

            if (strDbType == null || strDbType.Length == 0 ||
                strDbHost == null || strDbHost.Length == 0 ||
                strDbName == null || strDbName.Length == 0 ||
                strDbId == null || strDbId.Length == 0 ||
                strDbPw == null || strDbPw.Length == 0)
                return Header.ResponseNull;

            return strDbType + ";" + strDbHost + ";" + strDbName + ";" + AES256Cipher.AES_decrypt(strDbId) + ";" + AES256Cipher.AES_decrypt(strDbPw);
        }

        public static string GetSopWebServerUrl()
        {
            string strUrl = ConfigurationManager.AppSettings.Get("SOPWebServerURL");

            if (strUrl == null || strUrl.Length == 0)
                return Header.ResponseNull;

            return strUrl;
        }

        private string GetLogFolder()
        {
            string strLogFolder = ConfigurationManager.AppSettings.Get("LogFolder");

            if (strLogFolder == null || strLogFolder.Length == 0)
                return Header.ResponseNull;

            return strLogFolder;
        }

        private string GetSiteNo()
        {
            string strSiteNo = ConfigurationManager.AppSettings.Get("SiteNo");

            if (strSiteNo == null || strSiteNo.Length == 0)
                return Header.ResponseNull;

            return strSiteNo;
        }
    }

    interface IPipeOwer
    {
        public bool CloseThread { get; }
    }

    public class ProcessStatusData
    {
        private int m_nProcessID = -1;
        private DateTime m_timeStamp = new DateTime();

        public int ProcessID
        {
            get { return m_nProcessID; }
            set { m_nProcessID = value; }
        }

        public DateTime TimeStamp
        {
            get { return m_timeStamp; }
            set { m_timeStamp = value; }
        }

        public ProcessStatusData()
        {
        }

        public ProcessStatusData(int processID, DateTime timeStamp)
        {
            m_nProcessID = processID;
            m_timeStamp = timeStamp;
        }
    }
}
