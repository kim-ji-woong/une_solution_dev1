
namespace IntegrationServer
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
            System.Windows.Forms.DataGridViewCellStyle dataGridViewCellStyle5 = new System.Windows.Forms.DataGridViewCellStyle();
            System.Windows.Forms.DataGridViewCellStyle dataGridViewCellStyle6 = new System.Windows.Forms.DataGridViewCellStyle();
            this.btnServer = new System.Windows.Forms.Button();
            this.txtLogPath = new System.Windows.Forms.TextBox();
            this.label5 = new System.Windows.Forms.Label();
            this.btnDeleteServer = new System.Windows.Forms.Button();
            this.cbDbType = new System.Windows.Forms.ComboBox();
            this.txtDbName = new System.Windows.Forms.TextBox();
            this.label3 = new System.Windows.Forms.Label();
            this.label2 = new System.Windows.Forms.Label();
            this.txtDbIP = new System.Windows.Forms.TextBox();
            this.label1 = new System.Windows.Forms.Label();
            this.groupBox2 = new System.Windows.Forms.GroupBox();
            this.label6 = new System.Windows.Forms.Label();
            this.txtSOPWebServerFrontURL = new System.Windows.Forms.TextBox();
            this.txtDbID = new System.Windows.Forms.TextBox();
            this.label13 = new System.Windows.Forms.Label();
            this.btnSearch = new System.Windows.Forms.Button();
            this.txtDbPw = new System.Windows.Forms.TextBox();
            this.label4 = new System.Windows.Forms.Label();
            this.gbProperty = new System.Windows.Forms.GroupBox();
            this.txtServerAlias = new System.Windows.Forms.TextBox();
            this.lblServerAlias = new System.Windows.Forms.Label();
            this.txtSOPWebServerURL = new System.Windows.Forms.TextBox();
            this.txtServerSiteID = new System.Windows.Forms.TextBox();
            this.lblServerSiteID = new System.Windows.Forms.Label();
            this.label12 = new System.Windows.Forms.Label();
            this.txtServerPort = new System.Windows.Forms.TextBox();
            this.lblServerPort = new System.Windows.Forms.Label();
            this.txtServerIP = new System.Windows.Forms.TextBox();
            this.lblServerIP = new System.Windows.Forms.Label();
            this.cbUse = new System.Windows.Forms.CheckBox();
            this.btnSave = new System.Windows.Forms.Button();
            this.dataGridView1 = new System.Windows.Forms.DataGridView();
            this.colSeqNo = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.colServerTypeID = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.colServerType = new System.Windows.Forms.DataGridViewComboBoxColumn();
            this.groupBox2.SuspendLayout();
            this.gbProperty.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)(this.dataGridView1)).BeginInit();
            this.SuspendLayout();
            // 
            // btnServer
            // 
            this.btnServer.Location = new System.Drawing.Point(696, 12);
            this.btnServer.Name = "btnServer";
            this.btnServer.Size = new System.Drawing.Size(75, 23);
            this.btnServer.TabIndex = 11;
            this.btnServer.Text = "서버시작";
            this.btnServer.UseVisualStyleBackColor = true;
            this.btnServer.Click += new System.EventHandler(this.btnServer_Click);
            // 
            // txtLogPath
            // 
            this.txtLogPath.Location = new System.Drawing.Point(81, 484);
            this.txtLogPath.Name = "txtLogPath";
            this.txtLogPath.Size = new System.Drawing.Size(254, 23);
            this.txtLogPath.TabIndex = 47;
            this.txtLogPath.Text = "C:\\UNE\\Log";
            this.txtLogPath.TextChanged += new System.EventHandler(this.txt_TextChanged);
            // 
            // label5
            // 
            this.label5.AutoSize = true;
            this.label5.Location = new System.Drawing.Point(17, 487);
            this.label5.Name = "label5";
            this.label5.Size = new System.Drawing.Size(55, 15);
            this.label5.TabIndex = 48;
            this.label5.Text = "Log 위치";
            // 
            // btnDeleteServer
            // 
            this.btnDeleteServer.Location = new System.Drawing.Point(156, 448);
            this.btnDeleteServer.Name = "btnDeleteServer";
            this.btnDeleteServer.Size = new System.Drawing.Size(75, 23);
            this.btnDeleteServer.TabIndex = 46;
            this.btnDeleteServer.Text = "삭제";
            this.btnDeleteServer.UseVisualStyleBackColor = true;
            this.btnDeleteServer.Click += new System.EventHandler(this.btnDeleteServer_Click);
            // 
            // cbDbType
            // 
            this.cbDbType.DropDownStyle = System.Windows.Forms.ComboBoxStyle.DropDownList;
            this.cbDbType.FormattingEnabled = true;
            this.cbDbType.Location = new System.Drawing.Point(75, 22);
            this.cbDbType.Name = "cbDbType";
            this.cbDbType.Size = new System.Drawing.Size(121, 23);
            this.cbDbType.TabIndex = 1;
            this.cbDbType.SelectedIndexChanged += new System.EventHandler(this.cbDbType_SelectedIndexChanged);
            // 
            // txtDbName
            // 
            this.txtDbName.Location = new System.Drawing.Point(75, 51);
            this.txtDbName.Name = "txtDbName";
            this.txtDbName.PasswordChar = '*';
            this.txtDbName.Size = new System.Drawing.Size(121, 23);
            this.txtDbName.TabIndex = 3;
            this.txtDbName.TextChanged += new System.EventHandler(this.txt_TextChanged);
            // 
            // label3
            // 
            this.label3.AutoSize = true;
            this.label3.Location = new System.Drawing.Point(11, 54);
            this.label3.Name = "label3";
            this.label3.Size = new System.Drawing.Size(39, 15);
            this.label3.TabIndex = 16;
            this.label3.Text = "DB 명";
            // 
            // label2
            // 
            this.label2.AutoSize = true;
            this.label2.Location = new System.Drawing.Point(11, 25);
            this.label2.Name = "label2";
            this.label2.Size = new System.Drawing.Size(51, 15);
            this.label2.TabIndex = 14;
            this.label2.Text = "DB 종류";
            // 
            // txtDbIP
            // 
            this.txtDbIP.Location = new System.Drawing.Point(284, 22);
            this.txtDbIP.Name = "txtDbIP";
            this.txtDbIP.PasswordChar = '*';
            this.txtDbIP.Size = new System.Drawing.Size(121, 23);
            this.txtDbIP.TabIndex = 2;
            this.txtDbIP.TextChanged += new System.EventHandler(this.txt_TextChanged);
            // 
            // label1
            // 
            this.label1.AutoSize = true;
            this.label1.Location = new System.Drawing.Point(220, 25);
            this.label1.Name = "label1";
            this.label1.Size = new System.Drawing.Size(37, 15);
            this.label1.TabIndex = 12;
            this.label1.Text = "DB IP";
            // 
            // groupBox2
            // 
            this.groupBox2.Controls.Add(this.label6);
            this.groupBox2.Controls.Add(this.txtSOPWebServerFrontURL);
            this.groupBox2.Controls.Add(this.txtDbID);
            this.groupBox2.Controls.Add(this.label13);
            this.groupBox2.Controls.Add(this.btnSearch);
            this.groupBox2.Controls.Add(this.cbDbType);
            this.groupBox2.Controls.Add(this.txtDbPw);
            this.groupBox2.Controls.Add(this.label4);
            this.groupBox2.Controls.Add(this.txtDbName);
            this.groupBox2.Controls.Add(this.label3);
            this.groupBox2.Controls.Add(this.label2);
            this.groupBox2.Controls.Add(this.txtDbIP);
            this.groupBox2.Controls.Add(this.label1);
            this.groupBox2.Location = new System.Drawing.Point(235, 41);
            this.groupBox2.Name = "groupBox2";
            this.groupBox2.Size = new System.Drawing.Size(560, 144);
            this.groupBox2.TabIndex = 49;
            this.groupBox2.TabStop = false;
            this.groupBox2.Text = "UNE Server";
            // 
            // label6
            // 
            this.label6.AutoSize = true;
            this.label6.Location = new System.Drawing.Point(11, 112);
            this.label6.Name = "label6";
            this.label6.Size = new System.Drawing.Size(308, 15);
            this.label6.TabIndex = 44;
            this.label6.Text = "SOPWebServerURL 앞 주소 (ex:https://127.0.0.1:44379)";
            // 
            // txtSOPWebServerFrontURL
            // 
            this.txtSOPWebServerFrontURL.Location = new System.Drawing.Point(325, 109);
            this.txtSOPWebServerFrontURL.Name = "txtSOPWebServerFrontURL";
            this.txtSOPWebServerFrontURL.Size = new System.Drawing.Size(200, 23);
            this.txtSOPWebServerFrontURL.TabIndex = 25;
            this.txtSOPWebServerFrontURL.Text = "https://127.0.0.1:44379";
            this.txtSOPWebServerFrontURL.TextChanged += new System.EventHandler(this.txt_TextChanged);
            // 
            // txtDbID
            // 
            this.txtDbID.Location = new System.Drawing.Point(75, 80);
            this.txtDbID.Name = "txtDbID";
            this.txtDbID.PasswordChar = '*';
            this.txtDbID.Size = new System.Drawing.Size(121, 23);
            this.txtDbID.TabIndex = 4;
            this.txtDbID.TextChanged += new System.EventHandler(this.txt_TextChanged);
            // 
            // label13
            // 
            this.label13.AutoSize = true;
            this.label13.Location = new System.Drawing.Point(11, 83);
            this.label13.Name = "label13";
            this.label13.Size = new System.Drawing.Size(39, 15);
            this.label13.TabIndex = 24;
            this.label13.Text = "DB ID";
            // 
            // btnSearch
            // 
            this.btnSearch.Location = new System.Drawing.Point(411, 83);
            this.btnSearch.Name = "btnSearch";
            this.btnSearch.Size = new System.Drawing.Size(78, 23);
            this.btnSearch.TabIndex = 7;
            this.btnSearch.Text = "설정조회";
            this.btnSearch.UseVisualStyleBackColor = true;
            this.btnSearch.Click += new System.EventHandler(this.btnSearch_Click);
            // 
            // txtDbPw
            // 
            this.txtDbPw.Location = new System.Drawing.Point(284, 80);
            this.txtDbPw.Name = "txtDbPw";
            this.txtDbPw.PasswordChar = '*';
            this.txtDbPw.Size = new System.Drawing.Size(121, 23);
            this.txtDbPw.TabIndex = 5;
            this.txtDbPw.TextChanged += new System.EventHandler(this.txt_TextChanged);
            // 
            // label4
            // 
            this.label4.AutoSize = true;
            this.label4.Location = new System.Drawing.Point(220, 83);
            this.label4.Name = "label4";
            this.label4.Size = new System.Drawing.Size(51, 15);
            this.label4.TabIndex = 18;
            this.label4.Text = "DB 암호";
            // 
            // gbProperty
            // 
            this.gbProperty.Controls.Add(this.txtServerAlias);
            this.gbProperty.Controls.Add(this.lblServerAlias);
            this.gbProperty.Controls.Add(this.txtSOPWebServerURL);
            this.gbProperty.Controls.Add(this.txtServerSiteID);
            this.gbProperty.Controls.Add(this.lblServerSiteID);
            this.gbProperty.Controls.Add(this.label12);
            this.gbProperty.Controls.Add(this.txtServerPort);
            this.gbProperty.Controls.Add(this.lblServerPort);
            this.gbProperty.Controls.Add(this.txtServerIP);
            this.gbProperty.Controls.Add(this.lblServerIP);
            this.gbProperty.Controls.Add(this.cbUse);
            this.gbProperty.Location = new System.Drawing.Point(235, 199);
            this.gbProperty.Name = "gbProperty";
            this.gbProperty.Size = new System.Drawing.Size(219, 270);
            this.gbProperty.TabIndex = 50;
            this.gbProperty.TabStop = false;
            this.gbProperty.Text = "groupBox1";
            // 
            // txtServerAlias
            // 
            this.txtServerAlias.Location = new System.Drawing.Point(75, 86);
            this.txtServerAlias.Name = "txtServerAlias";
            this.txtServerAlias.Size = new System.Drawing.Size(121, 23);
            this.txtServerAlias.TabIndex = 42;
            this.txtServerAlias.TextChanged += new System.EventHandler(this.txt_TextChanged);
            // 
            // lblServerAlias
            // 
            this.lblServerAlias.AutoSize = true;
            this.lblServerAlias.Location = new System.Drawing.Point(11, 89);
            this.lblServerAlias.Name = "lblServerAlias";
            this.lblServerAlias.Size = new System.Drawing.Size(55, 15);
            this.lblServerAlias.TabIndex = 43;
            this.lblServerAlias.Text = "서버별칭";
            // 
            // txtSOPWebServerURL
            // 
            this.txtSOPWebServerURL.Location = new System.Drawing.Point(11, 193);
            this.txtSOPWebServerURL.Name = "txtSOPWebServerURL";
            this.txtSOPWebServerURL.Size = new System.Drawing.Size(185, 23);
            this.txtSOPWebServerURL.TabIndex = 40;
            this.txtSOPWebServerURL.TextChanged += new System.EventHandler(this.txt_TextChanged);
            // 
            // txtServerSiteID
            // 
            this.txtServerSiteID.Location = new System.Drawing.Point(75, 57);
            this.txtServerSiteID.Name = "txtServerSiteID";
            this.txtServerSiteID.Size = new System.Drawing.Size(121, 23);
            this.txtServerSiteID.TabIndex = 6;
            this.txtServerSiteID.TextChanged += new System.EventHandler(this.txt_TextChanged);
            // 
            // lblServerSiteID
            // 
            this.lblServerSiteID.AutoSize = true;
            this.lblServerSiteID.Location = new System.Drawing.Point(11, 60);
            this.lblServerSiteID.Name = "lblServerSiteID";
            this.lblServerSiteID.Size = new System.Drawing.Size(41, 15);
            this.lblServerSiteID.TabIndex = 21;
            this.lblServerSiteID.Text = "Site id";
            // 
            // label12
            // 
            this.label12.AutoSize = true;
            this.label12.Location = new System.Drawing.Point(11, 175);
            this.label12.Name = "label12";
            this.label12.Size = new System.Drawing.Size(108, 15);
            this.label12.TabIndex = 41;
            this.label12.Text = "SOPWebServerURL";
            // 
            // txtServerPort
            // 
            this.txtServerPort.Location = new System.Drawing.Point(75, 143);
            this.txtServerPort.Name = "txtServerPort";
            this.txtServerPort.Size = new System.Drawing.Size(121, 23);
            this.txtServerPort.TabIndex = 31;
            this.txtServerPort.TextChanged += new System.EventHandler(this.txt_TextChanged);
            // 
            // lblServerPort
            // 
            this.lblServerPort.AutoSize = true;
            this.lblServerPort.Location = new System.Drawing.Point(11, 146);
            this.lblServerPort.Name = "lblServerPort";
            this.lblServerPort.Size = new System.Drawing.Size(29, 15);
            this.lblServerPort.TabIndex = 32;
            this.lblServerPort.Text = "Port";
            // 
            // txtServerIP
            // 
            this.txtServerIP.Location = new System.Drawing.Point(75, 114);
            this.txtServerIP.Name = "txtServerIP";
            this.txtServerIP.Size = new System.Drawing.Size(121, 23);
            this.txtServerIP.TabIndex = 28;
            this.txtServerIP.TextChanged += new System.EventHandler(this.txt_TextChanged);
            // 
            // lblServerIP
            // 
            this.lblServerIP.AutoSize = true;
            this.lblServerIP.Location = new System.Drawing.Point(11, 117);
            this.lblServerIP.Name = "lblServerIP";
            this.lblServerIP.Size = new System.Drawing.Size(17, 15);
            this.lblServerIP.TabIndex = 29;
            this.lblServerIP.Text = "IP";
            // 
            // cbUse
            // 
            this.cbUse.AutoSize = true;
            this.cbUse.Location = new System.Drawing.Point(18, 32);
            this.cbUse.Name = "cbUse";
            this.cbUse.Size = new System.Drawing.Size(74, 19);
            this.cbUse.TabIndex = 0;
            this.cbUse.Text = "사용여부";
            this.cbUse.UseVisualStyleBackColor = true;
            this.cbUse.CheckedChanged += new System.EventHandler(this.cbUse_CheckedChanged);
            // 
            // btnSave
            // 
            this.btnSave.Location = new System.Drawing.Point(696, 487);
            this.btnSave.Name = "btnSave";
            this.btnSave.Size = new System.Drawing.Size(75, 23);
            this.btnSave.TabIndex = 51;
            this.btnSave.Text = "설정저장";
            this.btnSave.UseVisualStyleBackColor = true;
            this.btnSave.Click += new System.EventHandler(this.btnSave_Click);
            // 
            // dataGridView1
            // 
            this.dataGridView1.AutoSizeColumnsMode = System.Windows.Forms.DataGridViewAutoSizeColumnsMode.Fill;
            dataGridViewCellStyle5.Alignment = System.Windows.Forms.DataGridViewContentAlignment.MiddleCenter;
            dataGridViewCellStyle5.BackColor = System.Drawing.SystemColors.Control;
            dataGridViewCellStyle5.Font = new System.Drawing.Font("맑은 고딕", 9F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point);
            dataGridViewCellStyle5.ForeColor = System.Drawing.SystemColors.WindowText;
            dataGridViewCellStyle5.SelectionBackColor = System.Drawing.SystemColors.Highlight;
            dataGridViewCellStyle5.SelectionForeColor = System.Drawing.SystemColors.HighlightText;
            dataGridViewCellStyle5.WrapMode = System.Windows.Forms.DataGridViewTriState.True;
            this.dataGridView1.ColumnHeadersDefaultCellStyle = dataGridViewCellStyle5;
            this.dataGridView1.ColumnHeadersHeightSizeMode = System.Windows.Forms.DataGridViewColumnHeadersHeightSizeMode.AutoSize;
            this.dataGridView1.Columns.AddRange(new System.Windows.Forms.DataGridViewColumn[] {
            this.colSeqNo,
            this.colServerTypeID,
            this.colServerType});
            this.dataGridView1.Location = new System.Drawing.Point(3, 41);
            this.dataGridView1.Name = "dataGridView1";
            this.dataGridView1.RowHeadersBorderStyle = System.Windows.Forms.DataGridViewHeaderBorderStyle.None;
            dataGridViewCellStyle6.Alignment = System.Windows.Forms.DataGridViewContentAlignment.MiddleCenter;
            dataGridViewCellStyle6.BackColor = System.Drawing.SystemColors.Control;
            dataGridViewCellStyle6.Font = new System.Drawing.Font("맑은 고딕", 9F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point);
            dataGridViewCellStyle6.ForeColor = System.Drawing.SystemColors.WindowText;
            dataGridViewCellStyle6.SelectionBackColor = System.Drawing.SystemColors.Highlight;
            dataGridViewCellStyle6.SelectionForeColor = System.Drawing.SystemColors.HighlightText;
            dataGridViewCellStyle6.WrapMode = System.Windows.Forms.DataGridViewTriState.True;
            this.dataGridView1.RowHeadersDefaultCellStyle = dataGridViewCellStyle6;
            this.dataGridView1.RowHeadersVisible = false;
            this.dataGridView1.RowTemplate.Height = 25;
            this.dataGridView1.SelectionMode = System.Windows.Forms.DataGridViewSelectionMode.FullRowSelect;
            this.dataGridView1.Size = new System.Drawing.Size(217, 390);
            this.dataGridView1.TabIndex = 52;
            // 
            // colSeqNo
            // 
            this.colSeqNo.FillWeight = 90.63071F;
            this.colSeqNo.HeaderText = "SeqNo";
            this.colSeqNo.Name = "colSeqNo";
            this.colSeqNo.ReadOnly = true;
            // 
            // colServerTypeID
            // 
            this.colServerTypeID.FillWeight = 76.14214F;
            this.colServerTypeID.HeaderText = "서버ID";
            this.colServerTypeID.Name = "colServerTypeID";
            this.colServerTypeID.ReadOnly = true;
            // 
            // colServerType
            // 
            this.colServerType.FillWeight = 133.2271F;
            this.colServerType.HeaderText = "서버종류";
            this.colServerType.Name = "colServerType";
            // 
            // FormMain
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(7F, 15F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(800, 526);
            this.Controls.Add(this.dataGridView1);
            this.Controls.Add(this.gbProperty);
            this.Controls.Add(this.btnSave);
            this.Controls.Add(this.groupBox2);
            this.Controls.Add(this.txtLogPath);
            this.Controls.Add(this.label5);
            this.Controls.Add(this.btnDeleteServer);
            this.Controls.Add(this.btnServer);
            this.Name = "FormMain";
            this.Text = "통합서버";
            this.FormClosing += new System.Windows.Forms.FormClosingEventHandler(this.FormMain_FormClosing);
            this.Load += new System.EventHandler(this.FormMain_Load);
            this.groupBox2.ResumeLayout(false);
            this.groupBox2.PerformLayout();
            this.gbProperty.ResumeLayout(false);
            this.gbProperty.PerformLayout();
            ((System.ComponentModel.ISupportInitialize)(this.dataGridView1)).EndInit();
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion
        private System.Windows.Forms.Button btnServer;
        private System.Windows.Forms.TextBox txtLogPath;
        private System.Windows.Forms.Label label5;
        private System.Windows.Forms.Button btnDeleteServer;
        private System.Windows.Forms.ComboBox cbDbType;
        private System.Windows.Forms.TextBox txtDbName;
        private System.Windows.Forms.Label label3;
        private System.Windows.Forms.Label label2;
        private System.Windows.Forms.TextBox txtDbIP;
        private System.Windows.Forms.Label label1;
        private System.Windows.Forms.GroupBox groupBox2;
        private System.Windows.Forms.Label label6;
        private System.Windows.Forms.TextBox txtSOPWebServerFrontURL;
        private System.Windows.Forms.TextBox txtDbID;
        private System.Windows.Forms.Label label13;
        private System.Windows.Forms.Button btnSearch;
        private System.Windows.Forms.TextBox txtDbPw;
        private System.Windows.Forms.Label label4;
        private System.Windows.Forms.GroupBox gbProperty;
        private System.Windows.Forms.TextBox txtServerAlias;
        private System.Windows.Forms.Label lblServerAlias;
        private System.Windows.Forms.TextBox txtSOPWebServerURL;
        private System.Windows.Forms.TextBox txtServerSiteID;
        private System.Windows.Forms.Label lblServerSiteID;
        private System.Windows.Forms.Label label12;
        private System.Windows.Forms.TextBox txtServerPort;
        private System.Windows.Forms.Label lblServerPort;
        private System.Windows.Forms.TextBox txtServerIP;
        private System.Windows.Forms.Label lblServerIP;
        private System.Windows.Forms.CheckBox cbUse;
        private System.Windows.Forms.Button btnSave;
        private System.Windows.Forms.DataGridView dataGridView1;
        private System.Windows.Forms.DataGridViewTextBoxColumn colSeqNo;
        private System.Windows.Forms.DataGridViewTextBoxColumn colServerTypeID;
        private System.Windows.Forms.DataGridViewComboBoxColumn colServerType;
    }
}

