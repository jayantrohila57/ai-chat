const getTimestamp = (): string => {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "short",
    timeStyle: "short",
  })
    .format(new Date())
    .toUpperCase();
};

export { getTimestamp };
