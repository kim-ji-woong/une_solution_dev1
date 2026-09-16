using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Windows.Forms;

namespace RackEditor
{
    class BluetoothScanManager
    {
        private List<Control> m_controls = new List<Control>();
        private IScannerOwner m_owner = null;

        private string m_strBarcode = "";

        public BluetoothScanManager(IScannerOwner owner)
        {
            m_owner = owner;
        }

        public void AddControl(Control ctrl)
        {
            m_controls.Add(ctrl);

            ctrl.KeyPress += OnKeyPress;
        }

        private void OnKeyPress(object sender, KeyPressEventArgs e)
        {
            m_strBarcode += e.KeyChar;

            if (e.KeyChar == (char)Keys.Enter)
            {
                string strBarcode = m_strBarcode.Trim();
                //System.Diagnostics.Trace.WriteLine("Enter : " + strBarcode);
                m_strBarcode = "";

                m_owner.OnRead(strBarcode);
            }
        }
    }
}
