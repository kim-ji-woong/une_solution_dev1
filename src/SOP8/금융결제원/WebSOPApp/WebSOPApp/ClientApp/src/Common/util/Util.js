export const valueSet = (target) => {
    if (target === undefined) return target;

    // 배열인 경우
    if (Array.isArray(target)) {
        return target
            .map((item) => {
                if (typeof item === 'number') {
                return `${item / 16}rem`;
                }
                return item; // string 그대로
            })
            .join(' ');
    }

    // 단일 값인 경우
    if (typeof target === 'number') {
        return `${target / 16}rem`;
    }

  return target; // 문자열 등은 그대로 반환
};

export const getColorFromPath = (path, colorMap) => {
    if (!path || typeof path !== 'string') return undefined;

    const keys = path.split('.');
    let result = colorMap;

    for (const key of keys) {
        if (result?.[key] === undefined) return undefined;
        result = result[key];
    }

    return result;
};