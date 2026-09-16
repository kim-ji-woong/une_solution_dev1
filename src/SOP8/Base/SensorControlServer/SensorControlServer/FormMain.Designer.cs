
namespace SensorControlServer
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
            System.Windows.Forms.DataGridViewCellStyle dataGridViewCellStyle1 = new System.Windows.Forms.DataGridViewCellStyle();
            System.Windows.Forms.DataGridViewCellStyle dataGridViewCellStyle2 = new System.Windows.Forms.DataGridViewCellStyle();
            System.Windows.Forms.DataGridViewCellStyle dataGridViewCellStyle3 = new System.Windows.Forms.DataGridViewCellStyle();
            System.Windows.Forms.DataGridViewCellStyle dataGridViewCellStyle4 = new System.Windows.Forms.DataGridViewCellStyle();
            this.gridProcessStatus = new System.Windows.Forms.DataGridView();
            this.colNo = new System.Windows.Forms.DataGridViewCheckBoxColumn();
            this.colName = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.colPath = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.colStatus = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.btnRegist = new System.Windows.Forms.Button();
            this.btnRemove = new System.Windows.Forms.Button();
            this.checkBoxSelectAll = new System.Windows.Forms.CheckBox();
            this.btnRun = new System.Windows.Forms.Button();
            this.btnStop = new System.Windows.Forms.Button();
            this.btnSave = new System.Windows.Forms.Button();
            this.textBoxAdditionalInfo = new System.Windows.Forms.TextBox();
            ((System.ComponentModel.ISupportInitialize)(this.gridProcessStatus)).BeginInit();
            this.SuspendLayout();
            // 
            // gridProcessStatus
            // 
            this.gridProcessStatus.AllowUserToAddRows = false;
            this.gridProcessStatus.AllowUserToDeleteRows = false;
            dataGridViewCellStyle1.Alignment = System.Windows.Forms.DataGridViewContentAlignment.MiddleCenter;
            dataGridViewCellStyle1.BackColor = System.Drawing.SystemColors.Control;
            dataGridViewCellStyle1.Font = new System.Drawing.Font("맑은 고딕", 9F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point);
            dataGridViewCellStyle1.ForeColor = System.Drawing.SystemColors.WindowText;
            dataGridViewCellStyle1.SelectionBackColor = System.Drawing.SystemColors.Highlight;
            dataGridViewCellStyle1.SelectionForeColor = System.Drawing.SystemColors.HighlightText;
            dataGridViewCellStyle1.WrapMode = System.Windows.Forms.DataGridViewTriState.True;
            this.gridProcessStatus.ColumnHeadersDefaultCellStyle = dataGridViewCellStyle1;
            this.gridProcessStatus.ColumnHeadersHeightSizeMode = System.Windows.Forms.DataGridViewColumnHeadersHeightSizeMode.AutoSize;
            this.gridProcessStatus.Columns.AddRange(new System.Windows.Forms.DataGridViewColumn[] {
            this.colNo,
            this.colName,
            this.colPath,
            this.colStatus});
            this.gridProcessStatus.Location = new System.Drawing.Point(12, 39);
            this.gridProcessStatus.MultiSelect = false;
            this.gridProcessStatus.Name = "gridProcessStatus";
            this.gridProcessStatus.RowHeadersVisible = false;
            this.gridProcessStatus.RowTemplate.Height = 25;
            this.gridProcessStatus.Size = new System.Drawing.Size(533, 150);
            this.gridProcessStatus.TabIndex = 0;
            this.gridProcessStatus.MouseClick += new System.Windows.Forms.MouseEventHandler(this.gridProcessStatus_MouseClick);
            // 
            // colNo
            // 
            this.colNo.HeaderText = "선택";
            this.colNo.Name = "colNo";
            this.colNo.Resizable = System.Windows.Forms.DataGridViewTriState.True;
            this.colNo.Width = 60;
            // 
            // colName
            // 
            this.colName.AutoSizeMode = System.Windows.Forms.DataGridViewAutoSizeColumnMode.Fill;
            dataGridViewCellStyle2.Alignment = System.Windows.Forms.DataGridViewContentAlignment.MiddleLeft;
            dataGridViewCellStyle2.Padding = new System.Windows.Forms.Padding(5, 0, 0, 0);
            this.colName.DefaultCellStyle = dataGridViewCellStyle2;
            this.colName.HeaderText = "프로세스 이름";
            this.colName.Name = "colName";
            this.colName.SortMode = System.Windows.Forms.DataGridViewColumnSortMode.NotSortable;
            // 
            // colPath
            // 
            dataGridViewCellStyle3.Alignment = System.Windows.Forms.DataGridViewContentAlignment.MiddleLeft;
            this.colPath.DefaultCellStyle = dataGridViewCellStyle3;
            this.colPath.HeaderText = "File 경로";
            this.colPath.Name = "colPath";
            this.colPath.ReadOnly = true;
            this.colPath.SortMode = System.Windows.Forms.DataGridViewColumnSortMode.NotSortable;
            this.colPath.Width = 200;
            // 
            // colStatus
            // 
            dataGridViewCellStyle4.Alignment = System.Windows.Forms.DataGridViewContentAlignment.MiddleCenter;
            this.colStatus.DefaultCellStyle = dataGridViewCellStyle4;
            this.colStatus.HeaderText = "실행상태";
            this.colStatus.Name = "colStatus";
            this.colStatus.ReadOnly = true;
            this.colStatus.SortMode = System.Windows.Forms.DataGridViewColumnSortMode.NotSortable;
            // 
            // btnRegist
            // 
            this.btnRegist.Location = new System.Drawing.Point(439, 195);
            this.btnRegist.Name = "btnRegist";
            this.btnRegist.Size = new System.Drawing.Size(50, 23);
            this.btnRegist.TabIndex = 1;
            this.btnRegist.Text = "등록";
            this.btnRegist.UseVisualStyleBackColor = true;
            this.btnRegist.Click += new System.EventHandler(this.btnRegist_Click);
            // 
            // btnRemove
            // 
            this.btnRemove.Location = new System.Drawing.Point(495, 195);
            this.btnRemove.Name = "btnRemove";
            this.btnRemove.Size = new System.Drawing.Size(50, 23);
            this.btnRemove.TabIndex = 1;
            this.btnRemove.Text = "삭제";
            this.btnRemove.UseVisualStyleBackColor = true;
            this.btnRemove.Click += new System.EventHandler(this.btnRemove_Click);
            // 
            // checkBoxSelectAll
            // 
            this.checkBoxSelectAll.AutoSize = true;
            this.checkBoxSelectAll.Location = new System.Drawing.Point(12, 12);
            this.checkBoxSelectAll.Name = "checkBoxSelectAll";
            this.checkBoxSelectAll.Size = new System.Drawing.Size(78, 19);
            this.checkBoxSelectAll.TabIndex = 2;
            this.checkBoxSelectAll.Text = "모두 선택";
            this.checkBoxSelectAll.UseVisualStyleBackColor = true;
            // 
            // btnRun
            // 
            this.btnRun.Enabled = false;
            this.btnRun.Location = new System.Drawing.Point(12, 195);
            this.btnRun.Name = "btnRun";
            this.btnRun.Size = new System.Drawing.Size(50, 23);
            this.btnRun.TabIndex = 1;
            this.btnRun.Text = "실행";
            this.btnRun.UseVisualStyleBackColor = true;
            this.btnRun.Click += new System.EventHandler(this.btnRun_Click);
            // 
            // btnStop
            // 
            this.btnStop.Enabled = false;
            this.btnStop.Location = new System.Drawing.Point(68, 195);
            this.btnStop.Name = "btnStop";
            this.btnStop.Size = new System.Drawing.Size(50, 23);
            this.btnStop.TabIndex = 1;
            this.btnStop.Text = "중지";
            this.btnStop.UseVisualStyleBackColor = true;
            this.btnStop.Click += new System.EventHandler(this.btnStop_Click);
            // 
            // btnSave
            // 
            this.btnSave.Location = new System.Drawing.Point(124, 195);
            this.btnSave.Name = "btnSave";
            this.btnSave.Size = new System.Drawing.Size(50, 23);
            this.btnSave.TabIndex = 1;
            this.btnSave.Text = "저장";
            this.btnSave.UseVisualStyleBackColor = true;
            this.btnSave.Click += new System.EventHandler(this.btnSave_Click);
            // 
            // textBoxAdditionalInfo
            // 
            this.textBoxAdditionalInfo.Location = new System.Drawing.Point(12, 243);
            this.textBoxAdditionalInfo.Multiline = true;
            this.textBoxAdditionalInfo.Name = "textBoxAdditionalInfo";
            this.textBoxAdditionalInfo.Size = new System.Drawing.Size(533, 195);
            this.textBoxAdditionalInfo.TabIndex = 3;
            this.textBoxAdditionalInfo.TextChanged += new System.EventHandler(this.textBoxAdditionalInfo_TextChanged);
            // 
            // FormMain
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(7F, 15F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(555, 450);
            this.Controls.Add(this.textBoxAdditionalInfo);
            this.Controls.Add(this.checkBoxSelectAll);
            this.Controls.Add(this.btnRemove);
            this.Controls.Add(this.btnSave);
            this.Controls.Add(this.btnStop);
            this.Controls.Add(this.btnRun);
            this.Controls.Add(this.btnRegist);
            this.Controls.Add(this.gridProcessStatus);
            this.FormBorderStyle = System.Windows.Forms.FormBorderStyle.FixedToolWindow;
            this.Name = "FormMain";
            this.Text = "Sensor Controller";
            this.FormClosing += new System.Windows.Forms.FormClosingEventHandler(this.FormMain_FormClosing);
            this.Load += new System.EventHandler(this.FormMain_Load);
            ((System.ComponentModel.ISupportInitialize)(this.gridProcessStatus)).EndInit();
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.DataGridView gridProcessStatus;
        private System.Windows.Forms.Button btnRegist;
        private System.Windows.Forms.Button btnRemove;
        private System.Windows.Forms.CheckBox checkBoxSelectAll;
        private System.Windows.Forms.Button btnRun;
        private System.Windows.Forms.Button btnStop;
        private System.Windows.Forms.Button btnSave;
        private System.Windows.Forms.TextBox textBoxAdditionalInfo;
        private System.Windows.Forms.DataGridViewCheckBoxColumn colNo;
        private System.Windows.Forms.DataGridViewTextBoxColumn colName;
        private System.Windows.Forms.DataGridViewTextBoxColumn colPath;
        private System.Windows.Forms.DataGridViewTextBoxColumn colStatus;
    }
}

