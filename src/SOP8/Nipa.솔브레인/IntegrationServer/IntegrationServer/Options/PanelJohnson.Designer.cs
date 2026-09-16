
namespace IntegrationServer.Options
{
    partial class PanelJohnson
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
            this.gbPropertyJohnson = new System.Windows.Forms.GroupBox();
            this.label7 = new System.Windows.Forms.Label();
            this.rbMux1 = new System.Windows.Forms.RadioButton();
            this.rbMux2 = new System.Windows.Forms.RadioButton();
            this.gbPropertyJohnson.SuspendLayout();
            this.SuspendLayout();
            // 
            // gbPropertyJohnson
            // 
            this.gbPropertyJohnson.Controls.Add(this.label7);
            this.gbPropertyJohnson.Controls.Add(this.rbMux1);
            this.gbPropertyJohnson.Controls.Add(this.rbMux2);
            this.gbPropertyJohnson.Location = new System.Drawing.Point(0, 0);
            this.gbPropertyJohnson.Name = "gbPropertyJohnson";
            this.gbPropertyJohnson.Size = new System.Drawing.Size(278, 53);
            this.gbPropertyJohnson.TabIndex = 36;
            this.gbPropertyJohnson.TabStop = false;
            this.gbPropertyJohnson.Text = "동방";
            // 
            // label7
            // 
            this.label7.AutoSize = true;
            this.label7.Location = new System.Drawing.Point(8, 24);
            this.label7.Name = "label7";
            this.label7.Size = new System.Drawing.Size(56, 15);
            this.label7.TabIndex = 37;
            this.label7.Text = "MuxType";
            // 
            // rbMux1
            // 
            this.rbMux1.AutoSize = true;
            this.rbMux1.Location = new System.Drawing.Point(99, 22);
            this.rbMux1.Name = "rbMux1";
            this.rbMux1.Size = new System.Drawing.Size(65, 19);
            this.rbMux1.TabIndex = 33;
            this.rbMux1.TabStop = true;
            this.rbMux1.Text = "NMux1";
            this.rbMux1.UseVisualStyleBackColor = true;
            this.rbMux1.CheckedChanged += new System.EventHandler(this.rb_CheckedChanged);
            // 
            // rbMux2
            // 
            this.rbMux2.AutoSize = true;
            this.rbMux2.Location = new System.Drawing.Point(170, 22);
            this.rbMux2.Name = "rbMux2";
            this.rbMux2.Size = new System.Drawing.Size(65, 19);
            this.rbMux2.TabIndex = 34;
            this.rbMux2.TabStop = true;
            this.rbMux2.Text = "NMux2";
            this.rbMux2.UseVisualStyleBackColor = true;
            this.rbMux2.CheckedChanged += new System.EventHandler(this.rb_CheckedChanged);
            // 
            // PanelJohnsonControl
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(7F, 15F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.Controls.Add(this.gbPropertyJohnson);
            this.Name = "PanelJohnsonControl";
            this.Size = new System.Drawing.Size(278, 53);
            this.gbPropertyJohnson.ResumeLayout(false);
            this.gbPropertyJohnson.PerformLayout();
            this.ResumeLayout(false);

        }

        #endregion

        private System.Windows.Forms.GroupBox gbPropertyJohnson;
        private System.Windows.Forms.Label label7;
        private System.Windows.Forms.RadioButton rbMux1;
        private System.Windows.Forms.RadioButton rbMux2;
    }
}
