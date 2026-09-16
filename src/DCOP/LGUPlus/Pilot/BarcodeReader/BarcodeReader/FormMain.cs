using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Text;
using System.Reflection;
using System.IO;
using System.Windows.Forms;

namespace BarcodeReader
{
    public partial class FormMain : Form
    {
        [System.Runtime.InteropServices.DllImport("kernel32.dll", CharSet = System.Runtime.InteropServices.CharSet.Unicode, SetLastError = true)]
        private static extern bool SetDllDirectory(string lpPathName);

        [System.Runtime.InteropServices.DllImport("libnldevicemaster.dll", SetLastError = true, CallingConvention = System.Runtime.InteropServices.CallingConvention.Cdecl)]
        private static extern IntPtr nl_EnumDevices(ref int deviceCount);

        [System.Runtime.InteropServices.DllImport("libnldevicemaster.dll", SetLastError = true, CallingConvention = System.Runtime.InteropServices.CallingConvention.Cdecl)]
        private static extern IntPtr nl_OpenDevice(IntPtr hDeviceList, int index, int protocol);

        [System.Runtime.InteropServices.DllImport("libnldevicemaster.dll", SetLastError = true, CallingConvention = System.Runtime.InteropServices.CallingConvention.Cdecl)]
        private static extern int nl_GetDevStatus(IntPtr hDeviceHandle);

        [System.Runtime.InteropServices.DllImport("libnldevicemaster.dll", SetLastError = true, CallingConvention = System.Runtime.InteropServices.CallingConvention.Cdecl)]
        private static extern bool nl_StopListener(IntPtr hDeviceHandle);

        [System.Runtime.InteropServices.DllImport("libnldevicemaster.dll", SetLastError = true, CallingConvention = System.Runtime.InteropServices.CallingConvention.Cdecl)]
        private static extern void nl_SetListener(IntPtr hDeviceHandle, DataArrivalCallback callback);

        [System.Runtime.InteropServices.DllImport("libnldevicemaster.dll", SetLastError = true, CallingConvention = System.Runtime.InteropServices.CallingConvention.Cdecl)]
        private static extern int nl_Read(IntPtr hDeviceHandle, byte[] cData, int nLen, int timeout);

        [System.Runtime.InteropServices.DllImport("libnldevicemaster.dll", SetLastError = true, CallingConvention = System.Runtime.InteropServices.CallingConvention.Cdecl)]
        private static extern void nl_ReleaseDevices(IntPtr hDeviceList);

        [System.Runtime.InteropServices.DllImport("libnldevicemaster.dll", SetLastError = true, CallingConvention = System.Runtime.InteropServices.CallingConvention.Cdecl)]
        private static extern bool nl_CloseDevice(IntPtr hDeviceHandle);

        [System.Runtime.InteropServices.DllImport("libnldevicemaster.dll", SetLastError = true, CallingConvention = System.Runtime.InteropServices.CallingConvention.Cdecl)]
        private static extern bool nl_Write(IntPtr hDeviceHandle, char[] cData, int nLen, bool isPacked);

        private delegate void DataArrivalCallback(IntPtr pDevicePointer, byte[] cData, int dataLen);

        private enum T_Protocol
        {
            Nlscan = 0
        }

        private enum T_DeviceStatus
        {
            Opened = 0,
            NotOpened,
            Closed,
            NotClosed,
            Updating,
            Updated,
            Writing,
            Written,
            Reading,
            ReadOK,
            GettingPicData,
            GetPicDataOK,
            UnknownStatus
        }

        private IntPtr m_handleList = IntPtr.Zero;
        private List<IntPtr> m_deviceHandles = new List<IntPtr>();

        public FormMain()
        {
            InitializeComponent();

            // Add any initialization after the InitializeComponent() call.
            SetPath();
        }

        private void SetPath()
        {
            string assemblyPath = Path.GetDirectoryName(Assembly.GetEntryAssembly().Location);
            assemblyPath = Path.Combine(assemblyPath, IntPtr.Size == 8 ? "x64" : "x86");
            bool ok = SetDllDirectory(assemblyPath);
            if (!ok)
            {
                throw new System.ComponentModel.Win32Exception();
            }
        }

        private void btnConnect_Click(object sender, EventArgs e)
        {
            btnConnect.Enabled = false;
            WriteStatus("Connecting, One moment....");

            int deviceCount = 0;
            m_handleList = nl_EnumDevices(ref deviceCount);

            WriteStatus($"Connected devices : {deviceCount}");
            m_deviceHandles.Clear();

            for (int i=0;i<deviceCount;i++)
            {
                IntPtr pHandleDevicePointer = nl_OpenDevice(m_handleList, i, (int)T_Protocol.Nlscan);
                T_DeviceStatus devStatus = (T_DeviceStatus)nl_GetDevStatus(pHandleDevicePointer);

                if (devStatus == T_DeviceStatus.Opened)
                {
                    m_deviceHandles.Add(pHandleDevicePointer);
                    //nl_SetListener(pHandleDevicePointer, OnReadBarcode);
                }
            }

            if (deviceCount > 0)
            {
                btnStop.Enabled = true;
                timer1.Start();
            }
            else
                btnConnect.Enabled = true;
        }

        /*private void OnReadBarcode(IntPtr pDevicePointer, byte[] cData, int dataLen)
        {
            byte[] aReceivedData = new byte[1024];
            int iReadLength = nl_Read(pDevicePointer, aReceivedData, aReceivedData.Length, 1000);

            if (iReadLength <= 0)
                return;

            byte[] bytes = new byte[iReadLength];
            System.Buffer.BlockCopy(aReceivedData, 0, bytes, 0, iReadLength);

            string strRead = Encoding.ASCII.GetString(bytes);
            DateTime dtNow = DateTime.Now;

            string strLog = string.Format("[{0:00}:{1:00}:{2:00}] {3}", dtNow.Hour, dtNow.Minute, dtNow.Second, strRead);

            this.Invoke(new MethodInvoker(
                delegate ()
                {
                    if (textBoxLog.Text.Length == 0)
                        textBoxLog.Text = strLog;
                    else
                        textBoxLog.Text += "\r\n" + strLog;
                }
                ));
        }*/

        private void WriteStatus(string strStatus)
        {
            labelStatus.Text = strStatus;
        }

        private void btnStop_Click(object sender, EventArgs e)
        {
            timer1.Stop();
            btnStop.Enabled = false;

            foreach (IntPtr deviceHandle in m_deviceHandles)
            {
                nl_StopListener(deviceHandle);
                nl_CloseDevice(deviceHandle);
            }

            nl_ReleaseDevices(m_handleList);
            btnConnect.Enabled = true;
        }

        private void OnTimer(object sender, EventArgs e)
        {
            foreach (IntPtr deviceHandle in m_deviceHandles)
            {
                byte[] aReceivedData = new byte[1024];
                int iReadLength = nl_Read(deviceHandle, aReceivedData, aReceivedData.Length, 1000);

                if (iReadLength > 0)
                {
                    string strRead = Encoding.ASCII.GetString(aReceivedData);
                    DateTime dtNow = DateTime.Now;

                    string strLog = string.Format("[{0:00}:{1:00}:{2:00}] {3}", dtNow.Hour, dtNow.Minute, dtNow.Second, strRead);
                    System.Diagnostics.Trace.WriteLine("Read : " + strLog);

                    this.Invoke(new MethodInvoker(
                        delegate ()
                        {
                            if (textBoxLog.Text.Length == 0)
                                textBoxLog.Text = strLog;
                            else
                                textBoxLog.Text += "\r\n" + strLog;
                        }));
                }
            }
        }
    }
}
