import { useState } from "react";
import { getDoorImage } from "./getDoorImage";

function DoorIcon({ type, opened, level, selected }) {
    const [hover, setHover] = useState(false);

    let finalLevel = level;

    if (selected) {
        finalLevel = `selected_${level}`;
    } else if (hover) {
        finalLevel = `hover_${level}`;
    }

    const doorImage = getDoorImage({
        type,
        opened,
        level: finalLevel,
    });

    if (!doorImage) return null;

    return (
        <span
            className="door__icon-wrapper"
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
        >
            <img
                className="door__icon"
                src={doorImage}
                alt=""
                draggable={false}
            />
        </span>
    );
}

export default DoorIcon;