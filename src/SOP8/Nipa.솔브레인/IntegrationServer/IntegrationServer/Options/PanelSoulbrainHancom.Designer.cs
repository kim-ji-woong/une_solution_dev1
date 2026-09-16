
namespace IntegrationServer.Options
{
    partial class PanelSoulbrainHancom
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
            this.txtSoulURL = new System.Windows.Forms.TextBox();
            this.label15 = new System.Windows.Forms.Label();
            this.label11 = new System.Windows.Forms.Label();
            this.txtSoulPW = new System.Windows.Forms.TextBox();
            this.txtSoulID = new System.Windows.Forms.TextBox();
            this.label10 = new System.Windows.Forms.Label();
            this.SuspendLayout();
            // 
            // txtSoulURL
            // 
            this.txtSoulURL.Location = new System.Drawing.Point(59, 15);
            this.txtSoulURL.Name = "txtSoulURL";
            this.txtSoulURL.Size = new System.Drawing.Size(268, 23);
            this.txtSoulURL.TabIndex = 49;
            this.txtSoulURL.TextChanged += new System.EventHandler(this.OnTextChanged);
            // 
            // label15
            // 
            this.label15.AutoSize = true;
            this.label15.Location = new System.Drawing.Point(15, 18);
            this.label15.Name = "label15";
            this.label15.Size = new System.Drawing.Size(28, 15);
            this.label15.TabIndex = 48;
            this.label15.Text = "URL";
            // 
            // label11
            // 
            this.label11.AutoSize = true;
            this.label11.Location = new System.Drawing.Point(15, 76);
            this.label11.Name = "label11";
            this.label11.Size = new System.Drawing.Size(25, 15);
            this.label11.TabIndex = 47;
            this.label11.Text = "PW";
            // 
            // txtSoulPW
            // 
            this.txtSoulPW.Location = new System.Drawing.Point(59, 73);
            this.txtSoulPW.Name = "txtSoulPW";
            this.txtSoulPW.Size = new System.Drawing.Size(268, 23);
            this.txtSoulPW.TabIndex = 46;
            this.txtSoulPW.TextChanged += new System.EventHandler(this.OnTextChanged);
            // 
            // txtSoulID
            // 
            this.txtSoulID.Location = new System.Drawing.Point(59, 44);
            this.txtSoulID.Name = "txtSoulID";
            this.txtSoulID.Size = new System.Drawing.Size(268, 23);
            this.txtSoulID.TabIndex = 45;
            this.txtSoulID.TextChanged += new System.EventHandler(this.OnTextChanged);
            // 
            // label10
            // 
            this.label10.AutoSize = true;
            this.label10.Location = new System.Drawing.Point(15, 47);
            this.label10.Name = "label10";
            this.label10.Size = new System.Drawing.Size(19, 15);
            this.label10.TabIndex = 44;
            this.label10.Text = "ID";
            // 
            // PanelSoulbrainHancom
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(7F, 15F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.Controls.Add(this.txtSoulURL);
            this.Controls.Add(this.label15);
            this.Controls.Add(this.label11);
            this.Controls.Add(this.txtSoulPW);
            this.Controls.Add(this.txtSoulID);
            this.Controls.Add(this.label10);
            this.Name = "PanelSoulbrainHancom";
            this.Size = new System.Drawing.Size(355, 120);
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.TextBox txtSoulURL;
        private System.Windows.Forms.Label label15;
        private System.Windows.Forms.Label label11;
        private System.Windows.Forms.TextBox txtSoulPW;
        private System.Windows.Forms.TextBox txtSoulID;
        private System.Windows.Forms.Label label10;
    }
}
