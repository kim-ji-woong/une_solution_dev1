using System;
using System.IO;
using System.Net;
using System.Text;
using System.Threading;
using System.Windows.Forms;

namespace TestServer
{
    public partial class FormMain : Form
    {
        private HttpListener m_listener;
        private Thread m_listenerThread;
        private bool m_bRunning;
        private const string LISTEN_URL = "http://127.0.0.1:8090/api/fire/";

        public FormMain()
        {
            InitializeComponent();
        }

        private void FormMain_Load(object sender, EventArgs e)
        {
            StartServer();
        }

        private void FormMain_FormClosing(object sender, FormClosingEventArgs e)
        {
            StopServer();
        }

        private void StartServer()
        {
            m_listener = new HttpListener();
            m_listener.Prefixes.Add(LISTEN_URL);
            m_listener.Start();
            m_bRunning = true;

            m_listenerThread = new Thread(ListenLoop);
            m_listenerThread.IsBackground = true;
            m_listenerThread.Start();

            AppendLog($"서버 시작 - {LISTEN_URL}");
        }

        private void StopServer()
        {
            m_bRunning = false;
            m_listener?.Stop();
            m_listener?.Close();
        }

        private void ListenLoop()
        {
            while (m_bRunning)
            {
                try
                {
                    var context = m_listener.GetContext();
                    ProcessRequest(context);
                }
                catch
                {
                    if (!m_bRunning) break;
                }
            }
        }

        private void ProcessRequest(HttpListenerContext context)
        {
            string body;
            using (var reader = new StreamReader(context.Request.InputStream, Encoding.UTF8))
            {
                body = reader.ReadToEnd();
            }

            string timestamp = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
            string logText = $"[{timestamp}] {context.Request.HttpMethod} {context.Request.Url.AbsolutePath}\r\n{body}\r\n";

            AppendLog(logText);

            // 200 OK 응답
            context.Response.StatusCode = 200;
            context.Response.ContentType = "application/json";
            byte[] responseBytes = Encoding.UTF8.GetBytes("{\"result\": \"OK\"}");
            context.Response.ContentLength64 = responseBytes.Length;
            context.Response.OutputStream.Write(responseBytes, 0, responseBytes.Length);
            context.Response.Close();
        }

        private void AppendLog(string text)
        {
            if (txtLog.InvokeRequired)
            {
                txtLog.Invoke(new Action<string>(AppendLog), text);
                return;
            }

            txtLog.AppendText(text + "\r\n");
        }
    }
}
