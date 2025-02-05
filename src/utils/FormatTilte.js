const formatTitle = (title) => {
    return title
        .replace(/_/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());
};

export default formatTitle;