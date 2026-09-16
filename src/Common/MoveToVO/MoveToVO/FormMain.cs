using System;
using System.Collections.Generic;
using System.IO;
using System.Windows.Forms;
using System.Text;

namespace MoveToVO
{
    using Process;
    using Models;

    public partial class FormMain : Form
    {
        private const string DataFile = "data.cfg";

        public FormMain()
        {
            InitializeComponent();
        }

        private void btnModelRootFolder_Click(object sender, EventArgs e)
        {
            SetFolder(textBoxModelRootFolder);
        }

        private void btnVORootFolder_Click(object sender, EventArgs e)
        {
            SetFolder(textBoxVORootFolder);
        }

        private void btnDAORootFolder_Click(object sender, EventArgs e)
        {
            SetFolder(textBoxDAORootFolder);
        }

        private void btnMapperRootFolder_Click(object sender, EventArgs e)
        {
            SetFolder(textBoxMapperRootFolder);
        }

        private void SetFolder(TextBox textBox)
        {
            FolderBrowserDialog folderBrowserDialog = new FolderBrowserDialog();

            if (folderBrowserDialog.ShowDialog() == DialogResult.OK)
            {
                textBox.Text = folderBrowserDialog.SelectedPath;
            }
        }

        private void btnRun_Click(object sender, EventArgs e)
        {
            if (CheckFolder(textBoxModelRootFolder, "Model 파일의 Root 폴더를 입력하세요.") == false)
                return;
            if (CheckFolder(textBoxVORootFolder, "VO 파일의 Root 폴더를 입력하세요.") == false)
                return;
            if (CheckFolder(textBoxDAORootFolder, "DAO 파일의 Root 폴더를 입력하세요.") == false)
                return;
            if (CheckFolder(textBoxMapperRootFolder, "Mapper 파일의 Root 폴더를 입력하세요.") == false)
                return;

            List<Model> models = ModelReader.ReadModels(textBoxModelRootFolder.Text.Trim());

            VOManager voManager = new VOManager(textBoxVORootFolder.Text.Trim());
            voManager.MakeFiles(models);

            DAOManager daoManager = new DAOManager(textBoxDAORootFolder.Text.Trim());
            daoManager.MakeFiles(models);

            MapperManager mapperManager = new MapperManager(textBoxMapperRootFolder.Text.Trim());
            mapperManager.MakeFiles(models);

            MessageBox.Show("파일이 생성되었습니다.");
        }

        private bool CheckFolder(TextBox textBox, string strMessage)
        {
            string strRootFolder = textBox.Text.Trim();

            if (strRootFolder.Length == 0)
            {
                textBox.Focus();
                MessageBox.Show(strMessage);
                return false;
            }

            return true;
        }

        private void FormMain_Load(object sender, EventArgs e)
        {
            if (File.Exists(DataFile))
            {
                StreamReader reader = new StreamReader(DataFile, Encoding.UTF8);

                while (reader.EndOfStream == false)
                {
                    string strLine = reader.ReadLine().Trim();
                    int index = strLine.IndexOf(':');

                    if (index < 0)
                        continue;

                    string strName = strLine.Substring(0, index).Trim();
                    string strValue = strLine.Substring(index + 1).Trim();

                    if (strName == "ModelRootFolder")
                        textBoxModelRootFolder.Text = strValue;
                    else if (strName == "VORootFolder")
                        textBoxVORootFolder.Text = strValue;
                    else if (strName == "DAORootFolder")
                        textBoxDAORootFolder.Text = strValue;
                    else if (strName == "MapperRootFolder")
                        textBoxMapperRootFolder.Text = strValue;
                }

                reader.Close();
            }
        }

        private void FormMain_FormClosing(object sender, FormClosingEventArgs e)
        {
            StreamWriter writer = new StreamWriter(DataFile, false, Encoding.UTF8);

            writer.WriteLine("ModelRootFolder : " + textBoxModelRootFolder.Text);
            writer.WriteLine("VORootFolder : " + textBoxVORootFolder.Text);
            writer.WriteLine("DAORootFolder : " + textBoxDAORootFolder.Text);
            writer.WriteLine("MapperRootFolder : " + textBoxMapperRootFolder.Text);

            writer.Close();
        }
    }
}
