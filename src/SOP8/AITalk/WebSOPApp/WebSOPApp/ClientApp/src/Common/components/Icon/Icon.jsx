import { css } from "styled-components";
import { Svg } from "./styled.Icon";
import { activeIcons, defaultIcons, directionIcons, toolbarIcons, editModeIcons, settingsIcons, statusInfoIcons, simulationIcons } from "./data.Icon";
import { getColorFromPath } from '../../util/Util';
import { colors } from "../../../Root/styled/colors";

const setSize = (n) => {
    switch (n) {
        case "xxxxxs":
            return 10;
        case "xxxxs":
            return 12;
        case "xxxs":
            return 14;
        case "xxs":
            return 16;
        case "xs":
            return 20;
        case "sm":
            return 24;
        case "md":
            return 28;
        case "lg":
            return 32;
        case "xl":
            return 36;
        case "xxl":
            return 40;
        default:
            return n;
    }
};

export const setFill = (fill) => {
    if (!fill) return undefined;

    if (typeof fill === 'string' && fill.startsWith('#')) {
        return fill; // 직접 입력된 HEX
    }

    // var(--colorName) 형식 제거하고 이름만 추출
    const cleanKey = fill.replace(/^var\(--/, '').replace(/\)$/, '');

    // colors 객체에서 해당 경로 값 조회
    const resolvedColor = getColorFromPath(cleanKey, colors);

    return resolvedColor || 'currentColor';
};

/**
 *
 * @param {*} param0
 * @returns
 */
// ({ size, fill, ...props }) => JSX.Element
const Icon = () => {
    return {};
};

// 기본 아이콘
(() => {
    for (let name in defaultIcons) {
        Icon[name] = ({ size = "md", fill, ...props }) => (
            <Svg $width={setSize(size)} viewBox="0 0 24 24" {...props}>
                {defaultIcons[name]?.map((i, key) => (
                    <path
                        key={key}
                        d={i}
                        fill={
                            fill
                            ? fill === true
                                ? 'currentColor'
                                : setFill(fill)
                            : 'var(--G_500)' // fallback
                        }
                    />
                ))}
            </Svg>
        );
    }
})();

/**
 * @param {
 * size: 'string' | 'number'
 * }
 */
Icon.Watch = ({ size = "md", fill, ...props }) => (
    <Svg $width={setSize(size)} viewBox="0 0 24 24" {...props}>
        {defaultIcons.Watch?.map((i, key) => (
            <path
                key={key}
                d={i}
                fill={
                    fill
                        ? fill === true
                            ? "currentcolor"
                            : setFill(fill)
                        : fill !== undefined
                        ? ""
                        : "var(--G_500)"
                }
            />
        ))}
    </Svg>
);

/**
 * @param {
 * size: 'string' | 'number'
 * }
 */
Icon.Fileload = ({ size = "md", fill, ...props }) => (
    <Svg $width={setSize(size)} viewBox="0 0 24 24" {...props}>
        {defaultIcons.Fileload?.map((i, key) => (
            <path
                key={key}
                d={i}
                fill={
                    fill
                        ? fill === true
                            ? "currentcolor"
                            : setFill(fill)
                        : fill !== undefined
                        ? ""
                        : "var(--G_500)"
                }
            />
        ))}
    </Svg>
);

/**
 * @param {
 * size: 'string' | 'number'
 * }
 */
Icon.Swap = ({ size = "md", fill, ...props }) => (
    <Svg $width={setSize(size)} viewBox="0 0 24 24" {...props}>
        {defaultIcons.Swap?.map((i, key) => (
            <path
                key={key}
                d={i}
                fill={
                    fill
                        ? fill === true
                            ? "currentcolor"
                            : setFill(fill)
                        : fill !== undefined
                        ? ""
                        : "var(--G_500)"
                }
            />
        ))}
    </Svg>
);

/**
 * @param {
 * size: 'string' | 'number'
 * }
 */
Icon.Replay = ({ size = "md", fill, ...props }) => (
    <Svg $width={setSize(size)} viewBox="0 0 24 24" {...props}>
        {defaultIcons.Replay?.map((i, key) => (
            <path
                key={key}
                d={i}
                fill={
                    fill
                        ? fill === true
                            ? "currentcolor"
                            : setFill(fill)
                        : fill !== undefined
                        ? ""
                        : "var(--G_500)"
                }
            />
        ))}
    </Svg>
);

/**
 * @param {
 * size: 'string' | 'number'
 * }
 */
Icon.Filter = ({ size = "md", fill, ...props }) => (
    <Svg $width={setSize(size)} viewBox="0 0 24 24" {...props}>
        {defaultIcons.Filter?.map((i, key) => (
            <path
                key={key}
                d={i}
                fill={
                    fill
                        ? fill === true
                            ? "currentcolor"
                            : setFill(fill)
                        : fill !== undefined
                        ? ""
                        : "var(--G_500)"
                }
            />
        ))}
    </Svg>
);

/**
 * @param {
 * size: 'string' | 'number'
 * }
 */
Icon.Attach = ({ size = "md", fill, ...props }) => (
    <Svg $width={setSize(size)} viewBox="0 0 24 24" {...props}>
        {defaultIcons.Attach?.map((i, key) => (
            <path
                key={key}
                d={i}
                fill={
                    fill
                        ? fill === true
                            ? "currentcolor"
                            : setFill(fill)
                        : fill !== undefined
                        ? ""
                        : "var(--G_500)"
                }
            />
        ))}
    </Svg>
);

/**
 * @param {
 * size: 'string' | 'number'
 * }
 */
Icon.Setting = ({ size = "md", fill, ...props }) => (
    <Svg $width={setSize(size)} viewBox="0 0 24 24" {...props}>
        {defaultIcons.Setting?.map((i, key) => (
            <path
                key={key}
                d={i}
                fill={
                    fill
                        ? fill === true
                            ? "currentcolor"
                            : setFill(fill)
                        : fill !== undefined
                        ? ""
                        : "var(--G_500)"
                }
            />
        ))}
    </Svg>
);

/**
 * @param {
 * size?: 'string' | 'number'
 * }
 */
Icon.Image = ({ size = "md", fill, ...props }) => (
    <Svg $width={setSize(size)} viewBox="0 0 24 24" {...props}>
        {defaultIcons.Image?.map((i, key) => (
            <path
                key={key}
                d={i}
                fill={
                    fill
                        ? fill === true
                            ? "currentcolor"
                            : setFill(fill)
                        : fill !== undefined
                        ? ""
                        : "var(--G_500)"
                }
            />
        ))}
    </Svg>
);

/**
 * @param {
 * size: 'string' | 'number'
 * }
 */
Icon.Hambug = ({ size = "md", fill, ...props }) => (
    <Svg $width={setSize(size)} viewBox="0 0 24 24" {...props}>
        {defaultIcons.Hambug?.map((i, key) => (
            <path
                key={key}
                d={i}
                fill={
                    fill
                        ? fill === true
                            ? "currentcolor"
                            : setFill(fill)
                        : fill !== undefined
                        ? ""
                        : "var(--G_500)"
                }
            />
        ))}
    </Svg>
);

/**
 * @param {
 * size: 'string' | 'number'
 * }
 */
Icon.Description = ({ size = "md", fill, ...props }) => (
    <Svg $width={setSize(size)} viewBox="0 0 24 24" {...props}>
        {defaultIcons.Description?.map((i, key) => (
            <path
                key={key}
                d={i}
                fill={
                    fill
                        ? fill === true
                            ? "currentcolor"
                            : setFill(fill)
                        : fill !== undefined
                        ? ""
                        : "var(--G_500)"
                }
            />
        ))}
    </Svg>
);

/**
 * @param {
 * size: 'string' | 'number'
 * }
 */
Icon.Open = ({ size = "md", fill, ...props }) => (
    <Svg $width={setSize(size)} viewBox="0 0 24 24" {...props}>
        {defaultIcons.Open?.map((i, key) => (
            <path
                key={key}
                d={i}
                fill={
                    fill
                        ? fill === true
                            ? "currentcolor"
                            : setFill(fill)
                        : fill !== undefined
                        ? ""
                        : "var(--G_500)"
                }
            />
        ))}
    </Svg>
);

/**
 * @param {
 * size: 'string' | 'number'
 * }
 */
Icon.Search = ({ size = "md", fill, ...props }) => (
    <Svg $width={setSize(size)} viewBox="0 0 24 24" {...props}>
        {defaultIcons.Search?.map((i, key) => (
            <path
                key={key}
                d={i}
                fill={
                    fill
                        ? fill === true
                            ? "currentcolor"
                            : setFill(fill)
                        : fill !== undefined
                        ? ""
                        : "var(--G_500)"
                }
            />
        ))}
    </Svg>
);

/**
 * @param {
 * size: 'string' | 'number'
 * }
 */
Icon.Rocket = ({ size = "md", fill, ...props }) => (
    <Svg $width={setSize(size)} viewBox="0 0 24 24" {...props}>
        {defaultIcons.Rocket?.map((i, key) => (
            <path
                key={key}
                d={i}
                fill={
                    fill
                        ? fill === true
                            ? "currentcolor"
                            : setFill(fill)
                        : fill !== undefined
                        ? ""
                        : "var(--G_500)"
                }
            />
        ))}
    </Svg>
);

/**
 * @param {
 * size?: 'string' | 'number';
 * fill?;
 * }
 */
Icon.CancelEdit = ({ size = "md", fill, ...props }) => (
    <Svg $width={setSize(size)} viewBox="0 0 24 24" {...props}>
        {defaultIcons.CancelEdit?.map((i, key) => (
            <path
                key={key}
                d={i}
                fill={
                    fill
                        ? fill === true
                            ? "currentcolor"
                            : setFill(fill)
                        : fill !== undefined
                        ? ""
                        : "var(--G_500)"
                }
            />
        ))}
    </Svg>
);

/**
 * @param {
 * size: 'string' | 'number'
 * }
 */
Icon.Check = ({ size = "md", fill, ...props }) => (
    <Svg $width={setSize(size)} viewBox="0 0 24 24" {...props}>
        {defaultIcons.Check?.map((i, key) => (
            <path
                key={key}
                d={i}
                fill={
                    fill
                        ? fill === true
                            ? "currentcolor"
                            : setFill(fill)
                        : fill !== undefined
                        ? ""
                        : "var(--G_500)"
                }
            />
        ))}
    </Svg>
);

/**
 * @param {
 * size: 'string' | 'number'
 * }
 */
Icon.Trash = ({ size = "md", fill, ...props }) => (
    <Svg $width={setSize(size)} viewBox="0 0 24 24" {...props}>
        {defaultIcons.Trash?.map((i, key) => (
            <path
                key={key}
                d={i}
                fill={
                    fill
                        ? fill === true
                            ? "currentcolor"
                            : setFill(fill)
                        : fill !== undefined
                        ? ""
                        : "var(--G_500)"
                }
            />
        ))}
    </Svg>
);

/**
 * @param {
 * size: 'string' | 'number'
 * }
 */
Icon.Star = ({ size = "md", fill, ...props }) => (
    <Svg $width={setSize(size)} viewBox="0 0 24 24" {...props}>
        {defaultIcons.Star?.map((i, key) => (
            <path
                key={key}
                d={i}
                fill={
                    fill
                        ? fill === true
                            ? "currentcolor"
                            : setFill(fill)
                        : fill !== undefined
                        ? ""
                        : "var(--G_500)"
                }
            />
        ))}
    </Svg>
);

/**
 * @param {
 * size?: 'string' | 'number';
 * fill?;
 * }
 */
Icon.Edit = ({ size = "md", fill, ...props }) => (
    <Svg $width={setSize(size)} viewBox="0 0 24 24" {...props}>
        {defaultIcons.Edit?.map((i, key) => (
            <path
                key={key}
                d={i}
                fill={
                    fill
                        ? fill === true
                            ? "currentcolor"
                            : setFill(fill)
                        : fill !== undefined
                        ? ""
                        : "var(--G_500)"
                }
            />
        ))}
    </Svg>
);

/**
 * @param {
 * size?: 'string' | 'number';
 * fill?;
 * }
 */
Icon.Refresh = ({ size = "md", fill, ...props }) => (
    <Svg $width={setSize(size)} viewBox="0 0 24 24" {...props}>
        {defaultIcons.Refresh?.map((i, key) => (
            <path
                key={key}
                d={i}
                fill={
                    fill
                        ? fill === true
                            ? "currentcolor"
                            : setFill(fill)
                        : fill !== undefined
                        ? ""
                        : "var(--G_500)"
                }
            />
        ))}
    </Svg>
);

/**
 * @param {
 * size: 'string' | 'number'
 * }
 */
Icon.Closer = ({ size = "md", fill, ...props }) => (
    <Svg $width={setSize(size)} viewBox="0 0 24 24" {...props}>
        {defaultIcons.Closer?.map((i, key) => (
            <path
                key={key}
                d={i}
                fill={
                    fill
                        ? fill === true
                            ? "currentcolor"
                            : setFill(fill)
                        : fill !== undefined
                        ? ""
                        : "grayscale.g500"
                }
            />
        ))}
    </Svg>
);

/**
 * @param {
 * size: 'string' | 'number'
 * }
 */
Icon.Eyes = ({ size = "md", fill, ...props }) => (
    <Svg $width={setSize(size)} viewBox="0 0 24 24" {...props}>
        {defaultIcons.Eyes?.map((i, key) => (
            <path
                key={key}
                d={i}
                fill={
                    fill
                        ? fill === true
                            ? "currentcolor"
                            : setFill(fill)
                        : fill !== undefined
                        ? ""
                        : "var(--G_500)"
                }
            />
        ))}
    </Svg>
);

/**
 * @param {
 * size: 'string' | 'number'
 * }
 */
Icon.Copy = ({ size = "md", fill, ...props }) => (
    <Svg $width={setSize(size)} viewBox="0 0 24 24" {...props}>
        {defaultIcons.Copy?.map((i, key) => (
            <path
                key={key}
                d={i}
                fill={
                    fill
                        ? fill === true
                            ? "currentcolor"
                            : setFill(fill)
                        : fill !== undefined
                        ? ""
                        : "var(--G_500)"
                }
            />
        ))}
    </Svg>
);

/**
 * @param {
 * size: 'string' | 'number'
 * }
 */
Icon.Cut = ({ size = "md", fill, ...props }) => (
    <Svg $width={setSize(size)} viewBox="0 0 24 24" {...props}>
        {defaultIcons.Cut?.map((i, key) => (
            <path
                key={key}
                d={i}
                fill={
                    fill
                        ? fill === true
                            ? "currentcolor"
                            : setFill(fill)
                        : fill !== undefined
                        ? ""
                        : "var(--G_500)"
                }
            />
        ))}
    </Svg>
);

/**
 * @param {
 * size: 'string' | 'number'
 * }
 */
Icon.Paste = ({ size = "md", fill, ...props }) => (
    <Svg $width={setSize(size)} viewBox="0 0 24 24" {...props}>
        {defaultIcons.Paste?.map((i, key) => (
            <path
                key={key}
                d={i}
                fill={
                    fill
                        ? fill === true
                            ? "currentcolor"
                            : setFill(fill)
                        : fill !== undefined
                        ? ""
                        : "var(--G_500)"
                }
            />
        ))}
    </Svg>
);

// 활성화 여부 아이콘
(() => {
    for (let name in activeIcons) {
        Icon[name] = ({
            size = "md",
            checked,
            isActive,
            fill,
            full,
            ...props
        }) => (
            <Svg $width={setSize(size)} viewBox="0 0 24 24" {...props}>
                <path
                    d={activeIcons[name]({ isActive, full, checked })}
                    fill={
                        fill
                            ? fill === true
                                ? "currentcolor"
                                : setFill(fill)
                            : fill !== undefined
                            ? ""
                            : "var(--G_500)"
                    }
                />
            </Svg>
        );
    }
})();

const setDirection = (direction) => {
    switch (direction) {
        case "left":
            return css`
                transform: rotate(90deg);
            `;
        case "right":
            return css`
                transform: rotate(-90deg);
            `;
        case "top":
            return css`
                transform: rotate(180deg);
            `;
        case "bottom":
        default:
            return "";
    }
};

// 방향 옵션 아이콘
(() => {
    for (let name in directionIcons) {
        Icon[name] = ({ size = "md", direction, fill }) => (
            <Svg
                $width={setSize(size)}
                $style={setDirection(direction)}
                viewBox="0 0 24 24"
            >
                {directionIcons[name]?.map((i, key) => (
                    <path
                        key={key}
                        d={i}
                        fill={
                            fill
                                ? fill === true
                                    ? "currentcolor"
                                    : setFill(fill)
                                : fill !== undefined
                                ? ""
                                : "var(--G_500)"
                        }
                    />
                ))}
            </Svg>
        );
    }
})();

Icon.Protecto = ({ size = "md" || 28 }) => {
    return (
        <Svg $width={setSize(size)} viewBox="0 0 24 24" fill="none">
            <path
                d="M14.8286 4.85718V10.5715L20.5429 13.4286V7.71432L14.8286 4.85718Z"
                fill="#FFC73A"
            />
            <path
                d="M14.8285 10.5714L9.11426 13.4286L14.8285 16.2857L20.5428 13.4286L14.8285 10.5714Z"
                fill="#FFC73A"
            />
            <path
                d="M9.11419 2L3.3999 4.85714L9.11419 7.71429L14.8285 4.85714L9.11419 2Z"
                fill="#4AD3FF"
            />
            <path
                d="M3.3999 4.85718V22L9.11419 19.1429V7.71432L3.3999 4.85718Z"
                fill="#0663FF"
            />
        </Svg>
    );
};

/**
 * @param {
 * size: 'string' | 'number'
 * }
 */
Icon.Dot = ({ size = "md", fill }) => {
    return (
        <Svg $width={setSize(size)} viewBox="0 0 24 24" fill="none">
            <circle
                cx="12"
                cy="12"
                r="4"
                fill={
                    fill
                        ? fill === true
                            ? "currentcolor"
                            : setFill(fill)
                        : fill !== undefined
                        ? ""
                        : "var(--G_500)"
                }
            />
        </Svg>
    );
};

/**
 *
 * @param {{
 * size?: string;
 * checked?: string;
 * isActive?: boolean;
 * fill?: string;
 * full?: string;
 * props?: string;
 * }}
 * @returns
 */
Icon.PM = ({ size = "md", checked, isActive, fill, full, ...props }) => (
    <Svg $width={setSize(size)} viewBox="0 0 24 24" {...props}>
        <path
            d={activeIcons.PM({ isActive, full, checked })}
            fill={
                fill
                    ? fill === true
                        ? "currentcolor"
                        : setFill(fill)
                    : fill !== undefined
                    ? ""
                    : "var(--G_500)"
            }
        />
    </Svg>
);

/**
 *
 * @param {{
 * size?: string|number;
 * isActive?: boolean;
 * fill?: string;
 * full?: boolean;
 * }}
 * @returns
 */
Icon.User = ({ size = "md", isActive, fill, full, ...props }) => (
    <Svg $width={setSize(size)} viewBox="0 0 24 24" {...props}>
        <path
            d={activeIcons.User({ isActive, full })}
            fill={
                fill
                    ? fill === true
                        ? "currentcolor"
                        : setFill(fill)
                    : fill !== undefined
                    ? ""
                    : "var(--G_500)"
            }
        />
    </Svg>
);

/**
 *
 * @param {{
 * size?: string | number;
 * isActive?: boolean;
 * fill?: string;
 * }}
 * @returns
 */
Icon.FolderLine = ({ size = "md", isActive, fill, ...props }) => (
    <Svg $width={setSize(size)} viewBox="0 0 24 24" {...props}>
        <path
            d={activeIcons.FolderLine({ isActive })}
            fill={
                fill
                    ? fill === true
                        ? "currentcolor"
                        : setFill(fill)
                    : fill !== undefined
                    ? ""
                    : "var(--G_500)"
            }
        />
    </Svg>
);

/**
 *
 * @param {{
 * size?: string | number;
 * isActive?: boolean;
 * fill?: string;
 * }}
 * @returns
 */
Icon.Link = ({ size = "md", isActive = true, fill, ...props }) => (
    <Svg $width={setSize(size)} viewBox="0 0 24 24" {...props}>
        <path
            d={activeIcons.Link({ isActive })}
            fill={
                fill
                    ? fill === true
                        ? "currentcolor"
                        : setFill(fill)
                    : fill !== undefined
                    ? ""
                    : "var(--G_500)"
            }
        />
    </Svg>
);

/**
 *
 * @param {{
 * size?: string | number;
 * checked?: string;
 * isActive?: boolean;
 * fill?: string;
 * full?: string;
 * props?: string;
 * }}
 * @returns
 */
Icon.CloudLoad = ({ size = "md", checked, isActive, fill, full, ...props }) => (
    <Svg $width={setSize(size)} viewBox="0 0 24 24" {...props}>
        <path
            d={activeIcons.CloudLoad({ isActive, full, checked })}
            fill={
                fill
                    ? fill === true
                        ? "currentcolor"
                        : setFill(fill)
                    : fill !== undefined
                    ? ""
                    : "var(--G_500)"
            }
        />
    </Svg>
);

/**
 *
 * @param {{
 * size?: string | number;
 * direction?: string;
 * fill?: string | boolean;
 * }}
 * @returns
 */
Icon.Arrow = ({ size = "md", direction, fill }) => (
    <Svg
        $width={setSize(size)}
        $style={setDirection(direction)}
        viewBox="0 0 24 24"
    >
        {directionIcons.Arrow?.map((i, key) => (
            <path
                key={key}
                d={i}
                fill={
                    fill
                        ? fill === true
                            ? "currentcolor"
                            : setFill(fill)
                        : fill !== undefined
                        ? ""
                        : "var(--G_500)"
                }
            />
        ))}
    </Svg>
);

/**
 *
 * @param {{
 * size?: string | number
 * direction?: string
 * fill?: string
 * }}
 * @returns
 */
Icon.RodArrow = ({ size = "md", direction, fill }) => (
    <Svg
        $width={setSize(size)}
        $style={setDirection(direction)}
        viewBox="0 0 24 24"
    >
        {directionIcons.RodArrow?.map((i, key) => (
            <path
                key={key}
                d={i}
                fill={
                    fill
                        ? fill === true
                            ? "currentcolor"
                            : setFill(fill)
                        : fill !== undefined
                        ? ""
                        : "var(--G_500)"
                }
            />
        ))}
    </Svg>
);

// isActive: true -> 그룹화
// isActive: false -> 그룹 해제
Icon.Grouping = ({ size = "md", isActive = true, fill }) => {
    const fillColor = fill
        ? fill === true
            ? "currentcolor"
            : setFill(fill)
        : fill !== undefined
        ? ""
        : "var(--G_500)";
    return (
        <Svg $width={setSize(size)} viewBox="0 0 24 24">
            {isActive ? (
                <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M8.87402 20C8.42993 21.7252 6.86377 23 5 23C2.79089 23 1 21.2091 1 19C1 17.1362 2.27478 15.5701 4 15.126V8.87402C2.27478 8.42993 1 6.86377 1 5C1 2.79089 2.79089 1 5 1C6.86377 1 8.42993 2.27478 8.87402 4H15.126C15.5701 2.27478 17.1362 1 19 1C21.2091 1 23 2.79089 23 5C23 6.86377 21.7252 8.42993 20 8.87402V15.126C21.7252 15.5701 23 17.1362 23 19C23 21.2091 21.2091 23 19 23C17.1362 23 15.5701 21.7252 15.126 20H8.87402ZM6 8.87402C7.40552 8.51221 8.51221 7.40564 8.87402 6H15.126C15.4878 7.40564 16.5945 8.51221 18 8.87402V15.126C16.5944 15.4878 15.4878 16.5945 15.126 18H8.87402C8.51221 16.5945 7.40564 15.4878 6 15.126V8.87402ZM7 5C7 6.10461 6.10461 7 5 7C3.89539 7 3 6.10461 3 5C3 3.89539 3.89539 3 5 3C6.10461 3 7 3.89539 7 5ZM7 19C7 20.1046 6.10461 21 5 21C3.89539 21 3 20.1046 3 19C3 17.8954 3.89539 17 5 17C6.10461 17 7 17.8954 7 19ZM19 7C20.1046 7 21 6.10461 21 5C21 3.89539 20.1046 3 19 3C17.8954 3 17 3.89539 17 5C17 6.10461 17.8954 7 19 7ZM21 19C21 20.1046 20.1046 21 19 21C17.8954 21 17 20.1046 17 19C17 17.8954 17.8954 17 19 17C20.1046 17 21 17.8954 21 19Z"
                    fill={fillColor}
                />
            ) : (
                <>
                    <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M5 9C7.20911 9 9 7.20911 9 5C9 2.79089 7.20911 1 5 1C2.79089 1 1 2.79089 1 5C1 7.20911 2.79089 9 5 9ZM5 7C6.10461 7 7 6.10461 7 5C7 3.89539 6.10461 3 5 3C3.89539 3 3 3.89539 3 5C3 6.10461 3.89539 7 5 7Z"
                        fill={fillColor}
                    />
                    <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M5 23C7.20911 23 9 21.2091 9 19C9 16.7909 7.20911 15 5 15C2.79089 15 1 16.7909 1 19C1 21.2091 2.79089 23 5 23ZM5 21C6.10461 21 7 20.1046 7 19C7 17.8954 6.10461 17 5 17C3.89539 17 3 17.8954 3 19C3 20.1046 3.89539 21 5 21Z"
                        fill={fillColor}
                    />
                    <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M19 9C21.2091 9 23 7.20911 23 5C23 2.79089 21.2091 1 19 1C16.7909 1 15 2.79089 15 5C15 7.20911 16.7909 9 19 9ZM19 7C20.1046 7 21 6.10461 21 5C21 3.89539 20.1046 3 19 3C17.8954 3 17 3.89539 17 5C17 6.10461 17.8954 7 19 7Z"
                        fill={fillColor}
                    />
                    <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M19 23C21.2091 23 23 21.2091 23 19C23 16.7909 21.2091 15 19 15C16.7909 15 15 16.7909 15 19C15 21.2091 16.7909 23 19 23ZM19 21C20.1046 21 21 20.1046 21 19C21 17.8954 20.1046 17 19 17C17.8954 17 17 17.8954 17 19C17 20.1046 17.8954 21 19 21Z"
                        fill={fillColor}
                    />
                </>
            )}
        </Svg>
    );
};

Icon.Warning = ({ size = "md", fill = undefined, full = false }) => {
    return (
        <Svg $width={setSize(size)} viewBox="0 0 24 24">
            <path
                d={
                    full
                        ? "M2.725 21C2.34167 21 2.05834 20.8333 1.875 20.5C1.69167 20.1667 1.69167 19.8333 1.875 19.5L11.125 3.5C11.3083 3.16667 11.6 3 12 3C12.4 3 12.6917 3.16667 12.875 3.5L22.125 19.5C22.3083 19.8333 22.3083 20.1667 22.125 20.5C21.9417 20.8333 21.6583 21 21.275 21H2.725ZM12 10C11.7167 10 11.4793 10.0957 11.288 10.287C11.096 10.479 11 10.7167 11 11V14C11 14.2833 11.096 14.5207 11.288 14.712C11.4793 14.904 11.7167 15 12 15C12.2833 15 12.521 14.904 12.713 14.712C12.9043 14.5207 13 14.2833 13 14V11C13 10.7167 12.9043 10.479 12.713 10.287C12.521 10.0957 12.2833 10 12 10ZM12 18C12.2833 18 12.521 17.904 12.713 17.712C12.9043 17.5207 13 17.2833 13 17C13 16.7167 12.9043 16.4793 12.713 16.288C12.521 16.096 12.2833 16 12 16C11.7167 16 11.4793 16.096 11.288 16.288C11.096 16.4793 11 16.7167 11 17C11 17.2833 11.096 17.5207 11.288 17.712C11.4793 17.904 11.7167 18 12 18Z"
                        : "M2.725 21C2.34167 21 2.05834 20.8333 1.875 20.5C1.69167 20.1667 1.69167 19.8333 1.875 19.5L11.125 3.5C11.3083 3.16667 11.6 3 12 3C12.4 3 12.6917 3.16667 12.875 3.5L22.125 19.5C22.3083 19.8333 22.3083 20.1667 22.125 20.5C21.9417 20.8333 21.6583 21 21.275 21H2.725ZM12 10C11.7167 10 11.4793 10.0957 11.288 10.287C11.096 10.479 11 10.7167 11 11V14C11 14.2833 11.096 14.5207 11.288 14.712C11.4793 14.904 11.7167 15 12 15C12.2833 15 12.521 14.904 12.713 14.712C12.9043 14.5207 13 14.2833 13 14V11C13 10.7167 12.9043 10.479 12.713 10.287C12.521 10.0957 12.2833 10 12 10ZM12 18C12.2833 18 12.521 17.904 12.713 17.712C12.9043 17.5207 13 17.2833 13 17C13 16.7167 12.9043 16.4793 12.713 16.288C12.521 16.096 12.2833 16 12 16C11.7167 16 11.4793 16.096 11.288 16.288C11.096 16.4793 11 16.7167 11 17C11 17.2833 11.096 17.5207 11.288 17.712C11.4793 17.904 11.7167 18 12 18ZM4.45 19H19.55L12 6L4.45 19Z"
                }
                fill={
                    fill
                        ? fill === true
                            ? "currentcolor"
                            : setFill(fill)
                        : fill !== undefined
                        ? ""
                        : "var(--Warning_600)"
                }
            />
        </Svg>
    );
};

Icon.Complete = ({ size = "md", full, fill }) => {
    return (
        <Svg $width={setSize(size)} viewBox="0 0 24 24">
            <path
                fill={
                    fill
                        ? fill === true
                            ? "currentcolor"
                            : setFill(fill)
                        : fill !== undefined
                        ? ""
                        : "var(--Success_500)"
                }
                d={
                    full
                        ? "M10.6 13.8L8.425 11.625C8.24167 11.4417 8.01667 11.35 7.75 11.35C7.48333 11.35 7.25 11.45 7.05 11.65C6.86667 11.8333 6.775 12.0667 6.775 12.35C6.775 12.6333 6.86667 12.8667 7.05 13.05L9.9 15.9C10.0833 16.0833 10.3167 16.175 10.6 16.175C10.8833 16.175 11.1167 16.0833 11.3 15.9L16.975 10.225C17.1583 10.0417 17.25 9.81667 17.25 9.55C17.25 9.28333 17.15 9.05 16.95 8.85C16.7667 8.66667 16.5333 8.575 16.25 8.575C15.9667 8.575 15.7333 8.66667 15.55 8.85L10.6 13.8ZM12 22C10.6167 22 9.31667 21.7373 8.1 21.212C6.88333 20.6873 5.825 19.975 4.925 19.075C4.025 18.175 3.31267 17.1167 2.788 15.9C2.26267 14.6833 2 13.3833 2 12C2 10.6167 2.26267 9.31667 2.788 8.1C3.31267 6.88333 4.025 5.825 4.925 4.925C5.825 4.025 6.88333 3.31233 8.1 2.787C9.31667 2.26233 10.6167 2 12 2C13.3833 2 14.6833 2.26233 15.9 2.787C17.1167 3.31233 18.175 4.025 19.075 4.925C19.975 5.825 20.6873 6.88333 21.212 8.1C21.7373 9.31667 22 10.6167 22 12C22 13.3833 21.7373 14.6833 21.212 15.9C20.6873 17.1167 19.975 18.175 19.075 19.075C18.175 19.975 17.1167 20.6873 15.9 21.212C14.6833 21.7373 13.3833 22 12 22Z"
                        : "M10.6 13.8L8.425 11.625C8.24167 11.4417 8.01267 11.3543 7.738 11.363C7.46267 11.371 7.23333 11.4667 7.05 11.65C6.86667 11.8333 6.775 12.0667 6.775 12.35C6.775 12.6333 6.86667 12.8667 7.05 13.05L9.9 15.9C10.0833 16.0833 10.3167 16.175 10.6 16.175C10.8833 16.175 11.1167 16.0833 11.3 15.9L16.975 10.225C17.1583 10.0417 17.246 9.81233 17.238 9.537C17.2293 9.26233 17.1333 9.03333 16.95 8.85C16.7667 8.66667 16.5333 8.575 16.25 8.575C15.9667 8.575 15.7333 8.66667 15.55 8.85L10.6 13.8ZM12 22C10.6167 22 9.31667 21.7373 8.1 21.212C6.88333 20.6873 5.825 19.975 4.925 19.075C4.025 18.175 3.31267 17.1167 2.788 15.9C2.26267 14.6833 2 13.3833 2 12C2 10.6167 2.26267 9.31667 2.788 8.1C3.31267 6.88333 4.025 5.825 4.925 4.925C5.825 4.025 6.88333 3.31233 8.1 2.787C9.31667 2.26233 10.6167 2 12 2C13.3833 2 14.6833 2.26233 15.9 2.787C17.1167 3.31233 18.175 4.025 19.075 4.925C19.975 5.825 20.6873 6.88333 21.212 8.1C21.7373 9.31667 22 10.6167 22 12C22 13.3833 21.7373 14.6833 21.212 15.9C20.6873 17.1167 19.975 18.175 19.075 19.075C18.175 19.975 17.1167 20.6873 15.9 21.212C14.6833 21.7373 13.3833 22 12 22ZM12 20C14.2167 20 16.1043 19.221 17.663 17.663C19.221 16.1043 20 14.2167 20 12C20 9.78333 19.221 7.89567 17.663 6.337C16.1043 4.779 14.2167 4 12 4C9.78333 4 7.896 4.779 6.338 6.337C4.77933 7.89567 4 9.78333 4 12C4 14.2167 4.77933 16.1043 6.338 17.663C7.896 19.221 9.78333 20 12 20Z"
                }
            />
        </Svg>
    );
};

Icon.Danger = ({ size = "md", fill, full }) => {
    return (
        <Svg $width={setSize(size)} viewBox="0 0 24 24">
            <path
                d={
                    full
                        ? "M13.425 21.45C13.225 21.65 13.004 21.7956 12.762 21.887C12.5207 21.979 12.2667 22.025 12 22.025C11.7333 22.025 11.4793 21.979 11.238 21.887C10.996 21.7956 10.775 21.65 10.575 21.45L2.55 13.425C2.35 13.225 2.204 13.004 2.112 12.762C2.02067 12.5206 1.975 12.2666 1.975 12C1.975 11.7333 2.02067 11.4793 2.112 11.238C2.204 10.996 2.35 10.775 2.55 10.575L10.575 2.54998C10.775 2.34998 10.996 2.20398 11.238 2.11198C11.4793 2.02064 11.7333 1.97498 12 1.97498C12.2667 1.97498 12.5207 2.02064 12.762 2.11198C13.004 2.20398 13.225 2.34998 13.425 2.54998L21.45 10.575C21.65 10.775 21.796 10.996 21.888 11.238C21.9793 11.4793 22.025 11.7333 22.025 12C22.025 12.2666 21.9793 12.5206 21.888 12.762C21.796 13.004 21.65 13.225 21.45 13.425L13.425 21.45ZM12 13C12.2833 13 12.521 12.904 12.713 12.712C12.9043 12.5206 13 12.2833 13 12V7.99998C13 7.71664 12.9043 7.47898 12.713 7.28698C12.521 7.09564 12.2833 6.99998 12 6.99998C11.7167 6.99998 11.4793 7.09564 11.288 7.28698C11.096 7.47898 11 7.71664 11 7.99998V12C11 12.2833 11.096 12.5206 11.288 12.712C11.4793 12.904 11.7167 13 12 13ZM12 16C12.2833 16 12.521 15.904 12.713 15.712C12.9043 15.5206 13 15.2833 13 15C13 14.7166 12.9043 14.479 12.713 14.287C12.521 14.0956 12.2833 14 12 14C11.7167 14 11.4793 14.0956 11.288 14.287C11.096 14.479 11 14.7166 11 15C11 15.2833 11.096 15.5206 11.288 15.712C11.4793 15.904 11.7167 16 12 16Z"
                        : "M13.425 21.45C13.225 21.65 13.004 21.7956 12.762 21.887C12.5207 21.979 12.2667 22.025 12 22.025C11.7333 22.025 11.4793 21.979 11.238 21.887C10.996 21.7956 10.775 21.65 10.575 21.45L2.55 13.425C2.35 13.225 2.204 13.004 2.112 12.762C2.02067 12.5206 1.975 12.2666 1.975 12C1.975 11.7333 2.02067 11.4793 2.112 11.238C2.204 10.996 2.35 10.775 2.55 10.575L10.575 2.54998C10.775 2.34998 10.996 2.20398 11.238 2.11198C11.4793 2.02064 11.7333 1.97498 12 1.97498C12.2667 1.97498 12.5207 2.02064 12.762 2.11198C13.004 2.20398 13.225 2.34998 13.425 2.54998L21.45 10.575C21.65 10.775 21.796 10.996 21.888 11.238C21.9793 11.4793 22.025 11.7333 22.025 12C22.025 12.2666 21.9793 12.5206 21.888 12.762C21.796 13.004 21.65 13.225 21.45 13.425L13.425 21.45ZM12 20.025L20.025 12L12 3.97498L3.975 12L12 20.025ZM12 13C12.2833 13 12.521 12.904 12.713 12.712C12.9043 12.5206 13 12.2833 13 12V7.99998C13 7.71664 12.9043 7.47898 12.713 7.28698C12.521 7.09564 12.2833 6.99998 12 6.99998C11.7167 6.99998 11.4793 7.09564 11.288 7.28698C11.096 7.47898 11 7.71664 11 7.99998V12C11 12.2833 11.096 12.5206 11.288 12.712C11.4793 12.904 11.7167 13 12 13ZM12 16C12.2833 16 12.521 15.904 12.713 15.712C12.9043 15.5206 13 15.2833 13 15C13 14.7166 12.9043 14.479 12.713 14.287C12.521 14.0956 12.2833 14 12 14C11.7167 14 11.4793 14.0956 11.288 14.287C11.096 14.479 11 14.7166 11 15C11 15.2833 11.096 15.5206 11.288 15.712C11.4793 15.904 11.7167 16 12 16Z"
                }
                fill={
                    fill
                        ? fill === true
                            ? "currentcolor"
                            : setFill(fill)
                        : fill !== undefined
                        ? ""
                        : "var(--Error_500)"
                }
            />
        </Svg>
    );
};

/**
 *
 * @param {{
 * size?: string | number
 * full?: boolean
 * fill?: string | boolean
 * }}
 * @returns
 */
Icon.Info = ({ size = "md", full, fill = false }) => {
    return (
        <Svg $width={setSize(size)} viewBox="0 0 24 24">
            <path
                d={
                    full
                        ? "M12 17C12.2833 17 12.521 16.904 12.713 16.712C12.9043 16.5207 13 16.2833 13 16V11.975C13 11.6917 12.9043 11.4583 12.713 11.275C12.521 11.0917 12.2833 11 12 11C11.7167 11 11.4793 11.0957 11.288 11.287C11.096 11.479 11 11.7167 11 12V16.025C11 16.3083 11.096 16.5417 11.288 16.725C11.4793 16.9083 11.7167 17 12 17ZM12 9C12.2833 9 12.521 8.904 12.713 8.712C12.9043 8.52067 13 8.28333 13 8C13 7.71667 12.9043 7.479 12.713 7.287C12.521 7.09567 12.2833 7 12 7C11.7167 7 11.4793 7.09567 11.288 7.287C11.096 7.479 11 7.71667 11 8C11 8.28333 11.096 8.52067 11.288 8.712C11.4793 8.904 11.7167 9 12 9ZM12 22C10.6167 22 9.31667 21.7373 8.1 21.212C6.88333 20.6873 5.825 19.975 4.925 19.075C4.025 18.175 3.31267 17.1167 2.788 15.9C2.26267 14.6833 2 13.3833 2 12C2 10.6167 2.26267 9.31667 2.788 8.1C3.31267 6.88333 4.025 5.825 4.925 4.925C5.825 4.025 6.88333 3.31233 8.1 2.787C9.31667 2.26233 10.6167 2 12 2C13.3833 2 14.6833 2.26233 15.9 2.787C17.1167 3.31233 18.175 4.025 19.075 4.925C19.975 5.825 20.6873 6.88333 21.212 8.1C21.7373 9.31667 22 10.6167 22 12C22 13.3833 21.7373 14.6833 21.212 15.9C20.6873 17.1167 19.975 18.175 19.075 19.075C18.175 19.975 17.1167 20.6873 15.9 21.212C14.6833 21.7373 13.3833 22 12 22Z"
                        : "M12 17C12.2833 17 12.521 16.904 12.713 16.712C12.9043 16.5207 13 16.2833 13 16V11.975C13 11.6917 12.9043 11.4583 12.713 11.275C12.521 11.0917 12.2833 11 12 11C11.7167 11 11.4793 11.0957 11.288 11.287C11.096 11.479 11 11.7167 11 12V16.025C11 16.3083 11.096 16.5417 11.288 16.725C11.4793 16.9083 11.7167 17 12 17ZM12 9C12.2833 9 12.521 8.904 12.713 8.712C12.9043 8.52067 13 8.28333 13 8C13 7.71667 12.9043 7.479 12.713 7.287C12.521 7.09567 12.2833 7 12 7C11.7167 7 11.4793 7.09567 11.288 7.287C11.096 7.479 11 7.71667 11 8C11 8.28333 11.096 8.52067 11.288 8.712C11.4793 8.904 11.7167 9 12 9ZM12 22C10.6167 22 9.31667 21.7373 8.1 21.212C6.88333 20.6873 5.825 19.975 4.925 19.075C4.025 18.175 3.31267 17.1167 2.788 15.9C2.26267 14.6833 2 13.3833 2 12C2 10.6167 2.26267 9.31667 2.788 8.1C3.31267 6.88333 4.025 5.825 4.925 4.925C5.825 4.025 6.88333 3.31233 8.1 2.787C9.31667 2.26233 10.6167 2 12 2C13.3833 2 14.6833 2.26233 15.9 2.787C17.1167 3.31233 18.175 4.025 19.075 4.925C19.975 5.825 20.6873 6.88333 21.212 8.1C21.7373 9.31667 22 10.6167 22 12C22 13.3833 21.7373 14.6833 21.212 15.9C20.6873 17.1167 19.975 18.175 19.075 19.075C18.175 19.975 17.1167 20.6873 15.9 21.212C14.6833 21.7373 13.3833 22 12 22ZM12 20C14.2167 20 16.1043 19.221 17.663 17.663C19.221 16.1043 20 14.2167 20 12C20 9.78333 19.221 7.89567 17.663 6.337C16.1043 4.779 14.2167 4 12 4C9.78333 4 7.896 4.779 6.338 6.337C4.77933 7.89567 4 9.78333 4 12C4 14.2167 4.77933 16.1043 6.338 17.663C7.896 19.221 9.78333 20 12 20Z"
                }
                fill={
                    fill
                        ? fill === true
                            ? "currentcolor"
                            : setFill(fill)
                        : fill !== undefined
                        ? ""
                        : "var(--P_500)"
                }
            />
        </Svg>
    );
};

/**
 *
 * @param {
 * size: string | number
 * }
 * @returns
 */
Icon.CircleX = ({ size = 24, fill }) => {
    return (
        <Svg $width={setSize(size)} viewBox="0 0 24 24">
            <path
                d="M7.7 16.3C7.88333 16.4833 8.11667 16.575 8.4 16.575C8.68333 16.575 8.91667 16.4833 9.1 16.3L12 13.4L14.925 16.325C15.1083 16.5083 15.3377 16.5957 15.613 16.587C15.8877 16.579 16.1167 16.4833 16.3 16.3C16.4833 16.1167 16.575 15.8833 16.575 15.6C16.575 15.3167 16.4833 15.0833 16.3 14.9L13.4 12L16.325 9.075C16.5083 8.89167 16.5957 8.66233 16.587 8.387C16.579 8.11233 16.4833 7.88333 16.3 7.7C16.1167 7.51667 15.8833 7.425 15.6 7.425C15.3167 7.425 15.0833 7.51667 14.9 7.7L12 10.6L9.075 7.675C8.89167 7.49167 8.66267 7.404 8.388 7.412C8.11267 7.42067 7.88333 7.51667 7.7 7.7C7.51667 7.88333 7.425 8.11667 7.425 8.4C7.425 8.68333 7.51667 8.91667 7.7 9.1L10.6 12L7.675 14.925C7.49167 15.1083 7.40433 15.3373 7.413 15.612C7.421 15.8873 7.51667 16.1167 7.7 16.3ZM12 22C10.6167 22 9.31667 21.7373 8.1 21.212C6.88333 20.6873 5.825 19.975 4.925 19.075C4.025 18.175 3.31267 17.1167 2.788 15.9C2.26267 14.6833 2 13.3833 2 12C2 10.6167 2.26267 9.31667 2.788 8.1C3.31267 6.88333 4.025 5.825 4.925 4.925C5.825 4.025 6.88333 3.31233 8.1 2.787C9.31667 2.26233 10.6167 2 12 2C13.3833 2 14.6833 2.26233 15.9 2.787C17.1167 3.31233 18.175 4.025 19.075 4.925C19.975 5.825 20.6873 6.88333 21.212 8.1C21.7373 9.31667 22 10.6167 22 12C22 13.3833 21.7373 14.6833 21.212 15.9C20.6873 17.1167 19.975 18.175 19.075 19.075C18.175 19.975 17.1167 20.6873 15.9 21.212C14.6833 21.7373 13.3833 22 12 22ZM12 20C14.2167 20 16.1043 19.221 17.663 17.663C19.221 16.1043 20 14.2167 20 12C20 9.78333 19.221 7.89567 17.663 6.337C16.1043 4.779 14.2167 4 12 4C9.78333 4 7.896 4.779 6.338 6.337C4.77933 7.89567 4 9.78333 4 12C4 14.2167 4.77933 16.1043 6.338 17.663C7.896 19.221 9.78333 20 12 20Z"
                fill={
                    fill
                        ? fill === true
                            ? "currentcolor"
                            : setFill(fill)
                        : fill !== undefined
                        ? ""
                        : "#3C69FC"
                }
            />
        </Svg>
    );
};

/**
 *
 * @param {
 * size?: string | number
 * }
 * @returns
 */
Icon.Minus = ({ size = 24 }) => {
    return (
        <Svg $width={setSize(size)} viewBox="0 0 14 2">
            <path
                d="M1 2C0.716667 2 0.479 1.904 0.287 1.712C0.0956668 1.52067 0 1.28333 0 1C0 0.716667 0.0956668 0.479 0.287 0.287C0.479 0.0956664 0.716667 0 1 0H13C13.2833 0 13.5207 0.0956664 13.712 0.287C13.904 0.479 14 0.716667 14 1C14 1.28333 13.904 1.52067 13.712 1.712C13.5207 1.904 13.2833 2 13 2H1Z"
                fill="var(--Error_500)"
            />
        </Svg>
    );
};

Icon.CheckBox = ({ isActive, hover, disabled, size = "xs" }) => {
    return (
        <Svg $width={setSize(size)} viewBox="0 0 20 20">
            <path
                fill={
                    disabled
                        ? "var(--G_50)"
                        : isActive
                        ? "var(--P_50)"
                        : hover
                        ? "var(--P_50)"
                        : "var(--White)"
                }
                className="background"
                d="M0 2C0 0.895431 0.895431 0 2 0H18C19.1046 0 20 0.895431 20 2V18C20 19.1046 19.1046 20 18 20H2C0.895431 20 0 19.1046 0 18V2Z"
            />
            <path
                className="stroke"
                fill={
                    disabled
                        ? "var(--G_100)"
                        : isActive
                        ? "var(--P_700)"
                        : hover
                        ? "var(--P_500)"
                        : "#C4C9DF"
                }
                d="M17.5 1.25C18.1904 1.25 18.75 1.80964 18.75 2.5V17.5C18.75 18.1904 18.1904 18.75 17.5 18.75H2.5C1.80964 18.75 1.25 18.1904 1.25 17.5V2.5C1.25 1.80964 1.80964 1.25 2.5 1.25H17.5ZM2.5 0C1.11929 0 0 1.11929 0 2.5V17.5C0 18.8807 1.11929 20 2.5 20H17.5C18.8807 20 20 18.8807 20 17.5V2.5C20 1.11929 18.8807 0 17.5 0H2.5Z"
            />
            <path
                fill={
                    isActive
                        ? disabled
                            ? "var(--G_500)"
                            : "var(--P_700)"
                        : "none"
                }
                className="background"
                d="M13.7121 6.21209C14.0782 5.84597 14.6718 5.84597 15.0379 6.21209C15.3995 6.57371 15.404 7.15727 15.0512 7.52434L10.061 13.7622C10.0538 13.7712 10.0461 13.7798 10.0379 13.7879C9.67179 14.154 9.0782 14.154 8.71208 13.7879L5.40402 10.4799C5.0379 10.1137 5.0379 9.52015 5.40402 9.15403C5.77014 8.78791 6.36373 8.78791 6.72985 9.15403L9.34675 11.7709L13.6872 6.24013C13.6949 6.23029 13.7032 6.22093 13.7121 6.21209Z"
            />
        </Svg>
    );
};
Icon.RadioBox = ({ isActive, disabled, size = "xs" }) => {
    return (
        <Svg $width={setSize(size)} viewBox="0 0 20 20">
            <rect
                width="20"
                height="20"
                rx="10"
                fill={
                    isActive
                        ? disabled
                            ? "var(--G_100)"
                            : "var(--P_700)"
                        : disabled
                        ? "var(--G_100)"
                        : "var(--G_100)"
                }
            />
            <circle
                cx="10"
                cy="10"
                className="background"
                r="9"
                fill={
                    isActive
                        ? disabled
                            ? "var(--G_50)"
                            : "var(--P_700)"
                        : disabled
                        ? "var(--G_50)"
                        : "var(--White)"
                }
            />
            <circle
                cx="10"
                cy="10"
                r="5"
                fill={
                    isActive
                        ? disabled
                            ? "var(--G_100)"
                            : "var(--White)"
                        : disabled
                        ? "var(--G_50)"
                        : "var(--White)"
                }
            />
        </Svg>
    );
};

Icon.Bell = ({ size = 100 }) => {
    return (
        <Svg $width={setSize(size)} viewBox="0 0 100 100">
            <g clipPath="url(#clip0_8282_145777)">
                <path
                    d="M65.0642 84.9167C65.0642 91.7618 60.4462 97.5251 54.158 99.2661C52.8908 99.6171 51.5564 99.8048 50.1785 99.8048C41.9563 99.8048 35.2905 93.1397 35.2905 84.9167L50.2022 77.2538L65.0642 84.9167Z"
                    fill="#E58E13"
                />
                <path
                    d="M64.3441 89.5088C62.8114 94.239 58.9746 97.9332 54.1581 99.266C51.13 98.4283 48.4895 96.6583 46.5654 94.2848C45.0143 92.3706 46.4135 89.5088 48.8771 89.5088H64.3441Z"
                    fill="#F7D360"
                />
                <path
                    d="M88.6153 70.0309L56.6306 76.9478L11.7393 70.0309C15.2617 70.0309 17.2538 68.1884 18.3845 65.1329C23.854 50.3822 9.28641 7.39209 50.1784 7.39209C91.0705 7.39209 76.5006 50.3822 81.9701 65.1329C83.1031 68.1884 85.0944 70.0309 88.6153 70.0309Z"
                    fill="#F7D360"
                />
                <path
                    d="M96.0579 77.4742C96.0579 81.5842 92.7254 84.9167 88.6154 84.9167H11.7393C9.68475 84.9167 7.82318 84.0844 6.47659 82.737C5.12924 81.3904 4.29688 79.5288 4.29688 77.4742C4.29688 73.3635 7.62939 70.031 11.7393 70.031H88.6154C90.67 70.031 92.5316 70.8641 93.8782 72.2107C95.2255 73.5581 96.0579 75.4189 96.0579 77.4742Z"
                    fill="#E58E13"
                />
                <path
                    d="M81.9703 65.1329H42.0144C37.7069 65.1329 34.2622 61.5677 34.3957 57.2617C34.9587 39.0457 32.0535 7.73849 49.8796 7.39441C0.946898 7.64771 32.2267 70.031 11.741 70.031H88.6155C85.0946 70.031 83.1033 68.1885 81.9703 65.1329Z"
                    fill="#E58E13"
                />
                <path
                    d="M96.0579 77.4742C96.0579 81.5842 92.7254 84.9167 88.6155 84.9167H33.2482C31.1928 84.9167 29.3312 84.0844 27.9846 82.737C26.6381 81.3904 25.8049 79.5288 25.8049 77.4742C25.8049 73.3635 29.1375 70.031 33.2482 70.031H88.6155C90.6701 70.031 92.5316 70.8641 93.8782 72.2107C95.2256 73.5581 96.0579 75.4189 96.0579 77.4742Z"
                    fill="#F7D360"
                />
                <path
                    d="M57.7438 7.96204C57.7598 7.77435 57.7659 7.58438 57.7659 7.39212C57.7659 3.20282 54.3686 -0.195312 50.1785 -0.195312C45.9869 -0.195312 42.5911 3.20282 42.5911 7.39212C42.5911 7.58438 42.5972 7.77435 42.6132 7.96204"
                    fill="#E58E13"
                />
                <path
                    d="M87.1314 32.5624C86.2861 32.5624 85.6009 31.8765 85.6009 31.0319C85.6009 23.948 83.7798 17.9025 80.1887 13.0632C77.5077 9.45064 74.7817 7.89577 74.755 7.87975C74.0195 7.467 73.7548 6.53621 74.1652 5.79921C74.5757 5.06298 75.5019 4.79595 76.2397 5.20336C76.3701 5.27584 79.4692 7.01534 82.5385 11.094C85.3324 14.8065 88.6626 21.2793 88.6626 31.0319C88.6626 31.8765 87.9767 32.5624 87.1314 32.5624Z"
                    fill="#E6E6E6"
                />
                <path
                    d="M93.8659 23.787C93.0206 23.787 92.3355 23.1019 92.3355 22.2565C92.3355 12.4863 86.5493 8.60222 86.3029 8.442C85.5972 7.98195 85.3927 7.03667 85.8482 6.32866C86.3044 5.62065 87.2429 5.41161 87.9532 5.86403C88.2576 6.05705 95.3964 10.7331 95.3964 22.2565C95.3964 23.1019 94.7113 23.787 93.8659 23.787Z"
                    fill="#E6E6E6"
                />
                <path
                    d="M13.2231 32.5623C12.3777 32.5623 11.6926 31.8764 11.6926 31.0319C11.6926 21.2792 15.0229 14.8064 17.816 11.094C20.886 7.01529 23.9843 5.27502 24.1148 5.2033C24.8549 4.79437 25.7864 5.06292 26.1953 5.80297C26.6035 6.5415 26.3365 7.47076 25.5995 7.88046C25.5392 7.91479 22.8315 9.47348 20.1666 13.0631C16.5747 17.9024 14.7543 23.948 14.7543 31.0319C14.7535 31.8764 14.0684 32.5623 13.2231 32.5623Z"
                    fill="#E6E6E6"
                />
                <path
                    d="M6.48871 23.787C5.64337 23.787 4.95825 23.1019 4.95825 22.2565C4.95825 10.7331 12.0978 6.05703 12.4015 5.86401C13.1148 5.41006 14.0609 5.62063 14.5148 6.33322C14.9673 7.04428 14.7597 7.98727 14.051 8.44198C13.7969 8.6083 8.01917 12.494 8.01917 22.2565C8.01917 23.1019 7.33405 23.787 6.48871 23.787Z"
                    fill="#E6E6E6"
                />
            </g>
            <defs>
                <clipPath id="clip0_8282_145777">
                    <rect width="100" height="100" fill="white" />
                </clipPath>
            </defs>
        </Svg>
    );
};

Icon.WarningAlarm = ({ size = 100 }) => {
    return (
        <Svg $width={setSize(size)} viewBox="0 0 100 100">
            <g clipPath="url(#clip0_13809_80842)">
                <path
                    d="M50 100C77.6142 100 100 77.6142 100 50C100 22.3858 77.6142 0 50 0C22.3858 0 0 22.3858 0 50C0 77.6142 22.3858 100 50 100Z"
                    fill="#FC8B4C"
                />
                <path
                    d="M99.1473 59.2244L57.2169 17.2938C53.045 12.4861 45.0856 12.985 41.7053 18.7969L15.7721 63.3854C13.3495 67.5506 14.4618 72.4045 17.5751 75.2846L41.6026 99.2941C44.3333 99.7561 47.138 100 49.9999 100C74.4624 100 94.8186 82.4314 99.1473 59.2244Z"
                    fill="#E05F16"
                />
                <path
                    d="M41.7055 18.7969L15.7723 63.3853C12.0518 69.7822 16.6667 77.8047 24.0667 77.8047H75.9331C83.3331 77.8047 87.9479 69.782 84.2274 63.3853L58.2944 18.7969C54.5944 12.4353 45.4055 12.4353 41.7055 18.7969Z"
                    fill="#FFE488"
                />
                <path
                    d="M75.9336 77.8047H50V14.0254C53.2227 14.0254 56.4453 15.6172 58.2949 18.7969L84.2285 63.3848C87.9473 69.7812 83.3338 77.8047 75.9336 77.8047Z"
                    fill="#FFC73A"
                />
                <path
                    d="M75.4765 73.0512H24.5234C22.6224 73.0512 20.9214 72.0674 19.9736 70.4195C19.0256 68.7717 19.0302 66.8068 19.9861 65.1633L45.4627 21.36C46.413 19.7256 48.1091 18.75 49.9998 18.75C51.8904 18.75 53.5867 19.7256 54.5371 21.36L80.0136 65.1633C80.9695 66.8066 80.9742 68.7717 80.0261 70.4195C79.0783 72.0674 77.3775 73.0512 75.4765 73.0512ZM49.9998 21.0484C48.9369 21.0484 47.9836 21.5969 47.4494 22.5154L21.9728 66.3187C21.4355 67.2426 21.433 68.3471 21.966 69.2732C22.4988 70.1994 23.4547 70.7525 24.5234 70.7525H75.4765C76.5451 70.7525 77.5011 70.1994 78.034 69.2732C78.5668 68.3469 78.5642 67.2424 78.0271 66.3187L52.5504 22.5156C52.0162 21.5969 51.0627 21.0484 49.9998 21.0484Z"
                    fill="#686D78"
                />
                <path
                    d="M80.0134 65.1641L54.5369 21.3594C53.5857 19.7266 51.8906 18.75 49.9998 18.75V21.0488C51.0623 21.0488 52.0154 21.5977 52.5505 22.5156L78.0273 66.3184C78.5644 67.2422 78.5664 68.3477 78.0332 69.2734C77.5019 70.1992 76.5449 70.752 75.4765 70.752H50V73.0508H75.4765C77.3769 73.0508 79.0781 72.0684 80.0273 70.4199C80.9746 68.7715 80.9707 66.8066 80.0134 65.1641Z"
                    fill="#313644"
                />
                <path
                    d="M47.0859 53.426V33.8535H52.9141V53.426H47.0859ZM47.0859 65.0391V58.4715H52.9141V65.0391H47.0859Z"
                    fill="#686D78"
                />
                <path
                    d="M49.9998 58.4707V65.0391H52.9138V58.4707H49.9998ZM49.9998 33.8535V53.4258H52.9138V33.8535H49.9998Z"
                    fill="#313644"
                />
            </g>
            <defs>
                <clipPath id="clip0_13809_80842">
                    <rect width="100" height="100" fill="white" />
                </clipPath>
            </defs>
        </Svg>
    );
};

Icon.CompletedCheckList = ({ size = 100 }) => (
    <Svg $width={setSize(size)} viewBox="0 0 100 100">
        {[
            {
                d: "M79.3447 100H20.6553C17.8771 100 15.625 97.7478 15.625 94.9697V14.4053C15.625 11.6271 17.8771 9.375 20.6553 9.375H79.3449C82.1228 9.375 84.375 11.6271 84.375 14.4053V94.9699C84.375 97.7478 82.1228 100 79.3447 100Z",
                fill: "#0055A3",
            },
            {
                d: "M79.3447 100H20.6553C17.8771 100 15.625 97.7478 15.625 94.9697V14.4053C15.625 11.6271 17.8771 9.375 20.6553 9.375H79.3449C82.1228 9.375 84.375 11.6271 84.375 14.4053V94.9699C84.375 97.7478 82.1228 100 79.3447 100Z",
                fill: "#0055A3",
            },
            {
                d: "M79.3447 9.375H72.2018C72.2678 9.7 72.3023 10.0365 72.3023 10.3811V80.7879C72.3023 89.176 65.5025 95.9758 57.1145 95.9758H15.7256C16.1918 98.2719 18.2217 100 20.6553 100H79.3449C82.1229 100 84.375 97.7478 84.375 94.9697V14.4053C84.375 11.6271 82.1229 9.375 79.3447 9.375Z",
                fill: "#004281",
            },
            {
                d: "M76.1129 15.625H23.8871C22.7758 15.625 21.875 16.5258 21.875 17.6371V91.7379C21.875 92.8492 22.7758 93.75 23.8871 93.75H76.1129C77.2242 93.75 78.125 92.8492 78.125 91.7379V17.6371C78.125 16.5258 77.2242 15.625 76.1129 15.625Z",
                fill: "#F2FBFF",
            },
            {
                d: "M76.1129 15.625H72.3025V80.7879C72.3025 86.274 69.3937 91.0807 65.0342 93.75H76.1129C77.2242 93.75 78.125 92.8492 78.125 91.7379V17.6371C78.125 16.5258 77.2242 15.625 76.1129 15.625Z",
                fill: "#DFF6FD",
            },
            {
                d: "M56.733 6.25C56.4684 6.25 56.2522 6.04434 56.2326 5.78047C55.9926 2.54805 53.2938 0 50 0C46.7063 0 44.0074 2.54805 43.7674 5.78047C43.7479 6.04434 43.5316 6.25 43.267 6.25H32.2561C31.7004 6.25 31.25 6.70039 31.25 7.25606V18.75C31.25 20.4168 32.6012 21.7682 34.2682 21.7682H65.732C67.3988 21.7682 68.2998 6.25 67.7441 6.25H56.733Z",
                fill: "#B2CAEC",
            },
            {
                d: "M67.7438 6.25H63.5185C64.0741 6.25 64.5245 6.70039 64.5245 7.25605V18.75C64.5245 20.4168 63.1733 21.7682 61.5063 21.7682H65.7317C67.3985 21.7682 68.7499 20.417 68.7499 18.75V7.25605C68.7499 6.70039 68.2995 6.25 67.7438 6.25Z",
                fill: "#82AEE3",
            },
            {
                d: "M50 56.25C57.7665 56.25 64.0625 49.954 64.0625 42.1875C64.0625 34.421 57.7665 28.125 50 28.125C42.2335 28.125 35.9375 34.421 35.9375 42.1875C35.9375 49.954 42.2335 56.25 50 56.25Z",
                fill: "#80D261",
            },
            {
                d: "M62.5 17.0898H37.5C36.6908 17.0898 36.0352 16.434 36.0352 15.625C36.0352 14.816 36.6908 14.1602 37.5 14.1602H62.5C63.3092 14.1602 63.9648 14.816 63.9648 15.625C63.9648 16.434 63.3092 17.0898 62.5 17.0898Z",
                fill: "#82AEE3",
            },
            {
                d: "M48.7932 47.0449C48.1084 47.0449 47.4645 46.7783 46.9805 46.2939L42.9305 42.2441C42.3584 41.6721 42.3584 40.7445 42.9305 40.1727C43.5028 39.6006 44.4301 39.6004 45.0022 40.1727L48.7932 43.9639L54.9979 37.7592C55.5702 37.1871 56.4975 37.1871 57.0696 37.7592C57.6417 38.3312 57.6417 39.2588 57.0696 39.8307L50.6061 46.2941C50.1217 46.7783 49.478 47.0449 48.7932 47.0449Z",
                fill: "#F2FBFF",
            },
            {
                d: "M68.75 76.4648H37.5C36.6908 76.4648 36.0352 75.809 36.0352 75C36.0352 74.191 36.6908 73.5352 37.5 73.5352H68.75C69.5592 73.5352 70.2148 74.191 70.2148 75C70.2148 75.809 69.5592 76.4648 68.75 76.4648Z",
                fill: "#0055A3",
            },
            {
                d: "M68.75 70.2148H37.5C36.6908 70.2148 36.0352 69.559 36.0352 68.75C36.0352 67.941 36.6908 67.2852 37.5 67.2852H68.75C69.5592 67.2852 70.2148 67.941 70.2148 68.75C70.2148 69.559 69.5592 70.2148 68.75 70.2148Z",
                fill: "#0055A3",
            },
            {
                d: "M68.75 82.7148H37.5C36.6908 82.7148 36.0352 82.059 36.0352 81.25C36.0352 80.441 36.6908 79.7852 37.5 79.7852H68.75C69.5592 79.7852 70.2148 80.441 70.2148 81.25C70.2148 82.059 69.5592 82.7148 68.75 82.7148Z",
                fill: "#0055A3",
            },
            {
                d: "M50 7.71484C50.809 7.71484 51.4648 7.05901 51.4648 6.25C51.4648 5.44099 50.809 4.78516 50 4.78516C49.191 4.78516 48.5352 5.44099 48.5352 6.25C48.5352 7.05901 49.191 7.71484 50 7.71484Z",
                fill: "#82AEE3",
            },
            {
                d: "M31.25 70.2148C32.059 70.2148 32.7148 69.559 32.7148 68.75C32.7148 67.941 32.059 67.2852 31.25 67.2852C30.441 67.2852 29.7852 67.941 29.7852 68.75C29.7852 69.559 30.441 70.2148 31.25 70.2148Z",
                fill: "#0055A3",
            },
            {
                d: "M31.25 76.4648C32.059 76.4648 32.7148 75.809 32.7148 75C32.7148 74.191 32.059 73.5352 31.25 73.5352C30.441 73.5352 29.7852 74.191 29.7852 75C29.7852 75.809 30.441 76.4648 31.25 76.4648Z",
                fill: "#0055A3",
            },
            {
                d: "M31.25 82.7148C32.059 82.7148 32.7148 82.059 32.7148 81.25C32.7148 80.441 32.059 79.7852 31.25 79.7852C30.441 79.7852 29.7852 80.441 29.7852 81.25C29.7852 82.059 30.441 82.7148 31.25 82.7148Z",
                fill: "#0055A3",
            },
        ]?.map((props, key) => (
            <path {...props} key={key} />
        ))}
    </Svg>
);

Icon.RestUser = ({ size = 100 }) => {
    return (
        <Svg $width={setSize(size)} viewBox="0 0 100 100">
            <path
                d="M81.25 89.0625H50L56.893 62.8695C57.1565 61.8682 57.7441 60.9823 58.5641 60.3501C59.3841 59.718 60.3904 59.3751 61.4258 59.375H82.9818C83.6991 59.375 84.4067 59.5396 85.0504 59.8561C85.694 60.1726 86.2564 60.6326 86.6943 61.2006C87.1322 61.7687 87.4339 62.4296 87.5762 63.1326C87.7185 63.8356 87.6976 64.5618 87.515 65.2555L81.25 89.0625Z"
                fill="#348ED8"
            />
            <path
                d="M76.5594 43.75L81.2469 40.625L68.7812 28.4639L74.9969 20.3125L87.9615 30.0359C89.7578 31.3832 91.2158 33.1301 92.2199 35.1384C93.2241 37.1467 93.7469 39.3613 93.7469 41.6066C93.7471 44.1566 93.0731 46.6612 91.7933 48.8667C90.5135 51.0722 88.6733 52.9001 86.4594 54.1652L82.8094 56.25L76.5594 43.75Z"
                fill="#FCB079"
            />
            <path
                d="M28.1253 39.0625L40.6253 34.375L37.5003 26.5625L57.8129 23.4375L59.3754 14.0625H35.673C33.4328 14.0624 31.2419 14.7196 29.3717 15.9528C27.5016 17.186 26.0344 18.9409 25.1521 21C24.0477 23.5767 23.9274 26.469 24.814 29.1285L28.1253 39.0625Z"
                fill="#FCB079"
            />
            <path
                d="M56.449 14.8242L47.2724 22.4834L50.5668 23.8549L47.0377 31.9531C46.853 32.3788 46.7552 32.837 46.7502 33.301C46.7452 33.765 46.8329 34.2253 47.0084 34.6548C47.1838 35.0844 47.4433 35.4745 47.7717 35.8023C48.1 36.1301 48.4906 36.389 48.9205 36.5637L52.215 37.9354L47.2736 49.2721L60.4515 54.7584L74.5693 22.3674L56.449 14.8242Z"
                fill="#FDC8A2"
            />
            <path
                d="M75.9794 19.1289L69.6278 33.7031L68.4501 27.4746L62.7372 38.1992C62.1693 39.2651 61.212 40.0708 60.0647 40.4481C58.9174 40.8254 57.6687 40.7454 56.579 40.2246L48.9208 36.5625C48.4909 36.3881 48.1002 36.1294 47.7718 35.8017C47.4433 35.474 47.1837 35.084 47.0083 34.6545C46.8329 34.225 46.7451 33.7647 46.7502 33.3008C46.7553 32.8369 46.8532 32.3787 47.038 31.9531L48.1532 29.3926L49.5673 26.1523L50.5673 23.8555L58.8036 27.2832L66.4716 21.9082C66.7146 21.7379 66.9106 21.5089 67.0414 21.2426C67.1722 20.9762 67.2335 20.6811 67.2197 20.3847C67.2058 20.0883 67.1173 19.8002 66.9622 19.5472C66.8072 19.2941 66.5907 19.0844 66.3329 18.9375L56.4481 14.8242C55.487 14.4304 54.6642 13.7604 54.084 12.8989C53.5037 12.0373 53.192 11.0231 53.1884 9.98438C53.1892 9.26973 53.3374 8.56293 53.6239 7.90821C54.2018 6.61169 55.2641 5.59278 56.5836 5.06937C57.9031 4.54597 59.3749 4.55962 60.6845 5.10743L72.2138 9.90626C73.0737 10.2555 73.8552 10.7733 74.5121 11.429C75.169 12.0847 75.6882 12.8652 76.039 13.7245C76.3899 14.5838 76.5654 15.5046 76.5551 16.4327C76.5449 17.3608 76.3491 18.2776 75.9794 19.1289Z"
                fill="#91563A"
            />
            <path
                d="M55.5234 22.0417L56.9367 18.8018L59.8023 20.0518L58.3891 23.2917L55.5234 22.0417Z"
                fill="#91563A"
            />
            <path
                d="M28.125 39.0625L40.625 34.375L45.3125 43.75L65.625 50L76.5625 43.75L82.8125 56.25L70.3125 65.625L62.5 89.0625H23.4375L32.8125 53.125L28.125 39.0625Z"
                fill="#D65246"
            />
            <path
                d="M55.4902 30.4434C54.7093 30.9969 53.7693 31.2807 52.8125 31.252C52.0066 31.2451 51.2084 31.095 50.4551 30.8086C49.6005 30.4978 48.8183 30.016 48.1562 29.3926L49.5703 26.1523C49.7207 26.5566 50.1465 27.3125 51.543 27.8809C52.6133 28.3145 53.4082 28.1016 53.5977 27.9551L55.4902 30.4434Z"
                fill="#FDC8A2"
            />
            <path
                d="M4.6875 89.0625H95.3125V95.3125H4.6875V89.0625Z"
                fill="#91563A"
            />
            <path
                d="M10.9375 82.8125H57.8125V89.0625H10.9375V82.8125Z"
                fill="#CECECC"
            />
            <path
                d="M39.8047 89.0625H13.3383C12.6498 89.0625 11.9805 88.8351 11.4345 88.4156C10.8885 87.9961 10.4964 87.408 10.3189 86.7428L4.78086 65.9748C4.71891 65.7426 4.68753 65.5032 4.6875 65.2629C4.6875 64.9001 4.75896 64.5408 4.89781 64.2056C5.03666 63.8704 5.24017 63.5658 5.49673 63.3092C5.75329 63.0527 6.05787 62.8492 6.39308 62.7103C6.72829 62.5715 7.08756 62.5 7.45039 62.5H35.025C35.7293 62.5001 36.4128 62.7381 36.9649 63.1754C37.5169 63.6127 37.9051 64.2236 38.0664 64.9092L42.8459 85.2217C42.9538 85.6803 42.9566 86.1575 42.8541 86.6174C42.7516 87.0773 42.5465 87.508 42.254 87.8774C41.9615 88.2468 41.5892 88.5453 41.1651 88.7505C40.7409 88.9557 40.2759 89.0624 39.8047 89.0625Z"
                fill="#DFDFDD"
            />
            <path
                d="M25.8121 78.7812C26.9532 77.5872 26.8212 75.6089 25.5171 74.3626C24.2131 73.1163 22.2308 73.0739 21.0897 74.2679C19.9485 75.4619 20.0806 77.4402 21.3846 78.6865C22.6887 79.9328 24.6709 79.9752 25.8121 78.7812Z"
                fill="#F1F1F1"
            />
            <path d="M75 68.75H89.0625V89.0625H75V68.75Z" fill="#D65246" />
            <path
                d="M93.041 71.875H89.0625V75H93.041C93.229 75.0002 93.4092 75.075 93.5421 75.2079C93.675 75.3408 93.7498 75.521 93.75 75.709V82.1035C93.7498 82.2915 93.675 82.4717 93.5421 82.6046C93.4092 82.7375 93.229 82.8123 93.041 82.8125H89.0625V85.9375H93.041C94.0575 85.9364 95.032 85.5321 95.7508 84.8133C96.4696 84.0945 96.8739 83.12 96.875 82.1035V75.709C96.8739 74.6925 96.4696 73.718 95.7508 72.9992C95.032 72.2804 94.0575 71.8761 93.041 71.875Z"
                fill="#C7483C"
            />
        </Svg>
    );
};

Icon.Picture = ({ size = 100 }) => {
    return (
        <Svg $width={setSize(size)} viewBox="0 0 100 100">
            <path
                d="M14.8438 64.6484H2.92969C1.31035 64.6484 0 63.3381 0 61.7188V8.98438C0 7.36504 1.31035 6.05469 2.92969 6.05469H73.4375C75.0568 6.05469 76.3672 7.36504 76.3672 8.98438V20.7031C76.3672 22.3225 75.0568 23.6328 73.4375 23.6328H29.4922V38.2812C29.4922 39.9006 28.1818 41.2109 26.5625 41.2109H17.7734V61.7188C17.7734 63.3381 16.4631 64.6484 14.8438 64.6484Z"
                fill="#FFCB66"
            />
            <path
                d="M73.4375 6.05469H50V23.6328H73.4375C75.0568 23.6328 76.3672 22.3225 76.3672 20.7031V8.98438C76.3672 7.36504 75.0568 6.05469 73.4375 6.05469Z"
                fill="#FFA54D"
            />
            <path
                d="M97.0703 76.3672H85.1562C83.5369 76.3672 82.2266 75.0568 82.2266 73.4375V41.2109H26.5625C24.9432 41.2109 23.6328 39.9006 23.6328 38.2812V20.7031C23.6328 19.0838 24.9432 17.7734 26.5625 17.7734H97.0703C98.6897 17.7734 100 19.0838 100 20.7031V73.4375C100 75.0568 98.6897 76.3672 97.0703 76.3672Z"
                fill="#E6F2F2"
            />
            <path
                d="M97.0703 17.7734H50V41.2109H82.2266V73.4375C82.2266 75.0568 83.5369 76.3672 85.1562 76.3672H97.0703C98.6896 76.3672 100 75.0568 100 73.4375V20.7031C100 19.0838 98.6896 17.7734 97.0703 17.7734Z"
                fill="#CFE6E6"
            />
            <path
                d="M85.1562 35.3516H14.8438C13.2029 35.3516 11.9141 36.6404 11.9141 38.2813V91.0156C11.9141 91.8359 12.2656 92.5391 12.7344 93.125L32.4219 85.1563H55.8594L87.2656 93.125C87.7344 92.5391 88.0859 91.8359 88.0859 91.0156V38.2813C88.0859 36.6404 86.7971 35.3516 85.1562 35.3516Z"
                fill="#66B3FF"
            />
            <path
                d="M85.1562 35.3516H50V85.1563H55.8594L87.2656 93.125C87.7344 92.5391 88.0859 91.8359 88.0859 91.0156V38.2813C88.0859 36.6404 86.7971 35.3516 85.1562 35.3516Z"
                fill="#4D88FF"
            />
            <path
                d="M87.2656 93.125C86.6797 93.5937 85.9766 93.9453 85.1562 93.9453H14.8438C14.0234 93.9453 13.3203 93.5937 12.7344 93.125L30.3502 75.5092C31.4943 74.365 33.3492 74.365 34.4934 75.5092L36.2096 77.2254C37.3537 78.3695 39.2086 78.3695 40.3527 77.2254L53.7877 63.7904C54.9318 62.6463 56.7867 62.6463 57.9309 63.7904L87.2656 93.125Z"
                fill="#ADE65C"
            />
            <path
                d="M32.4219 64.6484C27.5754 64.6484 23.6328 60.7059 23.6328 55.8594C23.6328 51.0129 27.5754 47.0703 32.4219 47.0703C37.2684 47.0703 41.2109 51.0129 41.2109 55.8594C41.2109 60.7059 37.2684 64.6484 32.4219 64.6484Z"
                fill="#FFCB66"
            />
            <path
                d="M53.7877 63.79L50 67.5777V93.9453H85.1562C85.9766 93.9453 86.6797 93.5937 87.2656 93.125L57.9311 63.79C56.7867 62.6461 54.932 62.6461 53.7877 63.79Z"
                fill="#7ACC52"
            />
        </Svg>
    );
};

Icon.Hwp = ({ size = 28 }) => {
    return (
        <Svg $width={setSize(size)} viewBox="0 0  32 32">
            <rect width="32" height="32" rx="4" fill="#06A6E9" />
            <path
                d="M11.552 10.224V22H13.408V16.64H18.448V22H20.304V10.224H18.448V15.024H13.408V10.224H11.552Z"
                fill="white"
            />
        </Svg>
    );
};
Icon.Dock = ({ size = 28 }) => {
    return (
        <Svg $width={setSize(size)} viewBox="0 0  32 32">
            <rect width="32" height="32" rx="4" fill="#2A3282" />
            <path
                d="M8.852 10.224L11.268 22H13.508L15.06 15.456C15.156 14.976 15.2467 14.5173 15.332 14.08C15.428 13.6427 15.5187 13.2 15.604 12.752H15.684C15.7693 13.2 15.8547 13.6427 15.94 14.08C16.0253 14.5173 16.1213 14.976 16.228 15.456L17.812 22H20.1L22.42 10.224H20.644L19.524 16.352C19.428 16.9707 19.3267 17.5947 19.22 18.224C19.124 18.8533 19.028 19.488 18.932 20.128H18.852C18.7133 19.488 18.58 18.8533 18.452 18.224C18.324 17.5947 18.1907 16.9707 18.052 16.352L16.516 10.224H14.884L13.364 16.352C13.2253 16.992 13.0867 17.6213 12.948 18.24C12.82 18.8587 12.692 19.488 12.564 20.128H12.5L11.876 16.352L10.772 10.224H8.852Z"
                fill="white"
            />
        </Svg>
    );
};
Icon.Xlsx = ({ size = 28 }) => {
    return (
        <Svg $width={setSize(size)} viewBox="0 0  32 32">
            <rect width="32" height="32" rx="4" fill="#007233" />
            <path
                d="M14.616 15.92L11.24 22H13.208L14.712 19.072C14.8613 18.7733 15.0053 18.4693 15.144 18.16C15.2933 17.8507 15.4533 17.5147 15.624 17.152H15.688C15.8693 17.5147 16.04 17.8507 16.2 18.16C16.36 18.4693 16.5147 18.7733 16.664 19.072L18.216 22H20.32L16.888 16.016L20.056 10.224H18.104L16.712 12.976C16.5733 13.2533 16.44 13.5307 16.312 13.808C16.1947 14.0853 16.0613 14.4 15.912 14.752H15.832C15.6507 14.4 15.4907 14.0853 15.352 13.808C15.224 13.5307 15.0853 13.2533 14.936 12.976L13.512 10.224H11.448L14.616 15.92Z"
                fill="white"
            />
        </Svg>
    );
};
Icon.Pptx = ({ size = 28 }) => {
    return (
        <Svg $width={setSize(size)} viewBox="0 0  32 32">
            <rect width="32" height="32" rx="4" fill="#DC5B26" />
            <path
                d="M12.036 10.224V22H13.892V17.536H15.668C16.308 17.536 16.9 17.4613 17.444 17.312C17.988 17.1627 18.452 16.9333 18.836 16.624C19.2307 16.3147 19.54 15.9253 19.764 15.456C19.988 14.976 20.1 14.416 20.1 13.776C20.1 13.1147 19.988 12.56 19.764 12.112C19.54 11.6533 19.2307 11.2853 18.836 11.008C18.4413 10.7307 17.9667 10.5333 17.412 10.416C16.868 10.288 16.2653 10.224 15.604 10.224H12.036ZM15.492 16.048H13.892V11.712H15.428C16.3667 11.712 17.076 11.8613 17.556 12.16C18.036 12.4587 18.276 12.9973 18.276 13.776C18.276 14.5547 18.052 15.1307 17.604 15.504C17.1667 15.8667 16.4627 16.048 15.492 16.048Z"
                fill="white"
            />
        </Svg>
    );
};
Icon.Extension = ({ size = 28 }) => {
    return (
        <Svg $width={setSize(size)} viewBox="0 0  28 28">
            <path
                d="M9.56665 18.1667L7.69998 16.3C7.56665 16.1667 7.4222 16.0667 7.26665 16C7.11109 15.9334 6.9502 15.9 6.78398 15.9C6.61687 15.9 6.4502 15.9334 6.28398 16C6.11687 16.0667 5.96665 16.1667 5.83331 16.3C5.56665 16.5667 5.43331 16.8836 5.43331 17.2507C5.43331 17.6169 5.56665 17.9334 5.83331 18.2L8.66665 21.0667C8.79998 21.2 8.94442 21.2942 9.09998 21.3494C9.25553 21.4054 9.4222 21.4334 9.59998 21.4334C9.77776 21.4334 9.94442 21.4054 10.1 21.3494C10.2555 21.2942 10.4 21.2 10.5333 21.0667L16.1666 15.4334C16.4333 15.1667 16.5666 14.8445 16.5666 14.4667C16.5666 14.0889 16.4333 13.7667 16.1666 13.5C15.9 13.2334 15.5778 13.1 15.2 13.1C14.8222 13.1 14.5 13.2334 14.2333 13.5L9.56665 18.1667ZM2.99998 27.3334C2.26665 27.3334 1.63909 27.0725 1.11731 26.5507C0.594646 26.028 0.333313 25.4 0.333313 24.6667V3.33335C0.333313 2.60002 0.594646 1.97202 1.11731 1.44935C1.63909 0.927576 2.26665 0.666687 2.99998 0.666687H12.5666C12.9222 0.666687 13.2613 0.733354 13.584 0.866687C13.9058 1.00002 14.1889 1.18891 14.4333 1.43335L20.9 7.90002C21.1444 8.14447 21.3333 8.42758 21.4666 8.74935C21.6 9.07202 21.6666 9.41113 21.6666 9.76669V24.6667C21.6666 25.4 21.4058 26.028 20.884 26.5507C20.3613 27.0725 19.7333 27.3334 19 27.3334H2.99998ZM12.3333 8.66669V3.33335H2.99998V24.6667H19V10H13.6666C13.2889 10 12.9724 9.87202 12.7173 9.61602C12.4613 9.36091 12.3333 9.04447 12.3333 8.66669Z"
                fill="#3C69FC"
            />
        </Svg>
    );
};

/**
 *
 * @param {
 * size?: string | number;
 * fill?;
 * full?;
 * }
 * @returns
 */
Icon.Help = ({ size = "md", fill, full }) => {
    return (
        <Svg $width={setSize(size)} viewBox="0 0 24 24">
            <path
                d={
                    full
                        ? "M11.95 18C12.3 18 12.596 17.879 12.838 17.637C13.0793 17.3957 13.2 17.1 13.2 16.75C13.2 16.4 13.0793 16.1043 12.838 15.863C12.596 15.621 12.3 15.5 11.95 15.5C11.6 15.5 11.304 15.621 11.062 15.863C10.8207 16.1043 10.7 16.4 10.7 16.75C10.7 17.1 10.8207 17.3957 11.062 17.637C11.304 17.879 11.6 18 11.95 18ZM12.1 7.7C12.5667 7.7 12.9417 7.829 13.225 8.087C13.5083 8.34567 13.65 8.68333 13.65 9.1C13.65 9.38333 13.5543 9.67067 13.363 9.962C13.171 10.254 12.9 10.5583 12.55 10.875C12.05 11.3083 11.6833 11.725 11.45 12.125C11.2167 12.525 11.1 12.925 11.1 13.325C11.1 13.5583 11.1877 13.754 11.363 13.912C11.5377 14.0707 11.7417 14.15 11.975 14.15C12.2083 14.15 12.4167 14.0667 12.6 13.9C12.7833 13.7333 12.9 13.525 12.95 13.275C13 12.9917 13.1127 12.7293 13.288 12.488C13.4627 12.246 13.75 11.9333 14.15 11.55C14.6667 11.0667 15.0293 10.625 15.238 10.225C15.446 9.825 15.55 9.38333 15.55 8.9C15.55 8.05 15.2293 7.354 14.588 6.812C13.946 6.27067 13.1167 6 12.1 6C11.4 6 10.7793 6.13333 10.238 6.4C9.696 6.66667 9.275 7.075 8.975 7.625C8.85833 7.84167 8.81667 8.054 8.85 8.262C8.88333 8.47067 9 8.64167 9.2 8.775C9.41667 8.90833 9.65433 8.95 9.913 8.9C10.171 8.85 10.3833 8.70833 10.55 8.475C10.7333 8.225 10.9543 8.03333 11.213 7.9C11.471 7.76667 11.7667 7.7 12.1 7.7ZM12 22C10.6333 22 9.34167 21.7373 8.125 21.212C6.90833 20.6873 5.846 19.975 4.938 19.075C4.02933 18.175 3.31267 17.1167 2.788 15.9C2.26267 14.6833 2 13.3833 2 12C2 10.6167 2.26267 9.31667 2.788 8.1C3.31267 6.88333 4.02933 5.825 4.938 4.925C5.846 4.025 6.90833 3.31233 8.125 2.787C9.34167 2.26233 10.6333 2 12 2C13.4 2 14.7083 2.26233 15.925 2.787C17.1417 3.31233 18.2 4.025 19.1 4.925C20 5.825 20.7083 6.88333 21.225 8.1C21.7417 9.31667 22 10.6167 22 12C22 13.3833 21.7417 14.6833 21.225 15.9C20.7083 17.1167 20 18.175 19.1 19.075C18.2 19.975 17.1417 20.6873 15.925 21.212C14.7083 21.7373 13.4 22 12 22Z"
                        : "M11.95 18C12.3 18 12.596 17.879 12.838 17.637C13.0793 17.3957 13.2 17.1 13.2 16.75C13.2 16.4 13.0793 16.1043 12.838 15.863C12.596 15.621 12.3 15.5 11.95 15.5C11.6 15.5 11.304 15.621 11.062 15.863C10.8207 16.1043 10.7 16.4 10.7 16.75C10.7 17.1 10.8207 17.3957 11.062 17.637C11.304 17.879 11.6 18 11.95 18ZM12.1 7.7C12.5667 7.7 12.9417 7.829 13.225 8.087C13.5083 8.34567 13.65 8.68333 13.65 9.1C13.65 9.38333 13.5543 9.67067 13.363 9.962C13.171 10.254 12.9 10.5583 12.55 10.875C12.05 11.3083 11.6833 11.725 11.45 12.125C11.2167 12.525 11.1 12.925 11.1 13.325C11.1 13.5583 11.1877 13.754 11.363 13.912C11.5377 14.0707 11.7417 14.15 11.975 14.15C12.2083 14.15 12.4167 14.0667 12.6 13.9C12.7833 13.7333 12.9 13.525 12.95 13.275C13 12.9917 13.1127 12.7293 13.288 12.488C13.4627 12.246 13.75 11.9333 14.15 11.55C14.6667 11.0667 15.0293 10.625 15.238 10.225C15.446 9.825 15.55 9.38333 15.55 8.9C15.55 8.05 15.2293 7.354 14.588 6.812C13.946 6.27067 13.1167 6 12.1 6C11.4 6 10.7793 6.13333 10.238 6.4C9.696 6.66667 9.275 7.075 8.975 7.625C8.85833 7.84167 8.81667 8.054 8.85 8.262C8.88333 8.47067 9 8.64167 9.2 8.775C9.41667 8.90833 9.65433 8.95 9.913 8.9C10.171 8.85 10.3833 8.70833 10.55 8.475C10.7333 8.225 10.9543 8.03333 11.213 7.9C11.471 7.76667 11.7667 7.7 12.1 7.7ZM12 22C10.6333 22 9.34167 21.7373 8.125 21.212C6.90833 20.6873 5.846 19.975 4.938 19.075C4.02933 18.175 3.31267 17.1167 2.788 15.9C2.26267 14.6833 2 13.3833 2 12C2 10.6167 2.26267 9.31667 2.788 8.1C3.31267 6.88333 4.02933 5.825 4.938 4.925C5.846 4.025 6.90833 3.31233 8.125 2.787C9.34167 2.26233 10.6333 2 12 2C13.4 2 14.7083 2.26233 15.925 2.787C17.1417 3.31233 18.2 4.025 19.1 4.925C20 5.825 20.7083 6.88333 21.225 8.1C21.7417 9.31667 22 10.6167 22 12C22 13.3833 21.7417 14.6833 21.225 15.9C20.7083 17.1167 20 18.175 19.1 19.075C18.2 19.975 17.1417 20.6873 15.925 21.212C14.7083 21.7373 13.4 22 12 22ZM12 20C14.2333 20 16.125 19.221 17.675 17.663C19.225 16.1043 20 14.2167 20 12C20 9.78333 19.225 7.89567 17.675 6.337C16.125 4.779 14.2333 4 12 4C9.81667 4 7.93733 4.779 6.362 6.337C4.78733 7.89567 4 9.78333 4 12C4 14.2167 4.78733 16.1043 6.362 17.663C7.93733 19.221 9.81667 20 12 20Z"
                }
                fill={
                    fill
                        ? fill === true
                            ? "currentcolor"
                            : setFill(fill)
                        : fill !== undefined
                        ? ""
                        : "var(--P_500)"
                }
            />
        </Svg>
    );
};

Icon.Profile = ({ size = 24 }) => (
    <Svg $width={setSize(size)} viewBox="0 0 32 32">
        <rect width="32" height="32" rx="16" fill="#F4F5F5" />
        <path
            d="M28.3104 26.2172C25.376 29.75 20.9504 31.9996 16 31.9996C11.0496 31.9996 6.62397 29.75 3.68958 26.2172C5.86238 21.5964 10.5568 18.3996 16 18.3996C21.4432 18.3996 26.1376 21.5996 28.3104 26.2172ZM16 16.7996C19.0912 16.7996 21.6 14.2908 21.6 11.1996C21.6 8.10841 19.0944 5.59961 16 5.59961C12.9056 5.59961 10.4 8.10841 10.4 11.1996C10.4 14.2908 12.9088 16.7996 16 16.7996Z"
            fill="#DADBDD"
        />
    </Svg>
);

Icon.SpannerHand = ({ size = 100 }) => {
    return (
        <Svg $width={setSize(size)} viewBox="0 0 100 100">
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M27.6171 65.1328L27.6393 76.1441H61.752L61.8466 65.1328C65.7407 62.4719 71.2907 56.7047 71.2907 45.4452C71.2907 38.9786 68.9298 34.1424 67.1143 31.3795C66.007 29.7306 64.1514 28.7415 62.1651 28.7415C57.4857 28.7362 48.7747 28.7362 48.7747 28.7362H20.2837V46.3741C20.2837 57.0331 24.5576 62.5494 27.6171 65.1328Z"
                fill="#F8AE96"
            />
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M49.4174 53.2148C49.4174 53.2148 47.2469 38.2946 51.3849 35.6364C55.5231 32.9786 66.1085 34.5926 64.2343 40.6519C62.3601 46.7112 49.4174 53.2148 49.4174 53.2148Z"
                fill="#E69A83"
            />
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M66.4689 80.8255C66.4689 78.2401 64.3728 76.144 61.7874 76.144C53.4731 76.144 36.2256 76.144 27.9113 76.144C25.3259 76.144 23.2299 78.2401 23.2299 80.8255V94.2862H66.4689V80.8255Z"
                fill="#4399A4"
            />
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M59.8296 80.8255C59.8296 78.2401 57.7335 76.144 55.1478 76.144C48.124 76.144 34.9355 76.144 27.9113 76.144C25.3259 76.144 23.2299 78.2401 23.2299 80.8255V91.0533H59.8296V80.8255Z"
                fill="#51ACB8"
            />
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M63.9542 18.1255L67.3997 9.70417C67.8059 8.71175 68.693 7.99715 69.7489 7.81175C72.7849 7.27889 79.1118 6.16878 82.1475 5.63591C83.2037 5.45052 84.2812 5.82046 85.0009 6.61541C87.0506 8.87917 91.1079 13.3603 91.1079 13.3603C91.1079 13.3603 82.3287 14.9011 78.5495 15.5643C77.4933 15.7497 76.6062 16.464 76.2003 17.4564C75.8 18.4345 75.2866 19.6898 74.8705 20.7064C74.4158 21.8182 74.6394 23.0927 75.4455 23.9831C76.1829 24.7974 77.0933 25.8028 77.8023 26.5862C78.5219 27.3809 79.5995 27.7508 80.6557 27.5654C84.4346 26.9022 93.2141 25.3615 93.2141 25.3615C93.2141 25.3615 90.925 30.9564 89.7686 33.7831C89.3624 34.7755 88.4753 35.4898 87.4191 35.6752C84.3835 36.2081 78.0565 37.3185 75.0205 37.8511C73.9646 38.0365 72.8871 37.6668 72.1674 36.8719L66.0604 30.1266L13.8042 39.2971C12.2135 39.5764 10.577 39.212 9.2548 38.2848C7.93289 37.3573 7.03317 35.9427 6.75396 34.3522C6.75368 34.3502 6.7534 34.3483 6.75284 34.346C6.4739 32.7556 6.83795 31.1191 7.76548 29.7969C8.69272 28.4747 10.1073 27.5752 11.6981 27.296L63.9542 18.1255Z"
                fill="#DDD4D4"
            />
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M8.40027 29.0328C9.2851 28.1294 10.4362 27.5174 11.698 27.296L63.9542 18.1255L67.3997 9.70417C67.8059 8.71175 68.693 7.99715 69.7489 7.81175C72.7848 7.27889 79.1118 6.16878 82.1475 5.63591C83.2036 5.45052 84.2812 5.82046 85.0008 6.61541C87.0505 8.87917 91.1078 13.3603 91.1078 13.3603C91.1078 13.3603 82.3286 14.9011 78.5494 15.5643C77.4932 15.7497 76.6062 16.464 76.2003 17.4564C75.8 18.4345 75.2865 19.6898 74.8705 20.7064C74.4157 21.8182 74.6393 23.0927 75.4455 23.9831C76.1829 24.7974 77.0932 25.8028 77.8022 26.5862C78.5219 27.3809 79.5994 27.7508 80.6556 27.5654L93.0949 25.3825L91.5022 29.2747C91.0963 30.2671 90.2093 30.9817 89.1531 31.1671C86.1171 31.7 79.7904 32.8101 76.7545 33.3429C75.6983 33.5283 74.621 33.1584 73.9014 32.3637L67.7944 25.6185L15.5382 34.789C13.9475 35.0682 12.3109 34.7039 10.9888 33.7766C9.66656 32.8491 8.76712 31.4345 8.48791 29.8438C8.48763 29.8418 8.48707 29.8398 8.48679 29.8379C8.43987 29.5705 8.41122 29.3016 8.40027 29.0328Z"
                fill="#ECE4E3"
            />
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M30.6508 21.3564C30.6508 20.5286 30.3219 19.7348 29.7365 19.1494C29.1514 18.5643 28.3573 18.2354 27.5298 18.2354C26.2241 18.2354 24.7101 18.2354 23.4048 18.2354C22.5769 18.2354 21.7831 18.5643 21.1977 19.1494C20.6123 19.7348 20.2837 20.5286 20.2837 21.3564V39.407C20.2837 40.2348 20.6123 41.0286 21.1977 41.614C21.7831 42.1991 22.5769 42.528 23.4048 42.528H27.5298C28.3573 42.528 29.1514 42.1991 29.7365 41.614C30.3219 41.0286 30.6508 40.2348 30.6508 39.407C30.6508 34.746 30.6508 26.0174 30.6508 21.3564Z"
                fill="#E69A83"
            />
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M29.0227 21.3564C29.0227 19.6328 27.6253 18.2354 25.9017 18.2354C25.0902 18.2354 24.216 18.2354 23.4048 18.2354C21.6809 18.2354 20.2837 19.6328 20.2837 21.3564V34.7019C20.2837 36.4255 21.6809 37.823 23.4048 37.823H25.9017C27.6253 37.823 29.0227 36.4255 29.0227 34.7019C29.0227 31.0429 29.0227 25.0154 29.0227 21.3564Z"
                fill="#F8AE96"
            />
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M41.018 15.8534C41.018 14.1298 39.6205 12.7323 37.8967 12.7323C36.5913 12.7323 35.0773 12.7323 33.7719 12.7323C32.0481 12.7323 30.6509 14.1298 30.6509 15.8534V41.0107C30.6509 42.7345 32.0481 44.132 33.7719 44.132H37.8967C39.6205 44.132 41.018 42.7345 41.018 41.0107C41.018 34.9969 41.018 21.8674 41.018 15.8534Z"
                fill="#E69A83"
            />
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M39.3203 15.8534C39.3203 15.0256 38.9913 14.2317 38.4062 13.6463C37.8208 13.061 37.027 12.7323 36.1992 12.7323C35.4096 12.7323 34.5616 12.7323 33.7719 12.7323C32.9441 12.7323 32.1503 13.061 31.5649 13.6463C30.9795 14.2317 30.6509 15.0256 30.6509 15.8534V35.5857C30.6509 36.4135 30.9795 37.2073 31.5649 37.7927C32.1503 38.3781 32.9441 38.707 33.7719 38.7067H36.1992C37.027 38.707 37.8208 38.3781 38.4062 37.7927C38.9913 37.2073 39.3203 36.4135 39.3203 35.5857C39.3203 30.5893 39.3203 20.85 39.3203 15.8534Z"
                fill="#F8AE96"
            />
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M51.3849 13.269C51.3849 11.5451 49.9877 10.1479 48.2639 10.1479C46.9585 10.1479 45.4445 10.1479 44.1391 10.1479C42.4153 10.1479 41.0181 11.5451 41.0181 13.269V39.4069C41.0181 41.1305 42.4153 42.528 44.1391 42.528H48.2639C49.9877 42.528 51.3849 41.1305 51.3849 39.4069C51.3849 33.2185 51.3849 19.4575 51.3849 13.269Z"
                fill="#E69A83"
            />
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M49.7571 13.269C49.7571 12.4412 49.4282 11.6474 48.8428 11.062C48.2577 10.4766 47.4636 10.1479 46.636 10.1479C45.8245 10.1479 44.9504 10.1479 44.1391 10.1479C43.3113 10.1479 42.5175 10.4766 41.9321 11.062C41.3467 11.6474 41.0181 12.4412 41.0181 13.269V34.087C41.0181 34.9148 41.3467 35.7086 41.9321 36.294C42.5175 36.8791 43.3113 37.2081 44.1391 37.2081H46.636C47.4636 37.2081 48.2577 36.8791 48.8428 36.294C49.4282 35.7086 49.7571 34.9148 49.7571 34.087C49.7571 28.8791 49.7571 18.4766 49.7571 13.269Z"
                fill="#F8AE96"
            />
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M61.752 15.8534C61.752 14.1295 60.3548 12.7323 58.631 12.7323C57.3256 12.7323 55.8116 12.7323 54.5062 12.7323C52.7824 12.7323 51.3849 14.1295 51.3849 15.8534V31.6536C51.3849 33.3775 52.7824 34.7747 54.5062 34.7747H58.631C60.3548 34.7747 61.752 33.3775 61.752 31.6536C61.752 27.4595 61.752 20.0475 61.752 15.8534Z"
                fill="#E69A83"
            />
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M60.1838 15.8534C60.1838 15.0256 59.8548 14.2317 59.2697 13.6463C58.6843 13.0612 57.8905 12.7323 57.0627 12.7323C56.2326 12.7323 55.336 12.7323 54.5062 12.7323C53.6784 12.7323 52.8846 13.0612 52.2992 13.6463C51.7138 14.2317 51.3849 15.0256 51.3849 15.8534V22.1812C51.3849 23.009 51.7138 23.8028 52.2992 24.3882C52.8846 24.9736 53.6784 25.3025 54.5062 25.3025H57.0627C57.8905 25.3025 58.6843 24.9736 59.2697 24.3882C59.8548 23.8028 60.1838 23.009 60.1838 22.1812C60.1838 20.2514 60.1838 17.7831 60.1838 15.8534Z"
                fill="#F8AE96"
            />
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M49.5068 52.5924C53.0147 44.0368 60.8335 41.3632 60.8335 41.3632C52.5214 41.7224 49.915 34.7561 49.1164 31.021C49.0006 30.4629 49.1425 29.882 49.5023 29.4399C49.8621 28.9974 50.4023 28.741 50.9725 28.741C53.8661 28.7362 58.961 28.7362 62.1652 28.7362C64.1534 28.7359 66.011 29.7258 67.1195 31.3761C68.9298 34.1424 71.2908 38.9786 71.2908 45.4452C71.2908 62.7899 58.1211 67.1014 58.1211 67.1014C58.1211 67.1014 48.0644 56.1104 49.5068 52.5924Z"
                fill="#E69A83"
            />
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M52.0141 40.2906C52.9916 41.3839 59.5613 27.0094 57.8548 27.01C55.7776 27.0106 53.7301 27.0117 52.2548 27.0142C50.9843 27.0142 49.7776 27.5878 48.9731 28.5763C48.1686 29.5645 47.8517 30.8625 48.1105 32.1103C48.1116 32.1151 48.1124 32.1198 48.1135 32.1246C48.6051 34.4229 49.7043 37.7075 52.0141 40.2906Z"
                fill="#E69A83"
            />
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M61.4484 28.7362C62.2824 29.2533 62.9829 29.9727 63.4793 30.8376C64.9888 33.4834 67.1959 38.5326 67.1959 45.4452C67.1959 58.4536 61.1352 64.7491 58.1051 67.0837C57.6568 66.5913 48.0981 56.0281 49.5068 52.5924C53.0147 44.0368 60.8335 41.3632 60.8335 41.3632C52.5214 41.7224 49.915 34.7561 49.1164 31.021C49.0006 30.4629 49.1425 29.882 49.5023 29.4399C49.8621 28.9974 50.4023 28.741 50.9725 28.741C53.6585 28.7365 58.2416 28.7362 61.4484 28.7362Z"
                fill="#F8AE96"
            />
        </Svg>
    );
};

Icon.Gauge = ({ className, gauge = 0, fill, round = true, bg, size = 100 }) => {
    const deash = 100.744;
    const setting = Math.round((deash / 100) * (100 - gauge));
    return (
        <Svg $width={setSize(size)} className={className} viewBox="0 0 40 40">
            <circle
                stroke={bg ? `var(--${bg})` : "#E6E6E6"}
                r="16"
                cx="20"
                cy="20"
                fill="transparent"
                strokeWidth="4"
                strokeDasharray={0}
                strokeDashoffset="0"
            />
            <circle
                style={{ transform: `rotate(-90deg)` }}
                stroke={
                    fill
                        ? fill === true
                            ? "currentcolor"
                            : setFill(fill)
                        : fill !== undefined
                        ? ""
                        : "var(--P_500)"
                }
                r="16"
                cx="-20"
                cy="20"
                fill="transparent"
                strokeWidth="4"
                strokeLinecap={round ? "round" : undefined}
                strokeDasharray={deash}
                strokeDashoffset={setting}
            />
        </Svg>
    );
};

Icon.Delete = ({ size = 100 }) => {
    return (
        <Svg $width={setSize(size)} viewBox="0 0 100 100">
            <g clipPath="url(#clip0_16756_35176)">
                <path
                    d="M51.6667 10H48.3334V6.66667C48.3334 5.78261 47.9822 4.93477 47.3571 4.30964C46.732 3.68452 45.8841 3.33333 45.0001 3.33333H38.3334C37.4494 3.33333 36.6015 3.68452 35.9764 4.30964C35.3513 4.93477 35.0001 5.78261 35.0001 6.66667V10H31.6667V6.66667C31.6667 4.89856 32.3691 3.20286 33.6194 1.95262C34.8696 0.702379 36.5653 0 38.3334 0L45.0001 0C46.7682 0 48.4639 0.702379 49.7141 1.95262C50.9644 3.20286 51.6667 4.89856 51.6667 6.66667V10Z"
                    fill="#D5D6DB"
                />
                <path
                    d="M8.33325 8.33337H74.9999C76.326 8.33337 77.5978 8.86016 78.5355 9.79784C79.4731 10.7355 79.9999 12.0073 79.9999 13.3334V16.6667C79.9999 17.1087 79.8243 17.5327 79.5118 17.8452C79.1992 18.1578 78.7753 18.3334 78.3333 18.3334H4.99992C4.55789 18.3334 4.13397 18.1578 3.82141 17.8452C3.50885 17.5327 3.33325 17.1087 3.33325 16.6667V13.3334C3.33325 12.0073 3.86004 10.7355 4.79772 9.79784C5.7354 8.86016 7.00717 8.33337 8.33325 8.33337Z"
                    fill="#EEEEEE"
                />
                <path
                    d="M73.4666 55.0667L74.9999 18.3334H8.33325L11.3333 90.35C11.4236 92.499 12.3413 94.5297 13.8944 96.0176C15.4475 97.5055 17.5158 98.3353 19.6666 98.3334H63.6666C65.1701 98.3354 66.6456 97.9262 67.9333 97.1501L73.4666 55.0667Z"
                    fill="#D5D6DB"
                />
                <path
                    d="M44.9999 31.6667C44.9999 29.8258 43.5075 28.3334 41.6666 28.3334C39.8256 28.3334 38.3333 29.8258 38.3333 31.6667V85C38.3333 86.841 39.8256 88.3334 41.6666 88.3334C43.5075 88.3334 44.9999 86.841 44.9999 85V31.6667Z"
                    fill="#BBBCBF"
                />
                <path
                    d="M56.6667 65.1334V31.6667C56.6694 30.7835 57.0214 29.9371 57.646 29.3126C58.2705 28.688 59.1168 28.336 60.0001 28.3334C60.8821 28.3399 61.7262 28.6932 62.3499 29.3169C62.9736 29.9406 63.3269 30.7847 63.3334 31.6667V58.4167L56.6667 65.1334Z"
                    fill="#BBBCBF"
                />
                <path
                    d="M26.6667 31.6667C26.6667 29.8258 25.1743 28.3334 23.3333 28.3334C21.4924 28.3334 20 29.8258 20 31.6667V85C20 86.841 21.4924 88.3334 23.3333 88.3334C25.1743 88.3334 26.6667 86.841 26.6667 85V31.6667Z"
                    fill="#BBBCBF"
                />
                <path
                    d="M97.2993 76.6497C97.2993 88.6063 87.6063 98.2985 75.6497 98.2985C63.693 98.2985 54 88.6063 54 76.6497C54 64.693 63.693 55 75.6497 55C87.6063 55 97.2993 64.693 97.2993 76.6497Z"
                    fill="#FFE671"
                />
                <path
                    d="M80.6704 55.5864C84.6315 59.5099 87.0863 64.9523 87.0863 70.9682C87.0863 82.9249 77.3933 92.6178 65.4366 92.6178C63.7081 92.6178 62.0275 92.4139 60.4158 92.0307C64.328 95.9054 69.7088 98.2986 75.6496 98.2986C87.6062 98.2986 97.2992 88.6064 97.2992 76.6498C97.2992 66.4217 90.2058 57.8509 80.6704 55.5864Z"
                    fill="#FFCE5E"
                />
                <path
                    d="M75.0001 91.6667C76.841 91.6667 78.3334 90.1743 78.3334 88.3333C78.3334 86.4924 76.841 85 75.0001 85C73.1591 85 71.6667 86.4924 71.6667 88.3333C71.6667 90.1743 73.1591 91.6667 75.0001 91.6667Z"
                    fill="#E0365F"
                />
                <path
                    d="M80 66.6666C80 69.4283 77.7617 78.3333 75 78.3333C72.2383 78.3333 70 69.4283 70 66.6666C70 65.3405 70.5268 64.0688 71.4645 63.1311C72.4022 62.1934 73.6739 61.6666 75 61.6666C76.3261 61.6666 77.5978 62.1934 78.5355 63.1311C79.4732 64.0688 80 65.3405 80 66.6666Z"
                    fill="#E0365F"
                />
            </g>
            <defs>
                <clipPath id="clip0_16756_35176">
                    <rect width="100" height="100" fill="white" />
                </clipPath>
            </defs>
        </Svg>
    );
};

Icon.FileComplete = ({ size = 54 }) => {
    return (
        <Svg $width={setSize(size)} viewBox="0 0 54 60" fill="none">
            <path
                d="M43.6032 17.39V49.2555C43.6032 51.9225 41.4412 54.0845 38.7743 54.0845H5.57507C2.90815 54.0845 0.746094 51.9225 0.746094 49.2555V4.82897C0.746094 2.16205 2.90815 0 5.57507 0H26.2427C26.7916 0 27.3277 0.124588 27.813 0.358068C28.1782 0.533722 43.0992 15.498 43.2766 15.8867C43.4899 16.3543 43.6032 16.8663 43.6032 17.39Z"
                fill="#F9F8F9"
            />
            <path
                d="M43.6049 17.3903V18.3066H31.0109C27.8793 18.3066 25.332 15.7557 25.332 12.6205V0H26.2447C27.2057 0 28.128 0.382696 28.8077 1.06358L42.5473 14.8322C43.2246 15.5107 43.6049 16.4306 43.6049 17.3903Z"
                fill="#F9F8F9"
            />
            <path
                d="M9.1968 54.0845H5.57507C2.90827 54.0845 0.746094 51.9223 0.746094 49.2555V4.82897C0.746094 2.16217 2.90827 0 5.57507 0H9.1968C6.53 0 4.36782 2.16217 4.36782 4.82897V49.2555C4.36782 51.9223 6.53 54.0845 9.1968 54.0845Z"
                fill="#E3E0E4"
            />
            <path
                d="M22.6125 18.1077H7.67887C7.17883 18.1077 6.77344 17.7023 6.77344 17.2023C6.77344 16.7023 7.17883 16.2969 7.67887 16.2969H22.6125C23.1125 16.2969 23.5179 16.7023 23.5179 17.2023C23.5179 17.7023 23.1125 18.1077 22.6125 18.1077Z"
                fill="#A29AA5"
            />
            <path
                d="M22.6125 39.8382H7.67887C7.17883 39.8382 6.77344 39.4328 6.77344 38.9328C6.77344 38.4327 7.17883 38.0273 7.67887 38.0273H22.6125C23.1125 38.0273 23.5179 38.4327 23.5179 38.9328C23.5179 39.4328 23.1125 39.8382 22.6125 39.8382Z"
                fill="#A29AA5"
            />
            <path
                d="M34.4789 25.3519H7.43668C6.93664 25.3519 6.53125 24.9465 6.53125 24.4464C6.53125 23.9464 6.93664 23.541 7.43668 23.541H34.4789C34.979 23.541 35.3844 23.9464 35.3844 24.4464C35.3844 24.9465 34.979 25.3519 34.4789 25.3519Z"
                fill="#A29AA5"
            />
            <path
                d="M34.4789 32.5941H7.43668C6.93664 32.5941 6.53125 32.1887 6.53125 31.6886C6.53125 31.1886 6.93664 30.7832 7.43668 30.7832H34.4789C34.979 30.7832 35.3844 31.1886 35.3844 31.6886C35.3844 32.1887 34.979 32.5941 34.4789 32.5941Z"
                fill="#A29AA5"
            />
            <path
                d="M40.9957 59.9992C47.7631 59.9992 53.2492 54.5131 53.2492 47.7457C53.2492 40.9783 47.7631 35.4922 40.9957 35.4922C34.2283 35.4922 28.7422 40.9783 28.7422 47.7457C28.7422 54.5131 34.2283 59.9992 40.9957 59.9992Z"
                fill="#80E29E"
            />
            <path
                d="M50.7828 55.1199C48.547 58.0849 44.9953 60.0008 40.9957 60.0008C34.2279 60.0008 28.7422 54.5151 28.7422 47.7473C28.7422 43.7477 30.6581 40.196 33.6231 37.959C32.0742 40.0101 31.1567 42.5646 31.1567 45.3328C31.1567 52.1006 36.6424 57.5863 43.4102 57.5863C46.1784 57.5863 48.7317 56.6688 50.7828 55.1199Z"
                fill="#77D192"
            />
            <path
                d="M40.1214 52.3333C39.658 52.3333 39.1945 52.1566 38.841 51.8028L35.0382 48C34.331 47.2928 34.331 46.1463 35.0382 45.4391C35.7453 44.7319 36.8919 44.7319 37.5991 45.4391L40.1216 47.9614L44.3945 43.6886C45.1016 42.9814 46.2482 42.9814 46.9554 43.6886C47.6626 44.3958 47.6626 45.5423 46.9554 46.2495L41.4021 51.8028C41.0484 52.1566 40.5849 52.3333 40.1214 52.3333Z"
                fill="#F9F8F9"
            />
            <path
                d="M43.6051 17.3903V19.5139H31.0111C27.2143 19.5139 24.125 16.4209 24.125 12.6205V0H26.2449C26.7693 0 27.2823 0.113964 27.7506 0.328249C28.1403 0.506559 43.1094 15.5099 43.2873 15.9062C43.4949 16.3684 43.6051 16.8736 43.6051 17.3903Z"
                fill="#E3E0E4"
            />
            <path
                d="M43.2797 15.8919H31.0105C29.2081 15.8919 27.7461 14.4263 27.7461 12.6203V0.328125C28.1372 0.504383 28.4982 0.753075 28.8073 1.06334L42.5469 14.8319C42.8547 15.141 43.1034 15.5008 43.2797 15.8919Z"
                fill="#A29AA5"
            />
        </Svg>
    );
};

Icon.FileChange = ({ size = 54 }) => {
    return (
        <Svg $width={setSize(size)} viewBox="0 0 54 60" fill="none">
            <path
                d="M43.5993 17.39V49.2555C43.5993 51.9225 41.4373 54.0845 38.7704 54.0845H5.57116C2.90424 54.0845 0.742188 51.9225 0.742188 49.2555V4.82897C0.742188 2.16205 2.90424 0 5.57116 0H26.2388C26.7877 0 27.3238 0.124588 27.8091 0.358068C28.1743 0.533722 43.0953 15.498 43.2726 15.8867C43.486 16.3543 43.5993 16.8663 43.5993 17.39Z"
                fill="#F9F8F9"
            />
            <path
                d="M43.6012 17.3903V19.5139H31.0072C27.2104 19.5139 24.1211 16.4209 24.1211 12.6205V0H26.241C26.7654 0 27.2784 0.113964 27.7467 0.328249C28.1364 0.506559 43.1055 15.5099 43.2834 15.9062C43.491 16.3684 43.6012 16.8736 43.6012 17.3903Z"
                fill="#E3E0E4"
            />
            <path
                d="M43.6012 17.3903V19.5139H31.0072C27.2104 19.5139 24.1211 16.4209 24.1211 12.6205V0H26.241C27.202 0 28.1243 0.382696 28.804 1.06358L42.5436 14.8322C43.2209 15.5107 43.6012 16.4306 43.6012 17.3903Z"
                fill="#E3E0E4"
            />
            <path
                d="M43.6012 17.3903V19.5139H31.0072C27.2104 19.5139 24.1211 16.4209 24.1211 12.6205V0H26.241C26.7654 0 27.2784 0.113964 27.7467 0.328249C28.1364 0.506559 43.1055 15.5099 43.2834 15.9062C43.491 16.3684 43.6012 16.8736 43.6012 17.3903Z"
                fill="#E3E0E4"
            />
            <path
                d="M9.19289 54.0845H5.57116C2.90436 54.0845 0.742188 51.9223 0.742188 49.2555V4.82897C0.742188 2.16217 2.90436 0 5.57116 0H9.19289C6.52609 0 4.36392 2.16217 4.36392 4.82897V49.2555C4.36392 51.9223 6.52609 54.0845 9.19289 54.0845Z"
                fill="#E3E0E4"
            />
            <path
                d="M22.6086 18.1077H7.67496C7.17492 18.1077 6.76953 17.7023 6.76953 17.2023C6.76953 16.7023 7.17492 16.2969 7.67496 16.2969H22.6086C23.1086 16.2969 23.514 16.7023 23.514 17.2023C23.514 17.7023 23.1086 18.1077 22.6086 18.1077Z"
                fill="#A29AA5"
            />
            <path
                d="M22.6086 39.8382H7.67496C7.17492 39.8382 6.76953 39.4328 6.76953 38.9328C6.76953 38.4327 7.17492 38.0273 7.67496 38.0273H22.6086C23.1086 38.0273 23.514 38.4327 23.514 38.9328C23.514 39.4328 23.1086 39.8382 22.6086 39.8382Z"
                fill="#A29AA5"
            />
            <path
                d="M34.475 25.3519H7.43278C6.93274 25.3519 6.52734 24.9465 6.52734 24.4464C6.52734 23.9464 6.93274 23.541 7.43278 23.541H34.475C34.9751 23.541 35.3805 23.9464 35.3805 24.4464C35.3805 24.9465 34.9751 25.3519 34.475 25.3519Z"
                fill="#A29AA5"
            />
            <path
                d="M34.475 32.596H7.43278C6.93274 32.596 6.52734 32.1906 6.52734 31.6906C6.52734 31.1905 6.93274 30.7852 7.43278 30.7852H34.475C34.9751 30.7852 35.3805 31.1905 35.3805 31.6906C35.3805 32.1906 34.9751 32.596 34.475 32.596Z"
                fill="#A29AA5"
            />
            <path
                d="M43.2758 15.8919H31.0066C29.2042 15.8919 27.7422 14.4263 27.7422 12.6203V0.328125C28.1333 0.504383 28.4943 0.753075 28.8034 1.06334L42.543 14.8319C42.8508 15.141 43.0995 15.5008 43.2758 15.8919Z"
                fill="#A29AA5"
            />
            <path
                d="M41.0556 59.9074C47.8238 59.9074 53.3105 54.4213 53.3105 47.6539C53.3105 40.8865 47.8238 35.4004 41.0556 35.4004C34.2875 35.4004 28.8008 40.8865 28.8008 47.6539C28.8008 54.4213 34.2875 59.9074 41.0556 59.9074Z"
                fill="#8CA5FF"
            />
            <path
                d="M50.7892 55.1187C48.5533 58.0837 45.0004 59.9996 41.0008 59.9996C34.233 59.9996 28.7461 54.5139 28.7461 47.7461C28.7461 43.7465 30.662 40.1948 33.627 37.959C32.0781 40.0101 31.1606 42.5634 31.1606 45.3316C31.1606 52.0994 36.6475 57.5851 43.4153 57.5851C46.1835 57.5851 48.7368 56.6676 50.7892 55.1187Z"
                fill="#6487FA"
            />
            <path
                d="M38.4916 46.6081C38.1655 46.2908 37.6437 46.2983 37.3264 46.6244L36.9766 46.9842C37.1526 44.9167 38.6227 43.0979 40.742 42.5876C41.9964 42.2852 43.2987 42.4819 44.4087 43.1413C44.8001 43.3736 45.3054 43.2448 45.5379 42.8535C45.7702 42.4622 45.6414 41.9567 45.2501 41.7243C43.7687 40.8447 42.0308 40.582 40.3563 40.9854C37.5375 41.664 35.58 44.0779 35.3369 46.8244L35.0808 46.4886C34.8048 46.1268 34.2878 46.057 33.926 46.3328C33.5642 46.6088 33.4944 47.1258 33.7702 47.4876L35.1428 49.288C35.3515 49.5618 35.6682 49.7308 36.0117 49.7515C36.0355 49.7529 36.0593 49.7536 36.083 49.7536C36.4011 49.7536 36.7064 49.6253 36.93 49.3956L38.5079 47.7731C38.8252 47.447 38.8178 46.9252 38.4916 46.6081Z"
                fill="white"
            />
            <path
                d="M49.9859 47.1026L48.5809 45.3277C48.3673 45.0577 48.0476 44.8945 47.7038 44.8801C47.361 44.8645 47.0278 45.0012 46.7922 45.2525L45.2438 46.9036C44.9324 47.2356 44.9493 47.7569 45.2812 48.0682C45.6132 48.3795 46.1347 48.3628 46.4458 48.0308L46.8238 47.6278C46.7253 49.7737 45.2307 51.6902 43.0458 52.2163C41.6608 52.5501 40.1991 52.2667 39.0361 51.4392C38.665 51.1752 38.1508 51.2622 37.887 51.633C37.6232 52.0038 37.71 52.5182 38.0808 52.782C39.2058 53.5825 40.5404 54.0011 41.8941 54.001C42.4073 54.001 42.9233 53.9409 43.4317 53.8186C46.2999 53.128 48.2781 50.6414 48.4641 47.8355L48.6937 48.1256C48.8563 48.3311 49.0972 48.4382 49.3403 48.4382C49.5193 48.4382 49.6998 48.38 49.8512 48.2603C50.2079 47.9777 50.2681 47.4594 49.9859 47.1026Z"
                fill="white"
            />
        </Svg>
    );
};

Icon.Security = ({ size = 54 }) => {
    return (
        <Svg $width={setSize(size)} viewBox="0 0 60 60" fill="none">
            <g clipPath="url(#clip0_2235_78960)">
                <path
                    d="M34.0939 59.8277H1.58137C0.897812 59.8277 0.34375 59.27 0.34375 58.582V23.8508C0.34375 22.9345 1.29344 22.3318 2.1148 22.7267L34.7031 38.394C35.1347 38.6015 35.4089 39.0407 35.4073 39.5222L35.3315 58.5862C35.3293 59.2726 34.7758 59.8277 34.0939 59.8277Z"
                    fill="#D5CFD6"
                />
                <path
                    d="M51.1056 59.8277H18.5931C17.9095 59.8277 17.3555 59.27 17.3555 58.582V23.8508C17.3555 22.9345 18.3052 22.3318 19.1265 22.7267L51.7148 38.394C52.1464 38.6015 52.4207 39.0407 52.419 39.5222L52.3432 58.5862C52.3409 59.2726 51.7875 59.8277 51.1056 59.8277Z"
                    fill="#F6F3F5"
                />
                <path
                    d="M51.7141 38.3936L48.6002 36.8965C48.7385 37.1006 48.8182 37.3443 48.8173 37.6012L48.7415 58.5858C48.7392 59.2721 48.1858 59.8273 47.5039 59.8273H51.105C51.7869 59.8273 52.3403 59.272 52.3426 58.5858L52.4184 39.5218C52.4199 39.0403 52.1457 38.6011 51.7141 38.3936Z"
                    fill="#E8E5E8"
                />
                <path
                    d="M11.1727 40.2891H0.900234C0.403008 40.2891 0 40.6921 0 41.1893C0 41.6865 0.403008 42.0895 0.900234 42.0895H11.1727C11.6699 42.0895 12.0729 41.6865 12.0729 41.1893C12.0729 40.692 11.6699 40.2891 11.1727 40.2891Z"
                    fill="#8D818C"
                />
                <path
                    d="M11.1727 45.9648H0.900234C0.403008 45.9648 0 46.3679 0 46.8651C0 47.3623 0.403008 47.7653 0.900234 47.7653H11.1727C11.6699 47.7653 12.0729 47.3623 12.0729 46.8651C12.0729 46.3679 11.6699 45.9648 11.1727 45.9648Z"
                    fill="#8D818C"
                />
                <path
                    d="M11.1727 51.6426H0.900234C0.403008 51.6426 0 52.0456 0 52.5428C0 53.04 0.403008 53.443 0.900234 53.443H11.1727C11.6699 53.443 12.0729 53.04 12.0729 52.5428C12.0729 52.0456 11.6699 51.6426 11.1727 51.6426Z"
                    fill="#8D818C"
                />
                <path
                    d="M17.451 42.0895H27.7232C28.2204 42.0895 28.6234 41.6865 28.6234 41.1893C28.6234 40.6921 28.2204 40.2891 27.7232 40.2891H17.451C16.9538 40.2891 16.5508 40.6921 16.5508 41.1893C16.5507 41.6865 16.9537 42.0895 17.451 42.0895Z"
                    fill="#8D818C"
                />
                <path
                    d="M27.7232 45.9648H17.451C16.9538 45.9648 16.5508 46.3679 16.5508 46.8651C16.5508 47.3623 16.9538 47.7653 17.451 47.7653H27.7232C28.2204 47.7653 28.6234 47.3623 28.6234 46.8651C28.6234 46.3679 28.2204 45.9648 27.7232 45.9648Z"
                    fill="#8D818C"
                />
                <path
                    d="M27.7232 51.6426H17.451C16.9538 51.6426 16.5508 52.0456 16.5508 52.5428C16.5508 53.04 16.9538 53.443 17.451 53.443H27.7232C28.2204 53.443 28.6234 53.04 28.6234 52.5428C28.6234 52.0456 28.2204 51.6426 27.7232 51.6426Z"
                    fill="#8D818C"
                />
                <path
                    d="M41.0783 39.0604C54.968 33.1978 58.9359 16.6597 59.9699 10.2453C60.1864 8.90308 59.2093 7.66828 57.857 7.56879C49.3349 6.94172 44.1496 3.13593 41.7425 0.820544C40.8483 -0.0394957 39.4294 -0.0486362 38.5424 0.818903C34.4375 4.83386 28.1074 7.06347 22.3778 7.55367C21.0545 7.66687 20.1084 8.88175 20.3027 10.1994C22.025 21.883 28.0935 34.3335 39.2685 39.0625C39.8473 39.3075 40.4992 39.3047 41.0783 39.0604Z"
                    fill="#90D774"
                />
                <path
                    d="M57.8559 7.56957C57.4451 7.53934 57.0445 7.49961 56.6492 7.45508C56.9328 7.91094 57.061 8.46828 56.9679 9.04578C55.9337 15.4603 51.9659 31.9982 38.0763 37.8608C37.7808 37.9855 37.4664 38.0464 37.1523 38.0444C37.836 38.4148 38.5407 38.7557 39.2673 39.0632C39.8461 39.3082 40.4982 39.3055 41.0772 39.061C54.9667 33.1986 58.9346 16.6605 59.9686 10.2461C60.1851 8.90387 59.208 7.66906 57.8559 7.56957Z"
                    fill="#78D055"
                />
                <path
                    d="M40.1754 34.2826C40.0122 34.2826 39.8507 34.2438 39.708 34.1702C31.8565 30.1227 27.4077 21.3131 25.5217 13.0462C25.3765 12.4097 25.7812 11.7743 26.4207 11.6514C31.0652 10.7586 35.6458 8.97187 39.4442 6.11448C39.8596 5.80194 40.4278 5.7989 40.8412 6.11425C43.7027 8.29734 47.9519 10.6465 53.777 11.7048C54.4287 11.8232 54.8521 12.463 54.6973 13.1088C53.1641 19.5025 49.4152 29.6771 40.6449 34.17C40.501 34.2437 40.3387 34.2826 40.1754 34.2826Z"
                    fill="#FFE589"
                />
                <path
                    d="M37.8733 23.8341C37.4755 23.8341 37.1018 23.6791 36.8208 23.3974L34.5244 21.0942C34.1734 20.742 34.1743 20.172 34.5263 19.8209C34.8784 19.4701 35.4483 19.4708 35.7995 19.8228L37.8733 21.9028L44.4198 15.3369C44.7711 14.9847 45.3409 14.984 45.6931 15.335C46.0451 15.6861 46.0459 16.2561 45.695 16.6082L38.9257 23.3973C38.6446 23.6791 38.2709 23.8341 37.8733 23.8341Z"
                    fill="#90D774"
                />
            </g>
            <defs>
                <clipPath id="clip0_2235_78960">
                    <rect width="60" height="60" fill="white" />
                </clipPath>
            </defs>
        </Svg>
    );
};

Icon.QualityControl = ({ size = 54 }) => {
    return (
        <Svg $width={setSize(size)} viewBox="0 0 60 60" fill="none">
            <g clipPath="url(#clip0_2235_78992)">
                <path
                    d="M57.6742 52.5096H21.2636C19.9789 52.5096 18.9375 51.4682 18.9375 50.1836V2.32605C18.9375 1.04145 19.9789 0 21.2636 0H22.7646L39.4689 4.82637L56.1731 0H57.6742C58.9588 0 60.0002 1.04145 60.0002 2.32605V50.1837C60.0002 51.4683 58.9588 52.5096 57.6742 52.5096Z"
                    fill="#9AD4FE"
                />
                <path
                    d="M47.7541 48.7298H22.7656V0H56.1741V40.3098C56.1741 40.5257 56.0884 40.7327 55.9357 40.8854L50.7823 43.5022L48.3297 48.4914C48.177 48.6442 47.97 48.7298 47.7541 48.7298Z"
                    fill="#F6F3F5"
                />
                <path
                    d="M52.5547 0V44.2668L55.936 40.8854C56.0887 40.7327 56.1745 40.5257 56.1745 40.3098V0L52.5547 0Z"
                    fill="#E8E5E8"
                />
                <path d="M22.7656 0H56.1741V9.5366H22.7656V0Z" fill="#8D818C" />
                <path d="M52.5547 0H56.1745V9.5366H52.5547V0Z" fill="#7B727B" />
                <path
                    d="M46.2447 4.22555H32.6948C31.528 4.22555 30.582 3.27961 30.582 2.11277V0H48.3574V2.11277C48.3575 3.27961 47.4116 4.22555 46.2447 4.22555Z"
                    fill="#FFE589"
                />
                <path
                    d="M48.4735 20.2374C48.2419 20.2374 48.0102 20.149 47.8336 19.9724L46.2885 18.4273C45.9351 18.0738 45.9351 17.5009 46.2885 17.1474C46.6418 16.7942 47.2149 16.7942 47.5683 17.1474L48.4736 18.0526L51.0425 15.4837C51.3958 15.1304 51.9688 15.1304 52.3223 15.4837C52.6757 15.8371 52.6757 16.41 52.3223 16.7636L49.1134 19.9724C48.9366 20.1489 48.705 20.2374 48.4735 20.2374Z"
                    fill="#90D774"
                />
                <path
                    d="M48.4735 27.9405C48.2335 27.9405 48.0033 27.8452 47.8335 27.6754L46.2884 26.1302C45.9351 25.7769 45.9351 25.2038 46.2885 24.8504C46.6419 24.4972 47.2149 24.4971 47.5683 24.8505L48.4735 25.7558L51.0424 23.1868C51.3957 22.8336 51.9687 22.8336 52.3222 23.1868C52.6756 23.5402 52.6756 24.1131 52.3222 24.4667L49.1133 27.6755C48.9436 27.8451 48.7134 27.9405 48.4735 27.9405Z"
                    fill="#90D774"
                />
                <path
                    d="M48.4735 35.6436C48.2419 35.6436 48.0102 35.5553 47.8336 35.3787L46.2885 33.8335C45.9351 33.4801 45.9351 32.9072 46.2885 32.5536C46.6418 32.2004 47.2149 32.2004 47.5683 32.5536L48.4736 33.4589L51.0425 30.8899C51.3958 30.5367 51.9688 30.5367 52.3223 30.8899C52.6757 31.2433 52.6757 31.8163 52.3223 32.1698L49.1134 35.3787C48.9366 35.5553 48.705 35.6436 48.4735 35.6436Z"
                    fill="#90D774"
                />
                <path
                    d="M27.6588 18.7259H42.3902C42.89 18.7259 43.2952 18.3207 43.2952 17.8209C43.2952 17.3211 42.89 16.916 42.3902 16.916H27.6588C27.159 16.916 26.7539 17.3211 26.7539 17.8209C26.7539 18.3207 27.1591 18.7259 27.6588 18.7259Z"
                    fill="#D5CFD6"
                />
                <path
                    d="M42.3902 24.6191H27.6588C27.159 24.6191 26.7539 25.0243 26.7539 25.5241C26.7539 26.0239 27.159 26.429 27.6588 26.429H42.3902C42.89 26.429 43.2952 26.0239 43.2952 25.5241C43.2953 25.0243 42.89 24.6191 42.3902 24.6191Z"
                    fill="#D5CFD6"
                />
                <path
                    d="M42.3902 32.3223H27.6588C27.159 32.3223 26.7539 32.7274 26.7539 33.2272C26.7539 33.727 27.159 34.1321 27.6588 34.1321H42.3902C42.89 34.1321 43.2952 33.727 43.2952 33.2272C43.2952 32.7274 42.89 32.3223 42.3902 32.3223Z"
                    fill="#D5CFD6"
                />
                <path
                    d="M42.3902 40.0254H27.6588C27.159 40.0254 26.7539 40.4305 26.7539 40.9303C26.7539 41.4301 27.159 41.8352 27.6588 41.8352H42.3902C42.89 41.8352 43.2952 41.4301 43.2952 40.9303C43.2952 40.4305 42.89 40.0254 42.3902 40.0254Z"
                    fill="#D5CFD6"
                />
                <path
                    d="M48.2884 48.5309L55.9742 40.845C56.0475 40.7718 55.9955 40.6465 55.892 40.6465H49.2528C48.6105 40.6465 48.0898 41.1671 48.0898 41.8095V48.4486C48.0898 48.5523 48.2151 48.6041 48.2884 48.5309Z"
                    fill="#D5CFD6"
                />
                <path
                    d="M33.0742 44.1648C33.0742 45.8538 31.0877 47.2081 30.593 48.7321C30.0802 50.3116 30.8734 52.5715 29.9166 53.8861C28.9502 55.214 26.5493 55.1533 25.2216 56.1196C23.9068 57.0763 23.2281 59.3839 21.6486 59.8967C20.1246 60.3916 18.2261 58.94 16.5371 58.94C14.8482 58.94 12.9497 60.3916 11.4258 59.8968C9.84633 59.384 9.16746 57.0766 7.85273 56.1197C6.52488 55.1534 4.12406 55.2141 3.15773 53.8863C2.2009 52.5715 2.99426 50.3117 2.48133 48.7322C1.98645 47.2081 0 45.8538 0 44.1648C0 42.4759 1.98645 41.1216 2.48121 39.5976C2.99402 38.0181 2.20078 35.7582 3.15762 34.4436C4.12395 33.1157 6.52488 33.1764 7.85262 32.2101C9.16734 31.2532 9.84609 28.9458 11.4255 28.433C12.9496 27.9381 14.8481 29.3897 16.537 29.3897C18.2259 29.3897 20.1245 27.9381 21.6484 28.4329C23.2278 28.9457 23.9067 31.2531 25.2214 32.21C26.5493 33.1763 28.9501 33.1156 29.9164 34.4434C30.8733 35.7582 30.0799 38.018 30.5928 39.5975C31.0877 41.1215 33.0742 42.4759 33.0742 44.1648Z"
                    fill="#90D774"
                />
                <path
                    d="M33.0725 44.1648C33.0725 42.4759 31.0861 41.1214 30.5912 39.5975C30.0784 38.018 30.8716 35.7582 29.9148 34.4435C28.9485 33.1156 26.5475 33.1764 25.2198 32.21C23.9051 31.2532 23.2262 28.9457 21.6468 28.4329C20.7785 28.151 19.7886 28.5009 18.7852 28.8542C18.7852 28.8542 28.4297 33.9103 28.4297 44.1648C28.4297 53.9149 18.7853 59.4753 18.7853 59.4753C19.7886 59.8286 20.7786 60.1786 21.6469 59.8966C23.2263 59.3838 23.9051 57.0764 25.2198 56.1195C26.5477 55.1532 28.9485 55.2139 29.9148 53.8861C30.8716 52.5713 30.0784 50.3115 30.5912 48.732C31.0861 47.208 33.0725 45.8537 33.0725 44.1648Z"
                    fill="#78D055"
                />
                <path
                    d="M16.537 54.8689C22.4492 54.8689 27.242 50.0761 27.242 44.1639C27.242 38.2518 22.4492 33.459 16.537 33.459C10.6248 33.459 5.83203 38.2518 5.83203 44.1639C5.83203 50.0761 10.6248 54.8689 16.537 54.8689Z"
                    fill="#F6F3F5"
                />
                <path
                    d="M22.8988 49.1791L21.8177 48.098C22.6352 46.9986 23.1198 45.6376 23.1198 44.1652C23.1198 40.5234 20.1569 37.5605 16.515 37.5605C12.873 37.5605 9.91016 40.5234 9.91016 44.1652C9.91016 47.8072 12.8731 50.77 16.515 50.77C18.0332 50.77 19.4325 50.2537 20.5493 49.3893L21.6189 50.459C21.7957 50.6356 22.0272 50.724 22.2588 50.724C22.4904 50.724 22.722 50.6356 22.8986 50.459C23.2522 50.1056 23.2522 49.5327 22.8988 49.1791ZM16.5151 48.9602C13.8712 48.9602 11.7201 46.8092 11.7201 44.1652C11.7201 41.5213 13.8711 39.3704 16.5151 39.3704C19.1591 39.3704 21.3099 41.5213 21.3099 44.1652C21.3099 45.1375 21.0182 46.0427 20.5189 46.7991L19.2519 45.5321C18.8986 45.1789 18.3255 45.1789 17.9721 45.5321C17.6186 45.8855 17.6186 46.4585 17.9721 46.812L19.256 48.0959C18.4786 48.6399 17.5338 48.9602 16.5151 48.9602Z"
                    fill="#FFCD55"
                />
            </g>
            <defs>
                <clipPath id="clip0_2235_78992">
                    <rect width="60" height="60" fill="white" />
                </clipPath>
            </defs>
        </Svg>
    );
};

Icon.Logout = ({ size = 24 }) => {
    return (
        <Svg $width={setSize(size)} viewBox="0 0 16 16" fill="none">
            <g clipPath="url(#clip0_2235_78960)">
                <path
                    d="M10.9505 11.5625C10.7977 11.3819 10.7214 11.1771 10.7214 10.9479C10.7214 10.7188 10.7977 10.5278 10.9505 10.375L12.4922 8.83333H6.51302C6.27691 8.83333 6.07899 8.75347 5.91927 8.59375C5.75955 8.43403 5.67969 8.23611 5.67969 8C5.67969 7.76389 5.75955 7.56597 5.91927 7.40625C6.07899 7.24653 6.27691 7.16667 6.51302 7.16667H12.4922L10.9505 5.625C10.7839 5.45833 10.7005 5.26042 10.7005 5.03125C10.7005 4.80208 10.7839 4.60417 10.9505 4.4375C11.1033 4.27083 11.2943 4.1875 11.5234 4.1875C11.7526 4.1875 11.9436 4.26389 12.0964 4.41667L15.0964 7.41667C15.1797 7.5 15.2387 7.59028 15.2734 7.6875C15.3082 7.78472 15.3255 7.88889 15.3255 8C15.3255 8.11111 15.3082 8.21528 15.2734 8.3125C15.2387 8.40972 15.1797 8.5 15.0964 8.58333L12.0964 11.5833C11.9158 11.7639 11.7179 11.8438 11.5026 11.8229C11.2873 11.8021 11.1033 11.7153 10.9505 11.5625ZM2.34635 15.5C1.88802 15.5 1.49566 15.3368 1.16927 15.0104C0.842882 14.684 0.679688 14.2917 0.679688 13.8333V2.16667C0.679688 1.70833 0.842882 1.31597 1.16927 0.989583C1.49566 0.663194 1.88802 0.5 2.34635 0.5H7.34635C7.58247 0.5 7.78038 0.579861 7.9401 0.739583C8.09983 0.899306 8.17969 1.09722 8.17969 1.33333C8.17969 1.56944 8.09983 1.76736 7.9401 1.92708C7.78038 2.08681 7.58247 2.16667 7.34635 2.16667H2.34635V13.8333H7.34635C7.58247 13.8333 7.78038 13.9132 7.9401 14.0729C8.09983 14.2326 8.17969 14.4306 8.17969 14.6667C8.17969 14.9028 8.09983 15.1007 7.9401 15.2604C7.78038 15.4201 7.58247 15.5 7.34635 15.5H2.34635Z"
                    fill="var(--G_500)"
                />
            </g>
        </Svg>
    );
};

Icon.DoubleSidedArrow = ({ size = 24 }) => {
    return (
        <Svg $width={setSize(size)} viewBox="0 0 22 9" fill="none">
            <g clipPath="url(#clip0_2235_78960)">
                <path
                    d="M0.646447 4.14645C0.451184 4.34171 0.451184 4.65829 0.646447 4.85355L3.82843 8.03553C4.02369 8.2308 4.34027 8.2308 4.53553 8.03553C4.7308 7.84027 4.7308 7.52369 4.53553 7.32843L1.70711 4.5L4.53553 1.67157C4.7308 1.47631 4.7308 1.15973 4.53553 0.964466C4.34027 0.769204 4.02369 0.769204 3.82843 0.964466L0.646447 4.14645ZM21.3536 4.85355C21.5488 4.65829 21.5488 4.34171 21.3536 4.14645L18.1716 0.964466C17.9763 0.769204 17.6597 0.769204 17.4645 0.964466C17.2692 1.15973 17.2692 1.47631 17.4645 1.67157L20.2929 4.5L17.4645 7.32843C17.2692 7.52369 17.2692 7.84027 17.4645 8.03553C17.6597 8.2308 17.9763 8.2308 18.1716 8.03553L21.3536 4.85355ZM1 5H21V4H1V5Z"
                    fill="#888C94"
                />
            </g>
        </Svg>
    );
};

Icon.Building = ({ size = 24, fill = "var(--G_100)" }) => {
    return (
        <Svg $width={setSize(size)} viewBox="0 0 17 16" fill="none">
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M5.16927 2.66683C4.99246 2.66683 4.82289 2.73707 4.69787 2.86209C4.57284 2.98712 4.5026 3.15668 4.5026 3.3335V13.3335H12.5026V3.3335C12.5026 3.15669 12.4324 2.98712 12.3073 2.86209C12.1823 2.73707 12.0127 2.66683 11.8359 2.66683H5.16927ZM13.8359 13.3335V3.3335C13.8359 2.80306 13.6252 2.29436 13.2502 1.91928C12.8751 1.54421 12.3664 1.3335 11.8359 1.3335H5.16927C4.63884 1.3335 4.13013 1.54421 3.75506 1.91928C3.37998 2.29436 3.16927 2.80306 3.16927 3.3335V13.3335H2.5026C2.13441 13.3335 1.83594 13.632 1.83594 14.0002C1.83594 14.3684 2.13441 14.6668 2.5026 14.6668H14.5026C14.8708 14.6668 15.1693 14.3684 15.1693 14.0002C15.1693 13.632 14.8708 13.3335 14.5026 13.3335H13.8359ZM5.83594 5.3335C5.83594 4.96531 6.13441 4.66683 6.5026 4.66683H7.16927C7.53746 4.66683 7.83594 4.96531 7.83594 5.3335C7.83594 5.70169 7.53746 6.00016 7.16927 6.00016H6.5026C6.13441 6.00016 5.83594 5.70169 5.83594 5.3335ZM9.16927 5.3335C9.16927 4.96531 9.46775 4.66683 9.83594 4.66683H10.5026C10.8708 4.66683 11.1693 4.96531 11.1693 5.3335C11.1693 5.70169 10.8708 6.00016 10.5026 6.00016H9.83594C9.46775 6.00016 9.16927 5.70169 9.16927 5.3335ZM5.83594 8.00016C5.83594 7.63197 6.13441 7.3335 6.5026 7.3335H7.16927C7.53746 7.3335 7.83594 7.63197 7.83594 8.00016C7.83594 8.36835 7.53746 8.66683 7.16927 8.66683H6.5026C6.13441 8.66683 5.83594 8.36835 5.83594 8.00016ZM9.16927 8.00016C9.16927 7.63197 9.46775 7.3335 9.83594 7.3335H10.5026C10.8708 7.3335 11.1693 7.63197 11.1693 8.00016C11.1693 8.36835 10.8708 8.66683 10.5026 8.66683H9.83594C9.46775 8.66683 9.16927 8.36835 9.16927 8.00016ZM5.83594 10.6668C5.83594 10.2986 6.13441 10.0002 6.5026 10.0002H7.16927C7.53746 10.0002 7.83594 10.2986 7.83594 10.6668C7.83594 11.035 7.53746 11.3335 7.16927 11.3335H6.5026C6.13441 11.3335 5.83594 11.035 5.83594 10.6668ZM9.16927 10.6668C9.16927 10.2986 9.46775 10.0002 9.83594 10.0002H10.5026C10.8708 10.0002 11.1693 10.2986 11.1693 10.6668C11.1693 11.035 10.8708 11.3335 10.5026 11.3335H9.83594C9.46775 11.3335 9.16927 11.035 9.16927 10.6668Z"
                fill={setFill(fill)}
            />
        </Svg>
    );
};

Icon.UserSetting = ({ size = 24, fill = "var(--G_500)" }) => {
    return (
        <Svg $width={setSize(size)} viewBox="0 0 14 12" fill="none">
            <path
                d="M5.80501 5.66732C5.07168 5.66732 4.4439 5.40621 3.92168 4.88398C3.39946 4.36176 3.13835 3.73398 3.13835 3.00065C3.13835 2.26732 3.39946 1.63954 3.92168 1.11732C4.4439 0.595095 5.07168 0.333984 5.80501 0.333984C6.53835 0.333984 7.16612 0.595095 7.68835 1.11732C8.21057 1.63954 8.47168 2.26732 8.47168 3.00065C8.47168 3.73398 8.21057 4.36176 7.68835 4.88398C7.16612 5.40621 6.53835 5.66732 5.80501 5.66732ZM0.47168 9.66732V9.13398C0.47168 8.76732 0.566124 8.42287 0.755013 8.10065C0.943902 7.77843 1.20501 7.53398 1.53835 7.36732C2.10501 7.07843 2.7439 6.83398 3.45501 6.63398C4.16612 6.43398 4.94946 6.33398 5.80501 6.33398H6.03835C6.10501 6.33398 6.17168 6.3451 6.23835 6.36732C6.14946 6.56732 6.07446 6.77565 6.01335 6.99232C5.95223 7.20898 5.90501 7.43398 5.87168 7.66732H5.80501C5.01612 7.66732 4.30779 7.76732 3.68001 7.96732C3.05224 8.16732 2.53835 8.36732 2.13835 8.56732C2.03835 8.62287 1.95779 8.70065 1.89668 8.80065C1.83557 8.90065 1.80501 9.01176 1.80501 9.13398V9.66732H6.00501C6.07168 9.90065 6.16057 10.1312 6.27168 10.359C6.38279 10.5868 6.50501 10.8007 6.63835 11.0007H1.80501C1.43835 11.0007 1.12446 10.8701 0.863346 10.609C0.602235 10.3479 0.47168 10.034 0.47168 9.66732ZM9.70501 11.134L9.60501 10.6673C9.47168 10.6118 9.34668 10.5534 9.23001 10.4923C9.11335 10.4312 8.9939 10.3562 8.87168 10.2673L8.38835 10.4173C8.2439 10.4618 8.10223 10.4562 7.96335 10.4007C7.82446 10.3451 7.71612 10.2562 7.63835 10.134L7.50501 9.90065C7.42723 9.76732 7.39946 9.62287 7.42168 9.46732C7.4439 9.31176 7.51612 9.18398 7.63835 9.08398L8.00501 8.76732C7.98279 8.61176 7.97168 8.46732 7.97168 8.33398C7.97168 8.20065 7.98279 8.05621 8.00501 7.90065L7.63835 7.58398C7.51612 7.48398 7.4439 7.35898 7.42168 7.20898C7.39946 7.05898 7.42723 6.91732 7.50501 6.78398L7.65501 6.53398C7.73279 6.41176 7.83835 6.32287 7.97168 6.26732C8.10501 6.21176 8.2439 6.20621 8.38835 6.25065L8.87168 6.40065C8.9939 6.31176 9.11335 6.23676 9.23001 6.17565C9.34668 6.11454 9.47168 6.05621 9.60501 6.00065L9.70501 5.51732C9.73835 5.36176 9.81335 5.23676 9.93001 5.14232C10.0467 5.04787 10.1828 5.00065 10.3383 5.00065H10.605C10.7606 5.00065 10.8967 5.05065 11.0133 5.15065C11.13 5.25065 11.205 5.37843 11.2383 5.53398L11.3383 6.00065C11.4717 6.05621 11.5967 6.11732 11.7133 6.18398C11.83 6.25065 11.9495 6.33398 12.0717 6.43398L12.5217 6.28398C12.6772 6.22843 12.8272 6.22843 12.9717 6.28398C13.1161 6.33954 13.2272 6.43398 13.305 6.56732L13.4383 6.80065C13.5161 6.93398 13.5439 7.07843 13.5217 7.23398C13.4995 7.38954 13.4272 7.51732 13.305 7.61732L12.9383 7.93398C12.9606 8.06732 12.9717 8.20621 12.9717 8.35065C12.9717 8.4951 12.9606 8.63398 12.9383 8.76732L13.305 9.08398C13.4272 9.18398 13.4995 9.30898 13.5217 9.45898C13.5439 9.60898 13.5161 9.75065 13.4383 9.88398L13.2883 10.134C13.2106 10.2562 13.105 10.3451 12.9717 10.4007C12.8383 10.4562 12.6995 10.4618 12.555 10.4173L12.0717 10.2673C11.9495 10.3562 11.83 10.4312 11.7133 10.4923C11.5967 10.5534 11.4717 10.6118 11.3383 10.6673L11.2383 11.1507C11.205 11.3062 11.13 11.4312 11.0133 11.5257C10.8967 11.6201 10.7606 11.6673 10.605 11.6673H10.3383C10.1828 11.6673 10.0467 11.6173 9.93001 11.5173C9.81335 11.4173 9.73835 11.2895 9.70501 11.134ZM10.4717 9.66732C10.8383 9.66732 11.1522 9.53676 11.4133 9.27565C11.6745 9.01454 11.805 8.70065 11.805 8.33398C11.805 7.96732 11.6745 7.65343 11.4133 7.39232C11.1522 7.13121 10.8383 7.00065 10.4717 7.00065C10.105 7.00065 9.79112 7.13121 9.53001 7.39232C9.2689 7.65343 9.13835 7.96732 9.13835 8.33398C9.13835 8.70065 9.2689 9.01454 9.53001 9.27565C9.79112 9.53676 10.105 9.66732 10.4717 9.66732ZM5.80501 4.33398C6.17168 4.33398 6.48557 4.20343 6.74668 3.94232C7.00779 3.68121 7.13835 3.36732 7.13835 3.00065C7.13835 2.63398 7.00779 2.3201 6.74668 2.05898C6.48557 1.79787 6.17168 1.66732 5.80501 1.66732C5.43835 1.66732 5.12446 1.79787 4.86335 2.05898C4.60223 2.3201 4.47168 2.63398 4.47168 3.00065C4.47168 3.36732 4.60223 3.68121 4.86335 3.94232C5.12446 4.20343 5.43835 4.33398 5.80501 4.33398Z"
                fill={setFill(fill)}
            />
        </Svg>
    );
};

Icon.Organization = ({ size = 24, fill = "var(--G_500)" }) => {
    return (
        <Svg $width={setSize(size)} viewBox="0 0 14 12" fill="none">
            <path
                d="M8.99967 10.6667V10H7.66634C7.29967 10 6.98579 9.86944 6.72468 9.60833C6.46356 9.34722 6.33301 9.03333 6.33301 8.66667V3.33333H4.99967V4C4.99967 4.36667 4.86912 4.68056 4.60801 4.94167C4.3469 5.20278 4.03301 5.33333 3.66634 5.33333H1.66634C1.29967 5.33333 0.985786 5.20278 0.724675 4.94167C0.463563 4.68056 0.333008 4.36667 0.333008 4V1.33333C0.333008 0.966667 0.463563 0.652778 0.724675 0.391667C0.985786 0.130556 1.29967 0 1.66634 0H3.66634C4.03301 0 4.3469 0.130556 4.60801 0.391667C4.86912 0.652778 4.99967 0.966667 4.99967 1.33333V2H8.99967V1.33333C8.99967 0.966667 9.13023 0.652778 9.39134 0.391667C9.65245 0.130556 9.96634 0 10.333 0H12.333C12.6997 0 13.0136 0.130556 13.2747 0.391667C13.5358 0.652778 13.6663 0.966667 13.6663 1.33333V4C13.6663 4.36667 13.5358 4.68056 13.2747 4.94167C13.0136 5.20278 12.6997 5.33333 12.333 5.33333H10.333C9.96634 5.33333 9.65245 5.20278 9.39134 4.94167C9.13023 4.68056 8.99967 4.36667 8.99967 4V3.33333H7.66634V8.66667H8.99967V8C8.99967 7.63333 9.13023 7.31945 9.39134 7.05833C9.65245 6.79722 9.96634 6.66667 10.333 6.66667H12.333C12.6997 6.66667 13.0136 6.79722 13.2747 7.05833C13.5358 7.31945 13.6663 7.63333 13.6663 8V10.6667C13.6663 11.0333 13.5358 11.3472 13.2747 11.6083C13.0136 11.8694 12.6997 12 12.333 12H10.333C9.96634 12 9.65245 11.8694 9.39134 11.6083C9.13023 11.3472 8.99967 11.0333 8.99967 10.6667ZM10.333 4H12.333V1.33333H10.333V4ZM10.333 10.6667H12.333V8H10.333V10.6667ZM1.66634 4H3.66634V1.33333H1.66634V4Z"
                fill={setFill(fill)}
            />
        </Svg>
    );
};

Icon.Sensor = ({ size = 24, fill = "var(--G_500)" }) => {
    return (
        <Svg $width={setSize(size)} viewBox="0 0 12 12" fill="none">
            <path
                d="M6 12C5.81111 12 5.65278 11.9361 5.525 11.8083C5.39722 11.6806 5.33333 11.5222 5.33333 11.3333V9.33333C5.33333 9.14444 5.39722 8.98611 5.525 8.85833C5.65278 8.73056 5.81111 8.66667 6 8.66667C6.18889 8.66667 6.34722 8.73056 6.475 8.85833C6.60278 8.98611 6.66667 9.14444 6.66667 9.33333V11.3333C6.66667 11.5222 6.60278 11.6806 6.475 11.8083C6.34722 11.9361 6.18889 12 6 12ZM11.1833 9.85C11.0611 9.97222 10.9056 10.0333 10.7167 10.0333C10.5278 10.0333 10.3722 9.97222 10.25 9.85L8.81667 8.43333C8.68333 8.3 8.61667 8.14444 8.61667 7.96667C8.61667 7.78889 8.68333 7.63333 8.81667 7.5C8.95 7.36667 9.10833 7.3 9.29167 7.3C9.475 7.3 9.63333 7.36667 9.76667 7.5L11.1833 8.91667C11.3056 9.03889 11.3694 9.19167 11.375 9.375C11.3806 9.55833 11.3167 9.71667 11.1833 9.85ZM0.816667 9.85C0.694444 9.72778 0.633333 9.57222 0.633333 9.38333C0.633333 9.19444 0.694444 9.03889 0.816667 8.91667L2.23333 7.48333C2.36667 7.35 2.52222 7.28333 2.7 7.28333C2.87778 7.28333 3.03333 7.35 3.16667 7.48333C3.3 7.61667 3.36667 7.775 3.36667 7.95833C3.36667 8.14167 3.3 8.3 3.16667 8.43333L1.75 9.85C1.62778 9.97222 1.475 10.0361 1.29167 10.0417C1.10833 10.0472 0.95 9.98333 0.816667 9.85ZM1.33333 1.33333V2H10.6667V1.33333H1.33333ZM3.4 3.33333L3.6 4H8.4L8.6 3.33333H3.4ZM3.6 5.33333C3.31111 5.33333 3.05 5.24722 2.81667 5.075C2.58333 4.90278 2.42222 4.67778 2.33333 4.4L2 3.33333H1.33333C0.966667 3.33333 0.652778 3.20278 0.391667 2.94167C0.130556 2.68056 0 2.36667 0 2V1.33333C0 0.966667 0.130556 0.652778 0.391667 0.391667C0.652778 0.130556 0.966667 0 1.33333 0H10.6667C11.0333 0 11.3472 0.130556 11.6083 0.391667C11.8694 0.652778 12 0.966667 12 1.33333V2C12 2.36667 11.8694 2.68056 11.6083 2.94167C11.3472 3.20278 11.0333 3.33333 10.6667 3.33333H10L9.56667 4.46667C9.46667 4.72222 9.30556 4.93056 9.08333 5.09167C8.86111 5.25278 8.61111 5.33333 8.33333 5.33333H3.6Z"
                fill={setFill(fill)}
            />
        </Svg>
    );
};

Icon.Equipment = ({ size = 24, fill = "var(--G_500)" }) => {
    return (
        <Svg $width={setSize(size)} viewBox="0 0 12 12" fill="none">
            <path
                d="M10.1169 11.7923C9.89464 11.7923 9.68353 11.7507 9.48353 11.6673C9.28353 11.584 9.10019 11.459 8.93353 11.2923L5.6002 7.94232C5.37797 8.03121 5.15297 8.09787 4.9252 8.14232C4.69742 8.18676 4.45575 8.20898 4.2002 8.20898C3.08908 8.20898 2.14464 7.8201 1.36686 7.04232C0.589084 6.26454 0.200195 5.3201 0.200195 4.20898C0.200195 3.80898 0.255751 3.42843 0.366862 3.06732C0.477973 2.70621 0.633529 2.36454 0.833529 2.04232L3.26686 4.47565L4.46686 3.27565L2.03353 0.842318C2.35575 0.642318 2.69742 0.486762 3.05853 0.375651C3.41964 0.26454 3.80019 0.208984 4.2002 0.208984C5.31131 0.208984 6.25575 0.597873 7.03353 1.37565C7.81131 2.15343 8.20019 3.09787 8.20019 4.20898C8.20019 4.46454 8.17797 4.70621 8.13353 4.93398C8.08908 5.16176 8.02242 5.38676 7.93353 5.60898L11.3002 8.94232C11.4669 9.10898 11.5919 9.29232 11.6752 9.49232C11.7585 9.69232 11.8002 9.90343 11.8002 10.1257C11.8002 10.3479 11.7558 10.5618 11.6669 10.7673C11.578 10.9729 11.4557 11.1534 11.3002 11.309C11.1335 11.4756 10.9502 11.5979 10.7502 11.6757C10.5502 11.7534 10.3391 11.7923 10.1169 11.7923ZM9.9002 10.3757C9.95575 10.4312 10.0308 10.4562 10.1252 10.4507C10.2196 10.4451 10.2946 10.4145 10.3502 10.359C10.4058 10.3034 10.4335 10.2284 10.4335 10.134C10.4335 10.0395 10.4058 9.96454 10.3502 9.90898L6.3002 5.87565C6.5002 5.65343 6.64464 5.3951 6.73353 5.10065C6.82242 4.80621 6.86686 4.50898 6.86686 4.20898C6.86686 3.54232 6.65297 2.96176 6.2252 2.46732C5.79742 1.97287 5.26686 1.67565 4.63353 1.57565L5.86686 2.80898C6.0002 2.94232 6.06686 3.09787 6.06686 3.27565C6.06686 3.45343 6.0002 3.60898 5.86686 3.74232L3.73353 5.87565C3.6002 6.00898 3.44464 6.07565 3.26686 6.07565C3.08908 6.07565 2.93353 6.00898 2.8002 5.87565L1.56686 4.64232C1.66686 5.27565 1.96408 5.80621 2.45853 6.23398C2.95297 6.66176 3.53353 6.87565 4.2002 6.87565C4.48908 6.87565 4.77797 6.83121 5.06686 6.74232C5.35575 6.65343 5.61686 6.51454 5.8502 6.32565L9.9002 10.3757Z"
                fill={setFill(fill)}
            />
        </Svg>
    );
};

Icon.Code = ({ size = 24, fill = "var(--G_500)" }) => {
    return (
        <Svg $width={setSize(size)} viewBox="0 0 16 8" fill="none">
            <path
                d="M7.59628 0.36867C7.43162 0.0393513 7.03117 -0.0941316 6.70185 0.0705279C6.37253 0.235187 6.23905 0.635636 6.40371 0.964955L8.40371 7.63162C8.56837 7.96094 8.96882 8.09442 9.29813 7.92976C9.62745 7.76511 9.76094 7.36466 9.59628 7.03534L7.59628 0.36867ZM3.99205 6.31055L1.52684 3.84534L4.00795 1.36423C4.13519 1.23699 4.19881 1.0859 4.19881 0.910948C4.19881 0.735998 4.13519 0.584904 4.00795 0.457668C3.88072 0.330431 3.72962 0.266813 3.55467 0.266813C3.37972 0.266813 3.22863 0.330431 3.10139 0.457668L1.63817 1.92089L0.17495 3.38411C0.111332 3.44773 0.0662692 3.51665 0.0397615 3.59087C0.0132539 3.66509 0 3.74461 0 3.82944C0 3.91426 0.0132539 3.99378 0.0397615 4.06801C0.0662692 4.14223 0.111332 4.21115 0.17495 4.27477L3.10139 7.20121C3.21803 7.31784 3.36647 7.37616 3.54672 7.37616C3.72697 7.37616 3.87541 7.31784 3.99205 7.20121C4.10868 7.08457 4.167 6.93613 4.167 6.75588C4.167 6.57563 4.10868 6.42718 3.99205 6.31055ZM12.008 1.34832L14.4732 3.81353L12.008 6.27874C11.8807 6.40598 11.8171 6.55707 11.8171 6.73202C11.8171 6.90697 11.8807 7.05807 12.008 7.1853C12.1352 7.31254 12.2836 7.37881 12.4533 7.38411C12.6229 7.38941 12.7714 7.32844 12.8986 7.20121L15.825 4.27477C15.8887 4.21115 15.9337 4.14223 15.9602 4.06801C15.9867 3.99378 16 3.91426 16 3.82944C16 3.74461 15.9867 3.66509 15.9602 3.59087C15.9337 3.51665 15.8887 3.44773 15.825 3.38411L12.8986 0.457668C12.782 0.341034 12.6335 0.282717 12.4533 0.282717C12.273 0.282717 12.1246 0.341034 12.008 0.457668C11.8913 0.574301 11.833 0.722744 11.833 0.902996C11.833 1.08325 11.8913 1.23169 12.008 1.34832Z"
                fill={setFill(fill)}
            />
        </Svg>
    );
};

Icon.Log = ({ size = 24, fill = "var(--G_500)" }) => {
    return (
        <Svg $width={setSize(size)} viewBox="0 0 14 14" fill="none">
            <path
                d="M6.14648 1.33333C5.37982 1.33333 4.66315 1.51111 3.99648 1.86667C3.32982 2.22222 2.76871 2.71111 2.31315 3.33333H3.47982C3.66871 3.33333 3.82704 3.39722 3.95482 3.525C4.0826 3.65278 4.14648 3.81111 4.14648 4C4.14648 4.18889 4.0826 4.34722 3.95482 4.475C3.82704 4.60278 3.66871 4.66667 3.47982 4.66667H0.813151C0.624262 4.66667 0.465929 4.60278 0.338151 4.475C0.210373 4.34722 0.146484 4.18889 0.146484 4V1.33333C0.146484 1.14444 0.210373 0.986111 0.338151 0.858333C0.465929 0.730556 0.624262 0.666667 0.813151 0.666667C1.00204 0.666667 1.16037 0.730556 1.28815 0.858333C1.41593 0.986111 1.47982 1.14444 1.47982 1.33333V2.23333C2.04648 1.52222 2.73815 0.972222 3.55482 0.583333C4.37148 0.194444 5.23537 0 6.14648 0C6.97982 0 7.76037 0.155556 8.48815 0.466667C9.21593 0.777778 9.85204 1.20556 10.3965 1.75C10.8632 2.21667 11.2465 2.75556 11.5465 3.36667C11.8465 3.97778 12.0354 4.63333 12.1132 5.33333C12.1354 5.52222 12.0798 5.67778 11.9465 5.8C11.8132 5.92222 11.652 5.98333 11.4632 5.98333C11.2743 5.98333 11.1159 5.92222 10.9882 5.8C10.8604 5.67778 10.7854 5.52222 10.7632 5.33333C10.6854 4.82222 10.5354 4.34444 10.3132 3.9C10.0909 3.45556 9.80204 3.05556 9.44648 2.7C9.02426 2.27778 8.5326 1.94444 7.97148 1.7C7.41037 1.45556 6.80204 1.33333 6.14648 1.33333ZM0.879818 6.76667C1.0576 6.74445 1.21871 6.77778 1.36315 6.86667C1.5076 6.95556 1.6076 7.08889 1.66315 7.26667C1.9076 8.16667 2.37982 8.91667 3.07982 9.51667C3.77982 10.1167 4.59093 10.4778 5.51315 10.6C5.74648 10.6333 5.91315 10.7194 6.01315 10.8583C6.11315 10.9972 6.16315 11.1444 6.16315 11.3C6.16315 11.4778 6.10482 11.6389 5.98815 11.7833C5.87148 11.9278 5.7076 11.9889 5.49648 11.9667C4.26315 11.8222 3.17704 11.3472 2.23815 10.5417C1.29926 9.73611 0.668707 8.73889 0.346484 7.55C0.290929 7.36111 0.318707 7.18889 0.429818 7.03333C0.540929 6.87778 0.690929 6.78889 0.879818 6.76667ZM6.81315 5.73333L7.61315 6.53333C7.76871 6.68889 7.83815 6.85278 7.82148 7.025C7.80482 7.19722 7.73537 7.34444 7.61315 7.46667C7.49093 7.58889 7.34371 7.65833 7.17148 7.675C6.99926 7.69167 6.83537 7.62222 6.67982 7.46667L5.67982 6.46667C5.61315 6.4 5.56315 6.325 5.52982 6.24167C5.49648 6.15833 5.47982 6.07222 5.47982 5.98333V3.33333C5.47982 3.14444 5.54371 2.98611 5.67148 2.85833C5.79926 2.73056 5.9576 2.66667 6.14648 2.66667C6.33537 2.66667 6.49371 2.73056 6.62148 2.85833C6.74926 2.98611 6.81315 3.14444 6.81315 3.33333V5.73333ZM10.6632 14C10.5076 14 10.3715 13.95 10.2548 13.85C10.1382 13.75 10.0632 13.6222 10.0298 13.4667L9.92982 13C9.79648 12.9444 9.67148 12.8861 9.55482 12.825C9.43815 12.7639 9.31871 12.6889 9.19648 12.6L8.71315 12.75C8.56871 12.7944 8.42704 12.7889 8.28815 12.7333C8.14926 12.6778 8.04093 12.5889 7.96315 12.4667L7.82982 12.2333C7.75204 12.1 7.72426 11.9556 7.74648 11.8C7.76871 11.6444 7.84093 11.5167 7.96315 11.4167L8.32982 11.1C8.3076 10.9556 8.29648 10.8111 8.29648 10.6667C8.29648 10.5222 8.3076 10.3778 8.32982 10.2333L7.96315 9.91667C7.84093 9.81667 7.76871 9.69167 7.74648 9.54167C7.72426 9.39167 7.75204 9.25 7.82982 9.11667L7.97982 8.86667C8.0576 8.74444 8.16315 8.65556 8.29648 8.6C8.42982 8.54445 8.56871 8.53889 8.71315 8.58333L9.19648 8.73333C9.31871 8.64444 9.43815 8.56944 9.55482 8.50833C9.67148 8.44722 9.79648 8.38889 9.92982 8.33333L10.0298 7.85C10.0632 7.69445 10.1382 7.56945 10.2548 7.475C10.3715 7.38056 10.5076 7.33333 10.6632 7.33333H10.9298C11.0854 7.33333 11.2215 7.38333 11.3382 7.48333C11.4548 7.58333 11.5298 7.71111 11.5632 7.86667L11.6632 8.33333C11.7965 8.38889 11.9243 8.45278 12.0465 8.525C12.1687 8.59722 12.2854 8.67778 12.3965 8.76667L12.8465 8.61667C13.002 8.56111 13.152 8.56111 13.2965 8.61667C13.4409 8.67222 13.552 8.76667 13.6298 8.9L13.7632 9.13333C13.8409 9.26667 13.8687 9.41111 13.8465 9.56667C13.8243 9.72222 13.752 9.85 13.6298 9.95L13.2632 10.2667C13.2854 10.4111 13.2965 10.55 13.2965 10.6833C13.2965 10.8167 13.2854 10.9556 13.2632 11.1L13.6298 11.4167C13.752 11.5167 13.8243 11.6417 13.8465 11.7917C13.8687 11.9417 13.8409 12.0833 13.7632 12.2167L13.6132 12.4667C13.5354 12.5889 13.4298 12.6778 13.2965 12.7333C13.1632 12.7889 13.0243 12.7944 12.8798 12.75L12.3965 12.6C12.2743 12.6889 12.1548 12.7639 12.0382 12.825C11.9215 12.8861 11.7965 12.9444 11.6632 13L11.5632 13.4833C11.5298 13.6389 11.4548 13.7639 11.3382 13.8583C11.2215 13.9528 11.0854 14 10.9298 14H10.6632ZM10.7965 12C11.1632 12 11.477 11.8694 11.7382 11.6083C11.9993 11.3472 12.1298 11.0333 12.1298 10.6667C12.1298 10.3 11.9993 9.98611 11.7382 9.725C11.477 9.46389 11.1632 9.33333 10.7965 9.33333C10.4298 9.33333 10.1159 9.46389 9.85482 9.725C9.59371 9.98611 9.46315 10.3 9.46315 10.6667C9.46315 11.0333 9.59371 11.3472 9.85482 11.6083C10.1159 11.8694 10.4298 12 10.7965 12Z"
                fill={setFill(fill)}
            />
        </Svg>
    );
};

Icon.EmptyPaper = ({ width = "120", height = "96" }) => {
    return (
        <Svg width={width} height={height} viewBox="0 0 120 96" fill="none">
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M51.1493 7.33226C51.1493 6.83843 51.3558 6.3651 51.7257 6.01476C52.0935 5.66628 52.5952 5.46875 53.1165 5.46875H97.485L120.002 29.1223V58.8509C120.002 58.8509 120.072 83.4063 112.709 95.1297C112.351 95.6682 111.726 95.9944 111.053 95.9944C103.524 95.9999 58.8273 95.9999 46.3335 95.9999C45.643 95.9999 45.0037 95.6552 44.6476 95.0961C44.2916 94.5352 44.2739 93.8383 44.5985 93.2606C50.7027 80.7061 51.1493 58.8509 51.1493 58.8509V7.33226Z"
                fill="#CADCF0"
            />
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M120.002 58.8516C120.002 58.8516 120.072 83.407 112.709 95.1304C112.351 95.6689 111.726 95.9951 111.053 95.9951C103.524 96.0006 58.8273 96.0006 46.3335 96.0006C45.643 96.0006 45.0037 95.6559 44.6476 95.0968C44.2916 94.5359 44.2739 93.839 44.5985 93.2613L44.6752 93.101C68.8994 94.18 104.077 90.1604 108.71 88.4422C113.659 86.6067 119.903 68.9928 120 59.0826L120.002 58.8516Z"
                fill="#A4BBDB"
            />
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M120.001 29.1223C114.029 26.8879 107.706 26.8246 101.216 27.7731C100.614 27.8644 100.002 27.6818 99.5598 27.2849C99.1172 26.8861 98.8968 26.3158 98.9617 25.7419C99.6739 18.8581 98.9558 12.1233 97.4844 5.46875C107.002 12.1625 114.516 20.0395 120.001 29.1223Z"
                fill="#347BFA"
            />
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M51.1487 11.7881C56.409 12.4086 61.5001 14.6299 65.5368 18.4539C73.6083 26.0998 74.9185 37.7393 69.4693 46.6823L72.7093 56.4154C72.8686 56.8944 72.7349 57.4161 72.3611 57.7702C72.2687 57.8559 72.1742 57.9454 72.0857 58.0311C71.7336 58.3628 71.2162 58.4821 70.7441 58.3404L60.4182 55.2563C57.5185 56.8422 54.3493 57.8242 51.1172 58.2007C51.1408 57.5839 51.1487 57.2447 51.1487 57.2447V11.7881Z"
                fill="#A4BBDB"
            />
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M57.9317 52.9717C48.9061 57.9081 37.158 56.7211 29.4406 49.4105C20.2281 40.6837 20.2281 26.5136 29.4406 17.7867C38.653 9.05806 53.6117 9.05806 62.8261 17.7867C70.5415 25.0954 71.7947 36.2243 66.5855 44.7741L69.6819 54.0805C69.8353 54.537 69.7055 55.0365 69.3494 55.3738C69.2609 55.4576 69.1724 55.5415 69.0858 55.6235C68.7494 55.9421 68.2556 56.0558 67.8032 55.9216L57.9317 52.9717Z"
                fill="#E9F3FC"
            />
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M41.9669 26.9084C41.9237 25.1306 42.6259 23.8355 43.7138 23.0752C45.4214 21.8825 47.9709 21.9328 49.3558 23.4106C49.9518 24.046 50.2961 24.9443 50.3059 26.081C50.3295 28.8055 48.9781 30.3988 47.6581 32.0498C45.8797 34.273 44.1033 36.5577 43.883 40.3723C43.824 41.3991 44.6561 42.2786 45.74 42.3345C46.824 42.3904 47.7525 41.6022 47.8115 40.5754C47.9787 37.6776 49.4423 35.9893 50.7938 34.3009C52.6036 32.0405 54.2718 29.7857 54.2404 26.0512C54.2207 23.856 53.4476 22.162 52.2987 20.9358C49.6135 18.0716 44.6856 17.7641 41.3787 20.0749C39.3958 21.4614 37.9538 23.7572 38.0345 26.996C38.06 28.0246 38.961 28.839 40.0469 28.8148C41.1328 28.7905 41.9925 27.9371 41.9669 26.9084Z"
                fill="#347BFA"
            />
            <path
                d="M45.6619 49.2561C46.9982 49.2561 48.0815 48.2299 48.0815 46.964C48.0815 45.6981 46.9982 44.6719 45.6619 44.6719C44.3255 44.6719 43.2422 45.6981 43.2422 46.964C43.2422 48.2299 44.3255 49.2561 45.6619 49.2561Z"
                fill="#347BFA"
            />
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M22.0669 3.022L29.9357 12.3992C30.6124 13.2042 31.8498 13.3384 32.6996 12.6992C33.5495 12.06 33.6911 10.886 33.0164 10.081L25.1475 0.70379C24.4708 -0.101247 23.2334 -0.235419 22.3836 0.403765C21.5337 1.04481 21.3921 2.21696 22.0669 3.022Z"
                fill="#347BFA"
            />
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M0.98761 7.68627L21.5489 18.8673C22.4892 19.3798 23.6932 19.0723 24.2342 18.1797C24.7751 17.2871 24.4486 16.1485 23.5063 15.636L2.94695 4.45494C2.00466 3.94248 0.802692 4.24996 0.261709 5.14258C-0.279274 6.0352 0.0453153 7.1738 0.98761 7.68627Z"
                fill="#347BFA"
            />
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M3.93596 28.4331H17.7064C18.7923 28.4331 19.6737 27.5982 19.6737 26.5696C19.6737 25.5409 18.7923 24.7061 17.7064 24.7061H3.93596C2.85006 24.7061 1.96875 25.5409 1.96875 26.5696C1.96875 27.5982 2.85006 28.4331 3.93596 28.4331Z"
                fill="#347BFA"
            />
        </Svg>
    );
};

Icon.HorizontalMoreIcon = ({ size = 24, fill = "var(--G_300)" }) => {
    return (
        <Svg $width={setSize(size)} viewBox="0 0 24 24" fill="none">
            <circle cx="6" cy="12" r="2" fill={setFill(fill)} />
            <circle cx="12" cy="12" r="2" fill={setFill(fill)} />
            <circle cx="18" cy="12" r="2" fill={setFill(fill)} />
        </Svg>
    );
};

Icon.DashboardIcon = ({ size = 24, fill = "grayscale.g300" }) => {
    return (
        <Svg $width={setSize(size)} viewBox="0 0 24 24" fill="none">
            <path d="M4.85547 5.1084C5.12366 4.83079 5.56004 4.83079 5.82812 5.1084C6.09404 5.38409 6.09418 5.82989 5.82812 6.10547C4.18025 7.81185 3.27148 10.0823 3.27148 12.5C3.27149 14.9177 4.18025 17.1882 5.82812 18.8945C6.09416 19.1702 6.09405 19.6159 5.82812 19.8916C5.56 20.1693 5.12353 20.1691 4.85547 19.8916C2.94952 17.918 1.90039 15.2926 1.90039 12.5C1.90039 9.70737 2.94952 7.08202 4.85547 5.1084ZM18.1719 5.1084C18.44 4.83076 18.8764 4.83079 19.1445 5.1084C21.0505 7.08202 22.0996 9.70737 22.0996 12.5C22.0996 15.2926 21.0505 17.918 19.1445 19.8916C18.8769 20.1687 18.4405 20.1697 18.1719 19.8916C17.906 19.6159 17.9058 19.1701 18.1719 18.8945C19.8198 17.1881 20.7285 14.9177 20.7285 12.5C20.7285 10.0823 19.8198 7.81185 18.1719 6.10547C17.9058 5.82985 17.906 5.38409 18.1719 5.1084ZM6.62988 6.94531C6.89794 6.66815 7.33353 6.66806 7.60156 6.94531C7.86781 7.22102 7.86781 7.66667 7.60156 7.94238C6.42728 9.15835 5.7803 10.7767 5.78027 12.5C5.78027 14.2233 6.42733 15.8416 7.60156 17.0576C7.86776 17.3333 7.86776 17.779 7.60156 18.0547C7.33385 18.3317 6.89835 18.3324 6.62988 18.0547C5.19745 16.5714 4.4082 14.5983 4.4082 12.5C4.40823 10.4018 5.19747 8.4285 6.62988 6.94531ZM16.3984 6.94531C16.6665 6.66809 17.102 6.66814 17.3701 6.94531C18.8025 8.42851 19.5918 10.4017 19.5918 12.5C19.5918 14.5983 18.8025 16.5714 17.3701 18.0547C17.1019 18.3321 16.6664 18.332 16.3984 18.0547C16.1322 17.779 16.1322 17.3333 16.3984 17.0576C17.5727 15.8416 18.2197 14.2233 18.2197 12.5C18.2197 10.7767 17.5727 9.15832 16.3984 7.94238C16.1322 7.66668 16.1322 7.22102 16.3984 6.94531ZM8.40527 8.78418C8.67336 8.5067 9.10887 8.50673 9.37695 8.78418C9.6431 9.05983 9.64394 9.50549 9.37793 9.78125H9.37695C8.67678 10.5064 8.29104 11.4717 8.29102 12.5C8.29102 13.5283 8.67682 14.4936 9.37695 15.2188C9.64316 15.4944 9.64321 15.9401 9.37695 16.2158C9.10919 16.493 8.67376 16.4937 8.40527 16.2158C7.44683 15.2234 6.91895 13.9035 6.91895 12.5C6.91896 11.0966 7.44684 9.77662 8.40527 8.78418ZM14.623 8.78418C14.8911 8.50673 15.3266 8.50673 15.5947 8.78418C16.5532 9.77664 17.0811 11.0965 17.0811 12.5C17.081 13.9034 16.5532 15.2234 15.5947 16.2158C15.3266 16.4934 14.8911 16.4932 14.623 16.2158C14.3568 15.9401 14.3568 15.4944 14.623 15.2188C15.3232 14.4936 15.709 13.5284 15.709 12.5C15.709 11.4716 15.3232 10.5064 14.623 9.78125C14.3568 9.50559 14.3568 9.05989 14.623 8.78418ZM12 9.84375C13.4198 9.84375 14.5684 11.0385 14.5684 12.5C14.5683 13.9615 13.4197 15.1562 12 15.1562C10.5803 15.1562 9.43168 13.9615 9.43164 12.5C9.43164 11.0385 10.5802 9.84375 12 9.84375ZM12 11.2568C11.3434 11.2568 10.8027 11.8114 10.8027 12.5C10.8028 13.1885 11.3434 13.7432 12 13.7432C12.6566 13.7432 13.1972 13.1885 13.1973 12.5C13.1973 11.8114 12.6566 11.2568 12 11.2568Z" fill={setFill(fill)} stroke="#888C94" strokeWidth="0.2"/>
        </Svg>
    );
};

Icon.EventIcon = ({ size = 18, fill = "grayscale.g300" }) => {
    return (
        <Svg $width={setSize(size)} viewBox="0 0 18 18" fill="none">
            <path d="M9.00269 0.799805C12.3528 0.799814 14.9889 3.34171 14.989 6.35645V12.377H3.01636V6.35645C3.01649 3.3417 5.6526 0.799805 9.00269 0.799805Z" stroke={setFill(fill)} strokeWidth="1.6"/>
            <path d="M2.37964 15.031H15.6199C16.5392 15.031 17.1999 15.7229 17.2 16.4607V17.2H0.799561V16.4607C0.799612 15.723 1.46052 15.0312 2.37964 15.031Z" stroke={setFill(fill)} strokeWidth="1.6"/>
        </Svg>
    );
};

Icon.ClipIcon = ({ fill = "state.success" }) => {
    return (
        <Svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 8" fill="none">
            <path d="M6.16699 0.666992C6.35575 0.667056 6.51367 0.730921 6.6416 0.858398C6.76908 0.986325 6.83293 1.14426 6.83301 1.33301C6.83301 1.5219 6.76916 1.68006 6.6416 1.80762C6.51367 1.93553 6.35574 1.99994 6.16699 2H4.16699C3.6115 2 3.13886 2.19421 2.75 2.58301C2.36111 2.9719 2.16699 3.44444 2.16699 4C2.16699 4.55556 2.36111 5.0281 2.75 5.41699C3.13886 5.80579 3.6115 6 4.16699 6H6.16699C6.35567 6.00006 6.5137 6.06404 6.6416 6.19141C6.76916 6.31941 6.83301 6.4781 6.83301 6.66699C6.83293 6.85574 6.76908 7.01412 6.6416 7.1416C6.51373 7.2693 6.35558 7.33294 6.16699 7.33301H4.16699C3.24484 7.33301 2.45834 7.00853 1.80859 6.3584C1.15837 5.70862 0.833008 4.92222 0.833008 4C0.833008 3.07787 1.1585 2.29179 1.80859 1.6416C2.45837 0.991824 3.24477 0.666992 4.16699 0.666992H6.16699ZM10.833 0.666992C11.7552 0.666992 12.5422 0.991824 13.1924 1.6416C13.842 2.29176 14.167 3.07792 14.167 4C14.167 4.92222 13.8422 5.70862 13.1924 6.3584C12.5422 7.0086 11.7552 7.33301 10.833 7.33301H8.83301C8.64428 7.33293 8.48587 7.26952 8.3584 7.1416C8.23049 7.01412 8.16707 6.85573 8.16699 6.66699C8.16699 6.4782 8.23053 6.31937 8.3584 6.19141C8.48587 6.06393 8.64428 6.00008 8.83301 6H10.833C11.3885 6 11.8611 5.80576 12.25 5.41699C12.6389 5.0281 12.833 4.55556 12.833 4C12.833 3.44444 12.6389 2.9719 12.25 2.58301C11.8611 2.19424 11.3885 2 10.833 2H8.83301C8.64428 1.99992 8.48587 1.93553 8.3584 1.80762C8.23063 1.68012 8.16699 1.52173 8.16699 1.33301C8.16707 1.14444 8.23071 0.986263 8.3584 0.858398C8.48587 0.730925 8.64428 0.667075 8.83301 0.666992H10.833ZM9.5 3.33301C9.68888 3.33301 9.84759 3.39687 9.97559 3.52441C10.1031 3.65241 10.167 3.81111 10.167 4C10.167 4.18882 10.1031 4.34708 9.97559 4.47461C9.84759 4.60261 9.68889 4.66699 9.5 4.66699H5.5C5.31113 4.66698 5.15294 4.6026 5.02539 4.47461C4.8974 4.34706 4.83301 4.18888 4.83301 4C4.83301 3.81111 4.89739 3.65241 5.02539 3.52441C5.15291 3.39696 5.3112 3.33302 5.5 3.33301H9.5Z" fill={setFill(fill)}/>
        </Svg>
    );
};

Icon.ClipOffIcon = ({ fill = "grayscale.g500" }) => {
    return (
        <Svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M0.925293 0.683594C1.11379 0.683697 1.26905 0.744323 1.39111 0.866211L12.7251 12.2002C12.8471 12.3224 12.9077 12.4783 12.9077 12.667C12.9076 12.8555 12.847 13.0107 12.7251 13.1328C12.6029 13.255 12.4471 13.3164 12.2583 13.3164C12.0694 13.3164 11.9137 13.255 11.7915 13.1328L5.85889 7.2002H4.5083C4.31945 7.2002 4.16123 7.13576 4.03369 7.00781C3.90569 6.88026 3.84131 6.72209 3.84131 6.5332C3.84131 6.34431 3.90569 6.18562 4.03369 6.05762C4.16121 5.93022 4.31953 5.86621 4.5083 5.86621H4.5249L3.24658 4.58789C2.89324 4.66966 2.57999 4.84437 2.30811 5.11621C1.91922 5.5051 1.7251 5.97765 1.7251 6.5332C1.7251 7.08876 1.91922 7.56131 2.30811 7.9502C2.69697 8.33899 3.16961 8.5332 3.7251 8.5332H5.7251C5.91377 8.53327 6.0718 8.59724 6.19971 8.72461C6.32726 8.85261 6.39111 9.01131 6.39111 9.2002C6.39104 9.38894 6.32719 9.54732 6.19971 9.6748C6.07183 9.8025 5.91369 9.86615 5.7251 9.86621H3.7251C2.80294 9.86621 2.01645 9.54173 1.3667 8.8916C0.716477 8.24182 0.391113 7.45543 0.391113 6.5332C0.391113 5.75552 0.627237 5.06923 1.09912 4.47461C1.41492 4.07741 1.78792 3.77273 2.21533 3.55664L0.458496 1.7998C0.336274 1.67758 0.274902 1.5219 0.274902 1.33301C0.274944 1.14421 0.336316 0.988391 0.458496 0.866211C0.580667 0.744214 0.736578 0.683594 0.925293 0.683594ZM10.3911 3.2002C11.3133 3.2002 12.1003 3.51909 12.7505 4.1582C13.4003 4.79687 13.7251 5.58876 13.7251 6.5332C13.7251 7.16643 13.5583 7.75242 13.2251 8.29102C12.8918 8.83013 12.4467 9.23333 11.8911 9.5L10.8911 8.4668C11.3244 8.34457 11.6837 8.10803 11.9673 7.75781C12.2503 7.40809 12.3911 6.99975 12.3911 6.5332C12.3911 5.97765 12.197 5.5051 11.8081 5.11621C11.4193 4.72744 10.9466 4.5332 10.3911 4.5332H8.39111C8.20239 4.53312 8.04398 4.46874 7.9165 4.34082C7.78873 4.21332 7.7251 4.05493 7.7251 3.86621C7.72517 3.67764 7.78881 3.51947 7.9165 3.3916C8.04398 3.26413 8.20239 3.20028 8.39111 3.2002H10.3911ZM9.60791 5.86621C9.79674 5.86621 9.95552 5.93014 10.0835 6.05762C10.2111 6.18562 10.2749 6.34431 10.2749 6.5332C10.2749 6.72207 10.211 6.88026 10.0835 7.00781C9.9555 7.13581 9.7968 7.2002 9.60791 7.2002L8.2749 5.86621H9.60791Z" fill={setFill(fill)}/>
        </Svg>
    );
};

Icon.CCTVIcon = ({ size = "md", fill, ...props }) => (
    <Svg $width={setSize(size)} viewBox="0 0 14 14" {...props}>
        {defaultIcons.CCTV?.map((i, key) => (
            <path
                key={key}
                d={i}
                fill={
                    fill
                        ? fill === true
                            ? "currentcolor"
                            : setFill(fill)
                        : fill !== undefined
                        ? ""
                        : "grayscale.g500"
                }
            />
        ))}
    </Svg>
);

Icon.MemoIcon = ({ size = "md", fill, ...props }) => (
    <Svg $width={setSize(size)} viewBox="0 0 12 12" {...props}>
        {defaultIcons.EventMemo?.map((i, key) => (
            <path
                key={key}
                d={i}
                fill={
                    fill
                        ? fill === true
                            ? "currentcolor"
                            : setFill(fill)
                        : fill !== undefined
                        ? ""
                        : "grayscale.g500"
                }
            />
        ))}
    </Svg>
);

Icon.CloseIcon = ({ size = "md", fill, ...props }) => (
    <Svg $width={setSize(size)} viewBox="0 0 12 14" {...props}>
        {defaultIcons.Close?.map((i, key) => (
            <path
                key={key}
                d={i}
                fill={
                    fill
                        ? fill === true
                            ? "currentcolor"
                            : setFill(fill)
                        : fill !== undefined
                        ? ""
                        : "grayscale.g500"
                }
            />
        ))}
    </Svg>
);

Icon.HomeIcon = ({ size = "md", fill, ...props }) => (
    <Svg $width={setSize(size)} viewBox="0 0 14 16" {...props}>
        {toolbarIcons.Home?.map((i, key) => (
            <path
                key={key}
                d={i}
                fill={
                    fill
                        ? fill === true
                            ? "currentcolor"
                            : setFill(fill)
                        : fill !== undefined
                        ? ""
                        : "grayscale.g500"
                }
            />
        ))}
    </Svg>
);

Icon.PlusIcon = ({ size = "md", fill, ...props }) => (
    <Svg $width={setSize(size)} viewBox="0 0 12 12" {...props}>
        {toolbarIcons.Plus?.map((i, key) => (
            <path
                key={key}
                d={i}
                fill={
                    fill
                        ? fill === true
                            ? "currentcolor"
                            : setFill(fill)
                        : fill !== undefined
                        ? ""
                        : "grayscale.g500"
                }
            />
        ))}
    </Svg>
);

Icon.MinusIcon = ({ size = "md", fill, ...props }) => (
    <Svg $width={setSize(size)} viewBox="0 0 12 2" {...props}>
        {toolbarIcons.Minus?.map((i, key) => (
            <path
                key={key}
                d={i}
                fill={
                    fill
                        ? fill === true
                            ? "currentcolor"
                            : setFill(fill)
                        : fill !== undefined
                        ? ""
                        : "grayscale.g500"
                }
            />
        ))}
    </Svg>
);

Icon.SaveHomeIcon = ({ size = "md", fill, ...props }) => (
    <Svg $width={setSize(size)} viewBox="0 0 14 14" {...props}>
        {toolbarIcons.SaveHome?.map((i, key) => (
            <path
                key={key}
                d={i}
                fill={
                    fill
                        ? fill === true
                            ? "currentcolor"
                            : setFill(fill)
                        : fill !== undefined
                        ? ""
                        : "grayscale.g500"
                }
            />
        ))}
    </Svg>
);

Icon.RotationOnIcon = ({ size = "md", fill, ...props }) => (
    <Svg $width={setSize(size)} viewBox="0 0 16 14" {...props}>
        {toolbarIcons.RotationOn?.map((i, key) => (
            <path
                key={key}
                d={i}
                fill={
                    fill
                        ? fill === true
                            ? "currentcolor"
                            : setFill(fill)
                        : fill !== undefined
                        ? ""
                        : "grayscale.g500"
                }
            />
        ))}
    </Svg>
);

Icon.RotationOffIcon = ({ size = "md", fill, ...props }) => (
    <Svg $width={setSize(size)} viewBox="0 0 16 12" {...props}>
        {toolbarIcons.RotationOff?.map((i, key) => (
            <path
                key={key}
                d={i}
                fill={
                    fill
                        ? fill === true
                            ? "currentcolor"
                            : setFill(fill)
                        : fill !== undefined
                        ? ""
                        : "grayscale.g500"
                }
            />
        ))}
    </Svg>
);

Icon.SaveIcon = ({ size = "md", fill, ...props }) => (
    <Svg $width={setSize(size)} viewBox="0 0 20 15" {...props}>
        {editModeIcons.Save?.map((i, key) => (
            <path
                key={key}
                d={i}
                fill={
                    fill
                        ? fill === true
                            ? "currentcolor"
                            : setFill(fill)
                        : fill !== undefined
                        ? ""
                        : "grayscale.g500"
                }
            />
        ))}
    </Svg>
);

Icon.SaveIcon = ({ size = "md", fill, ...props }) => (
    <Svg $width={setSize(size)} viewBox="0 0 20 15" {...props}>
        {editModeIcons.Save?.map((i, key) => (
            <path
                key={key}
                d={i}
                fill={
                    fill
                        ? fill === true
                            ? "currentcolor"
                            : setFill(fill)
                        : fill !== undefined
                        ? ""
                        : "grayscale.g500"
                }
            />
        ))}
    </Svg>
);

Icon.PaperPlaneIcon = ({ size = "md", fill, ...props }) => (
    <Svg $width={setSize(size)} viewBox="0 0 24 24" {...props}>
        {editModeIcons.PaperPlane?.map((i, key) => (
            <path
                key={key}
                d={i}
                fill={
                    fill
                        ? fill === true
                            ? "currentcolor"
                            : setFill(fill)
                        : fill !== undefined
                        ? ""
                        : "grayscale.g500"
                }
            />
        ))}
    </Svg>
);

Icon.RotateIcon = ({ size = "md", fill, ...props }) => (
    <Svg $width={setSize(size)} viewBox="0 0 24 24" {...props}>
        {editModeIcons.Rotate?.map((i, key) => (
            <path
                key={key}
                d={i}
                fill={
                    fill
                        ? fill === true
                            ? "currentcolor"
                            : setFill(fill)
                        : fill !== undefined
                        ? ""
                        : "grayscale.g500"
                }
            />
        ))}
    </Svg>
);

Icon.RulerIcon = ({ size = "md", fill, ...props }) => (
    <Svg $width={setSize(size)} viewBox="0 0 24 24" {...props}>
        {editModeIcons.Ruler?.map((i, key) => (
            <path
                key={key}
                d={i}
                fill={
                    fill
                        ? fill === true
                            ? "currentcolor"
                            : setFill(fill)
                        : fill !== undefined
                        ? ""
                        : "grayscale.g500"
                }
            />
        ))}
    </Svg>
);

Icon.PencilIcon = ({ size = "md", fill, ...props }) => (
    <Svg $width={setSize(size)} viewBox="0 0 24 24" {...props}>
        {editModeIcons.Pencil?.map((i, key) => (
            <path
                key={key}
                d={i}
                fill={
                    fill
                        ? fill === true
                            ? "currentcolor"
                            : setFill(fill)
                        : fill !== undefined
                        ? ""
                        : "grayscale.g500"
                }
            />
        ))}
    </Svg>
);

Icon.EditCCTVIcon = ({ size = "md", fill, ...props }) => (
    <Svg $width={setSize(size)} viewBox="0 0 24 24" {...props}>
        {editModeIcons.EditCCTV?.map((i, key) => (
            <path
                key={key}
                d={i}
                fill={
                    fill
                        ? fill === true
                            ? "currentcolor"
                            : setFill(fill)
                        : fill !== undefined
                        ? ""
                        : "grayscale.g500"
                }
            />
        ))}
    </Svg>
);

Icon.AlarmOnIcon = ({ size = "md", fill, ...props }) => (
    <Svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M3.58691 11.9873H12.4131C13.0423 11.9873 13.5 12.4613 13.5 12.9736V13.5H2.5V12.9736C2.5 12.4613 2.95774 11.9873 3.58691 11.9873ZM8.00195 2.5C10.2514 2.50011 12.0252 4.20727 12.0254 6.2373V10.2842H3.97754V6.2373C3.97773 4.2072 5.7524 2.5 8.00195 2.5Z" fill="#E48181" stroke="#D83A3A"/>
    </Svg>
);

Icon.AlarmOffIcon = ({ size = "md", fill, ...props }) => (
    <Svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M3.58691 11.9873H12.4131C13.0423 11.9873 13.5 12.4613 13.5 12.9736V13.5H2.5V12.9736C2.5 12.4613 2.95774 11.9873 3.58691 11.9873ZM8.00195 2.5C10.2514 2.50011 12.0252 4.20727 12.0254 6.2373V10.2842H3.97754V6.2373C3.97773 4.2072 5.7524 2.5 8.00195 2.5Z" stroke="#686D78" fill="none"/>
    </Svg>
);

Icon.AlarmOffIcon2 = ({ size = "md", fill, ...props }) => (
    <Svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M3.58691 11.9873H12.4131C13.0423 11.9873 13.5 12.4613 13.5 12.9736V13.5H2.5V12.9736C2.5 12.4613 2.95774 11.9873 3.58691 11.9873ZM8.00195 2.5C10.2514 2.50011 12.0252 4.20727 12.0254 6.2373V10.2842H3.97754V6.2373C3.97773 4.2072 5.7524 2.5 8.00195 2.5Z" stroke={setFill(fill)} fill="none"/>
    </Svg>
);

Icon.PoiCheckIcon = ({ size = "md", fill, ...props }) => (
    <Svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M6.99902 0.333008C7.92116 0.333008 8.78758 0.508684 9.59863 0.858398C10.4097 1.20862 11.1158 1.68321 11.7158 2.2832C12.3158 2.8832 12.7908 3.58928 13.1406 4.40039C13.4907 5.21138 13.666 6.07793 13.666 7C13.666 7.92207 13.4907 8.78862 13.1406 9.59961C12.7908 10.4107 12.3158 11.1168 11.7158 11.7168C11.1158 12.3168 10.4097 12.7918 9.59863 13.1416C8.78765 13.4917 7.92107 13.667 6.99902 13.667C6.07697 13.667 5.2104 13.4917 4.39941 13.1416C3.5883 12.7918 2.88223 12.3168 2.28223 11.7168C1.68224 11.1168 1.2072 10.4107 0.857422 9.59961C0.507327 8.78863 0.332031 7.92205 0.332031 7C0.332031 6.07795 0.507327 5.21137 0.857422 4.40039C1.2072 3.58929 1.68224 2.8832 2.28223 2.2832C2.88223 1.6832 3.5883 1.20862 4.39941 0.858398C5.21047 0.508669 6.07687 0.333013 6.99902 0.333008ZM6.99902 1.66699C5.52133 1.667 4.26324 2.18604 3.22461 3.22461C2.1855 4.26372 1.66602 5.52222 1.66602 7C1.66602 8.47778 2.1855 9.73628 3.22461 10.7754C4.26324 11.814 5.52133 12.333 6.99902 12.333C8.47679 12.333 9.73531 11.814 10.7744 10.7754C11.8131 9.73628 12.332 8.47778 12.332 7C12.332 5.52222 11.8131 4.26372 10.7744 3.22461C9.73531 2.18596 8.47679 1.66699 6.99902 1.66699ZM9.83203 4.7168C10.0209 4.7168 10.1766 4.77817 10.2988 4.90039C10.421 5.0226 10.4854 5.17533 10.4912 5.3584C10.4964 5.54178 10.4376 5.69427 10.3154 5.81641L6.53223 9.59961C6.41 9.72183 6.25432 9.7832 6.06543 9.7832C5.87668 9.78314 5.72079 9.72177 5.59863 9.59961L3.69922 7.7002C3.57701 7.57799 3.51564 7.42226 3.51562 7.2334C3.51562 7.04451 3.577 6.88882 3.69922 6.7666C3.82142 6.64445 3.9747 6.58053 4.1582 6.5752C4.3411 6.56953 4.49409 6.62788 4.61621 6.75L6.06543 8.2002L9.36621 4.90039C9.48835 4.77828 9.64333 4.71688 9.83203 4.7168Z" fill="#37B44A"/>
    </Svg>
);

Icon.PoiXIcon = ({ size = "md", fill, ...props }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M6.99902 0.333008C7.92116 0.333008 8.78758 0.508684 9.59863 0.858398C10.4097 1.20862 11.1158 1.68321 11.7158 2.2832C12.3158 2.8832 12.7908 3.58928 13.1406 4.40039C13.4907 5.21138 13.666 6.07793 13.666 7C13.666 7.92207 13.4907 8.78862 13.1406 9.59961C12.7908 10.4107 12.3158 11.1168 11.7158 11.7168C11.1158 12.3168 10.4097 12.7918 9.59863 13.1416C8.78765 13.4917 7.92107 13.667 6.99902 13.667C6.07696 13.667 5.2104 13.4917 4.39941 13.1416C3.5883 12.7918 2.88223 12.3168 2.28223 11.7168C1.68224 11.1168 1.2072 10.4107 0.857422 9.59961C0.507327 8.78863 0.332031 7.92205 0.332031 7C0.332031 6.07795 0.507327 5.21137 0.857422 4.40039C1.2072 3.58929 1.68224 2.8832 2.28223 2.2832C2.88223 1.6832 3.5883 1.20862 4.39941 0.858398C5.21047 0.508669 6.07687 0.333013 6.99902 0.333008ZM6.99902 1.66699C5.52133 1.667 4.26324 2.18604 3.22461 3.22461C2.1855 4.26372 1.66602 5.52222 1.66602 7C1.66602 8.47778 2.1855 9.73628 3.22461 10.7754C4.26324 11.814 5.52133 12.333 6.99902 12.333C8.47679 12.333 9.73531 11.814 10.7744 10.7754C11.8131 9.73628 12.332 8.47778 12.332 7C12.332 5.52222 11.8131 4.26372 10.7744 3.22461C9.73531 2.18596 8.47679 1.66699 6.99902 1.66699ZM4.59082 3.94141C4.77376 3.93608 4.92666 3.99422 5.04883 4.11621L6.99902 6.06641L8.93262 4.13379C9.05484 4.01157 9.21053 3.9502 9.39941 3.9502C9.58815 3.95027 9.74406 4.01164 9.86621 4.13379C9.98813 4.25593 10.0513 4.40892 10.0566 4.5918C10.0623 4.775 10.0047 4.92773 9.88281 5.0498L7.93262 7L9.86621 8.93359C9.98819 9.05576 10.0488 9.21169 10.0488 9.40039C10.0487 9.58886 9.98804 9.74414 9.86621 9.86621C9.7441 9.98833 9.5911 10.0522 9.4082 10.0576C9.2248 10.0634 9.07139 10.0058 8.94922 9.88379L6.99902 7.93359L5.06543 9.86621C4.94321 9.98843 4.78752 10.0498 4.59863 10.0498C4.40994 10.0497 4.25494 9.98834 4.13281 9.86621C4.01065 9.74404 3.94678 9.59165 3.94141 9.4082C3.93563 9.22509 3.99399 9.07242 4.11621 8.9502L6.06543 7L4.13281 5.06641C4.01059 4.94418 3.94922 4.7885 3.94922 4.59961C3.9493 4.41091 4.01069 4.25592 4.13281 4.13379C4.25498 4.01162 4.40737 3.94723 4.59082 3.94141Z" fill="#D83A3A"/>
    </svg>
);

Icon.SettingSdmsIcon = ({ size = "md", fill, ...props }) => (
    <Svg $width={setSize(size)} viewBox="0 0 14 16" {...props}>
        {settingsIcons.SDMS?.map((i, key) => (
            <path
                key={key}
                d={i}
                fill={
                    fill
                        ? fill === true
                            ? "currentcolor"
                            : setFill(fill)
                        : fill !== undefined
                        ? ""
                        : "grayscale.g500"
                }
            />
        ))}
    </Svg>
);

Icon.SettingSopIcon = ({ size = "md", fill, ...props }) => (
    <Svg $width={setSize(size)} viewBox="0 0 14 12" {...props}>
        {settingsIcons.SOP?.map((i, key) => (
            <path
                key={key}
                d={i}
                fill={
                    fill
                        ? fill === true
                            ? "currentcolor"
                            : setFill(fill)
                        : fill !== undefined
                        ? ""
                        : "grayscale.g500"
                }
            />
        ))}
    </Svg>
);

Icon.SettingUserOptionIcon = ({ size = "md", fill, ...props }) => (
    <Svg $width={setSize(size)} viewBox="0 0 14 14" {...props}>
        {settingsIcons.UserOption?.map((i, key) => (
            <path
                key={key}
                d={i}
                fill={
                    fill
                        ? fill === true
                            ? "currentcolor"
                            : setFill(fill)
                        : fill !== undefined
                        ? ""
                        : "grayscale.g500"
                }
            />
        ))}
    </Svg>
);

Icon.SettingETCIcon = ({ size = "md", fill, ...props }) => (
    <Svg $width={setSize(size)} viewBox="0 0 14 14" {...props}>
        {settingsIcons.ETC?.map((i, key) => (
            <path
                key={key}
                d={i}
                fill={
                    fill
                        ? fill === true
                            ? "currentcolor"
                            : setFill(fill)
                        : fill !== undefined
                        ? ""
                        : "grayscale.g500"
                }
            />
        ))}
    </Svg>
);


// 현황정보 POI 아이콘
Icon.StatusInfoFire = ({ size = "md", fill, ...props }) => (
    <Svg $width={setSize(size)} viewBox="0 0 12 16" {...props}>
        {statusInfoIcons.Fire?.map((i, key) => (
            <path
                key={key}
                d={i}
                fill={
                    fill
                        ? fill === true
                            ? "currentcolor"
                            : setFill(fill)
                        : fill !== undefined
                        ? ""
                        : "grayscale.g500"
                }
            />
        ))}
    </Svg>
);

Icon.StatusInfoPSM = ({ size = "md", fill, ...props }) => (
    <Svg $width={setSize(size)} viewBox="0 0 14 14" {...props}>
        {statusInfoIcons.PSM?.map((i, key) => (
            <path
                key={key}
                d={i}
                fill={
                    fill
                        ? fill === true
                            ? "currentcolor"
                            : setFill(fill)
                        : fill !== undefined
                        ? ""
                        : "grayscale.g500"
                }
            />
        ))}
    </Svg>
);

Icon.StatusInfoPSM = ({ size = "md", fill, ...props }) => (
    <Svg $width={setSize(size)} viewBox="0 0 14 14" {...props}>
        {statusInfoIcons.PSM?.map((i, key) => (
            <path
                key={key}
                d={i}
                fill={
                    fill
                        ? fill === true
                            ? "currentcolor"
                            : setFill(fill)
                        : fill !== undefined
                        ? ""
                        : "grayscale.g500"
                }
            />
        ))}
    </Svg>
);

Icon.StatusInfoPM25 = ({ size = "md", fill, ...props }) => (
    <Svg $width={setSize(size)} viewBox="0 0 16 14" {...props}>
        {statusInfoIcons.PM25?.map((i, key) => (
            <path
                key={key}
                d={i}
                fill={
                    fill
                        ? fill === true
                            ? "currentcolor"
                            : setFill(fill)
                        : fill !== undefined
                        ? ""
                        : "grayscale.g500"
                }
            />
        ))}
    </Svg>
);

Icon.StatusInfoWorker = ({ size = "md", fill, ...props }) => (
    <Svg $width={setSize(size)} viewBox="0 0 14 11" {...props}>
        {statusInfoIcons.Worker?.map((i, key) => (
            <path
                key={key}
                d={i}
                fill={
                    fill
                        ? fill === true
                            ? "currentcolor"
                            : setFill(fill)
                        : fill !== undefined
                        ? ""
                        : "grayscale.g500"
                }
            />
        ))}
    </Svg>
);

Icon.StatusInfoSump = ({ size = "md", fill, ...props }) => (
    <Svg $width={setSize(size)} viewBox="0 0 14 14" {...props}>
        {statusInfoIcons.Sump?.map((i, key) => (
            <path
                key={key}
                d={i}
                fill={
                    fill
                        ? fill === true
                            ? "currentcolor"
                            : setFill(fill)
                        : fill !== undefined
                        ? ""
                        : "grayscale.g500"
                }
            />
        ))}
    </Svg>
);

Icon.StatusInfoETC = ({ size = "md", fill, ...props }) => (
    <Svg $width={setSize(size)} viewBox="0 0 16 12" {...props}>
        {statusInfoIcons.ETC?.map((i, key) => (
            <path
                key={key}
                d={i}
                fill={
                    fill
                        ? fill === true
                            ? "currentcolor"
                            : setFill(fill)
                        : fill !== undefined
                        ? ""
                        : "grayscale.g500"
                }
            />
        ))}
    </Svg>
);

Icon.StatusInfoCCTV = ({ size = "md", fill, ...props }) => (
    <Svg $width={setSize(size)} viewBox="0 0 14 14" {...props}>
        {statusInfoIcons.CCTV?.map((i, key) => (
            <path
                key={key}
                d={i}
                fill={
                    fill
                        ? fill === true
                            ? "currentcolor"
                            : setFill(fill)
                        : fill !== undefined
                        ? ""
                        : "grayscale.g500"
                }
            />
        ))}
    </Svg>
);

Icon.StatusInfoEquipZoneName = ({ size = "md", fill, ...props }) => (
    <Svg $width={setSize(size)} viewBox="0 0 14 14" {...props}>
        {statusInfoIcons.EquipZoneName?.map((i, key) => (
            <path
                key={key}
                d={i}
                fill={
                    fill
                        ? fill === true
                            ? "currentcolor"
                            : setFill(fill)
                        : fill !== undefined
                        ? ""
                        : "grayscale.g500"
                }
            />
        ))}
    </Svg>
);

Icon.StatusInfoShowAll = ({ size = "md", fill, ...props }) => (
    <Svg $width={setSize(size)} viewBox="0 0 16 10" {...props}>
        {statusInfoIcons.ShowAll?.map((i, key) => (
            <path
                key={key}
                d={i}
                fill={
                    fill
                        ? fill === true
                            ? "currentcolor"
                            : setFill(fill)
                        : fill !== undefined
                        ? ""
                        : "grayscale.g500"
                }
            />
        ))}
    </Svg>
);

Icon.StatusInfoHideAll = ({ size = "md", fill, ...props }) => (
    <Svg $width={setSize(size)} viewBox="0 0 14 8" {...props}>
        {statusInfoIcons.HideAll?.map((i, key) => (
            <path
                key={key}
                d={i}
                fill={
                    fill
                        ? fill === true
                            ? "currentcolor"
                            : setFill(fill)
                        : fill !== undefined
                        ? ""
                        : "grayscale.g500"
                }
            />
        ))}
    </Svg>
);

Icon.WindDirection = ({ size = "md", direction, fill, ...props }) => (
    <Svg
        $width={setSize(size)}
        $style={setDirection(direction)}
        viewBox="0 0 9 8"
    >
        {simulationIcons.WindDirection?.map((i, key) => (
            <path
                key={key}
                d={i}
                fill={
                    fill
                        ? fill === true
                            ? "currentcolor"
                            : setFill(fill)
                        : fill !== undefined
                        ? ""
                        : "var(--G_500)"
                }
            />
        ))}
    </Svg>
);


// 날씨 아이콘
Icon.imgSunnyDay = ({ width = 18, height = 18 }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 18 18" fill="none">
        <path fillRule="evenodd" clipRule="evenodd" d="M18 9.00002C18 10.7801 17.4721 12.5201 16.4832 14.0002C15.4943 15.4802 14.0887 16.6338 12.4441 17.315C10.7996 17.9961 8.99001 18.1743 7.24419 17.8271C5.49837 17.4798 3.8947 16.6227 2.63601 15.364C1.37735 14.1053 0.520202 12.5017 0.172934 10.7559C-0.174335 9.01003 0.00390947 7.20039 0.6851 5.55584C1.36629 3.9113 2.51985 2.50574 3.99989 1.51679C5.47993 0.527862 7.21998 0 9.00002 0C11.387 0 13.6761 0.948207 15.364 2.63604C17.0518 4.32387 18 6.61306 18 9.00002Z" fill="url(#paint0_linear_1477_34060)"/>
        <defs>
            <linearGradient id="paint0_linear_1477_34060" x1="2.11769e-06" y1="-2.8075e-08" x2="18" y2="18" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFB545"/>
            <stop offset="0.973958" stopColor="#FFE39B"/>
            </linearGradient>
        </defs>
    </svg>
);

Icon.imgSunnyNight = ({ width = 18, height = 18 }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 18 18" fill="none">
        <path d="M17.973 11.4447C18.1466 10.863 17.4466 10.4527 16.9056 10.7283C16.7393 10.8129 16.5694 10.8913 16.3961 10.963C15.0872 11.5052 13.6469 11.647 12.2574 11.3707C10.8679 11.0942 9.59152 10.4121 8.58971 9.41024C7.58792 8.40846 6.9057 7.13211 6.62931 5.74258C6.35292 4.35305 6.4948 2.91274 7.03695 1.60384C7.10873 1.4306 7.18707 1.26068 7.27174 1.09442C7.54722 0.553432 7.137 -0.146525 6.55523 0.0269549C5.68098 0.287647 4.84573 0.678641 4.07893 1.191C2.56965 2.19948 1.39329 3.63283 0.69864 5.30985C0.00399296 6.9869 -0.177785 8.83229 0.176354 10.6126C0.530471 12.393 1.40457 14.0283 2.68812 15.3118C3.97168 16.5954 5.60704 17.4694 7.38738 17.8237C9.16771 18.1778 11.0131 17.996 12.6901 17.3013C14.3671 16.6067 15.8005 15.4304 16.809 13.9211C17.3214 13.1543 17.7124 12.319 17.973 11.4447Z" fill="url(#paint0_linear_1488_35018)"/>
        <path fillRule="evenodd" clipRule="evenodd" d="M16.2123 6.26256C16.0864 6.32573 15.9844 6.42796 15.9214 6.55396L15.5118 7.37322C15.4516 7.49345 15.28 7.49345 15.2199 7.37322L14.8103 6.55396C14.7473 6.42796 14.6452 6.32573 14.5193 6.26256L13.6997 5.85117C13.5795 5.79085 13.5798 5.61926 13.7001 5.55933L14.518 5.15196C14.6447 5.08885 14.7475 4.98625 14.8108 4.85966L15.2199 4.04139C15.28 3.92116 15.4516 3.92116 15.5118 4.04139L15.9209 4.85966C15.9842 4.98625 16.0869 5.08885 16.2136 5.15194L17.0315 5.55933C17.1518 5.61926 17.1521 5.79085 17.032 5.85117L16.2123 6.26256Z" fill="url(#paint1_linear_1488_35018)"/>
        <path fillRule="evenodd" clipRule="evenodd" d="M17.3178 1.73351C17.2234 1.7809 17.1468 1.85757 17.0995 1.95205L16.7923 2.56651C16.7472 2.65668 16.6186 2.65668 16.5734 2.56651L16.2662 1.95205C16.219 1.85757 16.1424 1.7809 16.048 1.73351L15.4333 1.42496C15.3432 1.37974 15.3434 1.25104 15.4336 1.20609L16.0471 0.900547C16.1421 0.85322 16.2191 0.776281 16.2666 0.681343L16.5734 0.0676316C16.6186 -0.0225439 16.7472 -0.0225439 16.7923 0.0676316L17.0992 0.681343C17.1467 0.776281 17.2237 0.85322 17.3187 0.900547L17.9321 1.20609C18.0224 1.25104 18.0226 1.37974 17.9326 1.42496L17.3178 1.73351Z" fill="url(#paint2_linear_1488_35018)"/>
        <path fillRule="evenodd" clipRule="evenodd" d="M12.5943 2.46145C12.4841 2.51675 12.3949 2.6062 12.3397 2.71641L11.9813 3.43327C11.9287 3.53848 11.7785 3.53848 11.7259 3.43327L11.3675 2.71641C11.3124 2.6062 11.2231 2.51675 11.1129 2.46145L10.3958 2.1015C10.2906 2.04872 10.2908 1.89858 10.3961 1.84612L11.1118 1.48967C11.2227 1.43447 11.3126 1.34468 11.368 1.23392L11.7259 0.517938C11.7785 0.412726 11.9287 0.412726 11.9813 0.517938L12.3393 1.23392C12.3947 1.34468 12.4846 1.43444 12.5954 1.48967L13.3111 1.84612C13.4164 1.89858 13.4166 2.04872 13.3115 2.1015L12.5943 2.46145Z" fill="url(#paint3_linear_1488_35018)"/>
        <defs>
            <linearGradient id="paint0_linear_1488_35018" x1="-1.76273e-06" y1="-1.76273e-06" x2="18" y2="18" gradientUnits="userSpaceOnUse">
            <stop stopColor="#038FBC"/>
            <stop offset="1" stopColor="#73DBFD"/>
            </linearGradient>
            <linearGradient id="paint1_linear_1488_35018" x1="-4.10695e-05" y1="-2.81948e-05" x2="18" y2="18.0001" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFB545"/>
            <stop offset="1" stopColor="#FFE39B"/>
            </linearGradient>
            <linearGradient id="paint2_linear_1488_35018" x1="3.8555e-05" y1="-6.90852e-08" x2="18" y2="18.0001" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFB545"/>
            <stop offset="1" stopColor="#FFE39B"/>
            </linearGradient>
            <linearGradient id="paint3_linear_1488_35018" x1="10.317" y1="0.438965" x2="13.3902" y2="3.51214" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFB545"/>
            <stop offset="1" stopColor="#FFE39B"/>
            </linearGradient>
        </defs>
    </svg>
);

Icon.imgCloudDay = ({ width = 18, height = 18 }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 18 16" fill="none">
        <path fillRule="evenodd" clipRule="evenodd" d="M17.6 6.48101C17.6 7.76284 17.2246 9.01588 16.5214 10.0817C15.8182 11.1475 14.8186 11.9782 13.6492 12.4687C12.4797 12.9592 11.1929 13.0876 9.95142 12.8375C8.70994 12.5874 7.56956 11.9702 6.6745 11.0638C5.77944 10.1574 5.16992 9.00259 4.92298 7.74542C4.67602 6.48822 4.80278 5.18507 5.28718 4.00083C5.77158 2.81657 6.5919 1.8044 7.64436 1.09225C8.69684 0.380111 9.9342 0 11.2 0C12.8974 0 14.5253 0.682815 15.7255 1.89825C16.9258 3.11368 17.6 4.76215 17.6 6.48101Z" fill="url(#paint0_linear_1488_35019)"/>
        <path d="M14.2286 16C14.2286 16 8.59876 16 7 16C3.35492 16 0.4 12.917 0.4 9.11392C0.4 5.31085 3.35492 2.22785 7 2.22785C10.3465 2.22785 13.1113 4.82653 13.5418 8.19528C13.7645 8.15253 13.994 8.13021 14.2286 8.13021C16.3115 8.13021 18 9.89191 18 12.0651C18 14.2383 16.3115 16 14.2286 16Z" fill="black" fillOpacity="0.15"/>
        <path d="M13.8286 15.5949C13.8286 15.5949 8.19876 15.5949 6.6 15.5949C2.95492 15.5949 0 12.5119 0 8.70886C0 4.90578 2.95492 1.82279 6.6 1.82279C9.94654 1.82279 12.7113 4.42147 13.1418 7.79022C13.3645 7.74746 13.594 7.72514 13.8286 7.72514C15.9115 7.72514 17.6 9.48685 17.6 11.66C17.6 13.8332 15.9115 15.5949 13.8286 15.5949Z" fill="url(#paint1_linear_1488_35019)"/>
        <defs>
            <linearGradient id="paint0_linear_1488_35019" x1="3.93732e-06" y1="-3.14856e-07" x2="15.8897" y2="17.8759" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFB545"/>
            <stop offset="0.973958" stopColor="#FFE39B"/>
            </linearGradient>
            <linearGradient id="paint1_linear_1488_35019" x1="5.0857e-09" y1="1.82277" x2="17.9424" y2="15.1333" gradientUnits="userSpaceOnUse">
            <stop stopColor="#DFDFDF"/>
            <stop offset="1" stopColor="white"/>
            </linearGradient>
        </defs>
    </svg>
);

Icon.imgCloudNight = ({ width = 18, height = 18 }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 20 17" fill="none">
        <path d="M19.9829 7.2928C20.0931 6.92208 19.6486 6.66069 19.3051 6.83624C19.1996 6.89019 19.0916 6.94012 18.9816 6.98584C18.1506 7.33133 17.2362 7.4217 16.3539 7.24559C15.4717 7.06947 14.6613 6.63474 14.0252 5.99638C13.3892 5.35802 12.956 4.5447 12.7805 3.65928C12.605 2.77385 12.6951 1.85605 13.0394 1.02198C13.0849 0.911587 13.1347 0.803319 13.1884 0.697386C13.3633 0.352654 13.1029 -0.0933812 12.7335 0.0171804C12.1784 0.183289 11.6481 0.432452 11.1612 0.758935C10.203 1.40154 9.45607 2.31491 9.01503 3.38353C8.57397 4.45218 8.45856 5.62809 8.68339 6.76255C8.90825 7.89702 9.46323 8.93906 10.2782 9.75697C11.0931 10.5749 12.1315 11.1319 13.2618 11.3575C14.3922 11.5832 15.5638 11.4674 16.6286 11.0247C17.6935 10.5821 18.6035 9.83249 19.2439 8.87074C19.5692 8.38212 19.8174 7.84989 19.9829 7.2928Z" fill="url(#paint0_linear_1488_35023)"/>
        <path d="M14.519 17C14.519 17 8.77424 17 7.14285 17C3.42338 17 0.408151 13.8822 0.408151 10.0361C0.408151 6.19009 3.42338 3.07227 7.14285 3.07227C10.5577 3.07227 13.3789 5.70031 13.8181 9.10711C14.0454 9.06388 14.2796 9.0413 14.519 9.0413C16.6444 9.0413 18.3673 10.8229 18.3673 13.0206C18.3673 15.2184 16.6444 17 14.519 17Z" fill="black" fillOpacity="0.15"/>
        <path d="M14.1108 16.5904C14.1108 16.5904 8.36609 16.5904 6.7347 16.5904C3.01523 16.5904 0 13.4725 0 9.62651C0 5.78046 3.01523 2.66264 6.7347 2.66264C10.1495 2.66264 12.9708 5.29068 13.41 8.69748C13.6372 8.65425 13.8715 8.63168 14.1108 8.63168C16.2362 8.63168 17.9592 10.4133 17.9592 12.611C17.9592 14.8088 16.2362 16.5904 14.1108 16.5904Z" fill="url(#paint1_linear_1488_35023)"/>
        <defs>
            <linearGradient id="paint0_linear_1488_35023" x1="5.41008e-06" y1="-5.53423e-06" x2="16.7779" y2="19.7388" gradientUnits="userSpaceOnUse">
            <stop stopColor="#038FBC"/>
            <stop offset="1" stopColor="#73DBFD"/>
            </linearGradient>
            <linearGradient id="paint1_linear_1488_35023" x1="5.17306e-08" y1="2.66264" x2="18.1917" y2="16.2797" gradientUnits="userSpaceOnUse">
            <stop stopColor="#DFDFDF"/>
            <stop offset="1" stopColor="white"/>
            </linearGradient>
        </defs>
    </svg>
);

Icon.imgThunder = ({ width = 18, height = 18 }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 18 18" fill="none">
        <path d="M9.25653 14.7712C9.41432 14.518 9.32069 14.1942 9.04739 14.0481C8.77409 13.9019 8.42462 13.9886 8.26683 14.2418L6.55257 16.9926C6.39477 17.2459 6.48841 17.5696 6.76171 17.7158C7.035 17.862 7.38447 17.7753 7.54227 17.5221L9.25653 14.7712Z" fill="#00B6F1"/>
        <path d="M5.82819 14.7712C5.98599 14.518 5.89235 14.1942 5.61905 14.0481C5.34576 13.9019 4.99629 13.9886 4.83849 14.2418L3.12423 16.9926C2.96644 17.2459 3.06007 17.5696 3.33337 17.7158C3.60667 17.862 3.95614 17.7753 4.11393 17.5221L5.82819 14.7712Z" fill="#00B6F1"/>
        <path d="M2.01872 14.6766C2.17652 14.4234 2.08288 14.0996 1.80958 13.9534C1.53628 13.8072 1.18681 13.894 1.02902 14.1472L0.0766532 15.6754C-0.0811403 15.9286 0.0124949 16.2524 0.285793 16.3986C0.559092 16.5448 0.908561 16.4581 1.06635 16.2048L2.01872 14.6766Z" fill="#00B6F1"/>
        <path fillRule="evenodd" clipRule="evenodd" d="M16.2037 9.79633C16.2634 9.67081 16.1651 9.52942 16.0181 9.52942H13.2208C13.1368 9.52942 13.0614 9.57779 13.0313 9.6511L11.1567 14.2067C11.1055 14.331 11.2037 14.4646 11.3462 14.4646L12.7659 14.4646C12.9137 14.4646 13.0119 14.6073 12.9508 14.733L11.4933 17.7302C11.4005 17.921 11.6582 18.0909 11.8194 17.9451L16.9853 13.2723C17.1166 13.1537 17.0267 12.9461 16.8442 12.9461H15.0185C14.8715 12.9461 14.7732 12.8047 14.8329 12.6792L16.2037 9.79633Z" fill="url(#paint0_linear_1502_35192)"/>
        <path d="M15.3878 8.4706C15.3878 8.4706 11.4884 8.4706 10.3811 8.4706C7.85637 8.4706 5.80969 6.57439 5.80969 4.2353C5.80969 1.89621 7.85637 0 10.3811 0C12.699 0 14.614 1.59833 14.9121 3.67029C15.0663 3.644 15.2253 3.63025 15.3878 3.63025C16.8305 3.63025 18 4.7138 18 6.05043C18 7.38705 16.8305 8.4706 15.3878 8.4706Z" fill="url(#paint1_linear_1502_35192)"/>
        <path d="M14.0273 12.353C14.0273 12.353 8.66562 12.353 7.14301 12.353C3.67155 12.353 0.857382 9.66667 0.857382 6.35295C0.857382 3.03923 3.67155 0.352942 7.14301 0.352942C10.3301 0.352942 12.9633 2.61724 13.3732 5.55251C13.5853 5.51528 13.8039 5.49581 14.0273 5.49581C16.011 5.49581 17.6191 7.03083 17.6191 8.92438C17.6191 10.8179 16.011 12.353 14.0273 12.353Z" fill="black" fillOpacity="0.15"/>
        <path d="M13.6463 12C13.6463 12 8.28467 12 6.76206 12C3.29061 12 0.476436 9.31372 0.476436 6.00001C0.476436 2.68629 3.29061 0 6.76206 0C9.9492 0 12.5823 2.2643 12.9922 5.19957C13.2043 5.16232 13.4229 5.14287 13.6463 5.14287C15.63 5.14287 17.2381 6.67788 17.2381 8.57143C17.2381 10.465 15.63 12 13.6463 12Z" fill="url(#paint2_linear_1502_35192)"/>
        <defs>
            <linearGradient id="paint0_linear_1502_35192" x1="10.2425" y1="0" x2="10.2425" y2="19.3613" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFB545"/>
            <stop offset="1" stopColor="#FFE39B"/>
            </linearGradient>
            <linearGradient id="paint1_linear_1502_35192" x1="0" y1="0" x2="21.4545" y2="12.1664" gradientUnits="userSpaceOnUse">
            <stop stopColor="#6A869C"/>
            <stop offset="1" stopColor="#BDD2E2"/>
            </linearGradient>
            <linearGradient id="paint2_linear_1502_35192" x1="0.476397" y1="4.57562e-07" x2="16.4596" y2="12.96" gradientUnits="userSpaceOnUse">
            <stop stopColor="#DFDFDF"/>
            <stop offset="1" stopColor="white"/>
            </linearGradient>
        </defs>
    </svg>
);

Icon.imgSnow = ({ width = 18, height = 18 }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 18 18" fill="none">
        <path d="M12.5217 18C12.954 18 13.3043 17.6776 13.3043 17.28C13.3043 16.8824 12.954 16.56 12.5217 16.56C12.0895 16.56 11.7391 16.8824 11.7391 17.28C11.7391 17.6776 12.0895 18 12.5217 18Z" fill="#DBECF9"/>
        <path d="M9 18C9.43222 18 9.78261 17.6776 9.78261 17.28C9.78261 16.8824 9.43222 16.56 9 16.56C8.56777 16.56 8.21739 16.8824 8.21739 17.28C8.21739 17.6776 8.56777 18 9 18Z" fill="#DBECF9"/>
        <path d="M5.47826 18C5.91048 18 6.26087 17.6776 6.26087 17.28C6.26087 16.8824 5.91048 16.56 5.47826 16.56C5.04603 16.56 4.69565 16.8824 4.69565 17.28C4.69565 17.6776 5.04603 18 5.47826 18Z" fill="#DBECF9"/>
        <path d="M14.2826 15.48C14.7148 15.48 15.0652 15.1576 15.0652 14.76C15.0652 14.3624 14.7148 14.04 14.2826 14.04C13.8504 14.04 13.5 14.3624 13.5 14.76C13.5 15.1576 13.8504 15.48 14.2826 15.48Z" fill="#DBECF9"/>
        <path d="M10.7609 15.48C11.1931 15.48 11.5435 15.1576 11.5435 14.76C11.5435 14.3624 11.1931 14.04 10.7609 14.04C10.3286 14.04 9.97826 14.3624 9.97826 14.76C9.97826 15.1576 10.3286 15.48 10.7609 15.48Z" fill="#DBECF9"/>
        <path d="M7.23913 15.48C7.67135 15.48 8.02174 15.1576 8.02174 14.76C8.02174 14.3624 7.67135 14.04 7.23913 14.04C6.80691 14.04 6.45652 14.3624 6.45652 14.76C6.45652 15.1576 6.80691 15.48 7.23913 15.48Z" fill="#DBECF9"/>
        <path d="M3.71739 15.48C4.14961 15.48 4.5 15.1576 4.5 14.76C4.5 14.3624 4.14961 14.04 3.71739 14.04C3.28517 14.04 2.93478 14.3624 2.93478 14.76C2.93478 15.1576 3.28517 15.48 3.71739 15.48Z" fill="#DBECF9"/>
        <path d="M15.3168 8.64C15.3168 8.64 11.3114 8.64 10.1739 8.64C7.58058 8.64 5.47826 6.70587 5.47826 4.32C5.47826 1.93414 7.58058 0 10.1739 0C12.5549 0 14.5219 1.6303 14.8281 3.7437C14.9866 3.71688 15.1499 3.70285 15.3168 3.70285C16.7987 3.70285 18 4.80807 18 6.17143C18 7.53478 16.7987 8.64 15.3168 8.64Z" fill="url(#paint0_linear_1502_36338)"/>
        <path d="M13.9193 12.6C13.9193 12.6 8.41183 12.6 6.84783 12.6C3.28199 12.6 0.391304 9.85999 0.391304 6.48C0.391304 3.10001 3.28199 0.36 6.84783 0.36C10.1216 0.36 12.8263 2.66958 13.2474 5.66356C13.4653 5.62558 13.6898 5.60572 13.9193 5.60572C15.9569 5.60572 17.6087 7.17144 17.6087 9.10285C17.6087 11.0343 15.9569 12.6 13.9193 12.6Z" fill="black" fillOpacity="0.15"/>
        <path d="M13.528 12.24C13.528 12.24 8.02053 12.24 6.45652 12.24C2.89068 12.24 0 9.49999 0 6.12C0 2.74001 2.89068 0 6.45652 0C9.73031 0 12.435 2.30958 12.8561 5.30356C13.0739 5.26556 13.2985 5.24572 13.528 5.24572C15.5656 5.24572 17.2174 6.81144 17.2174 8.74285C17.2174 10.6743 15.5656 12.24 13.528 12.24Z" fill="url(#paint1_linear_1502_36338)"/>
        <defs>
            <linearGradient id="paint0_linear_1502_36338" x1="0" y1="0" x2="21.4545" y2="12.1664" gradientUnits="userSpaceOnUse">
            <stop stopColor="#6A869C"/>
            <stop offset="1" stopColor="#BDD2E2"/>
            </linearGradient>
            <linearGradient id="paint1_linear_1502_36338" x1="0" y1="0" x2="16.3262" y2="13.3313" gradientUnits="userSpaceOnUse">
            <stop stopColor="#DFDFDF"/>
            <stop offset="1" stopColor="white"/>
            </linearGradient>
        </defs>
    </svg>
);

Icon.imgRain = ({ width = 18, height = 18 }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 18 18" fill="none">
        <path d="M13.9102 14.9483C14.0723 14.692 13.9761 14.3644 13.6954 14.2164C13.4146 14.0685 13.0557 14.1563 12.8936 14.4125L11.1327 17.1963C10.9706 17.4525 11.0668 17.7802 11.3475 17.9281C11.6283 18.0761 11.9872 17.9883 12.1493 17.732L13.9102 14.9483Z" fill="#00B6F1"/>
        <path d="M10.3883 14.9483C10.5504 14.692 10.4542 14.3644 10.1735 14.2164C9.89279 14.0685 9.53382 14.1563 9.37174 14.4125L7.61088 17.1963C7.44879 17.4525 7.54497 17.7802 7.8257 17.9281C8.10643 18.0761 8.4654 17.9883 8.62748 17.732L10.3883 14.9483Z" fill="#00B6F1"/>
        <path d="M6.47558 14.8522C6.63767 14.596 6.54148 14.2683 6.26076 14.1204C5.98003 13.9725 5.62106 14.0602 5.45898 14.3165L4.48072 15.863C4.31864 16.1193 4.41482 16.4469 4.69554 16.5949C4.97627 16.7428 5.33524 16.655 5.49732 16.3988L6.47558 14.8522Z" fill="#00B6F1"/>
        <path d="M15.3168 8.57208C15.3168 8.57208 11.3114 8.57208 10.1739 8.57208C7.58062 8.57208 5.47831 6.65315 5.47831 4.28604C5.47831 1.91893 7.58062 0 10.1739 0C12.5549 0 14.5219 1.61748 14.8282 3.71426C14.9866 3.68766 15.1499 3.67374 15.3168 3.67374C16.7987 3.67374 18 4.77027 18 6.12291C18 7.47555 16.7987 8.57208 15.3168 8.57208Z" fill="url(#paint0_linear_1509_39271)"/>
        <path d="M13.9192 12.5009C13.9192 12.5009 8.41179 12.5009 6.84779 12.5009C3.28197 12.5009 0.391294 9.7824 0.391294 6.42898C0.391294 3.07557 3.28197 0.357096 6.84779 0.357096C10.1216 0.357096 12.8263 2.64852 13.2473 5.61896C13.4652 5.58128 13.6897 5.56158 13.9192 5.56158C15.9568 5.56158 17.6086 7.11498 17.6086 9.03122C17.6086 10.9475 15.9568 12.5009 13.9192 12.5009Z" fill="black" fillOpacity="0.15"/>
        <path d="M13.5279 12.1438C13.5279 12.1438 8.0205 12.1438 6.4565 12.1438C2.89067 12.1438 0 9.4253 0 6.07189C0 2.71847 2.89067 0 6.4565 0C9.73028 0 12.435 2.29142 12.856 5.26186C13.0739 5.22416 13.2985 5.20448 13.5279 5.20448C15.5655 5.20448 17.2173 6.75789 17.2173 8.67412C17.2173 10.5904 15.5655 12.1438 13.5279 12.1438Z" fill="url(#paint1_linear_1509_39271)"/>
        <defs>
            <linearGradient id="paint0_linear_1509_39271" x1="0" y1="0" x2="21.4545" y2="12.1664" gradientUnits="userSpaceOnUse">
            <stop stopColor="#6A869C"/>
            <stop offset="1" stopColor="#BDD2E2"/>
            </linearGradient>
            <linearGradient id="paint1_linear_1509_39271" x1="0" y1="0" x2="16.2229" y2="13.3519" gradientUnits="userSpaceOnUse">
            <stop stopColor="#DFDFDF"/>
            <stop offset="1" stopColor="white"/>
            </linearGradient>
        </defs>
    </svg>
);

Icon.imgDustStorm = ({ width = 18, height = 18 }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 18 18" fill="none">
        <path d="M1.2181 9.48892C2.1646 10.3256 3.23735 11.274 5.31238 11.274C7.38748 11.274 8.46029 10.3256 9.40682 9.48892C10.3019 8.69766 11.075 8.01425 12.6874 8.01425C14.2999 8.01425 15.073 8.69766 15.9681 9.48892C16.2301 9.72052 16.6247 9.68941 16.8494 9.41938C17.0741 9.14933 17.0439 8.74268 16.7819 8.51108C15.8354 7.67437 14.7625 6.72597 12.6874 6.72597C10.6124 6.72597 9.53954 7.67434 8.59301 8.51108C7.69788 9.30234 6.92482 9.98575 5.31238 9.98575C3.69998 9.98575 2.92701 9.30238 2.03194 8.51108C1.76994 8.27948 1.37538 8.31056 1.15063 8.58061C0.925882 8.85064 0.956101 9.25732 1.2181 9.48892Z" fill="url(#paint0_linear_1509_38409)"/>
        <path d="M1.2181 3.76295C2.16457 4.59969 3.23732 5.54806 5.31238 5.54806C7.38748 5.54806 8.46029 4.59969 9.40682 3.76295C10.3019 2.97169 11.075 2.28829 12.6874 2.28829C14.2999 2.28829 15.0729 2.97166 15.9681 3.76295C16.2301 3.99462 16.6246 3.96341 16.8494 3.69335C17.0741 3.42333 17.0438 3.01662 16.7818 2.78505C15.8353 1.94831 14.7625 1 12.6874 1C10.6124 1 9.53954 1.94837 8.59301 2.78511C7.69788 3.57638 6.92482 4.25978 5.31238 4.25978C3.70001 4.25978 2.92701 3.57641 2.03194 2.78511C1.76994 2.55348 1.37535 2.58459 1.15063 2.85465C0.925882 3.12467 0.956101 3.53135 1.2181 3.76295Z" fill="url(#paint1_linear_1509_38409)"/>
        <path d="M16.7819 14.237C15.8353 13.4003 14.7625 12.4519 12.6874 12.4519C10.6123 12.4519 9.53951 13.4003 8.59298 14.237C7.69786 15.0283 6.92479 15.7117 5.31236 15.7117C3.70004 15.7117 2.92701 15.0283 2.03195 14.2371C1.76995 14.0056 1.37536 14.0366 1.15061 14.3066C0.925887 14.5766 0.956106 14.9833 1.21811 15.2149C2.16461 16.0517 3.23739 17 5.31236 17C7.38745 17 8.46026 16.0516 9.40679 15.2149C10.3019 14.4236 11.075 13.7402 12.6874 13.7402C14.2999 13.7402 15.073 14.4236 15.968 15.2149C16.2301 15.4465 16.6246 15.4154 16.8494 15.1454C17.0741 14.8753 17.0439 14.4686 16.7819 14.237Z" fill="url(#paint2_linear_1509_38409)"/>
        <path d="M1.2181 9.48892C2.1646 10.3256 3.23735 11.274 5.31238 11.274C7.38748 11.274 8.46029 10.3256 9.40682 9.48892C10.3019 8.69766 11.075 8.01425 12.6874 8.01425C14.2999 8.01425 15.073 8.69766 15.9681 9.48892C16.2301 9.72052 16.6247 9.68941 16.8494 9.41938C17.0741 9.14933 17.0439 8.74268 16.7819 8.51108C15.8354 7.67437 14.7625 6.72597 12.6874 6.72597C10.6124 6.72597 9.53954 7.67434 8.59301 8.51108C7.69788 9.30234 6.92482 9.98575 5.31238 9.98575C3.69998 9.98575 2.92701 9.30238 2.03194 8.51108C1.76994 8.27948 1.37538 8.31056 1.15063 8.58061C0.925882 8.85064 0.956101 9.25732 1.2181 9.48892Z" stroke="url(#paint3_linear_1509_38409)"/>
        <path d="M1.2181 3.76295C2.16457 4.59969 3.23732 5.54806 5.31238 5.54806C7.38748 5.54806 8.46029 4.59969 9.40682 3.76295C10.3019 2.97169 11.075 2.28829 12.6874 2.28829C14.2999 2.28829 15.0729 2.97166 15.9681 3.76295C16.2301 3.99462 16.6246 3.96341 16.8494 3.69335C17.0741 3.42333 17.0438 3.01662 16.7818 2.78505C15.8353 1.94831 14.7625 1 12.6874 1C10.6124 1 9.53954 1.94837 8.59301 2.78511C7.69788 3.57638 6.92482 4.25978 5.31238 4.25978C3.70001 4.25978 2.92701 3.57641 2.03194 2.78511C1.76994 2.55348 1.37535 2.58459 1.15063 2.85465C0.925882 3.12467 0.956101 3.53135 1.2181 3.76295Z" stroke="url(#paint4_linear_1509_38409)"/>
        <path d="M16.7819 14.237C15.8353 13.4003 14.7625 12.4519 12.6874 12.4519C10.6123 12.4519 9.53951 13.4003 8.59298 14.237C7.69786 15.0283 6.92479 15.7117 5.31236 15.7117C3.70004 15.7117 2.92701 15.0283 2.03195 14.2371C1.76995 14.0056 1.37536 14.0366 1.15061 14.3066C0.925887 14.5766 0.956106 14.9833 1.21811 15.2149C2.16461 16.0517 3.23739 17 5.31236 17C7.38745 17 8.46026 16.0516 9.40679 15.2149C10.3019 14.4236 11.075 13.7402 12.6874 13.7402C14.2999 13.7402 15.073 14.4236 15.968 15.2149C16.2301 15.4465 16.6246 15.4154 16.8494 15.1454C17.0741 14.8753 17.0439 14.4686 16.7819 14.237Z" stroke="url(#paint5_linear_1509_38409)"/>
        <defs>
            <linearGradient id="paint0_linear_1509_38409" x1="17.5714" y1="9.153" x2="0.428571" y2="9.153" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFBF57"/>
            <stop offset="1" stopColor="#FFE3A6"/>
            </linearGradient>
            <linearGradient id="paint1_linear_1509_38409" x1="17.5714" y1="9.153" x2="0.428571" y2="9.153" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFBF57"/>
            <stop offset="1" stopColor="#FFE3A6"/>
            </linearGradient>
            <linearGradient id="paint2_linear_1509_38409" x1="17.5714" y1="9.153" x2="0.428571" y2="9.153" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFBF57"/>
            <stop offset="1" stopColor="#FFE3A6"/>
            </linearGradient>
            <linearGradient id="paint3_linear_1509_38409" x1="17.5714" y1="8.56407" x2="0.428571" y2="8.56407" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFBF57"/>
            <stop offset="1" stopColor="#FFE3A6"/>
            </linearGradient>
            <linearGradient id="paint4_linear_1509_38409" x1="17.5714" y1="8.56407" x2="0.428571" y2="8.56407" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFBF57"/>
            <stop offset="1" stopColor="#FFE3A6"/>
            </linearGradient>
            <linearGradient id="paint5_linear_1509_38409" x1="17.5714" y1="8.56407" x2="0.428571" y2="8.56407" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFBF57"/>
            <stop offset="1" stopColor="#FFE3A6"/>
            </linearGradient>
        </defs>
    </svg>
);

Icon.SimulationPanelIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="9" height="9" viewBox="0 0 16 16" fill="none">
        <path d="M8.66602 14.667H7.33203V13.333H5.99902V14.667H3.99902V11.833C3.56571 11.6441 3.18497 11.3916 2.85742 11.0752C2.52951 10.7584 2.25193 10.3999 2.02441 10C1.79644 9.60005 1.62426 9.17229 1.50781 8.7168C1.39092 8.26124 1.33203 7.79967 1.33203 7.33301C1.33211 5.5776 1.95485 4.13876 3.19922 3.0166C4.44364 1.89449 6.04356 1.33301 7.99902 1.33301C9.9545 1.33302 11.5544 1.89445 12.7988 3.0166C14.0432 4.13876 14.6659 5.5776 14.666 7.33301C14.666 7.79967 14.6077 8.26124 14.4912 8.7168C14.3743 9.17228 14.2021 9.60006 13.9746 10C13.7466 10.4 13.4682 10.7583 13.1406 11.0752C12.8127 11.3916 12.4322 11.6441 11.999 11.833V14.667H9.99902V13.333H8.66602V14.667ZM6.99902 10.5H8.99902L7.99902 8.5L6.99902 10.5ZM5.66602 6C5.29936 6 4.98549 6.13073 4.72461 6.3916C4.46335 6.65286 4.33211 6.96648 4.33203 7.33301C4.33203 7.69967 4.46328 8.01353 4.72461 8.27441C4.98549 8.53572 5.29937 8.66699 5.66602 8.66699C6.03251 8.6669 6.34619 8.53565 6.60742 8.27441C6.86829 8.01353 6.99902 7.69966 6.99902 7.33301C6.99895 6.9665 6.86821 6.65285 6.60742 6.3916C6.34619 6.13081 6.03251 6.0001 5.66602 6ZM10.332 6C9.96547 6.00006 9.65146 6.13077 9.39062 6.3916C9.12957 6.6528 8.9991 6.96662 8.99902 7.33301C8.99902 7.69954 9.12948 8.01358 9.39062 8.27441C9.65146 8.53569 9.96547 8.66693 10.332 8.66699C10.6987 8.66699 11.0131 8.53575 11.2744 8.27441C11.5352 8.01356 11.666 7.69959 11.666 7.33301C11.6659 6.96657 11.5351 6.65282 11.2744 6.3916C11.0131 6.13071 10.6987 6 10.332 6Z" fill="white"/>
    </svg>
);

Icon.AutoPlayIcon = ({ size = 12, fill }) => {
    return (
        <Svg $width={setSize(size)} viewBox="0 0 10 10" fill="none">
            <path d="M5 0C5.69167 7.54035e-09 6.34186 0.131055 6.9502 0.393555C7.55849 0.656051 8.08713 1.01291 8.53711 1.46289C8.98709 1.91287 9.34395 2.44151 9.60645 3.0498C9.86895 3.65814 10 4.30833 10 5C10 5.69167 9.86895 6.34186 9.60645 6.9502C9.34395 7.55849 8.98709 8.08713 8.53711 8.53711C8.08713 8.98709 7.55849 9.34395 6.9502 9.60645C6.34186 9.86895 5.69167 10 5 10C4.30833 10 3.65814 9.86895 3.0498 9.60645C2.44151 9.34395 1.91287 8.98709 1.46289 8.53711C1.01291 8.08713 0.656051 7.55849 0.393555 6.9502C0.131055 6.34186 7.54039e-09 5.69167 0 5C0 4.30833 0.131055 3.65814 0.393555 3.0498C0.656051 2.44151 1.01291 1.91287 1.46289 1.46289C1.91287 1.01291 2.44151 0.656051 3.0498 0.393555C3.65814 0.131055 4.30833 0 5 0ZM5 1C3.89167 1 2.94811 1.38978 2.16895 2.16895C1.38978 2.94811 1 3.89167 1 5C1 6.10833 1.38978 7.05189 2.16895 7.83105C2.94811 8.61022 3.89167 9 5 9C6.10833 9 7.05189 8.61022 7.83105 7.83105C8.61022 7.05189 9 6.10833 9 5C9 3.89167 8.61022 2.94811 7.83105 2.16895C7.05189 1.38978 6.10833 1 5 1ZM4.0127 3.22461C4.18759 3.13312 4.35882 3.14173 4.52539 3.25L6.59961 4.5752C6.75794 4.66686 6.83789 4.80833 6.83789 5C6.83789 5.19167 6.75794 5.33314 6.59961 5.4248L4.52539 6.75C4.35882 6.85827 4.18759 6.86688 4.0127 6.77539C3.83781 6.68378 3.75011 6.53769 3.75 6.33789V3.66211C3.75011 3.46231 3.83781 3.31622 4.0127 3.22461Z" fill={setFill(fill)} />
        </Svg>
    );
};

Icon.ChartIcon = ({ size, fill }) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M3.905 15H2.01985C1.45742 15 1 14.5323 1 13.9572V5.59519C1 5.02011 1.45742 4.55238 2.01985 4.55238H3.905C4.46742 4.55238 4.92484 5.02011 4.92484 5.59519V13.9572C4.92484 14.5323 4.46742 15 3.905 15ZM2.01985 5.59519V13.9572H3.90556L3.905 5.59519H2.01985ZM8.94258 15H7.05771C6.49529 15 6.03786 14.5323 6.03786 13.9572V2.0428C6.03786 1.46772 6.49529 1 7.05771 1H8.94258C9.505 1 9.96242 1.46772 9.96242 2.0428V13.9575C9.96214 14.5323 9.50471 15 8.94258 15ZM7.05742 2.0428V13.9575H8.94314L8.94258 2.0428H7.05742ZM13.9802 15H12.095C11.5326 15 11.0752 14.5323 11.0752 13.9572V8.52126C11.0752 7.94618 11.5326 7.47845 12.095 7.47845H13.9802C14.5426 7.47845 15 7.94618 15 8.52126V13.9575C15 14.5323 14.5426 15 13.9802 15ZM12.095 8.52126V13.9575H13.9807L13.9802 8.52126H12.095Z" fill="#686D78"/>
        </svg>
    );
};

Icon.EquipmentPOIIcon = () => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M17 17.6484C17 18.3949 16.3807 18.9999 15.6172 19H4.38281C3.61918 19 3 18.3949 3 17.6484V13.9316H17V17.6484ZM17 13.165H3V8.0957H17V13.165ZM5.33496 3.95703L6.18652 3.625H13.8135L14.5801 3.9248V2.88379H15.7451V4.37988L16.1123 4.52344C16.6428 4.73101 16.9911 5.23334 16.9912 5.79199V7.32617H3.00879V5.79199C3.00894 5.23328 3.35701 4.73099 3.8877 4.52344L4.1709 4.41309V2.88379H5.33496V3.95703ZM11.5342 1C12.231 1 12.7959 1.55225 12.7959 2.2334V2.99316H7.20312V2.2334C7.20312 1.55234 7.76819 1.00015 8.46484 1H11.5342Z" fill="white"/>
        </svg>
    );
};

Icon.Calendar = () => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="18" viewBox="0 0 16 18" fill="none">
            <path d="M12.167 0.666504C12.4031 0.666504 12.6013 0.746317 12.7607 0.905762C12.9205 1.06565 12.9999 1.26364 13 1.49951V2.3335H13.834C14.2922 2.33355 14.6851 2.49614 15.0117 2.82275C15.3377 3.14879 15.4999 3.54132 15.5 3.99951V15.6665C15.5 16.1248 15.3378 16.5176 15.0117 16.8442C14.6851 17.1703 14.2922 17.3334 13.834 17.3335H2.16699C1.70871 17.3335 1.3159 17.1703 0.989258 16.8442C0.663182 16.5176 0.500002 16.1248 0.5 15.6665V3.99951C0.500075 3.54131 0.663222 3.14879 0.989258 2.82275C1.31589 2.49613 1.70872 2.33352 2.16699 2.3335H3V1.49951C3.00007 1.26365 3.08003 1.06565 3.23926 0.905762C3.39926 0.746317 3.59787 0.666504 3.83398 0.666504C4.06998 0.666552 4.26779 0.7464 4.42773 0.905762C4.58711 1.06569 4.66692 1.26354 4.66699 1.49951V2.3335H11.334V1.49951C11.3341 1.26354 11.4143 1.06569 11.5742 0.905762C11.7336 0.746459 11.931 0.666529 12.167 0.666504ZM2.16699 15.6665H13.834V7.3335H2.16699V15.6665ZM4.66699 12.3335C4.9031 12.3335 5.10172 12.4128 5.26172 12.5728C5.42115 12.7322 5.5 12.9304 5.5 13.1665C5.5 13.4026 5.42115 13.6008 5.26172 13.7603C5.10172 13.9203 4.9031 13.9995 4.66699 13.9995C4.43111 13.9995 4.23315 13.92 4.07324 13.7603C3.9138 13.6008 3.83399 13.4026 3.83398 13.1665C3.83398 12.9304 3.9138 12.7322 4.07324 12.5728C4.23315 12.413 4.43111 12.3335 4.66699 12.3335ZM8 12.3335C8.23604 12.3335 8.43475 12.4128 8.59473 12.5728C8.75417 12.7322 8.83398 12.9304 8.83398 13.1665C8.83398 13.4026 8.75417 13.6008 8.59473 13.7603C8.43475 13.9202 8.23604 13.9995 8 13.9995C7.76422 13.9994 7.56653 13.92 7.40723 13.7603C7.24723 13.6008 7.16699 13.4026 7.16699 13.1665C7.16699 12.9304 7.24723 12.7322 7.40723 12.5728C7.56653 12.413 7.76421 12.3336 8 12.3335ZM11.334 12.3335C11.5698 12.3335 11.7674 12.4131 11.9268 12.5728C12.0868 12.7322 12.167 12.9304 12.167 13.1665C12.167 13.4026 12.0868 13.6008 11.9268 13.7603C11.7674 13.9199 11.5698 13.9995 11.334 13.9995C11.0979 13.9995 10.8997 13.9202 10.7402 13.7603C10.5802 13.6008 10.5 13.4026 10.5 13.1665C10.5 12.9304 10.5802 12.7322 10.7402 12.5728C10.8997 12.4128 11.0979 12.3335 11.334 12.3335ZM4.66699 8.99951C4.9031 8.99951 5.10172 9.07933 5.26172 9.23877C5.42109 9.39875 5.5 9.59744 5.5 9.8335C5.49992 10.0693 5.42086 10.267 5.26172 10.4263C5.10172 10.5863 4.9031 10.6665 4.66699 10.6665C4.43095 10.6665 4.23321 10.5862 4.07324 10.4263C3.91387 10.2669 3.83406 10.0695 3.83398 9.8335C3.83398 9.59738 3.9138 9.39877 4.07324 9.23877C4.23317 9.07953 4.43106 8.99954 4.66699 8.99951ZM8 8.99951C8.23609 8.99951 8.43474 9.07936 8.59473 9.23877C8.75417 9.39877 8.83398 9.59738 8.83398 9.8335C8.83391 10.0694 8.75398 10.2669 8.59473 10.4263C8.43473 10.5863 8.23611 10.6665 8 10.6665C7.76408 10.6664 7.56657 10.5862 7.40723 10.4263C7.24734 10.2669 7.16707 10.0694 7.16699 9.8335C7.16699 9.59738 7.24723 9.39877 7.40723 9.23877C7.56654 9.07954 7.76417 8.99961 8 8.99951ZM11.334 8.99951C11.5699 8.99956 11.7674 9.07956 11.9268 9.23877C12.0868 9.39877 12.167 9.59738 12.167 9.8335C12.1669 10.0695 12.0867 10.2669 11.9268 10.4263C11.7674 10.5862 11.57 10.6665 11.334 10.6665C11.0979 10.6665 10.8997 10.5863 10.7402 10.4263C10.5805 10.2669 10.5001 10.0694 10.5 9.8335C10.5 9.59738 10.5802 9.39877 10.7402 9.23877C10.8997 9.07933 11.0979 8.99951 11.334 8.99951ZM2.16699 5.6665H13.834V3.99951H2.16699V5.6665Z" fill="#686D78"/>
        </svg>
    );
};

export default Icon;
