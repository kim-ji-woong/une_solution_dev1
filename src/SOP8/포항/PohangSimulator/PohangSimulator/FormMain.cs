using System.Net.Http;
using System.Text;
using System.Text.Json;

namespace PohangSimulator
{
    public partial class FormMain : Form
    {
        private static readonly HttpClient client = new HttpClient();

        public FormMain()
        {
            InitializeComponent();
        }

        private async void Start_Click(object sender, EventArgs e)
        {
            await SendSimulationRequest(true);
        }

        private async void Stop_Click(object sender, EventArgs e)
        {
            await SendSimulationRequest(false);
        }

        private async Task SendSimulationRequest(bool isStart)
        {
            try
            {
                var payload = new
                {
                    sim_bool = isStart,
                    sim_node = 13,
                    sim_sensor = 22784
                };

                string jsonString = JsonSerializer.Serialize(payload);
                
                // HttpRequestMessage를 사용하여 헤더와 내용을 함께 설정합니다.
                using var request = new HttpRequestMessage(HttpMethod.Post, "http://192.168.1.161:9090/api/simulation/insert");
                
                // [중요] 여기에 헤더 키와 값을 설정합니다.
                // 만약 API 문서에 헤더 이름이 'Authorization'이라고 되어 있다면 "x-api-key" 대신 "Authorization"을 쓰세요.
                request.Headers.Add("x-api-key", "40052b8f-d8ec-426d-8323-0554060b03d9");
                
                request.Content = new StringContent(jsonString, Encoding.UTF8, "application/json");

                // client.PostAsync 대신 client.SendAsync를 사용합니다.
                var response = await client.SendAsync(request);
                
                // 응답 본문을 문자열로 읽습니다.
                string responseString = await response.Content.ReadAsStringAsync();

                // 상태 코드와 함께 응답 내용을 보여줍니다.
                string fullMessage = $"Status: {response.StatusCode}\r\n\r\nBody:\r\n{responseString}";
                ShowScrollableMessageBox(fullMessage);
            }
            catch (Exception ex)
            {
                MessageBox.Show($"API 호출 중 오류가 발생했습니다: {ex.Message}");
            }
        }
        
        private void ShowScrollableMessageBox(string message)
        {
            Form popup = new Form();
            popup.Text = "API Response";
            popup.Size = new Size(500, 400); 
            popup.StartPosition = FormStartPosition.CenterParent;

            TextBox textBox = new TextBox();
            textBox.Multiline = true;
            textBox.ReadOnly = true; 
            textBox.ScrollBars = ScrollBars.Vertical;
            textBox.Dock = DockStyle.Fill;
            textBox.Text = message;
            textBox.Font = new Font("Consolas", 10);

            
            popup.Controls.Add(textBox);
            popup.ShowDialog(this); 
        }
    }
}