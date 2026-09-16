export const colors = {
    white: "#FFFFFF",
    black: "#000000",

    // 배경색
    background: {
        base: '#141B27',
        surface: '#121721',
        overlay: '#0F131A',
        elevated: '#3C424D',
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
        p100: '#DDE9FF',
        p200: '#BAD3FF',
        p300: '#93BEFF',
        p400: '#65A9FF',
        p500: '#0095FF',
        p600: '#1B75C6',
        p700: '#205791',
        p800: '#1D3A5E',
        p900: '#152031',
    },

    secondary: {
        s100: "#F4EEE5",
        s150: "#FFFAF8",
        s200: "#FFF0E6",
        s300: "#FDAC7F",
        s400: "#FC8B4C",
        s500: "#FC6B19",
        s600: "#E05F16",
        s700: "#5F423B",
        s800: "#4C3A39",
        s900: "#3B3237",
    },

    error: {
        error100: "#F6EEEE",
        error200: "#FED7D7",
        error300: "#EF8787",
        error400: "#FB5454",
        error500: "#DD3232",
        error600: "#C22222",
        error700: "#5E323D",
        error800: "#4D2E3A",
        error900: "#3B2B38",
    },

    warning: {
        warning100: "#FFF8D9",
        warning200: "#FFF3C1",
        warning300: "#F5DF92",
        warning400: "#FFD96B",
        warning500: "#FFC73A",
        warning600: "#B7821D",
        warning700: "#5F5236",
        warning800: "#4D4535",
        warning900: "#3C3835",
    },

    success: {
        success100: "#EEF1EF",
        success200: "#CBF6D5",
        success300: "#79D287",
        success400: "#37B44A",
        success500: "#29A33B",
        success600: "#37B44A",
        success700: "#274D3A",
        success800: "#254238",
        success900: "#243637",
    },

    grayscale: {
        g10: '#FAFAFC',
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
        g850: '#2A2F3D',
        g900: '#1D1F2B',
    }
};

// ${({ theme }) => theme.colors.primary.p100};
// ${({ theme }) => theme.colors.grayscale.g600};