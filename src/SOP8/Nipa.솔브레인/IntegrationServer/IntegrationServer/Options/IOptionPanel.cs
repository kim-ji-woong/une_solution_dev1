using IntegrationServer.Datas;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Text;
using System.Windows.Forms;

namespace IntegrationServer.Options
{
    public interface IOptionPanel
    {
        static bool AddControl(UserControl ctrl, int sequenceNo, Point ptLocation, Control.ControlCollection controls, List<IOptionPanel> optionPanels)
        {
            if (ctrl is IOptionPanel)
            {
                ctrl.Location = ptLocation;
                controls.Add(ctrl);
                optionPanels.Add((IOptionPanel)ctrl);
                return true;
            }

            return false;
        }

        int SequenceNo { get; set; }
        bool Visible { get; set; }

        void LoadServerDetailData(ServerData data);
    }
}
