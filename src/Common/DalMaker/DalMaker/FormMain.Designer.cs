
namespace DalMaker
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
            this.label1 = new System.Windows.Forms.Label();
            this.textBoxDBName = new System.Windows.Forms.TextBox();
            this.btnSearch = new System.Windows.Forms.Button();
            this.gridTable = new System.Windows.Forms.DataGridView();
            this.colChecked = new System.Windows.Forms.DataGridViewCheckBoxColumn();
            this.colTableName = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.colClassName = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.btnMakeCode = new System.Windows.Forms.Button();
            this.label2 = new System.Windows.Forms.Label();
            this.textBoxNameSpace = new System.Windows.Forms.TextBox();
            this.checkBoxSelectAll = new System.Windows.Forms.CheckBox();
            this.checkDapper = new System.Windows.Forms.CheckBox();
            ((System.ComponentModel.ISupportInitialize)(this.gridTable)).BeginInit();
            this.SuspendLayout();
            // 
            // label1
            // 
            this.label1.AutoSize = true;
            this.label1.Location = new System.Drawing.Point(31, 35);
            this.label1.Name = "label1";
            this.label1.Size = new System.Drawing.Size(66, 15);
            this.label1.TabIndex = 0;
            this.label1.Text = "DB Name :";
            // 
            // textBoxDBName
            // 
            this.textBoxDBName.Location = new System.Drawing.Point(117, 32);
            this.textBoxDBName.Name = "textBoxDBName";
            this.textBoxDBName.Size = new System.Drawing.Size(109, 23);
            this.textBoxDBName.TabIndex = 1;
            this.textBoxDBName.KeyDown += new System.Windows.Forms.KeyEventHandler(this.textBoxDBName_KeyDown);
            // 
            // btnSearch
            // 
            this.btnSearch.Location = new System.Drawing.Point(242, 30);
            this.btnSearch.Name = "btnSearch";
            this.btnSearch.Size = new System.Drawing.Size(50, 28);
            this.btnSearch.TabIndex = 2;
            this.btnSearch.Text = "조회";
            this.btnSearch.UseVisualStyleBackColor = true;
            this.btnSearch.Click += new System.EventHandler(this.btnSearch_Click);
            // 
            // gridTable
            // 
            this.gridTable.AllowUserToAddRows = false;
            this.gridTable.AllowUserToDeleteRows = false;
            this.gridTable.AllowUserToOrderColumns = true;
            dataGridViewCellStyle1.Alignment = System.Windows.Forms.DataGridViewContentAlignment.MiddleCenter;
            dataGridViewCellStyle1.BackColor = System.Drawing.SystemColors.Control;
            dataGridViewCellStyle1.Font = new System.Drawing.Font("맑은 고딕", 9F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point);
            dataGridViewCellStyle1.ForeColor = System.Drawing.SystemColors.WindowText;
            dataGridViewCellStyle1.SelectionBackColor = System.Drawing.SystemColors.Highlight;
            dataGridViewCellStyle1.SelectionForeColor = System.Drawing.SystemColors.HighlightText;
            dataGridViewCellStyle1.WrapMode = System.Windows.Forms.DataGridViewTriState.True;
            this.gridTable.ColumnHeadersDefaultCellStyle = dataGridViewCellStyle1;
            this.gridTable.ColumnHeadersHeightSizeMode = System.Windows.Forms.DataGridViewColumnHeadersHeightSizeMode.AutoSize;
            this.gridTable.Columns.AddRange(new System.Windows.Forms.DataGridViewColumn[] {
            this.colChecked,
            this.colTableName,
            this.colClassName});
            this.gridTable.Location = new System.Drawing.Point(31, 121);
            this.gridTable.Name = "gridTable";
            this.gridTable.RowHeadersVisible = false;
            this.gridTable.RowTemplate.Height = 25;
            this.gridTable.Size = new System.Drawing.Size(582, 305);
            this.gridTable.TabIndex = 3;
            // 
            // colChecked
            // 
            this.colChecked.HeaderText = "선택";
            this.colChecked.Name = "colChecked";
            // 
            // colTableName
            // 
            dataGridViewCellStyle2.Alignment = System.Windows.Forms.DataGridViewContentAlignment.MiddleLeft;
            dataGridViewCellStyle2.Padding = new System.Windows.Forms.Padding(5, 0, 0, 0);
            this.colTableName.DefaultCellStyle = dataGridViewCellStyle2;
            this.colTableName.HeaderText = "테이블 이름";
            this.colTableName.Name = "colTableName";
            this.colTableName.ReadOnly = true;
            this.colTableName.Width = 200;
            // 
            // colClassName
            // 
            this.colClassName.AutoSizeMode = System.Windows.Forms.DataGridViewAutoSizeColumnMode.Fill;
            this.colClassName.HeaderText = "class 이름";
            this.colClassName.Name = "colClassName";
            // 
            // btnMakeCode
            // 
            this.btnMakeCode.Location = new System.Drawing.Point(329, 30);
            this.btnMakeCode.Name = "btnMakeCode";
            this.btnMakeCode.Size = new System.Drawing.Size(71, 28);
            this.btnMakeCode.TabIndex = 2;
            this.btnMakeCode.Text = "코드생성";
            this.btnMakeCode.UseVisualStyleBackColor = true;
            this.btnMakeCode.Click += new System.EventHandler(this.btnMakeCode_Click);
            // 
            // label2
            // 
            this.label2.AutoSize = true;
            this.label2.Location = new System.Drawing.Point(31, 64);
            this.label2.Name = "label2";
            this.label2.Size = new System.Drawing.Size(78, 15);
            this.label2.TabIndex = 0;
            this.label2.Text = "NameSpace :";
            // 
            // textBoxNameSpace
            // 
            this.textBoxNameSpace.Location = new System.Drawing.Point(117, 61);
            this.textBoxNameSpace.Name = "textBoxNameSpace";
            this.textBoxNameSpace.Size = new System.Drawing.Size(109, 23);
            this.textBoxNameSpace.TabIndex = 2;
            // 
            // checkBoxSelectAll
            // 
            this.checkBoxSelectAll.AutoSize = true;
            this.checkBoxSelectAll.Location = new System.Drawing.Point(33, 94);
            this.checkBoxSelectAll.Name = "checkBoxSelectAll";
            this.checkBoxSelectAll.Size = new System.Drawing.Size(78, 19);
            this.checkBoxSelectAll.TabIndex = 4;
            this.checkBoxSelectAll.Text = "모두 선택";
            this.checkBoxSelectAll.UseVisualStyleBackColor = true;
            this.checkBoxSelectAll.CheckedChanged += new System.EventHandler(this.checkBoxSelectAll_CheckedChanged);
            // 
            // checkDapper
            // 
            this.checkDapper.AutoSize = true;
            this.checkDapper.Location = new System.Drawing.Point(415, 34);
            this.checkDapper.Name = "checkDapper";
            this.checkDapper.Size = new System.Drawing.Size(93, 19);
            this.checkDapper.TabIndex = 5;
            this.checkDapper.Text = "Dapper 버전";
            this.checkDapper.UseVisualStyleBackColor = true;
            // 
            // FormMain
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(7F, 15F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(638, 450);
            this.Controls.Add(this.checkDapper);
            this.Controls.Add(this.checkBoxSelectAll);
            this.Controls.Add(this.gridTable);
            this.Controls.Add(this.btnMakeCode);
            this.Controls.Add(this.btnSearch);
            this.Controls.Add(this.textBoxNameSpace);
            this.Controls.Add(this.label2);
            this.Controls.Add(this.textBoxDBName);
            this.Controls.Add(this.label1);
            this.Name = "FormMain";
            this.Text = "Dal Maker";
            this.Load += new System.EventHandler(this.FormMain_Load);
            ((System.ComponentModel.ISupportInitialize)(this.gridTable)).EndInit();
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.Label label1;
        private System.Windows.Forms.TextBox textBoxDBName;
        private System.Windows.Forms.Button btnSearch;
        private System.Windows.Forms.DataGridView gridTable;
        private System.Windows.Forms.Button btnMakeCode;
        private System.Windows.Forms.Label label2;
        private System.Windows.Forms.TextBox textBoxNameSpace;
        private System.Windows.Forms.CheckBox checkBoxSelectAll;
        private System.Windows.Forms.DataGridViewCheckBoxColumn colChecked;
        private System.Windows.Forms.DataGridViewTextBoxColumn colTableName;
        private System.Windows.Forms.DataGridViewTextBoxColumn colClassName;
        private System.Windows.Forms.CheckBox checkDapper;
    }
}

