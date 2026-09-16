
namespace Sop7ToSop8
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
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(FormMain));
            this.label1 = new System.Windows.Forms.Label();
            this.textBoxSop7DbName = new System.Windows.Forms.TextBox();
            this.label2 = new System.Windows.Forms.Label();
            this.textBoxSop8DbName = new System.Windows.Forms.TextBox();
            this.textBox1 = new System.Windows.Forms.TextBox();
            this.btnBegin = new System.Windows.Forms.Button();
            this.label3 = new System.Windows.Forms.Label();
            this.textBoxSiteNo = new System.Windows.Forms.TextBox();
            this.textBoxStatus = new System.Windows.Forms.TextBox();
            this.SuspendLayout();
            // 
            // label1
            // 
            this.label1.AutoSize = true;
            this.label1.Location = new System.Drawing.Point(36, 31);
            this.label1.Name = "label1";
            this.label1.Size = new System.Drawing.Size(62, 15);
            this.label1.TabIndex = 0;
            this.label1.Text = "Sop7 DB :";
            // 
            // textBoxSop7DbName
            // 
            this.textBoxSop7DbName.Location = new System.Drawing.Point(103, 28);
            this.textBoxSop7DbName.Name = "textBoxSop7DbName";
            this.textBoxSop7DbName.Size = new System.Drawing.Size(100, 23);
            this.textBoxSop7DbName.TabIndex = 1;
            // 
            // label2
            // 
            this.label2.AutoSize = true;
            this.label2.Location = new System.Drawing.Point(36, 60);
            this.label2.Name = "label2";
            this.label2.Size = new System.Drawing.Size(62, 15);
            this.label2.TabIndex = 0;
            this.label2.Text = "Sop8 DB :";
            // 
            // textBoxSop8DbName
            // 
            this.textBoxSop8DbName.Location = new System.Drawing.Point(103, 57);
            this.textBoxSop8DbName.Name = "textBoxSop8DbName";
            this.textBoxSop8DbName.Size = new System.Drawing.Size(100, 23);
            this.textBoxSop8DbName.TabIndex = 1;
            // 
            // textBox1
            // 
            this.textBox1.Location = new System.Drawing.Point(487, 28);
            this.textBox1.Multiline = true;
            this.textBox1.Name = "textBox1";
            this.textBox1.ReadOnly = true;
            this.textBox1.Size = new System.Drawing.Size(301, 410);
            this.textBox1.TabIndex = 2;
            this.textBox1.Text = resources.GetString("textBox1.Text");
            // 
            // btnBegin
            // 
            this.btnBegin.Enabled = false;
            this.btnBegin.Location = new System.Drawing.Point(128, 106);
            this.btnBegin.Name = "btnBegin";
            this.btnBegin.Size = new System.Drawing.Size(75, 23);
            this.btnBegin.TabIndex = 4;
            this.btnBegin.Text = "시작";
            this.btnBegin.UseVisualStyleBackColor = true;
            this.btnBegin.Click += new System.EventHandler(this.btnBegin_Click);
            // 
            // label3
            // 
            this.label3.AutoSize = true;
            this.label3.Location = new System.Drawing.Point(225, 60);
            this.label3.Name = "label3";
            this.label3.Size = new System.Drawing.Size(86, 15);
            this.label3.TabIndex = 0;
            this.label3.Text = "Sop8 Site No :";
            // 
            // textBoxSiteNo
            // 
            this.textBoxSiteNo.Location = new System.Drawing.Point(313, 57);
            this.textBoxSiteNo.Name = "textBoxSiteNo";
            this.textBoxSiteNo.Size = new System.Drawing.Size(100, 23);
            this.textBoxSiteNo.TabIndex = 1;
            // 
            // textBoxStatus
            // 
            this.textBoxStatus.Location = new System.Drawing.Point(36, 193);
            this.textBoxStatus.Multiline = true;
            this.textBoxStatus.Name = "textBoxStatus";
            this.textBoxStatus.ReadOnly = true;
            this.textBoxStatus.Size = new System.Drawing.Size(377, 245);
            this.textBoxStatus.TabIndex = 5;
            this.textBoxStatus.Text = "co_code, co_code_cl, co_site, fa_sensor_sub_ty는 데이터가 미리 채워져 있어야 한다.";
            // 
            // FormMain
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(7F, 15F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(800, 450);
            this.Controls.Add(this.textBoxStatus);
            this.Controls.Add(this.btnBegin);
            this.Controls.Add(this.textBox1);
            this.Controls.Add(this.textBoxSiteNo);
            this.Controls.Add(this.label3);
            this.Controls.Add(this.textBoxSop8DbName);
            this.Controls.Add(this.label2);
            this.Controls.Add(this.textBoxSop7DbName);
            this.Controls.Add(this.label1);
            this.Name = "FormMain";
            this.Text = "Migration to Sop8";
            this.FormClosing += new System.Windows.Forms.FormClosingEventHandler(this.FormMain_FormClosing);
            this.Load += new System.EventHandler(this.FormMain_Load);
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.Label label1;
        private System.Windows.Forms.TextBox textBoxSop7DbName;
        private System.Windows.Forms.Label label2;
        private System.Windows.Forms.TextBox textBoxSop8DbName;
        private System.Windows.Forms.TextBox textBox1;
        private System.Windows.Forms.Button btnBegin;
        private System.Windows.Forms.Label label3;
        private System.Windows.Forms.TextBox textBoxSiteNo;
        private System.Windows.Forms.TextBox textBoxStatus;
    }
}

