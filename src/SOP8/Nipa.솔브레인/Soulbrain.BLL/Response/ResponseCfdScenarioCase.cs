using System.Collections.Generic;
using Response;
using Soulbrain.Model.Cfd;

namespace Soulbrain.BLL.Response
{
    public class ResponseCfdScenarioCase : MessageResult
    {
        private Material m_material = null;
        private List<MaterialRange> m_materialRanges = new List<MaterialRange>();
        private Scenario m_scenario = null;
        private List<ScenarioCase> m_scenarioCases = new List<ScenarioCase>();
        private ScenarioCondition m_scenarioCondition = null;

        public Material Material
        {
            get { return m_material; }
            set { m_material = value; }
        }

        public List<MaterialRange> MaterialRanges
        {
            get { return m_materialRanges; }
            set { m_materialRanges = value; }
        }

        public Scenario Scenario
        {
            get { return m_scenario; }
            set { m_scenario = value; }
        }

        public List<ScenarioCase> ScenarioCases
        {
            get { return m_scenarioCases; }
            set { m_scenarioCases = value; }
        }

        public ScenarioCondition ScenarioCondition
        {
            get { return m_scenarioCondition; }
            set { m_scenarioCondition = value; }
        }

        public ResponseCfdScenarioCase()
            : base()
        {
        }

        public ResponseCfdScenarioCase(bool success, string message)
            : base(success, message)
        {
        }
    }
}
