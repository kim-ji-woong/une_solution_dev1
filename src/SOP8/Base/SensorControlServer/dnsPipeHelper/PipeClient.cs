using System;
using System.IO;
using System.IO.Pipes;

namespace dnsPipeHelper
{
    class PipeClient
    {
        public string GetDBInfo()
        {
            using (var client = new NamedPipeClientStream(".", Header.PipeName, PipeDirection.InOut))
            {
                try
                {
                    client.Connect();

                    using (var reader = new StreamReader(client))
                    {
                        using (var writer = new StreamWriter(client) { AutoFlush = true })
                        {
                            writer.WriteLine(Header.RequestDBInfo);
                            string response = reader.ReadLine();
                            return response;
                        }
                    }
                }
                catch (Exception e)
                {
                    System.Diagnostics.Trace.WriteLine(e.Message);
                }
            }

            return null;
        }

        public string GetSOPWebServerUrl()
        {
            using (var client = new NamedPipeClientStream(".", Header.PipeName, PipeDirection.InOut))
            {
                try
                {
                    client.Connect();

                    using (var reader = new StreamReader(client))
                    {
                        using (var writer = new StreamWriter(client) { AutoFlush = true })
                        {
                            writer.WriteLine(Header.RequestSOPWebServerUrl);
                            string response = reader.ReadLine();
                            return response;
                        }
                    }
                }
                catch (Exception e)
                {
                    System.Diagnostics.Trace.WriteLine(e.Message);
                }
            }

            return null;
        }

        public string GetLogFolder()
        {
            using (var client = new NamedPipeClientStream(".", Header.PipeName, PipeDirection.InOut))
            {
                try
                {
                    client.Connect();

                    using (var reader = new StreamReader(client))
                    {
                        using (var writer = new StreamWriter(client) { AutoFlush = true })
                        {
                            writer.WriteLine(Header.RequestLogFolder);
                            string response = reader.ReadLine();
                            return response;
                        }
                    }
                }
                catch (Exception e)
                {
                    System.Diagnostics.Trace.WriteLine(e.Message);
                }
            }

            return null;
        }

        public string GetSiteNo()
        {
            using (var client = new NamedPipeClientStream(".", Header.PipeName, PipeDirection.InOut))
            {
                try
                {
                    client.Connect();

                    using (var reader = new StreamReader(client))
                    {
                        using (var writer = new StreamWriter(client) { AutoFlush = true })
                        {
                            writer.WriteLine(Header.RequestSiteNo);
                            string response = reader.ReadLine();
                            return response;
                        }
                    }
                }
                catch (Exception e)
                {
                    System.Diagnostics.Trace.WriteLine(e.Message);
                }
            }

            return null;
        }
    }
}
