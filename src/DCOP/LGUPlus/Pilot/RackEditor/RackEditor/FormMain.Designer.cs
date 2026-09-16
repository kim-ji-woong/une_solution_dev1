
namespace RackEditor
{
    partial class FormMain
    {
        /// <summary>
        ///  Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        ///  Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        /// <summary>
        ///  Required method for Designer support - do not modify
        ///  the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            this.components = new System.ComponentModel.Container();
            System.Windows.Forms.DataGridViewCellStyle dataGridViewCellStyle1 = new System.Windows.Forms.DataGridViewCellStyle();
            System.Windows.Forms.DataGridViewCellStyle dataGridViewCellStyle2 = new System.Windows.Forms.DataGridViewCellStyle();
            System.Windows.Forms.DataGridViewCellStyle dataGridViewCellStyle3 = new System.Windows.Forms.DataGridViewCellStyle();
            System.Windows.Forms.DataGridViewCellStyle dataGridViewCellStyle4 = new System.Windows.Forms.DataGridViewCellStyle();
            System.Windows.Forms.DataGridViewCellStyle dataGridViewCellStyle5 = new System.Windows.Forms.DataGridViewCellStyle();
            this.statusStrip1 = new System.Windows.Forms.StatusStrip();
            this.tsLabel = new System.Windows.Forms.ToolStripStatusLabel();
            this.rackGrid = new System.Windows.Forms.DataGridView();
            this.colUnit = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.colItemType = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.colItemName = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.colUnitCount = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.label1 = new System.Windows.Forms.Label();
            this.label2 = new System.Windows.Forms.Label();
            this.textBoxRackPosition = new System.Windows.Forms.TextBox();
            this.textBoxRackInfo = new System.Windows.Forms.TextBox();
            this.label3 = new System.Windows.Forms.Label();
            this.textBoxUnit = new System.Windows.Forms.TextBox();
            this.label4 = new System.Windows.Forms.Label();
            this.textBoxItemInfo = new System.Windows.Forms.TextBox();
            this.btnSave = new System.Windows.Forms.Button();
            this.timerScanner = new System.Windows.Forms.Timer(this.components);
            this.btnConnect = new System.Windows.Forms.Button();
            this.btnDelete = new System.Windows.Forms.Button();
            this.textBoxDataCenter = new System.Windows.Forms.TextBox();
            this.label5 = new System.Windows.Forms.Label();
            this.statusStrip1.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)(this.rackGrid)).BeginInit();
            this.SuspendLayout();
            // 
            // statusStrip1
            // 
            this.statusStrip1.Items.AddRange(new System.Windows.Forms.ToolStripItem[] {
            this.tsLabel});
            this.statusStrip1.Location = new System.Drawing.Point(0, 696);
            this.statusStrip1.Name = "statusStrip1";
            this.statusStrip1.Size = new System.Drawing.Size(957, 22);
            this.statusStrip1.TabIndex = 0;
            this.statusStrip1.Text = "statusStrip1";
            // 
            // tsLabel
            // 
            this.tsLabel.Name = "tsLabel";
            this.tsLabel.Size = new System.Drawing.Size(256, 17);
            this.tsLabel.Text = "Barcode Scanner와 연결을 기다리는 중입니다.";
            // 
            // rackGrid
            // 
            this.rackGrid.AllowUserToAddRows = false;
            this.rackGrid.AllowUserToDeleteRows = false;
            this.rackGrid.AllowUserToResizeRows = false;
            dataGridViewCellStyle1.Alignment = System.Windows.Forms.DataGridViewContentAlignment.MiddleCenter;
            dataGridViewCellStyle1.BackColor = System.Drawing.SystemColors.Control;
            dataGridViewCellStyle1.Font = new System.Drawing.Font("맑은 고딕", 9F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point);
            dataGridViewCellStyle1.ForeColor = System.Drawing.SystemColors.WindowText;
            dataGridViewCellStyle1.SelectionBackColor = System.Drawing.SystemColors.Highlight;
            dataGridViewCellStyle1.SelectionForeColor = System.Drawing.SystemColors.HighlightText;
            dataGridViewCellStyle1.WrapMode = System.Windows.Forms.DataGridViewTriState.True;
            this.rackGrid.ColumnHeadersDefaultCellStyle = dataGridViewCellStyle1;
            this.rackGrid.ColumnHeadersHeightSizeMode = System.Windows.Forms.DataGridViewColumnHeadersHeightSizeMode.AutoSize;
            this.rackGrid.Columns.AddRange(new System.Windows.Forms.DataGridViewColumn[] {
            this.colUnit,
            this.colItemType,
            this.colItemName,
            this.colUnitCount});
            this.rackGrid.Location = new System.Drawing.Point(371, 29);
            this.rackGrid.Name = "rackGrid";
            this.rackGrid.ReadOnly = true;
            this.rackGrid.RowHeadersVisible = false;
            this.rackGrid.RowTemplate.Height = 25;
            this.rackGrid.Size = new System.Drawing.Size(568, 650);
            this.rackGrid.TabIndex = 1;
            this.rackGrid.SelectionChanged += new System.EventHandler(this.rackGrid_SelectionChanged);
            // 
            // colUnit
            // 
            dataGridViewCellStyle2.Alignment = System.Windows.Forms.DataGridViewContentAlignment.MiddleCenter;
            this.colUnit.DefaultCellStyle = dataGridViewCellStyle2;
            this.colUnit.HeaderText = "U";
            this.colUnit.Name = "colUnit";
            this.colUnit.ReadOnly = true;
            this.colUnit.SortMode = System.Windows.Forms.DataGridViewColumnSortMode.NotSortable;
            this.colUnit.Width = 40;
            // 
            // colItemType
            // 
            dataGridViewCellStyle3.Alignment = System.Windows.Forms.DataGridViewContentAlignment.MiddleCenter;
            this.colItemType.DefaultCellStyle = dataGridViewCellStyle3;
            this.colItemType.HeaderText = "자산타입";
            this.colItemType.Name = "colItemType";
            this.colItemType.ReadOnly = true;
            this.colItemType.SortMode = System.Windows.Forms.DataGridViewColumnSortMode.NotSortable;
            // 
            // colItemName
            // 
            this.colItemName.AutoSizeMode = System.Windows.Forms.DataGridViewAutoSizeColumnMode.Fill;
            dataGridViewCellStyle4.Alignment = System.Windows.Forms.DataGridViewContentAlignment.MiddleCenter;
            this.colItemName.DefaultCellStyle = dataGridViewCellStyle4;
            this.colItemName.HeaderText = "자산이름";
            this.colItemName.Name = "colItemName";
            this.colItemName.ReadOnly = true;
            this.colItemName.SortMode = System.Windows.Forms.DataGridViewColumnSortMode.NotSortable;
            // 
            // colUnitCount
            // 
            dataGridViewCellStyle5.Alignment = System.Windows.Forms.DataGridViewContentAlignment.MiddleCenter;
            this.colUnitCount.DefaultCellStyle = dataGridViewCellStyle5;
            this.colUnitCount.HeaderText = "높이";
            this.colUnitCount.Name = "colUnitCount";
            this.colUnitCount.ReadOnly = true;
            this.colUnitCount.SortMode = System.Windows.Forms.DataGridViewColumnSortMode.NotSortable;
            this.colUnitCount.Width = 60;
            // 
            // label1
            // 
            this.label1.AutoSize = true;
            this.label1.Location = new System.Drawing.Point(35, 87);
            this.label1.Name = "label1";
            this.label1.Size = new System.Drawing.Size(67, 15);
            this.label1.TabIndex = 2;
            this.label1.Text = "Rack 위치 :";
            // 
            // label2
            // 
            this.label2.AutoSize = true;
            this.label2.Location = new System.Drawing.Point(35, 126);
            this.label2.Name = "label2";
            this.label2.Size = new System.Drawing.Size(60, 15);
            this.label2.TabIndex = 2;
            this.label2.Text = "Rack 정보";
            // 
            // textBoxRackPosition
            // 
            this.textBoxRackPosition.Location = new System.Drawing.Point(107, 84);
            this.textBoxRackPosition.Name = "textBoxRackPosition";
            this.textBoxRackPosition.ReadOnly = true;
            this.textBoxRackPosition.Size = new System.Drawing.Size(100, 23);
            this.textBoxRackPosition.TabIndex = 3;
            // 
            // textBoxRackInfo
            // 
            this.textBoxRackInfo.Location = new System.Drawing.Point(38, 144);
            this.textBoxRackInfo.Multiline = true;
            this.textBoxRackInfo.Name = "textBoxRackInfo";
            this.textBoxRackInfo.ReadOnly = true;
            this.textBoxRackInfo.Size = new System.Drawing.Size(169, 113);
            this.textBoxRackInfo.TabIndex = 4;
            // 
            // label3
            // 
            this.label3.AutoSize = true;
            this.label3.Location = new System.Drawing.Point(35, 283);
            this.label3.Name = "label3";
            this.label3.Size = new System.Drawing.Size(36, 15);
            this.label3.TabIndex = 2;
            this.label3.Text = "Unit :";
            // 
            // textBoxUnit
            // 
            this.textBoxUnit.Location = new System.Drawing.Point(107, 280);
            this.textBoxUnit.Name = "textBoxUnit";
            this.textBoxUnit.ReadOnly = true;
            this.textBoxUnit.Size = new System.Drawing.Size(100, 23);
            this.textBoxUnit.TabIndex = 3;
            // 
            // label4
            // 
            this.label4.AutoSize = true;
            this.label4.Location = new System.Drawing.Point(35, 327);
            this.label4.Name = "label4";
            this.label4.Size = new System.Drawing.Size(59, 15);
            this.label4.TabIndex = 2;
            this.label4.Text = "자산 정보";
            // 
            // textBoxItemInfo
            // 
            this.textBoxItemInfo.Location = new System.Drawing.Point(38, 345);
            this.textBoxItemInfo.Multiline = true;
            this.textBoxItemInfo.Name = "textBoxItemInfo";
            this.textBoxItemInfo.ReadOnly = true;
            this.textBoxItemInfo.Size = new System.Drawing.Size(169, 113);
            this.textBoxItemInfo.TabIndex = 4;
            // 
            // btnSave
            // 
            this.btnSave.Enabled = false;
            this.btnSave.Location = new System.Drawing.Point(38, 656);
            this.btnSave.Name = "btnSave";
            this.btnSave.Size = new System.Drawing.Size(75, 23);
            this.btnSave.TabIndex = 5;
            this.btnSave.Text = "저장";
            this.btnSave.UseVisualStyleBackColor = true;
            this.btnSave.Click += new System.EventHandler(this.btnSave_Click);
            // 
            // timerScanner
            // 
            this.timerScanner.Tick += new System.EventHandler(this.OnTimer);
            // 
            // btnConnect
            // 
            this.btnConnect.Enabled = false;
            this.btnConnect.Location = new System.Drawing.Point(119, 656);
            this.btnConnect.Name = "btnConnect";
            this.btnConnect.Size = new System.Drawing.Size(75, 23);
            this.btnConnect.TabIndex = 5;
            this.btnConnect.Text = "접속";
            this.btnConnect.UseVisualStyleBackColor = true;
            this.btnConnect.Click += new System.EventHandler(this.btnConnect_Click);
            // 
            // btnDelete
            // 
            this.btnDelete.Enabled = false;
            this.btnDelete.Location = new System.Drawing.Point(200, 656);
            this.btnDelete.Name = "btnDelete";
            this.btnDelete.Size = new System.Drawing.Size(75, 23);
            this.btnDelete.TabIndex = 5;
            this.btnDelete.Text = "삭제";
            this.btnDelete.UseVisualStyleBackColor = true;
            this.btnDelete.Click += new System.EventHandler(this.btnDelete_Click);
            // 
            // textBoxDataCenter
            // 
            this.textBoxDataCenter.Location = new System.Drawing.Point(107, 42);
            this.textBoxDataCenter.Name = "textBoxDataCenter";
            this.textBoxDataCenter.ReadOnly = true;
            this.textBoxDataCenter.Size = new System.Drawing.Size(100, 23);
            this.textBoxDataCenter.TabIndex = 7;
            // 
            // label5
            // 
            this.label5.AutoSize = true;
            this.label5.Location = new System.Drawing.Point(35, 45);
            this.label5.Name = "label5";
            this.label5.Size = new System.Drawing.Size(38, 15);
            this.label5.TabIndex = 6;
            this.label5.Text = "국사 :";
            // 
            // FormMain
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(7F, 15F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(957, 718);
            this.Controls.Add(this.textBoxDataCenter);
            this.Controls.Add(this.label5);
            this.Controls.Add(this.btnDelete);
            this.Controls.Add(this.btnConnect);
            this.Controls.Add(this.btnSave);
            this.Controls.Add(this.textBoxItemInfo);
            this.Controls.Add(this.textBoxRackInfo);
            this.Controls.Add(this.textBoxUnit);
            this.Controls.Add(this.textBoxRackPosition);
            this.Controls.Add(this.label4);
            this.Controls.Add(this.label3);
            this.Controls.Add(this.label2);
            this.Controls.Add(this.label1);
            this.Controls.Add(this.rackGrid);
            this.Controls.Add(this.statusStrip1);
            this.FormBorderStyle = System.Windows.Forms.FormBorderStyle.FixedToolWindow;
            this.Name = "FormMain";
            this.Text = "바코드를 이용한 랙 편집기";
            this.Load += new System.EventHandler(this.FormMain_Load);
            this.statusStrip1.ResumeLayout(false);
            this.statusStrip1.PerformLayout();
            ((System.ComponentModel.ISupportInitialize)(this.rackGrid)).EndInit();
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.StatusStrip statusStrip1;
        private System.Windows.Forms.ToolStripStatusLabel tsLabel;
        private System.Windows.Forms.DataGridView rackGrid;
        private System.Windows.Forms.DataGridViewTextBoxColumn colUnit;
        private System.Windows.Forms.DataGridViewTextBoxColumn colItemType;
        private System.Windows.Forms.DataGridViewTextBoxColumn colItemName;
        private System.Windows.Forms.DataGridViewTextBoxColumn colUnitCount;
        private System.Windows.Forms.Label label1;
        private System.Windows.Forms.Label label2;
        private System.Windows.Forms.TextBox textBoxRackPosition;
        private System.Windows.Forms.TextBox textBoxRackInfo;
        private System.Windows.Forms.Label label3;
        private System.Windows.Forms.TextBox textBoxUnit;
        private System.Windows.Forms.Label label4;
        private System.Windows.Forms.TextBox textBoxItemInfo;
        private System.Windows.Forms.Button btnSave;
        private System.Windows.Forms.Timer timerScanner;
        private System.Windows.Forms.Button btnConnect;
        private System.Windows.Forms.Button btnDelete;
        private System.Windows.Forms.TextBox textBoxDataCenter;
        private System.Windows.Forms.Label label5;
    }
}

