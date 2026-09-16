using System;
using System.Windows.Forms;
using System.Threading.Tasks;
using DCOP.Model;
using DCOP.Model.Code;
using RackEditor.Models.Business;
using System.Collections.Generic;

namespace RackEditor
{
    public partial class FormMain : Form, IScannerOwner, IDBOwner
    {
        public enum ScanMode { RackCoord, Rack, UnitPos, Item, None };

        //private ScanManager m_scanManager = null;
        private BluetoothScanManager m_scanManager = null;
        private DBManager m_dbManager = null;
        private ScanMode m_prevMode = ScanMode.None;
        private Rack m_prevRack = null;

        public FormMain()
        {
            InitializeComponent();

            InitScanManager();
            m_dbManager = new DBManager(this);
        }

        private void InitScanManager()
        {
            m_scanManager = new BluetoothScanManager(this);
            //m_scanManager = new ScanManager(this);

            m_scanManager.AddControl(this);
            m_scanManager.AddControl(this.textBoxDataCenter);
            m_scanManager.AddControl(this.textBoxItemInfo);
            m_scanManager.AddControl(this.textBoxRackInfo);
            m_scanManager.AddControl(this.textBoxRackPosition);
            m_scanManager.AddControl(this.textBoxUnit);
            m_scanManager.AddControl(this.rackGrid);
        }


        public void OnConnect()
        {
            this.Invoke(new MethodInvoker(
                delegate ()
                {
                    //timerScanner.Start();
                    btnConnect.Enabled = false;
                }));
        }

        public void OnDisconnect()
        {
            this.Invoke(new MethodInvoker(
                delegate ()
                {
                    //timerScanner.Stop();
                    btnConnect.Enabled = true;
                }));
        }

        public void SendMessage(string strMessage)
        {
            this.Invoke(new MethodInvoker(
                delegate ()
                {
                    tsLabel.Text = strMessage;
                }));
        }

        public void OnRead(string strBarcode)
        {
            System.Diagnostics.Trace.WriteLine(strBarcode);

            int index = strBarcode.IndexOf('\r');

            if (index < 0)
            {
                index = strBarcode.IndexOf('\0');
            }

            if (index >= 0)
                strBarcode = strBarcode.Substring(0, index);

            string strErrorMessage;

            if (m_dbManager.GetBarcodeInfo(strBarcode, out strErrorMessage) == false)
            {
                if (strErrorMessage != null)
                    MessageBox.Show(strErrorMessage);
            }
        }

        private void OnTimer(object sender, EventArgs e)
        {
            //Task.Run(() => m_scanManager.Read()).ConfigureAwait(false);
        }

        private void btnConnect_Click(object sender, EventArgs e)
        {
            btnConnect.Enabled = false;
            OnConnect();

            //Task.Run(() => m_scanManager.Connect()).ConfigureAwait(false);
        }

        private void FormMain_Load(object sender, EventArgs e)
        {
            tsLabel.Text = "";
            OnConnect();
            //Task.Run(() => m_scanManager.Connect()).ConfigureAwait(false);
        }

        public void ReadRackCoord(string strCoord)
        {
            for (int i=0;i<strCoord.Length;i++)
            {
                if (strCoord[i] >= '0' && strCoord[i] <= '9')
                {
                    string strHead = i <= 1 ? "A" + strCoord.Substring(0, i) : strCoord.Substring(0, i);
                    string strTail = strCoord.Substring(i);

                    if (strTail.Length == 1)
                        strTail = "0" + strTail;

                    strCoord = strHead + strTail;
                    break;
                }
            }

            this.Invoke(new MethodInvoker(
                delegate ()
                {
                    textBoxRackPosition.Text = strCoord;

                    if (m_prevRack != null)
                        btnSave.Enabled = !IsSameCoord(m_prevRack, textBoxRackPosition.Text);
                }));

            m_prevMode = ScanMode.RackCoord;
        }

        public void ReadDataCenter(DataCenter dataCenter)
        {
            m_dbManager.DataCenter = dataCenter;

            this.Invoke(new MethodInvoker(
                delegate ()
                {
                    textBoxDataCenter.Text = dataCenter.DataCenterName;
                }));
        }

        public void ReadRack(Rack rack, RackType rackType)
        {
            /*if (textBoxRackPosition.Text.Length == 0)
            {
                MessageBox.Show("먼저 Rack 위치를 Scan 하세요.");
                return;
            }*/

            if (SetRackInfo(rack, rackType) == false)
                return;

            if (rackType == null || rack.RackTypeNo != rackType.RackTypeNo)
            {
                rack.RackTypeNo = rackType.RackTypeNo;
                ClearRackGrid(rackType.Unit);
            }
            else
            {
                rack.RackTypeNo = rackType.RackTypeNo;
                SetRackGrid(rack, rackType);
            }

            this.Invoke(new MethodInvoker(
                delegate ()
                {
                    btnSave.Enabled = !IsSameCoord(rack, textBoxRackPosition.Text);
                }));

            m_prevRack = rack;
            m_prevMode = ScanMode.Rack;
        }

        private void ClearRackGrid(int? unitCount = null)
        {
            this.Invoke(new MethodInvoker(
                delegate ()
                {
                    rackGrid.Rows.Clear();

                    if (unitCount != null)
                    {
                        rackGrid.Rows.Add((int)unitCount);

                        for (int i = 0, j=(int)unitCount; i < (int)unitCount; i++, j--)
                        {
                            SetRackGrid(i, j);
                        }
                    }
                }));
        }

        public void ReadRack(Rack rack)
        {
            m_prevRack = rack;
            SetRackInfo(rack, null);
        }

        public void ReadRackType(RackType rackType)
        {
            if (m_prevRack == null)
                return;
            else
            {
                ReadRack(m_prevRack, rackType);
            }
        }

        private bool IsSameCoord(Rack rack, string strCoord)
        {
            int index = -1;

            for (int i = strCoord.Length - 1; i >= 0; i--)
            {
                char ch = strCoord[i];

                if (ch < '0' || ch > '9')
                {
                    index = i;
                    break;
                }
            }

            if (index < 0)
                return false;

            string strH = strCoord.Substring(0, index + 1);
            string strV = strCoord.Substring(index + 1);

            int indexH = GetHorizontalIndex(strH);
            int indexV;

            if (int.TryParse(strV, out indexV))
            {
                int x = m_dbManager.TileWidth * indexH;
                int z = m_dbManager.TileHeight * indexV;

                if (rack.X == x && rack.Z == z)
                    return true;
                else
                {
                    rack.X = x;
                    rack.Z = z;
                }
            }

            return false;
        }

        private int GetHorizontalIndex(string strH)
        {
            int size = ((int)'Z') - ((int)'A') + 1;
            int len = strH.Length;

            int index = 0;

            for (int i=0;i<len;i++)
            {
                index += GetPower(size, (len - i - 1)) * (((int)strH[i]) - ((int)'A') + 1);
            }

            return index;
        }

        private int GetPower(int num, int times)
        {
            int data = 1;

            for (int i=0;i<times;i++)
            {
                data *= num;
            }

            return data;
        }

        private void SetRackGrid(Rack rack, RackType rackType)
        {
            string strErrorMessage;
            List<RackItem> rackItems = m_dbManager.GetRackItems(rack.RackNo, rackType, out strErrorMessage);

            if (rackItems == null)
            {
                if (strErrorMessage != null)
                    MessageBox.Show(strErrorMessage);
            }

            int itemCount = rackItems.Count;

            this.Invoke(new MethodInvoker(
                delegate ()
                {
                    rackGrid.Rows.Clear();
                    rackGrid.Rows.Add(itemCount);

                    for (int i=0;i<itemCount;i++)
                    {
                        RackItem rackItem = rackItems[i];

                        if (rackItem.Item != null)
                        {
                            for (int j=i;j<i+rackItem.ItemType.Unit;j++)
                            {
                                int index = itemCount - j - 1;

                                if (index >= 0 && index < itemCount)
                                {
                                    DataGridViewRow row = rackGrid.Rows[index];
                                    row.Tag = rackItem;
                                }
                                else
                                {
                                    if (index < 0)
                                        rackGrid.Rows.RemoveAt(0);
                                    else
                                        rackGrid.Rows.RemoveAt(itemCount - 1);
                                    
                                    itemCount--;
                                }
                            }

                            i += rackItem.ItemType.Unit - 1;
                        }
                    }

                    for (int i = itemCount - 1; i >= 0; i--)
                    {
                        SetRackGrid(itemCount - i - 1, i + 1);
                    }
                }));
        }

        private void SetRackGrid(int index, int uPos)
        {
            DataGridViewRow row = rackGrid.Rows[index];
            RackItem rackItem = row.Tag == null ? new RackItem(uPos, null, null, null) : (RackItem)row.Tag;

            row.Tag = rackItem;
            row.Cells[0].Value = uPos;

            if (rackItem?.Item != null)
            {
                row.Cells[1].Value = rackItem.EquipmentType.EquipmentTypeName;
                row.Cells[2].Value = rackItem.Item.ItemName;
                row.Cells[3].Value = rackItem.ItemType.Unit.ToString() + "U";
            }
            else
            {
                row.Cells[1].Value = null;
                row.Cells[2].Value = null;
                row.Cells[3].Value = null;
            }
        }

        private bool SetRackInfo(Rack rack, RackType rackType)
        {
            if (m_prevRack != null)
            {
                if (btnSave.Enabled && (rack.RackNo != m_prevRack.RackNo || (rackType != null && rackType.RackTypeNo != m_prevRack.RackTypeNo)))
                {
                    if (CheckChanged(m_prevRack))
                    {
                        if (rack.RackNo != m_prevRack.RackNo)
                        {
                            DialogResult result = DialogResult.No;//MessageBox.Show("기존에 편집중이던 Rack이 존재합니다.\r\n기존 Rack 정보를 저장할까요?", "확인", MessageBoxButtons.YesNoCancel);

                            if (result == DialogResult.Yes)
                            {
                                string strErrorMessage;

                                if (m_dbManager.Save(m_prevRack, GetRackItemsFromGrid(), out strErrorMessage) == false)
                                    MessageBox.Show(strErrorMessage);
                                else
                                {
                                    this.Invoke(new MethodInvoker(
                                        delegate ()
                                        {
                                            btnSave.Enabled = false;
                                        }));
                                }
                            }
                            else if (result == DialogResult.No)
                            {
                                if (m_prevRack.X == rack.X && m_prevRack.Z == rack.Z)
                                {
                                    m_prevRack.X = -1000;
                                    m_prevRack.Z = -1000;
                                }

                                string strErrorMessage;

                                // Rack 좌표만 초기화한다.
                                if (m_dbManager.Save(m_prevRack, out strErrorMessage) == false)
                                    MessageBox.Show(strErrorMessage);
                                else
                                {
                                    this.Invoke(new MethodInvoker(
                                        delegate ()
                                        {
                                            btnSave.Enabled = false;
                                        }));
                                }
                            }
                            else
                                return false;
                        }
                        else
                        {
                            RackType _rackType = m_dbManager.GetRackType(rack, rackType);
                            int? unitCount = _rackType == null ? null : _rackType.Unit;

                            ClearRackGrid(unitCount);

                            this.Invoke(new MethodInvoker(
                                delegate ()
                                {
                                    btnSave.Enabled = false;
                                }));
                        }
                    }
                }
            }

            string strInfo = "모델명 : " + GetRackTypeName(rackType);
            strInfo += "\r\nUnit 수 : " + GetRackTypeUnit(rackType);
            strInfo += "\r\nRack 이름 : " + GetRackName(rack);

            this.Invoke(new MethodInvoker(
                delegate ()
                {
                    textBoxRackInfo.Text = strInfo;
                }));

            return true;
        }

        // Rack에 배치된 자산정보가 변경되었는가?
        private bool CheckChanged(Rack rack)
        {
            string strErrorMessage;
            Rack originRack = m_dbManager.GetRack(rack.RackNo, out strErrorMessage);

            if (originRack == null)
            {
                if (rack.RackNo > 0 || rack.RackTypeNo > 0)
                    return true;
            }
            else
            {
                if (rack.RackNo != originRack.RackNo ||
                    rack.RackTypeNo != originRack.RackTypeNo ||
                    rack.X != originRack.X ||
                    rack.Y != originRack.Y ||
                    rack.Z != originRack.Z)
                    return true;
            }

            List<RackItem> rackItems = m_dbManager.GetRackItems(rack, out strErrorMessage);
            List<RackItem> rackItems2 = new List<RackItem>();

            this.Invoke(new MethodInvoker(
                delegate ()
                {
                    foreach (DataGridViewRow row in rackGrid.Rows)
                    {
                        if (row.Tag != null)
                        {
                            RackItem item = (RackItem)row.Tag;
                            rackItems2.Add(item);
                        }
                    }
                }));

            int itemCount = rackItems.Count;

            if (itemCount != rackItems2.Count)
                return true;

            for (int i=0;i<itemCount;i++)
            {
                RackItem item1 = rackItems[i];
                RackItem item2 = rackItems2[i];

                if (item1.UPos != item2.UPos)
                    return true;

                if (item1.Item.ItemNo != item2.Item.ItemNo)
                    return true;
            }

            return false;
        }

        private string GetRackTypeName(RackType rackType)
        {
            if (rackType == null)
                return "";

            return rackType.ModelName;
        }

        private string GetRackTypeUnit(RackType rackType)
        {
            if (rackType == null)
                return "";

            return rackType.Unit.ToString();
        }

        private string GetRackName(Rack rack)
        {
            if (rack == null)
                return "";

            return rack.RackName;
        }

        private List<RackItem> GetRackItemsFromGrid()
        {
            List<RackItem> rackItems = new List<RackItem>();

            foreach (DataGridViewRow row in rackGrid.Rows)
            {
                RackItem item = (RackItem)row.Tag;
                rackItems.Add(item);
            }

            return rackItems;
        }

        public void ReadRackUnit(RackUnit unit)
        {
            if (m_prevMode == ScanMode.None/* || m_prevMode == ScanMode.RackCoord*/)
            {
                MessageBox.Show("먼저 Rack을 Scan 하세요.");
                return;
            }

            if (SelectUnit(unit.RackUnitNo) == false)
            {
                MessageBox.Show("범위를 벗어난 위치(" + unit.RackUnitNo + "U)입니다.");
                return;
            }

            this.Invoke(new MethodInvoker(
                delegate ()
                {
                    textBoxUnit.Text = unit.RackUnitNo.ToString() + "U";
                }));
            
            m_prevMode = ScanMode.UnitPos;
        }

        private bool SelectUnit(int uPos)
        {
            int rowCount = rackGrid.Rows.Count;

            if (uPos <= 0 || uPos > rowCount)
                return false;

            int rowIndex = rowCount - uPos;

            this.Invoke(new MethodInvoker(
                delegate ()
                {
                    rackGrid.ClearSelection();

                    DataGridViewRow row = rackGrid.Rows[rowIndex];
                    row.Selected = true;

                    rackGrid.FirstDisplayedScrollingRowIndex = rowIndex;
                }));
            
            return true;
        }

        public void ReadItem(Item item, ItemType itemType, EquipmentType equipmentType)
        {
            if (m_prevMode != ScanMode.UnitPos && m_prevMode != ScanMode.Item)
            {
                MessageBox.Show("먼저 Unit 위치를 Scan 하세요.");
                return;
            }

            SetItemInfo(item, itemType, equipmentType);
            SetItemGrid(item, itemType, equipmentType);

            this.Invoke(new MethodInvoker(
                delegate ()
                {
                    btnSave.Enabled = true;
                    btnDelete.Enabled = true;
                }));
            
            m_prevMode = ScanMode.Item;
        }

        private void SetItemInfo(Item item, ItemType itemType, EquipmentType equipmentType)
        {
            string strInfo = "자산타입 : " + equipmentType.EquipmentTypeName;
            strInfo += "\r\n모델명 : " + itemType.ModelName;
            strInfo += "\r\n높이 : " + itemType.Unit + "U";
            strInfo += "\r\n자산 이름 : " + item.ItemName;

            this.Invoke(new MethodInvoker(
                delegate ()
                {
                    textBoxItemInfo.Text = strInfo;
                }));
        }

        private void SetItemGrid(Item item, ItemType itemType, EquipmentType equipmentType)
        {
            if (textBoxUnit.Text.Length > 0)
            {
                string strUPos = textBoxUnit.Text.Substring(0, textBoxUnit.Text.Length - 1);

                int uPos;

                if (int.TryParse(strUPos, out uPos))
                {
                    // 이미 같은 Item이 다른 위치에 배치되어 있을지도 모르니 일단 기존에 같은 Item이 배치되었는지 확인하여 배치되었으면 삭제한다.
                    RemoveItem(item);
                    SetItemGrid(uPos, item, itemType, equipmentType);
                }
            }
        }

        private void SetItemGrid(int uPos, Item item, ItemType itemType, EquipmentType equipmentType)
        {
            int beginIndex = uPos;
            int endIndex = uPos + itemType.Unit - 1;

            int rowCount = rackGrid.Rows.Count;

            if (endIndex > rowCount)
                return;

            RackItem newRackItem = new RackItem(uPos, item, itemType, equipmentType);

            this.Invoke(new MethodInvoker(
                delegate ()
                {
                    RemoveItem(item);
                }));

            for (int i = beginIndex; i <= endIndex; i++)
            {
                int rowIndex = rowCount - i;
                DataGridViewRow row = rackGrid.Rows[rowIndex];
                RackItem rackItem = (RackItem)row.Tag;

                if (rackItem != null && rackItem.Item != null)
                {
                    // 이미 배치된 Item이 있다면 초기화한다.
                    if (i == beginIndex)
                    {
                        for (int j = i - 1; j >= 1; j--)
                        {
                            int rowIndex2 = rowCount - j;
                            DataGridViewRow row2 = rackGrid.Rows[rowIndex];
                            RackItem rackItem2 = (RackItem)row2.Tag;

                            if (rackItem2 == rackItem)
                                row2.Tag = new RackItem(j, null, null, null);
                            else
                                break;
                        }
                    }
                    else if (i == endIndex)
                    {
                        for (int j = i + 1; j <= rowCount; j++)
                        {
                            int rowIndex2 = rowCount - j;
                            DataGridViewRow row2 = rackGrid.Rows[rowIndex];
                            RackItem rackItem2 = (RackItem)row2.Tag;

                            if (rackItem2 == rackItem)
                                row2.Tag = new RackItem(j, null, null, null);
                            else
                                break;
                        }
                    }
                }

                row.Tag = newRackItem;
                
                this.Invoke(new MethodInvoker(
                    delegate ()
                    {
                        SetRackGrid(rowIndex, i);
                    }));
            }
        }

        private void RemoveItem(Item item)
        {
            foreach (DataGridViewRow row in rackGrid.Rows)
            {
                RackItem rackItem = (RackItem)row.Tag;

                if (rackItem != null && rackItem.Item != null)
                {
                    if (rackItem.Item.ItemNo == item.ItemNo)
                    {
                        int uPos = rackGrid.Rows.Count - row.Index;
                        row.Tag = new RackItem(uPos, null, null, null);
                        SetRackGrid(row.Index, uPos);
                    }
                }
            }
        }

        private void btnSave_Click(object sender, EventArgs e)
        {
            if (m_prevRack == null)
                return;

            if (textBoxRackPosition.Text.Trim().Length == 0)
            {
                MessageBox.Show("먼저 Rack 위치를 Scan 하세요.");
                return;
            }

            string strErrorMessage;

            if (m_dbManager.Save(m_prevRack, GetRackItemsFromGrid(), out strErrorMessage) == false)
                MessageBox.Show(strErrorMessage);
            else
            {
                btnSave.Enabled = false;
            }
        }

        private void btnDelete_Click(object sender, EventArgs e)
        {
            RackItem rackItem = (RackItem)rackGrid.SelectedCells[0].OwningRow.Tag;

            if (rackItem?.Item != null)
            {
                RemoveItem(rackItem.Item);
                btnDelete.Enabled = false;
            }
        }

        private void rackGrid_SelectionChanged(object sender, EventArgs e)
        {
            if (rackGrid.SelectedCells.Count > 0)
            {
                RackItem rackItem = (RackItem)rackGrid.SelectedCells[0].OwningRow.Tag;

                if (rackItem?.Item != null)
                {
                    this.Invoke(new MethodInvoker(
                        delegate ()
                        {
                            btnDelete.Enabled = true;
                        }));
                    return;
                }
            }

            this.Invoke(new MethodInvoker(
                delegate ()
                {
                    btnDelete.Enabled = false;
                }));
        }
    }
}
