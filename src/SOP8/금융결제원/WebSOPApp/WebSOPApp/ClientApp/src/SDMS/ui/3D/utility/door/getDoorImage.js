import { DOOR_IMAGE_MAP } from './doorImageMap';

export function getDoorImage({ type, opened, level }) {
    const state = opened ? 'opened' : 'closed';

    return (
        DOOR_IMAGE_MAP[type]?.[state]?.[level]
        ?? DOOR_IMAGE_MAP[type]?.[state]?.normal
        ?? DOOR_IMAGE_MAP.default?.[state]?.normal
        ?? null
    );
}