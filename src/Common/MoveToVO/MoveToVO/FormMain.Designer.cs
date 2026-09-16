
namespace MoveToVO
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
            this.label1 = new System.Windows.Forms.Label();
            this.textBoxModelRootFolder = new System.Windows.Forms.TextBox();
            this.btnModelRootFolder = new System.Windows.Forms.Button();
            this.label2 = new System.Windows.Forms.Label();
            this.textBoxVORootFolder = new System.Windows.Forms.TextBox();
            this.btnVORootFolder = new System.Windows.Forms.Button();
            this.label3 = new System.Windows.Forms.Label();
            this.textBoxDAORootFolder = new System.Windows.Forms.TextBox();
            this.btnDAORootFolder = new System.Windows.Forms.Button();
            this.label4 = new System.Windows.Forms.Label();
            this.textBoxMapperRootFolder = new System.Windows.Forms.TextBox();
            this.btnMapperRootFolder = new System.Windows.Forms.Button();
            this.btnRun = new System.Windows.Forms.Button();
            this.SuspendLayout();
            // 
            // label1
            // 
            this.label1.AutoSize = true;
            this.label1.Location = new System.Drawing.Point(29, 26);
            this.label1.Name = "label1";
            this.label1.Size = new System.Drawing.Size(114, 15);
            this.label1.TabIndex = 0;
            this.label1.Text = "Model Root Folder :";
            // 
            // textBoxModelRootFolder
            // 
            this.textBoxModelRootFolder.Location = new System.Drawing.Point(149, 23);
            this.textBoxModelRootFolder.Name = "textBoxModelRootFolder";
            this.textBoxModelRootFolder.Size = new System.Drawing.Size(256, 23);
            this.textBoxModelRootFolder.TabIndex = 1;
            // 
            // btnModelRootFolder
            // 
            this.btnModelRootFolder.Location = new System.Drawing.Point(411, 23);
            this.btnModelRootFolder.Name = "btnModelRootFolder";
            this.btnModelRootFolder.Size = new System.Drawing.Size(32, 23);
            this.btnModelRootFolder.TabIndex = 2;
            this.btnModelRootFolder.Text = "...";
            this.btnModelRootFolder.UseVisualStyleBackColor = true;
            this.btnModelRootFolder.Click += new System.EventHandler(this.btnModelRootFolder_Click);
            // 
            // label2
            // 
            this.label2.AutoSize = true;
            this.label2.Location = new System.Drawing.Point(29, 55);
            this.label2.Name = "label2";
            this.label2.Size = new System.Drawing.Size(97, 15);
            this.label2.TabIndex = 0;
            this.label2.Text = "VO Root Folder :";
            // 
            // textBoxVORootFolder
            // 
            this.textBoxVORootFolder.Location = new System.Drawing.Point(149, 52);
            this.textBoxVORootFolder.Name = "textBoxVORootFolder";
            this.textBoxVORootFolder.Size = new System.Drawing.Size(256, 23);
            this.textBoxVORootFolder.TabIndex = 1;
            // 
            // btnVORootFolder
            // 
            this.btnVORootFolder.Location = new System.Drawing.Point(411, 52);
            this.btnVORootFolder.Name = "btnVORootFolder";
            this.btnVORootFolder.Size = new System.Drawing.Size(32, 23);
            this.btnVORootFolder.TabIndex = 2;
            this.btnVORootFolder.Text = "...";
            this.btnVORootFolder.UseVisualStyleBackColor = true;
            this.btnVORootFolder.Click += new System.EventHandler(this.btnVORootFolder_Click);
            // 
            // label3
            // 
            this.label3.AutoSize = true;
            this.label3.Location = new System.Drawing.Point(29, 84);
            this.label3.Name = "label3";
            this.label3.Size = new System.Drawing.Size(106, 15);
            this.label3.TabIndex = 0;
            this.label3.Text = "DAO Root Folder :";
            // 
            // textBoxDAORootFolder
            // 
            this.textBoxDAORootFolder.Location = new System.Drawing.Point(149, 81);
            this.textBoxDAORootFolder.Name = "textBoxDAORootFolder";
            this.textBoxDAORootFolder.Size = new System.Drawing.Size(256, 23);
            this.textBoxDAORootFolder.TabIndex = 1;
            // 
            // btnDAORootFolder
            // 
            this.btnDAORootFolder.Location = new System.Drawing.Point(411, 81);
            this.btnDAORootFolder.Name = "btnDAORootFolder";
            this.btnDAORootFolder.Size = new System.Drawing.Size(32, 23);
            this.btnDAORootFolder.TabIndex = 2;
            this.btnDAORootFolder.Text = "...";
            this.btnDAORootFolder.UseVisualStyleBackColor = true;
            this.btnDAORootFolder.Click += new System.EventHandler(this.btnDAORootFolder_Click);
            // 
            // label4
            // 
            this.label4.AutoSize = true;
            this.label4.Location = new System.Drawing.Point(29, 113);
            this.label4.Name = "label4";
            this.label4.Size = new System.Drawing.Size(121, 15);
            this.label4.TabIndex = 0;
            this.label4.Text = "Mapper Root Folder :";
            // 
            // textBoxMapperRootFolder
            // 
            this.textBoxMapperRootFolder.Location = new System.Drawing.Point(149, 110);
            this.textBoxMapperRootFolder.Name = "textBoxMapperRootFolder";
            this.textBoxMapperRootFolder.Size = new System.Drawing.Size(256, 23);
            this.textBoxMapperRootFolder.TabIndex = 1;
            // 
            // btnMapperRootFolder
            // 
            this.btnMapperRootFolder.Location = new System.Drawing.Point(411, 110);
            this.btnMapperRootFolder.Name = "btnMapperRootFolder";
            this.btnMapperRootFolder.Size = new System.Drawing.Size(32, 23);
            this.btnMapperRootFolder.TabIndex = 2;
            this.btnMapperRootFolder.Text = "...";
            this.btnMapperRootFolder.UseVisualStyleBackColor = true;
            this.btnMapperRootFolder.Click += new System.EventHandler(this.btnMapperRootFolder_Click);
            // 
            // btnRun
            // 
            this.btnRun.Location = new System.Drawing.Point(392, 145);
            this.btnRun.Name = "btnRun";
            this.btnRun.Size = new System.Drawing.Size(51, 23);
            this.btnRun.TabIndex = 3;
            this.btnRun.Text = "변환";
            this.btnRun.UseVisualStyleBackColor = true;
            this.btnRun.Click += new System.EventHandler(this.btnRun_Click);
            // 
            // FormMain
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(7F, 15F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(464, 184);
            this.Controls.Add(this.btnRun);
            this.Controls.Add(this.btnMapperRootFolder);
            this.Controls.Add(this.btnDAORootFolder);
            this.Controls.Add(this.btnVORootFolder);
            this.Controls.Add(this.btnModelRootFolder);
            this.Controls.Add(this.textBoxMapperRootFolder);
            this.Controls.Add(this.label4);
            this.Controls.Add(this.textBoxDAORootFolder);
            this.Controls.Add(this.label3);
            this.Controls.Add(this.textBoxVORootFolder);
            this.Controls.Add(this.label2);
            this.Controls.Add(this.textBoxModelRootFolder);
            this.Controls.Add(this.label1);
            this.FormBorderStyle = System.Windows.Forms.FormBorderStyle.FixedToolWindow;
            this.Name = "FormMain";
            this.Text = "Model to VO";
            this.FormClosing += new System.Windows.Forms.FormClosingEventHandler(this.FormMain_FormClosing);
            this.Load += new System.EventHandler(this.FormMain_Load);
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.Label label1;
        private System.Windows.Forms.TextBox textBoxModelRootFolder;
        private System.Windows.Forms.Button btnModelRootFolder;
        private System.Windows.Forms.Label label2;
        private System.Windows.Forms.TextBox textBoxVORootFolder;
        private System.Windows.Forms.Button btnVORootFolder;
        private System.Windows.Forms.Label label3;
        private System.Windows.Forms.TextBox textBoxDAORootFolder;
        private System.Windows.Forms.Button btnDAORootFolder;
        private System.Windows.Forms.Label label4;
        private System.Windows.Forms.TextBox textBoxMapperRootFolder;
        private System.Windows.Forms.Button btnMapperRootFolder;
        private System.Windows.Forms.Button btnRun;
    }
}

