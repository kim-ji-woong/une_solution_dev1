
namespace dnsDapperSample
{
    partial class Form1
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
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(Form1));
            this.btnSite = new System.Windows.Forms.Button();
            this.txtHost = new System.Windows.Forms.TextBox();
            this.txtDbId = new System.Windows.Forms.TextBox();
            this.txtDbPw = new System.Windows.Forms.TextBox();
            this.txtDbName = new System.Windows.Forms.TextBox();
            this.btnConnect = new System.Windows.Forms.Button();
            this.btnAddRegular = new System.Windows.Forms.Button();
            this.txtRegular = new System.Windows.Forms.TextBox();
            this.label1 = new System.Windows.Forms.Label();
            this.lblRegularID = new System.Windows.Forms.Label();
            this.btnTransaction = new System.Windows.Forms.Button();
            this.groupBox1 = new System.Windows.Forms.GroupBox();
            this.groupBox2 = new System.Windows.Forms.GroupBox();
            this.groupBox3 = new System.Windows.Forms.GroupBox();
            this.textBox1 = new System.Windows.Forms.TextBox();
            this.label2 = new System.Windows.Forms.Label();
            this.groupBox4 = new System.Windows.Forms.GroupBox();
            this.btnAddMulti = new System.Windows.Forms.Button();
            this.groupBox5 = new System.Windows.Forms.GroupBox();
            this.btnUpdate = new System.Windows.Forms.Button();
            this.btnDelete = new System.Windows.Forms.Button();
            this.groupBox1.SuspendLayout();
            this.groupBox2.SuspendLayout();
            this.groupBox3.SuspendLayout();
            this.groupBox4.SuspendLayout();
            this.groupBox5.SuspendLayout();
            this.SuspendLayout();
            // 
            // btnSite
            // 
            this.btnSite.Location = new System.Drawing.Point(6, 22);
            this.btnSite.Name = "btnSite";
            this.btnSite.Size = new System.Drawing.Size(64, 23);
            this.btnSite.TabIndex = 0;
            this.btnSite.Text = "Select";
            this.btnSite.UseVisualStyleBackColor = true;
            this.btnSite.Click += new System.EventHandler(this.btnSite_Click);
            // 
            // txtHost
            // 
            this.txtHost.Location = new System.Drawing.Point(13, 13);
            this.txtHost.Name = "txtHost";
            this.txtHost.Size = new System.Drawing.Size(177, 23);
            this.txtHost.TabIndex = 1;
            this.txtHost.Text = "127.0.0.1";
            // 
            // txtDbId
            // 
            this.txtDbId.Location = new System.Drawing.Point(13, 42);
            this.txtDbId.Name = "txtDbId";
            this.txtDbId.Size = new System.Drawing.Size(177, 23);
            this.txtDbId.TabIndex = 2;
            this.txtDbId.Text = "sa";
            // 
            // txtDbPw
            // 
            this.txtDbPw.Location = new System.Drawing.Point(12, 71);
            this.txtDbPw.Name = "txtDbPw";
            this.txtDbPw.Size = new System.Drawing.Size(178, 23);
            this.txtDbPw.TabIndex = 3;
            this.txtDbPw.Text = "9449966Ab";
            // 
            // txtDbName
            // 
            this.txtDbName.Location = new System.Drawing.Point(13, 100);
            this.txtDbName.Name = "txtDbName";
            this.txtDbName.Size = new System.Drawing.Size(177, 23);
            this.txtDbName.TabIndex = 4;
            this.txtDbName.Text = "DapperSample";
            // 
            // btnConnect
            // 
            this.btnConnect.Location = new System.Drawing.Point(98, 129);
            this.btnConnect.Name = "btnConnect";
            this.btnConnect.Size = new System.Drawing.Size(92, 23);
            this.btnConnect.TabIndex = 5;
            this.btnConnect.Text = "DB Connect";
            this.btnConnect.UseVisualStyleBackColor = true;
            this.btnConnect.Click += new System.EventHandler(this.btnConnect_Click);
            // 
            // btnAddRegular
            // 
            this.btnAddRegular.Location = new System.Drawing.Point(212, 24);
            this.btnAddRegular.Name = "btnAddRegular";
            this.btnAddRegular.Size = new System.Drawing.Size(94, 23);
            this.btnAddRegular.TabIndex = 7;
            this.btnAddRegular.Text = "Add Regular";
            this.btnAddRegular.UseVisualStyleBackColor = true;
            this.btnAddRegular.Click += new System.EventHandler(this.btnAddRegular_Click);
            // 
            // txtRegular
            // 
            this.txtRegular.Location = new System.Drawing.Point(106, 24);
            this.txtRegular.Name = "txtRegular";
            this.txtRegular.Size = new System.Drawing.Size(100, 23);
            this.txtRegular.TabIndex = 8;
            // 
            // label1
            // 
            this.label1.AutoSize = true;
            this.label1.Location = new System.Drawing.Point(6, 28);
            this.label1.Name = "label1";
            this.label1.Size = new System.Drawing.Size(87, 15);
            this.label1.TabIndex = 9;
            this.label1.Text = "추가할 팀 이름";
            // 
            // lblRegularID
            // 
            this.lblRegularID.AutoSize = true;
            this.lblRegularID.Location = new System.Drawing.Point(7, 64);
            this.lblRegularID.Name = "lblRegularID";
            this.lblRegularID.Size = new System.Drawing.Size(86, 15);
            this.lblRegularID.TabIndex = 10;
            this.lblRegularID.Text = "추가된 팀 ID : ";
            // 
            // btnTransaction
            // 
            this.btnTransaction.Location = new System.Drawing.Point(16, 36);
            this.btnTransaction.Name = "btnTransaction";
            this.btnTransaction.Size = new System.Drawing.Size(142, 23);
            this.btnTransaction.TabIndex = 11;
            this.btnTransaction.Text = "Transaction test";
            this.btnTransaction.UseVisualStyleBackColor = true;
            this.btnTransaction.Click += new System.EventHandler(this.btnTransaction_Click);
            // 
            // groupBox1
            // 
            this.groupBox1.Controls.Add(this.btnTransaction);
            this.groupBox1.Location = new System.Drawing.Point(13, 344);
            this.groupBox1.Name = "groupBox1";
            this.groupBox1.Size = new System.Drawing.Size(207, 82);
            this.groupBox1.TabIndex = 12;
            this.groupBox1.TabStop = false;
            this.groupBox1.Text = "Transaction sample";
            // 
            // groupBox2
            // 
            this.groupBox2.Controls.Add(this.label1);
            this.groupBox2.Controls.Add(this.btnAddRegular);
            this.groupBox2.Controls.Add(this.lblRegularID);
            this.groupBox2.Controls.Add(this.txtRegular);
            this.groupBox2.Location = new System.Drawing.Point(12, 238);
            this.groupBox2.Name = "groupBox2";
            this.groupBox2.Size = new System.Drawing.Size(346, 100);
            this.groupBox2.TabIndex = 13;
            this.groupBox2.TabStop = false;
            this.groupBox2.Text = "단일 추가";
            // 
            // groupBox3
            // 
            this.groupBox3.Controls.Add(this.btnSite);
            this.groupBox3.Location = new System.Drawing.Point(12, 158);
            this.groupBox3.Name = "groupBox3";
            this.groupBox3.Size = new System.Drawing.Size(103, 63);
            this.groupBox3.TabIndex = 14;
            this.groupBox3.TabStop = false;
            this.groupBox3.Text = "select sample";
            // 
            // textBox1
            // 
            this.textBox1.Location = new System.Drawing.Point(400, 44);
            this.textBox1.Multiline = true;
            this.textBox1.Name = "textBox1";
            this.textBox1.ReadOnly = true;
            this.textBox1.ScrollBars = System.Windows.Forms.ScrollBars.Vertical;
            this.textBox1.Size = new System.Drawing.Size(388, 178);
            this.textBox1.TabIndex = 15;
            this.textBox1.Text = resources.GetString("textBox1.Text");
            // 
            // label2
            // 
            this.label2.AutoSize = true;
            this.label2.Font = new System.Drawing.Font("맑은 고딕", 15F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point);
            this.label2.ForeColor = System.Drawing.Color.Red;
            this.label2.Location = new System.Drawing.Point(400, 13);
            this.label2.Name = "label2";
            this.label2.Size = new System.Drawing.Size(212, 28);
            this.label2.TabIndex = 16;
            this.label2.Text = "sample database 생성";
            // 
            // groupBox4
            // 
            this.groupBox4.Controls.Add(this.btnAddMulti);
            this.groupBox4.Location = new System.Drawing.Point(390, 238);
            this.groupBox4.Name = "groupBox4";
            this.groupBox4.Size = new System.Drawing.Size(134, 64);
            this.groupBox4.TabIndex = 14;
            this.groupBox4.TabStop = false;
            this.groupBox4.Text = "다중 추가";
            // 
            // btnAddMulti
            // 
            this.btnAddMulti.Location = new System.Drawing.Point(10, 28);
            this.btnAddMulti.Name = "btnAddMulti";
            this.btnAddMulti.Size = new System.Drawing.Size(118, 23);
            this.btnAddMulti.TabIndex = 7;
            this.btnAddMulti.Text = "Add Regulars";
            this.btnAddMulti.UseVisualStyleBackColor = true;
            this.btnAddMulti.Click += new System.EventHandler(this.btnAddMulti_Click);
            // 
            // groupBox5
            // 
            this.groupBox5.Controls.Add(this.btnUpdate);
            this.groupBox5.Controls.Add(this.btnDelete);
            this.groupBox5.Location = new System.Drawing.Point(147, 159);
            this.groupBox5.Name = "groupBox5";
            this.groupBox5.Size = new System.Drawing.Size(211, 63);
            this.groupBox5.TabIndex = 17;
            this.groupBox5.TabStop = false;
            this.groupBox5.Text = "update, delete sample";
            // 
            // btnUpdate
            // 
            this.btnUpdate.Location = new System.Drawing.Point(73, 20);
            this.btnUpdate.Name = "btnUpdate";
            this.btnUpdate.Size = new System.Drawing.Size(64, 23);
            this.btnUpdate.TabIndex = 1;
            this.btnUpdate.Text = "Update";
            this.btnUpdate.UseVisualStyleBackColor = true;
            this.btnUpdate.Click += new System.EventHandler(this.btnUpdate_Click);
            // 
            // btnDelete
            // 
            this.btnDelete.Location = new System.Drawing.Point(6, 22);
            this.btnDelete.Name = "btnDelete";
            this.btnDelete.Size = new System.Drawing.Size(64, 23);
            this.btnDelete.TabIndex = 0;
            this.btnDelete.Text = "Delete";
            this.btnDelete.UseVisualStyleBackColor = true;
            this.btnDelete.Click += new System.EventHandler(this.btnDelete_Click);
            // 
            // Form1
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(7F, 15F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(800, 450);
            this.Controls.Add(this.groupBox5);
            this.Controls.Add(this.groupBox4);
            this.Controls.Add(this.label2);
            this.Controls.Add(this.textBox1);
            this.Controls.Add(this.groupBox3);
            this.Controls.Add(this.groupBox2);
            this.Controls.Add(this.groupBox1);
            this.Controls.Add(this.btnConnect);
            this.Controls.Add(this.txtDbName);
            this.Controls.Add(this.txtDbPw);
            this.Controls.Add(this.txtDbId);
            this.Controls.Add(this.txtHost);
            this.Name = "Form1";
            this.Text = "Form1";
            this.groupBox1.ResumeLayout(false);
            this.groupBox2.ResumeLayout(false);
            this.groupBox2.PerformLayout();
            this.groupBox3.ResumeLayout(false);
            this.groupBox4.ResumeLayout(false);
            this.groupBox5.ResumeLayout(false);
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.Button btnSite;
        private System.Windows.Forms.TextBox txtHost;
        private System.Windows.Forms.TextBox txtDbPw;
        private System.Windows.Forms.TextBox txtDbName;
        private System.Windows.Forms.Button btnConnect;
        private System.Windows.Forms.TextBox txtDbId;
        private System.Windows.Forms.Button btnAddRegular;
        private System.Windows.Forms.TextBox txtRegular;
        private System.Windows.Forms.Label label1;
        private System.Windows.Forms.Label lblRegularID;
        private System.Windows.Forms.Button btnTransaction;
        private System.Windows.Forms.GroupBox groupBox1;
        private System.Windows.Forms.GroupBox groupBox2;
        private System.Windows.Forms.GroupBox groupBox3;
        private System.Windows.Forms.TextBox textBox1;
        private System.Windows.Forms.Label label2;
        private System.Windows.Forms.GroupBox groupBox4;
        private System.Windows.Forms.Button btnAddMulti;
        private System.Windows.Forms.GroupBox groupBox5;
        private System.Windows.Forms.Button btnDelete;
        private System.Windows.Forms.Button btnUpdate;
    }
}

