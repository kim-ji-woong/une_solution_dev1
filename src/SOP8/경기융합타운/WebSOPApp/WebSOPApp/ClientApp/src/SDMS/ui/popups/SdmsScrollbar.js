export class SdmsScrollbar  {
    static Color_ScrollbarBackground = "#3D3F47";
    static Color_Scrollbar = "#7D8389";

    static setContentStyle(scrollbarElement, width, height, visible) {
        if (!scrollbarElement) {
            return;
        }

        const root = scrollbarElement.container;

        if (!root) {
            return;
        }

        root.style.width = width + "px";
        root.style.height = height + "px";

        if (root.children.length >= 3) {
            const div = root.children[2];

            if (visible) {
                div.style.display = "initial";
                div.style.backgroundColor = SdmsScrollbar.Color_ScrollbarBackground;

                if (div.children.length > 0) {
                    const scrollBar = div.children[0];
                    scrollBar.style.backgroundColor = SdmsScrollbar.Color_Scrollbar;
                }
            }
            else {
                div.style.display = "none";
            }
        }

        
    }
}