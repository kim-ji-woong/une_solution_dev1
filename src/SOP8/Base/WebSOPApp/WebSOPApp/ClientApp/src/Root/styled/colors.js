export const colors = {
    white: "#FFFFFF",
    black: "#000000",

    // 텍스트 컬러
    text: {
        primary: '#FFFFFF',
        inverse: '#000000',
        muted: '#9E9E9E',
        link: '#0095FF',
    },

    // 배경색
    background: {
        base: '#131D24',
        surface: '#1B212C',
        overlay: '#1D2023',
        elevated: '#222A38',
        button: '#424242',
    },

    // 상태 컬러
    state: {
        success: '#4CAF50',
        warning: '#F9A825',
        error: '#CE0808',
        info: '#1976D2',
    },

    // 구분선
    border: {
        strong: '#757575',
    },

    // 투명도 활용 컬러
    alpha: {
        overlay: 'rgba(0, 0, 0, 0.3)',
        backdrop: 'rgba(255, 255, 255, 0.1)',
    },

    primary: {
        p10: '#FAFBFF',
        p25: '#F6F8FF',
        p50: '#F5F7FF',
        p60: '#F0F3FF',
        p75: '#E2E9FF',
        p100: '#E6ECFF',
        p200: '#B4C3FF',
        p300: '#8CA5FF',
        p400: '#6487FA',
        p500: '#3C69FC',
        p600: '#193DF0',
        p700: '#0C2CCA',
        p800: '#102587',
        p900: '#0A196F',
    },

    secondary: {
        s100: "#F4EEE5",
        s150: "#FFFAF8",
        s200: "#FFF0E6",
        s300: "#FDAC7F",
        s400: "#FC8B4C",
        s500: "#FC6B19",
        s600: "#E05F16",
    },

    grayscale: {
        g20: '#F9F9FB',
        g25: '#F4F5F5',
        g50: '#EBEBED',
        g75: '#DADBDD',
        g100: '#CECFD2',
        g150: '#BBBCC0',
        g200: '#A6A9AF',
        g300: '#888C94',
        g400: '#787C87',
        g500: '#686D78',
        g600: '#565B69',
        g700: '#444A57',
        g800: '#313644',
        g900: '#1D1F2B',
    }
};

// ${({ theme }) => theme.colors.primary.p500}
// ${({ theme }) => theme.colors.grayscale.g300}