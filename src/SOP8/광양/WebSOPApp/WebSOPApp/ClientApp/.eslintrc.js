// npm install eslint-plugin-react-hooks --save-dev
module.exports = {
    extends: [
        "react-app",
        "plugin:react-hooks/recommended"
    ],
    plugins: ["react-hooks"],
    rules: {
        "react-hooks/exhaustive-deps": "warn"
    }
}