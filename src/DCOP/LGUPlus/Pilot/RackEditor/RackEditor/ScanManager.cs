using System;
using System.Collections.Generic;
using System.Reflection;
using System.IO;
using System.Runtime.InteropServices;
using System.Threading.Tasks;
using System.Text;

namespace RackEditor
{
    class ScanManager
    {
        [DllImport("kernel32.dll", CharSet = CharSet.Unicode, SetLastError = true)]
        private static extern bool SetDllDirectory(string lpPathName);

        [DllImport("libnldevicemaster.dll", SetLastError = true, CallingConvention = CallingConvention.Cdecl)]
        private static extern IntPtr nl_EnumDevices(ref int deviceCount);

        [DllImport("libnldevicemaster.dll", SetLastError = true, CallingConvention = CallingConvention.Cdecl)]
        private static extern IntPtr nl_OpenDevice(IntPtr hDeviceList, int index, int protocol);

        [DllImport("libnldevicemaster.dll", SetLastError = true, CallingConvention = CallingConvention.Cdecl)]
        private static extern int nl_GetDevStatus(IntPtr hDeviceHandle);

        [DllImport("libnldevicemaster.dll", SetLastError = true, CallingConvention = CallingConvention.Cdecl)]
        private static extern bool nl_StopListener(IntPtr hDeviceHandle);

        [DllImport("libnldevicemaster.dll", SetLastError = true, CallingConvention = CallingConvention.Cdecl)]
        private static extern void nl_SetListener(IntPtr hDeviceHandle, DataArrivalCallback callback);

        [DllImport("libnldevicemaster.dll", SetLastError = true, CallingConvention = CallingConvention.Cdecl)]
        private static extern int nl_Read(IntPtr hDeviceHandle, byte[] cData, int nLen, int timeout);

        [DllImport("libnldevicemaster.dll", SetLastError = true, CallingConvention = CallingConvention.Cdecl)]
        private static extern void nl_ReleaseDevices(IntPtr hDeviceList);

        [DllImport("libnldevicemaster.dll", SetLastError = true, CallingConvention = CallingConvention.Cdecl)]
        private static extern bool nl_CloseDevice(IntPtr hDeviceHandle);

        [DllImport("libnldevicemaster.dll", SetLastError = true, CallingConvention = CallingConvention.Cdecl)]
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

        private IScannerOwner m_owner = null;

        private IntPtr m_handleList = IntPtr.Zero;
        private List<IntPtr> m_deviceHandles = new List<IntPtr>();

        private bool m_isConnected = false;

        public bool IsConnected
        {
            get { return m_isConnected; }
        }

        public ScanManager(IScannerOwner owner)
        {
            m_owner = owner;

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

        public async Task Connect()
        {
            m_owner.SendMessage("Barcode Scanner와 접속 시도중입니다.");

            int deviceCount = 0;
            m_handleList = nl_EnumDevices(ref deviceCount);

            if (deviceCount > 0)
            {
                m_owner.OnConnect();
                m_owner.SendMessage("Barcode Scanner 연결중");
            }
            else
            {
                m_owner.OnDisconnect();
                m_owner.SendMessage("Barcode Scanner 연결실패");
            }

            m_deviceHandles.Clear();

            for (int i = 0; i < deviceCount; i++)
            {
                IntPtr pHandleDevicePointer = nl_OpenDevice(m_handleList, i, (int)T_Protocol.Nlscan);
                T_DeviceStatus devStatus = (T_DeviceStatus)nl_GetDevStatus(pHandleDevicePointer);

                if (devStatus == T_DeviceStatus.Opened)
                {
                    m_deviceHandles.Add(pHandleDevicePointer);
                }
            }

            await Task.Delay(1);
        }

        public async Task Read()
        {
            foreach (IntPtr deviceHandle in m_deviceHandles)
            {
                byte[] aReceivedData = new byte[1024];
                int len = nl_Read(deviceHandle, aReceivedData, aReceivedData.Length, 1000);

                if (len > 0)
                {
                    string strRead = Encoding.ASCII.GetString(aReceivedData);
                    m_owner.OnRead(strRead);
                }
            }

            await Task.Delay(1);
        }
    }

    interface IScannerOwner
    {
        void SendMessage(string strMessage);
        void OnRead(string strBarcode);
        void OnConnect();
        void OnDisconnect();
    }
}
