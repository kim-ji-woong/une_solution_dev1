namespace PohangSimulator;

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
    /// Required method for Designer support - do not modify
    /// the contents of this method with the code editor.
    /// </summary>
    private void InitializeComponent()
    {
        Start = new System.Windows.Forms.Button();
        Stop = new System.Windows.Forms.Button();
        SuspendLayout();
        // 
        // Start
        // 
        Start.Location = new System.Drawing.Point(25, 35);
        Start.Name = "Start";
        Start.Size = new System.Drawing.Size(121, 44);
        Start.TabIndex = 0;
        Start.Text = "시작";
        Start.UseVisualStyleBackColor = true;
        Start.Click += Start_Click;
        // 
        // Stop
        // 
        Stop.Location = new System.Drawing.Point(199, 35);
        Stop.Name = "Stop";
        Stop.Size = new System.Drawing.Size(117, 44);
        Stop.TabIndex = 1;
        Stop.Text = "중지";
        Stop.UseVisualStyleBackColor = true;
        Stop.Click += Stop_Click;
        // 
        // FormMain
        // 
        AutoScaleDimensions = new System.Drawing.SizeF(10F, 25F);
        AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
        ClientSize = new System.Drawing.Size(351, 119);
        Controls.Add(Stop);
        Controls.Add(Start);
        Text = "Form1";
        ResumeLayout(false);
    }

    private System.Windows.Forms.Button Start;
    private System.Windows.Forms.Button Stop;

    #endregion
}