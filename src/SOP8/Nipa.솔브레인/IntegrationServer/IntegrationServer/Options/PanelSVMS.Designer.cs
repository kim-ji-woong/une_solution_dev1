
namespace IntegrationServer.Options
{
    partial class PanelSVMS
    {
        /// <summary> 
        /// 필수 디자이너 변수입니다.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary> 
        /// 사용 중인 모든 리소스를 정리합니다.
        /// </summary>
        /// <param name="disposing">관리되는 리소스를 삭제해야 하면 true이고, 그렇지 않으면 false입니다.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region 구성 요소 디자이너에서 생성한 코드

        /// <summary> 
        /// 디자이너 지원에 필요한 메서드입니다. 
        /// 이 메서드의 내용을 코드 편집기로 수정하지 마세요.
        /// </summary>
        private void InitializeComponent()
        {
            this.gbPropertySvms = new System.Windows.Forms.GroupBox();
            this.txtCctvConfig = new System.Windows.Forms.TextBox();
            this.txtRunRtspServer = new System.Windows.Forms.TextBox();
            this.txtRtspServerName = new System.Windows.Forms.TextBox();
            this.label8 = new System.Windows.Forms.Label();
            this.label6 = new System.Windows.Forms.Label();
            this.label5 = new System.Windows.Forms.Label();
            this.label16 = new System.Windows.Forms.Label();
            this.label14 = new System.Windows.Forms.Label();
            this.txtSvmsPort = new System.Windows.Forms.TextBox();
            this.txtSvmsIP = new System.Windows.Forms.TextBox();
            this.label15 = new System.Windows.Forms.Label();
            this.label11 = new System.Windows.Forms.Label();
            this.txtSvmsPw = new System.Windows.Forms.TextBox();
            this.txtSvmsID = new System.Windows.Forms.TextBox();
            this.label10 = new System.Windows.Forms.Label();
            this.gbPropertySvms.SuspendLayout();
            this.SuspendLayout();
            // 
            // gbPropertySvms
            // 
            this.gbPropertySvms.Controls.Add(this.txtCctvConfig);
            this.gbPropertySvms.Controls.Add(this.txtRunRtspServer);
            this.gbPropertySvms.Controls.Add(this.txtRtspServerName);
            this.gbPropertySvms.Controls.Add(this.label8);
            this.gbPropertySvms.Controls.Add(this.label6);
            this.gbPropertySvms.Controls.Add(this.label5);
            this.gbPropertySvms.Controls.Add(this.label16);
            this.gbPropertySvms.Controls.Add(this.label14);
            this.gbPropertySvms.Controls.Add(this.txtSvmsPort);
            this.gbPropertySvms.Controls.Add(this.txtSvmsIP);
            this.gbPropertySvms.Controls.Add(this.label15);
            this.gbPropertySvms.Controls.Add(this.label11);
            this.gbPropertySvms.Controls.Add(this.txtSvmsPw);
            this.gbPropertySvms.Controls.Add(this.txtSvmsID);
            this.gbPropertySvms.Controls.Add(this.label10);
            this.gbPropertySvms.Location = new System.Drawing.Point(0, 0);
            this.gbPropertySvms.Name = "gbPropertySvms";
            this.gbPropertySvms.Size = new System.Drawing.Size(721, 265);
            this.gbPropertySvms.TabIndex = 40;
            this.gbPropertySvms.TabStop = false;
            this.gbPropertySvms.Text = "S1-SVMS";
            // 
            // txtCctvConfig
            // 
            this.txtCctvConfig.Location = new System.Drawing.Point(438, 83);
            this.txtCctvConfig.Name = "txtCctvConfig";
            this.txtCctvConfig.Size = new System.Drawing.Size(268, 23);
            this.txtCctvConfig.TabIndex = 52;
            this.txtCctvConfig.TextChanged += new System.EventHandler(this.OnTextChanged);
            // 
            // txtRunRtspServer
            // 
            this.txtRunRtspServer.Location = new System.Drawing.Point(438, 54);
            this.txtRunRtspServer.Name = "txtRunRtspServer";
            this.txtRunRtspServer.Size = new System.Drawing.Size(268, 23);
            this.txtRunRtspServer.TabIndex = 51;
            this.txtRunRtspServer.TextChanged += new System.EventHandler(this.OnTextChanged);
            // 
            // txtRtspServerName
            // 
            this.txtRtspServerName.Location = new System.Drawing.Point(438, 25);
            this.txtRtspServerName.Name = "txtRtspServerName";
            this.txtRtspServerName.Size = new System.Drawing.Size(268, 23);
            this.txtRtspServerName.TabIndex = 50;
            this.txtRtspServerName.TextChanged += new System.EventHandler(this.OnTextChanged);
            // 
            // label8
            // 
            this.label8.AutoSize = true;
            this.label8.Location = new System.Drawing.Point(360, 87);
            this.label8.Name = "label8";
            this.label8.Size = new System.Drawing.Size(73, 15);
            this.label8.TabIndex = 49;
            this.label8.Text = "CCTVConfig";
            // 
            // label6
            // 
            this.label6.AutoSize = true;
            this.label6.Location = new System.Drawing.Point(345, 54);
            this.label6.Name = "label6";
            this.label6.Size = new System.Drawing.Size(88, 15);
            this.label6.TabIndex = 48;
            this.label6.Text = "RunRTSPServer";
            // 
            // label5
            // 
            this.label5.AutoSize = true;
            this.label5.Location = new System.Drawing.Point(334, 25);
            this.label5.Name = "label5";
            this.label5.Size = new System.Drawing.Size(99, 15);
            this.label5.TabIndex = 47;
            this.label5.Text = "RTSPServerName";
            // 
            // label16
            // 
            this.label16.Location = new System.Drawing.Point(13, 135);
            this.label16.Name = "label16";
            this.label16.Size = new System.Drawing.Size(309, 97);
            this.label16.TabIndex = 46;
            this.label16.Text = "ex)\r\nsvmsIP=\"172.30.10.10/192.1.16.200\"\r\nport=\"8020/8020\"\r\nid=\"idms00/idms00\"\r\npw" +
    "=\"iccard@2009/root@passwd1!\"";
            // 
            // label14
            // 
            this.label14.AutoSize = true;
            this.label14.Location = new System.Drawing.Point(13, 54);
            this.label14.Name = "label14";
            this.label14.Size = new System.Drawing.Size(29, 15);
            this.label14.TabIndex = 45;
            this.label14.Text = "Port";
            // 
            // txtSvmsPort
            // 
            this.txtSvmsPort.Location = new System.Drawing.Point(57, 51);
            this.txtSvmsPort.Name = "txtSvmsPort";
            this.txtSvmsPort.Size = new System.Drawing.Size(268, 23);
            this.txtSvmsPort.TabIndex = 44;
            this.txtSvmsPort.TextChanged += new System.EventHandler(this.OnTextChanged);
            // 
            // txtSvmsIP
            // 
            this.txtSvmsIP.Location = new System.Drawing.Point(57, 22);
            this.txtSvmsIP.Name = "txtSvmsIP";
            this.txtSvmsIP.Size = new System.Drawing.Size(268, 23);
            this.txtSvmsIP.TabIndex = 43;
            this.txtSvmsIP.TextChanged += new System.EventHandler(this.OnTextChanged);
            // 
            // label15
            // 
            this.label15.AutoSize = true;
            this.label15.Location = new System.Drawing.Point(13, 25);
            this.label15.Name = "label15";
            this.label15.Size = new System.Drawing.Size(17, 15);
            this.label15.TabIndex = 42;
            this.label15.Text = "IP";
            // 
            // label11
            // 
            this.label11.AutoSize = true;
            this.label11.Location = new System.Drawing.Point(13, 112);
            this.label11.Name = "label11";
            this.label11.Size = new System.Drawing.Size(25, 15);
            this.label11.TabIndex = 41;
            this.label11.Text = "PW";
            // 
            // txtSvmsPw
            // 
            this.txtSvmsPw.Location = new System.Drawing.Point(57, 109);
            this.txtSvmsPw.Name = "txtSvmsPw";
            this.txtSvmsPw.Size = new System.Drawing.Size(268, 23);
            this.txtSvmsPw.TabIndex = 40;
            this.txtSvmsPw.TextChanged += new System.EventHandler(this.OnTextChanged);
            // 
            // txtSvmsID
            // 
            this.txtSvmsID.Location = new System.Drawing.Point(57, 80);
            this.txtSvmsID.Name = "txtSvmsID";
            this.txtSvmsID.Size = new System.Drawing.Size(268, 23);
            this.txtSvmsID.TabIndex = 39;
            this.txtSvmsID.TextChanged += new System.EventHandler(this.OnTextChanged);
            // 
            // label10
            // 
            this.label10.AutoSize = true;
            this.label10.Location = new System.Drawing.Point(13, 83);
            this.label10.Name = "label10";
            this.label10.Size = new System.Drawing.Size(19, 15);
            this.label10.TabIndex = 38;
            this.label10.Text = "ID";
            // 
            // PanelSVMS
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(7F, 15F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.Controls.Add(this.gbPropertySvms);
            this.Name = "PanelSVMS";
            this.Size = new System.Drawing.Size(721, 265);
            this.gbPropertySvms.ResumeLayout(false);
            this.gbPropertySvms.PerformLayout();
            this.ResumeLayout(false);

        }

        #endregion

        private System.Windows.Forms.GroupBox gbPropertySvms;
        private System.Windows.Forms.TextBox txtCctvConfig;
        private System.Windows.Forms.TextBox txtRunRtspServer;
        private System.Windows.Forms.TextBox txtRtspServerName;
        private System.Windows.Forms.Label label8;
        private System.Windows.Forms.Label label6;
        private System.Windows.Forms.Label label5;
        private System.Windows.Forms.Label label16;
        private System.Windows.Forms.Label label14;
        private System.Windows.Forms.TextBox txtSvmsPort;
        private System.Windows.Forms.TextBox txtSvmsIP;
        private System.Windows.Forms.Label label15;
        private System.Windows.Forms.Label label11;
        private System.Windows.Forms.TextBox txtSvmsPw;
        private System.Windows.Forms.TextBox txtSvmsID;
        private System.Windows.Forms.Label label10;
    }
}
