using System.ComponentModel;
using System.Windows.Forms;

namespace IntegrationServer.Options
{
    partial class PanelSoulbrainHRService
    {
        /// <summary> 
        /// Required designer variable.
        /// </summary>
        private IContainer components = null;

        /// <summary> 
        /// Clean up any resources being used.
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

        #region Component Designer generated code

        /// <summary>
        /// Required method for Designer support - do not modify
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            DbName = new System.Windows.Forms.Label();
            DbNameInput = new System.Windows.Forms.TextBox();
            SuspendLayout();
            // 
            // DbName
            // 
            DbName.Location = new System.Drawing.Point(16, 13);
            DbName.Name = "DbName";
            DbName.Size = new System.Drawing.Size(71, 22);
            DbName.TabIndex = 0;
            DbName.Text = "DbName : ";
            DbName.TextAlign = System.Drawing.ContentAlignment.MiddleRight;
            // 
            // DbNameInput
            // 
            DbNameInput.Location = new System.Drawing.Point(106, 12);
            DbNameInput.Name = "DbNameInput";
            DbNameInput.Size = new System.Drawing.Size(203, 23);
            DbNameInput.TabIndex = 1;
            // 
            // PanelSoulbrainHRService
            // 
            AutoScaleDimensions = new System.Drawing.SizeF(7F, 15F);
            AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            Controls.Add(DbNameInput);
            Controls.Add(DbName);
            Name = "PanelSoulbrainHRService";
            Size = new System.Drawing.Size(355, 160);
            ResumeLayout(false);
            PerformLayout();
        }

        private System.Windows.Forms.Label DbName;
        private System.Windows.Forms.TextBox DbNameInput;

        #endregion
    }
}